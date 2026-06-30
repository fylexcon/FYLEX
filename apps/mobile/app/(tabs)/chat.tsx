import { SendHorizontal } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { io, type Socket } from 'socket.io-client';
import { WS_URL } from '@/api/client';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { mockMessages } from '@/data/mock';
import { colors, radii, spacing } from '@/theme';

type Message = {
  id: string;
  sender?: string;
  senderId?: string;
  body: string;
  createdAt: string;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [draft, setDraft] = useState('');
  const socket = useMemo<Socket>(() => io(`${WS_URL}/chat`, { autoConnect: false, transports: ['websocket'] }), []);

  useEffect(() => {
    socket.connect();
    socket.emit('room:join', { roomId: 'global-lfg' });
    socket.on('message:new', (message: Message) => {
      setMessages((current) => [...current, message]);
    });

    return () => {
      socket.off('message:new');
      socket.disconnect();
    };
  }, [socket]);

  const send = () => {
    if (!draft.trim()) {
      return;
    }

    const body = draft.trim();
    setDraft('');

    if (socket.connected) {
      socket.emit('message:send', {
        roomId: 'global-lfg',
        senderId: 'You',
        body
      });
    } else {
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}`,
          sender: 'You',
          body,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  return (
    <Screen scroll={false}>
      <View style={styles.header}>
        <Text variant="caption" muted>
          Rooms
        </Text>
        <Text variant="title">LFG Chat</Text>
      </View>

      <View style={styles.messages}>
        {messages.map((message) => {
          const mine = message.sender === 'You' || message.senderId === 'You';
          return (
            <Card key={message.id} style={[styles.message, mine && styles.mine]}>
              <Text variant="caption" muted={!mine}>
                {mine ? 'You' : message.sender ?? message.senderId ?? 'Squadmate'}
              </Text>
              <Text>{message.body}</Text>
            </Card>
          );
        })}
      </View>

      <View style={styles.composer}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Message the room"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
        <Pressable onPress={send} style={styles.send}>
          <SendHorizontal color="#061018" size={20} />
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
    marginBottom: spacing.lg
  },
  messages: {
    flex: 1,
    gap: spacing.md
  },
  message: {
    gap: spacing.xs,
    maxWidth: '86%'
  },
  mine: {
    alignSelf: 'flex-end',
    backgroundColor: '#143241',
    borderColor: colors.cyan
  },
  composer: {
    minHeight: 58,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radii.md,
    borderColor: colors.border,
    borderWidth: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    paddingHorizontal: spacing.sm
  },
  send: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.sm,
    backgroundColor: colors.cyan
  }
});
