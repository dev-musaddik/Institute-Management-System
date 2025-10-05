import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../components/Table";
import ResultForm from "../components/ResultForm";
import { useAuth } from "../context/AuthContext";

const RESULTS_API_URL = "http://localhost:5000/api/results";
const COURSES_API_URL = "http://localhost:5000/api/courses";

function TeacherResultList({ teacherId }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (teacherId) fetchTeacherCourses();
  }, [teacherId]);

  useEffect(() => {
    if (selectedCourse) fetchResultsForCourse(selectedCourse);
  }, [selectedCourse]);

  const fetchTeacherCourses = async () => {
    try {
      const response = await axios.get(
        `${COURSES_API_URL}?teacherId=${teacherId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourses(response.data);
      if (response.data.length > 0) setSelectedCourse(response.data[0].id);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchResultsForCourse = async (courseId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${RESULTS_API_URL}?courseId=${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch results");
    } finally {
      setLoading(false);
    }
  };

  const handleAddResultClick = () => {
    setEditingResult(null);
    setShowForm(true);
  };
  const handleEditResult = (record) => {
    setEditingResult(record);
    setShowForm(true);
  };
  const handleFormSave = () => {
    setShowForm(false);
    setEditingResult(null);
    fetchResultsForCourse(selectedCourse);
  };
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingResult(null);
  };

  const handleDelete = async (resultId) => {
    if (window.confirm("Are you sure you want to delete this result record?")) {
      try {
        await axios.delete(`${RESULTS_API_URL}/${resultId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchResultsForCourse(selectedCourse);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to delete result record"
        );
      }
    }
  };

  const headers = ["ID", "Student Name", "Marks", "Grade", "Semester"];
  const renderResultRow = (record) => (
    <tr key={record.id} className="hover:bg-gray-800">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {record.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {record.Student
          ? `${record.Student.firstName} ${record.Student.lastName}`
          : "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {record.marks}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {record.grade}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {record.semester}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => handleEditResult(record)}
          className="text-indigo-400 hover:text-indigo-600 mr-3"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(record.id)}
          className="text-red-400 hover:text-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  );

  if (loading)
    return <div className="text-center text-lg">Loading results...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 text-lg">Error: {error}</div>
    );

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">Manage Results</h3>
      <div className="mb-4">
        <label htmlFor="courseSelect" className="block text-sm font-bold mb-2">
          Select Course:
        </label>
        <select
          id="courseSelect"
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">-- Select a Course --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.courseCode} - {course.courseName}
            </option>
          ))}
        </select>
      </div>
      {selectedCourse &&
        (showForm ? (
          <ResultForm
            resultToEdit={editingResult}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        ) : (
          <>
            <div className="mb-6 flex justify-end">
              <button
                onClick={handleAddResultClick}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add New Result Record
              </button>
            </div>
            <Table
              headers={headers}
              data={results}
              renderRow={renderResultRow}
              actions={["Edit", "Delete"]}
            />
          </>
        ))}
      {!selectedCourse && (
        <p className="text-gray-400 mt-4">
          Please select a course to manage results.
        </p>
      )}
    </div>
  );
}

export default TeacherResultList;
