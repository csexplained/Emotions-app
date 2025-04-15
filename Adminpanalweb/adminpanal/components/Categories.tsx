
import { Wind, Anchor, BookOpen, Palmtree, Brain, Smile } from 'lucide-react';

const categories = [
  {
    emotion: "Anger",
    color: "bg-emotion-anger/10",
    textColor: "text-emotion-anger",
    icon: <Wind size={24} />,
    activity: "Breathwork",
    description: "Calming breathing exercises to release tension and restore balance."
  },
  {
    emotion: "Fear",
    color: "bg-emotion-fear/10",
    textColor: "text-emotion-fear",
    icon: <Anchor size={24} />,
    activity: "Grounding",
    description: "Techniques to connect with the present moment and reduce anxiety."
  },
  {
    emotion: "Sorrow",
    color: "bg-emotion-sorrow/10",
    textColor: "text-emotion-sorrow",
    icon: <BookOpen size={24} />,
    activity: "Journaling",
    description: "Expressive writing prompts to process feelings and find clarity."
  },
  {
    emotion: "Happiness",
    color: "bg-emotion-happiness/10",
    textColor: "text-emotion-happiness",
    icon: <Palmtree size={24} />,
    activity: "Nature Walks",
    description: "Guided outdoor meditations to amplify positive emotions."
  },
  {
    emotion: "Confusion",
    color: "bg-emotion-confusion/10",
    textColor: "text-emotion-confusion",
    icon: <Brain size={24} />,
    activity: "Mindfulness",
    description: "Focusing exercises to clear mental fog and improve clarity."
  },
  {
    emotion: "Blame",
    color: "bg-emotion-blame/10",
    textColor: "text-emotion-blame",
    icon: <Smile size={24} />,
    activity: "Self-Compassion",
    description: "Practices to cultivate kindness toward yourself and others."
  }
];

const Categories = () => {
  return (
    <section id="categories" className="section-spacing bg-minty">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">Emotion-Based Activities</h2>
          <p className="text-gray-600">
            Tailored activities designed to address specific emotional states and help restore balance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((item, index) => (
            <div key={index} className={`${item.color} p-6 rounded-2xl shadow-soft hover-scale`}>
              <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center ${item.textColor} mb-4`}>
                {item.icon}
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-medium">{item.emotion}</h3>
                <span className="text-gray-400">→</span>
                <span className={`${item.textColor} font-medium`}>{item.activity}</span>
              </div>
              
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Each activity is developed with input from mental wellness experts and refined through user feedback.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Categories;
