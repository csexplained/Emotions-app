import { databases } from './appwrite';

// Assert that environment variables are defined
const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID as string;
const questionsCollectionId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_QUESTIONSCOLLECTION as string;

if (!databaseId || !questionsCollectionId) {
    throw new Error("Missing required environment variables for Appwrite configuration");
}

interface QuestionsData {
    userId: string;
    questionsObj: string; // Stringified JSON object
}

interface UpdateQuestionsData {
    questionsObj?: string;
}

const QuestionsService = {
    /**
     * Create a new questions document
     * @param {string} userId - User ID
     * @param {object} questionsObj - Questions data object
     * @returns {Promise<QuestionsData>} Created document
     */
    createQuestions: async (userId: string, questionsObj: object) => {
        try {
            // Validate required fields
            if (!userId || !questionsObj) {
                throw new Error('Missing required fields: userId, questionsObj');
            }

            const stringifiedQuestions = JSON.stringify(questionsObj);

            return await databases.createDocument(
                databaseId,
                questionsCollectionId,
                userId, // Using userId as document ID
                {
                    userId: userId,
                    questionsObj: stringifiedQuestions
                }
            );
        } catch (error) {
            console.error('Error creating questions document:', error);
            throw error;
        }
    },

    /**
     * Get questions by userId
     * @param {string} userId - User ID
     * @returns {Promise<object | null>} Parsed questions object
     */
    getQuestions: async (userId: string): Promise<object | null> => {
        try {
            const document = await databases.getDocument(
                databaseId,
                questionsCollectionId,
                userId
            );

            return JSON.parse(document.questionsObj);
        } catch (error: any) {
            // Handle case where document doesn't exist
            if (error.code === 404) {
                return null;
            }
            console.error('Error getting questions:', error);
            throw error;
        }
    },

    /**
     * Update questions document
     * @param {string} userId - User ID
     * @param {object} questionsObj - New questions data object
     * @returns {Promise<QuestionsData>} Updated document
     */
    updateQuestions: async (userId: string, questionsObj: object) => {
        try {
            const stringifiedQuestions = JSON.stringify(questionsObj);

            return await databases.updateDocument(
                databaseId,
                questionsCollectionId,
                userId,
                {
                    questionsObj: stringifiedQuestions
                }
            );
        } catch (error) {
            console.error('Error updating questions:', error);
            throw error;
        }
    },

    /**
     * Delete questions document
     * @param {string} userId - User ID
     * @returns {Promise<void>}
     */
    deleteQuestions: async (userId: string) => {
        try {
            await databases.deleteDocument(
                databaseId,
                questionsCollectionId,
                userId
            );
        } catch (error) {
            console.error('Error deleting questions:', error);
            throw error;
        }
    },

    /**
     * Check if questions document exists and create if it doesn't
     * @param {string} userId - User ID
     * @param {object} defaultQuestions - Default questions object if creating new
     * @returns {Promise<object>} Existing or newly created questions object
     */
    ensureQuestionsExist: async (userId: string, defaultQuestions: object) => {
        try {
            const existingQuestions = await QuestionsService.getQuestions(userId);
            if (existingQuestions) {
                return existingQuestions;
            }
            await QuestionsService.createQuestions(userId, defaultQuestions);
            return defaultQuestions;
        } catch (error) {
            console.error('Error ensuring questions exist:', error);
            throw error;
        }
    }
};

export default QuestionsService; 