import React, { useEffect, useState } from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Slot, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "../components/loading";
import "@/global.css";

SplashScreen.preventAutoHideAsync(); // Ensure splash screen doesn't auto-hide

export default function RootLayout() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [appReady, setAppReady] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = false
        setIsLoggedIn(!!token); // Set login state based on token

        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading delay
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsLoggedIn(false);
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync(); // Hide splash **after** app is ready
      }
    }

    checkAuth();
  }, []);

  useEffect(() => {
    if (appReady && isLoggedIn === false) {
      router.replace("/auth"); // Redirect to auth page
    }
  }, [appReady, isLoggedIn]);

  // Show loading screen while app is initializing
  if (!appReady) {
    return <LoadingScreen />;
  }

  return <Slot />;
}
