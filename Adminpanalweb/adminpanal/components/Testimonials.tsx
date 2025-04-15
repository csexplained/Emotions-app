
import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah J.",
    emotion: "Anxiety",
    quote: "The breathing exercises recommended when I was feeling anxious helped me calm down within minutes. I use the app every day now!",
    rating: 5,
    image: "/placeholder.svg"
  },
  {
    name: "Michael T.",
    emotion: "Frustration",
    quote: "As someone who struggles with anger, the mindfulness activities have given me tools to pause before reacting. It's changed my relationships.",
    rating: 5,
    image: "/placeholder.svg"
  },
  {
    name: "Aisha K.",
    emotion: "Sadness",
    quote: "The journaling prompts helped me work through grief in a way therapy alone couldn't. I'm grateful for this supportive companion.",
    rating: 5,
    image: "/placeholder.svg"
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="section-spacing bg-primary-50">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">Stories of Emotional Balance</h2>
          <p className="text-gray-600">
            Real experiences from people who found relief and support using Emotions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 flex justify-center items-center rounded-full text-center overflow-hidden">
                    <p>{testimonial.name.slice(0,2)}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">Struggled with: {testimonial.emotion}</p>
                  </div>
                </div>
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
              
              <blockquote className="text-gray-600 italic">
                "{testimonial.quote}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
