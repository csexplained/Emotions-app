export interface EmotionType {
    $id: string;
    name: string;
    displayName: string;
    color: string;
    description: string;
    icon: string;
    isActive: boolean;
    order: number;
}

export interface CategoryCardProps {
    id: string;
    icon: JSX.Element | string;
    type: string;
    bgColor: string;
    iconBgColor?: string;
    issueText: string;
    description: string;
    onPress?: () => void;
    isActive?: boolean;
}

// Legacy type for backward compatibility
type CardDataTypes = {
    id: string;
    icon: JSX.Element;
    type: "Anger" | "Fear" | "Blame" | "Sorrow" | "Confusion" | "Happiness" | "Calm" | string;
    bgColor: string;
    iconBgColor: string;
    issueText: string;
    description: string;
};

export default CardDataTypes;