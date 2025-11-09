import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, RelativePathString } from 'expo-router';
import EmotionService from '@/lib/emotion';
import { EmotionType } from '@/types/category.types';

const { width } = Dimensions.get('window');

const COLORS = {
    primary: '#04714A',
    background: '#F8FFFC',
    textPrimary: '#1A1F2C',
    textSecondary: '#64748B',
    white: '#FFFFFF'
};

const CATEGORY_GRADIENTS = [
    ['#667eea', '#764ba2'],
    ['#f093fb', '#f5576c'],
    ['#ff6b6b', '#ee5a24'],
    ['#4facfe', '#00f2fe'],
    ['#a8edea', '#fed6e3'],
    ['#ffd89b', '#19547b'],
    ['#4ECDC4', '#44A08D'],
    ['#96CEB4', '#FECA57'],
];

const CARD_SIZE = 72;
const CARD_THEME_HEIGHT = 96;

const Categories = () => {
    const [emotions, setEmotions] = useState<EmotionType[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [scrollX] = useState(new Animated.Value(0));

    useEffect(() => {
        fetchEmotions();
    }, []);

    const fetchEmotions = async () => {
        try {
            const data = await EmotionService.getEmotions();
            setEmotions(data);
        } catch {
            console.log("Failed to fetch emotions");
        } finally {
            setLoading(false);
        }
    };

    const getGradient = (index: number, color?: string) => {
        if (index < CATEGORY_GRADIENTS.length) return CATEGORY_GRADIENTS[index];
        return color ? [color, color + "CC"] : ['#667eea', '#764ba2'];
    };

    return (
        <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>How are you feeling?</Text>
                <Text style={styles.subtitle}>Choose an emotion to explore activities</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
                <>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: false }
                        )}
                        scrollEventThrottle={16}
                    >
                        {emotions.map((em, i) => {
                            const colors = getGradient(i, em.color);
                            const isActive = selected === em.$id;

                            return (
                                <Link key={em.$id} href={`/Activitys/${em.name}` as RelativePathString} asChild>
                                    <TouchableOpacity
                                        style={[styles.cardContainer, isActive && styles.cardActive]}
                                        onPress={() => {
                                            setSelected(em.$id);
                                            setTimeout(() => setSelected(null), 900);
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        <View style={styles.card}>
                                            <LinearGradient
                                                colors={colors as [string, string]}
                                                style={styles.gradient}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                            >
                                                <View style={styles.iconBox}>
                                                    <Text style={styles.icon}>{em.icon}</Text>
                                                </View>
                                            </LinearGradient>
                                        </View>


                                        <View style={styles.nameContainer}>
                                            <Text style={styles.name} numberOfLines={1}>
                                                {em.displayName || em.name}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </Link>
                            );
                        })}
                    </ScrollView>
                </>
            )}
        </View>
    );
};

export default Categories;

// ✅ Styles
const styles = StyleSheet.create({
    container: {
        paddingVertical: 5,
        paddingHorizontal: 20,
    },
    header: {
        marginBottom: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    scrollContent: {
        gap: 10,
        paddingRight: 20,
        paddingVertical: 10,
    },
    card: {
        width: CARD_SIZE,

    },
    gradient: {
        width: CARD_SIZE,
        height: CARD_SIZE,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
        overflow: "hidden",
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontSize: 20,
    },

    // INSIDE LABEL
    cardLabelBox: {
        position: "absolute",
        bottom: 6,
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        maxWidth: "90%",
    },
    cardLabel: {
        fontSize: 10,
        color: "#fff",
        fontWeight: "600",
        textAlign: "center",
    },
    cardContainer: {
        width: "auto",
        alignItems: 'center',
    },
    cardActive: {
        transform: [{ scale: 1.05 }],
    },
    nameContainer: {
        width: "auto",
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 8,
        backgroundColor: 'transparent',

    },
    name: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.textPrimary,
        textAlign: 'center',
        letterSpacing: -0.2,
        textTransform: 'capitalize',
    },
    // Dots
    dotRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 16,
        gap: 6,
    },
    dot: {
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.primary,
    }
});
