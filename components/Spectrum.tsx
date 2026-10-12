"use client";

import { useRef, useState } from "react";
import { SOURCES, SPECTRUM } from "@/data/content";
import { wavelengthRGB } from "@/lib/sky";

/*
 * Espectro de emisión de herramientas. Arriba, el perfil 1D (flujo vs λ) con identificación de
 * líneas; abajo, el espectro 2D tal como se vería en el detector. Cada herramienta es una línea;
 * su intensidad es el número de proyectos o cursos donde aparece.
 */

const W = 1200;
const X0 = 48;
const X1 = 1176;
const L0 = 392;
const L1 = 724;
const BASE = 300; // y del continuo
const PEAK = 128; // alto máximo de una línea
const STRIP_T = 336;
const STRIP_B = 380;
const BANDS_Y = 404;
const H = 446;

const xOf = (l: number) => X0 + ((l - L0) / (L1 - L0)) * (X1 - X0);
const lOf = (x: number) => L0 + ((x - X0) / (X1 - X0)) * (L1 - L0);

interface Line {
  key: string;
  name: string;
  band: string;
  bandName: string;
  lambda: number;
  x: number;
  sources: string[];
  amp: number; // 0..1
  rgb: string;
}

// Ruido determinista (siempre el mismo dibujo).
function noise(i: number) {
  const s = Math.sin(i * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

// Cada banda ocupa en λ un ancho proporcional a su número de herramientas.
const GAP = 6;
const TOTAL = SPECTRUM.reduce((n, b) => n + b.tools.length, 0);
const PER = (L1 - L0 - 12 - GAP * (SPECTRUM.length - 1)) / TOTAL;
const RANGES = (() => {
  let cur = L0 + 6;
  return SPECTRUM.map((b) => {
    const from = cur;
    const to = from + b.tools.length * PER;
    cur = to + GAP;
    return { id: b.id, name: b.name, from, to };
  });
})();

function buildLines(): Line[] {
  const max = Math.max(...SPECTRUM.flatMap((b) => b.tools.map((t) => t.sources.length)));
  let k = 0;
  return SPECTRUM.flatMap((b, bi) =>
    b.tools.map((t, i) => {
      // Posición dentro de la banda con un leve desorden, como en un espectro real.
      const jitter = (noise(++k * 7.31) - 0.5) * PER * 0.5;
      const lambda = Math.round((RANGES[bi].from + (i + 0.5) * PER + jitter) * 10) / 10;
      const [r, g, bl] = wavelengthRGB(lambda);
      return {
        key: `${b.id}-${t.name}`,
        name: t.name,
        band: b.id,
        bandName: b.name,
        lambda,
        x: xOf(lambda),
        sources: t.sources,
        amp: 0.14 + 0.86 * (t.sources.length / max),
        rgb: `rgb(${r},${g},${bl})`,
      };
    }),
  );
}

function profilePath(lines: Line[]) {
  const sigma = 2.3;
  let d = "";
  for (let x = X0; x <= X1; x += 1) {
    const l = lOf(x);
    let v = 0.03 + 0.05 * Math.exp(-(((l - 470) / 160) ** 2)) + 0.008 * Math.sin(l / 9) + (noise(x) - 0.5) * 0.022;
    for (const ln of lines) {
      const dx = x - ln.x;
      if (Math.abs(dx) < 12) v += ln.amp * Math.exp(-0.5 * (dx / sigma) ** 2);
    }
    const y = BASE - v * PEAK;
    d += `${x === X0 ? "M" : "L"}${x},${y.toFixed(1)}`;
  }
  return d;
}

const LINES = buildLines();
const PATH = profilePath(LINES);

export default function Spectrum() {
  const lines = LINES;
  const path = PATH;
  const [hover, setHover] = useState<Line | null>(null);
  const [locked, setLocked] = useState<Line | null>(null);
  const [band, setBand] = useState<string | null>(null);
  const [cursor, setCursor] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const current = hover ?? locked;
  const inFocus = (ln: Line) => !band || ln.band === band;
  const labelled = (ln: Line) => (band ? ln.band === band : ln.sources.length >= 3) || ln === current;

  function svgX(e: React.PointerEvent<SVGSVGElement> | React.MouseEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const m = svg.getScreenCTM();
    return m ? pt.matrixTransform(m.inverse()).x : null;
  }

  function nearest(x: number) {
    let best: Line | null = null;
    let dist = 9;
    for (const ln of lines) {
      if (!inFocus(ln)) continue;
      const d = Math.abs(ln.x - x);
      if (d < dist) {
        dist = d;
        best = ln;
      }
    }
    return best;
  }

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const x = svgX(e);
    if (x === null || x < X0 || x > X1) {
      setCursor(null);
      setHover(null);
      return;
    }
    const n = nearest(x);
    setCursor(n ? n.x : x);
    setHover(n);
  };

  // En pantallas táctiles no hay "hover": el toque calcula la línea más cercana.
  const onClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const x = svgX(e);
    const n = x === null ? null : nearest(x);
    if (n) {
      setLocked(locked === n ? null : n);
      setCursor(n.x);
    } else setLocked(null);
  };

  const ticks = [];
  for (let l = 400; l <= 720; l += 20) ticks.push(l);

  const bandLines = band ? lines.filter((l) => l.band === band) : [];
  const total = TOTAL;

  return (
    <div className="spec">
      <div className="spec-bands" role="group" aria-label="Bandas del espectro">
        <button
          type="button"
          className="sb"
          aria-pressed={band === null}
          onClick={() => {
            setBand(null);
            setHover(null);
          }}
        >
          Todo <span>{total}</span>
        </button>
        {SPECTRUM.map((b, bi) => {
          const [r, g, bl] = wavelengthRGB((RANGES[bi].from + RANGES[bi].to) / 2);
          return (
            <button
              key={b.id}
              type="button"
              className="sb"
              aria-pressed={band === b.id}
              onClick={() => {
                setBand(band === b.id ? null : b.id);
                setLocked(null);
                setHover(null);
              }}
            >
              <i style={{ background: `rgb(${r},${g},${bl})` }} />
              {b.name} <span>{b.tools.length}</span>
            </button>
          );
        })}
      </div>

      <div className="spec-scroll">
        <svg
          ref={svgRef}
          className="spec-svg"
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Espectro de emisión: cada línea es una herramienta, su altura es el número de proyectos o cursos donde aparece"
          onPointerMove={onMove}
          onPointerLeave={() => {
            setHover(null);
            setCursor(null);
          }}
          onClick={onClick}
        >
          {/* sombreado de la banda activa */}
          {RANGES.map((b) => (
            <rect
              key={`bg-${b.id}`}
              x={xOf(b.from)}
              y={20}
              width={xOf(b.to) - xOf(b.from)}
              height={STRIP_B - 20}
              className={`spec-zone${band === b.id ? " on" : ""}`}
            />
          ))}

          {/* perfil 1D */}
          <path d={`${path}L${X1},${BASE}L${X0},${BASE}Z`} className="spec-fill" />
          <path d={path} className="spec-line" />

          {/* identificación de líneas */}
          {lines.map((ln) => {
            const show = labelled(ln);
            const peak = BASE - (ln.amp + 0.04) * PEAK;
            const dim = !inFocus(ln);
            return (
              <g key={ln.key} className={`spec-id${dim ? " dim" : ""}${ln === current ? " cur" : ""}`}>
                <line x1={ln.x} x2={ln.x} y1={peak - 4} y2={peak - (show ? 12 : 7)} />
                {show && (
                  <text x={ln.x} y={peak - 16} transform={`rotate(-90 ${ln.x} ${peak - 16})`}>
                    {ln.name}
                  </text>
                )}
              </g>
            );
          })}

          {/* eje λ */}
          <line x1={X0} x2={X1} y1={BASE + 6} y2={BASE + 6} className="spec-axis" />
          {ticks.map((l) => (
            <g key={l} className="spec-tick">
              <line x1={xOf(l)} x2={xOf(l)} y1={BASE + 6} y2={BASE + 11} />
              <text x={xOf(l)} y={BASE + 24}>
                {l}
              </text>
            </g>
          ))}
          <text x={X1} y={BASE + 24} className="spec-unit" textAnchor="end">
            λ [nm]
          </text>

          {/* espectro 2D */}
          <rect x={X0} y={STRIP_T} width={X1 - X0} height={STRIP_B - STRIP_T} className="spec-strip" />
          {lines.map((ln) => (
            <rect
              key={`s-${ln.key}`}
              x={ln.x - 1.6}
              y={STRIP_T}
              width={3.2}
              height={STRIP_B - STRIP_T}
              fill={ln.rgb}
              opacity={inFocus(ln) ? 0.35 + 0.65 * ln.amp : 0.08}
              className={ln === current ? "spec-cur" : undefined}
            />
          ))}

          {/* bandas */}
          {RANGES.map((b) => (
            <g
              key={`b-${b.id}`}
              className={`spec-band${band === b.id ? " on" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setBand(band === b.id ? null : b.id);
                setLocked(null);
                setHover(null);
              }}
            >
              <path d={`M${xOf(b.from) + 2},${BANDS_Y - 8}V${BANDS_Y}H${xOf(b.to) - 2}V${BANDS_Y - 8}`} />
              <text x={(xOf(b.from) + xOf(b.to)) / 2} y={BANDS_Y + 18}>
                {b.name}
              </text>
            </g>
          ))}

          {/* cursor */}
          {cursor !== null && (
            <g className="spec-cursor">
              <line x1={cursor} x2={cursor} y1={20} y2={STRIP_B} />
              <text x={Math.min(cursor + 8, X1 - 90)} y={34}>
                λ {lOf(cursor).toFixed(1)} nm
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="spec-detail" aria-live="polite">
        {current ? (
          <>
            <div className="sd-head">
              <i style={{ background: current.rgb }} />
              <div>
                <h3>{current.name}</h3>
                <p>
                  λ {current.lambda.toFixed(1)} nm · {current.bandName} · intensidad {current.sources.length}
                </p>
              </div>
            </div>
            <div className="sd-src">
              <p className="sd-k">Aparece en</p>
              <ul>
                {current.sources.map((s) => {
                  const src = SOURCES[s];
                  return (
                    <li key={s}>
                      {src.target ? (
                        <a href="#cielo" data-target={src.target}>
                          {src.label} <span aria-hidden>◎</span>
                        </a>
                      ) : (
                        <span>{src.label}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        ) : band ? (
          <div className="sd-list">
            <p className="sd-k">{SPECTRUM.find((b) => b.id === band)?.name} · elige una línea</p>
            <ul>
              {bandLines.map((ln) => (
                <li key={ln.key}>
                  <button type="button" onClick={() => setLocked(ln)}>
                    <i style={{ background: ln.rgb }} />
                    {ln.name}
                    <span>{ln.lambda.toFixed(1)} nm</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="sd-empty">
            {total} líneas en {SPECTRUM.length} bandas. Pasa el cursor por el espectro o elige una banda; las líneas con{" "}
            <span aria-hidden>◎</span> te llevan al objeto del cielo donde está el proyecto.
          </p>
        )}
      </div>
    </div>
  );
}
