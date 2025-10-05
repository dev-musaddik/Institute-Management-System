import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../components/Table";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api/courses";

function TeacherCourseList({ teacherId }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (teacherId) {
      fetchCourses();
    }
  }, [teacherId]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Fetch courses specifically for this teacher
      const response = await axios.get(`${API_URL}?teacherId=${teacherId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const headers = ["ID", "Code", "Name", "Department", "Semester"];

  const renderCourseRow = (course) => (
    <tr key={course.id} className="hover:bg-gray-800">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {course.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {course.courseCode}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {course.courseName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {course.department}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {course.semester}
      </td>
    </tr>
  );

  if (loading)
    return <div className="text-center text-lg">Loading courses...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 text-lg">Error: {error}</div>
    );

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">My Assigned Courses</h3>
      <Table headers={headers} data={courses} renderRow={renderCourseRow} />
    </div>
  );
}

export default TeacherCourseList;
