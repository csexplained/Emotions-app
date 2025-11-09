export interface UserProgress {
  activityId: string;
  currentStep: number;
  completedSteps: number[];
  totalTimeSpent: number; // in seconds
  completed: boolean;
  lastAccessed: string;
  favorite: boolean;
}

export interface SessionData {
  sessionId: string;
  activityId: string;
  startTime: string;
  endTime?: string;
  stepsCompleted: number;
  totalSteps: number;
  moodBefore?: number; // 1-5 scale
  moodAfter?: number; // 1-5 scale
}