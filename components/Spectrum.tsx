"use client";

import { useEffect, useRef, useState } from "react";
import { SOURCES, SPECTRUM } from "@/data/content";
import { wavelengthRGB } from "@/lib/sky";

/*
 * Espectro de emisión de herramientas. Arriba, el perfil 1D (flujo vs λ) con identificación de
 * líneas; abajo, el espectro 2D tal como se vería en el detector. Cada área es un elemento y cada
 * herramienta una línea real de ese elemento; su intensidad es el número de proyectos o cursos.
 * Al hacer scroll, el gráfico queda fijo y las bandas se van encendiendo una por una.
 */

const W = 1200;
const X0 = 48;
const X1 = 1176;
const L0 = 366;
const L1 = 738;
const BASE = 300; // y del continuo
const PEAK = 128; // alto máximo de una línea
const STRIP_T = 336;
const STRIP_B = 380;
const H = 392;

const xOf = (l: number) => X0 + ((l - L0) / (L1 - L0)) * (X1 - X0);
const lOf = (x: number) => L0 + ((x - X0) / (X1 - X0)) * (L1 - L0);

interface Line {
  key: string;
  name: string;
  band: string;
  bandName: string;
  species: string;
  ion: string;
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

const TOTAL = SPECTRUM.reduce((n, b) => n + b.tools.length, 0);

function buildLines(): Line[] {
  const max = Math.max(...SPECTRUM.flatMap((b) => b.tools.map((t) => t.sources.length)));
  return SPECTRUM.flatMap((b) =>
    b.tools.map((t) => {
      const [r, g, bl] = wavelengthRGB(t.lambda);
      return {
        key: `${b.id}-${t.name}`,
        name: t.name,
        band: b.id,
        bandName: b.name,
        species: b.species,
        ion: t.ion,
        lambda: t.lambda,
        x: xOf(t.lambda),
        sources: t.sources,
        amp: 0.14 + 0.86 * (t.sources.length / max),
        rgb: `rgb(${r},${g},${bl})`,
      };
    }),
  );
}

function profilePath(all: Line[], revealed: number) {
  const lines = all.filter((l) => BAND_INDEX[l.band] < revealed);
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

const BAND_INDEX: Record<string, number> = Object.fromEntries(SPECTRUM.map((b, i) => [b.id, i]));
const NB = SPECTRUM.length;
const LINES = buildLines();
// Un perfil por etapa: 0 bandas, 1 banda, ..., todas. El navegador interpola entre ellos.
const PATHS = Array.from({ length: NB + 1 }, (_, k) => profilePath(LINES, k));

export default function Spectrum() {
  const lines = LINES;
  const [hover, setHover] = useState<Line | null>(null);
  const [locked, setLocked] = useState<Line | null>(null);
  // Etapa según el scroll: 0 = solo continuo, 1..NB = banda activa, NB+1 = todo.
  const [stage, setStage] = useState(NB + 1);
  // Elección manual (botón o banda del gráfico); se descarta al avanzar el scroll.
  const [manual, setManual] = useState<{ band: string | null } | null>(null);
  const [cursor, setCursor] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBand = stage >= 1 && stage <= NB ? SPECTRUM[stage - 1].id : null;
  const band = manual ? manual.band : scrollBand;
  const revealed = manual ? NB : Math.min(stage, NB);
  const isOn = (ln: Line) => BAND_INDEX[ln.band] < revealed;
  const path = PATHS[revealed];

  const chooseBand = (b: string | null) => {
    setManual({ band: b });
    setLocked(null);
    setHover(null);
  };

  useEffect(() => {
    let last = -1;
    // El cálculo es barato (un getBoundingClientRect), así que se hace directo en cada scroll.
    const update = () => {
      const el = pinRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      // Pantallas bajas: el gráfico no cabe fijo, así que se muestra completo desde el inicio.
      const short = window.matchMedia("(max-height: 640px)").matches;
      const st = short || total <= 8 ? NB + 1 : Math.min(NB + 1, Math.max(0, Math.floor((-r.top / total) * (NB + 2))));
      if (st !== last) {
        last = st;
        setStage(st);
        setManual(null);
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // En pantallas angostas el gráfico se desplaza solo hasta la banda activa.
  useEffect(() => {
    const box = scrollRef.current;
    const svg = svgRef.current;
    if (!box || !svg || !band || box.scrollWidth <= box.clientWidth) return;
    const xs = LINES.filter((l) => l.band === band).map((l) => l.x);
    const mid = (Math.min(...xs) + Math.max(...xs)) / 2;
    box.scrollTo({ left: (mid / W) * svg.clientWidth - box.clientWidth / 2, behavior: "smooth" });
  }, [band]);

  const current = hover ?? locked;
  const inFocus = (ln: Line) => isOn(ln) && (!band || ln.band === band);
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
  for (let l = 380; l <= 730; l += 20) ticks.push(l);

  const bandLines = band ? lines.filter((l) => l.band === band) : [];
  const total = TOTAL;

  const step =
    stage === 0
      ? "Desliza para encender el espectro"
      : stage <= NB
        ? `${stage} de ${NB} · ${SPECTRUM[stage - 1].name}: ${SPECTRUM[stage - 1].species}`
        : "Espectro completo";

  return (
    <div className="spec-pin" ref={pinRef} style={{ "--steps": NB + 2 } as React.CSSProperties}>
    <div className="spec">
      <p className="spec-step" aria-hidden>
        {step}
      </p>
      <div className="spec-bands" role="group" aria-label="Bandas del espectro">
        <button
          type="button"
          className="sb"
          aria-pressed={band === null}
          onClick={() => chooseBand(null)}
        >
          Todo <span>{total}</span>
        </button>
        {SPECTRUM.map((b) => {
          const [r, g, bl] = wavelengthRGB(b.tools[0].lambda);
          return (
            <button
              key={b.id}
              type="button"
              aria-pressed={band === b.id}
              className={`sb${BAND_INDEX[b.id] < revealed ? "" : " off"}`}
              onClick={() => chooseBand(band === b.id ? null : b.id)}
            >
              <i style={{ background: `rgb(${r},${g},${bl})` }} />
              {b.name} <span>{b.species.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      <div className="spec-scroll" ref={scrollRef}>
        <svg
          ref={svgRef}
          className="spec-svg"
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Espectro de emisión: cada área es un elemento químico y cada herramienta una de sus líneas; la altura es el número de proyectos o cursos donde aparece"
          onPointerMove={onMove}
          onPointerLeave={() => {
            setHover(null);
            setCursor(null);
          }}
          onClick={onClick}
        >
          {/* perfil 1D */}
          <path d={`${path}L${X1},${BASE}L${X0},${BASE}Z`} className="spec-fill" />
          <path d={path} className="spec-line" />

          {/* identificación de líneas */}
          {lines.map((ln) => {
            const show = labelled(ln);
            const peak = BASE - (ln.amp + 0.04) * PEAK;
            const dim = !inFocus(ln);
            return (
              <g
                key={ln.key}
                className={`spec-id${isOn(ln) ? "" : " hidden"}${dim ? " dim" : ""}${ln === current ? " cur" : ""}`}
              >
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
              opacity={inFocus(ln) ? 0.35 + 0.65 * ln.amp : isOn(ln) ? 0.08 : 0}
              className={ln === current ? "spec-cur" : undefined}
            />
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
                  {current.ion} · λ {current.lambda.toFixed(2)} nm · {current.bandName} ({current.species}) · intensidad{" "}
                  {current.sources.length}
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
            <p className="sd-k">
              {SPECTRUM.find((b) => b.id === band)?.name} · {SPECTRUM.find((b) => b.id === band)?.species} · elige una línea
            </p>
            <ul>
              {bandLines.map((ln) => (
                <li key={ln.key}>
                  <button type="button" onClick={() => setLocked(ln)}>
                    <i style={{ background: ln.rgb }} />
                    {ln.name}
                    <span>
                      {ln.ion} · {ln.lambda.toFixed(1)} nm
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="sd-empty">
            {total} líneas de {SPECTRUM.length} elementos. Pasa el cursor por el espectro o elige un elemento; las líneas con{" "}
            <span aria-hidden>◎</span> te llevan al objeto del cielo donde está el proyecto.
          </p>
        )}
      </div>
    </div>
    </div>
  );
}
