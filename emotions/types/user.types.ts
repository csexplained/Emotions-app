// @/store/authStore.ts
export interface User {
    $id: string;
    name: string;
    email: string;
    phone?: string;
    emailVerification: boolean;
    phoneVerification: boolean;
}