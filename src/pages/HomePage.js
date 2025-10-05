import React from "react";
import { Link } from "react-router-dom";
import {
  Archive,
  UserPlus,
  LogIn,
  GraduationCap,
  Users,
  Calendar,
  BookOpen,
  Bell,
  Code,
} from "lucide-react";

// --- Icon Component ---
const InstituteLogo = () => (
  <div className="p-4 bg-teal-600 rounded-full shadow-lg">
    <GraduationCap className="w-10 h-10 text-white" strokeWidth={2.5} />
  </div>
);

// --- Fixed Header Bar ---
const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-10 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50 shadow-xl px-6 py-4">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <GraduationCap className="w-7 h-7 text-teal-400" />
        <span className="text-xl font-bold tracking-wide text-white">
          Faridpur Polytechnic Institute
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-slate-300 hover:text-rose-400 transition duration-200 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-teal-500 cursor-pointer hover:scale-105 transition duration-200 flex items-center justify-center text-sm font-semibold">
          FP
        </div>
      </div>
    </div>
  </header>
);

// --- Developer Info Component with MAX Highlight and Responsive Sizing ---
const DeveloperInfo = () => (
  <div className="flex flex-col items-center text-center lg:text-left lg:items-start mb-12 lg:mb-0 w-full lg:max-w-md relative">
    {/* Responsive and Enhanced Animated Circle Light Effect */}
    <div className="relative w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center mb-6">
      {" "}
      {/* Responsive size */}
      {/* Added box-shadow for a much stronger light effect */}
      <div
        className="absolute inset-0 rounded-full animate-pulse-custom border-2 border-teal-400/60 shadow-[0_0_20px_0] shadow-teal-500/80"
        style={{ animationDelay: "0s" }}
      ></div>
      <div
        className="absolute inset-0 rounded-full animate-pulse-custom border-2 border-teal-400/50 shadow-[0_0_20px_0] shadow-teal-500/80"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute inset-0 rounded-full animate-pulse-custom border-2 border-teal-400/40 shadow-[0_0_20px_0] shadow-teal-500/80"
        style={{ animationDelay: "2s" }}
      ></div>
      <Code
        className="w-16 h-16 sm:w-20 sm:h-20 text-teal-300 drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]"
        strokeWidth={1.5}
      />{" "}
      {/* Responsive Icon */}
    </div>

    {/* Highlighted & Animated Text */}
    <h2
      className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight animate-text-glow 
                 bg-gradient-to-r from-white via-teal-300 to-white
                 bg-clip-text text-transparent bg-200% animate-shine"
    >
      Under Active Development
    </h2>
    <p className="text-slate-400 text-base sm:text-lg max-w-sm">
      {" "}
      {/* Responsive text */}
      This platform is being actively developed and improved. New features and
      optimizations are being added to enhance your experience.
    </p>
  </div>
);

// --- Quick Links Data ---
const quickLinks = [
  {
    name: "Academic Calendar",
    icon: Calendar,
    description: "View semester dates and holidays.",
    color: "text-rose-400",
  },
  {
    name: "Faculty Directory",
    icon: Users,
    description: "Find contact information for all staff.",
    color: "text-sky-400",
  },
  {
    name: "Student Handbook",
    icon: BookOpen,
    description: "Access rules, regulations, and policies.",
    color: "text-amber-400",
  },
  {
    name: "Archive & Forms",
    icon: Archive,
    description: "Download official forms and archived documents.",
    color: "text-indigo-400",
  },
];

