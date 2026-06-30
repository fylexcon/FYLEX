import type { ProviderAchievement, ProviderFriend, ProviderGame, ProviderProfile } from '../provider.types';

export const mockSteamProfile: ProviderProfile = {
  externalUserId: '76561198000000000',
  handle: 'FylexPilot',
  avatarUrl: 'https://avatars.akamai.steamstatic.com/0000000000000000000000000000000000000000_full.jpg',
  profileUrl: 'https://steamcommunity.com/id/fylexpilot'
};

export const mockSteamGames: ProviderGame[] = [
  {
    externalGameId: '730',
    title: 'Counter-Strike 2',
    coverUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/730/library_600x900.jpg',
    playtimeMinutes: 18420,
    lastPlayedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    genres: ['Shooter', 'Competitive'],
    modes: ['PvP', 'Ranked'],
    crossplayPlatforms: ['steam']
  },
  {
    externalGameId: '1172470',
    title: 'Apex Legends',
    coverUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/1172470/library_600x900.jpg',
    playtimeMinutes: 6420,
    lastPlayedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    genres: ['Battle Royale', 'Shooter'],
    modes: ['Squads', 'Ranked'],
    crossplayPlatforms: ['steam', 'ea']
  },
  {
    externalGameId: '1086940',
    title: 'Baldur\'s Gate 3',
    coverUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/1086940/library_600x900.jpg',
    playtimeMinutes: 3920,
    lastPlayedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    genres: ['RPG', 'Co-op'],
    modes: ['Campaign', 'Co-op'],
    crossplayPlatforms: ['steam']
  }
];

export const mockSteamAchievements: Record<string, ProviderAchievement[]> = {
  '730': [
    {
      externalId: 'win_match',
      name: 'First Victory',
      description: 'Win your first match.',
      iconUrl: null,
      progress: 1,
      unlockedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      externalId: 'ace_round',
      name: 'Clean Sweep',
      description: 'Eliminate the enemy team in one round.',
      iconUrl: null,
      progress: 0.4,
      unlockedAt: null
    }
  ],
  '1172470': [
    {
      externalId: 'jumpmaster',
      name: 'Jumpmaster',
      description: 'Lead your squad into battle.',
      iconUrl: null,
      progress: 1,
      unlockedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  '1086940': [
    {
      externalId: 'escape_nautiloid',
      name: 'Descent From Avernus',
      description: 'Take control of the nautiloid and escape the Hells.',
      iconUrl: null,
      progress: 1,
      unlockedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      externalId: 'long_rest',
      name: 'Bedrolls and Breakfast',
      description: 'Take four full long rests in a single campaign.',
      iconUrl: null,
      progress: 0.75,
      unlockedAt: null
    }
  ]
};

export const mockSteamFriends: ProviderFriend[] = [
  {
    externalFriendId: '76561198000000001',
    friendSince: new Date(Date.now() - 540 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    externalFriendId: '76561198000000002',
    friendSince: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString()
  }
];
