import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    Animated,
    FlatList,
    Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

const images = [
    require('@/assets/images/image.png'),
    require('@/assets/images/brain.png'),
    require('@/assets/images/image.png'),
];

const commonInfo = {
    name: 'Nature Retreat',
    description: 'Experience the beauty of untouched wilderness'
};

const contentData = [
    { id: '1', title: 'About', content: 'Immerse yourself in nature with our guided retreats.' },
    { id: '2', title: 'Activities', content: 'Hiking, meditation, wildlife photography and more.' },
    { id: '3', title: 'Duration', content: '3-day and 5-day packages available.' },
];

export default function App() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const sliderRef = useRef<FlatList>(null);

    const renderItem = ({ item }: { item: any }) => {
        return (
            <View style={styles.slide}>
                <Image source={item} style={styles.slideImage} />
                {/* Text overlay with consistent info */}
                <View style={styles.textOverlay}>
                    <Text style={styles.name}>{commonInfo.name}</Text>
                    <Text style={styles.description}>{commonInfo.description}</Text>
                </View>
            </View>
        );
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

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Sticky Header Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButton}>
                    <Ionicons name="share-social" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Image Slider - Takes 50% of screen */}
            <View style={styles.sliderContainer}>
                <FlatList
                    ref={sliderRef}
                    data={images}
                    renderItem={renderItem}
                    keyExtractor={(_, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    onMomentumScrollEnd={(ev) => {
                        const newIndex = Math.round(ev.nativeEvent.contentOffset.x / width);
                        setCurrentIndex(newIndex);
                    }}
                    scrollEventThrottle={16}
                />
                {renderDotIndicators()}
            </View>

            {/* Fixed Bottom Panel - Takes remaining 50% */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={true}
                onRequestClose={() => { }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalPanel}>
                        {/* Panel Handle */}
                        <View style={styles.panelHandle}>
                            <View style={styles.handleBar} />
                        </View>

                        {/* Content Area */}
                        <FlatList
                            data={contentData}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.contentItem}>
                                    <Text style={styles.contentTitle}>{item.title}</Text>
                                    <Text style={styles.contentText}>{item.content}</Text>
                                </View>
                            )}
                            contentContainerStyle={styles.contentContainer}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 20,
    },
    shareButton: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 20,
    },
    sliderContainer: {
        height: height * 0.5, // 50% of screen
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
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 15,
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
    },
    dotContainer: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        alignSelf: 'center',
    },
    dot: {
        height: 8,
        width: 8,
        backgroundColor: 'white',
        marginHorizontal: 4,
        borderRadius: 4,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
    },
    modalPanel: {
        height: height * 0.55, // Remaining 50% of screen
        backgroundColor: '#F0FFFA',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 10,
    },
    panelHandle: {
        alignItems: 'center',
        paddingBottom: 10,
    },
    handleBar: {
        width: 40,
        height: 5,
        backgroundColor: '#ccc',
        borderRadius: 3,
    },
    contentContainer: {
        padding: 20,
    },
    contentItem: {
        marginBottom: 20,
    },
    contentTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    contentText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
});