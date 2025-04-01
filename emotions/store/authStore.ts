// @/store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { account } from '@/lib/appwrite';
import * as SecureStore from 'expo-secure-store';
import { AppState } from 'react-native';
import { AuthState, User } from '@/types/auth.types';
import UserProfileService from '@/lib/userProfileService';
import Userprofile from '@/types/userprofile.types';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            userProfile: null,
            isAuthenticated: false,
            isLoading: false,
            sessionChecked: false,
            lastActivity: null,

            initializeAuth: async () => {
                set({ isLoading: true });
                try {
                    const storedUser = await SecureStore.getItemAsync('user');
                    if (storedUser) {
                        const user = JSON.parse(storedUser);
                        set({ user, isAuthenticated: true });
                    }
                    await get().checkSession();
                } catch (error) {
                    console.warn('Auth error:', error);
                    await get().clearAuth();
                } finally {
                    set({ isLoading: false, sessionChecked: true });
                }
            },

            checkSession: async () => {
                set({ isLoading: true });

                try {
                    const session = await account.getSession('current');

                    // ✅ No session found — don't proceed
                    if (!session || new Date(session.expire).getTime() < Date.now()) {
                        await get().clearAuth();
                        return false;
                    }

                    // ✅ Session is valid
                    const user = await account.get();

                    const formattedUser = {
                        ...user,
                        createdAt: user.$createdAt ?? new Date().toISOString(),
                    };

                    await SecureStore.setItemAsync('user', JSON.stringify(formattedUser));
                    const userProfile = await UserProfileService.getUserProfile(user.$id);
                    set({
                        user: formattedUser,
                        isAuthenticated: true,
                        lastActivity: Date.now(),
                        userProfile: userProfile
                    });

                    return true;
                } catch (error) {
                    console.warn('Session check failed:', error);
                    await get().clearAuth();
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            setUser: async (user: User | null) => {
                if (user) {
                    const formattedUser = {
                        ...user,
                        createdAt: user.createdAt || new Date().toISOString()
                    };
                    await SecureStore.setItemAsync('user', JSON.stringify(formattedUser));
                    set({
                        user: formattedUser,
                        isAuthenticated: true,
                        lastActivity: Date.now()
                    });
                } else {
                    await get().clearAuth();
                }
            },
            setuserProfile: async (userProfile: Userprofile | null) => {
                if (userProfile) {
                    set({
                        userProfile,
                        lastActivity: Date.now()
                    });
                } else {
                    await get().clearAuth();
                }
            },

            clearAuth: async () => {
                try {
                    await account.deleteSession('current');
                } finally {
                    await SecureStore.deleteItemAsync('user');
                    set({
                        user: null,
                        isAuthenticated: false,
                        lastActivity: null
                    });
                }
            },

            refreshSession: async () => {
                try {
                    // Any Appwrite call will automatically refresh the session
                    const user = await account.get();
                    await SecureStore.setItemAsync('user', JSON.stringify(user));
                    set({
                        user: { ...user, createdAt: user.$createdAt },
                        lastActivity: Date.now()
                    });
                    return true;
                } catch (error) {
                    await get().clearAuth();
                    return false;
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => ({
                getItem: async (name: string) => {
                    return await SecureStore.getItemAsync(name);
                },
                setItem: async (name: string, value: string) => {
                    await SecureStore.setItemAsync(name, value);
                },
                removeItem: async (name: string) => {
                    await SecureStore.deleteItemAsync(name);
                },
            })),
            partialize: (state) => ({
                user: state.user,
                lastActivity: state.lastActivity
            }),
        }
    )
);

// Session timeout and activity tracking
let activityTimer: NodeJS.Timeout;

const setupSessionTimeout = () => {
    const { isAuthenticated, lastActivity, clearAuth } = useAuthStore.getState();

    if (!isAuthenticated || !lastActivity) return;

    const timeSinceLastActivity = Date.now() - lastActivity;
    const timeRemaining = SESSION_TIMEOUT - timeSinceLastActivity;

    if (timeRemaining <= 0) {
        clearAuth();
    } else {
        clearTimeout(activityTimer);
        activityTimer = setTimeout(() => {
            clearAuth();
        }, timeRemaining);
    }
};

// Track app state changes
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        setupSessionTimeout();
    }
});
