import { Image, StyleSheet, View } from 'react-native';
import type { LibraryItemDto } from '@fylex/shared';
import { colors, radii, spacing } from '@/theme';
import { Card } from './Card';
import { PlatformChip } from './PlatformChip';
import { Text } from './Text';

export function GameCard({ item }: { item: LibraryItemDto }) {
  const hours = Math.round(item.playtimeMinutes / 60);
  const completion =
    item.achievementSummary.total > 0
      ? Math.round((item.achievementSummary.unlocked / item.achievementSummary.total) * 100)
      : 0;

  return (
    <Card style={styles.card}>
      <Image source={{ uri: item.game.coverUrl ?? undefined }} style={styles.cover} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="heading" numberOfLines={2} style={styles.title}>
            {item.game.title}
          </Text>
          <PlatformChip platform={item.platform} />
        </View>
        <View style={styles.metaRow}>
          <Text variant="caption" muted>
            {hours}h played
          </Text>
          <Text variant="caption" muted>
            {completion}% complete
          </Text>
        </View>
        <View style={styles.tags}>
          {item.game.genres.slice(0, 3).map((genre) => (
            <View key={genre} style={styles.tag}>
              <Text variant="caption">{genre}</Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md
  },
  cover: {
    width: 88,
    height: 118,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceHigh
  },
  content: {
    flex: 1,
    minHeight: 118,
    justifyContent: 'space-between'
  },
  header: {
    gap: spacing.sm
  },
  title: {
    fontSize: 18,
    lineHeight: 22
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  tag: {
    backgroundColor: colors.surfaceHigh,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  }
});
