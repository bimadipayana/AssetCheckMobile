import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { AppSplashScreen } from '@/components/app-splash-screen';
import { palette } from '@/constants/theme';

void SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: palette.background,
    card: palette.surface,
    primary: palette.primary,
    text: palette.text,
    border: palette.border,
  },
};

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: palette.background },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: palette.surface },
          headerTintColor: palette.text,
          headerTitleStyle: { fontWeight: '700' },
        }}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="asset-result" options={{ headerShown: false }} />
        <Stack.Screen name="inspection-form" options={{ headerShown: false }} />
        <Stack.Screen name="photo-upload" options={{ title: 'Photo Evidence' }} />
        <Stack.Screen name="inspection-detail" options={{ headerShown: false }} />
      </Stack>
      {showSplash ? <AppSplashScreen onFinish={() => setShowSplash(false)} /> : null}
      <StatusBar hidden={showSplash} style="dark" />
    </ThemeProvider>
  );
}
