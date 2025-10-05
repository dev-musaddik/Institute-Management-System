import React, { useState, useEffect } from "react";
import useApi from "../hooks/useApi";
import Table from "../components/Table";

function StudentList({ onEditStudent }) {
  const { data: students, loading, error, get, del } = useApi('/api/students');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      await get('/');
    } catch (err) {
      console.error("Failed to fetch students", err);
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await del(`/${studentId}`);
        alert("Student deleted successfully!");
        fetchStudents(); // Refresh list
      } catch (err) {
        alert(`Failed to delete student: ${err.message}`);
      }
    }
  };

  const headers = [
    "ID",
    "User Email",
    "Name",
    "Roll No.",
    "Reg. No.",
    "Department",
    "Semester",
    "Status", // Added status
    "Actions",
  ];

  const renderStudentRow = (student) => (
    <tr key={student.id} className="hover:bg-gray-800">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {student.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {student.User?.email || "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {student.firstName} {student.lastName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {student.rollNumber}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {student.registrationNumber}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {student.Department?.name || "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {student.Semester?.name || "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {student.status}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onEditStudent(student)}
          className="text-indigo-400 hover:text-indigo-600 mr-3"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(student.id)}
          className="text-red-400 hover:text-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  );

  if (loading)
    return <div className="text-center text-lg text-white">Loading students...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 text-lg">Error: {error}</div>
    );

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4 text-white">All Students</h3>
      <Table
        headers={headers}
        data={students}
        renderRow={renderStudentRow}
        actions={["Edit", "Delete"]}
      />
    </div>
  );
}

export default StudentList;