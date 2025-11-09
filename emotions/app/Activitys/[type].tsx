import React, { useState, useEffect, useCallback } from "react";
import { View, Pressable, Text, ScrollView, ActivityIndicator, RefreshControl, StyleSheet, Platform } from "react-native";
import { RelativePathString, router, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import ActivityCard from "@/components/Home/ActivityCard";
import ActivityService from "@/lib/activity";
import EmotionService from "@/lib/emotion";
import { ActivityType } from "@/types/Activitys.types";
import { EmotionType } from "@/types/category.types";

export default function ActivitiesByTypeScreen() {
    const { type } = useLocalSearchParams();
    const [activities, setActivities] = useState<ActivityType[]>([]);
    const [emotion, setEmotion] = useState<EmotionType | null>(null);
    const [loading, setLoading] = useState(true);
    const [emotionLoading, setEmotionLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const limit = 10; // Number of items per page

    // Normalize type parameter
    const normalizedType = typeof type === 'string' ? type : Array.isArray(type) ? type[0] : '';

    // Fetch emotion details
    const fetchEmotionDetails = useCallback(async () => {
        if (!normalizedType) return;

        try {
            setEmotionLoading(true);
            const emotionData = await EmotionService.getEmotionByName(normalizedType);
            setEmotion(emotionData);
        } catch (err) {
            console.error("Error fetching emotion details:", err);
        } finally {
            setEmotionLoading(false);
        }
    }, [normalizedType]);

    // Get title for header based on emotion data
    const getTitle = () => {
        if (emotion?.displayName) {
            return `${emotion.displayName} Activities`;
        }
        if (emotion?.name) {
            return `${emotion.name} Activities`;
        }
        if (normalizedType) {
            return `${normalizedType} Activities`;
        }
        return "Activities";
    };

    // Get description based on emotion data
    const getDescription = () => {
        if (emotion?.description) {
            return emotion.description;
        }
        return `Explore activities tailored for ${normalizedType || 'your current emotion'}`;
    };

    // Fetch activities with pagination
    const fetchActivities = useCallback(async (pageNum: number, isRefreshing = false) => {
        if (!normalizedType) return;

        try {
            if (!isRefreshing) setLoading(true);
            setError(null);

            const newActivities = await ActivityService.getActivitiesByEmotion(normalizedType);

            if (newActivities.length === 0) {
                setHasMore(false);
            } else {
                if (pageNum === 1) {
                    setActivities(newActivities);
                } else {
                    setActivities(prev => [...prev, ...newActivities]);
                }

                // Check if we have more items for pagination
                if (newActivities.length < limit) {
                    setHasMore(false);
                }
            }
        } catch (err) {
            setError(`Failed to fetch ${normalizedType.toLowerCase()} activities. Please try again.`);
            console.error("Error fetching activities:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [normalizedType]);

    // Initial load
    useEffect(() => {
        if (normalizedType) {
            fetchEmotionDetails();
            fetchActivities(1);
        } else {
            setLoading(false);
            setEmotionLoading(false);
            setError("No emotion type specified");
        }
    }, [normalizedType, fetchActivities, fetchEmotionDetails]);

    // Handle refresh
    const onRefresh = useCallback(() => {
        if (!normalizedType) return;

        setRefreshing(true);
        setPage(1);
        setHasMore(true);
        fetchEmotionDetails();
        fetchActivities(1, true);
    }, [normalizedType, fetchActivities, fetchEmotionDetails]);

    // Handle infinite scroll
    const handleLoadMore = () => {
        if (!loading && hasMore && normalizedType) {
            setPage(prev => prev + 1);
            fetchActivities(page + 1);
        }
    };

    if (!normalizedType) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <AntDesign name="arrowleft" size={24} color="white" />
                    </Pressable>
                    <Text style={styles.title}>Activities</Text>
                    <View style={styles.backButton2} />
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>No emotion type specified.</Text>
                    <Pressable onPress={() => router.back()} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Go Back</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    if (error && activities.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <AntDesign name="arrowleft" size={24} color="white" />
                    </Pressable>
                    <Text style={styles.title}>{getTitle()}</Text>
                    <View style={styles.backButton2} />
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <Pressable onPress={() => fetchActivities(1)} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <AntDesign name="arrowleft" size={24} color="white" />
                </Pressable>
                <Text style={styles.title}>{getTitle()}</Text>
                <View style={styles.backButton2} />
            </View>

            {/* Emotion Description */}
            {!emotionLoading && emotion && (
                <View style={styles.emotionHeader}>
                    <View style={styles.emotionIconContainer}>
                        <Text style={styles.emotionIcon}>{emotion.icon}</Text>
                    </View>
                    <View style={styles.emotionTextContainer}>
                        <Text style={styles.emotionName}>{emotion.displayName || emotion.name}</Text>
                        <Text style={styles.emotionDescription}>{getDescription()}</Text>
                    </View>
                </View>
            )}

            {/* Content */}
            <ScrollView
                contentContainerStyle={[
                    styles.scrollContainer,
                    !emotion && { paddingTop: 16 } // Adjust padding if no emotion header
                ]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#04714A"]}
                        tintColor="#04714A"
                    />
                }
                onScroll={({ nativeEvent }) => {
                    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                    const paddingToBottom = 20;
                    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
                        handleLoadMore();
                    }
                }}
                scrollEventThrottle={400}
            >
                {/* Activities Count */}
                {activities.length > 0 && (
                    <View style={styles.resultsInfo}>
                        <Text style={styles.resultsText}>
                            {activities.length} activity{activities.length !== 1 ? 'ies' : ''} found
                        </Text>
                    </View>
                )}

                {/* Activities List */}
                {activities.map(activity => (

                    <ActivityCard
                        key={activity.$id}
                        id={activity.$id}
                        title={activity.title}
                        description={activity.description}
                        tags={activity.tags}
                        duration={activity.duration}
                        image={activity.image}
                        colors={activity.colors}
                        redirect={activity.redirect}
                        activitytype={activity.activitytype}
                        difficulty={activity.difficulty}
                        onPress={() => {
                            router.push(`/Trainings/${activity.redirect}?id=${activity.$id}` as RelativePathString)
                        }}
                    />
                ))}

                {loading && activities.length > 0 && (
                    <View style={styles.loadingMoreContainer}>
                        <ActivityIndicator size="small" color="#04714A" />
                        <Text style={styles.loadingMoreText}>Loading more activities...</Text>
                    </View>
                )}

                {!hasMore && activities.length > 0 && (
                    <View style={styles.endOfListContainer}>
                        <Text style={styles.endOfListText}>You've reached the end of the list</Text>
                    </View>
                )}

                {!loading && activities.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateTitle}>No activities found</Text>
                        <Text style={styles.emptyStateText}>
                            There are no activities available for {emotion?.displayName || normalizedType} at the moment.
                        </Text>
                        <Pressable onPress={onRefresh} style={styles.retryButton}>
                            <Text style={styles.retryButtonText}>Refresh</Text>
                        </Pressable>
                    </View>
                )}
            </ScrollView>

            {/* Full screen loading indicator */}
            {loading && activities.length === 0 && (
                <View style={styles.fullScreenLoading}>
                    <ActivityIndicator size="large" color="#04714A" />
                    <Text style={styles.loadingText}>Loading activities...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0FFFA",
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        backgroundColor: '#F0FFFA',
    },
    title: {
        fontFamily: 'Inter-Black',
        fontSize: 20,
        flex: 1,
        fontWeight: '800',
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
    backButton2: {
        padding: 8,
        borderRadius: 8,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emotionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'rgba(4, 113, 74, 0.05)',
        marginHorizontal: 16,
        marginTop: 8,
        borderRadius: 12,
        marginBottom: 8,
    },
    emotionIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#04714A',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    emotionIcon: {
        fontSize: 24,
        color: 'white',
    },
    emotionTextContainer: {
        flex: 1,
    },
    emotionName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1F2C',
        marginBottom: 4,
    },
    emotionDescription: {
        fontSize: 14,
        color: '#64748B',
        lineHeight: 18,
    },
    scrollContainer: {
        padding: 16,
        paddingBottom: 32,
    },
    resultsInfo: {
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    resultsText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    errorContainer: {
        flex: 1,
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
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    retryButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    loadingMoreContainer: {
        paddingVertical: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    loadingMoreText: {
        color: '#64748B',
        fontSize: 14,
    },
    endOfListContainer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    endOfListText: {
        color: '#64748B',
        fontSize: 14,
        fontStyle: 'italic',
    },
    fullScreenLoading: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    loadingText: {
        marginTop: 12,
        color: '#04714A',
        fontSize: 16,
        fontWeight: '500',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1F2C',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyStateText: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
});