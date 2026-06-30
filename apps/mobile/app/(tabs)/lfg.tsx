import { useQuery } from '@tanstack/react-query';
import { Clock, Headphones, Plus } from 'lucide-react-native';
import { Image, StyleSheet, View } from 'react-native';
import type { LfgPostDto } from '@fylex/shared';
import { apiRequest } from '@/api/client';
import { ActionButton } from '@/components/ActionButton';
import { Card } from '@/components/Card';
import { PlatformChip } from '@/components/PlatformChip';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { mockLfgPosts } from '@/data/mock';
import { colors, radii, spacing } from '@/theme';

export default function LfgScreen() {
  const lfgQuery = useQuery({
    queryKey: ['lfg'],
    queryFn: () => apiRequest<LfgPostDto[]>('/lfg', { auth: false })
  });
  const posts = lfgQuery.data?.length ? lfgQuery.data : mockLfgPosts;

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text variant="caption" muted>
            Find teammates
          </Text>
          <Text variant="title">LFG</Text>
        </View>
        <ActionButton label="Create" icon={<Plus color="#061018" size={18} />} style={styles.createButton} />
      </View>

      {posts.map((post) => (
        <Card key={post.id} style={styles.post}>
          <View style={styles.postTop}>
            <Image source={{ uri: post.game.coverUrl ?? undefined }} style={styles.cover} />
            <View style={styles.postMain}>
              <Text variant="heading" numberOfLines={1}>
                {post.game.title}
              </Text>
              <View style={styles.creator}>
                <Text muted>{post.creator.displayName}</Text>
                <PlatformChip platform={post.platform} />
              </View>
            </View>
          </View>

          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Clock color={colors.cyan} size={16} />
              <Text variant="caption">{new Date(post.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
            <View style={styles.metaItem}>
              <Headphones color={colors.lime} size={16} />
              <Text variant="caption">{post.language}</Text>
            </View>
            <Text variant="caption" muted>
              {post.region} · {post.skillBand}
            </Text>
          </View>

          <View style={styles.tags}>
            {[...post.rolesNeeded, ...post.playstyleTags].slice(0, 5).map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text variant="caption">{tag}</Text>
              </View>
            ))}
          </View>

          <ActionButton label="Join Room" variant="secondary" />
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md
  },
  createButton: {
    minWidth: 118
  },
  post: {
    gap: spacing.md
  },
  postTop: {
    flexDirection: 'row',
    gap: spacing.md
  },
  cover: {
    width: 58,
    height: 76,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceHigh
  },
  postMain: {
    flex: 1,
    justifyContent: 'space-between'
  },
  creator: {
    gap: spacing.sm
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.md
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs
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
