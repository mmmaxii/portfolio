import type { SectionId } from "@/data/content";

/*
 * Espectro de emisión sintético, estilo fósforo del visor CASA.
 * Colores 100% por variables CSS (--phosphor*), nada hardcodeado.
 * Determinista por sección (ruido con semilla) → render estable en SSR.
 */

interface SpectralLine {
  lambda: number;
  name: string;
  strength: number;
}

const LINE_SETS: Record<SectionId, SpectralLine[]> = {
  about: [
    { lambda: 4861, name: "Hβ", strength: 0.55 },
    { lambda: 6563, name: "Hα", strength: 1 },
  ],
  research: [
    { lambda: 4340, name: "Hγ", strength: 0.35 },
    { lambda: 5007, name: "[OIII]", strength: 0.9 },
    { lambda: 6563, name: "Hα", strength: 0.8 },
  ],
  projects: [
    { lambda: 4471, name: "HeI", strength: 0.4 },
    { lambda: 5876, name: "HeI", strength: 0.6 },
    { lambda: 6563, name: "Hα", strength: 0.95 },
    { lambda: 6731, name: "[SII]", strength: 0.35 },
  ],
  ai: [
    { lambda: 4686, name: "HeII", strength: 0.7 },
    { lambda: 5411, name: "HeII", strength: 0.45 },
    { lambda: 6563, name: "Hα", strength: 0.6 },
  ],
  tech: [
    { lambda: 5007, name: "[OIII]", strength: 0.7 },
    { lambda: 5876, name: "HeI", strength: 0.5 },
    { lambda: 6583, name: "[NII]", strength: 0.6 },
  ],
  contact: [
    { lambda: 4959, name: "[OIII]", strength: 0.45 },
    { lambda: 6563, name: "Hα", strength: 0.85 },
    { lambda: 7135, name: "[ArIII]", strength: 0.3 },
  ],
};

const SEEDS: Record<SectionId, number> = {
  about: 11,
  research: 23,
  projects: 37,
  ai: 47,
  tech: 53,
  contact: 71,
};

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const L_MIN = 4000;
const L_MAX = 7500;
const PLOT_W = 440;
const PLOT_H = 150;
const PAD_L = 46;
const PAD_B = 30;
const PAD_T = 12;
const W = PAD_L + PLOT_W + 14;
const H = PAD_T + PLOT_H + PAD_B;

function buildSpectrum(id: SectionId) {
  const rand = mulberry32(SEEDS[id]);
  const lines = LINE_SETS[id];
  const n = 260;
  const pts: string[] = [];
  const markers: { x: number; yTop: number; name: string }[] = [];

  const slope = 0.25 + rand() * 0.3;
  for (let i = 0; i < n; i++) {
    const frac = i / (n - 1);
    const lambda = L_MIN + frac * (L_MAX - L_MIN);
    let flux = 0.22 + slope * (1 - frac) * 0.25 + 0.05 * Math.sin(frac * 9 + SEEDS[id]);
    for (const line of lines) {
      const sigma = 26;
      flux += line.strength * 0.62 * Math.exp(-((lambda - line.lambda) ** 2) / (2 * sigma * sigma));
    }
    flux += (rand() - 0.5) * 0.045;
    const x = PAD_L + frac * PLOT_W;
    const y = PAD_T + PLOT_H - Math.min(Math.max(flux, 0.02), 1) * PLOT_H;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  for (const line of lines) {
    const frac = (line.lambda - L_MIN) / (L_MAX - L_MIN);
    const x = PAD_L + frac * PLOT_W;
    const peakFlux = 0.24 + line.strength * 0.62;
    const yTop = PAD_T + PLOT_H - Math.min(peakFlux, 1) * PLOT_H;
    markers.push({ x, yTop, name: line.name });
  }

  return { points: pts.join(" "), lines: markers };
}

const X_TICKS = [4000, 5000, 6000, 7000];
const MONO = "var(--font-mono), monospace";

export default function Spectrum({ sectionId }: { sectionId: SectionId }) {
  const { points, lines } = buildSpectrum(sectionId);
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Espectro sintético de la fuente"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <rect
        x={PAD_L}
        y={PAD_T}
        width={PLOT_W}
        height={PLOT_H}
        style={{ fill: "var(--phosphor-bg)", stroke: "var(--phosphor-grid)" }}
        strokeWidth="1"
      />
      {X_TICKS.map((t) => {
        const x = PAD_L + ((t - L_MIN) / (L_MAX - L_MIN)) * PLOT_W;
        return (
          <g key={t}>
            <line x1={x} y1={PAD_T} x2={x} y2={PAD_T + PLOT_H} style={{ stroke: "var(--phosphor-grid)" }} strokeWidth="0.6" strokeDasharray="2 4" />
            <text x={x} y={PAD_T + PLOT_H + 14} textAnchor="middle" style={{ fill: "var(--phosphor-dim)" }} fontSize="9" fontFamily={MONO}>
              {t}
            </text>
          </g>
        );
      })}
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={PAD_L}
          y1={PAD_T + PLOT_H * (1 - f)}
          x2={PAD_L + PLOT_W}
          y2={PAD_T + PLOT_H * (1 - f)}
          style={{ stroke: "var(--phosphor-grid)" }}
          strokeWidth="0.6"
          strokeDasharray="2 4"
        />
      ))}
      {lines.map((l) => (
        <g key={`${l.name}-${l.x}`}>
          <line x1={l.x} y1={l.yTop - 4} x2={l.x} y2={PAD_T + 4} style={{ stroke: "var(--phosphor-dim)" }} strokeWidth="0.7" strokeDasharray="3 3" />
          <text x={l.x + 3} y={PAD_T + 12} style={{ fill: "var(--phosphor)" }} fontSize="8.5" fontFamily={MONO}>
            {l.name}
          </text>
        </g>
      ))}
      <polyline points={points} fill="none" style={{ stroke: "var(--phosphor)" }} strokeWidth="1.2" strokeLinejoin="round" />
      <text x={PAD_L + PLOT_W / 2} y={H - 4} textAnchor="middle" style={{ fill: "var(--phosphor-dim)" }} fontSize="9.5" fontFamily={MONO}>
        λ (Å)
      </text>
      <text
        x={12}
        y={PAD_T + PLOT_H / 2}
        textAnchor="middle"
        style={{ fill: "var(--phosphor-dim)" }}
        fontSize="9.5"
        fontFamily={MONO}
        transform={`rotate(-90 12 ${PAD_T + PLOT_H / 2})`}
      >
        Fλ (norm.)
      </text>
    </svg>
  );
}
