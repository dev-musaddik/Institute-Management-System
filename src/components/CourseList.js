import React, { useState, useEffect } from "react";
import useApi from "../hooks/useApi";
import Table from "../components/Table";

function CourseList({ onEditCourse }) {
  const { data: courses, loading, error, get, del } = useApi('/api/courses');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      await get('/');
    } catch (err) {
      console.error("Failed to fetch courses", err);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await del(`/${courseId}`);
      alert("Course deleted successfully!");
      fetchCourses(); // Refresh list
    } catch (err) {
      alert(`Failed to delete course: ${err.message}`);
    }
  };

  const headers = ["ID", "Code", "Name", "Department", "Semester", "Teacher", "Actions"];

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
        {course.Department?.name || "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {course.Semester?.name || "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {course.Teacher
          ? `${course.Teacher.firstName} ${course.Teacher.lastName}`
          : "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onEditCourse(course)}
          className="text-indigo-400 hover:text-indigo-600 mr-3"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(course.id)}
          className="text-red-400 hover:text-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  );

  if (loading)
    return <div className="text-center text-lg text-white">Loading courses...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 text-lg">Error: {error}</div>
    );

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4 text-white">All Courses</h3>
      <Table
        headers={headers}
        data={courses}
        renderRow={renderCourseRow}
        actions={["Edit", "Delete"]}
      />
    </div>
  );
}

export default CourseList;