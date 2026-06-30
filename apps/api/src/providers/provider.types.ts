import type { Platform } from '@fylex/shared';

export type ProviderAccountRef = {
  externalUserId: string;
  handle?: string;
};

export type ProviderProfile = {
  externalUserId: string;
  handle: string;
  avatarUrl?: string | null;
  profileUrl?: string | null;
};

export type ProviderGame = {
  externalGameId: string;
  title: string;
  coverUrl?: string | null;
  playtimeMinutes: number;
  lastPlayedAt?: string | null;
  genres: string[];
  modes: string[];
  crossplayPlatforms: Platform[];
};

export type ProviderAchievement = {
  externalId: string;
  name: string;
  description?: string | null;
  iconUrl?: string | null;
  hidden?: boolean;
  rarityPercent?: number | null;
  unlockedAt?: string | null;
  progress: number;
};

export type ProviderFriend = {
  externalFriendId: string;
  friendSince?: string | null;
};

export interface ProviderAdapter {
  readonly platform: Platform;
  readonly supportsSync: boolean;
  getProfile(account: ProviderAccountRef): Promise<ProviderProfile>;
  getOwnedGames(account: ProviderAccountRef): Promise<ProviderGame[]>;
  getAchievements(account: ProviderAccountRef, externalGameId: string): Promise<ProviderAchievement[]>;
  getFriends(account: ProviderAccountRef): Promise<ProviderFriend[]>;
}
