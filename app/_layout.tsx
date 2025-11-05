import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useBackgroundFetch } from '@/hooks/use-background-fetch';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import 'react-native-devsettings';
// OR if you are using AsyncStorage
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useBackgroundFetch();
  const customLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.light.primary,
      background: Colors.light.background,
      card: Colors.light.card,
      text: Colors.light.text,
      secondaryText: Colors.light.textSecondary,
      border: Colors.light.border,
      notification: Colors.light.primary,
    },
  };

  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: Colors.dark.primary,
      background: Colors.dark.background,
      card: Colors.dark.card,
      text: Colors.dark.text,
      secondaryText: Colors.dark.textSecondary,
      border: Colors.dark.border,
      notification: Colors.dark.primary,
    },
  };
  // Optional: log notifications received
  useEffect(() => {
    const sub = Notifications.addNotificationReceivedListener((n) => {
      console.log('📬 Notification received:', n);
    });
    return () => sub.remove();
  }, []);
  return (
    <ThemeProvider
      value={colorScheme === 'dark' ? customDarkTheme : customLightTheme}
    >
      <Stack>
        <Stack.Screen name="(tabs)" options={{ title: 'Newsly' }} />
        <Stack.Screen
          name="article/[articleId]/index"
          options={{ title: 'Article' }}
        />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
