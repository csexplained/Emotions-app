import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Animated,
    Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, RelativePathString } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import EmotionService from '@/lib/emotion';
import { EmotionType } from '@/types/category.types';

const { width, height } = Dimensions.get('window');

const COLORS = {
    primary: '#04714A',
    primaryLight: '#E7FFF4',
    background: '#F8FFFC',
    textPrimary: '#1A1F2C',
    textSecondary: '#64748B',
    white: '#FFFFFF',
    border: '#E5F5EF'
};

const Categories = () => {
    const [emotions, setEmotions] = useState<EmotionType[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        fetchEmotions();
    }, []);

    useEffect(() => {
        if (!loading && emotions.length > 0) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }).start();
        }
    }, [loading, emotions]);

    const fetchEmotions = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await EmotionService.getEmotions();
            setEmotions(data);
        } catch (err) {
            console.log("Failed to fetch emotions:", err);
            setError("Failed to load emotions. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getGradient = (color: string) => {
        // Use the color from the emotion data and create a gradient
        return [color, `${color}CC`];
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading emotions...</Text>
            </View>
        );
    }

    if (error && emotions.length === 0) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="sad-outline" size={48} color={COLORS.textSecondary} />
                <Text style={styles.errorTitle}>Unable to Load</Text>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchEmotions}>
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.title}>How are you feeling today?</Text>
                    <Text style={styles.subtitle}>
                        Choose an emotion to explore guided activities and resources
                    </Text>
                </View>

                {error && (
                    <View style={styles.errorBanner}>
                        <Ionicons name="warning-outline" size={16} color="#DC2626" />
                        <Text style={styles.errorBannerText}>{error}</Text>
                    </View>
                )}
            </View>

            {/* Main Content - Vertical List Layout */}
            <Animated.ScrollView
                style={[styles.scrollContainer, { opacity: fadeAnim }]}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Illustration */}
                <View style={styles.heroSection}>
                    <View style={styles.illustrationContainer}>
                        <View style={styles.circleOuter}>
                            <View style={styles.circleMiddle} />
                            <View style={styles.circleInner} />
                            <View style={styles.brainContainer}>
                                <Ionicons name="heart" size={40} color={COLORS.primary} />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Emotions List */}
                <View style={styles.listSection}>
                    <Text style={styles.listTitle}>Emotion Categories</Text>
                    <Text style={styles.listSubtitle}>
                        Tap on any emotion to explore activities and resources
                    </Text>

                    <View style={styles.cardsList}>
                        {emotions.map((emotion) => {
                            const colors = getGradient(emotion.color);
                            const isActive = selected === emotion.$id;

                            return (
                                <Link
                                    key={emotion.$id}
                                    href={`/Activitys/${emotion.name}` as RelativePathString}
                                    asChild
                                >
                                    <TouchableOpacity
                                        style={[styles.cardContainer, isActive && styles.cardActive]}
                                        onPress={() => {
                                            setSelected(emotion.$id);
                                            setTimeout(() => setSelected(null), 600);
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        <View style={styles.cardContent}>
                                            {/* Icon and Gradient */}
                                            <LinearGradient
                                                colors={colors as [string, string]}
                                                style={styles.gradient}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                            >
                                                <View style={styles.iconContainer}>
                                                    <Text style={styles.icon}>{emotion.icon}</Text>
                                                </View>

                                                {/* Active State Overlay */}
                                                {isActive && (
                                                    <View style={styles.activeOverlay}>
                                                        <Ionicons name="checkmark-circle" size={24} color="white" />
                                                    </View>
                                                )}
                                            </LinearGradient>

                                            {/* Emotion Info */}
                                            <View style={styles.emotionInfo}>
                                                <Text style={styles.emotionName}>
                                                    {emotion.displayName || emotion.name}
                                                </Text>
                                                <Text style={styles.emotionDescription}>
                                                    {emotion.description}
                                                </Text>
                                            </View>

                                            {/* Arrow Indicator */}
                                            <View style={styles.arrowContainer}>
                                                <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </Link>
                            );
                        })}
                    </View>
                </View>

                {/* Info Section */}
                <View style={styles.infoSection}>
                    <View style={styles.infoCard}>
                        <Ionicons name="information-circle-outline" size={24} color={COLORS.primary} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoTitle}>About Emotion Categories</Text>
                            <Text style={styles.infoText}>
                                Each emotion category contains curated activities, readings, and exercises
                                to help you understand and manage your feelings in healthy ways.
                                Explore different emotional states to find the support you need.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Bottom Spacer */}
                <View style={styles.bottomSpacer} />
            </Animated.ScrollView>
        </View>
    );
};

export default Categories;

// ✅ Vertical List Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: COLORS.background,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginTop: 16,
        marginBottom: 8,
    },
    errorText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    retryButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    retryButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
        paddingBottom: 20,
        backgroundColor: COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerContent: {
        marginBottom: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        fontWeight: '500',
        lineHeight: 22,
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF2F2',
        padding: 12,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#DC2626',
        gap: 8,
    },
    errorBannerText: {
        fontSize: 14,
        color: '#DC2626',
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    heroSection: {
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 24,
    },
    illustrationContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleOuter: {
        position: 'relative',
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleMiddle: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 2,
        borderColor: 'rgba(4, 113, 74, 0.3)',
    },
    circleInner: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: 'rgba(4, 113, 74, 0.5)',
    },
    brainContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    listSection: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    listTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 8,
        textAlign: 'center',
    },
    listSubtitle: {
        fontSize: 15,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 20,
    },
    cardsList: {
        gap: 16,
    },
    cardContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardActive: {
        transform: [{ scale: 1.01 }],
        backgroundColor: COLORS.primaryLight,
        borderColor: COLORS.primary,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    gradient: {
        width: 60,
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        overflow: "hidden",
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontSize: 24,
    },
    activeOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emotionInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    emotionName: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 4,
        textTransform: 'capitalize',
    },
    emotionDescription: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 18,
        fontWeight: '500',
    },
    arrowContainer: {
        padding: 4,
    },
    infoSection: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: COLORS.primaryLight,
        padding: 20,
        borderRadius: 16,
        gap: 12,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },
    bottomSpacer: {
        height: 40,
    },
});