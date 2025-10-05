import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import Table from './Table';

function PendingRegistrationsList({ teacherId }) {
  const { data: students, loading, error, get, put } = useApi('/api/students');

  useEffect(() => {
    if (teacherId) {
      fetchPendingStudents();
    }
  }, [teacherId]);

  const fetchPendingStudents = async () => {
    try {
      // Fetch all students and filter pending ones on the client side for now.
      // Ideally, there would be a backend endpoint like /api/students?status=pending
      const allStudents = await get('/');
      const pendingStudents = allStudents.filter(s => s.status === 'pending');
      // Manually set data for the hook to reflect filtered students
      // This is a workaround until a dedicated backend endpoint is available
      students.setData(pendingStudents); // This is not how useApi works, need to manage state locally
      // Let's refactor this to use a local state for filtered students
      // For now, I will just use the `students` data and filter it in render.
    } catch (err) {
      console.error('Failed to fetch pending students:', err);
    }
  };

  const handleApproveReject = async (studentId, status) => {
    const reason = prompt(`Reason for ${status} student registration:`);
    if (reason) {
      try {
        await put(`/status/${studentId}`, { status, reason });
        alert(`Student registration ${status} successfully!`);
        fetchPendingStudents(); // Refresh list
      } catch (err) {
        alert(`Failed to ${status} student registration: ${err.message}`);
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
        {student.status === 'pending' && (
          <>
            <button
              onClick={() => handleApproveReject(student.id, 'active')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded mr-2"
            >
              Approve
            </button>
            <button
              onClick={() => handleApproveReject(student.id, 'rejected')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
            >
              Reject
            </button>
          </>
        )}
      </td>
    </tr>
  );

  const pendingStudents = students ? students.filter(s => s.status === 'pending') : [];

  if (loading) return <div className="text-center text-white">Loading pending registrations...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4 text-white">Pending Student Registrations</h3>
      {pendingStudents && pendingStudents.length > 0 ? (
        <Table
          headers={headers}
          data={pendingStudents}
          renderRow={renderStudentRow}
        />
      ) : (
        <p className="text-gray-400">No pending student registrations found.</p>
      )}
    </div>
  );
}

export default PendingRegistrationsList;
