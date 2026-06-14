import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:8000" : ""),
  timeout: 12000,
});

const unwrap = (request) => request.then((res) => res.data);

export const getCurrentAqi = (city) =>
  unwrap(api.get("/aqi/current", { params: { city } }));

export const refreshAqi = (city) =>
  unwrap(api.post("/aqi/refresh", null, { params: { city } }));

export const getHistory = (city, limit = 72) =>
  unwrap(api.get("/aqi/history", { params: { city, limit } }));

export const getPrediction = (city, horizon_hours = 6) =>
  unwrap(api.get("/aqi/predict", { params: { city, horizon_hours } }));

export const getHealthAlert = (city, profile) =>
  unwrap(api.get("/alerts/health", { params: { city, profile } }));

export const askAssistant = (payload) =>
  unwrap(api.post("/chat/ask", payload));

export const getLocations = () =>
  unwrap(api.get("/locations"));

export default api;
