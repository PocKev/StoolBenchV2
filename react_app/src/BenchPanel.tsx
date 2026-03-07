import { CSSProperties, FormEvent, useState } from "react";

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
  const wetnessFill = wetnessIndex === null ? 0 : (wetnessIndex / 3) * 100;
  const experienceFill = experienceIndex === null ? 0 : (experienceIndex / 3) * 100;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);

    if (wetnessIndex === null || experienceIndex === null) {
      return;
    }

    const stoolRecordPayload = {
      wetness_rating: RATING_VALUES[wetnessIndex],
      experience_rating: RATING_VALUES[experienceIndex],
    };

    console.log("stool_records form payload", stoolRecordPayload);
    setWetnessIndex(null);
    setExperienceIndex(null);
    setAttemptedSubmit(false);
  };

  return (
    <div className="panel">
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

        <button type="submit" className="log-button">
          <span>Log log</span>
        </button>
      </form>
    </div>
  );
}
