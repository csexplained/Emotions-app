import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useRef, useState } from "react";
import { View, Pressable, Text, Image, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { Link } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';


export default function HomeScreen() {
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
            <View className="w-full h-[50%] justify-center items-center">
              <HelloWave />
            </View>
            <View className="w-full h-[50%] justify-center items-center">
              <ThemedText className="text-3xl font-bold text-[#04714A]">
                How are you feeling today?
              </ThemedText>
            </View>
            
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
