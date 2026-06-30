import type { DealWatchlistDto, LfgPostDto, LibraryItemDto, UserProfile } from '@fylex/shared';

export const mockUser: UserProfile = {
  id: 'demo-user',
  email: 'pilot@fylex.gg',
  username: 'fylexpilot',
  displayName: 'Fylex Pilot',
  avatarUrl: null,
  region: 'EU'
};

export const mockLibrary: LibraryItemDto[] = [
  {
    id: 'lib-cs2',
    platform: 'steam',
    playtimeMinutes: 18420,
    lastPlayedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    achievementSummary: {
      unlocked: 1,
      total: 2
    },
    game: {
      id: '00000000-0000-4000-8000-000000000730',
      slug: 'counter-strike-2',
      title: 'Counter-Strike 2',
      coverUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/730/library_600x900.jpg',
      genres: ['Shooter', 'Competitive'],
      modes: ['PvP', 'Ranked'],
      crossplayPlatforms: ['steam']
    }
  },
  {
    id: 'lib-apex',
    platform: 'steam',
    playtimeMinutes: 6420,
    lastPlayedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    achievementSummary: {
      unlocked: 1,
      total: 1
    },
    game: {
      id: '00000000-0000-4000-8000-000000117247',
      slug: 'apex-legends',
      title: 'Apex Legends',
      coverUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/1172470/library_600x900.jpg',
      genres: ['Battle Royale', 'Shooter'],
      modes: ['Squads', 'Ranked'],
      crossplayPlatforms: ['steam', 'ea']
    }
  },
  {
    id: 'lib-bg3',
    platform: 'steam',
    playtimeMinutes: 3920,
    lastPlayedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    achievementSummary: {
      unlocked: 1,
      total: 2
    },
    game: {
      id: '00000000-0000-4000-8000-000001086940',
      slug: 'baldurs-gate-3',
      title: 'Baldur\'s Gate 3',
      coverUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/1086940/library_600x900.jpg',
      genres: ['RPG', 'Co-op'],
      modes: ['Campaign', 'Co-op'],
      crossplayPlatforms: ['steam']
    }
  }
];

export const mockLfgPosts: LfgPostDto[] = [
  {
    id: 'lfg-cs2',
    game: mockLibrary[0].game,
    creator: {
      id: 'demo-rifler',
      username: 'rifttap',
      displayName: 'RiftTap',
      avatarUrl: null
    },
    platform: 'steam',
    region: 'EU',
    language: 'English',
    skillBand: 'Gold Nova - MG',
    rolesNeeded: ['Entry', 'Support'],
    playstyleTags: ['Ranked', 'Mic required', 'Chill comms'],
    startsAt: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    status: 'open'
  },
  {
    id: 'lfg-apex',
    game: mockLibrary[1].game,
    creator: {
      id: 'demo-igl',
      username: 'dropbeacon',
      displayName: 'Drop Beacon',
      avatarUrl: null
    },
    platform: 'steam',
    region: 'EU',
    language: 'Turkish',
    skillBand: 'Plat',
    rolesNeeded: ['Anchor'],
    playstyleTags: ['Ranked', 'Rotations', 'No rage'],
    startsAt: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    status: 'open'
  }
];

export const mockDeals: DealWatchlistDto[] = [
  {
    id: 'deal-bg3',
    game: mockLibrary[2].game,
    targetPrice: 39.99,
    targetDiscount: 30,
    bestOffer: {
      id: 'offer-bg3',
      platformStore: 'steam',
      country: 'US',
      currency: 'USD',
      regularPrice: 59.99,
      salePrice: 47.99,
      discountPercent: 20,
      url: 'https://store.steampowered.com/app/1086940',
      startsAt: null,
      endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      fetchedAt: new Date().toISOString()
    }
  },
  {
    id: 'deal-apex',
    game: mockLibrary[1].game,
    targetPrice: 0,
    targetDiscount: 100,
    bestOffer: {
      id: 'offer-apex',
      platformStore: 'steam',
      country: 'US',
      currency: 'USD',
      regularPrice: 0,
      salePrice: 0,
      discountPercent: 100,
      url: 'https://store.steampowered.com/app/1172470',
      startsAt: null,
      endsAt: null,
      fetchedAt: new Date().toISOString()
    }
  }
];

export const mockMessages = [
  {
    id: 'msg-1',
    sender: 'RiftTap',
    body: 'Need one calm support for Mirage and Ancient.',
    createdAt: '20:14'
  },
  {
    id: 'msg-2',
    sender: 'You',
    body: 'I can join after warmup.',
    createdAt: '20:16'
  }
];
