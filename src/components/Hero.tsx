
import React, { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern bg-no-repeat bg-cover opacity-30" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
          <div className="chip mb-4 animate-fade-in">Connecting Surplus to Purpose</div>
          
          <h1 className="font-medium mb-6 text-gradient">
            Redistributing Surplus Food
            <span className="block mt-2">To Those Who Need It Most</span>
          </h1>
          
          <p className="text-gray-600 text-xl mb-10 max-w-2xl mx-auto">
            Sustain Plate connects food donors with NGOs to reduce waste and feed communities in need through an intelligent matching system.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#register" className="btn-primary animate-fade-up">Join as Donor or NGO</a>
            <a href="#howitworks" className="btn-secondary animate-fade-up" style={{ animationDelay: '200ms' }}>Learn How It Works</a>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-float">
          <a 
            href="#features" 
            aria-label="Scroll to features"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 shadow-md hover:shadow-lg transition-all"
          >
            <ArrowDown size={20} className="text-sustain-600" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
