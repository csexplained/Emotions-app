import React, { useState, useEffect, useRef } from "react";
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
    TouchableOpacity,
    ActivityIndicator,
    Animated
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useLocalSearchParams } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import ActivityService from "@/lib/activity";
import { ActivityType, ActivityStep } from "@/types/Activitys.types";

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = (width * 9) / 16; // 16:9 aspect ratio

export default function ReadingDetailScreen() {
    const { id } = useLocalSearchParams();
    const [activity, setActivity] = useState<ActivityType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRead, setIsRead] = useState(false);
    const [showCompletion, setShowCompletion] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                setLoading(true);
                setError(null);

                if (typeof id !== 'string') {
                    throw new Error('Invalid activity ID');
                }

                const fetchedActivity = await ActivityService.getActivityById(id);
                console.log('Reading Activity:', fetchedActivity);
                if (!fetchedActivity) {
                    throw new Error('Activity not found');
                }

                setActivity(fetchedActivity);

                // Increment popularity when activity is viewed
                await ActivityService.incrementPopularity(id);

            } catch (err) {
                console.error('Error fetching activity:', err);
                setError('Failed to load activity. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, [id]);

    useEffect(() => {
        // Animate content in when loaded
        if (!loading && activity) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [loading, activity]);

    const handleMarkAsRead = () => {
        console.log('Marking as read:', activity?.title);

        // Show completion animation
        setShowCompletion(true);
        setIsRead(true);

        // TODO: Add Appwrite service call here
        // ActivityService.markAsCompleted(activity.id);

        // Hide completion message after 2 seconds
        setTimeout(() => {
            setShowCompletion(false);
        }, 2000);
    };

    const formatReadingTime = (text: string) => {
        const wordsPerMinute = 200;
        const words = text.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    };

    const getImageSource = () => {
        if (activity?.imagepath && activity.imagepath.length > 0) {
            return { uri: activity.imagepath[0] };
        }
        if (activity?.image) {
            return activity.image;
        }
        return require('@/assets/images/image.png');
    };

    const renderContentWithFormatting = (content: string) => {
        const sections = content.split(/\n\s*\n/); // Split by double newlines
        return sections.map((section, index) => {
            if (section.trim() === '') return null;

            // Check for bullet points
            if (section.includes('•')) {
                const lines = section.split('\n').filter(line => line.trim());
                return (
                    <View key={index} style={styles.bulletSection}>
                        {lines.map((line, lineIndex) => (
                            <View key={lineIndex} style={styles.bulletItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}>{line.replace('•', '').trim()}</Text>
                            </View>
                        ))}
                    </View>
                );
            }

            // Check for numbered list
            if (section.match(/^\d+\./)) {
                const lines = section.split('\n').filter(line => line.trim());
                return (
                    <View key={index} style={styles.numberedSection}>
                        {lines.map((line, lineIndex) => (
                            <View key={lineIndex} style={styles.numberedItem}>
                                <Text style={styles.number}>{line.split('.')[0]}.</Text>
                                <Text style={styles.numberedText}>
                                    {line.substring(line.indexOf('.') + 1).trim()}
                                </Text>
                            </View>
                        ))}
                    </View>
                );
            }

            // Regular paragraph
            return (
                <Text key={index} style={styles.contentParagraph}>
                    {section.trim()}
                </Text>
            );
        });
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#04714A" />
                <Text style={styles.loadingText}>Loading reading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.errorContainer]}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.retryButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!activity) {
        return (
            <View style={[styles.container, styles.errorContainer]}>
                <Text style={styles.errorText}>Activity not found</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.retryButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const readingTime = activity.activityDescription
        ? formatReadingTime(activity.activityDescription)
        : '5 min read';

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View
                    style={[
                        styles.animatedContent,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }]
                        }
                    ]}
                >
                    {/* Featured Image */}
                    <View style={styles.imageContainer}>
                        <Image
                            source={getImageSource()}
                            style={styles.featuredImage}
                            resizeMode="cover"
                        />
                        <View style={styles.imageOverlay} />

                        {/* Reading Badge */}
                        <View style={styles.readingBadge}>
                            <Ionicons name="book-outline" size={16} color="white" />
                            <Text style={styles.readingBadgeText}>READING</Text>
                        </View>
                    </View>

                    {/* Main Content Card */}
                    <View style={styles.contentCard}>


                        <Pressable onPress={() => router.back()} style={styles.backButton}>
                            <AntDesign name="arrowleft" size={24} color="black" />
                        </Pressable>
                        {/* Title Section */}
                        <View style={styles.titleSection}>
                            <Text style={styles.mainTitle}>
                                {activity.exerciseName || activity.name}
                            </Text>
                            <Text style={styles.subtitle}>
                                {activity.description}
                            </Text>
                        </View>

                        {/* Meta Information */}
                        <View style={styles.metaGrid}>
                            <View style={styles.metaItem}>
                                <View style={styles.metaIcon}>
                                    <Feather name="clock" size={16} color="#04714A" />
                                </View>
                                <View>
                                    <Text style={styles.metaLabel}>Duration</Text>
                                    <Text style={styles.metaValue}>{readingTime}</Text>
                                </View>
                            </View>

                            <View style={styles.metaItem}>
                                <View style={styles.metaIcon}>
                                    <Feather name="bar-chart" size={16} color="#04714A" />
                                </View>
                                <View>
                                    <Text style={styles.metaLabel}>Difficulty</Text>
                                    <Text style={styles.metaValue}>{activity.difficulty}</Text>
                                </View>
                            </View>

                            <View style={styles.metaItem}>
                                <View style={styles.metaIcon}>
                                    <Feather name="activity" size={16} color="#04714A" />
                                </View>
                                <View>
                                    <Text style={styles.metaLabel}>Type</Text>
                                    <Text style={styles.metaValue}>{activity.activitytype}</Text>
                                </View>
                            </View>

                            <View style={styles.metaItem}>
                                <View style={styles.metaIcon}>
                                    <Feather name="trending-up" size={16} color="#04714A" />
                                </View>
                                <View>
                                    <Text style={styles.metaLabel}>Popularity</Text>
                                    <Text style={styles.metaValue}>{activity.popularity}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Tags */}
                        {activity.tags && activity.tags.length > 0 && (
                            <View style={styles.tagsSection}>
                                <Text style={styles.sectionLabel}>Topics Covered</Text>
                                <View style={styles.tagsContainer}>
                                    {activity.tags.map((tag, index) => (
                                        <View key={index} style={styles.tag}>
                                            <Text style={styles.tagText}>{tag}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Content Section */}
                        {activity.activityDescription && (
                            <View style={styles.contentSection}>
                                <View style={styles.sectionHeader}>
                                    <View style={styles.sectionIcon}>
                                        <Ionicons name="document-text-outline" size={20} color="#04714A" />
                                    </View>
                                    <Text style={styles.sectionTitle}>Reading Content</Text>
                                </View>

                                <View style={styles.contentBody}>
                                    {renderContentWithFormatting(activity.activityDescription)}
                                </View>
                            </View>
                        )}

                        {/* Reflection Section */}
                        {activity.steps && activity.steps.length > 0 && (
                            <View style={styles.reflectionSection}>
                                <View style={styles.sectionHeader}>
                                    <View style={styles.sectionIcon}>
                                        <Ionicons name="bulb-outline" size={20} color="#04714A" />
                                    </View>
                                    <Text style={styles.sectionTitle}>Reflection Point</Text>
                                </View>

                                <View style={styles.reflectionCard}>
                                    <View style={styles.reflectionIcon}>
                                        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#04714A" />
                                    </View>
                                    <Text style={styles.reflectionText}>
                                        {typeof activity.steps[0] === 'string'
                                            ? activity.steps[0]
                                            : (activity.steps[0] as ActivityStep).description
                                        }
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* Completion Status */}
                        {isRead && (
                            <View style={styles.completionStatus}>
                                <View style={styles.completionBadge}>
                                    <Ionicons name="checkmark-circle" size={20} color="#04714A" />
                                    <Text style={styles.completionText}>Completed</Text>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Spacer for sticky button */}
                    <View style={styles.spacer} />
                </Animated.View>
            </ScrollView>

            {/* Sticky Bottom Button */}
            <View style={styles.stickyFooter}>
                <TouchableOpacity
                    style={[
                        styles.readButton,
                        isRead && styles.readButtonCompleted
                    ]}
                    onPress={handleMarkAsRead}
                    disabled={isRead}
                >
                    <View style={styles.readButtonContent}>
                        {isRead ? (
                            <>
                                <Ionicons name="checkmark-circle" size={24} color="white" />
                                <Text style={styles.readButtonText}>Completed</Text>
                            </>
                        ) : (
                            <>
                                <Ionicons name="bookmark-outline" size={24} color="white" />
                                <Text style={styles.readButtonText}>Mark as Read</Text>
                            </>
                        )}
                    </View>
                </TouchableOpacity>
            </View>

            {/* Completion Toast */}
            {showCompletion && (
                <Animated.View style={styles.completionToast}>
                    <View style={styles.toastContent}>
                        <Ionicons name="checkmark-circle" size={32} color="#04714A" />
                        <Text style={styles.toastText}>Marked as Read!</Text>
                    </View>
                </Animated.View>
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FFFC",
    },
    header: {
        height: 180,
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    headerBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#04714A',
    },
    backButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 8,
        borderRadius: 10,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    headerContent: {
        flex: 1,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '500',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    animatedContent: {
        flex: 1,
    },
    imageContainer: {
        position: 'relative',
        marginBottom: -20,
    },
    featuredImage: {
        width: '100%',
        height: IMAGE_HEIGHT,
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(4, 113, 74, 0.1)',
    },
    readingBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(4, 113, 74, 0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    readingBadgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    contentCard: {
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        marginTop: -30,
        minHeight: height * 0.7,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    titleSection: {
        marginBottom: 24,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A1A1A',
        lineHeight: 34,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        lineHeight: 24,
        fontWeight: '500',
    },
    metaGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FFFA',
        padding: 12,
        borderRadius: 12,
        flex: 1,
        minWidth: '45%',
        gap: 8,
    },
    metaIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E7FFFB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    metaLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    metaValue: {
        fontSize: 14,
        color: '#04714A',
        fontWeight: '600',
    },
    tagsSection: {
        marginBottom: 24,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#04714A',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        backgroundColor: '#E7FFF4',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
    },
    tagText: {
        fontSize: 13,
        color: '#04714A',
        fontWeight: '500',
    },
    contentSection: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    sectionIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F0FFFA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    contentBody: {
        gap: 16,
    },
    contentParagraph: {
        fontSize: 16,
        lineHeight: 26,
        color: '#333',
        textAlign: 'left',
    },
    bulletSection: {
        gap: 8,
        marginLeft: 8,
    },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    bullet: {
        fontSize: 16,
        color: '#04714A',
        fontWeight: 'bold',
        lineHeight: 24,
    },
    bulletText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
    numberedSection: {
        gap: 12,
        marginLeft: 8,
    },
    numberedItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    number: {
        fontSize: 16,
        color: '#04714A',
        fontWeight: 'bold',
        lineHeight: 24,
    },
    numberedText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
    reflectionSection: {
        marginBottom: 24,
    },
    reflectionCard: {
        backgroundColor: '#F8FFFC',
        borderRadius: 16,
        padding: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#04714A',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    reflectionIcon: {
        marginTop: 2,
    },
    reflectionText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        fontStyle: 'italic',
    },
    completionStatus: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    completionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E7FFF4',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    completionText: {
        fontSize: 14,
        color: '#04714A',
        fontWeight: '600',
    },
    spacer: {
        height: 20,
    },
    stickyFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    readButton: {
        backgroundColor: '#04714A',
        padding: 18,
        borderRadius: 16,
        shadowColor: '#04714A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    readButtonCompleted: {
        backgroundColor: '#034732',
    },
    readButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    readButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    completionToast: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -100 }, { translateY: -50 }],
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
        zIndex: 1000,
    },
    toastContent: {
        alignItems: 'center',
        gap: 8,
    },
    toastText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#04714A',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: '#04714A',
        fontSize: 16,
    },
    errorContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#DC2626',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#04714A',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});