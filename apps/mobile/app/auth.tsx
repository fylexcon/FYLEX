import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Lock, Mail, UserRound } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import type { AuthTokens, UserProfile } from '@fylex/shared';
import { apiRequest } from '@/api/client';
import { ActionButton } from '@/components/ActionButton';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { useSessionStore } from '@/state/session-store';
import { colors, radii, spacing } from '@/theme';

type AuthResponse = {
  user: UserProfile;
  tokens: AuthTokens;
};

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const setSession = useSessionStore((state) => state.setSession);

  const mutation = useMutation({
    mutationFn: async () => {
      setError(null);

      if (!email.includes('@') || password.length < 8 || (mode === 'register' && (!username || !displayName))) {
        throw new Error('Check your email, password, username, and display name.');
      }

      const path = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload =
        mode === 'login'
          ? { email, password }
          : {
              email,
              username,
              displayName,
              password
            };

      return apiRequest<AuthResponse>(path, {
        method: 'POST',
        auth: false,
        body: JSON.stringify(payload)
      });
    },
    onSuccess: async (response) => {
      await setSession(response.user, response.tokens);
      router.replace('/(tabs)/home');
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Unable to authenticate.');
    }
  });

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.wrap}>
        <View style={styles.header}>
          <Text variant="label" muted>
            FYLEX Account
          </Text>
          <Text variant="title">{mode === 'login' ? 'Welcome back' : 'Create your squad profile'}</Text>
        </View>

        <View style={styles.segment}>
          {(['login', 'register'] as const).map((item) => (
            <Pressable key={item} onPress={() => setMode(item)} style={[styles.segmentButton, mode === item && styles.segmentActive]}>
              <Text variant="label" style={mode === item && styles.segmentTextActive}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <Card style={styles.form}>
          <Input icon={<Mail color={colors.subtext} size={18} />} value={email} onChangeText={setEmail} placeholder="Email" />
          {mode === 'register' && (
            <>
              <Input icon={<UserRound color={colors.subtext} size={18} />} value={username} onChangeText={setUsername} placeholder="Username" />
              <Input icon={<UserRound color={colors.subtext} size={18} />} value={displayName} onChangeText={setDisplayName} placeholder="Display name" />
            </>
          )}
          <Input icon={<Lock color={colors.subtext} size={18} />} value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
          {error && <Text style={styles.error}>{error}</Text>}
          <ActionButton
            label={mutation.isPending ? 'Working' : mode === 'login' ? 'Log In' : 'Register'}
            disabled={mutation.isPending}
            onPress={() => mutation.mutate()}
          />
        </Card>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function Input({
  icon,
  ...props
}: {
  icon: React.ReactNode;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
}) {
  return (
    <View style={styles.inputWrap}>
      {icon}
      <TextInput
        {...props}
        autoCapitalize="none"
        placeholderTextColor={colors.muted}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xl
  },
  header: {
    gap: spacing.sm
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.md,
    padding: spacing.xs
  },
  segmentButton: {
    flex: 1,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.sm
  },
  segmentActive: {
    backgroundColor: colors.cyan
  },
  segmentTextActive: {
    color: '#061018'
  },
  form: {
    gap: spacing.md
  },
  inputWrap: {
    minHeight: 52,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgAlt,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: '600'
  },
  error: {
    color: colors.red
  }
});
