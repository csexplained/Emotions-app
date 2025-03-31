import React from "react";
import {
    View,
    Pressable,
    Text,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    StyleSheet,
    LogBox
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { Link } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';


// Suppress the specific warning
LogBox.ignoreLogs([
    'CountryModal: Support for defaultProps',
    'CountryList: Support for defaultProps',
    'CountryItem: Support for defaultProps',
    'Support for defaultProps will be removed from function components'
]);


interface LoginStartedScreenProps {
    phoneInputRef: React.RefObject<PhoneInput>;
    phoneNumber: string;
    setPhoneNumber: (phoneNumber: string) => void;
    setStep: (step: number) => void;
}

export default function LoginStartedScreen({ phoneInputRef, phoneNumber, setPhoneNumber, setStep }: LoginStartedScreenProps) {
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
                            {/* Logo */}
                            <Image
                                source={require("@/assets/images/logosmall.png")}
                                style={styles.logo}
                                resizeMode="contain"
                            />

                            {/* Heading */}
                            <Text style={styles.heading}>Get Started</Text>
                            <Text style={styles.subheading}>
                                Start your journey towards success with our expert-led programs
                            </Text>

                            {/* Phone Number Input */}
                            <Pressable
                                onPress={() => {
                                    setStep(2);
                                    Keyboard.dismiss(); // This will ensure keyboard is dismissed if it was open
                                }}
                                style={styles.phoneInputWrapper}
                                onStartShouldSetResponder={() => true} // This prevents keyboard from opening
                            >
                                <PhoneInput
                                    ref={phoneInputRef}
                                    defaultValue={phoneNumber}
                                    defaultCode="IN"
                                    layout="first"
                                    onChangeFormattedText={(text) => setPhoneNumber(text)}
                                    withShadow
                                    containerStyle={styles.phoneInputContainer}
                                    textContainerStyle={styles.phoneInputTextContainer}
                                    textInputProps={{
                                        editable: false // This prevents keyboard from opening when touching the input
                                    }}
                                />
                            </Pressable>

                            {/* Sign Up Button */}
                            <Pressable
                                onPress={() => setStep(2)}
                                style={styles.signUpButton}
                            >
                                <Text style={styles.signUpButtonText}>Get Started</Text>
                            </Pressable>

                            {/* Social Login Buttons */}
                            <View style={styles.socialButtonsContainer}>
                                <View style={styles.socialButton}>
                                    <AntDesign name="google" size={16} color="white" />
                                </View>
                                <View style={styles.socialButton}>
                                    <AntDesign name="apple1" size={16} color="white" />
                                </View>
                                <View style={styles.socialButton}>
                                    <FontAwesome name="facebook-official" size={16} color="white" />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    )
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
        aspectRatio: 1 // Adjust this based on your image's aspect ratio
    },
    contentWrapper: {
        paddingHorizontal: 24,
        paddingVertical: 20,
        width: '100%'
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
    logo: {
        width: 56,
        height: 56,
        marginBottom: 16
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
    phoneInputWrapper: {
        width: '100%',
        alignItems: 'center',
        marginTop: 16
    },
    phoneInputContainer: {
        width: '100%',
        height: 50,
        borderRadius: 10
    },
    phoneInputTextContainer: {
        paddingVertical: 0,
        backgroundColor: '#F1F1F1'
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
    signUpButtonPressed: {
        opacity: 0.8
    },
    signUpButtonText: {
        color: 'white',
        fontSize: 18
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        gap: 4,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    socialButton: {
        backgroundColor: '#1E1E1E',
        paddingHorizontal: 30,
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    }
});