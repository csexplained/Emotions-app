import React, { useRef, useState } from "react";
import { View, Pressable, Text, Image, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { Link } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function LoginScreen() {
    const [step, setStep] = useState(1);
    const phoneInputRef = useRef(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [countrycode, setCountryCode] = useState("+91");
    const [otp, setOtp] = useState("");

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="w-full h-full bg-[#F0FFFA] justify-start items-center">
                        {/* Background Image */}
                        <Image
                            source={require("@/assets/images/getstartedpagebg.png")}
                            className="w-full h-auto"
                            resizeMode="cover"
                        />

                        {/* Content Wrapper */}
                        <View className="px-6 py-6 w-full">
                            <View className="bg-white border shadow-lg rounded-3xl px-8 py-8 w-full">
                                {/* Logo */}
                                <Image
                                    source={require("@/assets/images/logosmall.png")}
                                    className="w-14 h-14 mb-4"
                                    resizeMode="contain"
                                />

                                {/* Heading */}
                                <Text className="text-3xl font-extrabold">Get Started</Text>
                                <Text className="text-lg text-[#00000080] font-normal my-2">
                                    Start your journey towards success with our expert-led programs
                                </Text>

                                {/* Phone Number Input */}
                                <View className="w-full flex items-center mt-4">
                                    <PhoneInput
                                        ref={phoneInputRef}
                                        defaultValue={phoneNumber}
                                        defaultCode="IN"
                                        layout="first"
                                        onChangeFormattedText={(text) => setPhoneNumber(text)}
                                        withShadow
                                        autoFocus
                                        containerStyle={{ width: "100%", height: 50, borderRadius: 10 }}
                                        textContainerStyle={{ paddingVertical: 0, backgroundColor: "#F1F1F1" }}
                                    />
                                </View>

                                {/* Sign Up Button */}
                                <Link href="/auth/login" asChild>
                                    <Pressable className="w-full h-12 my-4 flex justify-center items-center bg-[#04714A] rounded-lg active:opacity-80">
                                        <Text className="text-white text-lg">Sign Up</Text>
                                    </Pressable>
                                </Link>

                                {/* Social Login Buttons */}
                                <View className="flex flex-row gap-1 justify-between items-center">
                                    <View className="bg-[#1E1E1E] px-10 py-4 rounded-lg">
                                        <AntDesign name="google" size={16} color="white" />
                                    </View>
                                    <View className="bg-[#1E1E1E] px-10 py-4 rounded-lg">
                                        <AntDesign name="apple1" size={16} color="white" />
                                    </View>
                                    <View className="bg-[#1E1E1E] px-10 py-4 rounded-lg">
                                        <FontAwesome name="facebook-official" size={16} color="white" />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}