"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Download } from 'lucide-react';
import Image from 'next/image';
import mockup from "../public/28203670.jpg"; // Replace with your app mockup image path

const Hero = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary-100 opacity-50 blur-3xl"></div>
      <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-emotion-happiness opacity-20 blur-3xl"></div>
      
      <div className="container-custom relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold leading-tight">
              Find Your <span className="text-primary">Emotional Balance</span> with AI Guidance
            </h1>
            <p className="text-lg md:text-xl text-gray-700">
              Emotions is your personal AI wellness companion that understands how you feel and suggests personalized activities to restore balance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="btn-primary gap-2">
                <Download size={20} />
                Download App
              </Button>
              <Button className="btn-secondary gap-2">
                Learn More
                <ChevronRight size={20} />
              </Button>
            </div>
            
            <div className="pt-4">
              <p className="text-gray-500 text-sm flex items-center gap-2">
                <span className="flex gap-1">
                  <span className="block w-2 h-2 rounded-full bg-emotion-happiness"></span>
                  <span className="block w-2 h-2 rounded-full bg-emotion-sorrow"></span>
                  <span className="block w-2 h-2 rounded-full bg-emotion-anger"></span>
                  <span className="block w-2 h-2 rounded-full bg-emotion-fear"></span>
                </span>
                Available for iOS and Android
              </p>
            </div>
          </div>
          
          {/* App Mockup */}
          <div className="relative">
            <div className="relative z-10 mx-auto max-w-xs lg:max-w-sm animate-float">
              <Image 
                src={mockup} 
                width={300}
                height={100} 
                alt="Emotions App Interface" 
                className="rounded-3xl shadow-medium"
              />
            </div>
            <div className="absolute top-1/4 -right-4 w-24 h-24 rounded-full bg-emotion-happiness opacity-20 animate-pulse-gentle"></div>
            <div className="absolute bottom-1/4 -left-4 w-24 h-24 rounded-full bg-emotion-sorrow opacity-20 animate-pulse-gentle"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
