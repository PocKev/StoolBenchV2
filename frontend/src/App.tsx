import { useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8000";

type HealthStatus = "idle" | "ok" | "error";

export default function App() {
  const [status, setStatus] = useState<HealthStatus>("idle");
  const [message, setMessage] = useState("");

  const checkHealth = async () => {
    setStatus("idle");
    setMessage("Checking backend health...");

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
  };

  return (
    <div className="app">
      <h1>StoolBenchV2</h1>
      <p>A @pockev app</p>

      <button onClick={checkHealth}>Check Backend Health</button>

      {message && (
        <div className={`banner ${status}`}>
          {message}
        </div>
      )}
    </div>
  );
}