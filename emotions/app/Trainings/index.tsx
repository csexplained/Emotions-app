import React from "react";
import { View, Pressable, Text, Image, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Dimensions, TextInput } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import Card from "@/components/Infotab/AngerCard";
import Humanicon from "@/assets/icons/humanicon";
import Categories from '@/components/Home/Categories';
import cardsData from '@/Data/Categorys'
import { Entypo, Feather } from "@expo/vector-icons";
import NotificationIcon from "@/assets/icons/Bellicon"
import ActivityCard from "@/components/Home/ActivityCard";
import CardData from "@/types/Carddata.types";
import activitiesData from "@/Data/activity";

export default function Indexscreen() {


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#F0FFFA" }}
    >
      {/* Sticky Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </Pressable>
        <Text style={[styles.title, { textAlign: 'center' }]}>Trainings</Text>
        {/* Add an empty view to balance the flex layout */}
        <View style={styles.backButton2} />
      </View>
      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {activitiesData.map(activity => (
          <ActivityCard {...activity} />
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const { width } = Dimensions.get('window');
const CARD_MARGIN = 12;
const CARD_WIDTH = (width - (CARD_MARGIN * 3)) / 2; // 2 cards per row

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 0,
    borderRadius: 30,
    padding: 5,
    borderColor: "#04714A",
    backgroundColor: 'white',
    borderWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 50,
    maxHeight: 120,
    paddingHorizontal: 12,
    fontWeight: "800",
    paddingVertical: 14,
    borderRadius: 20,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#04714A",
    color: "ffffff",
    borderRadius: 30,
    padding: 10,
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleOuter: {
    position: 'relative',
    width: 240,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleMiddle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  circleInner: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: '#888',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    backgroundColor: 'white',
    height: 40,
    marginRight: 12,
    borderRadius: 5, // Circular logo
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 25,
    marginHorizontal: 8,
  },
  headerText: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  aiText: {
    color: '#04714A',
    fontWeight: 'bold',
  },
  flexbox: {
    height: "auto",
    alignItems: "flex-start",
    alignContent: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 12,
    color: '#6C6C6C',
  },
  menuButton: {
    borderRadius: 50,
    backgroundColor: 'white',
    padding: 10,
  },
  imageContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: '#555',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brainImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // This will properly space the items
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    zIndex: 1,
    backgroundColor: '#F0FFFA', // Match your background color
  },
  title: {
    fontFamily: 'Inter-Black',
    fontSize: 20,
    flex: 1,
    fontWeight: 800,
    textAlign: 'center', // Center the text
  },
  backButton: {
    backgroundColor: '#04714A',
    padding: 8,
    borderRadius: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton2: {
    padding: 8,
    borderRadius: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    paddingTop: 4, // Space for header
    paddingBottom: 70,
    paddingHorizontal: CARD_MARGIN,
  },

});