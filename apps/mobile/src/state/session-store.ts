import type { AuthTokens, UserProfile } from '@fylex/shared';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

const USER_KEY = 'fylex.user';
const TOKENS_KEY = 'fylex.tokens';

type SessionState = {
  user: UserProfile | null;
  tokens: AuthTokens | null;
  isBootstrapped: boolean;
  setSession: (user: unknown, tokens: AuthTokens) => Promise<void>;
  loadSession: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  tokens: null,
  isBootstrapped: false,
  setSession: async (user, tokens) => {
    const typedUser = user as UserProfile;
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(typedUser));
    await SecureStore.setItemAsync(TOKENS_KEY, JSON.stringify(tokens));
    set({
      user: typedUser,
      tokens
    });
  },
  loadSession: async () => {
    const [userRaw, tokensRaw] = await Promise.all([SecureStore.getItemAsync(USER_KEY), SecureStore.getItemAsync(TOKENS_KEY)]);
    set({
      user: userRaw ? (JSON.parse(userRaw) as UserProfile) : null,
      tokens: tokensRaw ? (JSON.parse(tokensRaw) as AuthTokens) : null,
      isBootstrapped: true
    });
  },
  logout: async () => {
    await Promise.all([SecureStore.deleteItemAsync(USER_KEY), SecureStore.deleteItemAsync(TOKENS_KEY)]);
    set({
      user: null,
      tokens: null
    });
  }
}));
