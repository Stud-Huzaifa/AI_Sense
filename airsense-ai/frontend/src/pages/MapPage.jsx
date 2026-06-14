import "leaflet/dist/leaflet.css";

import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip } from "react-leaflet";
import { MapPin, Search, ShieldAlert } from "lucide-react";

import AqiBadge from "../components/AqiBadge";

export default function MapPage({ current, locations = [] }) {
  const liveStation = current
    ? {
        id: current.id || current.city,
        city: current.city,
        country: current.country,
        latitude: current.latitude,
        longitude: current.longitude,
        aqi: current.aqi,
        category: current.category,
        color: current.color,
      }
    : null;
  const stations = liveStation ? [liveStation] : [];
  const center = current?.latitude && current?.longitude ? [current.latitude, current.longitude] : [24.8607, 67.0011];
  const hotspots = stations.slice().sort((a, b) => b.aqi - a.aqi).slice(0, 3);

  return (
    <section className="map-experience">
      <div className="map-toolbar panel">
        <div>
          <span className="eyebrow">Smart-city monitoring map</span>
          <h2>{current?.city || "Karachi"} station network</h2>
        </div>
        <label className="map-search">
          <Search size={16} />
          <input placeholder="Search station..." aria-label="Search station" />
        </label>
      </div>

      <div className="map-shell">
        <MapContainer key={current?.city || "map"} center={center} zoom={10} scrollWheelZoom className="leaflet-map">
          <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {stations.map((station) => (
            <CircleMarker
              key={station.id || station.city}
              center={[station.latitude, station.longitude]}
              radius={24}
              pathOptions={{ color: station.color, fillColor: station.color, fillOpacity: 0.72, weight: 3 }}
              className="pulse-marker"
            >
              <Tooltip>{station.city} AQI {station.aqi}</Tooltip>
              <Popup>
                <strong>{station.city}</strong>
                <br />
                AQI: {station.aqi} ({station.category})
                <br />
                PM2.5: {current.pm25} | PM10: {current.pm10}
              </Popup>
            </CircleMarker>
          ))}
          {!stations.length && current && (
            <CircleMarker center={center} radius={24} pathOptions={{ color: current.color, fillColor: current.color, fillOpacity: 0.75 }}>
              <Popup>
                <strong>{current.city}</strong>
                <br />
                AQI: {current.aqi} ({current.category})
              </Popup>
            </CircleMarker>
          )}
        </MapContainer>

        <aside className="map-floating-panel">
          <div className="selected-station">
            <MapPin size={20} />
            <div>
              <span>Selected station</span>
              <strong>{current?.city || "Karachi"}</strong>
            </div>
            <AqiBadge category={current?.category} color={current?.color} value={current?.aqi} />
          </div>
          <div className="hotspot-list">
            <h3>Hotspots</h3>
            {hotspots.map((station) => (
              <article key={station.city}>
                <span style={{ "--dot": station.color }} />
                <div>
                  <strong>{station.city}</strong>
                  <small>AQI {station.aqi}</small>
                </div>
              </article>
            ))}
            {!hotspots.length && <small>Live station data will appear after the backend responds.</small>}
          </div>
          <div className="legend">
            <h3>Risk zones</h3>
            {["Good", "Moderate", "Unhealthy", "Very Unhealthy"].map((label, index) => (
              <span key={label} className={`legend-${index}`}>
                {label}
              </span>
            ))}
          </div>
          <div className="map-alert">
            <ShieldAlert size={18} />
            Current city highlighted with a larger monitoring pulse.
          </div>
        </aside>
      </div>
    </section>
  );
}
