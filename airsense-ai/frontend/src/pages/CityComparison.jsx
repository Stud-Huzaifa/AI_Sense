import { Award, Factory, Leaf } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import AqiBadge from "../components/AqiBadge";
import { citySeed, getAqiMeta } from "../components/aqi";

export default function CityComparison({ current, locations = [] }) {
  const rows = (locations.length ? locations : [{ city: current?.city || "Karachi", country: "Pakistan" }]).map((location) => {
    const aqi = current?.city === location.city ? current?.aqi || 0 : citySeed(location.city, 44);
    const meta = getAqiMeta(aqi, current?.city === location.city ? current?.category : null, current?.city === location.city ? current?.color : null);
    return { ...location, aqi, category: meta.label, color: meta.color };
  });
  const sorted = rows.slice().sort((a, b) => a.aqi - b.aqi);
  const cleanest = sorted[0];
  const polluted = sorted.at(-1);
  const average = Math.round(rows.reduce((sum, row) => sum + row.aqi, 0) / Math.max(rows.length, 1));

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
          <strong>{average || "--"}</strong>
          <small>Across monitored cities</small>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel chart-card wide">
          <div className="section-title">
            <div>
              <h2>City AQI comparison</h2>
              <span>Ranking by monitored station</span>
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
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}
