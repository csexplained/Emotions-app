import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Humanicon from "@/assets/icons/humanicon"
import { Redirect, RelativePathString } from 'expo-router';
import { Link } from 'expo-router';
import { NormalIcon, HappyIcon, AngerIcon, SadIcon } from '@/assets/icons/emotionemojis';
import CardData from '@/types/Carddata.types';

interface CardProps {
    icon: React.ReactNode;
    bgColor: string;
    iconBgColor: string;
    issueText: string;
    description: string;
    redirect: string;
}

const cardsData: CardData[] = [
    {
        id: '901', // Anger reading activity
        icon: <AngerIcon height={35}  />,
        bgColor: "#FFE7E7",
        iconBgColor: "#FF4A4A",
        issueText: "Feeling Angry?",
        description: "Learn how to use anger constructively.",
        redirect: "/Trainings/Readingscreen?id=901"
    },
    {
        id: '901', // Fear reading activity
        icon: <SadIcon height={55} width={55} />,
        bgColor: "#E7F3FF",
        iconBgColor: "#4A90E2",
        issueText: "Fear Taking?",
        description: "Discover how fear can lead to growth.",
        redirect: "/Trainings/Readingscreen?id=902"
    },
    {
        id: '903', // Blame reading activity
        icon: <NormalIcon height={55} width={55} />,
        bgColor: "#FFF4E7",
        iconBgColor: "#FF9E00",
        issueText: "Caught in Blame?",
        description: "Shift blame into personal power.",
        redirect: "/Trainings/Readingscreen?id=903"
    },
    {
        id: '904', // Sorrow reading activity
        icon: <SadIcon height={55} width={55} />,
        bgColor: "#D9E6FF",
        iconBgColor: "#6789FF",
        issueText: "Feeling Low?",
        description: "Explore how sorrow leads to healing.",
        redirect: "/Trainings/Readingscreen?id=904"
    },
    {
        id: '905', // Confusion reading activity
        icon: <Humanicon height={55} width={55} />,
        bgColor: "#E7FFFB",
        iconBgColor: "#00C6AE",
        issueText: "Mentally Foggy?",
        description: "Turn confusion into clarity.",
        redirect: "/Trainings/Readingscreen?id=905"
    },
    {
        id: '906', // Happiness reading activity
        icon: <HappyIcon height={55} width={55} />,
        bgColor: "#FFFDE7",
        iconBgColor: "#FFD600",
        issueText: "Want More Joy?",
        description: "Build joy through gratitude and purpose.",
        redirect: "/Trainings/Readingscreen?id=906"
    }
];

const Card: React.FC<CardProps> = ({
    icon,
    bgColor,
    iconBgColor,
    issueText,
    description,
    redirect
}) => {
    return (
        <View style={[styles.cardContainer, { backgroundColor: bgColor }]}>
            <Link href={redirect as RelativePathString}>
                <View style={styles.topSection}>
                    <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
                        {icon}
                    </View>
                    <Text style={styles.issueText}>{issueText}</Text>
                </View>
                <Text style={styles.descriptionText}>{description}</Text>
            </Link>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: 150,
        height: 113,
        borderRadius: 12,
        padding: 12,
        margin: 8,
        justifyContent: 'space-between',
    },
    topSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    issueText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flexShrink: 1,
    },
    descriptionText: {
        fontSize: 12,
        color: '#666',
    },
});

export default Card;
