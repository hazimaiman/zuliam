import React, { useEffect, useState } from "react";
import background from "../src/assets/Kuala_Lumpur.jpg";
import ZuliChat from "./components/ZuliChat";

const Hero: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [dots, setDots] = useState("");
  const [targetDate, setTargetDate] = useState<Date | null>(null);

  // Load or create target date
  useEffect(() => {
    const stored = localStorage.getItem("launchDate");
    if (stored) {
      setTargetDate(new Date(stored));
    } else {
      const newDate = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);
      localStorage.setItem("launchDate", newDate.toISOString());
      setTargetDate(newDate);
    }
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (!targetDate) return;
    const updateCountdown = () => {
      const now = Date.now();
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

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // Dot animation logic
  useEffect(() => {
    let delay = false;
    const interval = setInterval(() => {
      if (dots === "..." && !delay) {
        delay = true;
        setTimeout(() => {
          setDots("");
          delay = false;
        }, 1000);
      } else if (!delay && dots.length < 3) {
        setDots((prev) => prev + ".");
      }
    }, 500);
    return () => clearInterval(interval);
  }, [dots]);

  return (
    <section className="relative h-screen flex flex-col justify-center items-center text-white text-center overflow-hidden px-4">
      {/* Background image and overlays (pointer-events disabled so chat is clickable) */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm pointer-events-none"
        style={{ backgroundImage: `url(${background})` }}
      ></div>
      <div className="absolute inset-0 bg-black bg-opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-20 space-y-6">
        <h1 className="text-lg tracking-widest relative inline-block after:content-[''] after:block after:h-[2px] after:bg-white/30 after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-500 animate-pulse">
          züliäm
        </h1>
        <h2 className="text-6xl md:text-7xl font-bold">Coming Soon{dots}</h2>

        <p className="text-gray-300 text-sm">
          Create something extraordinary — we're getting ready.
        </p>

        {/* Countdown Timer */}
        <div className="flex gap-4 justify-center mt-6 text-xl md:text-2xl font-semibold">
          <div className="text-center">
            <div>{timeLeft.days}</div>
            <div className="text-sm font-normal">Days</div>
          </div>
          <div>/</div>
          <div className="text-center">
            <div>{timeLeft.hours.toString().padStart(2, "0")}</div>
            <div className="text-sm font-normal">Hours</div>
          </div>
          <div>/</div>
          <div className="text-center">
            <div>{timeLeft.minutes.toString().padStart(2, "0")}</div>
            <div className="text-sm font-normal">Minutes</div>
          </div>
          <div>/</div>
          <div className="text-center">
            <div>{timeLeft.seconds.toString().padStart(2, "0")}</div>
            <div className="text-sm font-normal">Seconds</div>
          </div>
        </div>
      </div>

      {/* Reusable chatbot */}
      <ZuliChat triggerText="Ask Zuli" placement="bottom-left" theme="dark" />

      {/* Dev-only reset */}
      {import.meta.env.MODE === "development" && (
        <button
          onClick={() => {
            localStorage.removeItem("launchDate");
            window.location.reload();
          }}
          className="text-xs text-red-400 underline absolute top-4 right-4"
        >
          Reset Countdown (Dev Only)
        </button>
      )}
    </section>
  );
};

export default Hero;

