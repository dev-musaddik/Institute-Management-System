import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import Table from './Table';

function TeacherAssignmentList({ onEditAssignment }) {
  const { data: assignments, loading, error, get, del } = useApi('/api/teacher-assignments');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      await get('/');
    } catch (err) {
      console.error('Failed to fetch teacher assignments:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await del(`/${id}`);
        alert('Assignment deleted successfully!');
        fetchAssignments();
      } catch (err) {
        alert(`Failed to delete assignment: ${err.message}`);
      }
    }
  };

  const headers = ["ID", "Teacher", "Course", "Semester", "Actions"];

  const renderAssignmentRow = (assignment) => (
    <tr key={assignment.id} className="hover:bg-gray-800">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{assignment.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{assignment.Teacher ? `${assignment.Teacher.firstName} ${assignment.Teacher.lastName}` : 'N/A'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{assignment.Course ? `${assignment.Course.courseCode} - ${assignment.Course.courseName}` : 'N/A'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{assignment.Semester ? assignment.Semester.name : 'N/A'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onEditAssignment(assignment)}
          className="text-indigo-400 hover:text-indigo-600 mr-3"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(assignment.id)}
          className="text-red-400 hover:text-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  );

  if (loading) return <div className="text-center text-white">Loading teacher assignments...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4 text-white">Teacher Assignments</h3>
      {assignments && assignments.length > 0 ? (
        <Table
          headers={headers}
          data={assignments}
          renderRow={renderAssignmentRow}
        />
      ) : (
        <p className="text-gray-400">No teacher assignments found.</p>
      )}
    </div>
  );
}

export default TeacherAssignmentList;