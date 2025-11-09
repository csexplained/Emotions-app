import { ImageSourcePropType } from "react-native";

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

export interface ActivityType {
  // Core identifiers
  $id: string;
  name: string;
  title: string;

  // Categorization
  type: string;
  activitytype: "Read" | "Music" | "Exercise" | "Guided" | "Breathing" | string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  tags: string[];

  // Content
  description: string;
  activityDescription: string;

  // Media
  image: ImageSourcePropType; // For local assets
  imagepath: string[]; // For remote images
  Musicpath: string;

  // Visual styling
  colors: [string, string];

  // Navigation
  redirect: string;

  // Progress tracking
  currentStep?: number;
  totalSteps?: number;
  exerciseName?: string;

  // Activity metrics
  time?: string;
  duration?: string;
  distance?: string;

  // Enhanced step-based structure
  steps: ActivityStep[];

  // Step configuration
  stepConfig?: StepConfig;

  // Metadata
  isFeatured?: boolean;
  popularity?: number;
  $createdAt?: string;
  $updatedAt?: string;
}

// For the activity card props
export interface ActivityCardProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
  duration?: string;
  image: ImageSourcePropType | string;
  colors: [string, string];
  redirect: string;
  activitytype: string;
  difficulty: string;
  onPress?: () => void;
}