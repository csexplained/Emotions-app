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
    Keyboard,
    ActivityIndicator
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

interface PasswordScreenProps {
    password: string;
    setPassword: (password: string) => void;
    onSubmit: () => void;
    onBack: () => void;
    loading: boolean;
    retryDelay?: number;
}

export default function PasswordScreen({
    password,
    setPassword,
    onSubmit,
    onBack,
    loading,
    retryDelay = 0
}: PasswordScreenProps) {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.innerContainer}>
                    {/* Top Section */}
                    <View>
                        <Pressable
                            onPress={onBack}
                            style={styles.backButton}
                        >
                            <AntDesign name="arrowleft" size={24} color="black" />
                        </Pressable>

                        <View style={styles.textContainer}>
                            <Text style={styles.title}>Enter Your Password</Text>
                            <Text style={styles.subtitle}>
                                Secure your account with a strong password
                            </Text>
                        </View>

                        <TextInput
                            placeholder="••••••••"
                            placeholderTextColor="#999"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                            editable={retryDelay <= 0}
                        />

                        {retryDelay > 0 && (
                            <Text style={styles.retryText}>
                                Try again in {retryDelay} seconds
                            </Text>
                        )}
                    </View>

                    {/* Bottom Section */}
                    <View style={styles.bottomContainer}>
                        <Pressable
                            onPress={onSubmit}
                            style={styles.continueButton}
                            disabled={loading || retryDelay > 0}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Text style={styles.continueButtonText}>
                                        {retryDelay > 0 ? "Please Wait" : "Sign In"}
                                    </Text>
                                    <AntDesign name="arrowright" size={20} color="white" />
                                </>
                            )}
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
    backButton: {
        backgroundColor: "white",
        padding: 8,
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16
    },
    textContainer: {
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
    retryText: {
        color: "#FF3B30",
        textAlign: "center",
        marginTop: 16,
        fontSize: 14
    },
    bottomContainer: {
        marginBottom: 0
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
    buttonDisabled: {
        backgroundColor: "#999"
    },
    continueButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600"
    }
});