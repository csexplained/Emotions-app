import {
    View,
    TextInput,
    Image,
    Text,
    Pressable,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    StyleSheet
} from "react-native";
import { Link, router } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { User } from "@/types/auth";

export default function AuthIndexScreen() {
    const user = useAuthStore((state: { user: User | null; isAuthenticated: boolean }) => state.user);
    const isAuthenticated = useAuthStore((state: { user: User | null; isAuthenticated: boolean }) => state.isAuthenticated);

    // Redirect if already authenticated
    if (isAuthenticated) {
        router.replace('/(tabs)');
        return null;
    }

    return (
        <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.mainContainer}>
                <View style={styles.topSection}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require("@/assets/images/Signuppages.png")}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.progressIndicatorContainer}>
                        <View style={[styles.progressIndicator, styles.activeProgress]}></View>
                        <View style={[styles.progressIndicator, styles.inactiveProgress]}></View>
                        <View style={[styles.progressIndicator, styles.inactiveProgress]}></View>
                    </View>
                </View>

                <View style={styles.bottomSection}>
                    <Text style={styles.title}>Discover Experiences with a simple swipe</Text>
                    <Text style={styles.subtitle}>Curated activities at your fingertips</Text>

                    <Link href="/auth/login" asChild replace>
                        <Pressable
                            style={styles.signUpButton}
                        >
                            <Text style={styles.signUpButtonText}>Sign Via OTP</Text>
                        </Pressable>
                    </Link>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account?</Text>
                        <Link href="/auth/signup" asChild>
                            <Pressable>
                                <Text style={styles.loginLink}>Sign Via Email</Text>
                            </Pressable>
                        </Link>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1
    },
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#F0FFFA',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    topSection: {
        backgroundColor: '#F0FFFA',
        width: '100%',
        height: '65%'
    },
    imageContainer: {
        flex: 1,
        paddingHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '80%'
    },
    image: {
        maxWidth: '100%',
        maxHeight: '100%'
    },
    progressIndicatorContainer: {
        height: 'auto',
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%'
    },
    progressIndicator: {
        width: '25%',
        height: 4,
        borderRadius: 2
    },
    activeProgress: {
        backgroundColor: '#04714A'
    },
    inactiveProgress: {
        backgroundColor: 'rgba(4, 113, 74, 0.69)'
    },
    bottomSection: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 32,
        width: '100%',
        height: 'auto',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: "#1E1E1E8E",
        fontWeight: 'normal',
        textAlign: 'center',
        marginVertical: 14
    },
    signUpButton: {
        width: '100%',
        height: 48,
        marginVertical: 18,
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
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12
    },
    loginText: {
        fontSize: 14,
        marginRight: 4
    },
    loginLink: {
        fontSize: 14,
        color: '#04714A',
        fontWeight: '600'
    }
});