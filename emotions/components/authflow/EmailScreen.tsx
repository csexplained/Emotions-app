import React from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

interface EmailScreenProps {
    email: string;
    setEmail: (email: string) => void;
    onNext: () => void;
}

export default function EmailScreen({ email, setEmail, onNext }: EmailScreenProps) {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.innerContainer}>
                    {/* Top Section */}
                    <View>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>Enter Your Email</Text>
                            <Text style={styles.subtitle}>
                                We'll use this email to sign you in or create an account
                            </Text>
                        </View>

                        <TextInput
                            placeholder="example@email.com"
                            placeholderTextColor="#999"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                        />
                    </View>

                    {/* Bottom Section */}
                    <View style={styles.bottomContainer}>
                        <Pressable
                            onPress={onNext}
                            style={styles.continueButton}
                            disabled={!email}
                        >
                            <Text style={styles.continueButtonText}>Continue</Text>
                            <AntDesign name="arrowright" size={20} color="white" />
                        </Pressable>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0FFFA"
    },
    innerContainer: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingVertical: 24
    },
    textContainer: {
        marginTop: 16,
        marginBottom: 32
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#04714A"
    },
    subtitle: {
        fontSize: 14,
        color: "rgba(0, 0, 0, 0.5)",
        fontWeight: "normal",
        marginVertical: 8
    },
    input: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#04714A",
        borderRadius: 8,
        padding: 16,
        fontSize: 16,
        height: 55
    },
    bottomContainer: {
        marginBottom: 5
    },
    continueButton: {
        width: "100%",
        height: 55,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#04714A",
        borderRadius: 8,
        flexDirection: "row",
        gap: 8
    },
    continueButtonPressed: {
        opacity: 0.8
    },
    continueButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600"
    }
});