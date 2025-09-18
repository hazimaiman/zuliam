// src/App.tsx
import React, { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import ComingSoon from "./Comingsoon";
import Maintenance from "./Maintenance";
import VirtualTry from "./pages/VirtualTry";

const WeekendSwitcher: React.FC = () => {
  const [isWeekend, setIsWeekend] = useState(false);

  useEffect(() => {
    const today = new Date().getDay();
    setIsWeekend(today === 0 || today === 6);
  }, []);

  // const ActivePage = isWeekend ? Maintenance : ComingSoon;
  const ActivePage = isWeekend ? ComingSoon : Maintenance;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute right-6 top-6 z-50 font-medium text-xs uppercase tracking-wide text-slate-500">
        <Link
          to="/virtual-try"
          className="pointer-events-auto rounded-full bg-slate-900 px-3 py-1 text-white shadow"
        >
          Virtual fit lab
        </Link>
      </div>
      <ActivePage />
    </div>
  );
};

const NotFound: React.FC = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center text-slate-800">
    <h1 className="text-3xl font-semibold">Page not found</h1>
    <p className="mt-3 text-sm text-slate-500">
      We could not locate that route. Jump back to the landing view or test the
      virtual fitting lab.
    </p>
    <div className="mt-6 flex gap-3">
      <Link
        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        to="/"
      >
        Back to home
      </Link>
      <Link
        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
        to="/virtual-try"
      >
        Virtual fit lab
      </Link>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<WeekendSwitcher />} />
      <Route path="/virtual-try" element={<VirtualTry />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
