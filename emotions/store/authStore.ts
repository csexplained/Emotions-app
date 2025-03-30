// @/store/authStore.ts
import { create } from 'zustand';

interface User {
    $id: string;
    name: string;
    email: string;
    phone?: string;
    emailVerification: boolean;
    phoneVerification: boolean;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    setUser: (user: User | null) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    setUser: (user: User | null) => set({
        user,
        isAuthenticated: !!user,
        error: null
    }),

    clearAuth: () => set({
        user: null,
        isAuthenticated: false,
        error: null
    }),
}));