import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { account, client } from '@/lib/appwrite';
import { OAuthProvider } from 'react-native-appwrite';
import { AuthState } from '@/types/auth';

const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            user: null,
            step: 1,
            phoneNumber: '',
            otp: '',
            loading: false,
            error: null,

            // Initialize auth state on app start
            initializeAuth: async () => {
                set({ loading: true });
                try {
                    const user = await account.get();
                    set({
                        isAuthenticated: true,
                        user,
                        loading: false
                    });
                } catch (error) {
                    set({
                        isAuthenticated: false,
                        user: null,
                        loading: false
                    });
                }
            },

            // Step management
            setStep: (step) => set({ step }),
            setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
            setOtp: (otp) => set({ otp }),

            // Phone OTP flow
            sendOtp: async () => {
                set({ loading: true, error: null });
                try {
                    const { phoneNumber } = get();
                    // Implement your OTP sending logic here
                    // For Appwrite, you might need to use a function or extension
                    await account.createSession('unique', phoneNumber);
                    set({ loading: false, step: 3 }); // Move to OTP screen
                } catch (error: any) {
                    set({ error: error.message, loading: false });
                    throw error;
                }
            },

            verifyOtp: async (otp) => {
                set({ loading: true, error: null });
                try {
                    // Verify OTP with Appwrite
                    await account.updatePhoneSession('unique', otp);
                    const user = await account.get();
                    set({
                        isAuthenticated: true,
                        user,
                        loading: false,
                        otp: '', // Clear OTP after verification
                        step: 4 // Move to thank you screen
                    });
                    return true;
                } catch (error: any) {
                    set({ error: error.message, loading: false });
                    return false;
                }
            },

            // Social login
            socialLogin: async (provider) => {
                set({ loading: true, error: null });
                try {
                    await account.createOAuth2Session(
                        provider as OAuthProvider,
                        'your-app://auth-callback', // Your success deep link
                        'your-app://auth-callback-error' // Your error deep link
                    );
                    // The actual authentication happens in the deep link handler
                } catch (error: any) {
                    set({ error: error.message, loading: false });
                    throw error;
                }
            },

            // Logout
            logout: async () => {
                set({ loading: true });
                try {
                    await account.deleteSession('current');
                    set({
                        isAuthenticated: false,
                        user: null,
                        phoneNumber: '',
                        otp: '',
                        step: 1,
                        loading: false
                    });
                } catch (error: any) {
                    set({ error: error.message, loading: false });
                    throw error;
                }
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                // Only persist these values
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                phoneNumber: state.phoneNumber
            })
        }
    )
);

export default useAuthStore;