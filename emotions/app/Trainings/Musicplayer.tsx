import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
    ActivityIndicator,
    Animated,
    Platform
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import ActivityService from '@/lib/activity';
import { ActivityType } from '@/types/Activitys.types';

const { width, height } = Dimensions.get('window');

export default function MusicPlayerScreen() {
    const { id } = useLocalSearchParams();
    const [activity, setActivity] = useState<ActivityType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showCompletion, setShowCompletion] = useState(false);

    // Animations
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Fetch activity by ID
    useEffect(() => {
        const fetchActivity = async () => {
            try {
                setLoading(true);
                setError(null);

                if (typeof id !== 'string') {
                    throw new Error('Invalid activity ID');
                }

                const fetchedActivity = await ActivityService.getActivityById(id);
                setActivity(fetchedActivity);

                // Increment popularity when viewed
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

    // Animation when loaded
    useEffect(() => {
        if (!loading && activity) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [loading, activity]);

    // Vinyl rotation animation
    useEffect(() => {
        if (isPlaying) {
            Animated.loop(
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 10000,
                    useNativeDriver: true,
                    easing: t => t, // Linear easing
                })
            ).start();
        } else {
            rotateAnim.stopAnimation();
        }
    }, [isPlaying]);

    // Load and unload audio
    useEffect(() => {
        let isMounted = true;

        const loadAudio = async () => {
            if (!activity?.Musicpath) return;

            try {
                const { sound: audioSound } = await Audio.Sound.createAsync(
                    { uri: activity.Musicpath },
                    { shouldPlay: false },
                    onPlaybackStatusUpdate
                );
                if (isMounted) {
                    setSound(audioSound);
                    const status = await audioSound.getStatusAsync();
                    if (status.isLoaded) {
                        setDuration(status.durationMillis || 0);
                    }
                }
            } catch (error) {
                console.error('Error loading audio:', error);
            }
        };

        loadAudio();

        return () => {
            isMounted = false;
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [activity?.Musicpath]);

    const onPlaybackStatusUpdate = (status: any) => {
        if (status.isLoaded) {
            setPosition(status.positionMillis);
            setDuration(status.durationMillis || 0);

            // Check if completed (played at least 90% of the track)
            if (status.positionMillis > 0 && status.durationMillis > 0) {
                const completionPercentage = (status.positionMillis / status.durationMillis) * 100;
                if (completionPercentage >= 90 && !isCompleted) {
                    handleCompletion();
                }
            }

            if (status.didJustFinish) {
                setIsPlaying(false);
                setPosition(0);
            }
        }
    };

    const playAudio = async () => {
        try {
            if (sound) {
                await sound.playAsync();
                setIsPlaying(true);
            }
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    };

    const pauseAudio = async () => {
        try {
            if (sound) {
                await sound.pauseAsync();
                setIsPlaying(false);
            }
        } catch (error) {
            console.error('Error pausing audio:', error);
        }
    };

    const handleSliderValueChange = async (value: number) => {
        if (sound) {
            await sound.setPositionAsync(value);
        }
    };

    const handleCompletion = () => {
        console.log('Music activity completed:', activity?.title);
        setIsCompleted(true);
        setShowCompletion(true);

        // TODO: Add Appwrite service call here
        // ActivityService.markAsCompleted(activity.id);

        setTimeout(() => {
            setShowCompletion(false);
        }, 3000);
    };

    const formatTime = (millis: number) => {
        if (!millis) return '0:00';
        const minutes = Math.floor(millis / 60000);
        const seconds = Math.floor((millis % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const getCompletionPercentage = () => {
        if (!duration) return 0;
        return (position / duration) * 100;
    };

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    if (loading && !activity) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#04714A" />
                <Text style={styles.loadingText}>Loading music...</Text>
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

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>NOW PLAYING</Text>
                    <Text style={styles.headerSubtitle}>Music for {activity.type || 'Relaxation'}</Text>
                </View>
                <TouchableOpacity onPress={() => setIsLiked(!isLiked)} style={styles.likeButton}>
                    <Ionicons
                        name={isLiked ? "heart" : "heart-outline"}
                        size={24}
                        color={isLiked ? "#FF6B6B" : "white"}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Animated.View
                    style={[
                        styles.animatedContent,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }]
                        }
                    ]}
                >
                    {/* Album Art with Vinyl Effect */}
                    <View style={styles.albumContainer}>
                        <Animated.View
                            style={[
                                styles.vinyl,
                                { transform: [{ rotate: rotateInterpolate }] }
                            ]}
                        >
                            <View style={styles.vinylInner}>
                                <View style={styles.vinylCenter} />
                            </View>
                        </Animated.View>

                        <View style={styles.albumArtContainer}>
                            <Image
                                source={{ uri: activity.imagepath[0] }}
                                style={styles.albumArt}
                                resizeMode="cover"
                            />
                            <View style={styles.albumOverlay} />
                        </View>
                    </View>

                    {/* Track Info */}
                    <View style={styles.trackInfo}>
                        <Text style={styles.trackTitle}>{activity.name}</Text>
                        <Text style={styles.trackArtist}>{activity.exerciseName}</Text>

                        {/* Completion Progress */}
                        {!isCompleted && (
                            <View style={styles.completionProgress}>
                                <View style={styles.progressBarBackground}>
                                    <View
                                        style={[
                                            styles.progressBarFill,
                                            { width: `${getCompletionPercentage()}%` }
                                        ]}
                                    />
                                </View>
                                <Text style={styles.completionText}>
                                    {Math.round(getCompletionPercentage())}% Complete
                                </Text>
                            </View>
                        )}

                        {/* Completion Badge */}
                        {isCompleted && (
                            <View style={styles.completionBadge}>
                                <Ionicons name="checkmark-circle" size={20} color="#04714A" />
                                <Text style={styles.completionBadgeText}>Completed</Text>
                            </View>
                        )}
                    </View>

                    {/* Player Controls */}
                    <View style={styles.playerSection}>
                        {/* Progress Bar */}
                        <View style={styles.progressContainer}>
                            <Slider
                                style={styles.progressBar}
                                minimumValue={0}
                                maximumValue={duration}
                                value={position}
                                onSlidingComplete={handleSliderValueChange}
                                minimumTrackTintColor="#04714A"
                                maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                                thumbTintColor="#04714A"
                            />
                            <View style={styles.timeContainer}>
                                <Text style={styles.timeText}>{formatTime(position)}</Text>
                                <Text style={styles.timeText}>{formatTime(duration)}</Text>
                            </View>
                        </View>

                        {/* Control Buttons */}
                        <View style={styles.controls}>
                            <TouchableOpacity style={styles.controlButton}>
                                <Ionicons name="shuffle" size={24} color="#666" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.controlButton}>
                                <Ionicons name="play-skip-back" size={28} color="#333" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.playPauseButton}
                                onPress={isPlaying ? pauseAudio : playAudio}
                            >
                                <Ionicons
                                    name={isPlaying ? "pause" : "play"}
                                    size={32}
                                    color="white"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.controlButton}>
                                <Ionicons name="play-skip-forward" size={28} color="#333" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.controlButton}>
                                <Ionicons name="repeat" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Activity Details */}
                    <View style={styles.detailsCard}>
                        <View style={styles.sectionHeader}>
                            <Feather name="info" size={20} color="#04714A" />
                            <Text style={styles.sectionTitle}>About This Track</Text>
                        </View>

                        <Text style={styles.description}>{activity.activityDescription}</Text>

                        {/* Meta Information */}
                        <View style={styles.metaGrid}>
                            <View style={styles.metaItem}>
                                <View style={styles.metaIcon}>
                                    <Feather name="clock" size={16} color="#04714A" />
                                </View>
                                <View>
                                    <Text style={styles.metaLabel}>Duration</Text>
                                    <Text style={styles.metaValue}>{activity.duration}</Text>
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
                                    <Feather name="music" size={16} color="#04714A" />
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
                                <Text style={styles.tagsLabel}>Mood & Style</Text>
                                <View style={styles.tagsContainer}>
                                    {activity.tags.map((tag, index) => (
                                        <View key={index} style={styles.tag}>
                                            <Text style={styles.tagText}>{tag}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Steps */}
                        {activity.steps && activity.steps.length > 0 && (
                            <View style={styles.stepsSection}>
                                <View style={styles.sectionHeader}>
                                    <Feather name="list" size={20} color="#04714A" />
                                    <Text style={styles.sectionTitle}>Listening Guide</Text>
                                </View>
                                {activity.steps.map((step: any, index: number) => (
                                    <View key={index} style={styles.stepItem}>
                                        <View style={styles.stepNumber}>
                                            <Text style={styles.stepNumberText}>{index + 1}</Text>
                                        </View>
                                        <View style={styles.stepContent}>
                                            <Text style={styles.stepTitle}>{step.title}</Text>
                                            <Text style={styles.stepDescription}>{step.description}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Spacer */}
                    <View style={styles.spacer} />
                </Animated.View>
            </ScrollView>

            {/* Completion Toast */}
            {showCompletion && (
                <Animated.View style={styles.completionToast}>
                    <View style={styles.toastContent}>
                        <Ionicons name="checkmark-circle" size={32} color="#04714A" />
                        <View>
                            <Text style={styles.toastTitle}>Music Completed!</Text>
                            <Text style={styles.toastSubtitle}>Great job listening to {activity.name}</Text>
                        </View>
                    </View>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A1F1C',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 50,
        paddingBottom: 20,
        backgroundColor: 'rgba(10, 31, 28, 0.9)',
    },
    backButton: {
        backgroundColor: 'rgba(4, 113, 74, 0.3)',
        padding: 10,
        borderRadius: 12,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        alignItems: 'center',
    },
    headerTitle: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
        opacity: 0.8,
    },
    headerSubtitle: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    likeButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContainer: {
        flex: 1,
    },
    animatedContent: {
        flex: 1,
    },
    albumContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: height * 0.4,
        position: 'relative',
    },
    vinyl: {
        width: width * 0.7,
        height: width * 0.7,
        borderRadius: width * 0.35,
        backgroundColor: '#1A1A1A',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    vinylInner: {
        width: '90%',
        height: '90%',
        borderRadius: width * 0.35,
        borderWidth: 8,
        borderColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    vinylCenter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#04714A',
    },
    albumArtContainer: {
        width: width * 0.5,
        height: width * 0.5,
        borderRadius: width * 0.25,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 15,
    },
    albumArt: {
        width: '100%',
        height: '100%',
    },
    albumOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    trackInfo: {
        alignItems: 'center',
        paddingHorizontal: 40,
        marginBottom: 30,
    },
    trackTitle: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    trackArtist: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    completionProgress: {
        width: '100%',
        alignItems: 'center',
    },
    progressBarBackground: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 3,
        marginBottom: 8,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#04714A',
        borderRadius: 3,
    },
    completionText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
        fontWeight: '500',
    },
    completionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(4, 113, 74, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    completionBadgeText: {
        color: '#04714A',
        fontSize: 14,
        fontWeight: '600',
    },
    playerSection: {
        paddingHorizontal: 40,
        marginBottom: 30,
    },
    progressContainer: {
        marginBottom: 30,
    },
    progressBar: {
        width: '100%',
        height: 40,
    },
    sliderThumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: -10,
    },
    timeText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
        fontWeight: '500',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    controlButton: {
        padding: 10,
    },
    playPauseButton: {
        backgroundColor: '#04714A',
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#04714A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10,
    },
    detailsCard: {
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        minHeight: height * 0.4,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#555',
        marginBottom: 24,
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
    tagsLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#04714A',
        marginBottom: 12,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        backgroundColor: '#E7FFF4',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    tagText: {
        fontSize: 12,
        color: '#04714A',
        fontWeight: '500',
    },
    stepsSection: {
        marginBottom: 20,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
        gap: 12,
    },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#04714A',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
    stepNumberText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    stepDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    spacer: {
        height: 20,
    },
    completionToast: {
        position: 'absolute',
        top: '40%',
        left: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    toastContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    toastTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#04714A',
        marginBottom: 2,
    },
    toastSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0A1F1C',
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
        backgroundColor: '#0A1F1C',
    },
    errorText: {
        color: '#FF6B6B',
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