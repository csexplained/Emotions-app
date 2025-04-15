
import React from 'react';
import { Button } from '@/components/ui/button';
import { AppleIcon, Play, PlaySquareIcon } from 'lucide-react';

const DownloadCTA = () => {
  return (
    <section className="section-spacing bg-primary text-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-white mb-6">
            Begin Your Emotional Wellness Journey Today
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Download Emotions now and discover personalized activities that help you navigate life's emotional landscape with confidence and clarity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-primary hover:bg-primary-50 gap-2 py-6 px-8">
            <AppleIcon />
              App Store
            </Button>
            <Button className="bg-white text-primary hover:bg-primary-50 gap-2 py-6 px-8">
              <Play/>
              Google Play
            </Button>
          </div>
          
          <p className="text-white/70 text-sm mt-6">
            Available for iOS and Android devices. Free to download with optional in-app subscriptions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DownloadCTA;
