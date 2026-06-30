import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ProviderAccountRef, ProviderAdapter, ProviderAchievement, ProviderFriend, ProviderGame, ProviderProfile } from '../provider.types';
import { mockSteamAchievements, mockSteamFriends, mockSteamGames, mockSteamProfile } from './mock-steam.fixtures';

@Injectable()
export class SteamAdapter implements ProviderAdapter {
  readonly platform = 'steam' as const;
  readonly supportsSync = true;

  constructor(private readonly config: ConfigService) {}

  async getProfile(account: ProviderAccountRef): Promise<ProviderProfile> {
    if (this.shouldUseMocks()) {
      return {
        ...mockSteamProfile,
        externalUserId: account.externalUserId || mockSteamProfile.externalUserId
      };
    }

    const data = await this.fetchSteam<{ response: { players: Array<{ steamid: string; personaname: string; avatarfull?: string; profileurl?: string }> } }>(
      'ISteamUser/GetPlayerSummaries/v0002/',
      {
        steamids: account.externalUserId
      }
    );
    const player = data.response.players[0];

    return {
      externalUserId: player.steamid,
      handle: player.personaname,
      avatarUrl: player.avatarfull ?? null,
      profileUrl: player.profileurl ?? null
    };
  }

  async getOwnedGames(account: ProviderAccountRef): Promise<ProviderGame[]> {
    if (this.shouldUseMocks()) {
      return mockSteamGames;
    }

    const data = await this.fetchSteam<{
      response: {
        games?: Array<{
          appid: number;
          name?: string;
          playtime_forever?: number;
          rtime_last_played?: number;
        }>;
      };
    }>('IPlayerService/GetOwnedGames/v0001/', {
      steamid: account.externalUserId,
      include_appinfo: 'true',
      include_played_free_games: 'true',
      format: 'json'
    });

    return (data.response.games ?? []).map((game) => ({
      externalGameId: String(game.appid),
      title: game.name ?? `Steam App ${game.appid}`,
      coverUrl: `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/library_600x900.jpg`,
      playtimeMinutes: game.playtime_forever ?? 0,
      lastPlayedAt: game.rtime_last_played ? new Date(game.rtime_last_played * 1000).toISOString() : null,
      genres: [],
      modes: [],
      crossplayPlatforms: ['steam']
    }));
  }

  async getAchievements(account: ProviderAccountRef, externalGameId: string): Promise<ProviderAchievement[]> {
    if (this.shouldUseMocks()) {
      return mockSteamAchievements[externalGameId] ?? [];
    }

    const data = await this.fetchSteam<{
      playerstats?: {
        achievements?: Array<{
          apiname: string;
          name?: string;
          description?: string;
          achieved?: number;
          unlocktime?: number;
        }>;
      };
    }>('ISteamUserStats/GetPlayerAchievements/v0001/', {
      steamid: account.externalUserId,
      appid: externalGameId,
      l: 'en',
      format: 'json'
    });

    return (data.playerstats?.achievements ?? []).map((achievement) => ({
      externalId: achievement.apiname,
      name: achievement.name ?? achievement.apiname,
      description: achievement.description ?? null,
      iconUrl: null,
      hidden: false,
      rarityPercent: null,
      progress: achievement.achieved ? 1 : 0,
      unlockedAt: achievement.unlocktime ? new Date(achievement.unlocktime * 1000).toISOString() : null
    }));
  }

  async getFriends(account: ProviderAccountRef): Promise<ProviderFriend[]> {
    if (this.shouldUseMocks()) {
      return mockSteamFriends;
    }

    const data = await this.fetchSteam<{
      friendslist?: {
        friends?: Array<{
          steamid: string;
          friend_since?: number;
        }>;
      };
    }>('ISteamUser/GetFriendList/v0001/', {
      steamid: account.externalUserId,
      relationship: 'friend',
      format: 'json'
    });

    return (data.friendslist?.friends ?? []).map((friend) => ({
      externalFriendId: friend.steamid,
      friendSince: friend.friend_since ? new Date(friend.friend_since * 1000).toISOString() : null
    }));
  }

  private shouldUseMocks() {
    return this.config.get<string>('STEAM_USE_MOCKS') === 'true' || !this.config.get<string>('STEAM_API_KEY');
  }

  private async fetchSteam<T>(path: string, params: Record<string, string>) {
    const key = this.config.get<string>('STEAM_API_KEY');
    const url = new URL(`https://api.steampowered.com/${path}`);

    if (key) {
      url.searchParams.set('key', key);
    }

    for (const [name, value] of Object.entries(params)) {
      url.searchParams.set(name, value);
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Steam API request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  }
}
