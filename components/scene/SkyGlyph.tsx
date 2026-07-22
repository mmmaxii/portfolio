import type { SkyKind } from "@/data/content";
import styles from "./SkyGlyph.module.css";

/*
 * Render de cada objeto astronómico. El color viene de un token CSS que se
 * aplica como `color` en el wrapper; el SVG usa currentColor + blanco + opacidad.
 * Así ningún color queda hardcodeado en el componente.
 */

interface SkyGlyphProps {
  kind: SkyKind;
  colorVar: string; // p.ej. "--sky-eta"
  size: number;
  animated?: boolean;
}

/*
 * Nota sobre las rotaciones: usamos <animateTransform> nativo de SVG en vez de
 * animar `transform` por CSS. CSS con `transform-box: view-box` en un <g>
 * anidado es inconsistente entre navegadores cuando el grupo no es simétrico
 * respecto a (50,50) (p.ej. el disco con su planeta descentrado) — el pivote
 * de rotación termina en el centroide de la caja del contenido, no en (50,50),
 * y el objeto rotante se ve descentrado respecto a la estrella/núcleo fijo.
 * SMIL rota siempre alrededor del pivote exacto declarado, sin ambigüedad.
 */
function spinProps(from: number, to: number, dur: string) {
  return { attributeName: "transform", type: "rotate" as const, from: `${from} 50 50`, to: `${to} 50 50`, dur, repeatCount: "indefinite" as const };
}

function Hypergiant({ animated }: { animated: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className={styles.svg}>
      <defs>
        <radialGradient id="hg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="22%" stopColor="currentColor" stopOpacity="0.95" />
          <stop offset="55%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hg-sp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className={styles.pulse}>
        <rect x="49.4" y="4" width="1.2" height="92" fill="url(#hg-sp)" />
        <rect x="49.4" y="4" width="1.2" height="92" fill="url(#hg-sp)" transform="rotate(90 50 50)" />
        <rect x="49.6" y="20" width="0.8" height="60" fill="url(#hg-sp)" opacity="0.5" transform="rotate(45 50 50)" />
        <rect x="49.6" y="20" width="0.8" height="60" fill="url(#hg-sp)" opacity="0.5" transform="rotate(-45 50 50)" />
      </g>
      {/* Homúnculo: lóbulos bipolares de Eta Carinae */}
      <g opacity="0.5">
        {animated && <animateTransform {...spinProps(0, 360, "90s")} />}
        <ellipse cx="50" cy="34" rx="13" ry="18" fill="currentColor" fillOpacity="0.18" />
        <ellipse cx="50" cy="66" rx="13" ry="18" fill="currentColor" fillOpacity="0.18" />
      </g>
      <circle cx="50" cy="50" r="30" fill="url(#hg)" />
      <circle cx="50" cy="50" r="5" fill="#ffffff" />
    </svg>
  );
}

function GalaxyCluster({ animated }: { animated: boolean }) {
  const galaxies = [
    { x: 50, y: 48, rx: 11, ry: 6, rot: -18, o: 0.9 },
    { x: 68, y: 60, rx: 7, ry: 4, rot: 30, o: 0.8 },
    { x: 34, y: 62, rx: 6, ry: 3.5, rot: -40, o: 0.75 },
    { x: 60, y: 32, rx: 5, ry: 3, rot: 10, o: 0.7 },
    { x: 30, y: 38, rx: 4, ry: 4, rot: 0, o: 0.6 },
    { x: 74, y: 40, rx: 3.5, ry: 2, rot: 50, o: 0.6 },
    { x: 44, y: 74, rx: 4, ry: 2.4, rot: -25, o: 0.55 },
    { x: 22, y: 54, rx: 2.6, ry: 2.6, rot: 0, o: 0.5 },
    { x: 78, y: 66, rx: 2.4, ry: 1.6, rot: 20, o: 0.5 },
  ];
  return (
    <svg viewBox="0 0 100 100" className={styles.svg}>
      <defs>
        <radialGradient id="gc-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.16" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gc-gal" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="currentColor" stopOpacity="0.8" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#gc-halo)" />
      <g>
        {animated && <animateTransform {...spinProps(0, 360, "90s")} />}
        {galaxies.map((g, i) => (
          <ellipse
            key={i}
            cx={g.x}
            cy={g.y}
            rx={g.rx}
            ry={g.ry}
            fill="url(#gc-gal)"
            opacity={g.o}
            transform={`rotate(${g.rot} ${g.x} ${g.y})`}
          />
        ))}
      </g>
    </svg>
  );
}

