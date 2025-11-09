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
    ActivityIndicator,
    ImageSourcePropType
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import ActivityService from '@/lib/activity';
import { ActivityType, ActivityStep } from '@/types/Activitys.types';

const { width, height } = Dimensions.get('window');

type ImageSourceType = string | number | ImageSourcePropType;

export default function ActivityDetailScreen() {
    const scrollX = useRef(new Animated.Value(0)).current;
    const [activity, setActivity] = useState<ActivityType | null>(null);
    const { id } = useLocalSearchParams();

    const scrollViewRef = useRef<ScrollView>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [images, setImages] = useState<ImageSourceType[]>([]);

    // Timer states
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [stepDurations, setStepDurations] = useState<number[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Progress animation
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                setLoading(true);
                setError(null);

                if (typeof id !== 'string') {
                    throw new Error('Invalid activity ID');
                }

                const fetchedActivity = await ActivityService.getActivityById(id);
                console.log('Fetched Activity:', fetchedActivity);

                if (!fetchedActivity) {
                    throw new Error('Activity not found');
                }

                setActivity(fetchedActivity);

                // Handle images - first image is thumbnail, then step images
                const imageSources: ImageSourceType[] = [];

                // Add thumbnail as first image
                if (fetchedActivity.imagepath && fetchedActivity.imagepath.length > 0) {
                    imageSources.push({ uri: fetchedActivity.imagepath[0] });
                } else if (fetchedActivity.image) {
                    imageSources.push(fetchedActivity.image);
                }

                // Add step images if available in imagepath array
                if (fetchedActivity.imagepath && fetchedActivity.imagepath.length > 1) {
                    for (let i = 1; i < fetchedActivity.imagepath.length; i++) {
                        imageSources.push({ uri: fetchedActivity.imagepath[i] });
                    }
                }

                // If no images found, use fallbacks
                if (imageSources.length === 0) {
                    imageSources.push(
                        require('@/assets/images/image.png'),
                        require('@/assets/images/brain.png')
                    );
                }

                setImages(imageSources);

                // Calculate step durations from step.duration fields
                if (fetchedActivity.steps && fetchedActivity.steps.length > 0) {
                    const durations = fetchedActivity.steps.map(step => {
                        if (typeof step === 'string') return 120; // Default 2 minutes

                        const stepObj = step as ActivityStep;
                        if (stepObj.duration) {
                            const timeMatch = stepObj.duration.match(/(\d+)/);
                            return timeMatch ? parseInt(timeMatch[1]) * 60 : 120;
                        }
                        return 120; // Default 2 minutes
                    });

                    setStepDurations(durations);
                    setTimeLeft(durations[0]); // Set initial time to first step duration
                }

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

    useEffect(() => {
        // Update progress animation when step changes
        if (activity?.steps && stepDurations.length > 0) {
            const progress = currentStepIndex / activity.steps.length;
            Animated.timing(progressAnim, {
                toValue: progress,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    }, [currentStepIndex, activity?.steps?.length]);

    const goToNextStep = () => {
        if (!activity?.steps) return;

        setCurrentStepIndex(prev => {
            const nextIndex = prev + 1;
            if (nextIndex >= activity.steps.length) {
                // Activity completed
                setIsRunning(false);
                handleActivityComplete();
                return prev;
            }

            // Scroll to next image if available
            // Use nextIndex + 1 because image 0 is thumbnail, image 1 is for step 0, etc.
            const imageIndex = Math.min(nextIndex + 1, images.length - 1);
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({
                    x: width * imageIndex,
                    animated: true
                });
            }

            // Set timer for next step
            const nextStepDuration = stepDurations[nextIndex] || 120;
            setTimeLeft(nextStepDuration);

            return nextIndex;
        });
    };

    const goToPreviousStep = () => {
        if (!activity?.steps || currentStepIndex <= 0) return;

        setCurrentStepIndex(prev => {
            const prevIndex = prev - 1;

            // Scroll to previous image if available
            const imageIndex = Math.min(prevIndex + 1, images.length - 1);
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({
                    x: width * imageIndex,
                    animated: true
                });
            }

            // Set timer for previous step
            const prevStepDuration = stepDurations[prevIndex] || 120;
            setTimeLeft(prevStepDuration);

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

        // Set initial step duration
        const initialDuration = stepDurations[0] || 120;
        setTimeLeft(initialDuration);

        // Scroll to first step image (image index 1, since 0 is thumbnail)
        if (images.length > 1 && scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
                x: width,
                animated: true
            });
        }
    };

    const handleActivityComplete = () => {
        console.log('Activity completed! Marking as done...');
        // TODO: Add Appwrite service call here
        // ActivityService.markAsCompleted(activity.id);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const getStepContent = (step: ActivityStep | string, index: number) => {
        if (typeof step === 'string') {
            return { title: `Step ${index + 1}`, description: step };
        }

        const stepObj = step as ActivityStep;
        return {
            title: stepObj.title || `Step ${index + 1}`,
            description: stepObj.description || stepObj.instructions?.[0] || '',
            duration: stepObj.duration || '2 min'
        };
    };

    const getImageSource = (image: ImageSourceType): ImageSourcePropType => {
        if (typeof image === 'string') {
            return { uri: image };
        }
        return image;
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

    const getProgressBarWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#04714A" />
                <Text style={styles.loadingText}>Loading activity...</Text>
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

    const currentStep = activity.steps && activity.steps.length > currentStepIndex
        ? getStepContent(activity.steps[currentStepIndex], currentStepIndex)
        : { title: '', description: '' };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header with Back Button and Timer */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                {isRunning && (
                    <View style={styles.timerDisplay}>
                        <Ionicons name="time-outline" size={20} color="white" />
                        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                    </View>
                )}
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
                            <Image
                                source={getImageSource(image)}
                                style={styles.slideImage}
                                resizeMode="cover"
                            />
                            {/* Overlay for better text readability */}
                            <View style={styles.imageOverlay} />
                        </View>
                    ))}
                </ScrollView>

                {renderDotIndicators()}

                {/* Activity Info Overlay */}
                <View style={styles.infoOverlay}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityDescription}>{activity.description}</Text>

                    {/* Progress Bar */}
                    {isRunning && (
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBackground}>
                                <Animated.View
                                    style={[
                                        styles.progressFill,
                                        { width: getProgressBarWidth }
                                    ]}
                                />
                            </View>
                            <Text style={styles.progressText}>
                                {currentStepIndex + 1}/{activity.steps?.length || 0}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Bottom Content Panel */}
            <View style={styles.bottomPanel}>
                <View style={styles.panelHandle}>
                    <View style={styles.handleBar} />
                </View>

                <ScrollView
                    style={styles.contentScroll}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainer}
                >
                    {/* Current Step Section */}
                    {isRunning && (
                        <View style={styles.currentStepSection}>
                            <Text style={styles.sectionLabel}>CURRENT STEP</Text>
                            <View style={styles.currentStepCard}>
                                <View style={styles.stepHeader}>
                                    <View style={styles.stepIndicator}>
                                        <Text style={styles.stepNumber}>{currentStepIndex + 1}</Text>
                                    </View>
                                    <View style={styles.stepInfo}>
                                        <Text style={styles.stepTitle}>{currentStep.title}</Text>
                                        <Text style={styles.stepDuration}>
                                            {stepDurations[currentStepIndex] ?
                                                formatTime(stepDurations[currentStepIndex]) : '2:00'
                                            }
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.stepDescription}>{currentStep.description}</Text>
                            </View>
                        </View>
                    )}

                    {/* Activity Overview */}
                    <View style={styles.overviewSection}>
                        <View style={styles.overviewHeader}>
                            <Image
                                source={images[0] ? getImageSource(images[0]) : require('@/assets/images/brain.png')}
                                style={styles.thumbnail}
                            />
                            <View style={styles.overviewText}>
                                <Text style={styles.exerciseName}>{activity.exerciseName || activity.title}</Text>
                                <View style={styles.metaInfo}>
                                    <View style={styles.metaItem}>
                                        <Ionicons name="time-outline" size={16} color="#04714A" />
                                        <Text style={styles.metaText}>{activity.duration || '10 min'}</Text>
                                    </View>
                                    <View style={styles.metaItem}>
                                        <Ionicons name="barbell-outline" size={16} color="#04714A" />
                                        <Text style={styles.metaText}>{activity.difficulty || 'Easy'}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Tags */}
                        <View style={styles.tagsContainer}>
                            {activity.tags?.map((tag, index) => (
                                <View key={index} style={styles.tag}>
                                    <Text style={styles.tagText}>{tag}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Description */}
                        {activity.activityDescription && (
                            <Text style={styles.fullDescription}>{activity.activityDescription}</Text>
                        )}
                    </View>

                    {/* All Steps */}
                    {activity.steps && activity.steps.length > 0 && (
                        <View style={styles.allStepsSection}>
                            <Text style={styles.sectionLabel}>ALL STEPS</Text>
                            <View style={styles.stepsList}>
                                {activity.steps.map((step, index) => {
                                    const stepInfo = getStepContent(step, index);
                                    return (
                                        <View
                                            key={index}
                                            style={[
                                                styles.stepItem,
                                                index === currentStepIndex && isRunning && styles.activeStepItem
                                            ]}
                                        >
                                            <View style={styles.stepContent}>
                                                <View style={[
                                                    styles.stepNumberSmall,
                                                    index === currentStepIndex && isRunning && styles.activeStepNumber
                                                ]}>
                                                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                                                </View>
                                                <View style={styles.stepDetails}>
                                                    <Text style={styles.stepItemTitle}>{stepInfo.title}</Text>
                                                    <Text style={styles.stepItemDescription}>
                                                        {stepInfo.description}
                                                    </Text>
                                                    <Text style={styles.stepItemDuration}>
                                                        {stepInfo.duration}
                                                    </Text>
                                                </View>
                                            </View>
                                            {index === currentStepIndex && isRunning && (
                                                <View style={styles.currentIndicator}>
                                                    <Ionicons name="play-circle" size={20} color="#04714A" />
                                                </View>
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* Control Buttons */}
                <View style={styles.controlsContainer}>
                    {isRunning ? (
                        <View style={styles.runningControls}>
                            <TouchableOpacity
                                style={[
                                    styles.controlButton,
                                    styles.secondaryButton,
                                    currentStepIndex === 0 && styles.disabledButton
                                ]}
                                onPress={goToPreviousStep}
                                disabled={currentStepIndex === 0}
                            >
                                <Ionicons
                                    name="chevron-back"
                                    size={20}
                                    color={currentStepIndex === 0 ? '#999' : '#04714A'}
                                />
                                <Text style={[
                                    styles.controlButtonText,
                                    currentStepIndex === 0 && styles.disabledText
                                ]}>
                                    Previous
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.controlButton, styles.primaryButton]}
                                onPress={toggleTimer}
                            >
                                <Ionicons
                                    name={isRunning ? "pause" : "play"}
                                    size={20}
                                    color="white"
                                />
                                <Text style={[styles.controlButtonText, styles.primaryButtonText]}>
                                    {isRunning ? 'Pause' : 'Resume'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.controlButton,
                                    styles.secondaryButton,
                                    currentStepIndex >= (activity.steps?.length || 0) - 1 && styles.disabledButton
                                ]}
                                onPress={goToNextStep}
                                disabled={currentStepIndex >= (activity.steps?.length || 0) - 1}
                            >
                                <Text style={[
                                    styles.controlButtonText,
                                    currentStepIndex >= (activity.steps?.length || 0) - 1 && styles.disabledText
                                ]}>
                                    Next
                                </Text>
                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color={currentStepIndex >= (activity.steps?.length || 0) - 1 ? '#999' : '#04714A'}
                                />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.startButton}
                            onPress={startActivity}
                        >
                            <Ionicons name="play-circle" size={24} color="white" />
                            <Text style={styles.startButtonText}>
                                Start Activity
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
    header: {
        position: 'absolute',
        top: 40,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    backButton: {
        backgroundColor: 'rgba(4, 113, 74, 0.9)',
        padding: 10,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    timerDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    timerText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    sliderContainer: {
        height: height * 0.45,
        position: 'relative',
    },
    slide: {
        width,
        height: '100%',
        position: 'relative',
    },
    slideImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    dotContainer: {
        position: 'absolute',
        bottom: 100,
        flexDirection: 'row',
        alignSelf: 'center',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        backgroundColor: 'white',
        borderRadius: 4,
    },
    infoOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: 30,
    },
    activityTitle: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    activityDescription: {
        color: 'white',
        fontSize: 16,
        marginBottom: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    progressBackground: {
        flex: 1,
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#04714A',
        borderRadius: 3,
    },
    progressText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        minWidth: 30,
    },
    bottomPanel: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -25,
        overflow: 'hidden',
    },
    panelHandle: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 8,
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: '#E5E5E5',
        borderRadius: 2,
    },
    contentScroll: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#04714A',
        marginBottom: 12,
        letterSpacing: 1,
    },
    currentStepSection: {
        marginTop: 20,
        marginBottom: 25,
    },
    currentStepCard: {
        backgroundColor: '#F8FFFC',
        borderRadius: 16,
        padding: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#04714A',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    stepHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    stepIndicator: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#04714A',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    stepNumber: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    stepInfo: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    stepDuration: {
        fontSize: 14,
        color: '#04714A',
        fontWeight: '600',
    },
    stepDescription: {
        fontSize: 15,
        lineHeight: 22,
        color: '#555',
    },
    overviewSection: {
        marginBottom: 30,
    },
    overviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    thumbnail: {
        width: 70,
        height: 70,
        borderRadius: 12,
        marginRight: 15,
    },
    overviewText: {
        flex: 1,
    },
    exerciseName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    metaInfo: {
        flexDirection: 'row',
        gap: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 20,
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
    fullDescription: {
        fontSize: 15,
        lineHeight: 22,
        color: '#555',
    },
    allStepsSection: {
        marginBottom: 20,
    },
    stepsList: {
        gap: 12,
    },
    stepItem: {
        backgroundColor: '#F8F8F8',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    activeStepItem: {
        backgroundColor: '#E7FFF4',
        borderColor: '#04714A',
        borderWidth: 1,
    },
    stepContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
    },
    stepNumberSmall: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#CCC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    activeStepNumber: {
        backgroundColor: '#04714A',
    },
    stepNumberText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    stepDetails: {
        flex: 1,
    },
    stepItemTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    stepItemDescription: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
        marginBottom: 4,
    },
    stepItemDuration: {
        fontSize: 12,
        color: '#04714A',
        fontWeight: '500',
    },
    currentIndicator: {
        marginLeft: 8,
    },
    controlsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
    },
    runningControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    controlButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        gap: 8,
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
        backgroundColor: '#F8FFFC',
        borderWidth: 1,
        borderColor: '#04714A',
    },
    disabledButton: {
        opacity: 0.5,
    },
    controlButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#04714A',
    },
    primaryButtonText: {
        color: 'white',
    },
    disabledText: {
        color: '#999',
    },
    startButton: {
        backgroundColor: '#04714A',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        gap: 8,
        shadowColor: '#04714A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    startButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
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