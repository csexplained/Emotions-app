import { BaseService } from './BaseService';
import { Query, type AppwriteDocument } from '../lib/appwrite-config';

export interface ActivityStep {
  stepNumber: number;
  title: string;
  description: string;
  duration?: string;
  image?: string;
  instructions: string[];
  tips?: string[];
  audioPrompt?: string;
}

export interface StepConfig {
  autoProceed: boolean;
  showTimer: boolean;
  allowSkip: boolean;
  repeatable: boolean;
}

export interface ActivityType extends AppwriteDocument {
  name: string;
  title: string;
  type: string;
  activitytype: "Read" | "Music" | "Exercise" | string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  tags: string[];
  description: string;
  activityDescription: string;
  imagepath: string[];
  Musicpath: string;
  colors: string[];
  redirect: string;
  time?: string;
  duration?: string;
  distance?: string;
  currentStep?: number;
  totalSteps?: number;
  exerciseName: string;
  steps: string; // JSON string of ActivityStep[]
  stepConfig?: string; // JSON string of StepConfig
  isFeatured: boolean;
  popularity: number;
}

export type CreateActivityData = Omit<ActivityType, keyof AppwriteDocument | 'steps' | 'stepConfig' | 'redirect'> & {
  steps: ActivityStep[];
  stepConfig?: StepConfig;
  currentStep?: number;
  totalSteps?: number;
  isFeatured?: boolean;
  popularity?: number;
  redirect?: string; // Add redirect here
};

export class ActivityService extends BaseService<ActivityType> {
  constructor() {
    super('activities');
  }

  // Parse steps from JSON string
  parseSteps(stepsJson: string): ActivityStep[] {
    try {
      return JSON.parse(stepsJson);
    } catch (error) {
      console.error('Error parsing steps JSON:', error);
      return [];
    }
  }

  // Parse step config from JSON string
  parseStepConfig(configJson: string | undefined): StepConfig | undefined {
    if (!configJson) return undefined;
    try {
      return JSON.parse(configJson);
    } catch (error) {
      console.error('Error parsing step config JSON:', error);
      return undefined;
    }
  }

  // Stringify steps to JSON
  stringifySteps(steps: ActivityStep[]): string {
    return JSON.stringify(steps);
  }

  // Stringify step config to JSON
  stringifyStepConfig(config: StepConfig | undefined): string | undefined {
    return config ? JSON.stringify(config) : undefined;
  }

  // Create activity with proper step formatting
  async createActivity(activityData: CreateActivityData): Promise<ActivityType> {
    const formattedData = {
      ...activityData,
      steps: this.stringifySteps(activityData.steps),
      stepConfig: this.stringifyStepConfig(activityData.stepConfig),
      currentStep: activityData.currentStep || 1,
      totalSteps: activityData.totalSteps || activityData.steps.length,
      isFeatured: activityData.isFeatured !== undefined ? activityData.isFeatured : true,
      popularity: activityData.popularity || 0
    };

    return await this.create(formattedData);
  }

  // Update activity with proper step formatting
  async updateActivity(activityId: string, updates: Partial<CreateActivityData>): Promise<ActivityType> {
    const formattedUpdates: any = { ...updates };

    if (updates.steps) {
      formattedUpdates.steps = this.stringifySteps(updates.steps);
      formattedUpdates.totalSteps = updates.steps.length;
    }

    if (updates.stepConfig) {
      formattedUpdates.stepConfig = this.stringifyStepConfig(updates.stepConfig);
    }

    return await this.update(activityId, formattedUpdates);
  }

  // Get activities by emotion type
  async getByEmotionType(emotionType: string): Promise<ActivityType[]> {
    const result = await this.getAll([
      Query.equal('type', emotionType),
      Query.orderDesc('popularity')
    ]);
    return result.documents;
  }

  // Get activities by activity type
  async getByActivityType(activityType: string): Promise<ActivityType[]> {
    const result = await this.getAll([
      Query.equal('activitytype', activityType),
      Query.orderDesc('$createdAt')
    ]);
    return result.documents;
  }

  // Get featured activities
  async getFeaturedActivities(): Promise<ActivityType[]> {
    const result = await this.getAll([
      Query.equal('isFeatured', true),
      Query.limit(10),
      Query.orderDesc('popularity')
    ]);
    return result.documents;
  }

  // Get activities by difficulty
  async getByDifficulty(difficulty: string): Promise<ActivityType[]> {
    const result = await this.getAll([
      Query.equal('difficulty', difficulty),
      Query.orderAsc('title')
    ]);
    return result.documents;
  }

  // Search activities
  async searchActivities(searchTerm: string): Promise<ActivityType[]> {
    const result = await this.getAll([
      Query.search('title', searchTerm),
      Query.or([
        Query.search('description', searchTerm),
        Query.search('tags', searchTerm)
      ])
    ]);
    return result.documents;
  }

  // Update activity popularity
  async incrementPopularity(activityId: string): Promise<ActivityType> {
    const activity = await this.getById(activityId);
    const newPopularity = (activity.popularity || 0) + 1;

    return await this.update(activityId, { popularity: newPopularity });
  }

  // Toggle featured status
  async toggleFeatured(activityId: string): Promise<ActivityType> {
    const activity = await this.getById(activityId);
    return await this.update(activityId, {
      isFeatured: !activity.isFeatured
    });
  }

  // Get activities with pagination
  async getPaginatedActivities(limit: number = 20, offset: number = 0): Promise<ActivityType[]> {
    const result = await this.getAll([
      Query.limit(limit),
      Query.offset(offset),
      Query.orderDesc('$createdAt')
    ]);
    return result.documents;
  }

  // Get activity with parsed steps
  async getActivityWithParsedSteps(activityId: string): Promise<ActivityType & { parsedSteps: ActivityStep[]; parsedStepConfig?: StepConfig }> {
    const activity = await this.getById(activityId);
    return {
      ...activity,
      parsedSteps: this.parseSteps(activity.steps),
      parsedStepConfig: this.parseStepConfig(activity.stepConfig)
    };
  }

  // Get all activities with parsed steps
  async getAllActivitiesWithParsedSteps(): Promise<(ActivityType & { parsedSteps: ActivityStep[]; parsedStepConfig?: StepConfig })[]> {
    const result = await this.getAll();
    return result.documents.map(activity => ({
      ...activity,
      parsedSteps: this.parseSteps(activity.steps),
      parsedStepConfig: this.parseStepConfig(activity.stepConfig)
    }));
  }
}