"use client";

import { useState } from "react";
import {
  ALPHAS,
  alphaDisplay,
  buildGifSrc,
  gifDescription,
  gifScenarios,
  gifTitle,
  type Alpha,
  type GifScenario,
} from "@/data/content";
import styles from "./GifViewer.module.css";

export default function GifViewer() {
  const [scenario, setScenario] = useState<GifScenario>("base");
  const [alpha, setAlpha] = useState<Alpha>("0.01");
  const [loading, setLoading] = useState(false);

  const src = buildGifSrc(scenario, alpha);

  function changeScenario(next: GifScenario) {
    setScenario(next);
    setLoading(true);
  }

  function changeAlpha(next: Alpha) {
    setAlpha(next);
    if (scenario !== "sinusoidal") setLoading(true);
  }

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label htmlFor="scenario-select" className={styles.label}>
            Escenario (10 Myr):
          </label>
          <select
            id="scenario-select"
            className={styles.select}
            value={scenario}
            onChange={(e) => changeScenario(e.target.value as GifScenario)}
          >
            {gifScenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.controlGroup}>
          <span className={styles.label}>Parámetro Alpha (α):</span>
          <div className={styles.alphaButtons} role="group" aria-label="Parámetro alpha">
            {ALPHAS.map((a) => (
              <button
                key={a}
                type="button"
                className={`${styles.alphaBtn} ${a === alpha ? styles.alphaBtnActive : ""}`}
                aria-pressed={a === alpha}
                disabled={scenario === "sinusoidal"}
                onClick={() => changeAlpha(a)}
              >
                {alphaDisplay[a]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.viewer}>
        {loading && <div className={styles.loading}>Cargando simulación…</div>}
        <img
          key={src}
          src={src}
          alt={gifTitle(scenario, alpha)}
          className={styles.gif}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
        <div className={styles.overlay}>
          <h4 className={styles.overlayTitle}>{gifTitle(scenario, alpha)}</h4>
          <p className={styles.overlayDesc}>{gifDescription(scenario, alpha)}</p>
        </div>
      </div>
    </div>
  );
}
