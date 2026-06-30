import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Link2, RefreshCw, ShieldCheck } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import type { LibraryItemDto, PlatformAccountDto, UserProfile } from '@fylex/shared';
import { apiRequest } from '@/api/client';
import { ActionButton } from '@/components/ActionButton';
import { Card } from '@/components/Card';
import { MetricCard } from '@/components/MetricCard';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { mockLibrary, mockUser } from '@/data/mock';
import { useSessionStore } from '@/state/session-store';
import { colors, spacing } from '@/theme';

export default function HomeScreen() {
  const token = useSessionStore((state) => state.tokens?.accessToken);
  const localUser = useSessionStore((state) => state.user);
  const queryClient = useQueryClient();
  const profileQuery = useQuery({
    queryKey: ['me'],
    enabled: Boolean(token),
    queryFn: () => apiRequest<UserProfile>('/me')
  });
  const libraryQuery = useQuery({
    queryKey: ['library'],
    enabled: Boolean(token),
    queryFn: () => apiRequest<LibraryItemDto[]>('/library')
  });
  const accountsQuery = useQuery({
    queryKey: ['platform-accounts'],
    enabled: Boolean(token),
    queryFn: () => apiRequest<PlatformAccountDto[]>('/platform-accounts')
  });
  const linkMutation = useMutation({
    mutationFn: () => apiRequest<PlatformAccountDto>('/platform-accounts/steam/link/mock', { method: 'POST', body: JSON.stringify({}) }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['platform-accounts'] });
    }
  });
  const syncMutation = useMutation({
    mutationFn: async () => {
      const existing = accountsQuery.data?.find((account) => account.platform === 'steam');
      const account = existing ?? (await apiRequest<PlatformAccountDto>('/platform-accounts/steam/link/mock', { method: 'POST', body: JSON.stringify({}) }));
      return apiRequest(`/platform-accounts/${account.id}/sync`, { method: 'POST' });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['platform-accounts'] }),
        queryClient.invalidateQueries({ queryKey: ['library'] })
      ]);
    }
  });

  const user = profileQuery.data ?? localUser ?? mockUser;
  const library = libraryQuery.data?.length ? libraryQuery.data : mockLibrary;
  const totalHours = Math.round(library.reduce((sum, item) => sum + item.playtimeMinutes, 0) / 60);
  const achievementTotal = library.reduce((sum, item) => sum + item.achievementSummary.unlocked, 0);

  return (
    <Screen>
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <Text variant="caption" muted>
              Online hub
            </Text>
            <Text variant="title">{user.displayName}</Text>
          </View>
          <View style={styles.status}>
            <ShieldCheck color={colors.lime} size={18} />
            <Text variant="caption">Steam MVP</Text>
          </View>
        </View>
        <Text muted>
          Unified library, LFG, chat, and deal alerts are ready for the first Steam-backed loop.
        </Text>
      </View>

      {!token && (
        <Card style={styles.authCard}>
          <Text variant="heading">Sign in to sync Steam</Text>
          <Text muted>
            Browse with mock data now, or create an account to link the mock Steam profile and fill your API-backed library.
          </Text>
          <ActionButton label="Open Auth" onPress={() => router.push('/auth')} />
        </Card>
      )}

      {token && (
        <View style={styles.actions}>
          <ActionButton
            label={linkMutation.isPending ? 'Linking' : 'Link Steam'}
            icon={<Link2 color="#061018" size={18} />}
            disabled={linkMutation.isPending}
            onPress={() => linkMutation.mutate()}
            style={styles.action}
          />
          <ActionButton
            label={syncMutation.isPending ? 'Syncing' : 'Sync'}
            icon={<RefreshCw color={colors.text} size={18} />}
            disabled={syncMutation.isPending}
            onPress={() => syncMutation.mutate()}
            variant="secondary"
            style={styles.action}
          />
        </View>
      )}

      <View style={styles.metrics}>
        <MetricCard label="Library hours" value={`${totalHours}`} accent={colors.cyan} />
        <MetricCard label="Achievements" value={`${achievementTotal}`} accent={colors.lime} />
      </View>

      <Card style={styles.nextSession}>
        <Text variant="heading">Next squad window</Text>
        <Text muted>2 LFG rooms match your region, language, and shared Steam games.</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.md,
    paddingVertical: spacing.sm
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.lg
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surface
  },
  authCard: {
    gap: spacing.md
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md
  },
  action: {
    flex: 1
  },
  metrics: {
    flexDirection: 'row',
    gap: spacing.md
  },
  nextSession: {
    gap: spacing.sm
  }
});
