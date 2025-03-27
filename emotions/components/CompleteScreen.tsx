import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";

export default function ThankYouScreen({ redirectTo = "/" }: { redirectTo: string }) {
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
            router.push(redirectTo as any);
        }, 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [redirectTo, router]);

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

            {/* Success Message */}
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
        width: "100%",
        height: "100%",
    },
    checkmarkAnimation: {
        width: 150,
        height: 150
    },
    redirectText: {
        fontSize: 16,
        color: "white",
        textAlign: "center",
        marginTop: 10
    }
});