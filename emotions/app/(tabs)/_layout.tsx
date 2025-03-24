import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import SvgHome from "@/assets/icons/Home";
import SvgEmojiHappy from "@/assets/icons/EmojiHappy";
import SvgClipboardText from "@/assets/icons/ClipboardText";
import SvgUser from "@/assets/icons/User";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";
import { HapticTab } from "@/components/HapticTab";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = "#04714A"; // Active tab color
  const inactiveColor = colorScheme === 'dark' ? '#aaa' : '#666'; // Adjust inactive color

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor, // Active icon & text color
        tabBarInactiveTintColor: inactiveColor, // Inactive color
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'white', // Background color
          borderTopLeftRadius: 20, // Rounded top corners
          borderTopRightRadius: 20,
          elevation: 5, // Shadow for Android
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 }, // Elevate tab bar
          shadowOpacity: 0.1,
          shadowRadius: 5,
          height: 75,
          paddingTop: 5,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10, // Adjust padding
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <SvgHome fill={color} width={20} height={20} />,
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: "Chatbot",
          tabBarIcon: ({ color }) => <SvgEmojiHappy fill={color} width={20} height={20} />,
        }}
      />
      <Tabs.Screen
        name="info"
        options={{
          title: "Info",
          tabBarIcon: ({ color }) => <SvgClipboardText fill={color} width={20} height={20} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <SvgUser fill={color} width={20} height={20} />,
        }}
      />
    </Tabs>
  );
}
