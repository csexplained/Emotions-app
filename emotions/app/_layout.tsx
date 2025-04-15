import { useRouter, useSegments } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Slot } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import '@/global.css';
import { View, Text } from 'react-native';
import { ErrorBoundary } from 'react-error-boundary';
import LoadingScreen from '@/components/loading';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  // Load fonts
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // App state
  const [appReady, setAppReady] = useState(false);
  const { isAuthenticated, sessionChecked, initializeAuth } = useAuthStore();

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
  const shouldRedirect = useMemo(() => {
    if (!appReady || !fontsLoaded || !sessionChecked) return null;

    // console.log('🧭 Segments:', segments);
    //console.log('✅ isAuthenticated:', isAuthenticated);

    const group = segments[0]; // top-level route group like 'auth' or '(tabs)'
    const isInAuthGroup = group === 'auth';
    const isProtected = group !== 'auth'; // everything outside auth is protected
    const isAuthIndex = segments.length === 1 && group === 'auth';

    return {
      redirectToAuth: !isAuthenticated && isProtected,
      redirectToHome: isAuthenticated && isAuthIndex,
    };
  }, [isAuthenticated, segments, fontsLoaded, appReady, sessionChecked]);

  // Handle redirects
  useEffect(() => {
    if (!shouldRedirect) return;

    if (shouldRedirect.redirectToAuth) {
      //console.log('🔐 Redirecting to /auth');
      router.replace('/auth');
    } else if (shouldRedirect.redirectToHome) {
      //console.log('🏠 Redirecting to /(tabs)');
      router.replace('/(tabs)');
    }
  }, [shouldRedirect]);

  // Show splash or loading screen
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

  // Render app
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
