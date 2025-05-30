// src/pages/Maintenance.tsx
import React from 'react';

const Maintenance: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white text-center px-4">
      <div>
        <img
          src="/maintenance.png"
          alt="Maintenance"
          className="mx-auto max-w-xs animate-bounce"
        />
        <h1 className="text-4xl font-bold mt-6 text-blue-700">Page Under Maintenance</h1>
        <p className="mt-4 text-gray-600">
          We’re currently doing some updates. Please check back soon.
        </p>
      </div>
    </div>
  );
};

export default Maintenance;
