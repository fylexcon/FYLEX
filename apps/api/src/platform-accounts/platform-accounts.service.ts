import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Platform, PlatformAccountDto } from '@fylex/shared';
import { PrismaService } from '../prisma/prisma.service';
import { ProviderRegistry } from '../providers/provider.registry';
import type { ProviderGame } from '../providers/provider.types';
import { mockSteamProfile } from '../providers/steam/mock-steam.fixtures';

@Injectable()
export class PlatformAccountsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly providers: ProviderRegistry
  ) {}

  async list(userId: string): Promise<PlatformAccountDto[]> {
    const accounts = await this.prisma.platformAccount.findMany({
      where: {
        userId
      },
      orderBy: {
        linkedAt: 'desc'
      }
    });

    return accounts.map((account) => ({
      id: account.id,
      platform: account.platform as Platform,
      externalUserId: account.externalUserId,
      handle: account.handle,
      avatarUrl: account.avatarUrl,
      profileUrl: account.profileUrl,
      linkedAt: account.linkedAt.toISOString(),
      lastSyncAt: account.lastSyncAt?.toISOString() ?? null,
      syncStatus: account.syncStatus
    }));
  }

  async linkMock(userId: string, platform: Platform, body: { externalUserId?: string; handle?: string }) {
    const externalUserId = body.externalUserId ?? (platform === 'steam' ? mockSteamProfile.externalUserId : `${platform}-${userId.slice(0, 8)}`);
    const adapter = this.providers.get(platform);
    const profile = await adapter.getProfile({
      externalUserId,
      handle: body.handle
    });

    const account = await this.prisma.platformAccount.upsert({
      where: {
        platform_externalUserId: {
          platform,
          externalUserId
        }
      },
      update: {
        userId,
        handle: profile.handle,
        avatarUrl: profile.avatarUrl,
        profileUrl: profile.profileUrl,
        metadataJson: {
          mockLinked: true,
          unsupported: !adapter.supportsSync
        }
      },
      create: {
        userId,
        platform,
        externalUserId,
        handle: profile.handle,
        avatarUrl: profile.avatarUrl,
        profileUrl: profile.profileUrl,
        metadataJson: {
          mockLinked: true,
          unsupported: !adapter.supportsSync
        }
      }
    });

    return account;
  }

  async sync(userId: string, platformAccountId: string) {
    const account = await this.prisma.platformAccount.findFirst({
      where: {
        id: platformAccountId,
        userId
      }
    });

    if (!account) {
      throw new NotFoundException('Platform account not found');
    }

    const platform = account.platform as Platform;
    const adapter = this.providers.get(platform);

    if (!adapter.supportsSync) {
      throw new BadRequestException(`${platform} sync is not supported in this milestone`);
    }

    const syncJob = await this.prisma.syncJob.create({
      data: {
        platformAccountId,
        jobType: 'manual_sync',
        status: 'syncing',
        startedAt: new Date()
      }
    });

    await this.prisma.platformAccount.update({
      where: {
        id: platformAccountId
      },
      data: {
        syncStatus: 'syncing'
      }
    });

    try {
      const profile = await adapter.getProfile({
        externalUserId: account.externalUserId,
        handle: account.handle
      });
      const games = await adapter.getOwnedGames(profile);

      for (const providerGame of games) {
        const game = await this.upsertGame(platform, providerGame);

        await this.prisma.libraryItem.upsert({
          where: {
            userId_platformAccountId_gameId_platform: {
              userId,
              platformAccountId,
              gameId: game.id,
              platform
            }
          },
          update: {
            playtimeMinutes: providerGame.playtimeMinutes,
            lastPlayedAt: providerGame.lastPlayedAt ? new Date(providerGame.lastPlayedAt) : null,
            sourceVisibility: 'linked'
          },
          create: {
            userId,
            platformAccountId,
            gameId: game.id,
            platform,
            playtimeMinutes: providerGame.playtimeMinutes,
            lastPlayedAt: providerGame.lastPlayedAt ? new Date(providerGame.lastPlayedAt) : null,
            sourceVisibility: 'linked'
          }
        });

        const achievements = await adapter.getAchievements(profile, providerGame.externalGameId);

        for (const providerAchievement of achievements) {
          const achievement = await this.prisma.achievement.upsert({
            where: {
              gameId_platform_externalId: {
                gameId: game.id,
                platform,
                externalId: providerAchievement.externalId
              }
            },
            update: {
              name: providerAchievement.name,
              description: providerAchievement.description,
              iconUrl: providerAchievement.iconUrl,
              hidden: providerAchievement.hidden ?? false,
              rarityPercent: providerAchievement.rarityPercent
            },
            create: {
              gameId: game.id,
              platform,
              externalId: providerAchievement.externalId,
              name: providerAchievement.name,
              description: providerAchievement.description,
              iconUrl: providerAchievement.iconUrl,
              hidden: providerAchievement.hidden ?? false,
              rarityPercent: providerAchievement.rarityPercent
            }
          });

          if (providerAchievement.progress > 0 || providerAchievement.unlockedAt) {
            await this.prisma.userAchievement.upsert({
              where: {
                userId_platformAccountId_achievementId: {
                  userId,
                  platformAccountId,
                  achievementId: achievement.id
                }
              },
              update: {
                progress: providerAchievement.progress,
                unlockedAt: providerAchievement.unlockedAt ? new Date(providerAchievement.unlockedAt) : null
              },
              create: {
                userId,
                platformAccountId,
                achievementId: achievement.id,
                progress: providerAchievement.progress,
                unlockedAt: providerAchievement.unlockedAt ? new Date(providerAchievement.unlockedAt) : null
              }
            });
          }
        }
      }

      const friends = await adapter.getFriends(profile);

      for (const friend of friends) {
        await this.prisma.platformFriendEdge.upsert({
          where: {
            platformAccountId_platform_externalFriendId: {
              platformAccountId,
              platform,
              externalFriendId: friend.externalFriendId
            }
          },
          update: {
            friendSince: friend.friendSince ? new Date(friend.friendSince) : null
          },
          create: {
            platformAccountId,
            platform,
            externalFriendId: friend.externalFriendId,
            friendSince: friend.friendSince ? new Date(friend.friendSince) : null
          }
        });
      }

      const updated = await this.prisma.platformAccount.update({
        where: {
          id: platformAccountId
        },
        data: {
          handle: profile.handle,
          avatarUrl: profile.avatarUrl,
          profileUrl: profile.profileUrl,
          lastSyncAt: new Date(),
          syncStatus: 'synced'
        }
      });

      await this.prisma.syncJob.update({
        where: {
          id: syncJob.id
        },
        data: {
          status: 'synced',
          finishedAt: new Date()
        }
      });

      return {
        accountId: updated.id,
        syncedGames: games.length,
        syncedFriends: friends.length,
        status: updated.syncStatus
      };
    } catch (error) {
      await this.prisma.platformAccount.update({
        where: {
          id: platformAccountId
        },
        data: {
          syncStatus: 'failed'
        }
      });
      await this.prisma.syncJob.update({
        where: {
          id: syncJob.id
        },
        data: {
          status: 'failed',
          finishedAt: new Date()
        }
      });
      throw error;
    }
  }

  private async upsertGame(platform: Platform, providerGame: ProviderGame) {
    const existingExternal = await this.prisma.gameExternalId.findUnique({
      where: {
        platform_externalId: {
          platform,
          externalId: providerGame.externalGameId
        }
      },
      include: {
        game: true
      }
    });

    if (existingExternal) {
      return this.prisma.game.update({
        where: {
          id: existingExternal.gameId
        },
        data: {
          title: providerGame.title,
          normalizedTitle: providerGame.title.toLowerCase(),
          coverUrl: providerGame.coverUrl,
          genres: providerGame.genres,
          modes: providerGame.modes,
          crossplayPlatforms: providerGame.crossplayPlatforms
        }
      });
    }

    const game = await this.prisma.game.upsert({
      where: {
        slug: this.slugify(providerGame.title)
      },
      update: {
        title: providerGame.title,
        normalizedTitle: providerGame.title.toLowerCase(),
        coverUrl: providerGame.coverUrl,
        genres: providerGame.genres,
        modes: providerGame.modes,
        crossplayPlatforms: providerGame.crossplayPlatforms
      },
      create: {
        slug: this.slugify(providerGame.title),
        title: providerGame.title,
        normalizedTitle: providerGame.title.toLowerCase(),
        coverUrl: providerGame.coverUrl,
        genres: providerGame.genres,
        modes: providerGame.modes,
        crossplayPlatforms: providerGame.crossplayPlatforms
      }
    });

    await this.prisma.gameExternalId.create({
      data: {
        gameId: game.id,
        platform,
        externalId: providerGame.externalGameId,
        storeUrl: platform === 'steam' ? `https://store.steampowered.com/app/${providerGame.externalGameId}` : null,
        confidence: 1
      }
    });

    return game;
  }

  private slugify(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
