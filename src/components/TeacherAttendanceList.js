import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import useApi from '../hooks/useApi';
import moment from 'moment';
import AttendanceCalendar from './AttendanceCalendar';

function TeacherAttendanceList({ teacherId }) {
  const { user } = useAuth();
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState({}); // { studentId: 'Present'/ 'Absent' }
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStudentForCalendar, setSelectedStudentForCalendar] = useState(null);

  const { get: getAssignedStudents, post: markAttendanceApi } = useApi('/api/daily-attendance');
  const { get: getCoursesApi } = useApi('/api/courses');
  const { get: getSemestersApi } = useApi('/api/semesters');

  useEffect(() => {
    if (teacherId) {
      fetchAssignedStudents();
      fetchCoursesAndSemesters();
    }
  }, [teacherId]);

  useEffect(() => {
    applyFilters();
  }, [assignedStudents, selectedCourse, selectedSemester]);

  const fetchAssignedStudents = async () => {
    try {
      setLoadingStudents(true);
      const students = await getAssignedStudents(`/teacher/students`);
      setAssignedStudents(students);
      setFilteredStudents(students);
      // Initialize attendance status for today for all students
      const initialStatus = {};
      students.forEach(student => {
        initialStatus[student.id] = 'Pending'; // Default to pending or fetch actual status for today
      });
      setAttendanceStatus(initialStatus);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch assigned students.');
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchCoursesAndSemesters = async () => {
    try {
      const fetchedCourses = await getCoursesApi('/');
      const fetchedSemesters = await getSemestersApi('/');
      setCourses(fetchedCourses);
      setSemesters(fetchedSemesters);
    } catch (err) {
      console.error('Failed to fetch courses or semesters:', err);
    }
  };

  const applyFilters = () => {
    let tempStudents = [...assignedStudents];

    if (selectedCourse) {
      // This logic needs to be refined. A teacher is assigned to course-semester pairs.
      // We need to filter students who are in the selected semester AND are part of a course
      // that the teacher is assigned to. For simplicity, let's assume filtering by student's semesterId for now.
      // A more robust solution would involve checking teacher_assignments table.
      tempStudents = tempStudents.filter(student => student.Courses.some(c => c.id === parseInt(selectedCourse)));
    }

    if (selectedSemester) {
      tempStudents = tempStudents.filter(student => student.semesterId === parseInt(selectedSemester));
    }
    setFilteredStudents(tempStudents);
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceStatus(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAttendance = async (studentId) => {
    const status = attendanceStatus[studentId];
    if (!status || status === 'Pending') {
      alert('Please select an attendance status (Present/Absent) for the student.');
      return;
    }

    try {
      setLoadingAttendance(true);
      await markAttendanceApi('/mark', {
        studentId: studentId,
        date: moment().format('YYYY-MM-DD'),
        status: status,
        reason: status === 'Absent' ? 'Marked absent by teacher' : null,
      });
      alert(`Attendance for ${studentId} marked as ${status} for today.`);
      // Optionally, refresh the list or update local state
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark attendance.');
    } finally {
      setLoadingAttendance(false);
    }
  };

  if (loadingStudents) return <div className="text-center text-white">Loading assigned students...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4 text-white">Manage Daily Attendance</h3>

      <div className="flex space-x-4 mb-6">
        <div className="flex-1">
          <label htmlFor="semesterSelect" className="block text-sm font-bold mb-2 text-white">Filter by Semester:</label>
          <select
            id="semesterSelect"
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="">All Semesters</option>
            {semesters.map((semester) => (
              <option key={semester.id} value={semester.id}>
                {semester.name}
              </option>
            ))}
          </select>
        </div>
        {/* Course filter might be more complex as teacher assignments are course-semester specific */}
        {/* <div className="flex-1">
          <label htmlFor="courseSelect" className="block text-sm font-bold mb-2 text-white">Filter by Course:</label>
          <select
            id="courseSelect"
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.courseCode} - {course.courseName}
              </option>
            ))}
          </select>
        </div> */}
      </div>

      <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-gray-700 shadow-lg">
        {filteredStudents.length === 0 ? (
          <p className="text-gray-400 text-center">No students found for your assignments or selected filters.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Student Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Roll Number</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Department</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Semester</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Mark Today ({moment().format('YYYY-MM-DD')})</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-700">
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{student.firstName} {student.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{student.rollNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{student.Department?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{student.Semester?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex items-center space-x-2">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio text-green-500" 
                          name={`attendance-${student.id}`}
                          value="Present"
                          checked={attendanceStatus[student.id] === 'Present'}
                          onChange={() => handleAttendanceChange(student.id, 'Present')}
                        />
                        <span className="ml-2">Present</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio text-red-500"
                          name={`attendance-${student.id}`}
                          value="Absent"
                          checked={attendanceStatus[student.id] === 'Absent'}
                          onChange={() => handleAttendanceChange(student.id, 'Absent')}
                        />
                        <span className="ml-2">Absent</span>
                      </label>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleMarkAttendance(student.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-lg mr-2"
                      disabled={loadingAttendance}
                    >
                      {loadingAttendance ? 'Marking...' : 'Mark'}
                    </button>
                    <button
                      onClick={() => setSelectedStudentForCalendar(student.id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded-lg"
                    >
                      View Calendar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedStudentForCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-lg border border-gray-700 relative w-11/12 max-w-4xl">
            <button
              onClick={() => setSelectedStudentForCalendar(null)}
              className="absolute top-4 right-4 text-white text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-4 text-white">Attendance Calendar for {filteredStudents.find(s => s.id === selectedStudentForCalendar)?.firstName}</h3>
            <AttendanceCalendar studentId={selectedStudentForCalendar} />
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherAttendanceList;