import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import StudentMyCourses from '../components/StudentMyCourses';
import StudentMyAttendance from '../components/StudentMyAttendance';
import StudentMyResults from '../components/StudentMyResults';

function StudentDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('my-courses');

  const renderContent = () => {
    if (!user || !user.Student) return <div className="text-center text-lg text-gray-400">Loading student data...</div>;

    switch (activeTab) {
      case 'my-courses':
        return <StudentMyCourses studentId={user.Student.id} />;
      case 'my-attendance':
        return <StudentMyAttendance studentId={user.Student.id} />;
      case 'my-results':
        return <StudentMyResults studentId={user.Student.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-gray-700 mb-8">
        <h2 className="text-3xl font-extrabold mb-4 text-white">Student Dashboard</h2>
        {user && (
          <p className="text-lg text-gray-300">Welcome, <span className="font-semibold text-green-400">{user.email}</span> ({user.role})!</p>
        )}
        <p className="mt-4 text-gray-400">View your courses, attendance records, and academic results here.</p>
        <button
          onClick={logout}
          className="mt-6 bg-red-600 hover:bg-red-700 transition-colors text-white font-bold py-2 px-6 rounded-lg shadow-md"
        >
          Logout
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('my-courses')}
          className={`px-5 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'my-courses' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white'}`}
        >
          My Courses
        </button>
        <button
          onClick={() => setActiveTab('my-attendance')}
          className={`px-5 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'my-attendance' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white'}`}
        >
          My Attendance
        </button>
        <button
          onClick={() => setActiveTab('my-results')}
          className={`px-5 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'my-results' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white'}`}
        >
          My Results
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-gray-700 shadow-lg">
        {renderContent()}
      </div>
    </div>
  );
}

export default StudentDashboard;
