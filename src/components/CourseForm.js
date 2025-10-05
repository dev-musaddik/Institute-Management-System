import React, { useState, useEffect } from "react";
import useApi from "../hooks/useApi";

function CourseForm({ courseToEdit, onSave, onCancel }) {
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [department_id, setDepartmentId] = useState(""); // Changed to department_id
  const [semester_id, setSemesterId] = useState("");     // Changed to semester_id
  const [teacherId, setTeacherId] = useState("");
  const [error, setError] = useState(null);

  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const { get: getTeachers } = useApi('/api/teachers');
  const { get: getDepartments } = useApi('/api/departments');
  const { get: getSemesters } = useApi('/api/semesters');
  const { post, put } = useApi('/api/courses');

  useEffect(() => {
    fetchDependencies();
  }, []);

  useEffect(() => {
    if (courseToEdit) {
      setCourseCode(courseToEdit.courseCode);
      setCourseName(courseToEdit.courseName);
      setDepartmentId(courseToEdit.department_id);
      setSemesterId(courseToEdit.semester_id);
      setTeacherId(courseToEdit.teacherId || "");
    } else {
      setCourseCode("");
      setCourseName("");
      setDepartmentId("");
      setSemesterId("");
      setTeacherId("");
    }
  }, [courseToEdit]);

  const fetchDependencies = async () => {
    try {
      const fetchedTeachers = await getTeachers('/');
      setTeachers(fetchedTeachers);
      const fetchedDepartments = await getDepartments('/');
      setDepartments(fetchedDepartments);
      const fetchedSemesters = await getSemesters('/');
      setSemesters(fetchedSemesters);
    } catch (err) {
      console.error("Failed to fetch dependencies for course form", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const courseData = {
      courseCode,
      courseName,
      department_id: parseInt(department_id),
      semester_id: parseInt(semester_id),
      teacherId: teacherId ? parseInt(teacherId) : null,
    };

    try {
      if (courseToEdit) {
        await put(`/${courseToEdit.id}`, courseData);
      } else {
        await post('/', courseData);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save course");
    }
  };

  return (
    <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg border border-gray-700 mt-8">
      <h3 className="text-2xl font-bold mb-4 text-white">
        {courseToEdit ? "Edit Course" : "Add New Course"}
      </h3>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="courseCode">
            Course Code
          </label>
          <input
            type="text"
            id="courseCode"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="courseName">
            Course Name
          </label>
          <input
            type="text"
            id="courseName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="department_id">
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
          <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="semester_id">
            Semester
          </label>
          <select
            id="semester_id"
            value={semester_id}
            onChange={(e) => setSemesterId(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
          >
            <option value="">Select Semester</option>
            {semesters.map(sem => (
              <option key={sem.id} value={sem.id}>{sem.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="teacherId">
            Assigned Teacher
          </label>
          <select
            id="teacherId"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
          >
            <option value="">Select a teacher (Optional)</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.firstName} {t.lastName}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-full flex justify-end space-x-4 mt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {courseToEdit ? "Update Course" : "Add Course"}
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

export default CourseForm;