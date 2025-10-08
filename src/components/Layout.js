import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationPoller from "./NotificationPoller";
import DeveloperInfo from "./DeveloperInfo";
import { GraduationCap, Bell } from "lucide-react";
import FutureDevelopmentModal from "./FutureDevelopmentModel";

// Header Component
const Header = ({ user, logout, renderDashboardLink, onFutureClick }) => (
  <header className="fixed top-0 left-0 right-0 z-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50 shadow-xl px-6 py-4">
    <div className="container mx-auto flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <GraduationCap className="w-7 h-7 text-teal-400" />
        <Link
          to="/"
          className="text-sm sm:text-xl font-bold tracking-wide text-white"
        >
          <span className="flex sm:hidden">FPIMS</span>
          <span className="hidden sm:flex">Faridpur Polytechnic Institute</span>
        </Link>
      </div>
      <div className="flex items-center space-x-6">
        {user ? (
          <>
            {renderDashboardLink()}
            <button
              onClick={onFutureClick}
              className="text-slate-300 hover:text-rose-400 transition duration-200 relative"
            >
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
  const [isFutureOpen, setIsFutureOpen] = useState(false);

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
      <Header
        user={user}
        logout={handleLogout}
        renderDashboardLink={renderDashboardLink}
        onFutureClick={() => setIsFutureOpen(true)}
      />

      <div className="container mx-auto flex flex-col lg:flex-row flex-grow p-4 lg:p-2 pt-24 gap-8">
        <aside className="flex-shrink-0">
          <DeveloperInfo developerName="Your Name" />
        </aside>

        <main className="w-full flex-grow">
          {user && <NotificationPoller />}
          {children}
        </main>
      </div>

      {/* Reusable modal */}
      <FutureDevelopmentModal open={isFutureOpen} setOpen={setIsFutureOpen} />
    </div>
  );
}

export default Layout;