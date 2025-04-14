

export interface ActivityType {
    $id: string;
    type: "Anger" | "Fear" | "Blame" | "Sorrow" | "Confusion" | "Happiness" | "Calm" | string;
    title: string;
    description: string;
    tags: string[];
    duration: string;
    image: string;
    colors: [string, string];
    redirect: string;
    activitytype: "Read" | "Music" | "Exercise" | string;
    name: string;
    currentStep?: string;
    totalSteps?: string;
    exerciseName?: string;
    imagepath: string[],
    Musicpath: string,
    time?: string;
    distance?: string;
    difficulty: "Easy" | "Medium" | "Hard" | string;
    activityDescription: string;
    steps: string[];
}