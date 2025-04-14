import React from "react";
import { View, Pressable, Text, Image, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Dimensions } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Redirect, router } from "expo-router";
import Card from "@/components/Infotab/AngerCard";
import Humanicon from "@/assets/icons/humanicon";
import { NormalIcon, HappyIcon, AngerIcon, SadIcon } from '@/assets/icons/emotionemojis';
import CardData from "@/types/Carddata.types";
const cardsData: CardData[] = [
    {
        id: '906', // Happiness reading activity
        icon: <HappyIcon height={32} />,
        bgColor: "#FFFDE7",
        type: "Calm",
        iconBgColor: "#FFD600",
        issueText: "Want More Joy?",
        description: "Build joy through gratitude and purpose.",

    },
    {
        id: '901', // Anger reading activity
        icon: <AngerIcon height={32} />,
        bgColor: "#FFE7E7",
        type: "Anger",
        iconBgColor: "#FF4A4A",
        issueText: "Feeling Angry?",
        description: "Learn how to use anger constructively.",

    },
    {
        id: '903', // Blame reading activity
        icon: <NormalIcon height={32} />,
        bgColor: "#FFF4E7",
        type: "Blame",
        iconBgColor: "#FF9E00",
        issueText: "Caught in Blame?",
        description: "Shift blame into personal power.",

    },
    {
        id: '904', // Sorrow reading activity
        icon: <SadIcon height={32} />,
        bgColor: "#D9E6FF",
        type: "Sorrow",
        iconBgColor: "#6789FF",
        issueText: "Feeling Low?",
        description: "Explore how sorrow leads to healing.",

    },
    {
        id: '905', // Confusion reading activity
        icon: <Humanicon height={32} />,
        bgColor: "#E7FFFB",
        type: "Confusion",
        iconBgColor: "#00C6AE",
        issueText: "Mentally Foggy?",
        description: "Turn confusion into clarity.",

    },
    {
        id: '906', // Happiness reading activity
        icon: <HappyIcon height={32} />,
        bgColor: "#FFFDE7",
        type: "Happiness",
        iconBgColor: "#FFD600",
        issueText: "Want More Happiness?",
        description: "Build Happiness through gratitude and purpose.",

    }
];


export default function Indexscreen() {

    // Function to chunk array into groups of 2 for 2-column layout
    const chunkArray = (array: CardData[], chunkSize: number) => {
        const result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize));
        }
        return result;
    };

    const cardRows = chunkArray(cardsData, 2);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, backgroundColor: "#F0FFFA" }}
        >

            {/* Sticky Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </Pressable>
                <Text style={[styles.title, { textAlign: 'center' }]}>Information</Text>
                {/* Add an empty view to balance the flex layout */}
                <View style={styles.backButton2} />
            </View>

            {/* Scrollable Content */}
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.circleContainer}>
                    <View style={styles.circleOuter}>
                        <View style={styles.circleMiddle} />
                        <View style={styles.circleInner} />
                        <View style={styles.imageContainer}>
                            <Image
                                source={require("@/assets/images/brain.png")}
                                style={styles.brainImage}
                            />
                        </View>
                    </View>
                </View>

                {/* Cards Grid - 2 per row */}
                <View style={styles.cardsGrid}>
                    {cardRows.map((row, rowIndex) => (
                        <View key={`row-${rowIndex}`} style={styles.cardRow}>
                            {row.map((card) => (
                                <Card
                                    type={card.type}
                                    key={card.id}
                                    icon={card.icon}
                                    bgColor={card.bgColor}
                                    iconBgColor={card.iconBgColor}
                                    issueText={card.issueText}
                                    description={card.description}
                                />
                            ))}
                            {/* Add empty view if odd number of cards */}
                            {row.length < 2 && <View style={styles.emptyCard} />}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - (CARD_MARGIN * 3)) / 2; // 2 cards per row

const styles = StyleSheet.create({

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
        paddingVertical: 5,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        zIndex: 1,
        backgroundColor: '#F0FFFA', // Match your background color
    },
    title: {
        fontFamily: 'Inter-Black',
        fontSize: 20,
        flex: 1,
        textAlign: 'center', // Center the text
    },
    backButton: {
        backgroundColor: 'white',
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
        paddingTop: 20, // Space for header
        paddingBottom: 70,
        paddingHorizontal: CARD_MARGIN,
    },
    cardsGrid: {
        flexDirection: 'column',
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: CARD_MARGIN,
    },
    emptyCard: {
        width: CARD_WIDTH,
    },
});