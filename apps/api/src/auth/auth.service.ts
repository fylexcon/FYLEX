import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { AuthTokens, RegisterInput, LoginInput, UserProfile } from '@fylex/shared';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly password: PasswordService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  async register(input: RegisterInput): Promise<{ user: UserProfile; tokens: AuthTokens }> {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: input.email.toLowerCase() }, { username: input.username }]
      }
    });

    if (existing) {
      throw new ConflictException('Email or username is already in use');
    }

    const passwordHash = await this.password.hash(input.password);
    const user = await this.prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        username: input.username,
        displayName: input.displayName,
        passwordHash,
        privacy: {
          create: {}
        }
      }
    });

    return {
      user: this.toProfile(user),
      tokens: await this.issueTokens(user.id)
    };
  }

  async login(input: LoginInput): Promise<{ user: UserProfile; tokens: AuthTokens }> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: input.email.toLowerCase(),
        deletedAt: null
      }
    });

    if (!user || !(await this.password.verify(input.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      user: this.toProfile(user),
      tokens: await this.issueTokens(user.id)
    };
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const sessions = await this.prisma.refreshSession.findMany({
      where: {
        revokedAt: null,
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 25
    });

    for (const session of sessions) {
      if (await this.password.verify(refreshToken, session.tokenHash)) {
        await this.prisma.refreshSession.update({
          where: {
            id: session.id
          },
          data: {
            revokedAt: new Date()
          }
        });
        return this.issueTokens(session.userId);
      }
    }

    throw new UnauthorizedException('Invalid refresh token');
  }

  private async issueTokens(userId: string): Promise<AuthTokens> {
    const accessToken = await this.jwt.signAsync(
      {
        sub: userId
      },
      {
        secret: this.config.get<string>('JWT_ACCESS_SECRET') ?? 'dev-access-secret',
        expiresIn: this.config.get<string>('ACCESS_TOKEN_TTL') ?? '15m'
      }
    );
    const refreshToken = `${randomUUID()}.${randomUUID()}`;
    const refreshDays = Number(this.config.get<string>('REFRESH_TOKEN_TTL_DAYS') ?? 30);

    await this.prisma.refreshSession.create({
      data: {
        userId,
        tokenHash: await this.password.hash(refreshToken),
        expiresAt: new Date(Date.now() + refreshDays * 24 * 60 * 60 * 1000)
      }
    });

    return {
      accessToken,
      refreshToken
    };
  }

  private toProfile(user: {
    id: string;
    email: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    region: string | null;
  }): UserProfile {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      region: user.region
    };
  }
}
