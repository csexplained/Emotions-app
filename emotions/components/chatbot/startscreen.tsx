import { HelloWave } from '@/components/HelloWave';
import React from "react";
import { View, Pressable, Text, Image, StyleSheet } from "react-native";

export default function StartScreen({ setStartChat }: { setStartChat: (value: boolean) => void }) {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require("@/assets/images/mainlogo.png")} />
            </View>
            <View style={styles.waveContainer}>
                <HelloWave />
            </View>
            <Text style={styles.welcomeText}>Welcome To</Text>
            <Text style={styles.titleText}>Emotions <Text style={styles.aiText}>AI</Text></Text>
            <Text style={styles.subtitle1}>
                Start chatting with Nafs Ai Now.
            </Text>
            <Text style={styles.subtitle2}>
                You can ask me anything
            </Text>

            <Pressable
                onPress={() => setStartChat(true)}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Start Chatting</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        width: '100%',
        paddingHorizontal: 24,
        height: '100%',
        backgroundColor: '#F0FFFA',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    logoContainer: {
        width: '100%',
        padding: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    waveContainer: {
        width: '100%',
        marginVertical: 24,
        justifyContent: 'center',
        alignItems: 'center'
    },
    welcomeText: {
        fontSize: 36,
        fontWeight: '600'
    },
    titleText: {
        fontSize: 40,
        fontWeight: '800'
    },
    aiText: {
        color: '#04714A',
        fontWeight: '800'
    },
    subtitle1: {
        fontSize: 18,
        marginTop: 24,
        color: 'rgba(0, 0, 0, 0.5)',
        fontWeight: '400',
        marginBottom: -4
    },
    subtitle2: {
        fontSize: 18,
        color: 'rgba(0, 0, 0, 0.5)',
        fontWeight: '400',
        marginBottom: 8
    },
    button: {
        width: '100%',
        marginTop: 32,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#04714A",
        borderRadius: 8
    },
    buttonPressed: {
        opacity: 0.8
    },
    buttonText: {
        color: 'white',
        fontSize: 18
    }
});