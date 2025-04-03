import { ImageSourcePropType } from "react-native";

export interface ActivityType {
    id: number;
    type: "Anger" | "Fear" | "Blame" | "Sorrow" | "Confusion" | "Happiness"; // or string if you plan to make this dynamic
    title: string;
    description: string;
    tags: string[];
    duration: string;
    image: ImageSourcePropType; // or ImageSourcePropType if you're using React Native with TypeScript
    colors: [string, string];
    redirect: string;
    data: {
        name: string;
        currentStep: number;
        totalSteps: number;
        exerciseName: string;
        time: string;
        distance: string;
        difficulty: "Easy" | "Medium" | "Hard" | string;
        description: string;
        steps: string[];
    };
}