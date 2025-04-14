import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { ExternalPathString, Link, Redirect, RelativePathString } from 'expo-router';

interface ActivityCardProps {
    id: string
    title?: string;
    description?: string;
    tags?: string[];
    duration?: string;
    image?: any;
    colors?: [string, string];
    redirect: string
}

const ActivityCard: React.FC<ActivityCardProps> = ({
    title = "Activity 1",
    id,
    description = "This is a sample activity description",
    tags = ["Meditation", "Sleep", "Calm", "Mindfulness", "Relaxation"],
    duration = "45 min",
    image = require('@/assets/images/ActivityCard.png'),
    colors = ["#D7FFF1", "#58DFAE"],
    redirect = "/Trainings/trainingscreen"
}) => {
    const generateTagColors = (baseColor: string, count: number) => {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const hueShift = (i * 30) % 360;
            colors.push(adjustHue(baseColor, hueShift)); // Ensure adjustHue is defined or imported
        }
        return colors;
    };

    const tagColors = generateTagColors(colors[1], tags.length);

    return (

        <View style={styles.cardContainer}>
            <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBackground}
            >
                <Link href={`${redirect}?id=${id}` as RelativePathString}>
                    <View style={styles.cardContent}>
                        <View style={styles.textContent}>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.description}>{description}</Text>

                            <View style={styles.tagsContainer}>
                                {tags.map((tag, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.tag,
                                            {
                                                backgroundColor: tagColors[index],
                                                opacity: 0.8,
                                            }
                                        ]}
                                    >
                                        <Text style={styles.tagText}>#{tag}</Text>
                                    </View>
                                ))}
                            </View>

                            <TouchableOpacity style={styles.playButton}>
                                <FontAwesome name='play-circle' size={20} color={"#ffffff"} />
                                <Text style={styles.playButtonText}>  {duration}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <ImageBackground
                                source={{ uri: image }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                </Link>
            </LinearGradient>

        </View >

    );
};
// Helper function to adjust hue of a hex color
const adjustHue = (hex: string, degrees: number) => {
    // This is a simplified version - in a real app you might want a more robust solution
    const hsl = hexToHSL(hex);
    hsl.h = (hsl.h + degrees) % 360;
    return HSLToHex(hsl);
};

// Helper functions for color conversion (simplified)
const hexToHSL = (hex: string) => {
    // Convert hex to RGB first
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;

    // Then convert RGB to HSL
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
};

const HSLToHex = (hsl: { h: number, s: number, l: number }) => {
    let { h, s, l } = hsl;
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c / 2,
        r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }

    // Having obtained RGB, convert channels to hex
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};


const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        minHeight: 180, // Minimum height to ensure content fits
        marginVertical: 10,
    },
    gradientBackground: {
        flex: 1,
        padding: 0,
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        paddingRight: '30%', // Make space for the image
    },
    textContent: {
        flex: 1,
        padding: 20,
        justifyContent: "space-between",
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    description: {
        fontSize: 12,
        color: '#6E6E6E',
        marginBottom: 12,
        lineHeight: 16,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    tag: {
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginRight: 6,
        marginBottom: 6,
    },
    tagText: {
        fontSize: 9,
        color: '#000',
        fontWeight: '500',
    },
    playButton: {
        backgroundColor: '#04714A',
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
        minWidth: 100,
    },
    playButtonText: {
        fontSize: 16,
        color: 'white',
        fontWeight: '800',
    },
    imageContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '45%',
        justifyContent: 'center',
        alignItems: "center"
    },
    image: {
        width: '90%',
        height: '100%',
        aspectRatio: 1, // Maintain aspect ratio
    },
});

export default ActivityCard;