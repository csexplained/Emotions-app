// appwrite/activity.service.ts

import { Client, Databases, ID, Query } from "appwrite";
import { ActivityType } from "@/types/activitycard.types";

// Assert environment variables are present
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const activityCollectionId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ACTIVITYCOLLECTION;
const appwriteEndpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const appwriteProjectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!databaseId || !activityCollectionId || !appwriteEndpoint || !appwriteProjectId) {
    throw new Error("Missing required environment variables for Appwrite configuration");
}

// Initialize Appwrite client
const client = new Client();
client.setEndpoint(appwriteEndpoint).setProject(appwriteProjectId);

const databases = new Databases(client);

// Types
interface GetActivitiesOptions {
    limit?: number;
    offset?: number;
    sortField?: string;
    sortOrder?: "asc" | "desc";
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
     */
    async getActivities(options: GetActivitiesOptions = {}): Promise<ActivityType[]> {
        try {
            const queries: string[] = [];

            const { sortField, sortOrder = "asc", filters, limit, offset } = options;

            if (sortField) {
                queries.push(
                    sortOrder === "asc"
                        ? Query.orderAsc(sortField)
                        : Query.orderDesc(sortField)
                );
            }

            if (filters) {
                const { type, activitytype, difficulty, tags } = filters;
                if (type) queries.push(Query.equal("type", type));
                if (activitytype) queries.push(Query.equal("activitytype", activitytype));
                if (difficulty) queries.push(Query.equal("difficulty", difficulty));
                if (tags && tags.length > 0) queries.push(Query.equal("tags", tags));
            }

            if (limit) queries.push(Query.limit(limit));
            if (offset) queries.push(Query.offset(offset));

            const response = await databases.listDocuments(databaseId, activityCollectionId, queries);
            return response.documents as unknown as ActivityType[];
        } catch (error) {
            console.error("Error fetching activities:", error);
            throw error;
        }
    },

    /**
     * Get a single activity by ID
     */
    async getActivityById(id: string): Promise<ActivityType> {
        try {
            const response = await databases.getDocument(databaseId, activityCollectionId, id);
            return response as unknown as ActivityType;
        } catch (error) {
            console.error(`Error fetching activity with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Get activities by type with optional sorting
     */
    async getActivitiesByType(
        type: string,
        sortOptions?: { field: string; order: "asc" | "desc" }
    ): Promise<ActivityType[]> {
        try {
            const queries: string[] = [Query.equal("type", type)];

            if (sortOptions) {
                queries.push(
                    sortOptions.order === "asc"
                        ? Query.orderAsc(sortOptions.field)
                        : Query.orderDesc(sortOptions.field)
                );
            }

            const response = await databases.listDocuments(databaseId, activityCollectionId, queries);
            return response.documents as unknown as ActivityType[];
        } catch (error) {
            console.error(`Error fetching activities by type ${type}:`, error);
            throw error;
        }
    },

    /**
     * Create a new activity
     */
    async createActivity(activityData: Omit<ActivityType, "$id">): Promise<ActivityType> {
        try {
            const response = await databases.createDocument(
                databaseId,
                activityCollectionId,
                ID.unique(),
                activityData
            );
            return response as unknown as ActivityType;
        } catch (error) {
            console.error("Error creating activity:", error);
            throw error;
        }
    },

    /**
     * Update an existing activity
     */
    async updateActivity(id: string, activityData: Partial<ActivityType>): Promise<ActivityType> {
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
     */
    async deleteActivity(id: string): Promise<void> {
        try {
            await databases.deleteDocument(databaseId, activityCollectionId, id);
        } catch (error) {
            console.error(`Error deleting activity with ID ${id}:`, error);
            throw error;
        }
    },
};

export default ActivityService;
