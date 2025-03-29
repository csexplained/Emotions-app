import React, { useRef, useState } from "react";
import { View, Pressable, Text, Image, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { Link } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import LoginStartedScreen from "@/components/authflow/loginstarted";
import Loginnumber from "@/components/authflow/Loginnumber";
import OtpScreen from "@/components/authflow/otpscreen";
import ThankYouScreen from "@/components/CompleteScreen";
import { sendOtp, verifyOtp } from "@/lib/auth";
export default function LoginScreen() {


    const [step, setStep] = useState(1);
    const phoneInputRef = useRef(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [userId, setUserId] = useState(""); // store the userId for OTP verification
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async () => {
        setLoading(true);
        const response = await sendOtp(phoneNumber);
        setLoading(false);

        if (response.success) {
            setUserId(response.userId || "");
            setStep(3); // move to OTP screen
        } else {
            alert("Failed to send OTP: " + response.error);
        }
    };

    const handleVerifyOtp = async () => {
        if (!userId) return alert("Missing userId");
        setLoading(true);
        const response = await verifyOtp(userId, otp);
        setLoading(false);

        if (response.success) {
            setStep(4); // success
        } else {
            alert("Invalid OTP: " + response.error);
        }
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
                    onContinue={handleSendOtp}
                    loading={loading}
                />
            )}
            {step === 3 && (
                <OtpScreen
                    otp={otp}
                    setOtp={setOtp}
                    setstep={setStep}
                    resendOtp={handleSendOtp}
                    onSubmit={handleVerifyOtp}
                    loading={loading}
                />
            )}
            {step === 4 && <ThankYouScreen redirectTo="/profile" />}
        </KeyboardAvoidingView>
    );
}