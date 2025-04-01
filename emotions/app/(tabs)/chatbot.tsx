import { useEffect, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView
} from "react-native";
import { useNavigation } from "expo-router";
import StartScreen from "@/components/chatbot/startscreen";
import ChatScreen from "@/components/chatbot/chatinterface";
import { HapticTab } from "@/components/HapticTab";

export default function HomeScreen() {
  const [startChat, setStartChat] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: startChat ? { display: "none" } : {
        height: 75,
        borderTopLeftRadius: 20,
        paddingTop: 5,
        borderTopRightRadius: 20,
        tabBarButton: HapticTab,
      },
    });
  }, [startChat]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F0FFFA" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {!startChat && <StartScreen setStartChat={setStartChat} />}
            {startChat && <ChatScreen />}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
