import { useState } from "react";
import "./App.css";
import BenchPanel from "./BenchPanel";

const API_URL = "http://localhost:8000";

type HealthStatus = "idle" | "ok" | "error";

export default function App() {
  const [status, setStatus] = useState<HealthStatus>("idle");
  const [message, setMessage] = useState("");
  const [showBanner, setShowBanner] = useState(false);
  const [entered, setEntered] = useState(false);

  const checkHealth = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
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

    setTimeout(() => setShowBanner(false), 3000);
  };

  return (
    <div className="viewport">
      {/* Top-right Ping (always visible) */}
      <div className="top-right">
        <button onClick={checkHealth}>Ping</button>
      </div>

      {/* Banner */}
      {showBanner && (
        <div className={`banner ${status}`}>
          {message}
        </div>
      )}

      {/* Welcome screen */}
      <section
        className={`welcome ${entered ? "lift" : ""}`}
        onClick={() => setEntered(true)}
      >
        <main className="center">
          <h1>StoolBenchV2</h1>
          <p className="subtitle">A @pockev app</p>
        </main>
      </section>

      {/* Bench panel underneath */}
      <section className="bench">
        <BenchPanel />
      </section>
    </div>
  );
}