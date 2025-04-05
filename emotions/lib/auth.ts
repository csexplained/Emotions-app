import { ID, OAuthProvider } from 'react-native-appwrite';
import { account } from './appwrite';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useAuthStore } from '@/store/authStore';
import { makeRedirectUri } from 'expo-auth-session';
import { User } from '@/types/auth.types';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
        scopes: ['openid', 'profile', 'email'],
        redirectUri: makeRedirectUri({
            scheme: "com.newral.emotions",
            path: 'oauth',
        }),
    });

    const { setUser } = useAuthStore();

    const signInWithGoogle = async () => {
        try {
            const result = await promptAsync();
            if (result?.type !== 'success') {
                throw new Error('Google authentication was cancelled');
            }

            const { id_token } = result.params;

            await account.createOAuth2Session(
                'google' as OAuthProvider,
                makeRedirectUri({ scheme: 'com.newral.emotions', path: 'success' }),
                makeRedirectUri({ scheme: 'com.newral.emotions', path: 'failure' }),
                [id_token]
            );

            const user = await account.get();
            const formattedUser: User = {
                ...user,
                createdAt: user.$createdAt ?? new Date().toISOString(),
                emailVerification: user.emailVerification || false,
                phoneVerification: user.phoneVerification || false
            };

            setUser(formattedUser);
            return { success: true, user: formattedUser };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to authenticate with Google'
            };
        }
    };

    return { signInWithGoogle, isLoading: !request };
};

export const sendOtp = async (phone: string) => {
    try {
        const response = await fetch('https://cloud.appwrite.io/v1/account/sessions/phone', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-appwrite-project': `${process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || ''}`,
            },
            body: JSON.stringify({
                userId: ID.unique(),
                phone,
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to send OTP');
        }

        return {
            success: true,
            userId: data.userId,
        };
    } catch (error: any) {
        console.error("OTP Send Error:", error);
        return {
            success: false,
            error: error.message || "Failed to send verification code",
        };
    }
};

export const verifyOtp = async (userId: string, secret: string) => {
    const { setUser } = useAuthStore.getState();

    try {
        await account.updatePhoneSession(userId, secret);
        const user = await account.get();
        const formattedUser: User = {
            ...user,
            createdAt: user.$createdAt || new Date().toISOString(),
            emailVerification: user.emailVerification || false,
            phoneVerification: user.phoneVerification || false
        };

        setUser(formattedUser);
        return {
            success: true,
            user: formattedUser
        };
    } catch (error: any) {
        console.error("OTP Verification Error:", error);
        return {
            success: false,
            error: error.message || "Invalid verification code",
        };
    }
};

export const logout = async () => {
    const { clearAuth } = useAuthStore.getState();

    try {
        await account.deleteSession('current');
        clearAuth();
        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Failed to logout",
        };
    }
};


export const loginOrSignUpWithEmail = async (
    email: string,
    password: string,
    name: string = 'User'
) => {
    const { setUser } = useAuthStore.getState();
    // Validate email format before making any requests
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            success: false,
            error: "Please enter a valid email address",
        };
    }
    // Validate password requirements
    if (password.length < 6) {
        return {
            success: false,
            error: "Password must be at least 6 characters",
        };
    }
    try {
        // First try to login
        await account.createEmailPasswordSession(email, password);
    } catch (loginError: any) {
        // Handle rate limiting
        if (loginError?.code === 429 || loginError?.message?.includes('Rate limit')) {
            return {
                success: false,
                error: "Too many attempts. Please wait before trying again.",
                isRateLimited: true,
            };
        }
        // First, try to create a new account if login failed
        try {
            // Use Appwrite's built-in ID generation instead of react-native-uuid
            const userId = ID.unique();

            // Create the account with Appwrite's ID generator
            await account.create(userId, email, password, name);

            // Add small delay between signup and login to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
            await account.createEmailPasswordSession(email, password);
        } catch (signupError: any) {
            // If signup failed because email exists, it means the original login
            // failed due to wrong password
            if (signupError?.message?.includes("already exists")) {
                return {
                    success: false,
                    error: "Wrong password. Please try again.",
                };
            }
            if (signupError?.code === 429) {
                return {
                    success: false,
                    error: "Too many signup attempts. Please wait.",
                    isRateLimited: true,
                };
            }
            console.error("Signup failed:", signupError);
            return {
                success: false,
                error: signupError.message || "Account creation failed",
            };
        }
    }
    try {
        // Success case - get user data
        const user = await account.get();
        const formattedUser: User = {
            ...user,
            createdAt: user.$createdAt ?? new Date().toISOString(),
            emailVerification: user.emailVerification || false,
            phoneVerification: user.phoneVerification || false,
        };
        setUser(formattedUser);
        return {
            success: true,
            user: formattedUser,
        };
    } catch (getUserError: any) {
        console.error("Failed to get user:", getUserError);
        return {
            success: false,
            error: getUserError.message || "Failed to load user profile",
        };
    }
};