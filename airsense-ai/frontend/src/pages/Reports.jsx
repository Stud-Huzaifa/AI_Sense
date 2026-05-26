import { Clock, CloudFog, FileText, ShieldCheck, Sparkles, TimerReset } from "lucide-react";

import AqiGauge from "../components/AqiGauge";
import MetricCard from "../components/MetricCard";
import TrendChart from "../components/TrendChart";

function hourLabel(reading) {
  return reading ? new Date(reading.recorded_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--";
}

export default function Reports({ current, history, prediction }) {
  const readings = history?.readings || [];
  const mostPolluted = readings.slice().sort((a, b) => b.aqi - a.aqi)[0];
  const safest = readings.slice().sort((a, b) => a.aqi - b.aqi)[0];
  const dominant = current
    ? [
        ["PM2.5", current.pm25],
        ["PM10", current.pm10],
        ["CO", current.co],
        ["NO2", current.no2],
        ["SO2", current.so2],
        ["O3", current.o3],
      ].sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0))[0]
    : ["--", "--"];

  return (
    <div className="page-stack">
      <section className="report-hero panel">
        <div>
          <span className="eyebrow">Environmental analytics report</span>
          <h2>Weekly AQI intelligence summary</h2>
          <p>
            Air quality was worse during evening hours, possibly due to traffic density and low wind movement.
          </p>
        </div>
        <AqiGauge value={history?.average_aqi || current?.aqi} category="Environmental score" color={current?.color || "#22D3EE"} label="Avg AQI" />
      </section>

      <section className="metric-grid">
        <MetricCard label="Most polluted hour" value={hourLabel(mostPolluted)} icon={Clock} status={`AQI ${mostPolluted?.aqi ?? "--"}`} />
        <MetricCard label="Safest outdoor time" value={hourLabel(safest)} icon={ShieldCheck} status={`AQI ${safest?.aqi ?? "--"}`} trend="down" />
        <MetricCard label="Dominant pollutant" value={dominant[0]} icon={CloudFog} status={`${dominant[1]} current`} />
        <MetricCard label="Forecast risk" value={prediction?.risk_level || "--"} icon={Sparkles} status={`${prediction?.horizon_hours || 6}h outlook`} />
      </section>

      <section className="dashboard-grid">
        <article className="panel chart-card wide">
          <div className="section-title">
            <div>
              <h2>Trend insights</h2>
              <span>AQI movement across recent readings</span>
            </div>
          </div>
          <TrendChart readings={readings} color={current?.color || "#22D3EE"} />
        </article>

        <article className="panel timeline-panel">
          <div className="section-title">
            <div>
              <h2>Insight timeline</h2>
              <span>Operational summary</span>
            </div>
            <FileText size={20} />
          </div>
          {[
            ["Morning", "Dispersion improved as wind increased across the city."],
            ["Afternoon", "Ozone and temperature signals became more visible."],
            ["Evening", "Fine particle risk increased around traffic-heavy hours."],
          ].map(([label, detail]) => (
            <article key={label}>
              <TimerReset size={16} />
              <div>
                <strong>{label}</strong>
                <span>{detail}</span>
              </div>
            </article>
          ))}
        </article>
      </section>
    </div>
  );
}
