import React, { useState, useEffect } from "react";
import useApi from "../hooks/useApi";

function TeacherForm({ teacherToEdit, onSave, onCancel }) {
  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [department_id, setDepartmentId] = useState(""); // Changed to department_id
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);

  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);

  const { get: getUsers } = useApi('/api/users');
  const { get: getDepartments } = useApi('/api/departments');
  const { post, put } = useApi('/api/teachers');

  useEffect(() => {
    fetchDependencies();
  }, []);

  useEffect(() => {
    if (teacherToEdit) {
      setUserId(teacherToEdit.userId);
      setFirstName(teacherToEdit.firstName);
      setLastName(teacherToEdit.lastName);
      setDepartmentId(teacherToEdit.department_id);
      setPhone(teacherToEdit.phone);
    } else {
      setUserId("");
      setFirstName("");
      setLastName("");
      setDepartmentId("");
      setPhone("");
    }
  }, [teacherToEdit]);

  const fetchDependencies = async () => {
    try {
      const fetchedUsers = await getUsers('/');
      setUsers(
        fetchedUsers.filter(
          (u) =>
            u.role === "Teacher" &&
            (!u.Teacher || u.id === teacherToEdit?.userId)
        )
      );
      const fetchedDepartments = await getDepartments('/');
      setDepartments(fetchedDepartments);
    } catch (err) {
      console.error("Failed to fetch dependencies for teacher form", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const teacherData = {
      userId: parseInt(userId),
      firstName,
      lastName,
      department_id: parseInt(department_id),
      phone,
    };

    try {
      if (teacherToEdit) {
        await put(`/${teacherToEdit.id}`, teacherData);
      } else {
        await post('/', teacherData);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save teacher");
    }
  };

  return (
    <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg border border-gray-700 mt-8">
      <h3 className="text-2xl font-bold mb-4 text-white">
        {teacherToEdit ? "Edit Teacher" : "Add New Teacher"}
      </h3>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label htmlFor="userId" className="block text-sm font-bold mb-2 text-gray-300">
            User Email (Role: Teacher)
          </label>
          <select
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            disabled={!!teacherToEdit}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
          >
            <option value="">Select a user</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.email}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="firstName" className="block text-sm font-bold mb-2 text-gray-300">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-bold mb-2 text-gray-300">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
          />
        </div>
        <div>
          <label htmlFor="department_id" className="block text-sm font-bold mb-2 text-gray-300">
            Department
          </label>
          <select
            id="department_id"
            value={department_id}
            onChange={(e) => setDepartmentId(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-bold mb-2 text-gray-300">
            Phone
          </label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
          />
        </div>

        <div className="col-span-full flex justify-end space-x-4 mt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {teacherToEdit ? "Update Teacher" : "Add Teacher"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default TeacherForm;