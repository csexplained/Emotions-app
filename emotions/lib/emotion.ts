import { databases, DATABASE_ID, COLLECTIONS, Query } from './appwrite';
import { EmotionType } from '@/types/category.types';

class EmotionService {
    async getEmotions(): Promise<EmotionType[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.EMOTION_TYPES,
                [
                    Query.equal('isActive', true),
                    Query.orderAsc('order'),
                    Query.limit(20)
                ]
            );

            return response.documents.map(doc => this.transformDocumentToEmotion(doc));
        } catch (error) {
            console.error('Error fetching emotions from Appwrite:', error);
            throw new Error('Failed to fetch emotion categories');
        }
    }

    async getEmotionByName(name: string): Promise<EmotionType | null> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.EMOTION_TYPES,
                [
                    Query.equal('name', name),
                    Query.equal('isActive', true)
                ]
            );

            if (response.documents.length > 0) {
                return this.transformDocumentToEmotion(response.documents[0]);
            }
            return null;
        } catch (error) {
            console.error('Error fetching emotion by name:', error);
            return null;
        }
    }

    private transformDocumentToEmotion(doc: any): EmotionType {
        return {
            $id: doc.$id,
            name: doc.name || '',
            displayName: doc.displayName || '',
            color: doc.color || '#667eea',
            description: doc.description || '',
            icon: doc.icon || '😊',
            isActive: doc.isActive || false,
            order: doc.order || 0
        };
    }
}

export default new EmotionService();