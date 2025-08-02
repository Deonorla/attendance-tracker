import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // your express backend
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
