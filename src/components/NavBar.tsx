
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import AuthButtons from './AuthButtons';

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white/95 backdrop-blur-sm z-10 py-4 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-600">
          Sustain Plate
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-slate-600 hover:text-green-600 transition-colors">
            Home
          </Link>
          <Link to="/#features" className="text-slate-600 hover:text-green-600 transition-colors">
            How It Works
          </Link>
          <Link to="/#user-types" className="text-slate-600 hover:text-green-600 transition-colors">
            Get Started
          </Link>
          <Link to="/#impact" className="text-slate-600 hover:text-green-600 transition-colors">
            Impact
          </Link>
          <AuthButtons />
        </div>
        
        {/* Mobile Nav Trigger */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 mt-8">
                <Link 
                  to="/" 
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-medium hover:text-green-600 transition-colors"
                >
                  Home
                </Link>
                <Link 
                  to="/#features" 
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-medium hover:text-green-600 transition-colors"
                >
                  How It Works
                </Link>
                <Link 
                  to="/#user-types" 
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-medium hover:text-green-600 transition-colors"
                >
                  Get Started
                </Link>
                <Link 
                  to="/#impact" 
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-medium hover:text-green-600 transition-colors"
                >
                  Impact
                </Link>
                <div className="pt-4">
                  <AuthButtons />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
