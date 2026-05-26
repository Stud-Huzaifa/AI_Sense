import { Baby, BriefcaseBusiness, HeartPulse, PersonStanding, Shield, ShieldAlert, TriangleAlert, Wind } from "lucide-react";

const profiles = [
  ["general", "General", PersonStanding],
  ["child", "Child", Baby],
  ["elderly", "Elderly", Shield],
  ["asthma", "Asthma Patient", HeartPulse],
  ["outdoor_worker", "Outdoor Worker", BriefcaseBusiness],
  ["runner", "Runner/Cyclist", Wind],
];

const guidance = [
  ["Outdoor activity safety", "Limit long outdoor exposure when AQI rises above your comfort threshold.", Shield],
  ["Mask recommendation", "Use a fitted mask during high PM2.5 or dusty conditions.", ShieldAlert],
  ["Window ventilation advice", "Keep windows closed during unhealthy AQI periods and ventilate when AQI improves.", Wind],
  ["School and outdoor sports", "Move strenuous activities indoors for children and sensitive groups.", Baby],
];

export default function Alerts({ alert, profile, setProfile }) {
  const activeProfile = profiles.find(([id]) => id === profile);

  return (
    <div className="alerts-layout">
      <section className="panel profile-panel">
        <div className="section-title">
          <div>
            <h2>Health profile</h2>
            <span>Personalized safety recommendations</span>
          </div>
        </div>
        <div className="segmented profile-grid">
          {profiles.map(([id, label, Icon]) => (
            <button key={id} className={profile === id ? "active" : ""} onClick={() => setProfile(id)}>
              <Icon size={17} />
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="alert-card hero-alert" style={{ "--alert-color": alert?.color || "#22D3EE" }}>
        <span>{alert?.category || "Analyzing"}</span>
        <strong>{alert?.risk_level || "--"} risk</strong>
        <p>{alert?.message || "Health guidance is loading for the selected city and profile."}</p>
        <div className="severity-row">
          {["Safe", "Caution", "Unhealthy", "Critical"].map((item) => (
            <em key={item} className={alert?.risk_level?.toLowerCase()?.includes(item.toLowerCase()) ? "active" : ""}>
              {item}
            </em>
          ))}
        </div>
      </section>

      <section className="recommendation-grid">
        {guidance.map(([title, fallback, Icon], index) => (
          <article key={title} className="alert-card recommendation-card" style={{ "--alert-color": alert?.color || "#22D3EE", animationDelay: `${index * 80}ms` }}>
            <Icon size={20} />
            <span>{activeProfile?.[1] || "General"}</span>
            <strong>{title}</strong>
            <p>{alert?.precautions?.[index] || fallback}</p>
          </article>
        ))}
      </section>

      <section className="panel precautions-panel">
        <div className="section-title">
          <div>
            <h2>Sensitive group warning</h2>
            <span>{alert?.profile?.replace("_", " ") || profile}</span>
          </div>
          <TriangleAlert size={20} />
        </div>
        <ul className="precautions">
          {(alert?.precautions?.length ? alert.precautions : ["AQI recommendations will appear after data loads."]).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
