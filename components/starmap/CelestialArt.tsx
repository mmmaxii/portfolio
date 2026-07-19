import type { CelestialKind } from "@/data/content";
import styles from "./CelestialArt.module.css";

interface CelestialArtProps {
  kind: CelestialKind;
  size?: number;
}

function Planet({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <radialGradient id="planet-body" cx="35%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#9fd8ff" />
          <stop offset="45%" stopColor="#3f6fd8" />
          <stop offset="100%" stopColor="#101a45" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="52" rx="40" ry="11" fill="none" stroke="#7ce7ff" strokeOpacity="0.35" strokeWidth="3" transform="rotate(-18 50 52)" />
      <circle cx="50" cy="50" r="26" fill="url(#planet-body)" />
      <ellipse cx="50" cy="52" rx="40" ry="11" fill="none" stroke="#a78bfa" strokeOpacity="0.55" strokeWidth="2" strokeDasharray="40 32" transform="rotate(-18 50 52)" />
      <circle cx="41" cy="42" r="5" fill="#cfeaff" fillOpacity="0.25" />
    </svg>
  );
}

function SpiralGalaxy({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" className={styles.spin}>
      <defs>
        <radialGradient id="galaxy-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e8ecf8" />
          <stop offset="40%" stopColor="#a78bfa" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M50 50 C 68 42, 88 52, 84 72 C 80 88, 62 92, 50 86"
        fill="none"
        stroke="#7ce7ff"
        strokeOpacity="0.6"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M50 50 C 32 58, 12 48, 16 28 C 20 12, 38 8, 50 14"
        fill="none"
        stroke="#6ea8ff"
        strokeOpacity="0.6"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="50" cy="50" r="16" fill="url(#galaxy-core)" />
      <circle cx="50" cy="50" r="5" fill="#e8ecf8" />
    </svg>
  );
}

function ProtoDisk({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <radialGradient id="disk-star" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff7e0" />
          <stop offset="60%" stopColor="#ffd9a0" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffd9a0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform="rotate(-20 50 50)">
        <ellipse cx="50" cy="50" rx="46" ry="14" fill="none" stroke="#6ea8ff" strokeOpacity="0.7" strokeWidth="3.5" />
        <ellipse cx="50" cy="50" rx="36" ry="10.5" fill="none" stroke="#7ce7ff" strokeOpacity="0.3" strokeWidth="2.5" />
        <ellipse cx="50" cy="50" rx="22" ry="6.5" fill="none" stroke="#a78bfa" strokeOpacity="0.75" strokeWidth="3.5" />
        <ellipse cx="50" cy="50" rx="13" ry="4" fill="none" stroke="#cfeaff" strokeOpacity="0.5" strokeWidth="2.5" />
      </g>
      <circle cx="50" cy="50" r="9" fill="url(#disk-star)" />
      <circle cx="50" cy="50" r="3.5" fill="#fff7e0" />
    </svg>
  );
}

function StarCluster({ size }: { size: number }) {
  const stars: { cx: number; cy: number; r: number; delay: string }[] = [
    { cx: 30, cy: 34, r: 5, delay: "0s" },
    { cx: 56, cy: 22, r: 3.5, delay: "0.4s" },
    { cx: 74, cy: 40, r: 4.5, delay: "0.9s" },
    { cx: 44, cy: 52, r: 6, delay: "1.3s" },
    { cx: 66, cy: 64, r: 3, delay: "0.2s" },
    { cx: 28, cy: 66, r: 4, delay: "1.7s" },
    { cx: 50, cy: 78, r: 3.5, delay: "0.7s" },
    { cx: 80, cy: 76, r: 2.5, delay: "1.1s" },
    { cx: 18, cy: 46, r: 2.5, delay: "1.5s" },
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.cx}
          cy={s.cy}
          r={s.r}
          fill={i % 2 === 0 ? "#7ce7ff" : "#cfeaff"}
          className={styles.twinkleStar}
          style={{ animationDelay: s.delay }}
        />
      ))}
    </svg>
  );
}

function Pulsar({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <radialGradient id="pulsar-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e8ecf8" />
          <stop offset="50%" stopColor="#7ce7ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7ce7ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className={styles.pulse}>
        <path d="M50 38 34 6h32Z" fill="#7ce7ff" fillOpacity="0.3" />
        <path d="M50 62 34 94h32Z" fill="#7ce7ff" fillOpacity="0.3" />
      </g>
      <path d="M14 40 a40 40 0 0 1 8 -14 M8 52 a46 46 0 0 1 6 -20" stroke="#a78bfa" strokeOpacity="0.6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M86 60 a40 40 0 0 1 -8 14 M92 48 a46 46 0 0 1 -6 20" stroke="#a78bfa" strokeOpacity="0.6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="50" r="14" fill="url(#pulsar-core)" />
      <circle cx="50" cy="50" r="6" fill="#e8ecf8" className={styles.pulse} />
    </svg>
  );
}

export default function CelestialArt({ kind, size = 90 }: CelestialArtProps) {
  switch (kind) {
    case "planet":
      return <Planet size={size} />;
    case "spiral-galaxy":
      return <SpiralGalaxy size={size} />;
    case "proto-disk":
      return <ProtoDisk size={size} />;
    case "star-cluster":
      return <StarCluster size={size} />;
    case "pulsar":
      return <Pulsar size={size} />;
  }
}
