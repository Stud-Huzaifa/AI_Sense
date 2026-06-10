import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:8000" : ""),
  timeout: 12000,
});

const cityMeta = {
  Karachi: ["Pakistan", 24.8607, 67.0011, 155],
  Lahore: ["Pakistan", 31.5204, 74.3587, 180],
  Islamabad: ["Pakistan", 33.6844, 73.0479, 92],
  Peshawar: ["Pakistan", 34.0151, 71.5249, 140],
  Quetta: ["Pakistan", 30.1798, 66.975, 120],
  Delhi: ["India", 28.7041, 77.1025, 190],
  London: ["United Kingdom", 51.5072, -0.1276, 58],
  "New York": ["United States", 40.7128, -74.006, 64],
};

function classifyAqi(aqi) {
  if (aqi <= 50) return ["Good", "#22c55e", "Low", "Air quality is good. Outdoor activity is safe."];
  if (aqi <= 100) return ["Moderate", "#facc15", "Moderate", "Sensitive people should watch symptoms during long outdoor activity."];
  if (aqi <= 150) return ["Unhealthy for Sensitive Groups", "#fb923c", "Elevated", "Sensitive groups should reduce prolonged outdoor exertion."];
  if (aqi <= 200) return ["Unhealthy", "#ef4444", "High", "Avoid outdoor exercise and reduce prolonged outdoor exposure."];
  if (aqi <= 300) return ["Very Unhealthy", "#8b5cf6", "Very High", "Stay indoors where possible and use filtered air."];
  return ["Hazardous", "#7f1d1d", "Critical", "Avoid all outdoor activity and follow public health guidance."];
}

function seed(city, date) {
  const raw = `${city}-${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}-${date.getUTCHours()}`;
  return raw.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function demoReading(city = "Karachi", hoursAgo = 0, id = 1) {
  const now = new Date();
  now.setUTCMinutes(0, 0, 0);
  now.setUTCHours(now.getUTCHours() - hoursAgo);
  const [country, latitude, longitude, base] = cityMeta[city] || cityMeta.Karachi;
  const wave = Math.sin((now.getUTCHours() - 7) / 24 * Math.PI * 2);
  const noise = (seed(city, now) % 35) - 17;
  const aqi = Math.max(22, Math.min(340, Math.round(base + wave * 22 + noise)));
  const [category, color, risk_level, recommendation] = classifyAqi(aqi);

  return {
    id,
    city,
    country,
    latitude,
    longitude,
    aqi,
    pm25: Math.max(5, Number((aqi * 0.42 + noise / 3).toFixed(1))),
    pm10: Math.max(10, Number((aqi * 0.7 + noise / 2).toFixed(1))),
    co: Math.max(0.1, Number((aqi / 95).toFixed(2))),
    no2: Math.max(2, Number((aqi * 0.18).toFixed(1))),
    so2: Math.max(1, Number((aqi * 0.08).toFixed(1))),
    o3: Math.max(4, Number((38 + wave * 16).toFixed(1))),
    temperature: Number((26 + Math.sin(now.getUTCHours() / 24 * Math.PI * 2) * 7).toFixed(1)),
    humidity: Math.max(20, Math.min(95, Number((58 - wave * 10).toFixed(1)))),
    wind_speed: Math.max(1, Number((9 - aqi / 70).toFixed(1))),
    source: "demo",
    recorded_at: now.toISOString(),
    created_at: new Date().toISOString(),
    category,
    color,
    risk_level,
    recommendation,
  };
}

function demoHistory(city, limit = 72) {
  const readings = Array.from({ length: limit }, (_, index) => demoReading(city, limit - index - 1, index + 1));
  const values = readings.map((item) => item.aqi);
  return {
    city,
    limit,
    readings,
    highest_aqi: Math.max(...values),
    lowest_aqi: Math.min(...values),
    average_aqi: Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1)),
  };
}

function demoPrediction(city, horizon_hours = 6) {
  const current = demoReading(city);
  const predicted_aqi = Math.max(0, Math.min(500, Math.round(current.aqi + horizon_hours * 1.8 - current.wind_speed * 1.2)));
  const [category, color, risk_level, recommendation] = classifyAqi(predicted_aqi);
  return {
    city,
    horizon_hours,
    predicted_aqi,
    category,
    color,
    risk_level,
    confidence_level: 0.82,
    recommendation,
  };
}

function demoAlert(city, profile = "general") {
  const current = demoReading(city);
  return {
    city,
    profile,
    aqi: current.aqi,
    category: current.category,
    color: current.color,
    risk_level: current.risk_level,
    message: `${profile.replace("_", " ")} guidance for ${city}: ${current.recommendation}`,
    precautions: [
      "Reduce prolonged outdoor exposure during peak pollution hours.",
      "Use a fitted mask if you must travel outside.",
      "Keep windows closed while AQI is elevated.",
      "Move intense exercise or sports indoors until conditions improve.",
    ],
  };
}

function fallback(label, factory) {
  return (error) => {
    console.warn(`Using frontend demo data for ${label}:`, error?.message || error);
    return factory();
  };
}

export const getCurrentAqi = (city) =>
  api.get("/aqi/current", { params: { city } }).then((res) => res.data).catch(fallback("current AQI", () => demoReading(city)));

export const refreshAqi = (city) =>
  api.post("/aqi/refresh", null, { params: { city } }).then((res) => res.data).catch(fallback("refresh AQI", () => demoReading(city)));

export const getHistory = (city, limit = 72) =>
  api.get("/aqi/history", { params: { city, limit } }).then((res) => res.data).catch(fallback("history", () => demoHistory(city, limit)));

export const getPrediction = (city, horizon_hours = 6) =>
  api.get("/aqi/predict", { params: { city, horizon_hours } }).then((res) => res.data).catch(fallback("prediction", () => demoPrediction(city, horizon_hours)));

export const getHealthAlert = (city, profile) =>
  api.get("/alerts/health", { params: { city, profile } }).then((res) => res.data).catch(fallback("health alert", () => demoAlert(city, profile)));

export const askAssistant = (payload) =>
  api.post("/chat/ask", payload).then((res) => res.data).catch(fallback("assistant", () => ({
    city: payload.city,
    question: payload.question,
    answer: `Demo assistant: ${demoReading(payload.city).recommendation}`,
    aqi: demoReading(payload.city).aqi,
    category: demoReading(payload.city).category,
    risk_level: demoReading(payload.city).risk_level,
    insights: ["Frontend demo mode is active because the API is unavailable.", "AQI values are generated for preview."],
    suggestions: ["Open Dashboard", "Check Predictions", "Review Health Alerts"],
    dominant_pollutants: [],
  })));

export const getLocations = () =>
  api.get("/locations").then((res) => res.data).catch(fallback("locations", () =>
    Object.entries(cityMeta).map(([city, [country, latitude, longitude]], index) => ({ id: index + 1, city, country, latitude, longitude }))
  ));

export default api;
