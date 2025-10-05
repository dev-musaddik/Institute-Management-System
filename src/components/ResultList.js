import React, { useState, useEffect } from "react";
import useApi from "../hooks/useApi";
import Table from "../components/Table";

const API_URL = "http://localhost:5000/api/results";

function ResultList({ onEditResult }) {
  const { data: results, loading, error, get, del } = useApi(API_URL);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      await get('/');
    } catch (err) {
      console.error("Failed to fetch results", err);
    }
  };

  const handleDelete = async (resultId) => {
    if (window.confirm("Are you sure you want to delete this result record?")) {
      try {
        await del(`/${resultId}`);
        alert("Result record deleted successfully!");
        fetchResults();
      } catch (err) {
        alert(`Failed to delete result record: ${err.message}`);
      }
    }
  };

  const headers = [
    "ID",
    "Student Name",
    "Course Name",
    "Marks",
    "Grade",
    "Semester",
    "Actions",
  ];

  const renderResultRow = (result) => (
    <tr key={result.id} className="hover:bg-gray-800">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {result.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {result.Student
          ? `${result.Student.firstName} ${result.Student.lastName}`
          : "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {result.Course
          ? `${result.Course.courseCode} - ${result.Course.courseName}`
          : "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {result.marks}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {result.grade}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {result.semester}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onEditResult(result)}
          className="text-indigo-400 hover:text-indigo-600 mr-3"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(result.id)}
          className="text-red-400 hover:text-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  );

  if (loading)
    return <div className="text-center text-lg text-white">Loading results...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 text-lg">Error: {error}</div>
    );

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4 text-white">All Results</h3>
      <Table
        headers={headers}
        data={results}
        renderRow={renderResultRow}
        actions={["Edit", "Delete"]}
      />
    </div>
  );
}

export default ResultList;