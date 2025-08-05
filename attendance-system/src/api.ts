import axios from "axios";

// Declare module augmentation for AxiosInstance
declare module "axios" {
  interface AxiosInstance {
    clearAuth: () => void;
  }
}

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

// Add method to clear authorization
API.clearAuth = () => {
  delete API.defaults.headers.common["Authorization"];
};

export default API;
