import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { RelativePathString, useRouter } from "expo-router";


interface ThankYouScreenProps {
    onComplete?: () => void;
    redirectTo?: string;
}

export default function ThankYouScreen({
    onComplete,
    redirectTo = "/auth/profile"
}: ThankYouScreenProps) {
    const router = useRouter();
    const [time, setTime] = useState(5);

    useEffect(() => {
        // Countdown timer
        const interval = setInterval(() => {
            setTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(interval);
                }
                return prevTime - 1;
            });
        }, 1000);

        // Redirect after timeout
        const timeout = setTimeout(() => {
            if (onComplete) {
                onComplete();
            } else {
                router.replace(redirectTo as RelativePathString);
            }
        }, 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [redirectTo, router, onComplete]);

    return (
        <View style={styles.container}>
            {/* Confetti Background Animation */}
            <LottieView
                source={require("../assets/lottie/confetti3.json")}
                autoPlay
                loop={false}
                style={styles.confettiAnimation}
            />

            {/* Completed Checkmark Animation */}
            <LottieView
                source={require("../assets/lottie/completed.json")}
                autoPlay
                loop={false}
                style={styles.checkmarkAnimation}
            />

            <Text style={styles.redirectText}>
                Redirecting in {time} seconds...
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#04714A"
    },
    confettiAnimation: {
        position: "absolute",
        width: "90%",
        height: "90%",
    },
    checkmarkAnimation: {
        width: 200,
        height: 200
    },
    successText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginBottom: 20,
        textAlign: "center"
    },
    redirectText: {
        fontSize: 16,
        color: "white",
        textAlign: "center",
        marginTop: 20
    }
});