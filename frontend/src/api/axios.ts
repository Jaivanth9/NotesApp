// src/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://notesapp1-7ty0.onrender.com/api", // ✅ backend URL
  withCredentials: true, // allow cookies
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
