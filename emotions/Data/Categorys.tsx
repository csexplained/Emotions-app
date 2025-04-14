import React from "react";
import { NormalIcon, CustomIcon, HappyIcon, AngerIcon, SadIcon } from '@/assets/icons/emotionemojis';
import Humanicon from "@/assets/icons/humanicon";
import CardData from "@/types/Carddata.types";

const cardsData: CardData[] = [
  {
    id: '906', // Happiness reading activity
    icon: <HappyIcon height={55} width={55} />,
    bgColor: "#FFFDE7",
    type: "Calm",
    iconBgColor: "#FFD600",
    issueText: "Want More Joy?",
    description: "Build joy through gratitude and purpose.",

  },
  {
    id: '901', // Anger reading activity
    icon: <AngerIcon height={55} width={55} />,
    bgColor: "#FFE7E7",
    type: "Anger",
    iconBgColor: "#FF4A4A",
    issueText: "Feeling Angry?",
    description: "Learn how to use anger constructively.",

  },
  {
    id: '903', // Blame reading activity
    icon: <NormalIcon height={55} width={55} />,
    bgColor: "#FFF4E7",
    type: "Blame",
    iconBgColor: "#FF9E00",
    issueText: "Caught in Blame?",
    description: "Shift blame into personal power.",

  },
  {
    id: '904', // Sorrow reading activity
    icon: <SadIcon height={55} width={55} />,
    bgColor: "#D9E6FF",
    type: "Sorrow",
    iconBgColor: "#6789FF",
    issueText: "Feeling Low?",
    description: "Explore how sorrow leads to healing.",

  },
  {
    id: '905', // Confusion reading activity
    icon: <Humanicon height={55} width={55} />,
    bgColor: "#E7FFFB",
    type: "Confusion",
    iconBgColor: "#00C6AE",
    issueText: "Mentally Foggy?",
    description: "Turn confusion into clarity.",

  },
  {
    id: '906', // Happiness reading activity
    icon: <HappyIcon height={55} width={55} />,
    bgColor: "#FFFDE7",
    type: "Happiness",
    iconBgColor: "#FFD600",
    issueText: "Want More Joy?",
    description: "Build joy through gratitude and purpose.",

  }
];

export default cardsData;
