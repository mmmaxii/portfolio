"use client";

import { buildConstellation, DRAW_MS } from "@/lib/constellation";
import styles from "./Constellation.module.css";

/*
 * Constelación en "M" que conecta los 6 objetos con estrellas intermedias.
 * La línea se dibuja sola (stroke-dashoffset) y las estrellas aparecen en
 * secuencia según su posición a lo largo del trazo. Brillа al pasar el mouse.
 */
export default function Constellation({ hidden }: { hidden: boolean }) {
  const { points, polyPoints } = buildConstellation();
  const stars = points.filter((p) => p.kind === "star");

  return (
    <div className={`${styles.wrap} ${hidden ? styles.hidden : ""}`}>
      <svg className={styles.svg} viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline className={styles.glow} points={polyPoints} pathLength={100} vectorEffect="non-scaling-stroke" />
        <polyline className={styles.line} points={polyPoints} pathLength={100} vectorEffect="non-scaling-stroke" />
        <polyline className={styles.hit} points={polyPoints} pathLength={100} vectorEffect="non-scaling-stroke" />
      </svg>
      {stars.map((p, i) => (
        <span
          key={i}
          className={styles.star}
          style={{
            left: `${p.x.toFixed(2)}%`,
            top: `${p.y.toFixed(2)}%`,
            animationDelay: `${Math.round(p.fraction * DRAW_MS)}ms`,
          }}
        />
      ))}
    </div>
  );
}
