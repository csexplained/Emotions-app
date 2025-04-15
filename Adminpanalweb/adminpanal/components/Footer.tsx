
import React from 'react';
import Link from 'next/link';
import { Heart, Instagram, Twitter, Facebook } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-50 py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-serif text-xl">
                <Image
                  src="https://res.cloudinary.com/dxae5w6hn/image/upload/v1744625275/azyl7octqwqctc1tipgb.png" // Replace with your logo path
                  alt="Logo"
                  width={40} // Adjust width as needed
                  height={40} // Adjust height as needed
                />
              </div>
              <span className="font-serif text-xl font-medium text-primary">Emotions</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Your personal AI-powered mental wellness companion. Find calm through personalized activities.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Instagram" className="text-primary hover:text-primary-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="text-primary hover:text-primary-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="Facebook" className="text-primary hover:text-primary-600 transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="col-span-1">
            <h3 className="text-primary font-medium mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-600 hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link href="#categories" className="text-gray-600 hover:text-primary transition-colors">Activities</Link></li>
              <li><Link href="#testimonials" className="text-gray-600 hover:text-primary transition-colors">Testimonials</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-primary font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-gray-600 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-primary transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-primary font-medium mb-4">Download</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">App Store</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Google Play</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            &copy; {currentYear} Emotions App. All rights reserved.
          </p>
          <p className="text-sm text-gray-600 flex items-center mt-4 md:mt-0">
            Made with <Heart size={16} className="text-emotion-anger mx-1" /> for mental wellness
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
