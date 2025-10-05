import React, { useState, useEffect } from "react";
import useApi from "../hooks/useApi";

function AttendanceForm({ attendanceToEdit, onSave, onCancel }) {
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Present");
  const [error, setError] = useState(null);

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const { get: getStudents } = useApi('/api/students');
  const { get: getCourses } = useApi('/api/courses');
  const { post, put } = useApi('/api/attendance');

  useEffect(() => {
    fetchDependencies();
  }, []);

  useEffect(() => {
    if (attendanceToEdit) {
      setStudentId(attendanceToEdit.studentId);
      setCourseId(attendanceToEdit.courseId);
      setDate(attendanceToEdit.date);
      setStatus(attendanceToEdit.status);
    } else {
      setStudentId("");
      setCourseId("");
      setDate("");
      setStatus("Present");
    }
  }, [attendanceToEdit]);

  const fetchDependencies = async () => {
    try {
      const fetchedStudents = await getStudents('/');
      setStudents(fetchedStudents);
      const fetchedCourses = await getCourses('/');
      setCourses(fetchedCourses);
    } catch (err) {
      console.error("Failed to fetch students or courses", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const attendanceData = {
      studentId: parseInt(studentId),
      courseId: parseInt(courseId),
      date,
      status,
    };

    try {
      if (attendanceToEdit) {
        await put(`/${attendanceToEdit.id}`, attendanceData);
      } else {
        await post('/', attendanceData);
      }
      onSave();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save attendance record"
      );
    }
  };

  return (
    <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg border border-gray-700 mt-8">
      <h3 className="text-2xl font-bold mb-4 text-white">
        {attendanceToEdit ? "Edit Attendance" : "Add New Attendance Record"}
      </h3>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="studentId">
            Student
          </label>
          <select
            id="studentId"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          >
            <option value="">Select a student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.firstName} {s.lastName} ({s.rollNumber})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="courseId">
            Course
          </label>
          <select
            id="courseId"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
          >
            <option value="">Select a course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.courseCode} - {c.courseName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="date">
            Date
          </label>
          <input
            type="date"
            id="date"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>
        <div className="col-span-full flex justify-end space-x-4 mt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {attendanceToEdit ? "Update Record" : "Add Record"}
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

export default AttendanceForm;