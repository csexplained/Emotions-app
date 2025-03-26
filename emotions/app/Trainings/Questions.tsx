import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

const { width, height } = Dimensions.get('window');

const questionData = {
    currentQuestion: 6,
    totalQuestions: 10,
    question: "What is the focus of mindfulness practice?",
    options: [
        "Living in the present moment",
        "Multitasking",
        "Avoiding challenges",
        "Overthinking"
    ],
    correctAnswer: "Living in the present moment"
};

export default function QuestionScreen() {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header Buttons */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButton}>
                    <Feather name="send" size={20} color={"#ffffff"} />
                </TouchableOpacity>
            </View>

            {/* Single Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={require('@/assets/images/image3.png')}
                    style={styles.image}
                />
            </View>

            {/* Question Panel */}
            <View style={styles.questionPanel}>
                <View style={styles.panelHandle}>
                    <View style={styles.handleBar} />
                </View>
                {/* Centered Progress Bar */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressBackground}>
                        <Text style={styles.progressText}>
                            Question {questionData.currentQuestion}/{questionData.totalQuestions}
                        </Text>
                    </View>
                </View>

                <Text style={styles.questionText}>{questionData.question}</Text>

                {/* Options with Circles */}
                <View style={styles.optionsContainer}>
                    {questionData.options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.optionButton,
                                selectedOption === option && styles.selectedOption
                            ]}
                            onPress={() => setSelectedOption(option)}
                        >
                            <Text style={styles.optionText}>{option}</Text>
                            <View style={styles.optionCircle}>
                                <Text style={styles.optionCircleText}>

                                </Text>
                            </View>

                        </TouchableOpacity>
                    ))}
                </View>

                {/* Continue Button */}
                <TouchableOpacity
                    style={[
                        styles.continueButton,
                        !selectedOption && styles.disabledButton
                    ]}
                    disabled={!selectedOption}
                >
                    <Text style={styles.continueButtonText}>Continue</Text>
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
    header: {
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
    panelHandle: {
        alignItems: 'center',
        marginBottom: 15,
    },
    handleBar: {
        width: 90,
        height: 5,
        backgroundColor: '#04714A',
        borderRadius: 10,
    },
    shareButton: {
        backgroundColor: '#04714A',
        padding: 10,
        borderRadius: 15,
    },
    imageContainer: {
        height: height * 0.3,
        width: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    questionPanel: {
        flex: 1,
        backgroundColor: '#F0FFFA',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -20,
        padding: 25,
    },
    progressContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    progressBackground: {
        backgroundColor: '#D4FFE0',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    progressText: {
        fontSize: 16,
        color: '#04714A',
        fontWeight: '600',
    },
    questionText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 25,
    },
    optionsContainer: {
        marginBottom: 30,
    },
    optionButton: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderColor: "#04714A",
        borderWidth: 1,
        backgroundColor: '#E3FFE8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    optionCircleText: {
        color: '#04714A',
        fontWeight: 'bold',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    selectedOption: {
        backgroundColor: '#E3FFE8',
        borderColor: '#04714A',
        borderWidth: 1,
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
    disabledButton: {
        opacity: 0.6,
    },
    continueButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});