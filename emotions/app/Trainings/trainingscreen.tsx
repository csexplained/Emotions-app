import React, { useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    Animated,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

const { width, height } = Dimensions.get('window');

const images = [
    require('@/assets/images/image.png'),
    require('@/assets/images/brain.png'),
    require('@/assets/images/image.png'),
    require('@/assets/images/image.png'),
    require('@/assets/images/brain.png'),
    require('@/assets/images/image.png'),
];

const commonInfo = {
    name: 'Nature Retreat',
    description: 'Experience the beauty of untouched wilderness'
};

const data = {
    title: "Next Exercise",
    currentStep: 2,
    totalSteps: 6,
    exerciseName: "Snake Pose",
    time: "5 min",
    distance: "15 feet",
    difficulty: "Medium",
    description: "Yoga unites body, mind, and soul, enhancing flexibility, reducing stress, and promoting mindfulness for a healthier, balanced life.",
    steps: [
        "Step 1 - Yoga unites body soul, enhancing flexibility.",
        "Step 2 - Yoga unites body soul, enhancing flexibility.",
        "Step 3 - Yoga unites body soul, enhancing flexibility.",
        "Step 4 - Yoga unites body, mind, and soul enhancing flexibility."
    ],
    onContinue: () => console.log("Continue pressed")
}

export default function App() {
    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView>(null);

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

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Sticky Header Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
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
                            <Image source={image} style={styles.slideImage} />
                        </View>
                    ))}
                </ScrollView>
                {renderDotIndicators()}

                {/* Fixed Text Overlay */}
                <View style={styles.textOverlay}>
                    <Text style={styles.name}>{commonInfo.name}</Text>
                    <Text style={styles.description}>{commonInfo.description}</Text>
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
                        <Text style={styles.sectionTitle}>{data.title}</Text>
                        <Text style={styles.sectionTitle}>3 of 4</Text>
                    </View>


                    {/* Exercise Header with Image */}
                    <View style={styles.exerciseHeader}>
                        <Image
                            source={require('@/assets/images/brain.png')}
                            style={styles.exerciseImage}
                        />
                        <View style={styles.exerciseTextContainer}>

                            <Text style={styles.exerciseName}>{data.exerciseName}</Text>


                            <View style={styles.exerciseMeta}>
                                <View style={styles.metaItem}>
                                    <Ionicons name="time-outline" size={16} color="#04714A" />
                                    <Text style={styles.metaText}>{data.time}</Text>
                                </View>
                            </View>
                            {/* Tags below time/difficulty */}
                            <View style={styles.tagsContainer}>
                                <View style={[styles.tag, styles.distanceTag]}>
                                    <Text style={styles.tagText}>{data.distance}</Text>
                                </View>
                                <View style={[styles.tag, styles.difficultyTag]}>
                                    <Text style={styles.tagText}>{data.difficulty}</Text>
                                </View>
                            </View>
                        </View>
                    </View>



                    {/* Description with spacing */}
                    <Text style={styles.descriptionText}>{data.description}</Text>

                    {/* Steps section */}
                    <View style={styles.stepsSection}>
                        <Text style={styles.stepsTitle}>Steps</Text>
                        <View style={styles.stepsContainer}>
                            {data.steps.map((step, index) => (
                                <View key={index} style={styles.stepItem}>
                                    <View style={styles.stepNumber}>
                                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                                    </View>
                                    <Text style={styles.stepText}>{step}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                {/* Continue Button */}
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity style={styles.continueButton}>
                        <Text style={styles.continueButtonText}>Continue</Text>
                    </TouchableOpacity>
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
        width: '100%', // Ensure it spans full width
        justifyContent: 'center', // Center dots evenly
    },
    dot: {
        flex: 1, // Make each dot take equal width
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
        marginBottom: 20,
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
    stepNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#04714A',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
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
});