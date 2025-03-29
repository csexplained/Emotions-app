import React from "react";
import {
    View,
    Pressable,
    Text,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    StyleSheet,
    ActivityIndicator
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
import AntDesign from "@expo/vector-icons/AntDesign";

interface LoginnumberProps {
    phoneInputRef: React.RefObject<any>;
    phoneNumber: string;
    setPhoneNumber: (phone: string) => void;
    onContinue: () => void;
    setStep: (step: number) => void;
    loading: boolean;
}

const Loginnumber: React.FC<LoginnumberProps> = ({
    phoneInputRef,
    phoneNumber,
    setPhoneNumber,
    onContinue,
    setStep,
    loading
}) => {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.innerContainer}>
                    <View>
                        <Pressable
                            onPress={() => setStep(1)}
                            style={styles.backButton}
                        >
                            <AntDesign name="arrowleft" size={24} color="black" />
                        </Pressable>

                        <View style={styles.textContainer}>
                            <Text style={styles.title}>Enter Your Number</Text>
                            <Text style={styles.subtitle}>
                                Provide Your Phone Number to Proceed with Secure Login
                            </Text>
                        </View>

                        <View style={styles.phoneInputContainer}>
                            <PhoneInput
                                ref={phoneInputRef}
                                defaultValue={phoneNumber}
                                defaultCode="IN"
                                layout="first"
                                onChangeFormattedText={setPhoneNumber}
                                withShadow
                                autoFocus
                                containerStyle={styles.phoneInput}
                                textContainerStyle={styles.phoneInputTextContainer}
                            />
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Pressable
                            onPress={onContinue}
                            style={styles.continueButton}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.continueButtonText}>Continue</Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F0FFFA"
    },
    innerContainer: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingVertical: 24
    },
    backButton: {
        backgroundColor: "white",
        padding: 8,
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    textContainer: {
        marginTop: 16
    },
    title: {
        fontSize: 24,
        fontWeight: "700"
    },
    subtitle: {
        fontSize: 14,
        color: "rgba(0, 0, 0, 0.5)",
        fontWeight: "normal",
        marginVertical: 8
    },
    phoneInputContainer: {
        marginTop: 16
    },
    phoneInput: {
        width: "100%",
        height: 50,
        borderRadius: 10
    },
    phoneInputTextContainer: {
        paddingVertical: 0,
        backgroundColor: "#F1F1F1"
    },
    buttonContainer: {
        marginBottom: 5
    },
    continueButton: {
        width: "100%",
        height: 55,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#04714A",
        borderRadius: 8
    },
    continueButtonPressed: {
        opacity: 0.8
    },
    continueButtonText: {
        color: "white",
        fontSize: 18
    },
});

export default Loginnumber;