import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    Animated,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import ActivityService from '@/lib/activity';
import { ActivityType } from '@/types/activitycard.types';

type StepType = string;

const { width, height } = Dimensions.get('window');

export default function ActivityDetailScreen() {
    const scrollX = useRef(new Animated.Value(0)).current;
    const [activity, setActivity] = useState<(ActivityType & { steps?: StepType[] }) | null>(null);
    const { id } = useLocalSearchParams();

    const scrollViewRef = useRef<ScrollView>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [images, setImages] = useState<string[]>([]);

    // Timer states
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

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

                if (fetchedActivity.imagepath) {
                    setImages(fetchedActivity.imagepath);
                } else {
                    setImages([
                        require('@/assets/images/image.png'),
                        require('@/assets/images/brain.png')
                    ]);
                }

                // Calculate step duration if time is provided
                if (fetchedActivity.time) {
                    const timeMatch = fetchedActivity.time.match(/(\d+)\s*min/);
                    if (timeMatch) {
                        const totalMinutes = parseInt(timeMatch[1]);
                        setTotalDuration(totalMinutes * 60);

                        // Calculate time per step if steps exist
                        if (fetchedActivity.steps?.length) {
                            const stepDuration = Math.floor((totalMinutes * 60) / fetchedActivity.steps.length);
                            setTimeLeft(stepDuration);
                        }
                    }
                }
            } catch (err) {
                console.error('Error fetching activity:', err);
                setError('Failed to load activity. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [id]);

    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        goToNextStep();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isRunning]);

    const goToNextStep = () => {
        if (!activity?.steps) return;

        setCurrentStepIndex(prev => {
            const nextIndex = prev + 1;
            if (nextIndex >= activity.steps!.length) {
                setIsRunning(false);
                return prev;
            }

            // Scroll to next image if available
            if (images.length > nextIndex && scrollViewRef.current) {
                scrollViewRef.current.scrollTo({
                    x: width * nextIndex,
                    animated: true
                });
            }

            // Reset timer for next step
            const stepDuration = Math.floor(totalDuration / activity.steps!.length);
            setTimeLeft(stepDuration);

            return nextIndex;
        });
    };

    const goToPreviousStep = () => {
        if (!activity?.steps || currentStepIndex <= 0) return;

        setCurrentStepIndex(prev => {
            const prevIndex = prev - 1;

            // Scroll to previous image if available
            if (images.length > prevIndex && scrollViewRef.current) {
                scrollViewRef.current.scrollTo({
                    x: width * prevIndex,
                    animated: true
                });
            }

            // Reset timer for previous step
            const stepDuration = Math.floor(totalDuration / activity.steps!.length);
            setTimeLeft(stepDuration);

            return prevIndex;
        });
    };

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const startActivity = () => {
        if (!activity?.steps?.length) return;

        setIsRunning(true);
        setCurrentStepIndex(0);

        // Calculate initial step duration
        const stepDuration = Math.floor(totalDuration / activity.steps.length);
        setTimeLeft(stepDuration);

        // Scroll to first image if available
        if (images.length > 0 && scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
                x: 0,
                animated: true
            });
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const renderDotIndicators = () => {
        return (
            <View style={styles.dotContainer}>
                {images.map((_, i) => {
                    const opacity = scrollX.interpolate({
                        inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp'
                    });
                    return (
                        <Animated.View
                            key={`dot-${i}`}
                            style={[styles.dot, { opacity }]}
                        />
                    );
                })}
            </View>
        );
    };

    if (loading) {
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

            {/* Sticky Header Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                {/* Timer Display */}
                {isRunning && (
                    <View style={styles.timerContainer}>
                        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                    </View>
                )}
                <TouchableOpacity style={styles.shareButton}>
                    <Feather name="send" size={20} color={"#ffffff"} />
                </TouchableOpacity>
            </View>

            {/* Image Slider */}
            <View style={styles.sliderContainer}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    scrollEventThrottle={16}
                >
                    {images.map((image, index) => (
                        <View key={index} style={styles.slide}>
                            {typeof image === 'string' ? (
                                <Image source={{ uri: image }} style={styles.slideImage} />
                            ) : (
                                <Image source={image} style={styles.slideImage} />
                            )}
                        </View>
                    ))}
                </ScrollView>
                {renderDotIndicators()}



                {/* Fixed Text Overlay */}
                <View style={styles.textOverlay}>
                    <Text style={styles.name}>{activity.title}</Text>
                    <Text style={styles.description}>{activity.description}</Text>
                </View>
            </View>

            {/* Bottom Panel */}
            <View style={styles.bottomScreen}>
                <View style={styles.panelHandle}>
                    <View style={styles.handleBar} />
                </View>

                <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    {/* Section Title with Spacing */}
                    <View style={styles.topbox}>
                        <Text style={styles.sectionTitle}>Steps</Text>
                        <Text style={styles.sectionTitle}>
                            {currentStepIndex + 1}/{activity.totalSteps || activity.steps?.length || 0}
                        </Text>
                    </View>
                    {/* Current Step Highlight */}
                    {isRunning && activity.steps && (
                        <View style={styles.currentStepContainer}>
                            <Text style={styles.currentStepTitle}>Current Step</Text>
                            <View style={styles.currentStepContent}>
                                <View style={styles.stepNumber}>
                                    <Text style={styles.stepNumberText}>{currentStepIndex + 1}</Text>
                                </View>
                                <Text style={styles.currentStepText}>
                                    {activity.steps[currentStepIndex]}
                                </Text>
                            </View>
                        </View>
                    )}
                    {/* Exercise Header with Image */}
                    <View style={styles.exerciseHeader}>
                        {activity.imagepath ? (
                            <Image
                                source={{ uri: Array.isArray(activity.imagepath) ? activity.imagepath[0] : activity.imagepath }}
                                style={styles.exerciseImage}
                            />
                        ) : (
                            <Image source={require('@/assets/images/brain.png')} style={styles.exerciseImage} />
                        )}
                        <View style={styles.exerciseTextContainer}>
                            <Text style={styles.exerciseName}>{activity.exerciseName || activity.name}</Text>

                            <View style={styles.exerciseMeta}>
                                {activity.time && (
                                    <View style={styles.metaItem}>
                                        <Ionicons name="time-outline" size={16} color="#04714A" />
                                        <Text style={styles.metaText}>{activity.time}</Text>
                                    </View>
                                )}
                            </View>

                            {/* Tags below time/difficulty */}
                            <View style={styles.tagsContainer}>
                                {activity.distance && (
                                    <View style={[styles.tag, styles.distanceTag]}>
                                        <Text style={styles.tagText}>{activity.distance}</Text>
                                    </View>
                                )}
                                {activity.difficulty && (
                                    <View style={[styles.tag, styles.difficultyTag]}>
                                        <Text style={styles.tagText}>{activity.difficulty}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Description with spacing */}
                    {activity.activityDescription && (
                        <Text style={styles.descriptionText}>{activity.activityDescription}</Text>
                    )}



                    {/* Steps section */}
                    <View style={styles.stepsSection}>
                        <Text style={styles.stepsTitle}>All Steps</Text>
                        <View style={styles.stepsContainer}>
                            {activity.steps?.map((step, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.stepItem,
                                        index === currentStepIndex && isRunning && styles.activeStepItem
                                    ]}
                                >
                                    <View style={[
                                        styles.stepNumber,
                                        index === currentStepIndex && isRunning && styles.activeStepNumber
                                    ]}>
                                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                                    </View>
                                    <Text style={styles.stepText}>{step}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                {/* Control Buttons */}
                <View style={styles.buttonWrapper}>
                    {isRunning ? (
                        <View style={styles.controlButtonsContainer}>
                            <TouchableOpacity
                                style={[styles.controlButton, styles.secondaryButton]}
                                onPress={goToPreviousStep}
                                disabled={currentStepIndex === 0}
                            >
                                <Text style={styles.controlButtonText}>Previous</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.controlButton, styles.primaryButton]}
                                onPress={toggleTimer}
                            >
                                <Text style={styles.controlButtonText}>
                                    {isRunning ? 'Pause' : 'Resume'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.controlButton, styles.secondaryButton]}
                                onPress={goToNextStep}
                                disabled={!activity.steps || currentStepIndex >= activity.steps.length - 1}
                            >
                                <Text style={styles.controlButtonText}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.continueButton}
                            onPress={startActivity}
                        >
                            <Text style={styles.continueButtonText}>
                                {activity.activitytype === 'Read' ? 'Mark as Complete' : 'Start Activity'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0FFFA',
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
    topbox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sliderContainer: {
        height: height * 0.5,
        justifyContent: 'center',
    },
    slide: {
        width,
        height: height * 0.5,
    },
    slideImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    textOverlay: {
        position: 'absolute',
        bottom: 30,
        left: 10,
        right: 20,
        padding: 5,
        borderRadius: 10,
    },
    name: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    description: {
        color: 'white',
        fontSize: 16,
        marginBottom: 10
    },
    dotContainer: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignSelf: 'center',
        width: '100%',
        justifyContent: 'center',
    },
    dot: {
        flex: 1,
        height: 8,
        backgroundColor: 'white',
        marginHorizontal: 4,
        borderRadius: 4,
    },
    bottomScreen: {
        flex: 1,
        backgroundColor: '#F0FFFA',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -20,
        paddingTop: 15,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    panelHandle: {
        alignItems: 'center',
        marginBottom: 10,
    },
    handleBar: {
        width: 90,
        height: 5,
        backgroundColor: '#04714A',
        borderRadius: 3,
    },
    contentContainer: {
        flex: 1,
        paddingBottom: 80,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    exerciseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    exerciseImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 15,
    },
    exerciseTextContainer: {
        flex: 1,
    },
    exerciseName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    exerciseMeta: {
        flexDirection: 'row',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    metaText: {
        marginLeft: 5,
        color: '#666',
        fontSize: 14,
    },
    tagsContainer: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginRight: 10,
    },
    distanceTag: {
        backgroundColor: '#E3F5FF',
    },
    difficultyTag: {
        backgroundColor: '#E3FFE8',
    },
    tagText: {
        fontSize: 12,
        color: '#04714A',
        fontWeight: '500',
    },
    descriptionText: {
        fontSize: 15,
        lineHeight: 22,
        color: '#555',
        marginBottom: 25,
    },
    stepsSection: {
        marginBottom: 60,
    },
    stepsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    stepsContainer: {
        marginBottom: 20,
    },
    stepItem: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'flex-start',
    },
    activeStepItem: {
        backgroundColor: '#E7FFFB',
        borderRadius: 10,
        padding: 10,
    },
    stepNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#04714A',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    activeStepNumber: {
        backgroundColor: '#034732',
    },
    stepNumberText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    stepText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 22,
        color: '#555',
    },
    currentStepContainer: {
        backgroundColor: '#E9FFFB',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
    currentStepTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#04714A',
        marginBottom: 10,
    },
    currentStepContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    currentStepText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 22,
        color: '#333',
    },
    buttonWrapper: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    continueButton: {
        backgroundColor: '#04714A',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#04714A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    continueButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    controlButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    controlButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    primaryButton: {
        backgroundColor: '#04714A',
        shadowColor: '#04714A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    secondaryButton: {
        backgroundColor: '#E7FFFB',
        borderWidth: 1,
        borderColor: '#04714A',
    },
    controlButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    timerContainer: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    timerText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
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
});