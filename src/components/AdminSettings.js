import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import moment from 'moment';

function AdminSettings() {
  const { data: settings, loading: loadingSettings, error: settingsError, get: getSettings, put: updateSetting, post: createSetting } = useApi('/api/institute-settings');
  const { data: holidays, loading: loadingHolidays, error: holidaysError, get: getHolidays, post: createHoliday, post: createHolidayRange, del: deleteHoliday } = useApi('/api/holidays');

  const [weekendDays, setWeekendDays] = useState('');
  const [escalation1, setEscalation1] = useState('');
  const [escalation3, setEscalation3] = useState('');
  const [escalation7, setEscalation7] = useState('');

  const [newHolidayName, setNewHolidayName] = useState('');
  const [newHolidayDate, setNewHolidayDate] = useState(moment().format('YYYY-MM-DD'));
  const [newHolidayStartDate, setNewHolidayStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [newHolidayEndDate, setNewHolidayEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [newHolidayRangeName, setNewHolidayRangeName] = useState('');

  useEffect(() => {
    fetchSettings();
    fetchHolidays();
  }, []);

  useEffect(() => {
    if (settings) {
      setWeekendDays(settings.find(s => s.setting_name === 'weekend_days')?.setting_value || '');
      setEscalation1(settings.find(s => s.setting_name === 'escalation_1_day_threshold')?.setting_value || '');
      setEscalation3(settings.find(s => s.setting_name === 'escalation_3_day_threshold')?.setting_value || '');
      setEscalation7(settings.find(s => s.setting_name === 'escalation_7_day_threshold')?.setting_value || '');
    }
  }, [settings]);

  const fetchSettings = async () => {
    try {
      await getSettings('/');
    } catch (err) {
      console.error('Failed to fetch institute settings:', err);
    }
  };

  const fetchHolidays = async () => {
    try {
      await getHolidays('/');
    } catch (err) {
      console.error('Failed to fetch holidays:', err);
    }
  };

  const handleUpdateSetting = async (settingName, value) => {
    try {
      await updateSetting(`/${settingName}`, { setting_value: value });
      alert(`${settingName} updated successfully!`);
      fetchSettings();
    } catch (err) {
      alert(`Failed to update ${settingName}: ${err.message}`);
    }
  };

  const handleAddHoliday = async () => {
    if (!newHolidayName || !newHolidayDate) {
      alert('Please fill in all holiday fields.');
      return;
    }
    try {
      await createHoliday('/', { date: newHolidayDate, name: newHolidayName, type: 'adhoc' });
      alert('Holiday added successfully!');
      setNewHolidayName('');
      setNewHolidayDate(moment().format('YYYY-MM-DD'));
      fetchHolidays();
    } catch (err) {
      alert(`Failed to add holiday: ${err.message}`);
    }
  };

  const handleAddHolidayRange = async () => {
    if (!newHolidayRangeName || !newHolidayStartDate || !newHolidayEndDate) {
      alert('Please fill in all holiday range fields.');
      return;
    }
    try {
      await createHolidayRange('/range', { startDate: newHolidayStartDate, endDate: newHolidayEndDate, name: newHolidayRangeName });
      alert('Holiday range added successfully!');
      setNewHolidayRangeName('');
      setNewHolidayStartDate(moment().format('YYYY-MM-DD'));
      setNewHolidayEndDate(moment().format('YYYY-MM-DD'));
      fetchHolidays();
    } catch (err) {
      alert(`Failed to add holiday range: ${err.message}`);
    }
  };

  const handleDeleteHoliday = async (id) => {
    if (window.confirm('Are you sure you want to delete this holiday?')) {
      try {
        await deleteHoliday(`/${id}`);
        alert('Holiday deleted successfully!');
        fetchHolidays();
      } catch (err) {
        alert(`Failed to delete holiday: ${err.message}`);
      }
    }
  };

  if (loadingSettings || loadingHolidays) return <div className="text-center text-white">Loading settings...</div>;
  if (settingsError || holidaysError) return <div className="text-center text-red-500">Error: {settingsError || holidaysError}</div>;

  return (
    <div className="space-y-8">
      {/* Institute Settings */}
      <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-gray-700 shadow-lg">
        <h3 className="text-2xl font-bold mb-4 text-white">Institute Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">Weekend Days (comma-separated, e.g., Friday,Saturday):</label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
              value={weekendDays}
              onChange={(e) => setWeekendDays(e.target.value)}
            />
            <button
              onClick={() => handleUpdateSetting('weekend_days', weekendDays)}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Update Weekend Days
            </button>
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">1-Day Absence Escalation Threshold:</label>
            <input
              type="number"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
              value={escalation1}
              onChange={(e) => setEscalation1(e.target.value)}
            />
            <button
              onClick={() => handleUpdateSetting('escalation_1_day_threshold', escalation1)}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Update Threshold
            </button>
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">3-Day Absence Escalation Threshold:</label>
            <input
              type="number"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
              value={escalation3}
              onChange={(e) => setEscalation3(e.target.value)}
            />
            <button
              onClick={() => handleUpdateSetting('escalation_3_day_threshold', escalation3)}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Update Threshold
            </button>
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">7-Day Absence Escalation Threshold:</label>
            <input
              type="number"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
              value={escalation7}
              onChange={(e) => setEscalation7(e.target.value)}
            />
            <button
              onClick={() => handleUpdateSetting('escalation_7_day_threshold', escalation7)}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Update Threshold
            </button>
          </div>
        </div>
      </div>

      {/* Manage Holidays */}
      <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-gray-700 shadow-lg">
        <h3 className="text-2xl font-bold mb-4 text-white">Manage Holidays</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add Single Holiday */}
          <div>
            <h4 className="text-xl font-semibold mb-3 text-white">Add Single Holiday</h4>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">Holiday Name:</label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
                value={newHolidayName}
                onChange={(e) => setNewHolidayName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">Date:</label>
              <input
                type="date"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
                value={newHolidayDate}
                onChange={(e) => setNewHolidayDate(e.target.value)}
              />
            </div>
            <button
              onClick={handleAddHoliday}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Holiday
            </button>
          </div>

          {/* Add Holiday Range */}
          <div>
            <h4 className="text-xl font-semibold mb-3 text-white">Add Holiday Range</h4>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">Holiday Name:</label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
                value={newHolidayRangeName}
                onChange={(e) => setNewHolidayRangeName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">Start Date:</label>
              <input
                type="date"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
                value={newHolidayStartDate}
                onChange={(e) => setNewHolidayStartDate(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">End Date:</label>
              <input
                type="date"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
                value={newHolidayEndDate}
                onChange={(e) => setNewHolidayEndDate(e.target.value)}
              />
            </div>
            <button
              onClick={handleAddHolidayRange}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Holiday Range
            </button>
          </div>
        </div>

        {/* Existing Holidays */}
        <h4 className="text-xl font-semibold mt-8 mb-3 text-white">Existing Holidays</h4>
        {holidays && holidays.length > 0 ? (
          <ul className="divide-y divide-gray-700">
            {holidays.map(holiday => (
              <li key={holiday.id} className="py-3 flex justify-between items-center text-gray-300">
                <span>{holiday.name} ({holiday.date}) {holiday.type === 'weekend' && '(Weekend)'}</span>
                <button
                  onClick={() => handleDeleteHoliday(holiday.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No holidays configured yet.</p>
        )}
      </div>
    </div>
  );
}

export default AdminSettings;
