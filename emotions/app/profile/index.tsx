import React, { useRef, useState } from "react";
import { View, Pressable, Text, Image, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { Link } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Stepone from "@/components/profilebuild/stepone";
import userdata from "@/types/user.types";
import Steptwo from "@/components/profilebuild/steptwo";
import AboutYou from "@/types/aboutyoutypes";
import ThankYouScreen from "@/components/CompleteScreen";
export default function Indexscreen() {
    const [total, setTotal] = useState(3);
    const [step, setStep] = useState(1);
    const [userdata, setuserData] = useState<userdata>({
        firstname: "",
        lastname: "",
        gender: "",
        mobileNumber: "",
        email: "",
        city: "",
        country: "",
    });
    const [aboutyou, setAboutYou] = useState<AboutYou>({
        "Have you ever worked on your mental health?": "",
        "How do you usually cope with stress?": "",
        "Have you ever practiced meditation or mindfulness?": "",
        "Do you have a support system (friends, family, therapist)?": "",
        "How often do you prioritize self-care?": "",
        "Have you ever talked to a professional about your mental health?": "",
        "What activities make you feel happy and relaxed?": "",
        "How would you describe your sleep quality?": "",
        "Do you feel comfortable expressing your emotions?": "",
        "What are some personal goals you have for your mental well-being?": ""
    });


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
        >
            {step === 1 && (
                <Stepone step={step} totalsteps={total} userdata={userdata} setUserData={setuserData} setstep={setStep} />
            )}
            {step === 2 && (
                <Steptwo step={step} totalsteps={total} aboutyou={aboutyou} setAboutYou={setAboutYou} setstep={setStep} />
            )}
            {step === 3 && (
                <ThankYouScreen redirectTo="/" />
            )}
            {step !== 1 && step !== 2 && step !== 3 && (
                <Stepone step={step} totalsteps={total} userdata={userdata} setUserData={setuserData} setstep={setStep} />
            )}

        </KeyboardAvoidingView>
    );
}