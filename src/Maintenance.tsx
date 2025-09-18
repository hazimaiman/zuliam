import React from "react";
import Lottie from "lottie-react";
import { MdEmail } from "react-icons/md";
import maintenanceAnimation from "../src/assets/Animation - 1748650660383.json";
import ZuliChat from "./components/ZuliChat";

const Maintenance: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <div className="relative min-h-screen bg-white text-[#2f2f2f] font-serif px-4">
      {/* Top-left branding */}
      <div className="absolute top-6 left-6 text-3xl font-semibold italic tracking-wide">
        züliäm<span className="text-4xl align-super">.</span>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <Lottie
          animationData={maintenanceAnimation}
          loop
          className="max-w-xs mx-auto mb-6"
        />
        <h1 className="text-4xl font-bold mb-4">Page Under Maintenance</h1>
        <p className="text-[#444] mb-6">
          Sorry for the inconvenience! <br />
          We're currently doing some updates. Please check back soon.
        </p>

        <div className="flex items-center justify-center text-[#2f2f2f]">
          <MdEmail className="mr-2 text-xl" />
          <a
            href="mailto:ask@byzuliam.com"
            className="underline hover:text-indigo-800"
          >
            ask@byzuliam.com
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-500">
        © {year}, <strong> zuliäm corporäte [EB20250611003833]</strong>-{" "}
        <a
          href="https://www.hzaiman.my"
          className="font-bold text-gray-500 hover:underline transition-all duration-200"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Hazim Aiman
        </a>
      </div>

      {/* Reusable chatbot */}
      <ZuliChat triggerText="Ask Zuli" placement="bottom-right" theme="light" />
    </div>
  );
};

export default Maintenance;

