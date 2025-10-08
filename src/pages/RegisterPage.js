import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";

function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [rollNumber, setRollNumber] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [phone, setPhone] = useState("");

  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const { register } = useAuth();
  const navigate = useNavigate();
  const { get: getDepartments } = useApi(
    "http://localhost:5000/api/departments"
  );
  const { get: getSemesters } = useApi("http://localhost:5000/api/semesters");

  useEffect(() => {
    fetchDepartments();
    fetchSemesters();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments("/");
      setDepartments(data);
      console.log(data)
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    }
  };

  const fetchSemesters = async () => {
    try {
      const data = await getSemesters("/");
      setSemesters(data);
    } catch (err) {
      console.error("Failed to fetch semesters:", err);
    }
  };

  console.log(departmentId)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      firstName,
      lastName,
      email,
      password,
      role,
      phone,
    };

    if (role === "Student") {
      userData.firstName = firstName;
      userData.lastName = lastName;
      userData.rollNumber = rollNumber;
      userData.registrationNumber = registrationNumber;
      userData.departmentId = parseInt(departmentId);
      userData.semesterId = parseInt(semesterId);
    } else if (role === "Teacher") {
      userData.departmentId = parseInt(departmentId);
    }

    const success = await register(userData);
    if (success) {
      alert("Registration successful! Please log in.");
      navigate("/login");
    } else {
      alert("Registration failed! Please check your input.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg max-w-lg w-full border border-gray-700">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-white tracking-wide">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1 text-gray-300"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1 text-gray-300"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1 text-gray-300"
              htmlFor="role"
            >
              Role
            </label>
            <select
              id="role"
              className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1 text-gray-300"
              htmlFor="phone"
            >
              Phone
            </label>
            <input
              type="text"
              id="phone"
              className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {(role === "Student" || role === "Teacher") && (
            <div>
              <label
                className="block text-sm font-medium mb-1 text-gray-300"
                htmlFor="departmentId"
              >
                Department
              </label>
              <select
                id="departmentId"
                className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="block text-sm font-medium mb-1 text-gray-300"
                  htmlFor="rollNumber"
                >
                  Roll Number
                </label>
                <input
                  type="text"
                  id="rollNumber"
                  className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1 text-gray-300"
                  htmlFor="registrationNumber"
                >
                  Registration Number
                </label>
                <input
                  type="text"
                  id="registrationNumber"
                  className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1 text-gray-300"
                  htmlFor="semesterId"
                >
                  Semester
                </label>
                <select
                  id="semesterId"
                  className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
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

          <div className="flex items-center justify-between mt-6">
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 transition-colors text-white font-bold py-2 px-4 rounded-lg shadow-md"
            >
              Register
            </button>
          </div>

          <p className="text-center text-sm mt-4 text-gray-400">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-green-400 hover:text-green-500 font-semibold"
            >
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
