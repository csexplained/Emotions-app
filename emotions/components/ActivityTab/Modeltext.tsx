import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const ExerciseScreen = ({
  title = "Workout",
  currentStep = 2,
  totalSteps = 6,
  exerciseName = "Push Ups",
  time = "30 sec",
  tags = ["Strength", "Chest"],
  imageSource = require('@/assets/images/brain.png'), // Replace with your image
  description = "Start in a plank position with your hands shoulder-width apart. Lower your body until your chest nearly touches the floor. Push yourself back up to the starting position. Keep your core engaged throughout the movement.",
  onContinue = () => console.log("Continue pressed")
}) => {
  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.steps}>{currentStep} of {totalSteps}</Text>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Image with overlay */}
        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.exerciseImage} />
          <View style={styles.imageOverlay}>
            <Text style={styles.exerciseName}>{exerciseName}</Text>
            <Text style={styles.exerciseTime}>{time}</Text>

            {/* Tags */}
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <View
                  key={index}
                  style={[
                    styles.tag,
                    { backgroundColor: getColorForTag(index) }
                  ]}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Lottie Timer */}
        <View style={styles.lottieContainer}>
          <LottieView
            source={require('@/assets/lottie/completed.json')} // Replace with your Lottie file
            autoPlay
            loop
            style={styles.lottieAnimation}
          />
        </View>

        {/* Description */}
        <Text style={styles.description}>{description}</Text>
      </ScrollView>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

// Helper function to generate tag colors
const getColorForTag = (index: number) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#A5D8FF', '#FFD166'];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  steps: {
    fontSize: 16,
    color: '#666',
  },
  scrollContent: {
    paddingBottom: 80,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  exerciseTime: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  lottieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    marginVertical: 20,
  },
  lottieAnimation: {
    width: 100,
    height: 100,
  },
  description: {
    paddingHorizontal: 20,
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 20,
  },
  continueButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ExerciseScreen;