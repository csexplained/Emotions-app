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
    type: string;
}


const Card: React.FC<CardProps> = ({
    icon,
    bgColor,
    iconBgColor,
    issueText,
    description,
    type
}) => {
    return (
        <View style={[styles.cardContainer, { backgroundColor: bgColor }]}>
            <Link href={`/Activitys/${type}` as RelativePathString}>
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
