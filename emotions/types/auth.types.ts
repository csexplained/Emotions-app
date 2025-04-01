import Userprofile from "./userprofile.types";

export interface User {
    $id: string;
    name: string;
    email: string;
    phone?: string;
    emailVerification: boolean;
    phoneVerification: boolean;
    preferences?: Record<string, any>;
    createdAt: string;
}

export interface AuthState {
    user: User | null;
    userProfile: Userprofile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    sessionChecked: boolean;
    lastActivity: number | null;
    checkSession: () => Promise<boolean>;
    setUser: (user: User | null) => Promise<void>;
    setuserProfile: (userProfile: Userprofile | null) => Promise<void>;
    clearAuth: () => Promise<void>;
    refreshSession: () => Promise<boolean>;
    initializeAuth: () => Promise<void>;
}