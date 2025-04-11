import { ID, Query } from 'react-native-appwrite';
import { databases } from './appwrite';
import { ImageSourcePropType } from "react-native";
import { ActivityType } from '@/types/activitycard.types';
// Assert that environment variables are defined
const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID as string;
const activityCollectionId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ACTIVITYCOLLECTION as string;

if (!databaseId || !activityCollectionId) {
    throw new Error("Missing required environment variables for Appwrite configuration");
}


interface UpdateQuestionsData {
    questionsObj?: string;
}

interface GetActivitiesOptions {
    limit?: number;
    offset?: number;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: {
        type?: string;
        activitytype?: string;
        difficulty?: string;
        tags?: string[];
    };
}

const ActivityService = {
    /**
     * Get all activities with optional sorting and filtering
     * @param options - Options for querying activities
     * @returns Promise<ActivityType[]>
     */
    async getActivities(options: GetActivitiesOptions = {}): Promise<ActivityType[]> {
        try {
            const queries = [];

            // Add sorting if specified
            if (options.sortField) {
                queries.push(
                    options.sortOrder === 'asc'
                        ? Query.orderAsc(options.sortField)
                        : Query.orderDesc(options.sortField)
                );
            }

            // Add filters if specified
            if (options.filters) {
                if (options.filters.type) {
                    queries.push(Query.equal('type', options.filters.type));
                }
                if (options.filters.activitytype) {
                    queries.push(Query.equal('activitytype', options.filters.activitytype));
                }
                if (options.filters.difficulty) {
                    queries.push(Query.equal('difficulty', options.filters.difficulty));
                }
                if (options.filters.tags && options.filters.tags.length > 0) {
                    queries.push(Query.equal('tags', options.filters.tags));
                }
            }

            // Add pagination if specified
            if (options.limit) {
                queries.push(Query.limit(options.limit));
            }
            if (options.offset) {
                queries.push(Query.offset(options.offset));
            }

            const response = await databases.listDocuments(
                databaseId,
                activityCollectionId,
                queries
            );

            return response.documents as unknown as ActivityType[];
        } catch (error) {
            console.error('Error fetching activities:', error);
            throw error;
        }
    },

    /**
     * Get a single activity by ID
     * @param id - The ID of the activity to retrieve
     * @returns Promise<ActivityType>
     */
    async getActivityById(id: string): Promise<ActivityType> {
        try {
            const response = await databases.getDocument(
                databaseId,
                activityCollectionId,
                id
            );
            return response as unknown as ActivityType;
        } catch (error) {
            console.error(`Error fetching activity with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Get activities by type with optional sorting
     * @param type - The activity type to filter by
     * @param sortOptions - Optional sorting options
     * @returns Promise<ActivityType[]>
     */
    async getActivitiesByType(
        type: string,
        sortOptions?: {
            field: string;
            order: 'asc' | 'desc';
        }
    ): Promise<ActivityType[]> {
        try {
            const queries = [Query.equal('type', type)];

            if (sortOptions) {
                queries.push(
                    sortOptions.order === 'asc'
                        ? Query.orderAsc(sortOptions.field)
                        : Query.orderDesc(sortOptions.field)
                );
            }

            const response = await databases.listDocuments(
                databaseId,
                activityCollectionId,
                queries
            );

            return response.documents as unknown as ActivityType[];
        } catch (error) {
            console.error(`Error fetching activities by type ${type}:`, error);
            throw error;
        }
    },

    /**
     * Create a new activity
     * @param activityData - The activity data to create
     * @returns Promise<ActivityType>
     */
    async createActivity(activityData: Omit<ActivityType, 'id'>): Promise<ActivityType> {
        try {
            const response = await databases.createDocument(
                databaseId,
                activityCollectionId,
                ID.unique(),
                activityData
            );
            return response as unknown as ActivityType;
        } catch (error) {
            console.error('Error creating activity:', error);
            throw error;
        }
    },

    /**
     * Update an existing activity
     * @param id - The ID of the activity to update
     * @param activityData - The partial activity data to update
     * @returns Promise<ActivityType>
     */
    async updateActivity(
        id: string,
        activityData: Partial<ActivityType>
    ): Promise<ActivityType> {
        try {
            const response = await databases.updateDocument(
                databaseId,
                activityCollectionId,
                id,
                activityData
            );
            return response as unknown as ActivityType;
        } catch (error) {
            console.error(`Error updating activity with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Delete an activity
     * @param id - The ID of the activity to delete
     * @returns Promise<void>
     */
    async deleteActivity(id: string): Promise<void> {
        try {
            await databases.deleteDocument(
                databaseId,
                activityCollectionId,
                id
            );
        } catch (error) {
            console.error(`Error deleting activity with ID ${id}:`, error);
            throw error;
        }
    }
};

export default ActivityService;