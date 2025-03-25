import React from "react";
import { View, Pressable, Text, Image, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Dimensions } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import Card from "@/components/Infotab/AngerCard";
import Humanicon from "@/assets/icons/humanicon";

type CardData = {
    id: string;
    icon: JSX.Element;
    bgColor: string;
    iconBgColor: string;
    issueText: string;
    description: string;
};

export default function Indexscreen() {

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
                <View style={styles.backButton} />
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
        paddingVertical: 10,
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
    scrollContainer: {
        paddingTop: 20, // Space for header
        paddingBottom: 20,
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