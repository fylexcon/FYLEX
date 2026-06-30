import { Module } from '@nestjs/common';
import { ProviderRegistry } from './provider.registry';
import { SteamAdapter } from './steam/steam.adapter';

@Module({
  providers: [SteamAdapter, ProviderRegistry],
  exports: [ProviderRegistry, SteamAdapter]
})
export class ProvidersModule {}
