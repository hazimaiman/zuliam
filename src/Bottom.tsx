import React from "react";

const Bottom: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <section className="bg-gradient-to-t from-black via-[#0a0a0a] to-black text-white pt-0 pb-12 px-6 text-center">
      <h2 className="text-2xl md:text-3xl font-medium font-serif mb-6 tracking-widest bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 text-transparent bg-clip-text relative inline-block after:content-[''] after:block after:h-[2px] after:bg-fuchsia-500 after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-500 animate-pulse">
        züliäm
      </h2>

      <p className="text-gray-300 text-sm">
        Contact us at{" "}
        <a href="mailto:ask@zuliam.com" className="underline">
          ask@byzuliam.com
        </a>
      </p>

      <p className="text-gray-500 text-xs mt-6">
        © {year}, <strong>zuliäm corporäte</strong> [EB20250611003833]—{" "}
        <a
          href="https://www.hzaiman.my"
          className="font-bold text-gray-500 hover:underline transition-all duration-200"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Hazim Aiman
        </a>
      </p>
    </section>
  );
};

export default Bottom;
