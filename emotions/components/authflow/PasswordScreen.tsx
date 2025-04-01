import React from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
    StyleSheet,
    Image
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

interface PasswordScreenProps {
    password: string;
    setPassword: (password: string) => void;
    onSubmit: () => void;
    onBack: () => void;
    loading: boolean;
    retryDelay?: number;
}

export default function PasswordScreen({
    password,
    setPassword,
    onSubmit,
    onBack,
    loading,
    retryDelay = 0
}: PasswordScreenProps) {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.mainContainer}>
                    {/* Background Image */}
                    <Image
                        source={require("@/assets/images/getstartedpagebg.png")}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    />

                    {/* Content Wrapper */}
                    <View style={styles.contentWrapper}>
                        <View style={styles.contentCard}>
                            {/* Back Button */}
                            <Pressable onPress={onBack} style={styles.backButton}>
                                <AntDesign name="arrowleft" size={24} color="black" />
                            </Pressable>

                            {/* Heading */}
                            <View style={styles.textContainer}>
                                <Text style={styles.heading}>Enter Your Password</Text>
                                <Text style={styles.subheading}>
                                    Secure your account with a strong password
                                </Text>
                            </View>

                            {/* Password Input */}
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="••••••••"
                                    placeholderTextColor="#999"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                    style={styles.input}
                                    editable={retryDelay <= 0}
                                />
                            </View>

                            {retryDelay > 0 && (
                                <Text style={styles.retryText}>
                                    Try again in {retryDelay} seconds
                                </Text>
                            )}

                            {/* Continue Button */}
                            <Pressable
                                onPress={onSubmit}
                                style={[styles.signUpButton, (loading || retryDelay > 0) && styles.buttonDisabled]}
                                disabled={loading || retryDelay > 0}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.signUpButtonText}>
                                        {retryDelay > 0 ? "Please Wait" : "Sign In"}
                                    </Text>
                                )}
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1
    },
    mainContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F0FFFA',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    backgroundImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 1
    },
    contentWrapper: {
        paddingHorizontal: 24,
        paddingVertical: 20,
        width: '100%',
        marginTop: -50 // Adjust this to position the card properly over the image
    },
    contentCard: {
        borderRadius: 30,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        paddingHorizontal: 25,
        paddingVertical: 25
    },
    backButton: {
        backgroundColor: "white",
        padding: 8,
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16
    },
    textContainer: {
        marginBottom: 24
    },
    heading: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000'
    },
    subheading: {
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.5)',
        fontWeight: 'normal',
        marginVertical: 8
    },
    inputWrapper: {
        width: '100%',
        marginTop: 16,
        marginBottom: 8
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#F1F1F1',
        borderRadius: 10,
        paddingHorizontal: 16,
        fontSize: 16
    },
    retryText: {
        color: "#FF3B30",
        textAlign: "center",
        marginTop: 8,
        fontSize: 14
    },
    signUpButton: {
        width: '100%',
        height: 55,
        marginVertical: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#04714A',
        borderRadius: 8
    },
    buttonDisabled: {
        backgroundColor: '#999'
    },
    signUpButtonText: {
        color: 'white',
        fontSize: 18
    }
});