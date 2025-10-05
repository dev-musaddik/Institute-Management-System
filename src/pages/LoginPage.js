import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, GraduationCap } from "lucide-react";
import useApi from '../hooks/useApi';
import moment from 'moment';

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { get: getEscalationHistory, post: submitAbsenceReason } = useApi('/api/daily-attendance');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      // After successful login, check for student-specific notifications
      if (user && user.role === "Student" && user.id) {
        await handleStudentNotifications(user.id);
      }

      // Navigate based on role
      if (user.role === "Admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "Teacher") {
        navigate("/teacher-dashboard");
      } else if (user.role === "Student") {
        navigate("/student-dashboard");
      } else {
        navigate("/");
      }
    } else {
      alert("Login failed! Please check your credentials.");
    }
  };

  const handleStudentNotifications = async (studentId) => {
    try {
      const { events, reports } = await getEscalationHistory(`/escalation/${studentId}`);

      // Check for 7-day suspension
      const suspendedEvent = events.find(event => event.event_type === '7_day_suspension');
      if (suspendedEvent) {
        alert("You have been suspended due to prolonged absence. Please contact the administration.");
        // Optionally, prevent further navigation or redirect to a specific suspension page
        return;
      }

      // Check for 3-day escalation requiring a report
      const pending3DayReport = reports.find(report => report.escalation_level === '3_day_consecutive' && report.status === 'pending');
      if (pending3DayReport) {
        const reason = prompt("You have 3 consecutive days of absence. Please submit a reason:");
        if (reason) {
          await submitAbsenceReason('/reason', { studentId, date: moment(pending3DayReport.report_date).format('YYYY-MM-DD'), reason });
          alert("Reason submitted successfully. It will be reviewed by Admin and your assigned Teacher.");
        } else {
          alert("Reason submission cancelled. Please submit a reason to avoid further action.");
        }
        return;
      }

      // Check for 1-day absence notification (if not already handled by 3/7 day)
      const oneDayAbsentEvent = events.find(event => event.event_type === '1_day_absent_notification' && !event.details.reasonConfirmed);
      if (oneDayAbsentEvent) {
        const confirmReason = window.confirm("You were absent for one day recently. Do you want to confirm the reason?");
        if (confirmReason) {
          const reason = prompt("Please provide a reason for your absence:");
          if (reason) {
            await submitAbsenceReason('/reason', { studentId, date: moment(oneDayAbsentEvent.details.lastAbsentDate).format('YYYY-MM-DD'), reason });
            alert("Reason confirmed and submitted.");
            // Mark event as reasonConfirmed on backend if possible, or prevent re-prompting
          }
        }
      }

    } catch (error) {
      console.error("Error checking student notifications:", error);
      // Handle error, maybe show a generic message
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden p-6">
      {/* Background glow shapes */}
      <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-teal-500 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>

      {/* Card */}
      <div className="relative bg-slate-800/80 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-teal-600 rounded-full shadow-lg">
            <GraduationCap className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-teal-400 mb-2">Portal Login</h2>
        <p className="text-slate-400 mb-8">
          Please enter your credentials to continue.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="text-left">
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Actions */}
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-slate-900 font-extrabold py-3 rounded-xl transition duration-300 shadow-lg shadow-teal-500/30 flex items-center justify-center"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Secure Sign In
          </button>
        </form>

        {/* Register link */}
        <p className="mt-6 text-sm text-slate-400">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-teal-400 hover:text-teal-300 font-semibold"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;