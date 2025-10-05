import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';

function TeacherAssignmentForm({ assignmentToEdit, onSave, onCancel }) {
  const [teacherId, setTeacherId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const { get: getTeachers } = useApi('/api/teachers');
  const { get: getCourses } = useApi('/api/courses');
  const { get: getSemesters } = useApi('/api/semesters');
  const { post, put, loading, error } = useApi('/api/teacher-assignments');

  useEffect(() => {
    fetchDependencies();
  }, []);

  useEffect(() => {
    if (assignmentToEdit) {
      setTeacherId(assignmentToEdit.teacher_id);
      setCourseId(assignmentToEdit.course_id);
      setSemesterId(assignmentToEdit.semester_id);
    } else {
      setTeacherId('');
      setCourseId('');
      setSemesterId('');
    }
  }, [assignmentToEdit]);

  const fetchDependencies = async () => {
    try {
      const fetchedTeachers = await getTeachers('/');
      const fetchedCourses = await getCourses('/');
      const fetchedSemesters = await getSemesters('/');
      setTeachers(fetchedTeachers);
      setCourses(fetchedCourses);
      setSemesters(fetchedSemesters);
    } catch (err) {
      console.error('Failed to fetch dependencies:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { teacher_id: teacherId, course_id: courseId, semester_id: semesterId };
      if (assignmentToEdit) {
        await put(`/${assignmentToEdit.id}`, payload);
        alert('Teacher assignment updated successfully!');
      } else {
        await post('/', payload);
        alert('Teacher assignment created successfully!');
      }
      onSave();
    } catch (err) {
      alert(`Operation failed: ${err.message}`);
    }
  };

  return (
    <div className="mt-8 bg-white/5 backdrop-blur-md p-6 rounded-xl border border-gray-700 shadow-lg">
      <h3 className="text-2xl font-bold mb-4 text-white">{assignmentToEdit ? 'Edit Teacher Assignment' : 'Add New Teacher Assignment'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="teacherId">
            Teacher:
          </label>
          <select
            id="teacherId"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            required
          >
            <option value="">Select Teacher</option>
            {teachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>{teacher.firstName} {teacher.lastName}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="courseId">
            Course:
          </label>
          <select
            id="courseId"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
          >
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.courseCode} - {course.courseName}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="semesterId">
            Semester:
          </label>
          <select
            id="semesterId"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
            value={semesterId}
            onChange={(e) => setSemesterId(e.target.value)}
            required
          >
            <option value="">Select Semester</option>
            {semesters.map(semester => (
              <option key={semester.id} value={semester.id}>{semester.name}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default TeacherAssignmentForm;