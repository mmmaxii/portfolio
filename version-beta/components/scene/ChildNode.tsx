"use client";

import type { SkyChild } from "@/data/content";
import styles from "./ChildNode.module.css";

interface ChildNodeProps {
  child: SkyChild;
  colorVar: string;
  x: number; // % del viewport
  y: number; // % del viewport
  appearDelay: number; // ms — pequeño escalonado entre sub-portales
  onOpen: () => void;
}

export default function ChildNode({ child, colorVar, x, y, appearDelay, onOpen }: ChildNodeProps) {
  return (
    <button
      type="button"
      className={styles.child}
      style={
        {
          left: `${x.toFixed(2)}%`,
          top: `${y.toFixed(2)}%`,
          color: `var(${colorVar})`,
          "--appear-delay": `${appearDelay}ms`,
        } as React.CSSProperties
      }
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
