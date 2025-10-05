import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../components/Table";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api/users";

function UserList({ onEditUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${API_URL}/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsers(); // Refresh list
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const headers = [
    "ID",
    "Email",
    "Role",
    "First Name",
    "Last Name",
    "Roll/Dept",
  ];

  const renderUserRow = (user) => (
    <tr key={user.id} className="hover:bg-gray-800">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {user.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {user.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {user.role}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {user.Student?.firstName || user.Teacher?.firstName || "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {user.Student?.lastName || user.Teacher?.lastName || "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {user.Student?.rollNumber || user.Teacher?.department || "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onEditUser(user)}
          className="text-indigo-400 hover:text-indigo-600 mr-3"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(user.id)}
          className="text-red-400 hover:text-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  );

  if (loading)
    return <div className="text-center text-lg text-white">Loading users...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 text-lg">Error: {error}</div>
    );

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4 text-white">All Users</h3>
      <Table
        headers={headers}
        data={users}
        renderRow={renderUserRow}
        actions={["Edit", "Delete"]}
      />
    </div>
  );
}

export default UserList;