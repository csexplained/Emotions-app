import { ImageSourcePropType } from "react-native";

export interface ActivityType {
    $id: string;
    type: "Anger" | "Fear" | "Blame" | "Sorrow" | "Confusion" | "Happiness" | "Calm" | string;
    title: string;
    description: string;
    tags: string[];
    duration: string;
    image: ImageSourcePropType;
    colors: [string, string];
    redirect: string;
    activitytype: "Read" | "Music" | "Exercise" | string;
    name: string;
    currentStep?: number;
    totalSteps?: number;
    exerciseName?: string;
    imagepath: string[],
    Musicpath: string,
    time?: string;
    distance?: string;
    difficulty: "Easy" | "Medium" | "Hard" | string;
    activityDescription: string;
    steps: string[];
}