import { useRouter } from "expo-router";
import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    // Simulating user creation
    alert("Account created! Please log in.");
    router.replace("/auth/login");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Sign Up</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, width: 200, marginVertical: 5 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, width: 200, marginVertical: 5 }}
      />
      <Button title="Sign Up" onPress={handleSignup} />
      <Text onPress={() => router.push("/auth/login")}>Already have an account? Log In</Text>
    </View>
  );
}
