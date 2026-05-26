import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const labels = {
  pm25: "PM2.5",
  pm10: "PM10",
  co: "CO",
  no2: "NO2",
  so2: "SO2",
  o3: "O3",
};

const colors = {
  pm25: "#22D3EE",
  pm10: "#38BDF8",
  co: "#FB923C",
  no2: "#EF4444",
  so2: "#8B5CF6",
  o3: "#22C55E",
};

export default function PollutantBar({ reading }) {
  const data = reading
    ? Object.keys(labels).map((key) => ({ pollutant: labels[key], value: Number(reading[key] || 0), key }))
    : [];

  if (!data.length) {
    return (
      <div className="empty-state chart-empty">
        <strong>No pollutant readings yet</strong>
        <span>Prediction model needs more historical readings.</span>
      </div>
    );
  }

  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height={284}>
        <BarChart data={data} margin={{ left: 0, right: 8, top: 12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.16)" />
          <XAxis dataKey="pollutant" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "rgba(34,211,238,0.08)" }}
            contentStyle={{
              background: "rgba(8, 24, 39, 0.94)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
              color: "#F8FAFC",
            }}
            labelStyle={{ color: "#22D3EE" }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={800}>
            {data.map((entry) => (
              <Cell key={entry.key} fill={colors[entry.key]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
