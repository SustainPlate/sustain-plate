
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-12',
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-subtle py-3' 
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center space-x-2">
          <span className="text-sustain-600 font-bold text-2xl">Sustain Plate</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-700 hover:text-sustain-600 transition-colors">Features</a>
          <a href="#howitworks" className="text-gray-700 hover:text-sustain-600 transition-colors">How It Works</a>
          <a href="#impact" className="text-gray-700 hover:text-sustain-600 transition-colors">Impact</a>
          <a href="#register" className="btn-primary">Get Started</a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md py-4 px-6 flex flex-col space-y-4 animate-fade-in">
          <a 
            href="#features" 
            className="text-gray-700 hover:text-sustain-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Features
          </a>
          <a 
            href="#howitworks" 
            className="text-gray-700 hover:text-sustain-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            How It Works
          </a>
          <a 
            href="#impact" 
            className="text-gray-700 hover:text-sustain-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Impact
          </a>
          <a 
            href="#register" 
            className="btn-primary inline-block text-center"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get Started
          </a>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
