const activitiesData = [
  {
    id: "1001",
    type: "Calm",
    title: "Deep Sleep Music",
    description: "Fall asleep faster with calming ambient music and nature sounds.",
    tags: ["Calm", "Sleep", "Relaxation", "Music"],
    duration: "45 min",
    image: require('@/assets/images/ActivityCard.png'),
    colors: ["#E7F3FF", "#9ECBFF"] as [string, string],
    redirect: "/Trainings/Musicplayer",
    activitytype: "Read",
    data: {
      name: "Night Vibes",
      currentStep: 1,
      totalSteps: 1,
      exerciseName: "Soothing Soundscape",
      time: "45 min",
      distance: "N/A",
      imagepath: "@/assets/images/image2.png",
      Musicpath: "@/assets/audios/music.mp3",
      difficulty: "None",
      description: `Relax your mind and body with this deep sleep music session. Featuring soft ambient tones and gentle nature sounds, it's designed to reduce anxiety and guide you into restful sleep.`,
      steps: [
        "Step 1 - Find a quiet place to lie down or sit comfortably.",
        "Step 2 - Press play and close your eyes.",
        "Step 3 - Breathe deeply and let the sound guide your body to stillness."
      ]
    }
  },
  {
    // Anger
    id: "101",
    type: "Anger",
    title: "Deep Breathing & Mindfulness",
    description: "Calm your nervous system and release anger with mindful breathing.",
    tags: ["Anger", "Breathing", "Mindfulness", "Calm"],
    duration: "10 min",
    image: require('@/assets/images/ActivityCard.png'),
    colors: ["#FFE7E7", "#FF9E9E"] as [string, string],
    redirect: "/Trainings/trainingscreen",
    data: {
      name: "Breathing Practice",
      currentStep: 1,
      totalSteps: 3,
      exerciseName: "Mindful Breathing",
      time: "10 min",
      distance: "N/A",
      difficulty: "Easy",
      description: "Use slow, deep breathing to calm the nervous system and release physical tension caused by anger.",
      steps: [
        "Step 1 - Sit comfortably, hand on your belly.",
        "Step 2 - Inhale for 4 seconds, hold for 4, exhale for 4.",
        "Step 3 - Visualize anger leaving your body with each exhale."
      ]
    }
  },
  {
    id: "102",
    type: "Anger",
    title: "Channel Anger with Exercise",
    description: "Use full-body movement to release built-up tension and energy.",
    tags: ["Anger", "Exercise", "Relief", "Stress"],
    duration: "10 min",
    image: require('@/assets/images/ActivityCard.png'),
    colors: ["#E7FFF4", "#9EFFCE"] as [string, string],
    redirect: "/Trainings/trainingscreen",
    data: {
      name: "Anger Workout",
      currentStep: 1,
      totalSteps: 4,
      exerciseName: "Full-Body Movement",
      time: "10 min",
      distance: "Indoor",
      difficulty: "Medium",
      description: "Channel anger into push-ups, jump squats, or boxing to metabolize stress hormones and release energy.",
      steps: [
        "Step 1 - Start with light jogging or jumping jacks.",
        "Step 2 - Do 15 push-ups or shadow boxing for 1 min.",
        "Step 3 - Try 20 jump squats or dancing freely.",
        "Step 4 - Cool down with deep breathing."
      ]
    }
  },
  {
    id: "103",
    type: "Anger",
    title: "Guided Visualization",
    description: "Reduce emotional intensity by visualizing a peaceful state.",
    tags: ["Anger", "Visualization", "Calm", "Balance"],
    duration: "10 min",
    image: require('@/assets/images/ActivityCard.png'),
    colors: ["#E7F9FF", "#9EE6FF"] as [string, string],
    redirect: "/Trainings/trainingscreen",
    data: {
      name: "Peaceful Visualization",
      currentStep: 1,
      totalSteps: 3,
      exerciseName: "Mental Calm",
      time: "10 min",
      distance: "N/A",
      difficulty: "Easy",
      description: "Let go of emotional intensity by imagining yourself in a peaceful place like a forest or beach.",
      steps: [
        "Step 1 - Close your eyes and take deep breaths.",
        "Step 2 - Visualize a calming natural scene.",
        "Step 3 - Imagine anger dissolving into the surroundings."
      ]
    }
  },
  {
    id: "104",
    type: "Anger",
    title: "Yoga for Anger Release",
    description: "Perform yoga poses to relax your body and reduce tension.",
    tags: ["Yoga", "Anger", "Stretching", "Relaxation"],
    duration: "15 min",
    image: require('@/assets/images/ActivityCard.png'),
    colors: ["#FFF4E7", "#FFD19E"] as [string, string],
    redirect: "/Trainings/trainingscreen",
    data: {
      name: "Anger Release Yoga",
      currentStep: 2,
      totalSteps: 4,
      exerciseName: "Stretch Flow",
      time: "15 min",
      distance: "Indoor",
      difficulty: "Medium",
      description: "Stretch and relax your body to calm intense emotions and restore inner balance.",
      steps: [
        "Step 1 - Cat-Cow Pose for 5 minutes.",
        "Step 2 - Warrior Pose for 30 sec each side.",
        "Step 3 - Child’s Pose for 2 minutes.",
        "Step 4 - Deep breathing in seated position."
      ]
    }
  },

  // Fear
  {
    id: "201",
    type: "Fear",
    title: "Grounding Exercise",
    description: "Use your senses to bring yourself back to the present and reduce fear.",
    tags: ["Fear", "Grounding", "Calm", "Present Moment"],
    duration: "5 min",
    image: require('@/assets/images/ActivityCard.png'),
    colors: ["#E7F3FF", "#9ECBFF"] as [string, string],
    redirect: "/Trainings/trainingscreen",
    data: {
      name: "Sensory Grounding",
      currentStep: 1,
      totalSteps: 5,
      exerciseName: "5-4-3-2-1 Technique",
      time: "5 min",
      distance: "N/A",
      difficulty: "Easy",
      description: "Engage your senses to anchor yourself in the present and ease anxiety.",
      steps: [
        "Step 1 - Name 5 things you see.",
        "Step 2 - Identify 4 things you can touch.",
        "Step 3 - Focus on 3 sounds you hear.",
        "Step 4 - Notice 2 things you smell.",
        "Step 5 - Acknowledge 1 thing you can taste."
      ]
    }
  },
  {
    id: "904",
    type: "Anger",
    title: "Anger: Why It Happens and What It Can Do",
    description: "Learn how to understand and manage anger through awareness and positive action.",
    tags: ["Anger", "Awareness", "Emotional Health", "Stress"],
    duration: "6 min",
    image: require('@/assets/images/ActivityCard.png'),
    colors: ["#FFE7E7", "#FF9E9E"] as [string, string],
    redirect: "/Trainings/Readingscreen",
    data: {
      name: "Understanding Anger",
      currentStep: 1,
      totalSteps: 1,
      exerciseName: "Emotional Awareness",
      time: "6 min",
      distance: "N/A",
      difficulty: "Easy",
      description: `Anger is a natural emotional response to situations where we feel threatened, disrespected, or powerless. When we are angry, our body releases adrenaline and cortisol, which heightens our physical state—causing increased heart rate, tense muscles, and heightened awareness. However, if not managed properly, anger can harm both our relationships and our physical health.
  
  In this section, we'll explore how anger can be channeled constructively, focusing on physical, emotional, logical, and spiritual activities to help you manage and redirect this powerful emotion.
  
  Anger can be triggered by several internal and external factors, including:
  • Frustration: Unmet expectations, a sense of powerlessness.
  • Injustice: Feeling disrespected, mistreated, or wronged.
  • Stress: Overwhelming situations or external pressures.
  
  Understanding the root cause of your anger is essential because it helps you identify what needs to change in your life to prevent these triggers.
  
  When anger is experienced, the body goes into a fight-or-flight mode, triggering stress hormones like adrenaline and cortisol. These hormones create physical responses such as rapid heartbeat, sweating, and muscle tension, which prepare the body for action. Over time, prolonged anger can lead to chronic health issues, such as high blood pressure, insomnia, and digestive problems.
  
  Rather than suppressing or ignoring anger, you can use it to fuel positive actions. Here's how:
  1. Understand our needs: Anger can highlight unmet needs or boundaries that need to be addressed.
  2. Create motivation: The energy generated by anger can push us to take action towards resolving an issue or improving a situation.
  3. Channel the energy into something productive: Transform the raw emotional energy into creative expression, physical exertion, or problem-solving.`,
      steps: [
        "Step 1 - Read and reflect on the causes of anger.",
        "Step 2 - Identify one personal trigger.",
        "Step 3 - Think about how to channel it productively."
      ]
    }
  },
  {
    id: "901",
    type: "Fear",
    title: "Fear: How to Transform Fear into Courage",
    description: "Reframe fear into growth with actionable steps and inner strength.",
    tags: ["Fear", "Courage", "Growth", "Mindset"],
    duration: "6 min",
    image: require('@/assets/images/ActivityCard.png'),
    colors: ["#E7F3FF", "#9ECBFF"] as [string, string],
    redirect: "/Trainings/Readingscreen",
    data: {
      name: "Facing Fear",
      currentStep: 1,
      totalSteps: 1,
      exerciseName: "Fear into Fuel",
      time: "6 min",
      distance: "N/A",
      difficulty: "Easy",
      description: `Fear arises from several internal and external factors, such as:
  1. Uncertainty: Fear of the unknown or losing control.
  2. Past Trauma: Negative experiences that condition the mind to expect danger.
  3. Perceived Threats: Physical, emotional, or social risks that feel overwhelming.
  4. Anticipation of Failure: Worry about rejection or falling short of expectations.
  
  When fear takes over, our body activates the fight-or-flight response, releasing adrenaline and cortisol. This creates physical reactions like a racing heartbeat, shallow breathing, and tension, preparing us to either confront or escape danger. Left unchecked, prolonged fear can lead to anxiety, stress, and avoidance behaviors.
  
  Fear isn’t just a barrier—it can also be a signal to grow. Here’s how fear can be reframed and used effectively:
  1. Building Awareness: Understanding your fear helps you address its root cause.
  2. Fueling Growth: The energy from fear can motivate you to face challenges.
  3. Empowering Action: Fear often highlights areas where preparation or learning can help.`,
      steps: [
        "Step 1 - Identify your current fear.",
        "Step 2 - Reflect on how it could push you to grow.",
        "Step 3 - Visualize a courageous response."
      ]
    }
  },
  {
    id: "903",
    type: "Blame",
    title: "Blame: How to Transform Blame into Responsibility",
    description: "Learn to shift blame into growth by practicing ownership and awareness.",
    tags: ["Blame", "Responsibility", "Growth", "Self-Awareness"],
    duration: "6 min",
    image: require('@/assets/images/ActivityCard.png'),
    colors: ["#F5E7FF", "#D19EFF"] as [string, string],
    redirect: "/Trainings/Readingscreen",
    data: {
      name: "Owning Your Story",
      currentStep: 1,
      totalSteps: 1,
      exerciseName: "Blame to Action",
      time: "6 min",
      distance: "N/A",
      difficulty: "Easy",
      description: `Blame arises from several emotional and psychological sources:
  1. Avoidance of Responsibility: Blame serves as a defense mechanism to avoid facing personal shortcomings or mistakes.
  2. External Circumstances: When things go wrong, it feels easier to point fingers at external factors or others instead of looking inward.
  3. Fear of Judgment: We may blame others to protect ourselves from judgment, shame, or guilt.
  4. Injustice and Unfairness: Feeling wronged by others can trigger the impulse to blame them for the negative outcomes in our lives.
  
  When blame becomes chronic, it can lead to resentment, frustration, and stagnation. Blame shifts focus from problem-solving to victimhood, limiting personal growth and hindering healthy relationships.
  
  Instead of blaming others or external circumstances, you can choose to accept responsibility for your emotions, actions, and reactions. Here’s how:
  1. Self-Awareness: Recognizing when you’re about to blame helps you take a step back and reflect.
  2. Empathy: Understanding that others, too, have their own challenges and shortcomings can soften the tendency to blame.
  3. Shift in Perspective: Viewing situations as opportunities to learn helps foster personal growth.
  4. Taking Action: Responsibility allows you to take proactive steps to improve situations and change patterns.`,
      steps: [
        "Step 1 - Notice when you're blaming.",
        "Step 2 - Reflect on your role in the situation.",
        "Step 3 - Choose one way to take responsibility."
      ]
    }
  },
  {
    id: "907",
    type: "Sorrow",
    title: "Sorrow: How to Cope and Heal",
    description: "Explore sorrow as a pathway to meaning, compassion, and emotional strength.",
    tags: ["Sorrow", "Grief", "Healing", "Compassion"],
    duration: "7 min",
    image: require('@/assets/images/ActivityCard.png'),
    colors: ["#E7F9FF", "#9EE6FF"] as [string, string],
    redirect: "/Trainings/Readingscreen",
    data: {
      name: "Healing Through Sorrow",
      currentStep: 1,
      totalSteps: 1,
      exerciseName: "Emotional Healing",
      time: "7 min",
      distance: "N/A",
      difficulty: "Medium",
      description: `Sorrow is one of the most profound and universal human emotions. It often arises from loss, disappointment, or deep empathy for the suffering of others. While sorrow can feel overwhelming, it also has the potential to foster emotional growth, resilience, and a deeper understanding of life.
  
  Why Do We Feel Sorrow?
  1. Loss: The death of a loved one, the end of a relationship, or the loss of an opportunity.
  2. Disappointment: When expectations or dreams are unmet.
  3. Empathy: Feeling deeply for others’ pain or suffering.
  4. Regret: Wishing we could undo past mistakes or change outcomes.
  
  The Physical and Emotional Effects of Sorrow:
  • Physical: Fatigue, lack of appetite, disrupted sleep patterns, or heaviness in the chest.
  • Emotional: Feelings of emptiness, hopelessness, and being overwhelmed.
  
  Healing from sorrow doesn’t mean forgetting or ignoring it—it means embracing it and finding healthy ways to process and move forward.`,
      steps: [
        "Step 1 - Allow yourself to feel the sorrow.",
        "Step 2 - Journal what this pain is teaching you.",
        "Step 3 - Reflect on how sorrow can shape compassion."
      ]
    }
  },
  {
    id: "905",
    type: "Confusion",
    title: "Confusion: How to Navigate Uncertainty",
    description: "Transform confusion into clarity by slowing down and seeking inner truth.",
    tags: ["Confusion", "Clarity", "Self-Awareness", "Focus"],
    duration: "6 min",
    image: require('@/assets/images/ActivityCard.png'),
    colors: ["#E7FFFB", "#9EFFE8"] as [string, string],
    redirect: "/Trainings/Readingscreen",
    data: {
      name: "Clarity Through Stillness",
      currentStep: 1,
      totalSteps: 1,
      exerciseName: "Mental Sorting",
      time: "6 min",
      distance: "N/A",
      difficulty: "Easy",
      description: `Confusion is a natural emotional state that arises when we feel uncertain, overwhelmed, or unsure about a situation or decision. While it can feel frustrating, confusion is also an opportunity for growth and self-discovery.
  
  What Causes Confusion?
  1. Overwhelming Information: Too many choices or too much data to process.
  2. Conflicting Emotions: Feeling torn between different desires or expectations.
  3. Fear of the Unknown: Worrying about making the wrong decision or not knowing what lies ahead.
  
  Confusion occurs when the mind struggles to organize or prioritize thoughts, leading to feelings of disorientation or hesitation. It’s a signal that your brain is seeking clarity and understanding, which can be achieved through structured thinking and self-awareness.
  
  Confusion isn’t a problem to avoid but an emotion to embrace. It provides an opportunity to pause, reflect, and understand your true needs and priorities.`,
      steps: [
        "Step 1 - Identify your main area of confusion.",
        "Step 2 - Break it down into smaller questions.",
        "Step 3 - Take a small action for clarity."
      ]
    }
  },
  {
    id: "906",
    type: "Happiness",
    title: "Happiness: The Practice of Joy",
    description: "Learn how to build lasting joy through habits of gratitude, presence, and purpose.",
    tags: ["Happiness", "Gratitude", "Mindfulness", "Joy"],
    duration: "6 min",
    image: require('@/assets/images/ActivityCard.png'),
    colors: ["#FFFAE7", "#FFF19E"] as [string, string],
    redirect: "/Trainings/Readingscreen",
    data: {
      name: "Practicing Happiness",
      currentStep: 1,
      totalSteps: 1,
      exerciseName: "Inner Joy",
      time: "6 min",
      distance: "N/A",
      difficulty: "Easy",
      description: `Happiness is one of the most sought-after emotions, yet it can often feel fleeting or elusive. At its core, happiness is a state of well-being that arises when we feel content, fulfilled, or at peace.
  
  What Contributes to Happiness?
  • External: Positive relationships, accomplishments, and enjoyable experiences.
  • Internal: Gratitude, self-compassion, and a sense of purpose.
  
  Why Does Happiness Matter?
  • Boosts resilience and helps us handle challenges better.
  • Strengthens relationships and deepens social connections.
  • Enhances overall health, reducing stress and improving immunity.
  
  Barriers to Happiness:
  • Comparison: Measuring our life against others’.
  • Negative Thinking: Focusing on what’s missing rather than what we have.
  • Unrealistic Expectations: Chasing perfection instead of appreciating progress.
  
  Happiness is not just a feeling; it’s a practice. Through gratitude, kindness, mindfulness, and purpose-driven goals, we can build a life that naturally fosters joy.`,
      steps: [
        "Step 1 - Reflect on what brings you joy.",
        "Step 2 - Practice one gratitude moment today.",
        "Step 3 - Smile and breathe in the moment."
      ]
    }
  }
];

export default activitiesData