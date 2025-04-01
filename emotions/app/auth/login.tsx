import React, { useRef, useState } from "react";
import { View, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Link } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import LoginStartedScreen from "@/components/authflow/loginstarted";
import Loginnumber from "@/components/authflow/Loginnumber";
import OtpScreen from "@/components/authflow/otpscreen";
import ThankYouScreen from "@/components/CompleteScreen";
import { sendOtp, verifyOtp } from "@/lib/auth";

export default function LoginScreen() {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const phoneInputRef = useRef(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(false);
    const { setUser } = useAuthStore();

    const handleSendOtp = async () => {
        if (!phoneNumber) {
            Alert.alert("Error", "Please enter a phone number");
            return;
        }

        setLoading(true);
        try {
            const response = await sendOtp(phoneNumber);

            if (response.success) {
                setUserId(response.userId);
                setStep(3); // Move to OTP screen
            } else {
                Alert.alert("Error", response.error || "Failed to send OTP");
            }
        } catch (error) {
            Alert.alert("Error", "An unexpected error occurred");
            console.error("OTP Send Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length < 6) {
            Alert.alert("Error", "Please enter a valid 6-digit OTP");
            return;
        }

        setLoading(true);
        try {
            const response = await verifyOtp(userId, otp);

            if (response.success) {
                setUser(response.user ?? null); // Update global auth state
                setStep(4); // Success screen
            } else {
                Alert.alert("Error", response.error || "Invalid OTP");
            }
        } catch (error) {
            Alert.alert("Error", "Verification failed. Please try again.");
            console.error("OTP Verification Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(prev => Math.max(1, prev - 1) as 1 | 2 | 3 | 4);
        }
    };

    const screens = {
        1: (
            <LoginStartedScreen
                phoneInputRef={phoneInputRef}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                setStep={(step: number) => setStep(step as 1 | 2 | 3 | 4)}
            />
        ),
        2: (
            <Loginnumber
                phoneInputRef={phoneInputRef}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                onContinue={handleSendOtp}
                setStep={(step: number) => setStep(step as 1 | 2 | 3 | 4)}
                loading={loading}
            />
        ),
        3: (
            <OtpScreen
                otp={otp}
                setOtp={setOtp}
                resendOtp={handleSendOtp}
                onSubmit={handleVerifyOtp}
                setStep={(step: number) => setStep(step as 1 | 2 | 3 | 4)}
                loading={loading}
            />
        ),
        4: <ThankYouScreen redirectTo="/profile" />
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
        >
            {screens[step]}
        </KeyboardAvoidingView>
    );
}