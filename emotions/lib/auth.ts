import { ID, OAuthProvider } from 'appwrite';
import { account } from './appwrite';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useAuthStore } from '@/store/authStore';
import { makeRedirectUri } from 'expo-auth-session';
import { User } from '@/types/auth';

WebBrowser.maybeCompleteAuthSession();

// Initialize Google auth request outside the function
const useGoogleAuthRequest = Google.useAuthRequest({
   
    redirectUri: makeRedirectUri({
        scheme: "com.newral.emotions",
        path: 'oauth',
    }),
});

export const useGoogleAuth = () => {
    const [request, response, promptAsync] = useGoogleAuthRequest;
    const { setUser } = useAuthStore.getState();

    const signInWithGoogle = async () => {
        try {
            const result = await promptAsync();
            if (result?.type !== 'success') {
                throw new Error('Google authentication was cancelled');
            }

            const { id_token } = result.params;

            // Create session with Appwrite
            await account.createOAuth2Session(
                'google' as OAuthProvider,
                makeRedirectUri({ scheme: 'your.app.scheme', path: 'success' }),
                makeRedirectUri({ scheme: 'your.app.scheme', path: 'failure' }),
                [id_token]
            );

            // Get and set user data
            const user = await account.get() as User;
            setUser(user);

            return { success: true, user };
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
                'x-appwrite-project': '67e69028003ce5b90fe1',
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
        const user = await account.get() as User;
        setUser(user);

        return {
            success: true,
            user
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