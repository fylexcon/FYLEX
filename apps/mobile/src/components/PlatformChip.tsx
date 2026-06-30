import { StyleSheet, View } from 'react-native';
import { platformAccentColors, platformLabels, type Platform } from '@fylex/shared';
import { colors, radii, spacing } from '@/theme';
import { Text } from './Text';

export function PlatformChip({ platform }: { platform: Platform }) {
  return (
    <View style={[styles.chip, { borderColor: platformAccentColors[platform] }]}>
      <View style={[styles.dot, { backgroundColor: platformAccentColors[platform] }]} />
      <Text variant="caption">{platformLabels[platform]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 28,
    borderRadius: radii.sm,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.bgAlt
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4
  }
});
