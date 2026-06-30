import { Injectable, NotFoundException } from '@nestjs/common';
import type { UserProfile } from '@fylex/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string): Promise<UserProfile> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null
      },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        region: true
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
