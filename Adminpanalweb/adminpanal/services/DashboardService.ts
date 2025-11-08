import { EmotionTypeService } from './EmotionTypeService';
import { ActivityService } from './ActivityService';

export interface DashboardStats {
  totalActivities: number;
  totalCategories: number;
  featuredActivities: number;
  popularActivities: any[];
  activitiesByType: {
    type: string;
    count: number;
  }[];
  activitiesByDifficulty: {
    difficulty: string;
    count: number;
  }[];
}

export class DashboardService {
  private emotionService: EmotionTypeService;
  private activityService: ActivityService;

  constructor() {
    this.emotionService = new EmotionTypeService();
    this.activityService = new ActivityService();
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [
        activities,
        emotions,
        featuredActivities
      ] = await Promise.all([
        this.activityService.getAll(),
        this.emotionService.getAllEmotions(),
        this.activityService.getFeaturedActivities()
      ]);

      // Get popular activities
      const popularActivities = activities.documents
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 5);

      // Activities by type
      const activitiesByType = activities.documents.reduce((acc: any[], activity) => {
        const existing = acc.find(item => item.type === activity.activitytype);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ type: activity.activitytype, count: 1 });
        }
        return acc;
      }, []);

      // Activities by difficulty
      const activitiesByDifficulty = activities.documents.reduce((acc: any[], activity) => {
        const existing = acc.find(item => item.difficulty === activity.difficulty);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ difficulty: activity.difficulty, count: 1 });
        }
        return acc;
      }, []);

      return {
        totalActivities: activities.total,
        totalCategories: emotions.length,
        featuredActivities: featuredActivities.length,
        popularActivities,
        activitiesByType,
        activitiesByDifficulty
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
}