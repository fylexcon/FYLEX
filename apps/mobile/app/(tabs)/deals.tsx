import { useQuery } from '@tanstack/react-query';
import { Bell, TrendingDown } from 'lucide-react-native';
import { Image, Linking, Pressable, StyleSheet, View } from 'react-native';
import type { DealWatchlistDto } from '@fylex/shared';
import { apiRequest } from '@/api/client';
import { Card } from '@/components/Card';
import { PlatformChip } from '@/components/PlatformChip';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { mockDeals } from '@/data/mock';
import { useSessionStore } from '@/state/session-store';
import { colors, radii, spacing } from '@/theme';

export default function DealsScreen() {
  const token = useSessionStore((state) => state.tokens?.accessToken);
  const dealsQuery = useQuery({
    queryKey: ['deals-watchlist'],
    enabled: Boolean(token),
    queryFn: () => apiRequest<DealWatchlistDto[]>('/deals/watchlist')
  });
  const deals = dealsQuery.data?.length ? dealsQuery.data : mockDeals;

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text variant="caption" muted>
            Price intelligence
          </Text>
          <Text variant="title">Deals</Text>
        </View>
        <View style={styles.bell}>
          <Bell color={colors.amber} size={20} />
        </View>
      </View>

      {deals.map((deal) => (
        <Pressable key={deal.id} onPress={() => deal.bestOffer?.url && Linking.openURL(deal.bestOffer.url)}>
          <Card style={styles.deal}>
            <Image source={{ uri: deal.game.coverUrl ?? undefined }} style={styles.cover} />
            <View style={styles.content}>
              <View>
                <Text variant="heading" numberOfLines={1}>
                  {deal.game.title}
                </Text>
                {deal.bestOffer && <PlatformChip platform={deal.bestOffer.platformStore === 'isthereanydeal' ? 'steam' : deal.bestOffer.platformStore} />}
              </View>

              <View style={styles.priceRow}>
                <View style={styles.discount}>
                  <TrendingDown color={colors.lime} size={18} />
                  <Text variant="heading" style={styles.discountText}>
                    -{deal.bestOffer?.discountPercent ?? deal.targetDiscount ?? 0}%
                  </Text>
                </View>
                <View>
                  <Text variant="heading">
                    {deal.bestOffer ? `${deal.bestOffer.currency} ${deal.bestOffer.salePrice.toFixed(2)}` : 'Watching'}
                  </Text>
                  <Text variant="caption" muted>
                    Target {deal.targetDiscount ?? 0}% / {deal.targetPrice ? `$${deal.targetPrice}` : 'any price'}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md
  },
  bell: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.sm,
    backgroundColor: colors.surface
  },
  deal: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md
  },
  cover: {
    width: 78,
    height: 102,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceHigh
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    gap: spacing.md
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md
  },
  discount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radii.sm,
    backgroundColor: '#172B1D',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  discountText: {
    color: colors.lime
  }
});
