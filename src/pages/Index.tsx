
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
      <div className="pt-0"> {/* Completely removed padding */}
        <Impact />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
