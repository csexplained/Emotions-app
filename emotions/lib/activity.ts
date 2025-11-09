import { databases, DATABASE_ID, COLLECTIONS, Query } from './appwrite';
import { ActivityType, ActivityStep } from '@/types/Activitys.types';

interface GetActivitiesParams {
    limit?: number;
    offset?: number;
    filters?: {
        type?: string;
        search?: string;
        difficulty?: string;
        activitytype?: string;
    };
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
}

class ActivityService {
    async getActivities(params: GetActivitiesParams = {}): Promise<ActivityType[]> {
        try {
            const {
                limit = 10,
                offset = 0,
                filters = {},
                sortField = 'popularity',
                sortOrder = 'desc'
            } = params;

            // Build queries array
            const queries: string[] = [
                Query.limit(limit),
                Query.offset(offset),
            ];

            // Add filters
            if (filters.type && filters.type !== 'all') {
                queries.push(Query.equal('type', filters.type));
            }

            if (filters.difficulty && filters.difficulty !== 'all') {
                queries.push(Query.equal('difficulty', filters.difficulty));
            }

            if (filters.activitytype && filters.activitytype !== 'all') {
                queries.push(Query.equal('activitytype', filters.activitytype));
            }

            // Add search filter - FIXED: Don't search on array fields
            if (filters.search && filters.search.trim() !== '') {

            }

            // Add sorting
            if (sortField === 'title') {
                queries.push(sortOrder === 'asc' ? Query.orderAsc('title') : Query.orderDesc('title'));
            } else if (sortField === 'popularity') {
                queries.push(sortOrder === 'asc' ? Query.orderAsc('popularity') : Query.orderDesc('popularity'));
            } else {
                queries.push(Query.orderDesc('$createdAt')); // Default sort
            }

            console.log('Fetching activities with queries:', queries);

            // Fetch from Appwrite
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.ACTIVITIES,
                queries
            );

            console.log(`Found ${response.documents.length} activities`);

            // If we have a search query, we need to filter by tags manually
            let filteredDocuments = response.documents;
            if (filters.search && filters.search.trim() !== '') {
                filteredDocuments = this.filterByTags(response.documents, filters.search);
            }

            // Transform Appwrite documents to ActivityType
            const activities: ActivityType[] = filteredDocuments.map(doc => this.transformDocumentToActivity(doc));

            return activities;

        } catch (error) {
            console.error('Error fetching activities from Appwrite:', error);

            // More specific error handling
            if (error instanceof Error) {
                if (error.message.includes('Invalid query')) {
                    throw new Error('Search query contains invalid characters');
                } else if (error.message.includes('network') || error.message.includes('Network')) {
                    throw new Error('Network error - please check your connection');
                }
            }

            throw new Error('Failed to fetch activities');
        }
    }

    // Manual filter for tags since we can't search arrays in Appwrite
    private filterByTags(documents: any[], searchQuery: string): any[] {
        if (!searchQuery || searchQuery.trim() === '') {
            return documents;
        }

        const searchLower = searchQuery.toLowerCase().trim();

        return documents.filter(doc => {
            // Check if any tag matches the search
            if (doc.tags && Array.isArray(doc.tags)) {
                const hasMatchingTag = doc.tags.some((tag: string) =>
                    tag.toLowerCase().includes(searchLower)
                );

                if (hasMatchingTag) {
                    return true;
                }
            }

            // Also check other fields that might contain relevant info
            const otherFieldsMatch =
                (doc.type && doc.type.toLowerCase().includes(searchLower)) ||
                (doc.activitytype && doc.activitytype.toLowerCase().includes(searchLower)) ||
                (doc.difficulty && doc.difficulty.toLowerCase().includes(searchLower));

            return otherFieldsMatch;
        });
    }

    async getActivityById(id: string): Promise<ActivityType | null> {
        try {
            const document = await databases.getDocument(
                DATABASE_ID,
                COLLECTIONS.ACTIVITIES,
                id
            );

            return this.transformDocumentToActivity(document);
        } catch (error) {
            console.error('Error fetching activity by ID:', error);
            return null;
        }
    }

    async getFeaturedActivities(): Promise<ActivityType[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.ACTIVITIES,
                [
                    Query.equal('isFeatured', true),
                    Query.limit(10),
                    Query.orderDesc('popularity')
                ]
            );

            return response.documents.map(doc => this.transformDocumentToActivity(doc));
        } catch (error) {
            console.error('Error fetching featured activities:', error);
            throw new Error('Failed to fetch featured activities');
        }
    }

    async getActivitiesByType(type: string): Promise<ActivityType[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.ACTIVITIES,
                [
                    Query.equal('type', type),
                    Query.limit(20),
                    Query.orderDesc('popularity')
                ]
            );

            return response.documents.map(doc => this.transformDocumentToActivity(doc));
        } catch (error) {
            console.error('Error fetching activities by type:', error);
            throw new Error('Failed to fetch activities by type');
        }
    }

    async getActivitiesByEmotion(emotion: string): Promise<ActivityType[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.ACTIVITIES,
                [
                    Query.equal('type', emotion),
                    Query.limit(20),
                    Query.orderDesc('popularity')
                ]
            );

            return response.documents.map(doc => this.transformDocumentToActivity(doc));
        } catch (error) {
            console.error('Error fetching activities by emotion:', error);
            throw new Error('Failed to fetch activities by emotion');
        }
    }

    // Enhanced search with better error handling
    async searchActivities(searchTerm: string, limit: number = 20): Promise<ActivityType[]> {
        try {
            if (!searchTerm || searchTerm.trim() === '') {
                return this.getActivities({ limit });
            }

            // Clean the search term - remove special characters that might break the query
            const cleanSearchTerm = searchTerm.replace(/[^\w\s]/gi, '').trim();

            if (cleanSearchTerm.length === 0) {
                return [];
            }

            const queries = [
                Query.limit(limit),
                Query.or([
                    Query.search('title', cleanSearchTerm),
                    Query.search('description', cleanSearchTerm),
                    Query.search('type', cleanSearchTerm),
                    Query.search('activitytype', cleanSearchTerm),
                    Query.search('exerciseName', cleanSearchTerm),
                ])
            ];

            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.ACTIVITIES,
                queries
            );

            // Manual tag filtering for better search results
            const filteredDocuments = this.filterByTags(response.documents, cleanSearchTerm);

            return filteredDocuments.map(doc => this.transformDocumentToActivity(doc));

        } catch (error) {
            console.error('Error in searchActivities:', error);

            // Fallback: get all activities and filter locally
            console.log('Using fallback search method...');
            try {
                const allActivities = await this.getActivities({ limit: 50 });
                return this.localSearch(allActivities, searchTerm);
            } catch (fallbackError) {
                console.error('Fallback search also failed:', fallbackError);
                throw new Error('Search failed. Please try again.');
            }
        }
    }

    // Local search as fallback
    private localSearch(activities: ActivityType[], searchTerm: string): ActivityType[] {
        const searchLower = searchTerm.toLowerCase().trim();

        return activities.filter(activity => {
            return (
                activity.title.toLowerCase().includes(searchLower) ||
                activity.description.toLowerCase().includes(searchLower) ||
                activity.type.toLowerCase().includes(searchLower) ||
                activity.activitytype.toLowerCase().includes(searchLower) ||
                activity.exerciseName?.toLowerCase().includes(searchLower) ||
                activity.tags.some(tag => tag.toLowerCase().includes(searchLower))
            );
        });
    }

    // Helper method to transform Appwrite document to ActivityType
    private transformDocumentToActivity(doc: any): ActivityType {
        // Parse steps from JSON string
        let steps: ActivityStep[] = [];
        try {
            if (typeof doc.steps === 'string') {
                steps = JSON.parse(doc.steps);
            } else if (Array.isArray(doc.steps)) {
                steps = doc.steps;
            }
        } catch (error) {
            console.error('Error parsing steps:', error);
            steps = [];
        }

        // Parse stepConfig from JSON string
        let stepConfig = undefined;
        try {
            if (doc.stepConfig && typeof doc.stepConfig === 'string') {
                stepConfig = JSON.parse(doc.stepConfig);
            }
        } catch (error) {
            console.error('Error parsing stepConfig:', error);
        }

        // Use first image from imagepath as the main image, or fallback to local asset
        const mainImage = doc.imagepath && doc.imagepath.length > 0
            ? { uri: doc.imagepath[0] }
            : require('@/assets/images/ActivityCard.png');

        return {
            $id: doc.$id,
            name: doc.name || '',
            title: doc.title || '',
            type: doc.type || '',
            activitytype: doc.activitytype || 'Exercise',
            difficulty: doc.difficulty || 'Easy',
            tags: doc.tags || [],
            description: doc.description || '',
            activityDescription: doc.activityDescription || '',
            image: mainImage,
            imagepath: doc.imagepath || [],
            Musicpath: doc.Musicpath || 'N/A',
            colors: doc.colors && doc.colors.length >= 2
                ? [doc.colors[0], doc.colors[1]] as [string, string]
                : ['#D7FFF1', '#58DFAE'] as [string, string],
            redirect: doc.redirect || 'trainingscreen',
            time: doc.time || '',
            duration: doc.duration || '',
            distance: doc.distance || '',
            exerciseName: doc.exerciseName || '',
            steps: steps,
            stepConfig: stepConfig,
            isFeatured: doc.isFeatured || false,
            popularity: doc.popularity || 0,
            $createdAt: doc.$createdAt,
            $updatedAt: doc.$updatedAt
        };
    }

    // Method to increment popularity when activity is viewed
    async incrementPopularity(activityId: string): Promise<void> {
        try {
            const activity = await this.getActivityById(activityId);
            if (activity) {
                const newPopularity = (activity.popularity || 0) + 1;
                await databases.updateDocument(
                    DATABASE_ID,
                    COLLECTIONS.ACTIVITIES,
                    activityId,
                    {
                        popularity: newPopularity
                    }
                );
            }
        } catch (error) {
            console.error('Error incrementing popularity:', error);
        }
    }
}

export default new ActivityService();