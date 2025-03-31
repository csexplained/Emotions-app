import { useRouter, useSegments } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Slot } from "expo-router";
import { useAuthStore } from '@/store/authStore';
import "@/global.css";
import { ActivityIndicator, View, Text } from 'react-native';
import { ErrorBoundary } from 'react-error-boundary';
import LoadingScreen from '@/components/Loading';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  // Load fonts
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // App state
  const [appReady, setAppReady] = useState(false);
  const { user, isAuthenticated, sessionChecked, initializeAuth } = useAuthStore();

  // Initialize auth and app
  useEffect(() => {
    let isMounted = true;

    async function prepare() {
      try {
        await initializeAuth();
      } catch (error) {
        console.warn('Initialization error:', error);
      } finally {
        if (isMounted) {
          setAppReady(true);
          await SplashScreen.hideAsync();
        }
      }
    }

    prepare();

    return () => {
      isMounted = false;
    };
  }, []);

  // Memoized routing logic to prevent unnecessary re-renders
  const shouldRedirect = useMemo(() => {
    if (!appReady || !fontsLoaded || !sessionChecked) return null;

    const inAuthGroup = segments[0] === 'auth';
    const inProtectedGroup = !['(auth)', '(public)'].includes(segments[0]);

    return {
      redirectToAuth: !isAuthenticated && inProtectedGroup,
      redirectToHome: isAuthenticated && inAuthGroup,
    };
  }, [isAuthenticated, segments, fontsLoaded, appReady, sessionChecked]);

  // Handle routing based on auth state
  useEffect(() => {
    if (!shouldRedirect) return;

    if (shouldRedirect.redirectToAuth) {
      router.replace('/auth/signup');
    } else if (shouldRedirect.redirectToHome) {
      router.replace('/(tabs)');
    }
  }, [shouldRedirect]);

  // Show loading indicator while resources are loading
  if (!appReady || !fontsLoaded || !sessionChecked) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LoadingScreen />
      </View>
    );
  }

  // Handle font loading errors
  if (fontError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Failed to load app resources</Text>
      </View>
    );
  }

  // Main render with error boundary
  return (
    <ThemeProvider value={DefaultTheme}>
      <ErrorBoundary
        fallback={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Something went wrong</Text>
          </View>
        }
      >
        <Slot />
      </ErrorBoundary>
    </ThemeProvider>
  );
}