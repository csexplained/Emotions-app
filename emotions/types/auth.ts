export interface User {
    $id: string;
    name?: string;
    email?: string;
    phone?: string;
    [key: string]: any;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    step: number;
    phoneNumber: string;
    otp: string;
    loading: boolean;
    error: string | null;
    setStep: (step: number) => void;
    setPhoneNumber: (phoneNumber: string) => void;
    setOtp: (otp: string) => void;
    sendOtp: () => Promise<void>;
    verifyOtp: (otp: string) => Promise<boolean>;
    socialLogin: (provider: 'google' | 'apple' | 'facebook') => Promise<void>;
    initializeAuth: () => Promise<void>;
    logout: () => Promise<void>;
}