import React from "react";
import {
    View,
    Pressable,
    Text,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    StyleSheet,
    LogBox
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

// Suppress the specific warning
LogBox.ignoreLogs([
    'CountryModal: Support for defaultProps',
    'CountryList: Support for defaultProps',
    'CountryItem: Support for defaultProps',
    'Support for defaultProps will be removed from function components'
]);

interface LoginStartedScreenProps {
    phoneInputRef: React.RefObject<any>;
    phoneNumber: string;
    setPhoneNumber: (phoneNumber: string) => void;
    setStep: (step: number) => void;
    onContinue: () => void;
    loading: boolean;
}

export default function LoginNumberScreen({
    phoneInputRef,
    phoneNumber,
    setPhoneNumber,
    setStep,
    onContinue,
    loading
}: LoginStartedScreenProps) {
    const router = useRouter();

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
                            onPress={() => setStep(1)}
                            style={styles.backButton}
                        >
                            <AntDesign name="arrowleft" size={24} color="black" />
                        </Pressable>

                        <View style={styles.textContainer}>
                            <Text style={styles.title}>Enter Your Number</Text>
                            <Text style={styles.subtitle}>
                                Provide Your Phone Number to Proceed with Secure Login
                            </Text>
                        </View>

                        {/* Phone Input */}
                        <View style={styles.phoneInputContainer}>
                            <PhoneInput
                                ref={phoneInputRef}
                                defaultValue={phoneNumber}
                                defaultCode="IN"
                                layout="first"
                                onChangeFormattedText={setPhoneNumber}
                                withShadow
                                autoFocus
                                containerStyle={styles.phoneInput}
                                textContainerStyle={styles.phoneInputTextContainer}
                            />
                        </View>
                    </View>

                    {/* Continue Button */}
                    <View style={styles.buttonContainer}>
                        <Pressable
                            disabled={loading}
                            onPress={onContinue}
                            style={[styles.continueButton, loading && styles.disabledButton]}
                            android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
                        >
                            <Text style={styles.continueButtonText}>
                                {loading ? 'Sending...' : 'Continue'}
                            </Text>
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
        marginBottom: 24
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#000"
    },
    subtitle: {
        fontSize: 14,
        color: "rgba(0, 0, 0, 0.5)",
        fontWeight: "normal",
        marginVertical: 8
    },
    phoneInputContainer: {
        marginTop: 16
    },
    phoneInput: {
        width: "100%",
        height: 50,
        borderRadius: 10
    },
    phoneInputTextContainer: {
        paddingVertical: 0,
        backgroundColor: "#F1F1F1"
    },
    buttonContainer: {
        marginBottom: 5
    },
    continueButton: {
        width: "100%",
        height: 55,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#04714A",
        borderRadius: 8
    },
    disabledButton: {
        opacity: 0.7
    },
    continueButtonText: {
        color: "white",
        fontSize: 18
    }
});