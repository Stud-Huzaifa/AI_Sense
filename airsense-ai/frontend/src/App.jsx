import { Suspense, lazy, useEffect, useState } from "react";

import { askAssistant, getCurrentAqi, getHealthAlert, getHistory, getLocations, getPrediction, refreshAqi } from "./api/client";
import Layout from "./components/Layout";
import LoadingSkeleton from "./components/LoadingSkeleton";

const About = lazy(() => import("./pages/About"));
const Alerts = lazy(() => import("./pages/Alerts"));
const Assistant = lazy(() => import("./pages/Assistant"));
const CityComparison = lazy(() => import("./pages/CityComparison"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const History = lazy(() => import("./pages/History"));
const Landing = lazy(() => import("./pages/Landing"));
const MapPage = lazy(() => import("./pages/MapPage"));
const Predictions = lazy(() => import("./pages/Predictions"));
const Reports = lazy(() => import("./pages/Reports"));
const Settings = lazy(() => import("./pages/Settings"));

export default function App() {
  const [page, setPage] = useState("landing");
  const [city, setCity] = useState("Karachi");
  const [profile, setProfile] = useState("general");
  const [horizon, setHorizon] = useState(6);
  const [locations, setLocations] = useState([]);
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [alert, setAlert] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCityData = async (selectedCity = city) => {
    setLoading(true);
    setError("");
    try {
      const [currentData, historyData, predictionData, alertData] = await Promise.all([
        getCurrentAqi(selectedCity),
        getHistory(selectedCity, 72),
        getPrediction(selectedCity, horizon),
        getHealthAlert(selectedCity, profile),
      ]);
      setCurrent(currentData);
      setHistory(historyData);
      setPrediction(predictionData);
      setAlert(alertData);
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to load AQI data. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocations().then(setLocations).catch(() => setLocations([]));
  }, []);

  useEffect(() => {
    loadCityData(city);
  }, [city, profile]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await refreshAqi(city);
      setCurrent(data);
      const historyData = await getHistory(city, 72);
      setHistory(historyData);
    } finally {
      setLoading(false);
    }
  };

  const refreshPrediction = async () => {
    const data = await getPrediction(city, horizon);
    setPrediction(data);
  };

  const handleAsk = async (question) => {
    const response = await askAssistant({ question, city, profile });
    setMessages((items) => [...items, response]);
  };

  const pages = {
    landing: <Landing current={current} setPage={setPage} />,
    dashboard: <Dashboard current={current} history={history} prediction={prediction} loading={loading} onRefresh={handleRefresh} />,
    history: <History history={history} />,
    predictions: (
      <Predictions
        prediction={prediction}
        current={current}
        horizon={horizon}
        setHorizon={setHorizon}
        refreshPrediction={refreshPrediction}
      />
    ),
    map: <MapPage current={current} locations={locations} />,
    alerts: <Alerts alert={alert} profile={profile} setProfile={setProfile} />,
    assistant: <Assistant messages={messages} onAsk={handleAsk} current={current} />,
    comparison: <CityComparison current={current} locations={locations} />,
    reports: <Reports current={current} history={history} prediction={prediction} />,
    settings: <Settings city={city} locations={locations} profile={profile} horizon={horizon} />,
    about: <About />,
  };

  return (
    <Layout page={page} setPage={setPage} city={city} setCity={setCity} locations={locations}>
      {error && (
        <div className="error-banner" role="status">
          Live AQI data is temporarily unavailable. Showing demo environmental data when available.
          <span>{error}</span>
        </div>
      )}
      <Suspense fallback={<LoadingSkeleton count={6} />}>{pages[page]}</Suspense>
    </Layout>
  );
}
