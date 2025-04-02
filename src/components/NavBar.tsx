
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import AuthButtons from '@/components/AuthButtons';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/use-mobile';

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMobile();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Map', path: '/donation-map' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header 
      className={cn(
        "fixed w-full top-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <div className="text-green-600 font-bold text-xl">Sustain<span className="text-green-800">Plate</span></div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Button key={link.path} variant="ghost" asChild>
                <Link to={link.path}>{link.name}</Link>
              </Button>
            ))}
            <AuthButtons />
          </nav>
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && isMobile && (
        <nav className="md:hidden py-4 bg-white border-t">
          <div className="container mx-auto px-4 flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Button 
                key={link.path} 
                variant="ghost" 
                className="justify-start" 
                asChild 
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link to={link.path}>{link.name}</Link>
              </Button>
            ))}
            <div className="pt-2">
              <AuthButtons />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default NavBar;
