import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import NotFoundPage from './pages/NotFoundPage';
import DeveloperInfo from './components/DeveloperInfo';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Specific check for student status
  if (user.role === 'Student') {
    if (user.status === 'pending') {
      return <Navigate to="/pending-approval" replace />;
    }
    if (user.status === 'rejected') {
      return <Navigate to="/registration-rejected" replace />;
    }
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/pending-approval" element={<div>Your registration is pending approval. Please wait.</div>} />
            <Route path="/registration-rejected" element={<div>Your registration has been rejected. Please contact administration.</div>} />

            <Route
              path="/admin-dashboard"
              element={
                <PrivateRoute roles={['Admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/teacher-dashboard"
              element={
                <PrivateRoute roles={['Admin', 'Teacher']}>
                  <TeacherDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/student-dashboard"
              element={
                <PrivateRoute roles={['Admin', 'Student']}>
                  <StudentDashboard />
                </PrivateRoute>
              }
            />
            <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
