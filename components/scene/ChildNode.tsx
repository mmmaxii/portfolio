"use client";

import type { SkyChild } from "@/data/content";
import styles from "./ChildNode.module.css";

interface ChildNodeProps {
  child: SkyChild;
  colorVar: string;
  angle: number; // radianes, posición en el anillo
  radius: number; // en vmin
  delay: number;
  onOpen: () => void;
}

export default function ChildNode({ child, colorVar, angle, radius, delay, onOpen }: ChildNodeProps) {
  const x = (radius * Math.cos(angle)).toFixed(2);
  const y = (radius * Math.sin(angle)).toFixed(2);
  return (
    <button
      type="button"
      className={styles.child}
      style={{
        left: `calc(50% + ${x}vmin)`,
        top: `calc(50% + ${y}vmin)`,
        color: `var(${colorVar})`,
        animationDelay: `${delay}s`,
      }}
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={child.label}
    >
      <span className={styles.orbit} aria-hidden="true" />
      <span className={styles.star} aria-hidden="true">
        <span className={styles.point} />
      </span>
      <span className={styles.tag}>
        <span className={styles.label}>{child.label}</span>
        {child.sublabel && <span className={styles.sub}>{child.sublabel}</span>}
      </span>
    </button>
  );
}
