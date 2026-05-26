import MetricCard from "../components/MetricCard";
import PollutantBar from "../components/PollutantBar";
import TrendChart from "../components/TrendChart";

export default function History({ history }) {
  const latest = history?.readings?.at(-1);
  return (
    <div className="page-stack">
      <section className="metric-grid summary-grid">
        <MetricCard label="Highest AQI" value={history?.highest_aqi} tone="risk" />
        <MetricCard label="Lowest AQI" value={history?.lowest_aqi} />
        <MetricCard label="Average AQI" value={history?.average_aqi} />
      </section>
      <section className="split-grid">
        <article className="panel">
          <div className="section-title">
            <h2>AQI history</h2>
            <span>{history?.city || "City"}</span>
          </div>
          <TrendChart readings={history?.readings || []} />
        </article>
        <article className="panel">
          <div className="section-title">
            <h2>Pollutant comparison</h2>
            <span>Latest reading</span>
          </div>
          <PollutantBar reading={latest} />
        </article>
      </section>
      <section className="panel">
        <div className="section-title">
          <h2>Recent readings</h2>
          <span>Hourly records</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>AQI</th>
                <th>PM2.5</th>
                <th>PM10</th>
                <th>Temp</th>
                <th>Humidity</th>
              </tr>
            </thead>
            <tbody>
              {(history?.readings || []).slice(-14).reverse().map((item) => (
                <tr key={`${item.id}-${item.recorded_at}`}>
                  <td>{new Date(item.recorded_at).toLocaleString()}</td>
                  <td>{item.aqi}</td>
                  <td>{item.pm25}</td>
                  <td>{item.pm10}</td>
                  <td>{item.temperature} C</td>
                  <td>{item.humidity}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

