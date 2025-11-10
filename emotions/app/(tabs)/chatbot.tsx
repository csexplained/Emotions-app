// App.tsx
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ChatScreen } from '@/components/chatbot/chatinterface';
import { useNavigation } from 'expo-router';

export default function App() {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
            tabBarStyle: { display: "none" }
        });
    }, [navigation]);
    
    return (
        <SafeAreaProvider>
            <ChatScreen />
        </SafeAreaProvider>
    );
}