
import React from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="py-6 bg-minty/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container-custom flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-serif text-xl">
            <Image
              src="https://res.cloudinary.com/dxae5w6hn/image/upload/v1744625275/azyl7octqwqctc1tipgb.png" // Replace with your logo path
              alt="Logo"
              width={40} // Adjust width as needed
              height={40} // Adjust height as needed
            />
          </div>
          <span className="font-serif text-xl font-medium text-primary">Emotions</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-foreground hover:text-primary transition-colors duration-300">Home</Link>
          <Link href="#how-it-works" className="text-foreground hover:text-primary transition-colors duration-300">How It Works</Link>
          <Link href="#categories" className="text-foreground hover:text-primary transition-colors duration-300">Activities</Link>
          <Link href="#testimonials" className="text-foreground hover:text-primary transition-colors duration-300">Testimonials</Link>
          <a href='https://drive.google.com/file/d/1VMobZfLNIZAF6AhM1pFQ46zDIURvdX01/view?usp=sharing' target="_blank" className="btn-primary">Download</a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-primary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-minty shadow-md py-4 px-6">
          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="#how-it-works"
              className="text-foreground hover:text-primary transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/categories"
              className="text-foreground hover:text-primary transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Activities
            </Link>
            <Link
              href="/testimonials"
              className="text-foreground hover:text-primary transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </Link>
            <Button
              className="btn-primary w-full"
              onClick={() => setIsMenuOpen(false)}
            >
              Download
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
