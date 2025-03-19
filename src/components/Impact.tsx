
import React, { useEffect, useRef, useState } from 'react';

interface StatProps {
  value: string;
  label: string;
  delay: number;
}

const Stat: React.FC<StatProps> = ({ value, label, delay }) => {
  return (
    <div 
      className="text-center" 
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-4xl md:text-5xl font-bold text-sustain-600 mb-2 animate-fade-up">
        {value}
      </div>
      <div className="text-gray-600 animate-fade-up" style={{ animationDelay: `${delay + 100}ms` }}>
        {label}
      </div>
    </div>
  );
};

const Impact: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      id="impact" 
      className="py-24 relative overflow-hidden"
      ref={sectionRef}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern bg-no-repeat bg-cover opacity-30" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="chip mb-3">Our Collective Impact</div>
          <h2 className="text-gradient mb-4">Making a Difference Together</h2>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg">
            Through our platform, we've achieved measurable results in reducing food waste and helping communities
          </p>
        </div>

        <div className={`glassmorphism max-w-4xl mx-auto rounded-2xl p-10 md:p-16 ${isVisible ? 'animate-scale-up' : 'opacity-0'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <Stat 
              value="50k+"
              label="Meals Delivered"
              delay={200}
            />
            <Stat 
              value="230+"
              label="Active NGOs"
              delay={400}
            />
            <Stat 
              value="520+"
              label="Restaurant Partners"
              delay={600}
            />
            <Stat 
              value="12k+"
              label="Volunteer Hours"
              delay={800}
            />
          </div>
        </div>

        <div className={`mt-16 text-center max-w-2xl mx-auto ${isVisible ? 'animate-fade-up' : 'opacity-0'}`} style={{ animationDelay: '1000ms' }}>
          <h3 className="text-2xl mb-4">Join Our Growing Movement</h3>
          <p className="text-gray-600 mb-8">
            Be part of the solution in reducing food waste while helping those in need. Every contribution counts.
          </p>
          <a href="#register" className="btn-primary">Get Started Today</a>
        </div>
      </div>
    </section>
  );
};

export default Impact;
