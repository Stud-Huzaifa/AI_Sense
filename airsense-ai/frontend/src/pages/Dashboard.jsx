import { Activity, CloudFog, Droplets, Flame, HeartPulse, RefreshCw, Thermometer, Waves, Wind } from "lucide-react";

import AqiBadge from "../components/AqiBadge";
import AqiGauge from "../components/AqiGauge";
import InsightPanel from "../components/InsightPanel";
import LoadingSkeleton from "../components/LoadingSkeleton";
import MetricCard from "../components/MetricCard";
import PollutantBar from "../components/PollutantBar";
import TrendChart from "../components/TrendChart";

const pollutantCards = [
  ["PM2.5", "pm25", "ug/m3", CloudFog, "Fine particle load"],
  ["PM10", "pm10", "ug/m3", CloudFog, "Dust exposure"],
  ["CO", "co", "ppm", Flame, "Combustion signal"],
  ["NO2", "no2", "ppb", Activity, "Traffic signal"],
  ["SO2", "so2", "ppb", Waves, "Fuel/industry"],
  ["O3", "o3", "ppb", Activity, "Ozone layer"],
];

export default function Dashboard({ current, history, prediction, loading, onRefresh }) {
  return (
    <div className="page-stack">
      <section className="dashboard-hero" style={{ "--aqi-color": current?.color || "#22D3EE" }}>
        <div className="dashboard-hero-copy">
          <div className="hero-kicker-row">
            <span className="eyebrow">{current?.city || "City"} air quality command center</span>
            <AqiBadge category={current?.category} color={current?.color} value={current?.aqi} />
          </div>
          <h2>Real-time pollution intelligence</h2>
          <p>{current?.recommendation || "Current AQI data is loading from the monitoring service."}</p>
          <div className="hero-meta-row">
            <small>Last updated {current ? new Date(current.recorded_at).toLocaleString() : "--"}</small>
            <small>Live WAQI station</small>
            <small>Risk level: {current?.risk_level || "--"}</small>
          </div>
        </div>
        <div className="dashboard-hero-visual">
          <AqiGauge value={current?.aqi} category={current?.category} color={current?.color} />
          <button className="icon-action" onClick={onRefresh} disabled={loading} title="Refresh AQI">
            <RefreshCw size={18} className={loading ? "spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </section>

      {loading ? (
        <LoadingSkeleton count={4} />
      ) : (
        <section className="metric-grid weather-metrics">
          <MetricCard label="Health risk" value={current?.risk_level} tone="risk" icon={HeartPulse} status="Personalized" trend="up" />
          <MetricCard label="Temperature" value={current?.temperature} unit="C" icon={Thermometer} status="Weather input" trend="up" />
          <MetricCard label="Humidity" value={current?.humidity} unit="%" icon={Droplets} status="Moisture factor" trend="up" />
          <MetricCard label="Wind speed" value={current?.wind_speed} unit="km/h" icon={Wind} status="Dispersion" trend="down" />
        </section>
      )}

      <section className="metric-grid pollutant-metrics">
        {pollutantCards.map(([label, key, unit, Icon, status], index) => (
          <MetricCard
            key={key}
            label={label}
            value={current?.[key]}
            unit={unit}
            icon={Icon}
            status={status}
            trend={index % 3 === 1 ? "down" : "up"}
          />
        ))}
      </section>

      <InsightPanel current={current} history={history} prediction={prediction} />

      <section className="dashboard-grid">
        <article className="panel chart-card wide">
          <div className="section-title">
            <div>
              <h2>AQI trend</h2>
              <span>Last {history?.readings?.length || 0} readings</span>
            </div>
          </div>
          <TrendChart readings={history?.readings || []} color={current?.color || "#22D3EE"} />
        </article>

        <article className="panel chart-card">
          <div className="section-title">
            <div>
              <h2>Pollutant comparison</h2>
              <span>Current concentration</span>
            </div>
          </div>
          <PollutantBar reading={current} />
        </article>

        <article className="panel prediction-card">
          <div className="section-title">
            <div>
              <h2>Prediction</h2>
              <span>{prediction?.horizon_hours || 6}-hour horizon</span>
            </div>
            <AqiBadge category={prediction?.category} color={prediction?.color} value={prediction?.predicted_aqi} />
          </div>
          <strong>{prediction?.predicted_aqi ?? "--"}</strong>
          <p>{prediction?.recommendation || "Forecast will appear after the prediction model responds."}</p>
          <div className="confidence compact">
            <span>Confidence</span>
            <div>
              <i style={{ width: `${Math.round((prediction?.confidence_level || 0) * 100)}%` }} />
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
