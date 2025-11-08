import { BaseService } from './BaseService';
import { Query, type AppwriteDocument } from '../lib/appwrite-config';

export interface EmotionType extends AppwriteDocument {
    name: string;
    displayName: string;
    color: string;
    description: string;
    icon: string;
    isActive: boolean;
    order: number;
}

// Type for creating emotions without system fields
export type CreateEmotionData = Omit<EmotionType, keyof AppwriteDocument>;

export class EmotionTypeService extends BaseService<EmotionType> {
    constructor() {
        super('emotion_types');
    }

    // Get all active emotion types
    async getActiveEmotions(): Promise<EmotionType[]> {
        const result = await this.getAll([
            Query.equal('isActive', true),
            Query.orderAsc('order')
        ]);
        return result.documents;
    }

    // Get all emotion types (including inactive)
    async getAllEmotions(): Promise<EmotionType[]> {
        const result = await this.getAll([
            Query.orderAsc('order')
        ]);
        return result.documents;
    }

    // Get emotion by name
    async getByName(name: string): Promise<EmotionType> {
        const result = await this.getAll([
            Query.equal('name', name)
        ]);

        if (result.documents.length === 0) {
            throw new Error(`Emotion type '${name}' not found`);
        }

        return result.documents[0];
    }

    // Create new emotion type
    async createEmotion(emotionData: CreateEmotionData): Promise<EmotionType> {
        return await this.create(emotionData);
    }

    // Update emotion order
    async updateOrder(emotionId: string, newOrder: number): Promise<EmotionType> {
        return await this.update(emotionId, { order: newOrder });
    }

    // Toggle emotion active status
    async toggleActive(emotionId: string): Promise<EmotionType> {
        const emotion = await this.getById(emotionId);
        return await this.update(emotionId, { isActive: !emotion.isActive });
    }
}