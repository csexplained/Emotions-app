import React, { useRef } from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import useAuthStore from "@/store/authStore";
import LoginStartedScreen from "@/components/authflow/loginstarted";
import Loginnumber from "@/components/authflow/Loginnumber";
import OtpScreen from "@/components/authflow/otpscreen";
import ThankYouScreen from "@/components/CompleteScreen";

export default function LoginScreen() {
    const phoneInputRef = useRef(null);
    const {
        step,
        phoneNumber,
        otp,
        setStep,
        setPhoneNumber,
        setOtp,
        sendOtp,
        verifyOtp,
        loading
    } = useAuthStore();

    // Handle OTP sending
    const handleSendOtp = async () => {
        await sendOtp();
        setStep(2); // Move to phone number confirmation
    };


    // Handle OTP verification
    const handleVerifyOtp = async () => {

        setStep(4); // Move to thank you screen

    };

    // Handle OTP resend
    const handleResendOtp = async () => {
        await sendOtp();
        // Optional: Show toast message that OTP was resent
    };

    // Handle completion
    const handleComplete = () => {
        router.replace('/profile');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
        >
            {step === 1 && (
                <LoginStartedScreen
                    phoneInputRef={phoneInputRef}
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                    setStep={setStep}
                />
            )}
            {step === 2 && (
                <Loginnumber
                    phoneInputRef={phoneInputRef}
                    phoneNumber={phoneNumber}
                    setStep={setStep}
                    setPhoneNumber={setPhoneNumber}
                    onContinue={() => setStep(3)}
                    loading={loading}
                />
            )}
            {step === 3 && (
                <OtpScreen
                    otp={otp}
                    setStep={setStep}
                    setOtp={setOtp}
                    onVerify={handleVerifyOtp}
                    onResend={handleResendOtp}
                    loading={loading}
                />
            )}
            {step === 4 && (
                <ThankYouScreen onComplete={() => router.replace('/profile')} />
            )}
        </KeyboardAvoidingView>
    );
}
