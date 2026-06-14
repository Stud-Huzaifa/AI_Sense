import { Award, Factory, Leaf } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import AqiBadge from "../components/AqiBadge";

export default function CityComparison({ current, readings = [], loading = false }) {
  const rows = readings.length
    ? readings
    : current
      ? [{ city: current.city, country: current.country, aqi: current.aqi, category: current.category, color: current.color }]
      : [];
  const sorted = rows.slice().sort((a, b) => a.aqi - b.aqi);
  const cleanest = sorted[0];
  const polluted = sorted.at(-1);
  const average = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.aqi, 0) / rows.length) : null;

  return (
    <div className="page-stack">
      <section className="metric-grid comparison-summary">
        <article className="summary-card good">
          <Leaf size={20} />
          <span>Cleanest city</span>
          <strong>{cleanest?.city || "--"}</strong>
          <small>AQI {cleanest?.aqi ?? "--"}</small>
        </article>
        <article className="summary-card danger">
          <Factory size={20} />
          <span>Most polluted</span>
          <strong>{polluted?.city || "--"}</strong>
          <small>AQI {polluted?.aqi ?? "--"}</small>
        </article>
        <article className="summary-card ai">
          <Award size={20} />
          <span>Average AQI</span>
          <strong>{average ?? "--"}</strong>
          <small>{rows.length} live station(s)</small>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel chart-card wide">
          <div className="section-title">
            <div>
              <h2>City AQI comparison</h2>
              <span>{loading ? "Refreshing live stations" : "Ranking by live station response"}</span>
            </div>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={rows} margin={{ left: 0, right: 8, top: 12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.16)" />
                <XAxis dataKey="city" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "rgba(8,24,39,.94)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8 }}
                  labelStyle={{ color: "#22D3EE" }}
                />
                <Bar dataKey="aqi" radius={[8, 8, 0, 0]}>
                  {rows.map((row) => (
                    <Cell key={row.city} fill={row.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel ranking-panel">
          <div className="section-title">
            <div>
              <h2>Ranking table</h2>
              <span>Cleanest to highest risk</span>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>City</th>
                  <th>AQI</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((row, index) => (
                  <tr key={row.city}>
                    <td>#{index + 1}</td>
                    <td>{row.city}</td>
                    <td>{row.aqi}</td>
                    <td>
                      <AqiBadge category={row.category} color={row.color} value={row.aqi} />
                    </td>
                  </tr>
                ))}
                {!sorted.length && (
                  <tr>
                    <td colSpan="4">{loading ? "Loading live AQI data..." : "Live AQI data will appear after the backend responds."}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}
