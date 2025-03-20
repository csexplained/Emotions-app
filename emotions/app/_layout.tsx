import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Slot, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "./loading";

SplashScreen.preventAutoHideAsync();

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
        // Simulate loading (fetch user token from storage)
        const token = await AsyncStorage.getItem("authToken");

        if (token) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }

        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading time
        await SplashScreen.hideAsync();
        setAppReady(true);
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsLoggedIn(false);
        setAppReady(true);
      }
    }

    checkAuth();
  }, []);

  useEffect(() => {
    if (appReady && isLoggedIn === false) {
      router.replace("/auth"); // Redirect to auth page
    }
  }, [appReady, isLoggedIn]);

  if (!appReady) {
    return <LoadingScreen />;
  }

  return <Slot />;
}
