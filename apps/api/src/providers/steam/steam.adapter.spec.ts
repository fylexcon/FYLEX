import { ConfigService } from '@nestjs/config';
import { SteamAdapter } from './steam.adapter';

describe('SteamAdapter', () => {
  it('falls back to mock data when no Steam API key is configured', async () => {
    const config = {
      get: (key: string) => (key === 'STEAM_USE_MOCKS' ? 'true' : undefined)
    } as ConfigService;
    const adapter = new SteamAdapter(config);

    await expect(adapter.getOwnedGames({ externalUserId: '76561198000000000' })).resolves.toHaveLength(3);
    await expect(adapter.getAchievements({ externalUserId: '76561198000000000' }, '730')).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          externalId: 'win_match'
        })
      ])
    );
  });
});
