import { Brain, Gauge, Radar, Sparkles } from "lucide-react";

import AqiBadge from "../components/AqiBadge";
import AqiGauge from "../components/AqiGauge";
import TrendChart from "../components/TrendChart";

const horizons = [1, 6, 12, 24];

const contributions = [
  ["PM2.5", "High impact", 88, "#22D3EE"],
  ["Humidity", "Medium impact", 64, "#38BDF8"],
  ["Wind Speed", "Medium impact", 56, "#22C55E"],
  ["Temperature", "Low impact", 34, "#FACC15"],
];

export default function Predictions({ prediction, current, horizon, setHorizon, refreshPrediction }) {
  const forecastReadings = Array.from({ length: 8 }).map((_, index) => ({
    recorded_at: new Date(Date.now() + index * 60 * 60 * 1000).toISOString(),
    aqi: Math.round((current?.aqi || prediction?.predicted_aqi || 90) + index * ((prediction?.predicted_aqi || 105) - (current?.aqi || 90)) / 7),
  }));

  return (
    <div className="prediction-layout">
      <section className="forecast-panel">
        <div className="forecast-icon">
          <Gauge size={28} />
        </div>
        <span className="eyebrow">AI forecast engine</span>
        <AqiGauge value={prediction?.predicted_aqi} category={prediction?.category} color={prediction?.color || "#22D3EE"} label="Predicted AQI" />
        <AqiBadge category={prediction?.category} color={prediction?.color} value={prediction?.predicted_aqi} />
        <p>{prediction?.recommendation || "Prediction will appear after the backend returns a forecast."}</p>
      </section>

      <section className="panel control-panel">
        <div className="section-title">
          <div>
            <h2>Prediction horizon</h2>
            <span>{current?.city || "Selected city"}</span>
          </div>
        </div>
        <div className="segmented horizon-buttons">
          {horizons.map((hours) => (
            <button key={hours} className={horizon === hours ? "active" : ""} onClick={() => setHorizon(hours)}>
              {hours}h
            </button>
          ))}
        </div>
        <button className="primary-action compact" onClick={refreshPrediction}>
          Update forecast <Radar size={17} />
        </button>
        <div className="confidence">
          <span>Confidence score</span>
          <div>
            <i style={{ width: `${Math.round((prediction?.confidence_level || 0) * 100)}%` }} />
          </div>
          <strong>{Math.round((prediction?.confidence_level || 0) * 100)}%</strong>
        </div>
      </section>

      <section className="panel chart-card wide">
        <div className="section-title">
          <div>
            <h2>Forecast line</h2>
            <span>Projected AQI trajectory</span>
          </div>
        </div>
        <TrendChart readings={forecastReadings} color={prediction?.color || "#8B5CF6"} />
      </section>

      <section className="panel ai-explanation">
        <div className="section-title">
          <div>
            <h2>AI Forecast Explanation</h2>
            <span>Feature contribution analysis</span>
          </div>
          <Brain size={20} />
        </div>
        <p>
          PM2.5, low wind speed, and high humidity are contributing to increased AQI risk in the next few hours.
        </p>
        <div className="contribution-list">
          {contributions.map(([name, impact, value, color]) => (
            <div className="contribution-row" key={name} style={{ "--bar-color": color }}>
              <span>{name}</span>
              <strong>{impact}</strong>
              <div>
                <i style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="insight-grid prediction-insights">
        <article className="insight-card ai">
          <Sparkles size={20} />
          <div>
            <strong>Future health risk</strong>
            <span>{prediction?.risk_level || "Model is estimating sensitive group exposure."}</span>
          </div>
        </article>
        <article className="insight-card danger">
          <Radar size={20} />
          <div>
            <strong>Predicted category</strong>
            <span>{prediction?.category || "Awaiting forecast category."}</span>
          </div>
        </article>
      </section>
    </div>
  );
}
