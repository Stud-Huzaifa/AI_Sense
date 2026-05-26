import { Area, AreaChart, CartesianGrid, ReferenceArea, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function TrendChart({ readings = [], color = "#22D3EE", dataKey = "aqi" }) {
  const data = readings.map((item) => ({
    time: new Date(item.recorded_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    aqi: Number(item.aqi || 0),
    pm25: Number(item.pm25 || 0),
    pm10: Number(item.pm10 || 0),
  }));
  const latest = data.at(-1)?.[dataKey];

  if (!data.length) {
    return (
      <div className="empty-state chart-empty">
        <strong>No data available for this city yet</strong>
        <span>Try refreshing AQI data or select another station.</span>
      </div>
    );
  }

  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height={284}>
        <AreaChart data={data} margin={{ left: 0, right: 8, top: 12, bottom: 0 }}>
          <defs>
            <linearGradient id={`trendFill-${dataKey}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.42} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <ReferenceArea y1={0} y2={50} fill="#22C55E" fillOpacity={0.06} />
          <ReferenceArea y1={51} y2={100} fill="#FACC15" fillOpacity={0.06} />
          <ReferenceArea y1={101} y2={150} fill="#FB923C" fillOpacity={0.06} />
          <ReferenceArea y1={151} y2={250} fill="#EF4444" fillOpacity={0.05} />
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.18)" />
          <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#94A3B8" }} minTickGap={24} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "rgba(8, 24, 39, 0.94)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
              color: "#F8FAFC",
            }}
            labelStyle={{ color: "#22D3EE" }}
          />
          {latest ? <ReferenceLine y={latest} stroke={color} strokeDasharray="4 4" /> : null}
          <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} fill={`url(#trendFill-${dataKey})`} animationDuration={900} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
