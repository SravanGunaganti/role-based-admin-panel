import axios from "axios";
// baseURL: import.meta.env.VITE_API_URL || 'http://192.168.25.186:5000/api',

const api = axios.create({
  baseURL: "http://192.168.25.186:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
