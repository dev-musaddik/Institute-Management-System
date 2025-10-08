import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import Table from './Table';
import moment from 'moment';

function AttendanceEventList() {
  const { data: events, loading, error, get } = useApi('/api/daily-attendance');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // This endpoint needs to be created on the backend to get all events for admin
      // For now, we'll assume an admin endpoint like /api/daily-attendance/events/all
      // Or, we can modify the existing /escalation/:studentId to return all if studentId is omitted or a special value
      // For simplicity, let's assume a new endpoint /api/daily-attendance/events
      await get('/events'); // This endpoint needs to be implemented in dailyAttendance.routes.js and controller
    } catch (err) {
      console.error('Failed to fetch attendance events:', err);
    }
  };

  const headers = ["ID", "Student ID", "Event Type", "Reason", "Timestamp", "Notified To", "Details"];

  const renderEventRow = (event) => (
    <tr key={event.id} className="hover:bg-gray-800">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{event.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{event.studentId}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{event.event_type}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{event.reason}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{moment(event.timestamp).format('YYYY-MM-DD HH:mm')}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{event.notified_to}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{event.details ? JSON.stringify(event.details) : 'N/A'}</td>
    </tr>
  );

  if (loading) return <div className="text-center text-white">Loading attendance events...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4 text-white">Attendance Events</h3>
      {events && events.length > 0 ? (
        <Table
          headers={headers}
          data={events}
          renderRow={renderEventRow}
        />
      ) : (
        <p className="text-gray-400">No attendance events found.</p>
      )}
    </div>
  );
}

export default AttendanceEventList;
