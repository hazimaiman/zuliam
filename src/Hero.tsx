// src/components/ComingSoon/Hero.tsx
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center text-white">
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm"
        style={{ backgroundImage: "url('/your-kl-background.jpg')" }}
      ></div>

      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 text-center">
        <h1 className="text-lg uppercase tracking-widest">Zuliam</h1>
        <h2 className="text-5xl font-bold mt-4">Coming Soon</h2>
      </div>
    </section>
  );
};

export default Hero;
