import React, { useRef, useState } from "react";
import { View, Pressable, Text, Image, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { Link } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import LoginStartedScreen from "@/components/loginstarted";
import Loginnumber from "@/components/Loginnumber";
import OtpScreen from "@/components/otpscreen";
import ThankYouScreen from "@/components/CompleteScreen";

export default function LoginScreen() {
    const [step, setStep] = useState(1);
    const phoneInputRef = useRef(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
        >
            {step === 1 && (
                <LoginStartedScreen phoneInputRef={phoneInputRef} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} setStep={setStep} />
            )}
            {step === 2 && (
                <Loginnumber phoneInputRef={phoneInputRef} phoneNumber={phoneNumber} setStep={setStep} setPhoneNumber={setPhoneNumber} />
            )}
            {step === 3 && (
                <OtpScreen otp={otp} setOtp={setOtp} setstep={setStep} resendOtp={() => console.log("Resend OTP")} />
            )}
            {step === 4 && (
                <ThankYouScreen redirectTo="/profile" />
            )}
            {step !== 1 && step !== 2 && step !== 3 && step !== 4 && (
                <LoginStartedScreen phoneInputRef={phoneInputRef} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} setStep={setStep} />
            )}

        </KeyboardAvoidingView>
    );
}