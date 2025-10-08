import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';

function ResultForm({ resultToEdit, onSave, onCancel }) {
  const [studentId, setStudentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [marks, setMarks] = useState('');
  const [grade, setGrade] = useState('');
  const [semesterId, setSemesterId] = useState(''); // Changed to semesterId
  const [error, setError] = useState(null);

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]); // New state for semesters

  const { get: getStudents } = useApi('/api/students');
  const { get: getCourses } = useApi('/api/courses');
  const { get: getSemesters } = useApi('/api/semesters'); // New API call
  const { post, put } = useApi('/api/results');

  useEffect(() => {
    fetchDependencies();
  }, []);

  useEffect(() => {
    if (resultToEdit) {
      setStudentId(resultToEdit.studentId);
      setCourseId(resultToEdit.courseId);
      setMarks(resultToEdit.marks);
      setGrade(resultToEdit.grade);
      setSemesterId(resultToEdit.semesterId); // Use semesterId
    } else {
      // Reset form for new record
      setStudentId('');
      setCourseId('');
      setMarks('');
      setGrade('');
      setSemesterId('');
    }
  }, [resultToEdit]);

  const fetchDependencies = async () => {
    try {
      const fetchedStudents = await getStudents('/');
      setStudents(fetchedStudents);
      const fetchedCourses = await getCourses('/');
      setCourses(fetchedCourses);
      const fetchedSemesters = await getSemesters('/'); // Fetch semesters
      setSemesters(fetchedSemesters);
    } catch (err) {
      console.error('Failed to fetch dependencies', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const resultData = {
      studentId: parseInt(studentId),
      courseId: parseInt(courseId),
      marks: parseFloat(marks),
      grade,
      semesterId: parseInt(semesterId), // Use semesterId
    };

    try {
      if (resultToEdit) {
        await put(`/${resultToEdit.id}`, resultData);
      } else {
        await post('/', resultData);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save result record');
    }
  };

  return (
    <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg border border-gray-700 mt-8">
      <h3 className="text-2xl font-bold mb-4 text-white">{resultToEdit ? 'Edit Result' : 'Add New Result Record'}</h3>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="studentId">Student</label>
          <select
            id="studentId"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          >
            <option value="">Select a student</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.rollNumber})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="courseId">Course</label>
          <select
            id="courseId"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
          >
            <option value="">Select a course</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.courseCode} - {c.courseName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="marks">Marks</label>
          <input
            type="number"
            id="marks"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="grade">Grade</label>
          <input
            type="text"
            id="grade"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="semesterId">Semester</label>
          <select
            id="semesterId"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
            value={semesterId}
            onChange={(e) => setSemesterId(e.target.value)}
            required
          >
            <option value="">Select Semester</option>
            {semesters.map(sem => (
              <option key={sem.id} value={sem.id}>{sem.name}</option>
            ))}
          </select>
        </div>

        <div className="col-span-full flex justify-end space-x-4 mt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {resultToEdit ? 'Update Record' : 'Add Record'}
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

export default ResultForm;