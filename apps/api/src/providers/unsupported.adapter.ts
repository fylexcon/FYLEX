import { BadRequestException, Injectable } from '@nestjs/common';
import type { Platform } from '@fylex/shared';
import type { ProviderAccountRef, ProviderAchievement, ProviderAdapter, ProviderFriend, ProviderGame } from './provider.types';

@Injectable()
export class UnsupportedProviderAdapter implements ProviderAdapter {
  readonly supportsSync = false;

  constructor(readonly platform: Platform) {}

  async getProfile(account: ProviderAccountRef) {
    return {
      externalUserId: account.externalUserId,
      handle: account.handle ?? `${this.platform} account`,
      avatarUrl: null,
      profileUrl: null
    };
  }

  async getOwnedGames(_account: ProviderAccountRef): Promise<ProviderGame[]> {
    throw new BadRequestException(`${this.platform} sync requires official partner API access`);
  }

  async getAchievements(_account: ProviderAccountRef, _externalGameId: string): Promise<ProviderAchievement[]> {
    throw new BadRequestException(`${this.platform} achievements require official partner API access`);
  }

  async getFriends(_account: ProviderAccountRef): Promise<ProviderFriend[]> {
    throw new BadRequestException(`${this.platform} friends require official partner API access`);
  }
}
