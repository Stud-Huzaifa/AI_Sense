import { getAqiMeta } from "./aqi";

export default function AqiBadge({ category, color, value }) {
  const meta = getAqiMeta(value, category, color);

  return (
    <span className="aqi-badge" style={{ "--badge-color": meta.color }}>
      <i aria-hidden="true" />
      {meta.label}
    </span>
  );
}
