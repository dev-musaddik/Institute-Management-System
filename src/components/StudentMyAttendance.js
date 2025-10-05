import React from 'react';
import AttendanceCalendar from './AttendanceCalendar';

function StudentMyAttendance({ studentId }) {
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4 text-white">My Daily Attendance</h3>
      {studentId ? (
        <AttendanceCalendar studentId={studentId} />
      ) : (
        <div className="text-center text-lg text-gray-400">Please log in to view your attendance.</div>
      )}
    </div>
  );
}

export default StudentMyAttendance;