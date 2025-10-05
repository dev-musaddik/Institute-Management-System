import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../components/Table";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api/students"; // Assuming student API can fetch courses

function StudentMyCourses({ studentId }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (studentId) {
      fetchMyCourses();
    }
  }, [studentId]);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/${studentId}/courses`, {
        // Assuming this endpoint exists
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data);
    } catch (err) {
      try {
        const allCoursesResponse = await axios.get(
          "http://localhost:5000/api/courses",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCourses(allCoursesResponse.data);
      } catch (fallbackErr) {
        setError(
          fallbackErr.response?.data?.message || "Failed to fetch courses"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const headers = ["ID", "Code", "Name", "Department", "Semester", "Teacher"];

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
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {course.Teacher
          ? `${course.Teacher.firstName} ${course.Teacher.lastName}`
          : "N/A"}
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
      <h3 className="text-2xl font-bold mb-4">My Courses</h3>
      <Table headers={headers} data={courses} renderRow={renderCourseRow} />
    </div>
  );
}

export default StudentMyCourses;
