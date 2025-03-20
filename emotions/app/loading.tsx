import { View, Image, Text } from "react-native"
export default function LoadingScreen() {
    return (
        <View className='w-full gap-2 flex justify-center items-center bg-[#04714A] h-full'>
            <Image source={require('@/assets/images/Emotionslogo.png')} className='h-max w-full' />
            <Text className='color-white text-lg font-sans font-semibold '>EMOTIONS</Text>
        </View>
    )
}