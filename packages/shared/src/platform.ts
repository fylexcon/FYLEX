export const platforms = ['steam', 'epic', 'riot', 'ea', 'ubisoft'] as const;

export type Platform = (typeof platforms)[number];

export const platformLabels: Record<Platform, string> = {
  steam: 'Steam',
  epic: 'Epic Games',
  riot: 'Riot',
  ea: 'EA',
  ubisoft: 'Ubisoft'
};

export const platformAccentColors: Record<Platform, string> = {
  steam: '#66C0F4',
  epic: '#F5F5F5',
  riot: '#D13639',
  ea: '#FF4747',
  ubisoft: '#00A3FF'
};
