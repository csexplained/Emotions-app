import { useRouter } from "expo-router";
import { View, Button, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
    const router = useRouter();

    const handleLogout = async () => {
        router.replace("/auth");
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Welcome to Home!</Text>
            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
}
