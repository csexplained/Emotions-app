
import React from "react";
import { View, Pressable, Text, Image, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Dimensions, TextInput } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import Card from "@/components/Infotab/AngerCard";
import Humanicon from "@/assets/icons/humanicon";
import Categories from '@/components/Home/Categories';
import { Entypo, Feather } from "@expo/vector-icons";
import NotificationIcon from "@/assets/icons/Bellicon"
import ActivityCard from "@/components/Home/ActivityCard";
import CardData from "@/types/Carddata.types";

const cardsData: CardData[] = [
  {
    id: '1',
    icon: <Humanicon />,
    bgColor: "#F0F8FF",
    iconBgColor: "#4A90E2",
    issueText: "Network Issue",
    description: "Connection problems detected"
  },
  {
    id: '2',
    icon: <Humanicon />,
    bgColor: "#FFE7DB",
    iconBgColor: "#FF69B4",
    issueText: "Storage Full",
    description: "90% of storage used"
  },
  {
    id: '3',
    icon: <Humanicon />,
    bgColor: "#FFFBDB",
    iconBgColor: "#4A90E2",
    issueText: "Battery Low",
    description: "Only 15% battery remaining"
  },
  {
    id: '4',
    icon: <Humanicon />,
    bgColor: "#DBEBFF",
    iconBgColor: "#FF69B4",
    issueText: "Update Available",
    description: "New version ready to install"
  },
  {
    id: '5',
    icon: <Humanicon />,
    bgColor: "#DEFFDB",
    iconBgColor: "#4A90E2",
    issueText: "Security Alert",
    description: "Review recent login activity"
  },
  {
    id: '6',
    icon: <Humanicon />,
    bgColor: "#FFDBDB",
    iconBgColor: "#FF69B4",
    issueText: "Memory Usage",
    description: "High memory consumption"
  },
  {
    id: '1',
    icon: <Humanicon />,
    bgColor: "#F0F8FF",
    iconBgColor: "#4A90E2",
    issueText: "Network Issue",
    description: "Connection problems detected"
  },
  {
    id: '2',
    icon: <Humanicon />,
    bgColor: "#FFE7DB",
    iconBgColor: "#FF69B4",
    issueText: "Storage Full",
    description: "90% of storage used"
  },
  {
    id: '3',
    icon: <Humanicon />,
    bgColor: "#FFFBDB",
    iconBgColor: "#4A90E2",
    issueText: "Battery Low",
    description: "Only 15% battery remaining"
  },
  {
    id: '4',
    icon: <Humanicon />,
    bgColor: "#DBEBFF",
    iconBgColor: "#FF69B4",
    issueText: "Update Available",
    description: "New version ready to install"
  },
  {
    id: '5',
    icon: <Humanicon />,
    bgColor: "#DEFFDB",
    iconBgColor: "#4A90E2",
    issueText: "Security Alert",
    description: "Review recent login activity"
  },
  {
    id: '6',
    icon: <Humanicon />,
    bgColor: "#FFDBDB",
    iconBgColor: "#FF69B4",
    issueText: "Memory Usage",
    description: "High memory consumption"
  },
];

export default cardsData