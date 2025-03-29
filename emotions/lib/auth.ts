import { ID } from 'appwrite';
import { account } from './appwrite';

export const sendOtp = async (phone: string) => {
    try {
        const response = await fetch('https://cloud.appwrite.io/v1/account/sessions/phone', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-appwrite-project': '67e69028003ce5b90fe1', // Replace with yours
            },
            body: JSON.stringify({
                userId: ID.unique(),
                phone,
            }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        return {
            success: true,
            userId: data.userId, // Store this
        };
    } catch (error: any) {
        console.log("OTP Send Error", error);
        return {
            success: false,
            error: error.message || "Unknown error",
        };
    }
};

export const verifyOtp = async (userId: string, secret: string) => {
    try {
        const session = await account.updatePhoneSession(userId, secret);
        return { success: true, session };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};
