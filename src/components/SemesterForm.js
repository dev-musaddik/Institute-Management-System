// src/components/SemesterForm.jsx
import React, { useState, useEffect } from "react";
import { semesterService } from "../api/services/semesterService";

function SemesterForm({ semesterToEdit, onSave, onCancel }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (semesterToEdit) {
      setName(semesterToEdit.name);
    } else {
      setName("");
    }
  }, [semesterToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (semesterToEdit) {
        await semesterService.update(semesterToEdit.id, { name });
        alert("Semester updated successfully!");
      } else {
        await semesterService.create({ name });
        alert("Semester created successfully!");
      }
      onSave();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Operation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-white/5 backdrop-blur-md p-6 rounded-xl border border-gray-700 shadow-lg">
      <h3 className="text-2xl font-bold mb-4 text-white">
        {semesterToEdit ? "Edit Semester" : "Add New Semester"}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-300 text-sm font-bold mb-2"
          >
            Semester Name:
          </label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 bg-opacity-50 border-gray-700 text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
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

export default SemesterForm;
