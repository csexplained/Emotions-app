import React, { useState, useEffect, useCallback } from "react";
import { View, Pressable, Text, ScrollView, ActivityIndicator, RefreshControl, StyleSheet, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import ActivityCard from "@/components/Home/ActivityCard";
import ActivityService from "@/lib/activity";
import { ActivityType } from "@/types/activitycard.types";

// Define valid activity types
const validTypes = ["Anger", "Fear", "Calm", "Blame", "Sorrow", "Confusion", "Happiness"];

export default function ActivitiesByTypeScreen() {
    const { type } = useLocalSearchParams();
    const [activities, setActivities] = useState<ActivityType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const limit = 10; // Number of items per page

    // Validate type parameter
    const normalizedType = typeof type === 'string' ? type : Array.isArray(type) ? type[0] : '';
    const isValidType = validTypes.includes(normalizedType);

    // Get title for header based on type
    const getTitle = () => {
        if (!isValidType) return "Activities";
        return `${normalizedType} Activities`;
    };

    // Fetch activities with pagination
    const fetchActivities = useCallback(async (pageNum: number, isRefreshing = false) => {
        if (!isValidType) return;

        try {
            if (!isRefreshing) setLoading(true);
            setError(null);

            const newActivities = await ActivityService.getActivities({
                limit,
                offset: (pageNum - 1) * limit,
                filters: {
                    type: normalizedType
                },
                sortField: "title",
                sortOrder: "asc",
            });

            if (newActivities.length === 0) {
                setHasMore(false);
            } else {
                if (pageNum === 1) {
                    setActivities(newActivities);
                } else {
                    setActivities(prev => [...prev, ...newActivities]);
                }
            }
        } catch (err) {
            setError(`Failed to fetch ${normalizedType.toLowerCase()} activities. Please try again.`);
            console.error("Error fetching activities:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [normalizedType, isValidType]);

    // Initial load
    useEffect(() => {
        fetchActivities(1);
    }, [fetchActivities]);

    // Handle refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setPage(1);
        setHasMore(true);
        fetchActivities(1, true);
    }, [fetchActivities]);

    // Handle infinite scroll
    const handleLoadMore = () => {
        if (!loading && hasMore && isValidType) {
            setPage(prev => prev + 1);
            fetchActivities(page + 1);
        }
    };

    if (!isValidType) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <AntDesign name="arrowleft" size={24} color="white" />
                    </Pressable>
                    <Text style={styles.title}>Invalid Activity Type</Text>
                    <View style={styles.backButton2} />
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>The requested activity type does not exist.</Text>
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

            {/* Content */}
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
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
                {activities.map(activity => (
                    <ActivityCard
                        key={activity.$id}
                        id={activity.$id}
                        {...activity}
                    />
                ))}

                {loading && activities.length > 0 && (
                    <View style={styles.loadingMoreContainer}>
                        <ActivityIndicator size="small" color="#04714A" />
                    </View>
                )}

                {!hasMore && (
                    <View style={styles.endOfListContainer}>
                        <Text style={styles.endOfListText}>No more activities to show</Text>
                    </View>
                )}
            </ScrollView>

            {/* Full screen loading indicator */}
            {loading && activities.length === 0 && (
                <View style={styles.fullScreenLoading}>
                    <ActivityIndicator size="large" color="#04714A" />
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
    scrollContainer: {
        padding: 16,
        paddingBottom: 32,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
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
    loadingMoreContainer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    endOfListContainer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    endOfListText: {
        color: '#666',
        fontSize: 14,
    },
    fullScreenLoading: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
});