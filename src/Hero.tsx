import React, { useEffect, useState } from 'react';
import background from '../src/assets/Kuala_Lumpur.jpg'; // ✅ ensure this file exists

const Hero: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // ✅ Fixed target date — calculated ONCE outside useEffect
  const targetDate = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000); // 100 days from now

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / 1000 / 60) % 60);
      const seconds = Math.floor((distance / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown(); // initial call
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []); // ✅ empty deps

  return (
    <section className="relative h-screen flex flex-col justify-center items-center text-white text-center overflow-hidden px-4">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm"
        style={{ backgroundImage: `url(${background})` }}
      ></div>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10"></div>

      {/* Content */}
      <div className="relative z-20 space-y-6">
        <h1 className="text-lg uppercase tracking-widest">züliäm</h1>
        <h2 className="text-6xl md:text-7xl font-bold">Coming Soon</h2>
        <p className="text-gray-300 text-sm">Create something extraordinary — we're getting ready.</p>

        {/* Countdown */}
        <div className="flex gap-4 justify-center mt-6 text-xl md:text-2xl font-semibold">
          <div className="text-center">
            <div>{timeLeft.days}</div>
            <div className="text-sm font-normal">Days</div>
          </div>
          <div>/</div>
          <div className="text-center">
            <div>{timeLeft.hours.toString().padStart(2, '0')}</div>
            <div className="text-sm font-normal">Hours</div>
          </div>
          <div>/</div>
          <div className="text-center">
            <div>{timeLeft.minutes.toString().padStart(2, '0')}</div>
            <div className="text-sm font-normal">Minutes</div>
          </div>
          <div>/</div>
          <div className="text-center">
            <div>{timeLeft.seconds.toString().padStart(2, '0')}</div>
            <div className="text-sm font-normal">Seconds</div>
          </div>
        </div>

        {/* <p className="text-xs text-gray-400 mt-4">
          Contact us at <a className="underline" href="mailto:ask@zuliam.com">ask@zuliam.com</a>
        </p> */}
      </div>
    </section>
  );
};

export default Hero;
