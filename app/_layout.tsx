import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

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

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? customDarkTheme : customLightTheme}
    >
      <Stack>
        <Stack.Screen name="(tabs)" options={{ title: "Newsly" }} />
        <Stack.Screen
          name="article/[articleId]/index"
          options={{ title: "Article" }}
        />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
