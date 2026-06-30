import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { Card } from './Card';
import { Text } from './Text';

export function MetricCard({ label, value, accent = colors.cyan }: { label: string; value: string; accent?: string }) {
  return (
    <Card style={styles.card}>
      <View style={[styles.bar, { backgroundColor: accent }]} />
      <Text variant="title">{value}</Text>
      <Text variant="caption" muted>
        {label}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 102,
    gap: spacing.sm
  },
  bar: {
    width: 28,
    height: 3,
    borderRadius: 2
  }
});
