// src/api/services/semesterService.js
import { api } from "../api";

export const semesterService = {
  getAll: () => api.get("/semesters"),
  getById: (id) => api.get(`/semesters/${id}`),
  create: (data) => api.post("/semesters", data),
  update: (id, data) => api.put(`/semesters/${id}`, data),
  delete: (id) => api.delete(`/semesters/${id}`),
};
