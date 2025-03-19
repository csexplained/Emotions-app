import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import "../global.css"
import { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Slot } from "expo-router";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      // Simulate a loading process (e.g., fetching data, loading fonts)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Hide splash screen once done
      await SplashScreen.hideAsync();
      setAppReady(true);
    }

    prepare();
  }, []);

  if (!appReady) {
    return (
      <View className='w-full gap-2 flex justify-center items-center bg-[#04714A] h-full'>
      
        <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 17C0 7.61116 7.61116 0 17 0C26.3888 0 34 7.61116 34 17V34H17C7.61116 34 0 26.3888 0 17Z" fill="#1E1E1E" />
          <path d="M0 51C0 41.6112 7.61116 34 17 34H34V51C34 60.3888 26.3888 68 17 68C7.61116 68 0 60.3888 0 51Z" fill="#F0FFFA" />
          <path d="M34 17C34 7.61116 41.6112 0 51 0C60.3888 0 68 7.61116 68 17C68 26.3888 60.3888 34 51 34H34V17Z" fill="#F0FFFA" />
          <path d="M34 34H51C60.3888 34 68 41.6112 68 51C68 60.3888 60.3888 68 51 68C41.6112 68 34 60.3888 34 51V34Z" fill="#1E1E1E" />
        </svg>
        <Text className='color-white text-lg font-sans font-semibold '>EMOTIONS</Text>
      </View>
    );
  }

  return <Slot />;
}
