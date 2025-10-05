import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../components/Table";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api/teachers";

function TeacherList({ onEditTeacher }) {
  const { token } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, [token]); // Added token as dependency

  const fetchTeachers = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch teachers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (teacherId) => {
    if (!window.confirm("Are you sure you want to delete this teacher?"))
      return;
    try {
      // Optimistic UI update
      setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
      await axios.delete(`${API_URL}/${teacherId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete teacher");
      fetchTeachers(); // Revert if failed
    }
  };

  const headers = ["ID", "User Email", "Name", "Department", "Phone"];

  const renderTeacherRow = (teacher) => (
    <tr key={teacher.id} className="hover:bg-gray-800">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {teacher.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {teacher.User?.email || "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {teacher.firstName} {teacher.lastName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {teacher.department}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {teacher.phone}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onEditTeacher(teacher)}
          className="text-indigo-400 hover:text-indigo-600 mr-3"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(teacher.id)}
          className="text-red-400 hover:text-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  );

  if (loading)
    return <div className="text-center text-lg">Loading teachers...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 text-lg">Error: {error}</div>
    );

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">All Teachers</h3>
      <Table
        headers={headers}
        data={teachers}
        renderRow={renderTeacherRow}
        actions={["Edit", "Delete"]}
      />
    </div>
  );
}

export default TeacherList;
