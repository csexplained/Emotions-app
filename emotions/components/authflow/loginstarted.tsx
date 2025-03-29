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
    ActivityIndicator
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { Link } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useAuthStore from '@/store/authStore';

interface LoginStartedScreenProps {
    phoneInputRef: React.RefObject<any>;
    phoneNumber: string;
    setPhoneNumber: (phone: string) => void;
    setStep: (step: number) => void;
}

const LoginStartedScreen: React.FC<LoginStartedScreenProps> = ({
    phoneInputRef,
    phoneNumber,
    setPhoneNumber,
    setStep
}) => {
    const { socialLogin, loading } = useAuthStore();

    const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
        try {
            await socialLogin(provider);
        } catch (error) {
            console.error('Social login failed:', error);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.mainContainer}>
                    <Image
                        source={require("@/assets/images/getstartedpagebg.png")}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    />

                    <View style={styles.contentWrapper}>
                        <View style={styles.contentCard}>
                            <Image
                                source={require("@/assets/images/logosmall.png")}
                                style={styles.logo}
                                resizeMode="contain"
                            />

                            <Text style={styles.heading}>Get Started</Text>
                            <Text style={styles.subheading}>
                                Start your journey towards success with our expert-led programs
                            </Text>

                            <Pressable
                                onPress={() => {
                                    setStep(2);
                                    Keyboard.dismiss();
                                }}
                                style={styles.phoneInputWrapper}
                                onStartShouldSetResponder={() => true}
                            >
                                <PhoneInput
                                    ref={phoneInputRef}
                                    defaultValue={phoneNumber}
                                    defaultCode="IN"
                                    layout="first"
                                    onChangeFormattedText={setPhoneNumber}
                                    withShadow
                                    containerStyle={styles.phoneInputContainer}
                                    textContainerStyle={styles.phoneInputTextContainer}
                                    textInputProps={{
                                        editable: false
                                    }}
                                />
                            </Pressable>

                            <Pressable
                                onPress={() => setStep(2)}
                                style={styles.signUpButton}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.signUpButtonText}>Get Started</Text>
                                )}
                            </Pressable>

                            <View style={styles.dividerContainer}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>or continue with</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            <View style={styles.socialButtonsContainer}>
                                <Pressable
                                    onPress={() => handleSocialLogin('google')}
                                    style={styles.socialButton}
                                    disabled={loading}
                                >
                                    <AntDesign name="google" size={16} color="white" />
                                </Pressable>
                                <Pressable
                                    onPress={() => handleSocialLogin('apple')}
                                    style={styles.socialButton}
                                    disabled={loading}
                                >
                                    <AntDesign name="apple1" size={16} color="white" />
                                </Pressable>
                                <Pressable
                                    onPress={() => handleSocialLogin('facebook')}
                                    style={styles.socialButton}
                                    disabled={loading}
                                >
                                    <FontAwesome name="facebook-official" size={16} color="white" />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
};

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
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        marginHorizontal: 10,
        color: '#6B7280',
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
    },
});

export default LoginStartedScreen;