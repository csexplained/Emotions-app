import React, { useState } from "react";
import {
    View,
    Pressable,
    Text,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import AboutYou from "@/types/aboutyoutypes";

interface SteptwoProps {
    aboutyou: AboutYou;
    setAboutYou: (aboutyou: AboutYou) => void;
    setstep: (step: number) => void;
    totalsteps: number;
    step: number;
}

export default function Steptwo({ step, totalsteps, aboutyou, setAboutYou, setstep }: SteptwoProps) {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, backgroundColor: "#F0FFFA" }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, padding: 20 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header Section */}
                    <View className="flex-row justify-between items-center">
                        <Pressable
                            onPress={() => setstep(2)}
                            className="bg-white p-2 rounded-lg w-10 h-10 flex items-center justify-center"
                        >
                            <AntDesign name="arrowleft" size={24} color="black" />
                        </Pressable>
                        <View className="border p-2 w-10 h-10 flex items-center justify-center rounded-lg">
                            <Text>{step}/{totalsteps}</Text>
                        </View>
                    </View>

                    {/* Title */}
                    <View style={{ marginTop: 30 }}>
                        <Text style={{ fontWeight: "700" }} className="text-3xl">About You</Text>
                        <Text className="text-lg text-[#00000080] font-normal my-2">
                            Personalising The App For Your Emotions
                        </Text>
                    </View>

                    {/* Dynamic Form Fields */}
                    <View style={{ marginTop: 20 }}>
                        {Object.keys(aboutyou).map((question, index) => (
                            <View key={index} style={{ marginBottom: 15 }}>
                                <Text style={{ fontWeight: "600", marginBottom: 10 }}>{question}</Text>
                                <TextInput
                                    placeholder="Your Answer"
                                    value={aboutyou[question]}
                                    onChangeText={(text) => setAboutYou({ ...aboutyou, [question]: text })}
                                    style={{
                                        height: 50,
                                        backgroundColor: "white",
                                        borderColor: 'gray',
                                        borderWidth: 1,
                                        borderRadius: 30,
                                        padding: 10
                                    }}
                                />
                            </View>
                        ))}
                    </View>

                    {/* Continue Button */}
                    <View style={{ marginBottom: 20 }}>
                        <Pressable onPress={() => setstep(step + 1)} className="w-full h-12 flex justify-center items-center bg-[#04714A] rounded-lg active:opacity-80">
                            <Text className="text-white text-lg">Continue</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
