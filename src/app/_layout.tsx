import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  Fraunces_400Regular,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
} from '@expo-google-fonts/fraunces';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import { colors } from '@/theme/tokens';

if (Platform.OS !== 'web') {
  void SplashScreen.preventAutoHideAsync();
}

export default function RootLayout() {
  // Web loads fonts from Google Fonts in +html.tsx; native bundles them here.
  const [loaded] = useFonts(
    Platform.OS === 'web'
      ? {}
      : {
          Fraunces_400Regular,
          Fraunces_500Medium,
          Fraunces_600SemiBold,
          Fraunces_700Bold,
          Manrope_400Regular,
          Manrope_500Medium,
          Manrope_600SemiBold,
          Manrope_700Bold,
        },
  );

  useEffect(() => {
    if (loaded && Platform.OS !== 'web') void SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded && Platform.OS !== 'web') return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream } }} />
    </>
  );
}
