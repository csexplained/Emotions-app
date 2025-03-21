import React from "react";
import { View, Pressable, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { Link, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
interface LoginStartedScreenProps {
    phoneInputRef: React.RefObject<PhoneInput>;
    phoneNumber: string;
    setPhoneNumber: (phoneNumber: string) => void;
    setStep: (step: number) => void;
}

export default function Loginnumber({ phoneInputRef, phoneNumber, setPhoneNumber,setStep }: LoginStartedScreenProps) {

    const router = useRouter();
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, backgroundColor: "#F0FFFA" }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 justify-between px-6 py-6">

                    {/* Top Section (Back Button & Text) */}
                    <View>
                        <Pressable
                            onPress={() => setStep(1)}  // Go back on click
                            className="bg-white  p-2"
                            style={{ width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
                            <AntDesign name="arrowleft" size={24} color="black" />
                        </Pressable>

                        <View className="mt-4 ">
                            <Text style={{fontWeight : 700}} className="text-3xl font-semibold">Enter Your Number</Text>
                            <Text className="text-sm text-[#00000080] font-normal my-2">
                                Provide Your Phone Number to Proceed with Secure Login
                            </Text>
                        </View>

                        {/* Phone Number Input */}
                        <View className="mt-4">
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
                    </View>

                    {/* Bottom Section (Sign Up Button) */}
                    <View style={{ marginBottom: 20 }}>
                        <Pressable onPress={()=> setStep(3)} className="w-full h-12 flex justify-center items-center bg-[#04714A] rounded-lg active:opacity-80">
                            <Text className="text-white text-lg">Continue</Text>
                        </Pressable>
                    </View>

                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
