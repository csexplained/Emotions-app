import { Stack } from "expo-router";
import "@/global.css";
import { View } from 'react-native';

export default function AuthLayout() {
  return (
    <>
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
        </Stack>
      </View>
    </>
  );
}