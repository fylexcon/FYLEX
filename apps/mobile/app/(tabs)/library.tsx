import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import type { LibraryItemDto } from '@fylex/shared';
import { apiRequest } from '@/api/client';
import { GameCard } from '@/components/GameCard';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { mockLibrary } from '@/data/mock';
import { useSessionStore } from '@/state/session-store';
import { colors, radii, spacing } from '@/theme';

export default function LibraryScreen() {
  const [query, setQuery] = useState('');
  const token = useSessionStore((state) => state.tokens?.accessToken);
  const libraryQuery = useQuery({
    queryKey: ['library'],
    enabled: Boolean(token),
    queryFn: () => apiRequest<LibraryItemDto[]>('/library')
  });
  const library = libraryQuery.data?.length ? libraryQuery.data : mockLibrary;
  const filtered = useMemo(
    () => library.filter((item) => item.game.title.toLowerCase().includes(query.toLowerCase())),
    [library, query]
  );

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text variant="caption" muted>
            Unified Steam library
          </Text>
          <Text variant="title">Library</Text>
        </View>
        <Text muted>{library.length} games tracked</Text>
      </View>

      <View style={styles.search}>
        <Search color={colors.subtext} size={18} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search games"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
      </View>

      <View style={styles.list}>
        {filtered.map((item) => (
          <GameCard key={item.id} item={item} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm
  },
  search: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radii.md,
    borderColor: colors.border,
    borderWidth: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: '600'
  },
  list: {
    gap: spacing.md
  }
});
