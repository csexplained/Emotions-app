import React from "react";
import {
    View,
    Pressable,
    Text,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from 'expo-router';
import activitiesData from "@/Data/activity";

export default function Indexscreen() {
    const { id } = useLocalSearchParams();

    const fulldata = activitiesData.filter((activity) => activity.id === id)[0];
    const data = fulldata.data
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
                <Text style={[styles.title, { textAlign: 'center' }]}>{fulldata.title}</Text>
                <TouchableOpacity style={styles.backButton}>
                    <Feather name="send" size={20} color={"#ffffff"} />
                </TouchableOpacity>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ paddingHorizontal: 14 }}>
                    {/* 16:9 Image at the top */}
                    <Image
                        source={require('@/assets/images/Allgood.png')}
                        style={styles.topImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Episode Number */}
                <Text style={styles.episodeText}>Type: {fulldata.type}</Text>

                {/* Title */}
                <Text style={styles.contentTitle}>{data.name}</Text>

                {/* Description */}
                <Text style={styles.description}>
                    {data.description}
                </Text>

                {/* Spacer for the sticky button */}
                <View style={styles.spacer} />
            </ScrollView>

            {/*
           
            <View style={styles.stickyButtonContainer}>
                <TouchableOpacity style={styles.continueButton}>
                    <Text style={styles.continueButtonText}>Mark as Read</Text>
                </TouchableOpacity>
            </View>
            */}
        </KeyboardAvoidingView>
    );
}

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = (width * 9) / 16; // 16:9 aspect ratio

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 80, // Space for sticky button
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 5,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        zIndex: 1,
        backgroundColor: '#F0FFFA',
    },
    title: {
        fontFamily: 'Inter-Black',
        fontSize: 15,
        fontWeight: "500",
        flex: 1,
        textAlign: 'center',
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
    topImage: {
        width: '100%',
        height: IMAGE_HEIGHT,
    },
    episodeText: {
        fontSize: 14,
        color: '#04714A',
        fontWeight: '600',
        paddingHorizontal: 20,
        marginBottom: 8,
    },
    contentTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#555',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    spacer: {
        height: 20,
    },
    stickyButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
    },
    continueButton: {
        backgroundColor: '#04714A',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#04714A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    continueButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});