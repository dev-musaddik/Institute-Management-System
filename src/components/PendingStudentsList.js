import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import Table from './Table';

function PendingStudentsList() {
  const { data: students, loading, error, get, put } = useApi('/api/students');

  useEffect(() => {
    fetchPendingStudents();
  }, []);

  const fetchPendingStudents = async () => {
    try {
      // Assuming an endpoint to get students by status, or filter on client side for now
      // For now, we'll fetch all students and filter by status on the client side.
      // A more efficient way would be a backend endpoint like /api/students?status=pending,suspended
      const allStudents = await get('/');
      const pendingOrSuspended = allStudents.filter(s => s.status === 'pending' || s.status === 'suspended');
      // The `students` state from useApi will be updated by the `get` call, but we need to filter it.
      // So, we'll manually set the filtered list to a new state variable or directly use `students` after filtering.
      // For simplicity, let's assume `get` can take a query parameter for status.
      // If not, we'd need a separate state for filtered students.
      // For now, let's just fetch all and filter.
      // TODO: Implement backend endpoint for filtering students by status.
      // For now, `students` from useApi will contain all students, we need to filter it.
      // This component will need to manage its own filtered list.
      // Let's refactor useApi to allow direct data manipulation or add a separate state.
      // For now, I will just use the `students` data and filter it in render.
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  };

  const handleReinstateStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to reinstate this student?')) {
      const reason = prompt('Please provide a reason for reinstatement:');
      if (reason) {
        try {
          await put(`/reinstate/${studentId}`, { reason }); // This endpoint is in dailyAttendance.controller.js
          alert('Student reinstated successfully!');
          fetchPendingStudents(); // Refresh list
        } catch (err) {
          alert(`Failed to reinstate student: ${err.message}`);
        }
      }
    }
  };

  const headers = ["ID", "Name", "Roll Number", "Department", "Semester", "Status", "Actions"];

  const renderStudentRow = (student) => (
    <tr key={student.id} className="hover:bg-gray-800">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{student.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{student.firstName} {student.lastName}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{student.rollNumber}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{student.Department?.name || 'N/A'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{student.Semester?.name || 'N/A'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{student.status}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {student.status !== 'active' && (
          <button
            onClick={() => handleReinstateStudent(student.id)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
          >
            Reinstate
          </button>
        )}
      </td>
    </tr>
  );

  const pendingStudents = students ? students.filter(s => s.status === 'pending' || s.status === 'suspended') : [];

  if (loading) return <div className="text-center text-white">Loading students...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4 text-white">Pending/Suspended Students</h3>
      {pendingStudents && pendingStudents.length > 0 ? (
        <Table
          headers={headers}
          data={pendingStudents}
          renderRow={renderStudentRow}
        />
      ) : (
        <p className="text-gray-400">No pending or suspended students found.</p>
      )}
    </div>
  );
}

export default PendingStudentsList;
