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
import { Link } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Checkbox from "expo-checkbox";
import userdata from "@/types/user.types";

interface OtpScreenProps {
    userdata: userdata;
    setUserData: (userdata: userdata) => void;
    setstep: (step: number) => void;
    totalsteps: number;
    step: number;
}


export default function Stepone({ step, totalsteps, userdata, setUserData, setstep }: OtpScreenProps) {
    const [isChecked, setIsChecked] = useState(false);

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

                    <View style={{ marginTop: 30 }}>
                        <Text style={{ fontWeight: "700" }} className="text-3xl">Create Your Profile</Text>
                        <Text className="text-lg text-[#00000080] font-normal my-2">
                            Start Your journey towards better Mental Health
                        </Text>
                    </View>
                    <View style={{ gap: 20, }} className="flex-row gap-2 justify-between">


                        <View style={{ width: "45%" }} className="w-1/2 ">
                            <Text style={{ fontWeight: "800" }} className="text-sm my-2">First Name</Text>
                            <TextInput
                                placeholder="Your First Name"
                                value={userdata.firstname}
                                onChangeText={(text) => setUserData({ ...userdata, firstname: text })}
                                style={{ height: 50, backgroundColor: "white", borderColor: 'gray', borderWidth: 1, borderRadius: 10, padding: 10 }}
                            />
                        </View>

                        <View style={{ width: "45%" }} className="w-1/2 ">
                            <Text style={{ fontWeight: "800" }} className="text-sm my-2">Last Name</Text>
                            <TextInput
                                placeholder="Your Last Name"
                                value={userdata.lastname}
                                onChangeText={(text) => setUserData({ ...userdata, lastname: text })}
                                style={{ height: 50, backgroundColor: "white", borderColor: 'gray', borderWidth: 1, borderRadius: 10, padding: 10 }}
                            />
                        </View>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontWeight: "400" }} className="text-sm my-2">Gender</Text>
                        <View className="flex-row justify-between">
                            {["male", "female", "other"].map((gender) => (
                                <Pressable
                                    key={gender}
                                    style={{ borderColor: 'gray', borderWidth: 1, borderRadius: 10, padding: 10, width: "30%", backgroundColor: userdata.gender === gender ? "green" : "white" }}
                                    className={`p-2 rounded-lg border flex flex-row gap-2 justify-center items-center ${userdata.gender === gender ? 'bg-green-500' : 'bg-white'}`}
                                    onPress={() => setUserData({ ...userdata, gender })}
                                >
                                    {gender === "male" && <FontAwesome name="mars" size={20} color={userdata.gender === gender ? "white" : "black"} />}
                                    {gender === "female" && <FontAwesome name="venus" size={20} color={userdata.gender === gender ? "white" : "black"} />}
                                    {gender === "other" && <FontAwesome name="genderless" size={20} color={userdata.gender === gender ? "white" : "black"} />}
                                    <Text className={userdata.gender === gender ? "text-white" : "text-black"}>
                                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text className="text-lg font-semibold my-2">Mobile Number</Text>
                        <TextInput
                            placeholder="Your Mobile Number"
                            keyboardType="phone-pad"
                            value={userdata.mobileNumber}
                            onChangeText={(text) => setUserData({ ...userdata, mobileNumber: text })}
                            style={{ height: 50, backgroundColor: "white", borderColor: 'gray', borderWidth: 1, borderRadius: 10, padding: 10 }}
                        />
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text className="text-lg font-semibold my-2">Email</Text>
                        <TextInput
                            placeholder="Your Email"
                            keyboardType="email-address"
                            value={userdata.email}
                            onChangeText={(text) => setUserData({ ...userdata, email: text })}
                            style={{ height: 50, backgroundColor: "white", borderColor: 'gray', borderWidth: 1, borderRadius: 10, padding: 10 }}
                        />
                    </View>
                    <View style={{ gap: 20, marginTop: 10 }} className="flex-row gap-2 justify-between">
                        <View style={{ width: "45%" }} className="w-1/2 ">
                            <Text style={{ fontWeight: 600 }} className="text-sm  my-2">City</Text>
                            <TextInput
                                className="rounded-lg"
                                placeholder="Your City"
                                value={userdata.city}
                                onChangeText={(text) => setUserData({ ...userdata, city: text })}
                                style={{ height: 50, backgroundColor: "white", borderColor: 'gray', borderWidth: 1, borderRadius: 10, padding: 10 }}
                            />
                        </View>
                        <View style={{ width: "45%" }} className="w-1/2 ">
                            <Text style={{ fontWeight: 600 }} className="text-sm  my-2">Country</Text>
                            <TextInput
                                className="rounded-lg"
                                placeholder="Your Country"
                                value={userdata.country}
                                onChangeText={(text) => setUserData({ ...userdata, country: text })}
                                style={{ height: 50, backgroundColor: "white", borderColor: 'gray', borderWidth: 1, borderRadius: 10, padding: 10 }}
                            />
                        </View>
                    </View>
                    <View style={{ marginTop: 20 }} className="flex-row items-center my-4">
                        <Checkbox style={{ borderColor: "#04714A", borderRadius: 5 }} value={isChecked} onValueChange={setIsChecked} />
                        <Text style={{ paddingLeft: 10, fontWeight: "500" }}>
                            I accept the <Text style={{ color: "#04714A", textDecorationLine: "underline" }}>Terms and Conditions</Text>
                        </Text>
                    </View>
                    {/* Bottom Section (Sign Up Button) */}
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
