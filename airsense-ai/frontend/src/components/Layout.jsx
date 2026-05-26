import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  Gauge,
  Home,
  Leaf,
  Map,
  Menu,
  Moon,
  Radar,
  Search,
  Settings,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

const nav = [
  { id: "landing", label: "Home", icon: Home },
  { id: "dashboard", label: "Dashboard", icon: Gauge },
  { id: "predictions", label: "Predictions", icon: Radar },
  { id: "map", label: "Map", icon: Map },
  { id: "alerts", label: "Health Alerts", icon: Bell },
  { id: "assistant", label: "AI Assistant", icon: Bot },
  { id: "comparison", label: "City Comparison", icon: BarChart3 },
  { id: "reports", label: "Reports", icon: Activity },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Layout({ page, setPage, children, city, setCity, locations = [] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const title = nav.find((item) => item.id === page)?.label || "Dashboard";

  const goTo = (id) => {
    setPage(id);
    setMobileOpen(false);
  };

  return (
    <div className="app-shell">
      <div className="ambient-bg" aria-hidden="true">
        <span className="air-wave wave-one" />
        <span className="air-wave wave-two" />
        <span className="air-wave wave-three" />
        <span className="particle p1" />
        <span className="particle p2" />
        <span className="particle p3" />
        <span className="city-grid" />
      </div>

      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <Leaf size={20} />
            <Sparkles size={13} />
          </span>
          <div>
            <strong>AirSense AI</strong>
            <small>Air Pollution Intelligence</small>
          </div>
        </div>

        <nav className="side-nav" aria-label="Main navigation">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} className={page === item.id ? "active" : ""} onClick={() => goTo(item.id)}>
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-status">
          <span>Network</span>
          <strong>Live sensors online</strong>
          <small>AI model confidence tracking enabled</small>
        </div>
      </aside>

      <main className={`main-panel page-${page}`}>
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen((value) => !value)} aria-label="Toggle navigation">
            {mobileOpen ? <X size={19} /> : <Menu size={19} />}
          </button>

          <div className="topbar-title">
            <span className="eyebrow">Smart city air quality platform</span>
            <h1>{title}</h1>
          </div>

          <div className="topbar-controls">
            <label className="search-field">
              <Search size={16} />
              <input placeholder="Search stations, pollutants..." aria-label="Search stations and pollutants" />
            </label>

            <label className="city-select">
              <span>City</span>
              <select value={city} onChange={(event) => setCity(event.target.value)} aria-label="Select city">
                {locations.map((location) => (
                  <option key={location.id || location.city} value={location.city}>
                    {location.city}
                  </option>
                ))}
                {!locations.length && <option value={city}>{city}</option>}
              </select>
            </label>

            <button className="top-icon" aria-label="Notifications">
              <Bell size={17} />
            </button>
            <button className="top-icon" aria-label="Theme mode">
              <Moon size={17} />
            </button>
            <button className="avatar-button" aria-label="Profile">
              <User size={17} />
            </button>
          </div>
        </header>

        <div className="content-frame">{children}</div>
      </main>
    </div>
  );
}
