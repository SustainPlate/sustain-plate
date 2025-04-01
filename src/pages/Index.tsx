
// This is a snippet to fix the spacing issue only 
// We only need to adjust the spacing between Core Capabilities and Join Our Community
// The full file is not shown as we're only modifying specific CSS classes

// Find the Impact component which has the Join Our Community section
// and update its padding or margin properties

import React from 'react';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import UserTypes from '@/components/UserTypes';
import Impact from '@/components/Impact';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <Hero />
      <Features />
      <UserTypes />
      {/* Adjust the padding here to reduce space */}
      <div className="pt-8"> {/* Reduced from bigger value */}
        <Impact />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
