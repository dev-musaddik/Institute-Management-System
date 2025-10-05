import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import Table from './Table';

function DepartmentList({ onEditDepartment }) {
  const { data: departments, loading, error, get, del } = useApi('/api/departments');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      await get('/');
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await del(`/${id}`);
        alert('Department deleted successfully!');
        fetchDepartments();
      } catch (err) {
        alert(`Failed to delete department: ${err.message}`);
      }
    }
  };

  const headers = ["ID", "Name", "Actions"];

  const renderDepartmentRow = (department) => (
    <tr key={department.id} className="hover:bg-gray-800">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{department.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{department.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onEditDepartment(department)}
          className="text-indigo-400 hover:text-indigo-600 mr-3"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(department.id)}
          className="text-red-400 hover:text-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  );

  if (loading) return <div className="text-center text-white">Loading departments...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4 text-white">Departments</h3>
      {departments && departments.length > 0 ? (
        <Table
          headers={headers}
          data={departments}
          renderRow={renderDepartmentRow}
        />
      ) : (
        <p className="text-gray-400">No departments found.</p>
      )}
    </div>
  );
}

export default DepartmentList;
