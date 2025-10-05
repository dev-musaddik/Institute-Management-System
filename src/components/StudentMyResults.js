import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../components/Table";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api/attendance"; // Assuming attendance API can filter by studentId

function StudentMyAttendance({ studentId }) {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (studentId) {
      fetchMyAttendance();
    }
  }, [studentId]);

  const fetchMyAttendance = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}?studentId=${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendanceRecords(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  const headers = ["ID", "Course Name", "Date", "Status"];

  const renderAttendanceRow = (record) => (
    <tr key={record.id} className="hover:bg-gray-800">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {record.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {record.Course
          ? `${record.Course.courseCode} - ${record.Course.courseName}`
          : "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {record.date}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {record.status}
      </td>
    </tr>
  );

  if (loading)
    return <div className="text-center text-lg">Loading attendance...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 text-lg">Error: {error}</div>
    );

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">My Attendance</h3>
      <Table
        headers={headers}
        data={attendanceRecords}
        renderRow={renderAttendanceRow}
      />
    </div>
  );
}

export default StudentMyAttendance;
