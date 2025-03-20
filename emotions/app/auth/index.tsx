import { View, TextInput, Image, Text, Pressable } from "react-native";
import { Link } from "expo-router";

export default function IndexScreen() {

    return (
        <View className="flex flex-col bg-[#F0FFFA] justify-start items-center">
            <View className="bg-[#F0FFFA] w-full h-[75vh]">
                <View className="flex h-[90%] px-2 justify-center items-center w-full">
                    <Image source={require("@/assets/images/Signuppages.png")} className="w-max h-max" />
                </View>
                <View className="flex h-max p-2 flex-row justify-evenly items-center w-full">
                    <View className="w-[25%] rounded-sm h-1 bg-[#04714A]"></View>
                    <View className="w-[25%] rounded-sm h-1 bg-[#04714baf]"></View>
                    <View className="w-[25%] rounded-sm h-1 bg-[#04714baf]"></View>
                </View>
            </View>
            <View className="bg-[#FFFFFF] border  rounded-3xl px-4 py-8 w-full h-full">
                <Text className="text-2xl font-semibold text-center">Discover Experiences with a simple swipe</Text>
                <Text className="text-sm font-normal text-center my-2">Curated activities at your fingertips</Text>
                {/* it will be at the bottem of current div */}

                <Link href="/auth/login" asChild>
                    <Pressable className="w-full h-12 my-4 flex justify-center items-center bg-[#04714A] rounded-lg active:opacity-80">
                        <Text className="text-white text-lg">Sign Up</Text>
                    </Pressable>
                </Link>
            </View>
        </View>
    );
}