// --- Main HomePage Component ---
const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 relative overflow-hidden font-sans">
      <Header />

      {/* Floating Background Effects & ALL ANIMATIONS */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-20px) rotate(15deg); opacity: 0.3; }
          100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
        }
        .floating-shape-1 { animation: float 10s ease-in-out infinite; }
        .floating-shape-2 { animation: float 12s ease-in-out infinite reverse; }

        @keyframes pulse-custom {
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-pulse-custom {
          animation: pulse-custom 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
        }

        /* NEW: Shimmering gradient animation for text */
        @keyframes animate-shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .bg-200\\% { background-size: 200% auto; }
        .animate-shine { animation: animate-shine 4s linear infinite; }

        /* NEW: Pulsing glow animation for text */
        @keyframes text-glow {
          0%, 100% { filter: drop-shadow(0 0 10px theme('colors.teal.500')); }
          50% { filter: drop-shadow(0 0 20px theme('colors.teal.300')); }
        }
        .animate-text-glow { animation: text-glow 3s ease-in-out infinite; }
      `}</style>

      <div
        className="absolute inset-0 opacity-10"
        style={{
          background:
            "radial-gradient(circle at 10% 90%, rgba(45, 212, 191, 0.2) 0%, transparent 40%), radial-gradient(circle at 90% 10%, rgba(203, 213, 225, 0.1) 0%, transparent 40%)",
        }}
      ></div>
      <div className="floating-shape-1 absolute top-1/4 left-1/4 w-32 h-32 bg-teal-500 rounded-full blur-3xl opacity-20"></div>
      <div className="floating-shape-2 absolute bottom-1/4 right-1/4 w-40 h-40 bg-indigo-500 rounded-lg blur-3xl opacity-20"></div>

      {/* Main Content Layout */}
      <main className="z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-around px-4 pt-24">
        {/* Left Side: Developer Info */}
        <DeveloperInfo />

        {/* Right Side: Main Portal Card */}
        <div className="group relative bg-slate-800/80 backdrop-blur-md p-8 sm:p-12 rounded-2xl shadow-2xl max-w-2xl w-full text-center border border-slate-700/50">
          <div className="mb-8 flex justify-center">
            <InstituteLogo />
          </div>

          <h1 className="text-5xl sm:text-6xl font-black mb-3 tracking-tighter text-teal-400">
            FPIMS
          </h1>
          <p className="text-xl sm:text-2xl font-light mb-6 text-slate-300">
            Faridpur Polytechnic Institute Management System
          </p>
          <p className="text-md mb-10 text-slate-400 max-w-sm mx-auto border-t border-b border-slate-700 py-3">
            Your modern, centralized platform for academic records,
            administration, and resource management.
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center mb-8">
            <Link
              to="/login"
              className="w-full sm:w-auto flex items-center justify-center bg-teal-500 hover:bg-teal-600 transition duration-300 ease-in-out text-slate-900 font-extrabold py-3 px-8 rounded-xl shadow-2xl shadow-teal-500/50 uppercase tracking-wider"
            >
              <LogIn className="w-5 h-5 mr-3" />
              Portal Sign In
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto flex items-center justify-center bg-slate-600 hover:bg-slate-700 transition duration-300 ease-in-out text-white font-semibold py-3 px-8 rounded-xl shadow-md uppercase tracking-wider"
            >
              <UserPlus className="w-5 h-5 mr-3" />
              New User Registration
            </Link>
          </div>

          <div className="w-2/3 mx-auto h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-10 mt-12"></div>
          <div className="text-left">
            <h3 className="text-xl font-semibold mb-4 text-slate-300 border-b border-slate-700 pb-2">
              Quick Institute Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickLinks.map((link) => (
                <div
                  key={link.name}
                  className="p-4 bg-slate-700/50 rounded-lg border border-slate-700 hover:border-teal-500 transition duration-300 cursor-pointer flex items-start space-x-4 group"
                >
                  <link.icon
                    className={`w-6 h-6 flex-shrink-0 ${link.color}`}
                  />
                  <div>
                    <p className="font-bold text-slate-200 group-hover:text-teal-400 transition">
                      {link.name}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      {link.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="z-10 mt-12 pb-6 text-sm text-slate-500 flex items-center space-x-2">
        <Archive className="w-4 h-4" />
        <span>
          &copy; {new Date().getFullYear()} Faridpur Polytechnic Institute. All
          Rights Reserved.
        </span>
      </footer>
    </div>
  );
};

export default HomePage;
