import React, { useState, useEffect } from "react";
import useApi from "../hooks/useApi";
import Table from "../components/Table";

const API_URL = "http://localhost:5000/api/attendance";

function AttendanceList({ onEditAttendance }) {
  const { data: attendanceRecords, loading, error, get, del } = useApi(API_URL);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      await get('/');
    } catch (err) {
      console.error("Failed to fetch attendance records", err);
    }
  };

  const handleDelete = async (attendanceId) => {
    if (
      window.confirm("Are you sure you want to delete this attendance record?")
    ) {
      try {
        await del(`/${attendanceId}`);
        alert("Attendance record deleted successfully!");
        fetchAttendance(); // Refresh list
      } catch (err) {
        alert(`Failed to delete attendance record: ${err.message}`);
      }
    }
  };

  const headers = ["ID", "Student Name", "Course Name", "Date", "Status", "Actions"];

  const renderAttendanceRow = (record) => (
    <tr key={record.id} className="hover:bg-gray-800">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {record.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {record.Student
          ? `${record.Student.firstName} ${record.Student.lastName}`
          : "N/A"}
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
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onEditAttendance(record)}
          className="text-indigo-400 hover:text-indigo-600 mr-3"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(record.id)}
          className="text-red-400 hover:text-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  );

  if (loading)
    return <div className="text-center text-lg text-white">Loading attendance records...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 text-lg">Error: {error}</div>
    );

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4 text-white">All Attendance Records</h3>
      <Table
        headers={headers}
        data={attendanceRecords}
        renderRow={renderAttendanceRow}
        actions={["Edit", "Delete"]}
      />
    </div>
  );
}

export default AttendanceList;