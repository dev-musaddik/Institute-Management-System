import React from "react";
import { Code } from "lucide-react";

const DeveloperInfo = () => (
  <div className="flex flex-col items-center text-center lg:text-left lg:items-start mb-12 lg:mb-0 w-full lg:max-w-md relative">
    <div className="relative w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center mb-6">
      <div className="absolute inset-0 rounded-full animate-pulse-custom border-2 border-teal-400/60 shadow-[0_0_20px_0] shadow-teal-500/80" style={{ animationDelay: '0s' }}></div>
      <div className="absolute inset-0 rounded-full animate-pulse-custom border-2 border-teal-400/50 shadow-[0_0_20px_0] shadow-teal-500/80" style={{ animationDelay: '1s' }}></div>
      <div className="absolute inset-0 rounded-full animate-pulse-custom border-2 border-teal-400/40 shadow-[0_0_20px_0] shadow-teal-500/80" style={{ animationDelay: '2s' }}></div>
      <Code className="w-16 h-16 sm:w-20 sm:h-20 text-teal-300 drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]" strokeWidth={1.5} />
    </div>
    <h2
      className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight animate-text-glow 
                 bg-gradient-to-r from-white via-teal-300 to-white
                 bg-clip-text text-transparent bg-200% animate-shine"
    >
      Under Active Development
    </h2>
    <p className="text-slate-400 text-base sm:text-lg max-w-sm">
      This platform is being actively developed and improved by{" "}
      <span className="font-semibold text-teal-400/80">musaddik</span>. New features
      and optimizations are being added to enhance your experience.
    </p>
  </div>
);

export default DeveloperInfo;