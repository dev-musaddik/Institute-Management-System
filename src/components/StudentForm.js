// src/components/StudentForm.jsx
import React, { useState, useEffect } from "react";
import { studentService } from "../api/services/studentService";
import { userService } from "../api/services/userService";
import { departmentService } from "../api/services/departmentService";
import { semesterService } from "../api/services/semesterService";

function StudentForm({ studentToEdit, onSave, onCancel }) {
  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("active");
  const [error, setError] = useState(null);

  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    fetchDependencies();
  }, []);

  useEffect(() => {
    if (studentToEdit) {
      setUserId(studentToEdit.userId);
      setFirstName(studentToEdit.firstName);
      setLastName(studentToEdit.lastName);
      setRollNumber(studentToEdit.rollNumber);
      setRegistrationNumber(studentToEdit.registrationNumber);
      setDepartmentId(studentToEdit.departmentId);
      setSemesterId(studentToEdit.semesterId);
      setPhone(studentToEdit.phone);
      setStatus(studentToEdit.status);
    } else {
      resetForm();
    }
  }, [studentToEdit]);

  const resetForm = () => {
    setUserId("");
    setFirstName("");
    setLastName("");
    setRollNumber("");
    setRegistrationNumber("");
    setDepartmentId("");
    setSemesterId("");
    setPhone("");
    setStatus("active");
  };

  const fetchDependencies = async () => {
    try {
      const usersRes = await userService.getAll();
      setUsers(
        usersRes.data.filter(
          (u) =>
            u.role === "Student" &&
            (!u.Student || u.id === studentToEdit?.userId)
        )
      );
      const deptRes = await departmentService.getAll();
      setDepartments(deptRes.data);
      const semRes = await semesterService.getAll();
      setSemesters(semRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const studentData = {
      userId: parseInt(userId),
      firstName,
      lastName,
      rollNumber,
      registrationNumber,
      departmentId: parseInt(departmentId),
      semesterId: parseInt(semesterId),
      phone,
      status,
    };

    try {
      if (studentToEdit) {
        await studentService.update(studentToEdit.id, studentData);
      } else {
        await studentService.create(studentData);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save student");
    }
  };

  return (
    <div className="bg-dark p-6 rounded-lg shadow-md border border-gray-700 mt-8">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>User</label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select user</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Roll Number</label>
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label>Registration Number</label>
            <input
              type="text"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Department</label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Semester</label>
            <select
              value={semesterId}
              onChange={(e) => setSemesterId(e.target.value)}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select semester</option>
              {semesters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label>Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default StudentForm;
