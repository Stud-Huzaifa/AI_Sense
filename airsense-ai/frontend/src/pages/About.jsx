export default function About() {
  return (
    <section className="panel about-panel">
      <div className="section-title">
        <h2>About AirSense AI</h2>
        <span>Full-stack environmental intelligence</span>
      </div>
      <p>
        AirSense AI combines FastAPI, SQLAlchemy, SQLite, demo or WAQI data, a Random Forest AQI prediction pipeline,
        React dashboards, Recharts, Leaflet maps, and a rule-based assistant.
      </p>
      <div className="about-grid">
        <article>
          <strong>Backend</strong>
          <span>FastAPI APIs, health rules, database models, demo seeding, live WAQI mode.</span>
        </article>
        <article>
          <strong>Machine learning</strong>
          <span>Feature engineering, lag values, Random Forest Regressor, Joblib artifacts.</span>
        </article>
        <article>
          <strong>Frontend</strong>
          <span>Responsive dashboard, trends, maps, predictions, alerts, and assistant.</span>
        </article>
      </div>
    </section>
  );
}

