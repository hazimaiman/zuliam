import React from 'react';

const Bottom: React.FC = () => {
  return (
    <section className="bg-gradient-to-t from-black via-[#0a0a0a] to-black text-white pt-0 pb-12 px-6 text-center">
      {/* Zuliam with fade-in + shine */}
      <h2 className="text-2xl md:text-3xl font-normal font-serif mb-6 text-[#f5f5f5] tracking-wide relative inline-block overflow-hidden animate-fade-in-scale shine">
        züliäm
      </h2>

      <p className="text-gray-300 text-sm">
        Contact us at <a href="mailto:ask@zuliam.com" className="underline">ask@byzuliam.com</a>
      </p>
    </section>
  );
};

export default Bottom;
