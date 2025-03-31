export interface User {
    $id: string;
    name: string;
    email: string;
    phone?: string;
    emailVerification: boolean;
    phoneVerification: boolean;
    preferences?: Record<string, any>;
    $createdAt?: string;
    createdAt: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    setUser: (user: User | null) => void;
    clearAuth: () => void;
}