function ProtoDisk({ animated }: { animated: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className={styles.svg}>
      <defs>
        <radialGradient id="pd-star" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="currentColor" stopOpacity="0.85" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform="rotate(-22 50 50)">
        {animated && <animateTransform {...spinProps(-22, 338, "90s")} />}
        <ellipse cx="50" cy="50" rx="46" ry="15" fill="none" stroke="currentColor" strokeOpacity="0.7" strokeWidth="3" />
        <ellipse cx="50" cy="50" rx="37" ry="12" fill="none" stroke="currentColor" strokeOpacity="0.28" strokeWidth="2.4" />
        {/* gap donde se forma un planeta */}
        <ellipse cx="50" cy="50" rx="27" ry="8.5" fill="none" stroke="currentColor" strokeOpacity="0.75" strokeWidth="4" strokeDasharray="52 14" />
        <ellipse cx="50" cy="50" rx="16" ry="5" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="2.4" />
        <circle cx="77" cy="50" r="2.4" fill="#ffffff" />
      </g>
      <circle cx="50" cy="50" r="10" fill="url(#pd-star)" />
      <circle cx="50" cy="50" r="3.5" fill="#ffffff" />
    </svg>
  );
}

function Pulsar({ animated }: { animated: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className={styles.svg}>
      <defs>
        <radialGradient id="ps-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ps-beam" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {/* haces rotando */}
      <g>
        {animated && <animateTransform {...spinProps(0, 360, "6s")} />}
        <path d="M50 50 L36 2 L64 2 Z" fill="url(#ps-beam)" opacity="0.6" transform="rotate(180 50 50)" />
        <path d="M50 50 L36 2 L64 2 Z" fill="url(#ps-beam)" opacity="0.6" />
      </g>
      {/* anillos de emisión */}
      <circle cx="50" cy="50" r="26" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.4" />
      <circle cx="50" cy="50" r="26" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.4" strokeDasharray="3 9">
        {animated && <animateTransform {...spinProps(0, 360, "6s")} />}
      </circle>
      <circle cx="50" cy="50" r="12" fill="url(#ps-core)" className={styles.pulse} />
      <circle cx="50" cy="50" r="4.5" fill="#ffffff" />
    </svg>
  );
}

function Irregular({ animated: _animated }: { animated: boolean }) {
  const blobs = [
    { x: 44, y: 50, r: 26, o: 0.16 },
    { x: 62, y: 44, r: 18, o: 0.14 },
    { x: 34, y: 60, r: 15, o: 0.13 },
    { x: 58, y: 64, r: 12, o: 0.12 },
  ];
  const stars = [
    { x: 40, y: 48, r: 2.4 },
    { x: 56, y: 42, r: 2 },
    { x: 64, y: 54, r: 1.6 },
    { x: 34, y: 58, r: 1.8 },
    { x: 50, y: 62, r: 2.2 },
    { x: 48, y: 36, r: 1.4 },
    { x: 68, y: 46, r: 1.3 },
    { x: 30, y: 48, r: 1.2 },
    { x: 58, y: 70, r: 1.5 },
  ];
  return (
    <svg viewBox="0 0 100 100" className={styles.svg}>
      <defs>
        <radialGradient id="ir-blob" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ir-star" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="currentColor" stopOpacity="0.8" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className={styles.driftSlow}>
        {blobs.map((b, i) => (
          <circle key={i} cx={b.x} cy={b.y} r={b.r} fill="url(#ir-blob)" opacity={b.o} />
        ))}
      </g>
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="url(#ir-star)" />
      ))}
    </svg>
  );
}

function Supernova({ animated: _animated }: { animated: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className={styles.svg}>
      <defs>
        <radialGradient id="sn-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* anillo triple característico de SN 1987A */}
      <g className={styles.pulse}>
        <ellipse cx="50" cy="50" rx="40" ry="24" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="2" />
        <ellipse cx="50" cy="30" rx="18" ry="10" fill="none" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1.6" />
        <ellipse cx="50" cy="70" rx="18" ry="10" fill="none" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1.6" />
      </g>
      {/* nudos brillantes en el anillo ("collar de perlas") */}
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const cx = (50 + Math.cos(a) * 40).toFixed(2);
        const cy = (50 + Math.sin(a) * 24).toFixed(2);
        return <circle key={i} cx={cx} cy={cy} r="1.6" fill="#ffffff" opacity="0.8" />;
      })}
      <circle cx="50" cy="50" r="16" fill="url(#sn-core)" className={styles.pulse} />
      <circle cx="50" cy="50" r="4.5" fill="#ffffff" />
    </svg>
  );
}

const RENDERERS: Record<SkyKind, (props: { animated: boolean }) => React.ReactElement> = {
  hypergiant: Hypergiant,
  "galaxy-cluster": GalaxyCluster,
  "proto-disk": ProtoDisk,
  pulsar: Pulsar,
  irregular: Irregular,
  supernova: Supernova,
};

export default function SkyGlyph({ kind, colorVar, size, animated = true }: SkyGlyphProps) {
  const Render = RENDERERS[kind];
  return (
    <span
      className={`${styles.wrapper} ${animated ? "" : styles.still}`}
      style={{ width: size, height: size, color: `var(${colorVar})` }}
      aria-hidden="true"
    >
      <Render animated={animated} />
    </span>
  );
}
