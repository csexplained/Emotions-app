import React, { useRef } from "react";
import { View, Pressable, Text, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Link, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

interface OtpScreenProps {
    otp: string;
    setOtp: (otp: string) => void;
    resendOtp: () => void;
    setstep: (step: number) => void;
}

export default function OtpScreen({ otp, setOtp, resendOtp, setstep }: OtpScreenProps) {
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
            style={{ flex: 1, backgroundColor: "#F0FFFA" }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 justify-between px-6 py-6">
                    {/* Top Section */}
                    <View>
                        <Pressable
                            onPress={() => setstep(2)}  // Go back
                            className="bg-white p-2"
                            style={{ width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
                            <AntDesign name="arrowleft" size={24} color="black" />
                        </Pressable>

                        <View className="mt-4">
                            <Text style={{ fontWeight: 700 }} className="text-3xl ">Verification Code</Text>
                            <Text className="text-sm text-[#00000080] font-normal my-2">
                                The OTP code was sent to your phone.
                                Please enter the code
                            </Text>
                        </View>

                        {/* OTP Input */}
                        <View className="flex-row justify-center mt-4">
                            {Array(5).fill(0).map((_, index) => (
                                <TextInput
                                    key={index}
                                    ref={inputRefs[index]}
                                    className="text-2xl font-bold bg-white border rounded-lg text-center"
                                    style={{ width: 55, height: 55, margin: 5, borderColor: "#04714A", borderWidth: 1 }}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    value={otp[index] || ""}
                                    onChangeText={(value) => handleOtpChange(index, value)}
                                />
                            ))}
                        </View>
                        <View style={{ marginTop: 30 }} className="flex-col justify-center items-center ">
                            <Text className="text-center text-sm text-[#00000080]">Didn't receive the OTP?</Text>
                            <Pressable onPress={resendOtp} className="w-full my-1">
                                <Text style={{ color: "#04714A", textDecorationLine: 'underline' }} className="text-[#04714A] underline text-center text-sm font-semibold">Resend Code</Text>
                            </Pressable>
                        </View>
                    </View>


                    {/* Bottom Section */}
                    <View style={{ marginBottom: 10 }}>

                        {/* Bottom Section (Sign Up Button) */}
                        <View>
                            <Pressable onPress={() => setstep(4)} className="w-full h-12 flex justify-center items-center bg-[#04714A] rounded-lg active:opacity-80">
                                <Text className="text-white text-lg">Continue</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
