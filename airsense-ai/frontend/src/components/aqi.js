export const AQI_SCALE = [
  { max: 50, label: "Good", color: "#22C55E", tone: "good" },
  { max: 100, label: "Moderate", color: "#FACC15", tone: "moderate" },
  { max: 150, label: "Unhealthy for Sensitive Groups", color: "#FB923C", tone: "sensitive" },
  { max: 200, label: "Unhealthy", color: "#EF4444", tone: "unhealthy" },
  { max: 300, label: "Very Unhealthy", color: "#8B5CF6", tone: "very-unhealthy" },
  { max: Infinity, label: "Hazardous", color: "#7F1D1D", tone: "hazardous" },
];

export function getAqiMeta(value, fallbackCategory, fallbackColor) {
  const numeric = Number(value);
  const meta = AQI_SCALE.find((item) => numeric <= item.max) || AQI_SCALE[0];
  return {
    ...meta,
    label: fallbackCategory || meta.label,
    color: fallbackColor || meta.color,
  };
}

export function formatValue(value, fallback = "--") {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return fallback;
  return Number(value) % 1 === 0 ? Number(value).toString() : Number(value).toFixed(1);
}

export function citySeed(city = "Karachi", base = 82) {
  const code = city.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return base + (code % 110);
}
