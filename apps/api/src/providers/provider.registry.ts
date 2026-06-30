import { Injectable } from '@nestjs/common';
import type { Platform } from '@fylex/shared';
import type { ProviderAdapter } from './provider.types';
import { SteamAdapter } from './steam/steam.adapter';
import { UnsupportedProviderAdapter } from './unsupported.adapter';

@Injectable()
export class ProviderRegistry {
  constructor(private readonly steam: SteamAdapter) {}

  get(platform: Platform): ProviderAdapter {
    if (platform === 'steam') {
      return this.steam;
    }

    return new UnsupportedProviderAdapter(platform);
  }
}
