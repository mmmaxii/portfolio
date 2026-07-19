"use client";

import type { CelestialSection } from "@/data/content";
import CelestialArt from "./CelestialArt";
import styles from "./CelestialObject.module.css";

interface CelestialObjectProps {
  section: CelestialSection;
  index: number;
  onOpen: () => void;
}

export default function CelestialObject({ section, index, onOpen }: CelestialObjectProps) {
  return (
    <button
      type="button"
      className={styles.object}
      style={{
        top: section.position.top,
        left: section.position.left,
        animationDelay: `${index * 1.1}s`,
      }}
      onClick={onOpen}
      aria-haspopup="dialog"
    >
      <span className={styles.art}>
        <CelestialArt kind={section.object} size={96} />
      </span>
      <span className={styles.label}>{section.label}</span>
      <span className={styles.tagline}>{section.tagline}</span>
    </button>
  );
}
