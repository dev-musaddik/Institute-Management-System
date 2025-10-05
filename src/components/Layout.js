import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationPoller from './NotificationPoller'; // New import

function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderDashboardLink = () => {
    if (!user) return null; // Ensure user is not null before accessing role
    switch (user.role) {
      case "Admin":
        return (
          <Link to="/admin-dashboard" className="hover:text-blue-400">
            Admin Dashboard
          </Link>
        );
      case "Teacher":
        return (
          <Link to="/teacher-dashboard" className="hover:text-blue-400">
            Teacher Dashboard
          </Link>
        );
      case "Student":
        return (
          <Link to="/student-dashboard" className="hover:text-blue-400">
            Student Dashboard
          </Link>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            FPIMS
          </Link>
          <div className="space-x-4 flex items-center">
            {user ? (
              <>
                {renderDashboardLink()}
                <span className="text-gray-300">
                  Welcome, {user.email} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <> 
                <Link to="/login" className="hover:text-blue-400">
                  Login
                </Link>
                <Link to="/register" className="hover:text-blue-400">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        {user && <NotificationPoller />} {/* Integrate poller here */}
        {children}
      </main>
    </div>
  );
}

export default Layout;