import { ArrowRight, Brain, HeartPulse, Leaf, Radar, ShieldCheck, Sparkles, Wind } from "lucide-react";

import AqiBadge from "../components/AqiBadge";
import AqiGauge from "../components/AqiGauge";
import { formatValue } from "../components/aqi";

const chips = ["PM2.5", "PM10", "CO", "NO2", "SO2", "O3"];

export default function Landing({ current, setPage }) {
  return (
    <section className="landing-grid">
      <div className="hero-copy">
        <div className="hero-kicker-row">
          <span className="eyebrow">AI Air Pollution Intelligence System</span>
          <span className="live-pill">Live AQI model</span>
        </div>
        <h2>Breathe Smarter with AI-Powered Air Intelligence</h2>
        <p>
          Monitor real-time AQI, predict pollution trends, detect health risks, and make safer outdoor decisions with
          intelligent environmental analytics.
        </p>
        <div className="hero-actions">
          <button className="primary-action" onClick={() => setPage("dashboard")}>
            Open Dashboard <ArrowRight size={18} />
          </button>
          <button className="secondary-action" onClick={() => setPage("predictions")}>
            View AQI Prediction <Radar size={18} />
          </button>
        </div>
        <div className="pollutant-chips" aria-label="Tracked pollutants">
          {chips.map((chip) => (
            <span key={chip}>{chip}</span>
          ))}
        </div>
      </div>

      <div className="hero-visual" style={{ "--aqi-color": current?.color || "#22D3EE" }}>
        <div className="orb-field" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <AqiGauge value={current?.aqi} category={current?.category} color={current?.color} size="large" />
        <div className="live-preview-card">
          <div>
            <span>{current?.city || "Karachi"}</span>
            <strong>Live city AQI</strong>
          </div>
          <AqiBadge category={current?.category} color={current?.color} value={current?.aqi} />
        </div>
        <div className="health-warning-card">
          <HeartPulse size={18} />
          <p>{current?.recommendation || "Analyzing outdoor safety and health exposure risk."}</p>
        </div>
      </div>

      <div className="feature-strip">
        <article>
          <Brain size={20} />
          <strong>AI forecasting</strong>
          <span>Predict pollution risk using historical AQI, weather, and pollutant signals.</span>
        </article>
        <article>
          <ShieldCheck size={20} />
          <strong>Health guidance</strong>
          <span>Personalized recommendations for sensitive groups and outdoor activity.</span>
        </article>
        <article>
          <Wind size={20} />
          <strong>Smart-city monitoring</strong>
          <span>Map stations, compare cities, and inspect pollutant contribution patterns.</span>
        </article>
      </div>

      <div className="hero-stat-row">
        <span>
          <Leaf size={16} /> PM2.5 {formatValue(current?.pm25)} ug/m3
        </span>
        <span>
          <Wind size={16} /> Wind {formatValue(current?.wind_speed)} km/h
        </span>
        <span>
          <Sparkles size={16} /> Humidity {formatValue(current?.humidity)}%
        </span>
      </div>
    </section>
  );
}
