import { Tabs } from 'expo-router';
import { BadgePercent, Gamepad2, Home, Library, MessageCircle, UsersRound } from 'lucide-react-native';
import { colors } from '@/theme';

type TabIconProps = { color: string; size: number };

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 76,
          paddingBottom: 12,
          paddingTop: 8
        },
        tabBarActiveTintColor: colors.cyan,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700'
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }: TabIconProps) => <Home color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, size }: TabIconProps) => <Library color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="lfg"
        options={{
          title: 'LFG',
          tabBarIcon: ({ color, size }: TabIconProps) => <UsersRound color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }: TabIconProps) => <MessageCircle color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="deals"
        options={{
          title: 'Deals',
          tabBarIcon: ({ color, size }: TabIconProps) => <BadgePercent color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="play"
        options={{
          href: null,
          title: 'Play',
          tabBarIcon: ({ color, size }: TabIconProps) => <Gamepad2 color={color} size={size} />
        }}
      />
    </Tabs>
  );
}
