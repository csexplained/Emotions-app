import { ID, OAuthProvider } from 'appwrite';
import { account } from './appwrite';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useAuthStore } from '@/store/authStore';
import { makeRedirectUri } from 'expo-auth-session';
import { User } from '@/types/auth';

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
                $createdAt: user.$createdAt,
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
            $createdAt: user.$createdAt,
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
        await account.createEmailPasswordSession(email, password)
    } catch (loginError: any) {
        // Handle rate limiting
        if (loginError?.code === 429 || loginError?.message?.includes('Rate limit')) {
            return {
                success: false,
                error: "Too many attempts. Please wait before trying again.",
                isRateLimited: true,
            };
        }

        // Only attempt signup if the error is specifically about invalid credentials
        if (loginError?.message?.includes('Invalid credentials') ||
            loginError?.type === 'user_invalid_credentials') {

            try {

                await account.create(ID.unique(), email, password, name);

                // Add small delay between signup and login to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));

                await account.createSession(email, password);
            } catch (signupError: any) {
                console.error("Signup failed:", signupError);

                if (signupError?.code === 429) {
                    return {
                        success: false,
                        error: "Too many signup attempts. Please wait.",
                        isRateLimited: true,
                    };
                }

                return {
                    success: false,
                    error: signupError.message || "Account creation failed",
                };
            }
        } else {
            // For all other errors
            console.log("Login error:", loginError);
            return {
                success: false,
                error: loginError.message || "Authentication failed",
            };
        }
    }

    try {
        // Success case - get user data
        const user = await account.get();
        const formattedUser: User = {
            ...user,
            $createdAt: user.$createdAt,
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