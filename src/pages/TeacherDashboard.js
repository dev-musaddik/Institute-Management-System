import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import TeacherCourseList from "../components/TeacherCourseList";
import TeacherAttendanceList from "../components/TeacherAttendanceList";
import TeacherResultList from "../components/TeacherResultList";
import PendingRegistrationsList from "../components/PendingRegistrationsList"; // New import

function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("my-courses"); // 'my-courses', 'attendance', 'results', 'pending-registrations'

  const renderContent = () => {
    if (!user)
      return <div className="text-center text-lg text-white">Loading teacher data...</div>; // Fallback in case user is null

    switch (activeTab) {
      case "my-courses":
        return <TeacherCourseList teacherId={user.Teacher?.id} />;
      case "attendance":
        return <TeacherAttendanceList teacherId={user.Teacher?.id} />;
      case "results":
        return <TeacherResultList teacherId={user.Teacher?.id} />;
      case "pending-registrations":
        return <PendingRegistrationsList teacherId={user.Teacher?.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      {/* Header Card */}
      <div className="backdrop-blur-md bg-white/10 p-6 rounded-2xl shadow-lg border border-gray-700 mb-6">
        <h2 className="text-3xl font-bold mb-2">Teacher Dashboard</h2>
        {user && (
          <p className="text-lg mb-2">
            Welcome, {user.email}{" "}
            <span className="text-sm text-gray-300">({user.role})</span>
          </p>
        )}
        <p className="text-gray-300">
          Here you can manage your courses, attendance, and student results.
        </p>
        <button
          onClick={logout}
          className="mt-6 bg-red-600 hover:bg-red-700 transition-all duration-300 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-red-500/30"
        >
          Logout
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("my-courses")}
          className={`py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
            activeTab === "my-courses"
              ? "bg-blue-600 shadow-md shadow-blue-500/30"
              : "bg-gray-700 hover:bg-blue-700"
          }`}
        >
          My Courses
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
            activeTab === "attendance"
              ? "bg-blue-600 shadow-md shadow-blue-500/30"
              : "bg-gray-700 hover:bg-blue-700"
          }`}
        >
          Manage Attendance
        </button>
        <button
          onClick={() => setActiveTab("results")}
          className={`py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
            activeTab === "results"
              ? "bg-blue-600 shadow-md shadow-blue-500/30"
              : "bg-gray-700 hover:bg-blue-700"
          }`}
        >
          Manage Results
        </button>
        <button
          onClick={() => setActiveTab("pending-registrations")}
          className={`py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
            activeTab === "pending-registrations"
              ? "bg-blue-600 shadow-md shadow-blue-500/30"
              : "bg-gray-700 hover:bg-blue-700"
          }`}
        >
          Pending Registrations
        </button>
      </div>

      {/* Content Section */}
      <div className="backdrop-blur-md bg-white/10 p-6 rounded-2xl shadow-lg border border-gray-700 animate-fadeIn">
        {renderContent()}
      </div>
    </div>
  );
}

export default TeacherDashboard;