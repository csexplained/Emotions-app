
import React from 'react';
import { Brain, Activity, ArrowRight, Heart } from 'lucide-react';

const steps = [
  {
    icon: <Brain className="text-primary" size={32} />,
    title: "Express Your Feelings",
    description: "Answer a friendly AI-powered questionnaire that helps identify your current emotional state.",
    color: "bg-primary-50"
  },
  {
    icon: <Activity className="text-emotion-confusion" size={32} />,
    title: "Personalized Analysis",
    description: "Our AI identifies your emotional patterns and underlying feelings with care and accuracy.",
    color: "bg-emotion-confusion/10"
  },
  {
    icon: <Heart className="text-emotion-happiness" size={32} />,
    title: "Tailored Activities",
    description: "Receive customized activities designed specifically for your emotional needs and preferences.",
    color: "bg-emotion-happiness/10"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">How Emotions Works</h2>
          <p className="text-gray-600">
            Our app uses gentle AI guidance to help you navigate your emotions and find activities that bring balance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className={`${step.color} p-8 rounded-2xl shadow-soft h-full`}>
                <div className="mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-serif font-medium mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="text-primary" size={24} />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-600 italic">
            "Our approach is designed with mental health best practices in mind, creating a supportive environment for emotional wellness."
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
