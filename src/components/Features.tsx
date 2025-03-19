
import React, { useEffect, useRef, useState } from 'react';
import { UtensilsCrossed, Users, Clock, BarChart3 } from 'lucide-react';

interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

const Feature: React.FC<FeatureProps> = ({ title, description, icon, delay }) => {
  return (
    <div 
      className="glass-card p-8 transition-all duration-500 hover:shadow-elevated"
      style={{ 
        transitionDelay: `${delay}ms`,
        animationDelay: `${delay}ms`
      }}
    >
      <div className="rounded-full bg-sustain-100 w-12 h-12 flex items-center justify-center mb-4">
        <div className="text-sustain-600">{icon}</div>
      </div>
      <h3 className="text-xl font-medium mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);

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

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
    };
  }, []);

  return (
    <section 
      id="features" 
      className="py-20 relative overflow-hidden"
      ref={featuresRef}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="chip mb-3">Core Capabilities</div>
          <h2 className="text-gradient mb-4">Intelligent Food Redistribution</h2>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg">
            Our platform is designed to simplify the process of connecting surplus food with those in need through these key features
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-animate ${isVisible ? 'appear' : ''}`}>
          <Feature 
            title="Smart Matching"
            description="Our algorithm intelligently matches food donations with NGO requests based on needs, location, and timing."
            icon={<UtensilsCrossed size={24} />}
            delay={100}
          />
          <Feature 
            title="Volunteer Network"
            description="Coordinate volunteers for food pickup and delivery to ensure smooth logistics and coverage."
            icon={<Users size={24} />}
            delay={200}
          />
          <Feature 
            title="Real-time Tracking"
            description="Follow donations from source to destination with timestamps and status updates."
            icon={<Clock size={24} />}
            delay={300}
          />
          <Feature 
            title="Impact Metrics"
            description="Visualize your contribution with detailed statistics on meals served and food waste reduced."
            icon={<BarChart3 size={24} />}
            delay={400}
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
