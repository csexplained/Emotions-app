import { useRouter, Link } from "expo-router";
import { useState } from "react";
import { View, TextInput, Image, Text, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {

    const [step, setStep] = useState(1);
    const [number, setnumber] = useState("");
    const [countrycode, setcountrycode] = useState("+91");
    const [otp, setotp] = useState("");

    return (

        <View className="w-full  bg-[#F0FFFA] justify-center items-center">
            <Image
                source={require('@/assets/images/getstartedpagebg.png')}
                className="w-max h-max"
            />

            <View className="px-4 py-8 w-full">
                <View className="bg-[#FFFFFF] border shadow-lg rounded-3xl px-4 py-8 w-full h-full">
                    <Image
                        source={require('@/assets/images/logosmall.png')}
                        className="w-10 h-10"
                        resizeMode="contain"
                    />
                    <Text className="text-2xl  font-extrabold text-left ">Get Started</Text>
                    <Text className="text-sm font-normal text-center my-2">Curated activities at your fingertips</Text>
                    {/* it will be at the bottem of current div */}

                </View>
            </View>
        </View>
    );
}
