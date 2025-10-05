
// src/components/StudentForm.jsx
import React, { useState, useEffect } from 'react';
import { studentService } from '../api/services/studentService';
import { semesterService } from '../api/services/semesterService';
import { userService } from '../api/services/userService';
import { departmentService } from '../api/services/departmentService';
function StudentForm({ studentToEdit, onSave, onCancel }) {
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [department_id, setDepartmentId] = useState('');
  const [semester_id, setSemesterId] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('active');
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
      setDepartmentId(studentToEdit.department_id);
      setSemesterId(studentToEdit.semester_id);
      setPhone(studentToEdit.phone);
      setStatus(studentToEdit.status);
    } else {
      setUserId('');
      setFirstName('');
      setLastName('');
      setRollNumber('');
      setRegistrationNumber('');
      setDepartmentId('');
      setSemesterId('');
      setPhone('');
      setStatus('active');
    }
  }, [studentToEdit]);

  const fetchDependencies = async () => {
    try {
      const fetchedUsers = await userService.getAll();
      setUsers(
        fetchedUsers.data.filter(
          (u) => u.role === 'Student' && (!u.Student || u.id === studentToEdit?.userId)
        )
      );

      const fetchedDepartments = await departmentService.getAll();
      setDepartments(fetchedDepartments.data);

      const fetchedSemesters = await semesterService.getAll();
      setSemesters(fetchedSemesters.data);
    } catch (err) {
      console.error('Failed to fetch dependencies', err);
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
      department_id: parseInt(department_id),
      semester_id: parseInt(semester_id),
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
      setError(err.response?.data?.message || 'Failed to save student');
    }
  };

  return (
    <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg border border-gray-700 mt-8">
      {/* Form content here same as before */}
    </div>
  );
}

export default StudentForm;