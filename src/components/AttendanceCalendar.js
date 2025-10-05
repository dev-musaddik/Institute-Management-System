import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import { useAuth } from '../context/AuthContext';
import useApi from '../hooks/useApi';

const AttendanceCalendar = ({ studentId }) => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(moment());
  const { data: calendarData, loading, error, get } = useApi('/api/daily-attendance');
  const [holidays, setHolidays] = useState({});

  const fetchCalendarData = async () => {
    if (!studentId) return;
    const year = currentMonth.year();
    const month = currentMonth.month() + 1; // moment months are 0-indexed
    try {
      const data = await get(`/calendar/${studentId}/${year}/${month}`);
      // Transform array of holidays into a map for easier lookup
      const fetchedHolidays = await get(`/holidays/month/${year}/${month}`);
      const holidayMap = fetchedHolidays.reduce((acc, holiday) => {
        acc[holiday.date] = holiday;
        return acc;
      }, {});
      setHolidays(holidayMap);
    } catch (err) {
      console.error('Failed to fetch calendar data:', err);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, [currentMonth, studentId]); // Refetch when month or studentId changes

  const daysInMonth = useMemo(() => {
    const startDay = moment(currentMonth).startOf('month');
    const endDay = moment(currentMonth).endOf('month');
    const days = [];

    // Fill leading empty days
    const firstDayOfWeek = startDay.day(); // 0 for Sunday, 1 for Monday
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Fill days of the month
    let day = startDay;
    while (day <= endDay) {
      days.push(day.clone());
      day.add(1, 'day');
    }
    return days;
  }, [currentMonth]);

  const goToPreviousMonth = () => {
    setCurrentMonth(currentMonth.clone().subtract(1, 'month'));
  };

  const goToNextMonth = () => {
    setCurrentMonth(currentMonth.clone().add(1, 'month'));
  };

  const getDayStatusClass = (day) => {
    if (!day) return '';
    const dateString = day.format('YYYY-MM-DD');
    const record = calendarData ? calendarData[dateString] : null;

    if (record) {
      switch (record.status) {
        case 'Present': return 'bg-green-500';
        case 'Absent': return 'bg-red-500';
        case 'Holiday': return 'bg-blue-400';
        case 'Pending': return 'bg-yellow-400';
        default: return '';
      }
    }
    // Check if it's a holiday from the holidays list
    if (holidays[dateString]) {
      return 'bg-blue-400';
    }
    return 'bg-gray-200'; // Default for unmarked days
  };

  const getDayTooltip = (day) => {
    if (!day) return '';
    const dateString = day.format('YYYY-MM-DD');
    const record = calendarData ? calendarData[dateString] : null;
    const holidayInfo = holidays[dateString];

    let tooltip = day.format('YYYY-MM-DD');

    if (record) {
      tooltip += `\nStatus: ${record.status}`;
      if (record.reason) {
        tooltip += `\nReason: ${record.reason}`;
      }
    } else if (holidayInfo) {
      tooltip += `\nHoliday: ${holidayInfo.name}`;
    }
    return tooltip;
  };

  if (loading) return <div className="text-center text-white">Loading attendance...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg border border-gray-200 border-opacity-20 text-white">
      <div className="flex justify-between items-center mb-4">
        <button onClick={goToPreviousMonth} className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-200">&lt;</button>
        <h2 className="text-xl font-semibold">{currentMonth.format('MMMM YYYY')}</h2>
        <button onClick={goToNextMonth} className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-200">&gt;</button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-gray-300">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {daysInMonth.map((day, index) => (
          <div
            key={index}
            className={`relative p-2 rounded-lg flex items-center justify-center h-12 w-12 text-sm
              ${getDayStatusClass(day)}
              ${day && day.isSame(moment(), 'day') ? 'border-2 border-blue-500' : ''}
              ${day ? 'cursor-pointer hover:scale-105 transition-transform duration-150' : ''}
            `}
            title={getDayTooltip(day)}
          >
            {day ? day.date() : ''}
            {day && holidays[day.format('YYYY-MM-DD')] && (
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-purple-500" title={holidays[day.format('YYYY-MM-DD')].name}></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceCalendar;
