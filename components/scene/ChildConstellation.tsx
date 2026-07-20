"use client";

import { useEffect, useState } from "react";
import styles from "./ChildConstellation.module.css";

/*
 * Radios que conectan el objeto central con cada sub-portal, dibujados en
 * secuencia (sincronizados con la aparición de los hijos). Se calcula en px
 * porque los hijos se ubican con vmin.
 */
export default function ChildConstellation({
  count,
  radiusVmin,
  colorVar,
}: {
  count: number;
  radiusVmin: number;
  colorVar: string;
}) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!size) return null;
  const { w, h } = size;
  const cx = w / 2;
  const cy = h / 2;
  const r = (radiusVmin / 100) * Math.min(w, h);

  const spokes = Array.from({ length: count }).map((_, i) => {
    const a = -Math.PI / 2 + (i / count) * Math.PI * 2;
    return { x: (cx + r * Math.cos(a)).toFixed(1), y: (cy + r * Math.sin(a)).toFixed(1), delay: 0.12 + 0.05 * i };
  });

  return (
    <svg className={styles.svg} width={w} height={h} style={{ color: `var(${colorVar})` }} aria-hidden="true">
      {spokes.map((s, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={s.x}
          y2={s.y}
          className={styles.spoke}
          style={{ animationDelay: `${s.delay}s` }}
        />
      ))}
    </svg>
  );
}
