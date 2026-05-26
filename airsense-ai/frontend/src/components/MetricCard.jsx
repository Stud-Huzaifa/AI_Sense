import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { formatValue } from "./aqi";

export default function MetricCard({ label, value, unit, tone = "default", icon: Icon, status = "Stable", trend = "up" }) {
  const TrendIcon = trend === "down" ? ArrowDownRight : ArrowUpRight;

  return (
    <article className={`metric-card ${tone}`}>
      <div className="metric-topline">
        <span>{label}</span>
        {Icon && (
          <i>
            <Icon size={18} />
          </i>
        )}
      </div>
      <strong>
        {formatValue(value)}
        {unit && <small>{unit}</small>}
      </strong>
      <div className="metric-footer">
        <em>{status}</em>
        <span className={`trend ${trend}`}>
          <TrendIcon size={14} />
          {trend === "down" ? "Improving" : "Rising"}
        </span>
      </div>
      <div className="sparkline" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
    </article>
  );
}
