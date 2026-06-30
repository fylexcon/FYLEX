import type { Platform } from './platform';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type UserProfile = {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  region?: string | null;
};

export type PlatformAccountDto = {
  id: string;
  platform: Platform;
  externalUserId: string;
  handle: string;
  avatarUrl?: string | null;
  profileUrl?: string | null;
  linkedAt: string;
  lastSyncAt?: string | null;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'failed';
};

export type GameDto = {
  id: string;
  slug: string;
  title: string;
  coverUrl?: string | null;
  genres: string[];
  modes: string[];
  crossplayPlatforms: Platform[];
};

export type LibraryItemDto = {
  id: string;
  game: GameDto;
  platform: Platform;
  playtimeMinutes: number;
  lastPlayedAt?: string | null;
  achievementSummary: {
    unlocked: number;
    total: number;
  };
};

export type LfgPostDto = {
  id: string;
  game: GameDto;
  creator: Pick<UserProfile, 'id' | 'username' | 'displayName' | 'avatarUrl'>;
  platform: Platform;
  region: string;
  language: string;
  skillBand: string;
  rolesNeeded: string[];
  playstyleTags: string[];
  startsAt: string;
  expiresAt: string;
  status: 'open' | 'filled' | 'expired' | 'cancelled';
};

export type DealWatchlistDto = {
  id: string;
  game: GameDto;
  targetPrice?: number | null;
  targetDiscount?: number | null;
  bestOffer?: PriceOfferDto | null;
};

export type PriceOfferDto = {
  id: string;
  platformStore: Platform | 'isthereanydeal';
  country: string;
  currency: string;
  regularPrice: number;
  salePrice: number;
  discountPercent: number;
  url: string;
  startsAt?: string | null;
  endsAt?: string | null;
  fetchedAt: string;
};
