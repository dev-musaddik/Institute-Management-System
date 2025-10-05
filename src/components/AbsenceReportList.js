import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import Table from './Table';
import moment from 'moment';

function AbsenceReportList() {
  const { data: reports, loading, error, get, put } = useApi('/api/absence-reports');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      await get('/');
    } catch (err) {
      console.error('Failed to fetch absence reports:', err);
    }
  };

  const handleUpdateStatus = async (reportId, newStatus) => {
    if (window.confirm(`Are you sure you want to change the status of this report to ${newStatus}?`)) {
      try {
        await put(`/${reportId}/status`, { status: newStatus });
        alert('Report status updated successfully!');
        fetchReports();
      } catch (err) {
        alert(`Failed to update report status: ${err.message}`);
      }
    }
  };

  const headers = ["ID", "Student", "Teacher", "Admin", "Reason", "Status", "Report Date", "Escalation Level", "Actions"];

  const renderReportRow = (report) => (
    <tr key={report.id} className="hover:bg-gray-800">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{report.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{report.Student ? `${report.Student.firstName} ${report.Student.lastName}` : 'N/A'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{report.Teacher ? `${report.Teacher.firstName} ${report.Teacher.lastName}` : 'N/A'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{report.Admin ? report.Admin.username : 'N/A'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{report.reason}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{report.status}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{moment(report.report_date).format('YYYY-MM-DD')}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{report.escalation_level}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {report.status === 'pending' && (
          <>
            <button
              onClick={() => handleUpdateStatus(report.id, 'approved')}
              className="text-green-400 hover:text-green-600 mr-3"
            >
              Approve
            </button>
            <button
              onClick={() => handleUpdateStatus(report.id, 'rejected')}
              className="text-red-400 hover:text-red-600"
            >
              Reject
            </button>
          </>
        )}
      </td>
    </tr>
  );

  if (loading) return <div className="text-center text-white">Loading absence reports...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4 text-white">Absence Reports</h3>
      {reports && reports.length > 0 ? (
        <Table
          headers={headers}
          data={reports}
          renderRow={renderReportRow}
        />
      ) : (
        <p className="text-gray-400">No absence reports found.</p>
      )}
    </div>
  );
}

export default AbsenceReportList;
