import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import Table from './Table';

function SemesterList({ onEditSemester }) {
  const { data: semesters, loading, error, get, del } = useApi('/api/semesters');

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      await get('/');
    } catch (err) {
      console.error('Failed to fetch semesters:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this semester?')) {
      try {
        await del(`/${id}`);
        alert('Semester deleted successfully!');
        fetchSemesters();
      } catch (err) {
        alert(`Failed to delete semester: ${err.message}`);
      }
    }
  };

  const headers = ["ID", "Name", "Actions"];

  const renderSemesterRow = (semester) => (
    <tr key={semester.id} className="hover:bg-gray-800">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{semester.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{semester.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onEditSemester(semester)}
          className="text-indigo-400 hover:text-indigo-600 mr-3"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(semester.id)}
          className="text-red-400 hover:text-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  );

  if (loading) return <div className="text-center text-white">Loading semesters...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4 text-white">Semesters</h3>
      {semesters && semesters.length > 0 ? (
        <Table
          headers={headers}
          data={semesters}
          renderRow={renderSemesterRow}
        />
      ) : (
        <p className="text-gray-400">No semesters found.</p>
      )}
    </div>
  );
}

export default SemesterList;
