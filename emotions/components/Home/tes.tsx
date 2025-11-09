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

// Modern color palette matching your theme
const COLOR_PALETTE = {
    primary: '#04714A',
    primaryLight: '#58DFAE',
    background: '#F8FFFC',
    cardBackground: '#FFFFFF',
    textPrimary: '#1A1F2C',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    border: '#E2E8F0',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
};

// Modern gradient combinations
const GRADIENT_PRESETS = [
    ['#667eea', '#764ba2'], // Purple to blue
    ['#4ECDC4', '#44A08D'], // Teal to green
    ['#FF9A9E', '#FECFEF'], // Pink to light pink
    ['#A8EDEA', '#FED6E3'], // Pastel mix
    ['#96CEB4', '#FECA57'], // Mint to yellow
    ['#54A0FF', '#5F27CD'], // Blue to purple
    ['#FF9F43', '#FF6B6B'], // Orange to red
    ['#10AC84', '#1DD1A1'], // Green to teal
    ['#00D2D3', '#54A0FF'], // Cyan to blue
    ['#FFD89B', '#19547B'], // Warm to cool
];

// Fallback categories with modern design
const defaultCategories = [
    {
        id: '1',
        icon: '😊',
        type: 'calm',
        bgColor: ['#667eea', '#764ba2'],
        issueText: 'Calm',
        description: 'Find peace and relaxation'
    },
    {
        id: '2',
        icon: '😢',
        type: 'sorrow',
        bgColor: ['#f093fb', '#f5576c'],
        issueText: 'Sorrow',
        description: 'Heal from sadness'
    },
    {
        id: '3',
        icon: '😠',
        type: 'anger',
        bgColor: ['#ff6b6b', '#ee5a24'],
        issueText: 'Anger',
        description: 'Release built-up anger'
    },
    {
        id: '4',
        icon: '😨',
        type: 'fear',
        bgColor: ['#4facfe', '#00f2fe'],
        issueText: 'Fear',
        description: 'Overcome anxiety and fear'
    },
    {
        id: '5',
        icon: '😐',
        type: 'confusion',
        bgColor: ['#a8edea', '#fed6e3'],
        issueText: 'Confusion',
        description: 'Find clarity and direction'
    },
    {
        id: '6',
        icon: '😌',
        type: 'happiness',
        bgColor: ['#ffd89b', '#19547b'],
        issueText: 'Happiness',
        description: 'Enhance positive emotions'
    }
];

interface CategoriesProps {
    categories?: EmotionType[];
    onCategoryPress?: (emotion: EmotionType) => void;
}

const Categories: React.FC<CategoriesProps> = ({
    categories: propCategories,
    onCategoryPress
}) => {
    const [emotions, setEmotions] = useState<EmotionType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [scrollX] = useState(new Animated.Value(0));

    useEffect(() => {
        fetchEmotions();
    }, []);

    const fetchEmotions = async () => {
        try {
            setLoading(true);
            setError(null);

            // Always fetch from Appwrite, only use propCategories if explicitly provided
            if (propCategories && propCategories.length > 0) {
                setEmotions(propCategories);
            } else {
                console.log('Fetching emotions from Appwrite...');
                const emotionsData = await EmotionService.getEmotions();
                console.log('Fetched emotions:', emotionsData);
                setEmotions(emotionsData);
            }
        } catch (err) {
            console.error('Error fetching emotions from Appwrite:', err);
            setError('Failed to load categories');
            // Use fallback categories if Appwrite fails
            const fallbackEmotions: EmotionType[] = defaultCategories.map(cat => ({
                $id: cat.id,
                name: cat.type,
                displayName: cat.issueText,
                color: cat.bgColor[0],
                description: cat.description,
                icon: cat.icon,
                isActive: true,
                order: parseInt(cat.id),
                $createdAt: '',
                $updatedAt: ''
            }));
            setEmotions(fallbackEmotions);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryPress = (emotion: EmotionType) => {
        setSelectedCategory(emotion.$id);
        if (onCategoryPress) {
            onCategoryPress(emotion);
        }

        // Auto-deselect after 1 second
        setTimeout(() => {
            setSelectedCategory(null);
        }, 1000);
    };

    const getGradientColors = (emotion: EmotionType, index: number): [string, string] => {
        // If we have gradient data from Appwrite, use it
        if (emotion.color && typeof emotion.color === 'object' && Array.isArray(emotion.color)) {
            return emotion.color as [string, string];
        }

        // If we have a single color, create gradient from it
        if (emotion.color && typeof emotion.color === 'string') {
            return [emotion.color, `${emotion.color}CC`];
        }

        // Use preset gradients based on index as fallback
        return GRADIENT_PRESETS[index % GRADIENT_PRESETS.length] as [string, string];
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: COLOR_PALETTE.background }]}>
                <View style={styles.header}>
                    <Text style={styles.title}>How are you feeling?</Text>
                    <Text style={styles.subtitle}>Choose an emotion to explore activities</Text>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                >
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <View key={item} style={styles.loadingCard}>
                            <View style={styles.loadingContent}>
                                <View style={styles.loadingIcon} />
                                <View style={styles.loadingText} />
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: COLOR_PALETTE.background }]}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.title}>How are you feeling?</Text>
                <Text style={styles.subtitle}>Choose an emotion to explore activities</Text>
            </View>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {/* Categories Scroll */}
            <View style={styles.categoriesWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    scrollEventThrottle={16}
                >
                    {emotions.map((emotion, index) => {
                        const gradientColors = getGradientColors(emotion, index);
                        const isSelected = selectedCategory === emotion.$id;

                        return (
                            <Link
                                key={emotion.$id}
                                href={`/Activitys/${emotion.name}` as RelativePathString}
                                asChild
                            >
                                <TouchableOpacity
                                    onPress={() => handleCategoryPress(emotion)}
                                    style={[
                                        styles.categoryCard,
                                        isSelected && styles.selectedCard
                                    ]}
                                    activeOpacity={0.8}
                                >
                                    {/* Main Card Content */}
                                    <LinearGradient
                                        colors={gradientColors}
                                        style={styles.gradientBackground}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                    >
                                        {/* Glow effect for selected state */}
                                        {isSelected && (
                                            <LinearGradient
                                                colors={[...gradientColors, 'transparent']}
                                                style={styles.glowEffect}
                                                start={{ x: 0.5, y: 0 }}
                                                end={{ x: 0.5, y: 1 }}
                                            />
                                        )}

                                        {/* Icon with modern background */}
                                        <View style={styles.iconContainer}>
                                            <Text style={styles.iconText}>{emotion.icon}</Text>
                                        </View>

                                        {/* Category Name */}
                                        <Text style={styles.categoryName} numberOfLines={1}>
                                            {emotion.displayName || emotion.name}
                                        </Text>

                                        {/* Subtle pattern overlay */}
                                        <View style={styles.patternOverlay} />
                                    </LinearGradient>

                                    {/* Floating Tooltip */}
                                    {isSelected && (
                                        <View style={styles.tooltip}>
                                            <Text style={styles.tooltipText}>
                                                {emotion.description}
                                            </Text>
                                            <View style={styles.tooltipArrow} />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </Link>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Modern Pagination Dots */}
            <View style={styles.pagination}>
                {emotions.map((_, index) => {
                    const inputRange = [
                        (index - 1) * CARD_WIDTH,
                        index * CARD_WIDTH,
                        (index + 1) * CARD_WIDTH,
                    ];

                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [8, 20, 8],
                        extrapolate: 'clamp',
                    });

                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp',
                    });

                    return (
                        <Animated.View
                            key={index}
                            style={[
                                styles.dot,
                                {
                                    width: dotWidth,
                                    opacity: opacity,
                                },
                            ]}
                        />
                    );
                })}
            </View>
        </View>
    );
};

