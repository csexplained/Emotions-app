import React, { useRef } from "react";
import {
    View,
    Pressable,
    Text,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    StyleSheet
} from "react-native";
import { Link, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

interface OtpScreenProps {
    otp: string;
    setOtp: (otp: string) => void;
    resendOtp: () => void;
    setStep: (step: number) => void;
    onSubmit: () => void;
    loading: boolean
}

export default function OtpScreen({ otp, setOtp, resendOtp, setStep, loading, onSubmit }: OtpScreenProps) {
    const router = useRouter();
    const inputRefs = Array(6).fill(null).map(() => useRef<TextInput>(null));

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        let newOtp = otp.split("");
        newOtp[index] = value;
        setOtp(newOtp.join(""));

        // Move to the next input box
        if (value && index < 5) {
            inputRefs[index + 1].current?.focus();
        }
    };

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
                            onPress={() => setStep(2)}
                            style={styles.backButton}
                        >
                            <AntDesign name="arrowleft" size={24} color="black" />
                        </Pressable>

                        <View style={styles.textContainer}>
                            <Text style={styles.title}>Verification Code</Text>
                            <Text style={styles.subtitle}>
                                The OTP code was sent to your phone.
                                Please enter the code
                            </Text>
                        </View>

                        {/* OTP Input */}
                        <View style={styles.otpContainer}>
                            {Array(6).fill(0).map((_, index) => (
                                <TextInput
                                    key={index}
                                    ref={inputRefs[index]}
                                    style={styles.otpInput}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    value={otp[index] || ""}
                                    onChangeText={(value) => handleOtpChange(index, value)}
                                />
                            ))}
                        </View>
                        <View style={styles.resendContainer}>
                            <Text style={styles.resendText}>Didn't receive the OTP?</Text>
                            <Pressable onPress={resendOtp} style={styles.resendButton}>
                                <Text style={styles.resendLink}>Resend Code</Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Bottom Section */}
                    <View style={styles.bottomContainer}>
                        <Pressable
                            onPress={onSubmit}
                            disabled={loading}
                            style={styles.continueButton}
                        >
                            <Text style={styles.continueButtonText}>{loading ? 'Verifying...' : 'Submit OTP'}</Text>
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
        justifyContent: "center"
    },
    textContainer: {
        marginTop: 16
    },
    title: {
        fontSize: 28,
        fontWeight: "700"
    },
    subtitle: {
        fontSize: 14,
        color: "rgba(0, 0, 0, 0.5)",
        fontWeight: "normal",
        marginVertical: 8
    },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 16
    },
    otpInput: {
        fontSize: 24,
        fontWeight: "bold",
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#04714A",
        borderRadius: 8,
        width: 45,
        height: 45,
        margin: 5,
        textAlign: "center"
    },
    resendContainer: {
        marginTop: 30,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    resendText: {
        fontSize: 14,
        color: "rgba(0, 0, 0, 0.5)",
        textAlign: "center"
    },
    resendButton: {
        width: "100%",
        marginVertical: 4
    },
    resendLink: {
        color: "#04714A",
        textDecorationLine: "underline",
        textAlign: "center",
        fontSize: 14,
        fontWeight: "600"
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
        borderRadius: 8
    },
    continueButtonPressed: {
        opacity: 0.8
    },
    continueButtonText: {
        color: "white",
        fontSize: 18
    }
});