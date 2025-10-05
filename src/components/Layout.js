import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationPoller from "./NotificationPoller";
import DeveloperInfo from "./DeveloperInfo";
// 1. Import new icons used by the Header
import { GraduationCap, Bell } from "lucide-react";

// --- 2. Advanced Header Component with Integrated Auth Logic ---
// We pass user, logout, and renderDashboardLink as props to keep it functional
const Header = ({ user, logout, renderDashboardLink }) => (
  <header className="fixed top-0 left-0 right-0 z-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50 shadow-xl px-6 py-4">
    <div className="container mx-auto flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <GraduationCap className="w-7 h-7 text-teal-400" />
        <Link to="/" className="text-sm sm:text-xl  font-bold tracking-wide text-white">
          <span className="flex sm:hidden">FPIMS</span>
          <span className="hidden sm:flex">Faridpur Polytechnic Institute</span>
        </Link>
      </div>
      <div className="flex items-center space-x-6">
        {user ? (
          <>
            {renderDashboardLink()}
            <button className="text-slate-300 hover:text-rose-400 transition duration-200 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
            </button>
            <span className="text-slate-300 hidden sm:block">{user.email}</span>
            <button
              onClick={logout}
              className="bg-rose-600 hover:bg-rose-700 text-white py-1 px-3 rounded-md text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="space-x-4">
            <Link to="/login" className="hover:text-teal-300">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-teal-500 hover:bg-teal-600 text-white py-1 px-3 rounded-md text-sm"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  </header>
);

function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderDashboardLink = () => {
    if (!user) return null;
    let path = "/";
    let text = "Dashboard";
    switch (user.role) {
      case "Admin":
        path = "/admin-dashboard";
        text = "Admin Dashboard";
        break;
      case "Teacher":
        path = "/teacher-dashboard";
        text = "Teacher Dashboard";
        break;
      case "Student":
        path = "/student-dashboard";
        text = "Student Dashboard";
        break;
      default:
        return null;
    }
    // Added styling to make it look good in the new header
    return (
      <Link
        to={path}
        className="text-slate-300 hover:text-teal-300 transition duration-200 hidden lg:block"
      >
        {text}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <style>{`
        /* ... (all your animation CSS remains here) ... */
        @keyframes float { 0% { transform: translateY(0px) rotate(0deg); opacity: 0.2; } 50% { transform: translateY(-20px) rotate(15deg); opacity: 0.3; } 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; } } .floating-shape-1 { animation: float 10s ease-in-out infinite; } .floating-shape-2 { animation: float 12s ease-in-out infinite reverse; } @keyframes pulse-custom { 0% { transform: scale(0.6); opacity: 0.8; } 100% { transform: scale(1.5); opacity: 0; } } .animate-pulse-custom { animation: pulse-custom 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite; } @keyframes animate-shine { 0% { background-position: -200% center; } 100% { background-position: 200% center; } } .bg-200\\% { background-size: 200% auto; } .animate-shine { animation: animate-shine 4s linear infinite; } @keyframes text-glow { 0%, 100% { filter: drop-shadow(0 0 10px theme('colors.teal.500')); } 50% { filter: drop-shadow(0 0 20px theme('colors.teal.300')); } } .animate-text-glow { animation: text-glow 3s ease-in-out infinite; }
      `}</style>

      {/* 3. Use the new Header component, passing the necessary props */}
      <Header
        user={user}
        logout={handleLogout}
        renderDashboardLink={renderDashboardLink}
      />

      {/* 4. Main container now has top-padding (pt-24) to offset the fixed header's height */}
      <div className="container mx-auto flex flex-col lg:flex-row flex-grow p-4 lg:p-2 pt-24 gap-8">
        <aside className="flex-shrink-0">
          <DeveloperInfo developerName="Your Name" />
        </aside>

        <main className="w-full flex-grow">
          {user && <NotificationPoller />}
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
