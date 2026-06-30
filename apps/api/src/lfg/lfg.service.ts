import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateLfgPostInput, LfgPostDto, Platform } from '@fylex/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LfgService {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<LfgPostDto[]> {
    const posts = await this.prisma.lfgPost.findMany({
      where: {
        status: 'open',
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        game: true,
        creator: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        }
      },
      orderBy: {
        startsAt: 'asc'
      },
      take: 50
    });

    return posts.map((post) => this.toDto(post));
  }

  async create(userId: string, input: CreateLfgPostInput): Promise<LfgPostDto> {
    const game = await this.prisma.game.findUnique({
      where: {
        id: input.gameId
      }
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const post = await this.prisma.lfgPost.create({
      data: {
        creatorId: userId,
        gameId: input.gameId,
        platform: input.platform,
        region: input.region,
        language: input.language,
        skillBand: input.skillBand,
        rolesNeeded: input.rolesNeeded,
        playstyleTags: input.playstyleTags,
        startsAt: new Date(input.startsAt),
        expiresAt: new Date(input.expiresAt)
      },
      include: {
        game: true,
        creator: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        }
      }
    });

    return this.toDto(post);
  }

  private toDto(post: {
    id: string;
    platform: Platform;
    region: string;
    language: string;
    skillBand: string;
    rolesNeeded: string[];
    playstyleTags: string[];
    startsAt: Date;
    expiresAt: Date;
    status: 'open' | 'filled' | 'expired' | 'cancelled';
    game: {
      id: string;
      slug: string;
      title: string;
      coverUrl: string | null;
      genres: string[];
      modes: string[];
      crossplayPlatforms: Platform[];
    };
    creator: {
      id: string;
      username: string;
      displayName: string;
      avatarUrl: string | null;
    };
  }): LfgPostDto {
    return {
      id: post.id,
      platform: post.platform,
      region: post.region,
      language: post.language,
      skillBand: post.skillBand,
      rolesNeeded: post.rolesNeeded,
      playstyleTags: post.playstyleTags,
      startsAt: post.startsAt.toISOString(),
      expiresAt: post.expiresAt.toISOString(),
      status: post.status,
      creator: post.creator,
      game: {
        id: post.game.id,
        slug: post.game.slug,
        title: post.game.title,
        coverUrl: post.game.coverUrl,
        genres: post.game.genres,
        modes: post.game.modes,
        crossplayPlatforms: post.game.crossplayPlatforms
      }
    };
  }
}
