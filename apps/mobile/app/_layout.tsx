import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSessionStore } from '@/state/session-store';
import { colors } from '@/theme';

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const loadSession = useSessionStore((state) => state.loadSession);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: colors.bg
            }
          }}
        />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
