import { Injectable } from '@nestjs/common';
import type { LibraryItemDto, Platform } from '@fylex/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LibraryService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string): Promise<LibraryItemDto[]> {
    const items = await this.prisma.libraryItem.findMany({
      where: {
        userId
      },
      include: {
        game: {
          include: {
            achievements: true
          }
        }
      },
      orderBy: {
        lastPlayedAt: 'desc'
      }
    });
    const gameIds = items.map((item) => item.gameId);
    const unlocks = await this.prisma.userAchievement.findMany({
      where: {
        userId,
        achievement: {
          gameId: {
            in: gameIds
          }
        }
      },
      include: {
        achievement: true
      }
    });
    const unlockedByGame = new Map<string, number>();

    for (const unlock of unlocks) {
      if (unlock.unlockedAt || unlock.progress >= 1) {
        unlockedByGame.set(unlock.achievement.gameId, (unlockedByGame.get(unlock.achievement.gameId) ?? 0) + 1);
      }
    }

    return items.map((item) => ({
      id: item.id,
      platform: item.platform as Platform,
      playtimeMinutes: item.playtimeMinutes,
      lastPlayedAt: item.lastPlayedAt?.toISOString() ?? null,
      game: {
        id: item.game.id,
        slug: item.game.slug,
        title: item.game.title,
        coverUrl: item.game.coverUrl,
        genres: item.game.genres,
        modes: item.game.modes,
        crossplayPlatforms: item.game.crossplayPlatforms as Platform[]
      },
      achievementSummary: {
        unlocked: unlockedByGame.get(item.gameId) ?? 0,
        total: item.game.achievements.length
      }
    }));
  }
}
