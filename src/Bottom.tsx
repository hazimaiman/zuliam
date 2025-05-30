// src/components/ComingSoon/Bottom.tsx
import React from 'react';

const Bottom: React.FC = () => {
  return (
    <section className="bg-black text-white py-12 px-6 text-center">
      <h3 className="text-2xl font-semibold mb-6">Stay In The Loop</h3>

      <form className="max-w-md mx-auto flex flex-col sm:flex-row items-center gap-4">
        <input
          type="email"
          placeholder="Your email"
          className="w-full px-4 py-2 text-black rounded-md focus:outline-none"
        />
        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700 px-6 py-2 rounded-md font-semibold"
        >
          Notify Me
        </button>
      </form>

      <p className="mt-6 text-sm">
        Contact us at <a href="mailto:ask@zuliam.com" className="underline">ask@zuliam.com</a>
      </p>
    </section>
  );
};

export default Bottom;
