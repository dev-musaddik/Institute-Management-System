import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import UserList from "../components/UserList";
import UserForm from "../components/UserForm";
import StudentList from "../components/StudentList";
import StudentForm from "../components/StudentForm";
import TeacherList from "../components/TeacherList";
import TeacherForm from "../components/TeacherForm";
import CourseList from "../components/CourseList";
import CourseForm from "../components/CourseForm";
import AttendanceList from "../components/AttendanceList";
import AttendanceForm from "../components/AttendanceForm";
import ResultList from "../components/ResultList";
import ResultForm from "../components/ResultForm";
import AdminSettings from "../components/AdminSettings"; // New import
import DepartmentList from "../components/DepartmentList"; // New import
import DepartmentForm from "../components/DepartmentForm"; // New import
import SemesterList from "../components/SemesterList"; // New import
import SemesterForm from "../components/SemesterForm"; // New import
import TeacherAssignmentList from "../components/TeacherAssignmentList"; // New import
import TeacherAssignmentForm from "../components/TeacherAssignmentForm"; // New import
import AbsenceReportList from "../components/AbsenceReportList"; // New import
import AttendanceEventList from "../components/AttendanceEventList"; // New import
import PendingStudentsList from "../components/PendingStudentsList"; // New import

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("users");

  const [editing, setEditing] = useState({ type: null, record: null });
  const [showForm, setShowForm] = useState(false);

  const handleAdd = (type) => {
    setEditing({ type, record: null });
    setShowForm(true);
  };

  const handleEdit = (type, record) => {
    setEditing({ type, record });
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setEditing({ type: null, record: null });
    // Refresh the list for the active tab after save
    // This might require passing a refresh function to each list component
    // For now, simply setting activeTab to itself might trigger re-render if state changes
    setActiveTab(activeTab); 
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing({ type: null, record: null });
  };

  const renderContent = () => {
    if (showForm && editing.type) {
      switch (editing.type) {
        case "users":
          return (
            <UserForm
              userToEdit={editing.record}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          );
        case "students":
          return (
            <StudentForm
              studentToEdit={editing.record}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          );
        case "teachers":
          return (
            <TeacherForm
              teacherToEdit={editing.record}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          );
        case "courses":
          return (
            <CourseForm
              courseToEdit={editing.record}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          );
        case "attendance":
          return (
            <AttendanceForm
              attendanceToEdit={editing.record}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          );
        case "results":
          return (
            <ResultForm
              resultToEdit={editing.record}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          );
        case "departments":
          return (
            <DepartmentForm
              departmentToEdit={editing.record}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          );
        case "semesters":
          return (
            <SemesterForm
              semesterToEdit={editing.record}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          );
        case "teacher-assignments":
          return (
            <TeacherAssignmentForm
              assignmentToEdit={editing.record}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          );
        default:
          return null;
      }
    } else {
      switch (activeTab) {
        case "users":
          return (
            <>
              <div className="mb-6 flex justify-end">
                <button
                  onClick={() => handleAdd("users")}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add New User
                </button>
              </div>
              <UserList onEditUser={(record) => handleEdit("users", record)} />
            </>
          );
        case "students":
          return (
            <>
              <div className="mb-6 flex justify-end">
                <button
                  onClick={() => handleAdd("students")}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add New Student
                </button>
              </div>
              <StudentList
                onEditStudent={(record) => handleEdit("students", record)}
              />
            </>
          );
        case "teachers":
          return (
            <>
              <div className="mb-6 flex justify-end">
                <button
                  onClick={() => handleAdd("teachers")}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add New Teacher
                </button>
              </div>
              <TeacherList
                onEditTeacher={(record) => handleEdit("teachers", record)}
              />
            </>
          );
        case "courses":
          return (
            <>
              <div className="mb-6 flex justify-end">
                <button
                  onClick={() => handleAdd("courses")}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add New Course
                </button>
              </div>
              <CourseList
                onEditCourse={(record) => handleEdit("courses", record)}
              />
            </>
          );
        case "attendance":
          return (
            <>
              <div className="mb-6 flex justify-end">
                <button
                  onClick={() => handleAdd("attendance")}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Attendance Record
                </button>
              </div>
              <AttendanceList
                onEditAttendance={(record) => handleEdit("attendance", record)}
              />
            </>
          );
        case "results":
          return (
            <>
              <div className="mb-6 flex justify-end">
                <button
                  onClick={() => handleAdd("results")}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Result Record
                </button>
              </div>
              <ResultList
                onEditResult={(record) => handleEdit("results", record)}
              />
            </>
          );
        case "departments":
          return (
            <>
              <div className="mb-6 flex justify-end">
                <button
                  onClick={() => handleAdd("departments")}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add New Department
                </button>
              </div>
              <DepartmentList
                onEditDepartment={(record) => handleEdit("departments", record)}
              />
            </>
          );
        case "semesters":
          return (
            <>
              <div className="mb-6 flex justify-end">
                <button
                  onClick={() => handleAdd("semesters")}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add New Semester
                </button>
              </div>
              <SemesterList
                onEditSemester={(record) => handleEdit("semesters", record)}
              />
            </>
          );
        case "teacher-assignments":
          return (
            <>
              <div className="mb-6 flex justify-end">
                <button
                  onClick={() => handleAdd("teacher-assignments")}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add New Assignment
                </button>
              </div>
              <TeacherAssignmentList
                onEditAssignment={(record) => handleEdit("teacher-assignments", record)}
              />
            </>
          );
        case "absence-reports":
          return <AbsenceReportList />;
        case "attendance-events":
          return <AttendanceEventList />;
        case "pending-students":
          return <PendingStudentsList />;
        case "settings":
          return <AdminSettings />;
        default:
          return null;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="backdrop-blur-md bg-white/10 p-6 rounded-2xl shadow-lg border border-gray-700 mb-6">
        <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
        {user && (
          <p className="text-lg mb-2">
            Welcome, {user.email}{" "}
            <span className="text-sm text-gray-300">({user.role})</span>
          </p>
        )}
        <p className="text-gray-300">
          Manage users, students, teachers, courses, attendance, and results all
          in one place.
        </p>
        <button
          onClick={logout}
          className="mt-6 bg-red-600 hover:bg-red-700 transition-all duration-300 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-red-500/30"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setActiveTab("users")}
          className={`py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
            activeTab === "users"
              ? "bg-blue-600 shadow-md shadow-blue-500/30"
              : "bg-gray-700 hover:bg-blue-700"
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={`py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
            activeTab === "students"
              ? "bg-blue-600 shadow-md shadow-blue-500/30"
              : "bg-gray-700 hover:bg-blue-700"
          }`}
        >
          Students
        </button>
        <button
          onClick={() => setActiveTab("teachers")}
          className={`py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
            activeTab === "teachers"
              ? "bg-blue-600 shadow-md shadow-blue-500/30"
              : "bg-gray-700 hover:bg-blue-700"
          }`}
        >
          Teachers
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={`py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
            activeTab === "courses"
              ? "bg-blue-600 shadow-md shadow-blue-500/30"
              : "bg-gray-700 hover:bg-blue-700"
          }`}
        >
          Courses
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
            activeTab === "attendance"
              ? "bg-blue-600 shadow-md shadow-blue-500/30"
              : "bg-gray-700 hover:bg-blue-700"
          }`}
        >
          Attendance
        </button>
        <button
          onClick={() => setActiveTab("results")}
          className={`py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
            activeTab === "results"
              ? "bg-blue-600 shadow-md shadow-blue-500/30"
              : "bg-gray-700 hover:bg-blue-700"
          }`}
        >
          Results
        </button>
        <button
          onClick={() => setActiveTab("departments")}
          className={`py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
            activeTab === "departments"
              ? "bg-blue-600 shadow-md shadow-blue-500/30"
              : "bg-gray-700 hover:bg-blue-700"
          }`}
        >
          Departments
        </button>
        <button
          onClick={() => setActiveTab("semesters")}
          className={`py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
            activeTab === "semesters"
              ? "bg-blue-600 shadow-md shadow-blue-500/30"
              : "bg-gray-700 hover:bg-blue-700"
          }`}
        >
          Semesters
        </button>
        <button
          onClick={() => setActiveTab("teacher-assignments")}
          className={`py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
            activeTab === "teacher-assignments"
              ? "bg-blue-600 shadow-md shadow-blue-500/30"
              : "bg-gray-700 hover:bg-blue-700"
          }`}
        >
          Teacher Assignments
        </button>
        <button
          onClick={() => setActiveTab("absence-reports")}
          className={`py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
            activeTab === "absence-reports"
              ? "bg-blue-600 shadow-md shadow-blue-500/30"
              : "bg-gray-700 hover:bg-blue-700"
          }`}
        >
          Absence Reports
        </button>
        <button
          onClick={() => setActiveTab("attendance-events")}
          className={`py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
            activeTab === "attendance-events"
              ? "bg-blue-600 shadow-md shadow-blue-500/30"
              : "bg-gray-700 hover:bg-blue-700"
          }`}
        >
          Attendance Events
        </button>
        <button
          onClick={() => setActiveTab("pending-students")}
          className={`py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
            activeTab === "pending-students"
              ? "bg-blue-600 shadow-md shadow-blue-500/30"
              : "bg-gray-700 hover:bg-blue-700"
          }`}
        >
          Pending Students
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
            activeTab === "settings"
              ? "bg-blue-600 shadow-md shadow-blue-500/30"
              : "bg-gray-700 hover:bg-blue-700"
          }`}
        >
          Settings
        </button>
      </div>

      <div className="backdrop-blur-md bg-white/10 p-6 rounded-2xl shadow-lg border border-gray-700 animate-fadeIn">
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminDashboard;