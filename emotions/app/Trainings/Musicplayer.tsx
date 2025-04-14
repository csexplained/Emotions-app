import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import ActivityService from '@/lib/activity';
import { ActivityType } from '@/types/activitycard.types';

const { width, height } = Dimensions.get('window');

export default function ActivityDetailScreen() {
    const { id } = useLocalSearchParams();
    const [activity, setActivity] = useState<ActivityType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);

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
            } catch (err) {
                console.error('Error fetching activity:', err);
                setError('Failed to load activity. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, [id]);

    // Load and unload audio
    useEffect(() => {
        let isMounted = true;

        const loadAudio = async () => {
            if (!activity?.Musicpath) return;

            try {
                const { sound: audioSound } = await Audio.Sound.createAsync(
                    { uri: activity.Musicpath }, // Use the Musicpath from your activity
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

    const formatTime = (millis: number) => {
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000).toFixed(0);
        return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
    };

    if (loading && !activity) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#04714A" />
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

            {/* Header Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButton}>
                    <Feather name="send" size={20} color={"#ffffff"} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContainer}>
                {/* Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: activity.imagepath[0] }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <View style={styles.imageOverlay}>
                        <Text style={styles.imageTitle}>{activity.name}</Text>
                        <Text style={styles.imageSubtitle}>{activity.description}</Text>
                    </View>
                </View>

                {/* Music Player */}
                <View style={styles.musicPlayer}>
                    {/* Progress Bar at Top */}
                    <View style={styles.progressBarContainer}>
                        <Slider
                            style={styles.progressBar}
                            minimumValue={0}
                            maximumValue={duration}
                            value={position}
                            onSlidingComplete={handleSliderValueChange}
                            minimumTrackTintColor="#04714A"
                            maximumTrackTintColor="#E0E0E0"
                            thumbTintColor="#04714A"
                        />
                    </View>

                    {/* Time Stamps at Bottom */}
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>{formatTime(position)}</Text>
                        <Text style={styles.timeText}>{formatTime(duration)}</Text>
                    </View>

                    {/* Controls */}
                    <View style={styles.playerControls}>
                        <TouchableOpacity>
                            <Ionicons name="repeat" size={24} color="#666" />
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <Ionicons name="play-skip-back" size={28} color="#333" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.playButton}
                            onPress={isPlaying ? pauseAudio : playAudio}
                        >
                            <Ionicons
                                name={isPlaying ? "pause" : "play"}
                                size={36}
                                color="white"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <Ionicons name="play-skip-forward" size={28} color="#333" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
                            <Ionicons
                                name={isLiked ? "heart" : "heart-outline"}
                                size={24}
                                color={isLiked ? "red" : "#666"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Activity Details */}
                <View style={styles.detailsContainer}>
                    <Text style={styles.sectionTitle}>About This Activity</Text>
                    <Text style={styles.descriptionText}>{activity.activityDescription}</Text>

                    {activity.steps && activity.steps.length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>Steps</Text>
                            {activity.steps.map((step: string, index: number) => (
                                <View key={index} style={styles.stepContainer}>
                                    <View style={styles.stepNumber}>
                                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                                    </View>
                                    <Text style={styles.stepText}>{step}</Text>
                                </View>
                            ))}
                        </>
                    )}
                </View>
            </ScrollView>

            {/* Track Button */}
            <View style={styles.trackButtonContainer}>
                <TouchableOpacity style={styles.trackButton}>
                    <Text style={styles.trackButtonText}>Track my progress</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0FFFA',
    },
    scrollContainer: {
        flex: 1,
    },
    buttonContainer: {
        position: 'absolute',
        top: 40,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 1,
    },
    backButton: {
        backgroundColor: '#04714A',
        padding: 10,
        borderRadius: 15,
    },
    shareButton: {
        backgroundColor: '#04714A',
        padding: 10,
        justifyContent: "center",
        alignContent: "center",
        borderRadius: 15,
    },
    imageContainer: {
        height: height * 0.7,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        overflow: 'hidden',
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
    },
    imageTitle: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    imageSubtitle: {
        color: 'white',
        fontSize: 18,
        opacity: 0.8,
    },
    musicPlayer: {
        backgroundColor: '#F0FFFA',
        padding: 10,
        margin: 14,
        marginTop: 0,
    },
    progressBarContainer: {
        marginBottom: 10,
    },
    progressBar: {
        width: '100%',
        height: 6,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 15,
    },
    timeText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    playerControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 0,
    },
    playButton: {
        backgroundColor: '#04714A',
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#04714A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    trackButtonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    trackButton: {
        backgroundColor: '#04714A',
        padding: 18,
        borderRadius: 14,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
    trackButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },

    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
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
    detailsContainer: {
        padding: 20,
        paddingBottom: 100, // Extra padding for the track button
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#04714A',
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        marginBottom: 20,
    },
    stepContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'flex-start',
    },
    stepNumber: {
        backgroundColor: '#04714A',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    stepNumberText: {
        color: 'white',
        fontWeight: 'bold',
    },
    stepText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 22,
        color: '#333',
    },
});