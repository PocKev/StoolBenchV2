import { useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8000";

type HealthStatus = "idle" | "ok" | "error";

export default function App() {
  const [status, setStatus] = useState<HealthStatus>("idle");
  const [message, setMessage] = useState("");
  const [showBanner, setShowBanner] = useState(false);

  const checkHealth = async () => {
    setStatus("idle");
    setMessage("Checking backend health...");
    setShowBanner(true);

    try {
      const res = await fetch(`${API_URL}/api/health`);
      if (!res.ok) throw new Error();

      const data = await res.json();
      setStatus("ok");
      setMessage(data.status ?? "healthy");
    } catch {
      setStatus("error");
      setMessage("Backend unreachable");
    }

    // Auto-hide banner after 3s
    setTimeout(() => setShowBanner(false), 3000);
  };

  return (
    <div className="page">
      {/* Top bar */}
      <div className="top-right">
        <button onClick={checkHealth}>Ping</button>
      </div>

      {/* Banner */}
      {showBanner && (
        <div className={`banner ${status}`}>
          {message}
        </div>
      )}

      {/* Centered content */}
      <main className="center">
        <h1>StoolBenchV2</h1>
        <p className="subtitle">A @pockev app</p>
      </main>
    </div>
  );
}