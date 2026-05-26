import { useEffect, useState } from "react";

import { getAqiMeta } from "./aqi";

export default function AqiGauge({ value, category, color, label = "Current Air Quality Index", size = "default" }) {
  const numeric = Number.isFinite(Number(value)) ? Number(value) : 0;
  const [displayValue, setDisplayValue] = useState(0);
  const percent = Math.max(0, Math.min(100, (numeric / 500) * 100));
  const meta = getAqiMeta(numeric, category, color);

  useEffect(() => {
    let frame;
    const start = performance.now();
    const duration = 900;

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(numeric * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [numeric]);

  return (
    <div
      className={`aqi-gauge ${size === "large" ? "large" : ""}`}
      style={{
        "--gauge-color": meta.color,
        "--gauge-value": `${percent}%`,
      }}
      aria-label={`${label}: ${numeric || "unknown"} ${meta.label}`}
    >
      <div className="aqi-gauge-inner">
        <span>{label}</span>
        <strong>{value == null ? "--" : displayValue}</strong>
        <small>{meta.label}</small>
      </div>
    </div>
  );
}
