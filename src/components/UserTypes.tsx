
import React, { useEffect, useRef, useState } from 'react';
import { Store, Building2, HeartHandshake, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserTypeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  ctaText: string;
  primary?: boolean;
  animationDelay: number;
}

const UserTypeCard: React.FC<UserTypeCardProps> = ({ 
  title, 
  description, 
  icon, 
  features, 
  ctaText, 
  primary = false,
  animationDelay
}) => {
  return (
    <div 
      className={cn(
        'rounded-xl p-8 transition-all duration-500 translate-y-0 hover:-translate-y-2',
        primary 
          ? 'bg-gradient-to-br from-sustain-600 to-sustain-700 text-white shadow-elevated' 
          : 'bg-white border border-gray-100 shadow-subtle',
        `animate-fade-up`
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div 
        className={cn(
          'rounded-full w-14 h-14 flex items-center justify-center mb-5',
          primary ? 'bg-white/20' : 'bg-sustain-100'
        )}
      >
        <div className={primary ? 'text-white' : 'text-sustain-600'}>{icon}</div>
      </div>
      
      <h3 className="text-2xl font-medium mb-3">{title}</h3>
      <p className={cn("mb-6", primary ? 'text-white/90' : 'text-gray-600')}>
        {description}
      </p>
      
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <div className={cn("mr-3 mt-1", primary ? 'text-warmth-300' : 'text-sustain-500')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span className={primary ? 'text-white/90' : 'text-gray-600'}>{feature}</span>
          </li>
        ))}
      </ul>
      
      <button 
        className={cn(
          'w-full py-3 rounded-md transition-all duration-300',
          primary 
            ? 'bg-white text-sustain-700 hover:bg-gray-100' 
            : 'bg-sustain-500 text-white hover:bg-sustain-600'
        )}
      >
        {ctaText}
      </button>
    </div>
  );
};

const UserTypes: React.FC = () => {
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
      id="register" 
      className="py-20 bg-gray-50" 
      ref={sectionRef}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="chip mb-3">Join Our Community</div>
          <h2 className="text-gradient mb-4">Choose Your Role</h2>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg">
            Select the role that best fits your organization and start making a difference today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <UserTypeCard
            title="Restaurant"
            description="Donate surplus food from your restaurant and reduce waste while helping communities."
            icon={<Store size={28} />}
            features={[
              "Easy listing of surplus food",
              "Flexible pickup scheduling",
              "Tax deduction tracking",
              "Impact reporting"
            ]}
            ctaText="Register as Donor"
            animationDelay={100}
          />

          <UserTypeCard
            title="NGO"
            description="Request and receive food donations based on your organization's specific needs."
            icon={<Building2 size={28} />}
            features={[
              "Specific food requests",
              "Donation notifications",
              "Distribution planning",
              "Beneficiary tracking"
            ]}
            ctaText="Register as NGO"
            primary
            animationDelay={300}
          />

          <UserTypeCard
            title="Volunteer"
            description="Help with food collection and delivery, becoming the vital link in our chain."
            icon={<HeartHandshake size={28} />}
            features={[
              "Flexible scheduling",
              "Route optimization",
              "Contactless handovers",
              "Community recognition"
            ]}
            ctaText="Join as Volunteer"
            animationDelay={500}
          />

          <UserTypeCard
            title="Corporate"
            description="Partner with us to donate surplus food from events, cafeterias, and more."
            icon={<ShieldCheck size={28} />}
            features={[
              "Bulk donation management",
              "CSR reporting metrics",
              "Employee engagement",
              "Brand recognition"
            ]}
            ctaText="Join as Corporate"
            animationDelay={700}
          />
        </div>
      </div>
    </section>
  );
};

export default UserTypes;
