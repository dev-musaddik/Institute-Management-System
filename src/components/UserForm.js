// src/components/UserForm.jsx
import React, { useState, useEffect } from "react";
import { userService } from "../api/services/userService";
import { departmentService } from "../api/services/departmentService";
import { semesterService } from "../api/services/semesterService";
function UserForm({ userToEdit, onSave, onCancel }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    fetchDependencies();
  }, []);

  useEffect(() => {
    if (userToEdit) {
      setEmail(userToEdit.email);
      setRole(userToEdit.role);
      setFirstName(
        userToEdit.Student?.firstName || userToEdit.Teacher?.firstName || ""
      );
      setLastName(
        userToEdit.Student?.lastName || userToEdit.Teacher?.lastName || ""
      );
      setRollNumber(userToEdit.Student?.rollNumber || "");
      setRegistrationNumber(userToEdit.Student?.registrationNumber || "");
      setDepartmentId(
        userToEdit.Student?.departmentId ||
          userToEdit.Teacher?.departmentId ||
          ""
      );
      setSemesterId(userToEdit.Student?.semesterId || "");
      setPhone(userToEdit.Student?.phone || userToEdit.Teacher?.phone || "");
      setPassword("");
    } else {
      setEmail("");
      setPassword("");
      setRole("Student");
      setFirstName("");
      setLastName("");
      setRollNumber("");
      setRegistrationNumber("");
      setDepartmentId("");
      setSemesterId("");
      setPhone("");
    }
  }, [userToEdit]);

  const fetchDependencies = async () => {
    try {
      const fetchedDepartments = await departmentService.getAll();
      setDepartments(fetchedDepartments.data);
      const fetchedSemesters = await semesterService.getAll();
      setSemesters(fetchedSemesters.data);
    } catch (err) {
      console.error("Failed to fetch dependencies", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const userData = {
      email,
      password: password || undefined,
      role,
      firstName,
      lastName,
      phone,
    };

    if (role === "Student") {
      userData.rollNumber = rollNumber;
      userData.registrationNumber = registrationNumber;
      userData.departmentId = parseInt(departmentId);
      userData.semesterId = parseInt(semesterId);
    } else if (role === "Teacher") {
      userData.departmentId = parseInt(departmentId);
    }

    try {
      if (userToEdit) {
        await userService.update(userToEdit.id, userData);
      } else {
        await userService.create(userData);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save user");
    }
  };

  return (
    <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg border border-gray-700 mt-8">
      <h3 className="text-2xl font-bold mb-4 text-white">
        {userToEdit ? "Edit User" : "Add New User"}
      </h3>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label
            className="block text-sm font-bold mb-2 text-gray-300"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label
            className="block text-sm font-bold mb-2 text-gray-300"
            htmlFor="password"
          >
            Password {userToEdit && "(leave blank to keep current)"}
          </label>
          <input
            type="password"
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            {...(!userToEdit && { required: true })}
          />
        </div>
        <div>
          <label
            className="block text-sm font-bold mb-2 text-gray-300"
            htmlFor="role"
          >
            Role
          </label>
          <select
            id="role"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div>
          <label
            className="block text-sm font-bold mb-2 text-gray-300"
            htmlFor="firstName"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label
            className="block text-sm font-bold mb-2 text-gray-300"
            htmlFor="lastName"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-bold mb-2 text-gray-300"
          >
            Phone
          </label>
          <input
            type="text"
            id="phone"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {(role === "Student" || role === "Teacher") && (
          <div>
            <label
              className="block text-sm font-bold mb-2 text-gray-300"
              htmlFor="departmentId"
            >
              Department
            </label>
            <select
              id="departmentId"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {role === "Student" && (
          <>
            <div>
              <label
                className="block text-sm font-bold mb-2 text-gray-300"
                htmlFor="rollNumber"
              >
                Roll Number
              </label>
              <input
                type="text"
                id="rollNumber"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-bold mb-2 text-gray-300"
                htmlFor="registrationNumber"
              >
                Registration Number
              </label>
              <input
                type="text"
                id="registrationNumber"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-bold mb-2 text-gray-300"
                htmlFor="semesterId"
              >
                Semester
              </label>
              <select
                id="semesterId"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
                value={semesterId}
                onChange={(e) => setSemesterId(e.target.value)}
                required
              >
                <option value="">Select Semester</option>
                {semesters.map((sem) => (
                  <option key={sem.id} value={sem.id}>
                    {sem.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div className="col-span-full flex justify-end space-x-4 mt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {userToEdit ? "Update User" : "Add User"}
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

export default UserForm;
