import { CSSProperties, FormEvent, useEffect, useRef, useState } from "react";

const API_URL = "http://localhost:8000";
const DEFAULT_USER_ID = 1;
const RATING_VALUES = [0, 0.33, 0.67, 1] as const;

const WETNESS_LABELS = [
  "Bricks",
  "Playdough",
  "Sopping Sponge",
  "Coffee on Tap",
] as const;

const EXPERIENCE_LABELS = [
  "Unsatisfying",
  "Obligatory",
  "Alleviating",
  "Rejuvenating",
] as const;

export default function BenchPanel() {
  const [wetnessIndex, setWetnessIndex] = useState<number | null>(null);
  const [experienceIndex, setExperienceIndex] = useState<number | null>(null);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccessBubble, setShowSuccessBubble] = useState(false);
  const successTimerRef = useRef<number | null>(null);
  const wetnessFill = wetnessIndex === null ? 0 : (wetnessIndex / 3) * 100;
  const experienceFill = experienceIndex === null ? 0 : (experienceIndex / 3) * 100;

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    setSubmitError(null);

    if (wetnessIndex === null || experienceIndex === null) {
      return;
    }

    const stoolRecordPayload = {
      wetness: RATING_VALUES[wetnessIndex],
      experience: RATING_VALUES[experienceIndex],
    };

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/${DEFAULT_USER_ID}/stool`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stoolRecordPayload),
      });

      if (!response.ok) {
        let errorMessage = "Failed to log stool record.";
        try {
          const data = await response.json();
          if (typeof data?.message === "string") {
            errorMessage = data.message;
          }
        } catch {
          // Keep default message if response is not JSON
        }
        throw new Error(errorMessage);
      }

      setWetnessIndex(null);
      setExperienceIndex(null);
      setAttemptedSubmit(false);
      setShowSuccessBubble(true);
      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current);
      }
      successTimerRef.current = window.setTimeout(() => {
        setShowSuccessBubble(false);
      }, 1800);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to log stool record.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="panel">
      {showSuccessBubble && <div className="success-bubble">success</div>}
      <h2>Log Stool Record</h2>

      <form className="stool-form" onSubmit={handleSubmit}>
        <label className="field" htmlFor="wetness-rating">
          <span className="field-title">Wetness</span>
          <div className="log-slider-wrap">
            <input
              id="wetness-rating"
              name="wetness_rating"
              type="range"
              className="log-slider"
              min={0}
              max={3}
              step={1}
              value={wetnessIndex ?? 0}
              style={{ "--fill": `${wetnessFill}%` } as CSSProperties}
              onPointerDown={() => {
                if (wetnessIndex === null) setWetnessIndex(0);
              }}
              onChange={(e) => setWetnessIndex(Number(e.target.value))}
              aria-invalid={attemptedSubmit && wetnessIndex === null}
            />
            <span className={`log-slider-label ${wetnessIndex !== null ? "active" : ""}`}>
              {wetnessIndex === null ? "Not set" : WETNESS_LABELS[wetnessIndex]}
            </span>
          </div>
          {attemptedSubmit && wetnessIndex === null && (
            <span className="field-error">Wetness is required.</span>
          )}
        </label>

        <label className="field" htmlFor="experience-rating">
          <span className="field-title">Experience</span>
          <div className="log-slider-wrap">
            <input
              id="experience-rating"
              name="experience_rating"
              type="range"
              className="log-slider"
              min={0}
              max={3}
              step={1}
              value={experienceIndex ?? 0}
              style={{ "--fill": `${experienceFill}%` } as CSSProperties}
              onPointerDown={() => {
                if (experienceIndex === null) setExperienceIndex(0);
              }}
              onChange={(e) => setExperienceIndex(Number(e.target.value))}
              aria-invalid={attemptedSubmit && experienceIndex === null}
            />
            <span className={`log-slider-label ${experienceIndex !== null ? "active" : ""}`}>
              {experienceIndex === null ? "Not set" : EXPERIENCE_LABELS[experienceIndex]}
            </span>
          </div>
          {attemptedSubmit && experienceIndex === null && (
            <span className="field-error">Experience is required.</span>
          )}
        </label>

        <button type="submit" className="log-button" disabled={isSubmitting}>
          <span>{isSubmitting ? "Logging..." : "Log log"}</span>
        </button>
        {submitError && <span className="field-error">{submitError}</span>}
      </form>
    </div>
  );
}