// Consistent card dimensions
const CARD_WIDTH = 160;
const CARD_HEIGHT = 180;
const CARD_MARGIN = 12;

const styles = StyleSheet.create({
    container: {
        paddingVertical: 24,
        paddingHorizontal: 20,
    },
    header: {
        marginBottom: 24,
        paddingHorizontal: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: COLOR_PALETTE.textPrimary,
        marginBottom: 8,
        textAlign: 'left',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: COLOR_PALETTE.textSecondary,
        textAlign: 'left',
        fontWeight: '500',
        lineHeight: 22,
    },
    categoriesWrapper: {
        marginBottom: 20,
    },
    scrollView: {
        paddingVertical: 8,
    },
    scrollContent: {
        paddingHorizontal: 8,
        paddingRight: 24,
    },
    loadingCard: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginRight: CARD_MARGIN,
        borderRadius: 24,
        backgroundColor: COLOR_PALETTE.cardBackground,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
        overflow: 'hidden',
    },
    loadingContent: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    loadingIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLOR_PALETTE.border,
        alignSelf: 'center',
    },
    loadingText: {
        height: 16,
        backgroundColor: COLOR_PALETTE.border,
        borderRadius: 8,
        marginTop: 12,
    },
    categoryCard: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginRight: CARD_MARGIN,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
        transform: [{ scale: 1 }],
    },
    selectedCard: {
        transform: [{ scale: 1.05 }],
        shadowColor: COLOR_PALETTE.primary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 16,
    },
    gradientBackground: {
        width: '100%',
        height: '100%',
        borderRadius: 24,
        padding: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
    },
    glowEffect: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 80,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    iconText: {
        fontSize: 28,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    categoryName: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        marginBottom: 16,
        letterSpacing: -0.2,
    },
    patternOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        opacity: 0.1,
        borderRadius: 24,
    },
    tooltip: {
        position: 'absolute',
        bottom: -60,
        left: 16,
        right: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding: 12,
        borderRadius: 12,
        zIndex: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    tooltipText: {
        color: 'white',
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '500',
        lineHeight: 16,
    },
    tooltipArrow: {
        position: 'absolute',
        top: -6,
        alignSelf: 'center',
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderBottomWidth: 6,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'rgba(0, 0, 0, 0.9)',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        gap: 6,
    },
    dot: {
        height: 6,
        borderRadius: 3,
        backgroundColor: COLOR_PALETTE.primary,
    },
    errorContainer: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: COLOR_PALETTE.error,
    },
    errorText: {
        color: COLOR_PALETTE.error,
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
    },
});

export default Categories;