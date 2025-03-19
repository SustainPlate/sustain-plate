
import React, { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import UserTypes from '@/components/UserTypes';
import Impact from '@/components/Impact';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  useEffect(() => {
    // This could be used for analytics, initialization, etc.
    console.log('Sustain Plate application initialized');
  }, []);

  return (
    <div className="min-h-screen">
      <NavBar />
      <Hero />
      <Features />
      <UserTypes />
      <Impact />
      <Footer />
    </div>
  );
};

export default Index;
