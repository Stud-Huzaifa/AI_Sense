import { Bell, Database, MapPin, Moon, ShieldCheck } from "lucide-react";

export default function Settings({ city, locations = [], profile, horizon }) {
  return (
    <div className="settings-grid">
      <section className="panel">
        <div className="section-title">
          <div>
            <h2>Application settings</h2>
            <span>Configured for live WAQI operations</span>
          </div>
        </div>
        <div className="settings-list">
          <article>
            <MapPin size={18} />
            <div>
              <strong>Default city</strong>
              <span>{city}</span>
            </div>
          </article>
          <article>
            <ShieldCheck size={18} />
            <div>
              <strong>Health profile</strong>
              <span>{profile?.replace("_", " ")}</span>
            </div>
          </article>
          <article>
            <Database size={18} />
            <div>
              <strong>Station count</strong>
              <span>{locations.length || 1} monitored location(s)</span>
            </div>
          </article>
          <article>
            <Bell size={18} />
            <div>
              <strong>Prediction horizon</strong>
              <span>{horizon} hours</span>
            </div>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="section-title">
          <div>
            <h2>Interface</h2>
            <span>Premium dark AQI theme</span>
          </div>
          <Moon size={20} />
        </div>
        <div className="theme-swatches" aria-label="AQI colors">
          {["#22D3EE", "#22C55E", "#FACC15", "#FB923C", "#EF4444", "#8B5CF6"].map((color) => (
            <span key={color} style={{ background: color }} />
          ))}
        </div>
      </section>
    </div>
  );
}
