import { Brain, Clock, ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";

function getTrend(readings = []) {
  if (readings.length < 2) {
    return { label: "Collecting live history", detail: "Refresh AQI over time to build a stronger live trend.", icon: Clock, tone: "info" };
  }
  const first = readings[0].aqi;
  const latest = readings.at(-1).aqi;
  const change = latest - first;
  if (change >= 15) return { label: "AQI is rising", detail: `Up ${change} points across available readings.`, icon: TrendingUp, tone: "danger" };
  if (change <= -15) return { label: "AQI is improving", detail: `Down ${Math.abs(change)} points across available readings.`, icon: TrendingDown, tone: "good" };
  return { label: "AQI is stable", detail: "No sharp movement across available readings.", icon: Clock, tone: "info" };
}

function strongestPollutant(current) {
  if (!current) return { label: "Waiting for station data", detail: "Live pollutant values will appear after the backend responds." };
  const values = [
    ["PM2.5", current.pm25, "fine particle exposure"],
    ["PM10", current.pm10, "road dust and coarse particles"],
    ["CO", current.co, "combustion activity"],
    ["NO2", current.no2, "traffic emissions"],
    ["SO2", current.so2, "industrial or fuel burning"],
    ["O3", current.o3, "photochemical ozone risk"],
  ].sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0));
  const top = values[0];
  return { label: `${top[0]} is dominant`, detail: `${top[1] ?? "--"} now, linked with ${top[2]}.` };
}

export default function InsightPanel({ current, history, prediction }) {
  const trend = getTrend(history?.readings || []);
  const TrendIcon = trend.icon;
  const pollutant = strongestPollutant(current);
  const forecast = prediction
    ? `${prediction.predicted_aqi} AQI in ${prediction.horizon_hours}h, ${prediction.category}.`
    : "Forecast will appear when the ML endpoint responds.";

  return (
    <section className="insight-grid">
      <article className={`insight-card ${trend.tone}`}>
        <TrendIcon size={20} />
        <div>
          <strong>{trend.label}</strong>
          <span>{trend.detail}</span>
        </div>
      </article>
      <article className="insight-card ai">
        <Brain size={20} />
        <div>
          <strong>{pollutant.label}</strong>
          <span>{pollutant.detail}</span>
        </div>
      </article>
      <article className="insight-card good">
        <ShieldCheck size={20} />
        <div>
          <strong>Predictive analysis</strong>
          <span>{forecast}</span>
        </div>
      </article>
    </section>
  );
}
