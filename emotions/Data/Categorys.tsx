import React from "react";
import { NormalIcon, HappyIcon, AngerIcon, SadIcon } from '@/assets/icons/emotionemojis';
import Humanicon from "@/assets/icons/humanicon";
import CardData from "@/types/Carddata.types";

const cardsData: CardData[] = [
  {
    id: '901', // Anger reading activity
    icon: <AngerIcon height={55} width={55} />,
    bgColor: "#FFE7E7",
    iconBgColor: "#FF4A4A",
    issueText: "Feeling Angry?",
    description: "Learn how to use anger constructively.",
    redirect: "/Trainings/Readingscreen?id=901"
  },
  {
    id: '903', // Blame reading activity
    icon: <NormalIcon height={55} width={55} />,
    bgColor: "#FFF4E7",
    iconBgColor: "#FF9E00",
    issueText: "Caught in Blame?",
    description: "Shift blame into personal power.",
    redirect: "/Trainings/Readingscreen?id=903"
  },
  {
    id: '904', // Sorrow reading activity
    icon: <SadIcon height={55} width={55} />,
    bgColor: "#D9E6FF",
    iconBgColor: "#6789FF",
    issueText: "Feeling Low?",
    description: "Explore how sorrow leads to healing.",
    redirect: "/Trainings/Readingscreen?id=904"
  },
  {
    id: '905', // Confusion reading activity
    icon: <Humanicon height={55} width={55} />,
    bgColor: "#E7FFFB",
    iconBgColor: "#00C6AE",
    issueText: "Mentally Foggy?",
    description: "Turn confusion into clarity.",
    redirect: "/Trainings/Readingscreen?id=905"
  },
  {
    id: '906', // Happiness reading activity
    icon: <HappyIcon height={55} width={55} />,
    bgColor: "#FFFDE7",
    iconBgColor: "#FFD600",
    issueText: "Want More Joy?",
    description: "Build joy through gratitude and purpose.",
    redirect: "/Trainings/Readingscreen?id=906"
  }
];

export default cardsData;
