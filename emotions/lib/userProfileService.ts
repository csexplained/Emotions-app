import { useAuthStore } from '@/store/authStore';
import { databases } from './appwrite';
import UserProfile from "@/types/userprofile.types";

// Assert that environment variables are defined
const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID as string;
const userProfileCollectionId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_USERPROFILECOLLECTION as string;

if (!databaseId || !userProfileCollectionId) {
    throw new Error("Missing required environment variables for Appwrite configuration");
}

interface UpdateData {
    firstname?: string;
    lastname?: string;
    gender?: string;
    city?: string;
    country?: string;
}

const UserProfileService = {
    /**
     * Create a new user profile
     * @param {UserProfile} profileData - User profile data
     * @returns {Promise<UserProfile>} Created profile
     */
    createUserProfile: async (profileData: UserProfile) => {
        try {
            // Validate required fields
            if (!profileData.userId || !profileData.firstname || !profileData.lastname) {
                throw new Error('Missing required fields: userId, firstname, lastname');
            }

            return await databases.createDocument(
                databaseId,
                userProfileCollectionId,
                profileData.userId, // Using userId as document ID
                {
                    userid: profileData.userId,
                    firstname: profileData.firstname,
                    lastname: profileData.lastname,
                    gender: profileData.gender || '',
                    city: profileData.city || '',
                    country: profileData.country || '',
                }
            );
        } catch (error) {
            console.error('Error creating user profile:', error);
            throw error;
        }
    },

    /**
     * Get user profile by userId
     * @param {string} userId - User ID
     * @returns {Promise<UserProfile | null>} User profile
     */
    getUserProfile: async (userId: string): Promise<UserProfile | null> => {
        try {
            const profile = await databases.getDocument(
                databaseId,
                userProfileCollectionId,
                userId
            );

            return {
                userId: profile.$id,
                firstname: profile.firstname,
                lastname: profile.lastname,
                gender: profile.gender,
                city: profile.city,
                country: profile.country
            };
        } catch (error: any) {
            // Handle case where profile doesn't exist
            if (error.code === 404) {
                return null;
            }
            console.error('Error getting user profile:', error);
            throw error;
        }
    },

    /**
     * Update user profile
     * @param {string} userId - User ID
     * @param {Partial<UserProfile>} updates - Fields to update
     * @returns {Promise<UserProfile>} Updated profile
     */
    updateUserProfile: async (userId: string, updates: Partial<UserProfile>) => {
        try {
            // Create a properly typed update object
            const updateData: UpdateData = {};

            if (updates.firstname !== undefined) updateData.firstname = updates.firstname;
            if (updates.lastname !== undefined) updateData.lastname = updates.lastname;
            if (updates.gender !== undefined) updateData.gender = updates.gender;
            if (updates.city !== undefined) updateData.city = updates.city;
            if (updates.country !== undefined) updateData.country = updates.country;

            await databases.updateDocument(
                databaseId,
                userProfileCollectionId,
                userId,
                updateData
            );
            return updateData
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    },

    /**
     * Delete user profile
     * @param {string} userId - User ID
     * @returns {Promise<void>}
     */
    deleteUserProfile: async (userId: string) => {
        try {
            await databases.deleteDocument(
                databaseId,
                userProfileCollectionId,
                userId
            );
        } catch (error) {
            console.error('Error deleting user profile:', error);
            throw error;
        }
    },

    /**
     * Check if profile exists and create if it doesn't
     * @param {UserProfile} profileData - User profile data
     * @returns {Promise<UserProfile>} Existing or newly created profile
     */
    ensureUserProfileExists: async (profileData: UserProfile) => {
        try {
            const existingProfile = await UserProfileService.getUserProfile(profileData.userId);
            if (existingProfile) {
                return existingProfile;
            }
            return await UserProfileService.createUserProfile(profileData);
        } catch (error) {
            console.error('Error ensuring profile exists:', error);
            throw error;
        }
    }
};

export default UserProfileService;