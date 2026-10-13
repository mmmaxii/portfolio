"use client";

import { useEffect, useRef, useState } from "react";
import { CONTENT, SPECTRUM, targetsOf, type SpectrumBand } from "@/data/content";
import { UI, type Locale } from "@/data/ui";
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

function buildLines(spec: SpectrumBand[]): Line[] {
  const max = Math.max(...spec.flatMap((b) => b.tools.map((t) => t.sources.length)));
  return spec.flatMap((b) =>
    b.tools.map((t, i) => {
      const [r, g, bl] = wavelengthRGB(t.lambda);
      return {
        key: `${b.id}-${i}`,
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

// Flujo del perfil en cada columna x (continuo suave + líneas gaussianas).
function profileValues(lines: Line[]) {
  const sigma = 2.3;
  const v: number[] = [];
  for (let x = X0; x <= X1; x += 1) {
    const l = lOf(x);
    let f = 0.03 + 0.05 * Math.exp(-(((l - 470) / 160) ** 2)) + 0.008 * Math.sin(l / 9) + (noise(x) - 0.5) * 0.022;
    for (const ln of lines) {
      const dx = x - ln.x;
      if (Math.abs(dx) < 12) f += ln.amp * Math.exp(-0.5 * (dx / sigma) ** 2);
    }
    v.push(f);
  }
  return v;
}

function profilePath(all: Line[], revealed: number) {
  const v = profileValues(all.filter((l) => BAND_INDEX[l.band] < revealed));
  return v.map((f, i) => `${i ? "L" : "M"}${X0 + i},${(BASE - f * PEAK).toFixed(1)}`).join("");
}

const BAND_INDEX: Record<string, number> = Object.fromEntries(SPECTRUM.map((b, i) => [b.id, i]));
const NB = SPECTRUM.length;
// Mismas líneas en ambos idiomas (solo cambian los nombres); la geometría sale del español.
const LINES_BY: Record<Locale, Line[]> = { es: buildLines(CONTENT.es.SPECTRUM), en: buildLines(CONTENT.en.SPECTRUM) };
const LINES = LINES_BY.es;
// Un perfil por etapa: 0 bandas, 1 banda, ..., todas. El navegador interpola entre ellos.
const PATHS = Array.from({ length: NB + 1 }, (_, k) => profilePath(LINES, k));
// Las etiquetas se anclan sobre el punto más alto de la curva completa cerca de cada línea,
// así nunca quedan bajo una línea vecina más intensa.
const FULL = profileValues(LINES);
const LABEL_Y: Record<string, number> = Object.fromEntries(
  LINES.map((ln) => {
    const i = Math.round(ln.x - X0);
    const top = Math.max(...FULL.slice(Math.max(0, i - 7), i + 8));
    return [ln.key, BASE - top * PEAK];
  }),
);
const VIEW_TOP = 60;

export default function Spectrum({ locale }: { locale: Locale }) {
  const lines = LINES_BY[locale];
  const SPEC = CONTENT[locale].SPECTRUM;
  const SRC = CONTENT[locale].SOURCES;
  const U = UI[locale].spectrum;
  // Proyecto destacado desde el catálogo (al pasar el cursor por una fila).
  const [proj, setProj] = useState<string | null>(null);
  const [hover, setHover] = useState<Line | null>(null);
  const [locked, setLocked] = useState<Line | null>(null);
  // Etapa según el scroll: 0 = solo continuo, 1..NB = banda activa, NB+1 = todo.
  // -1 = espectro completo sin banda (antes de medir el scroll), 0 = solo continuo, 1..NB = banda activa.
  const [stage, setStage] = useState(-1);
  // Elección manual (botón o banda del gráfico); se descarta al avanzar el scroll.
  const [manual, setManual] = useState<{ band: string | null } | null>(null);
  const [cursor, setCursor] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBand = stage >= 1 && stage <= NB ? SPECTRUM[stage - 1].id : null;
  const band = manual ? manual.band : scrollBand;
  const revealed = manual || stage < 0 ? NB : stage;
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
      // NB + 1 tramos iguales: el primero solo muestra el continuo y el último termina en la última banda.
      const st = total <= 8 ? -1 : Math.min(NB, Math.max(0, Math.floor((-r.top / total) * (NB + 1))));
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

  // Conexión con el catálogo: la línea activa marca los proyectos que la usan, y una fila del
  // catálogo resalta aquí las líneas de su proyecto.
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("portfolio:tool", {
        detail: current ? { tool: current.name, color: current.rgb, targets: targetsOf(current.sources) } : null,
      }),
    );
  }, [current]);
  useEffect(() => {
    const on = (e: Event) => setProj((e as CustomEvent<string | null>).detail);
    window.addEventListener("portfolio:project", on);
    return () => window.removeEventListener("portfolio:project", on);
  }, []);
  const isProj = (ln: Line) => !!proj && targetsOf(ln.sources).includes(proj);
  const inFocus = (ln: Line) => isOn(ln) && (!band || ln.band === band);
  const labelled = (ln: Line) =>
    (proj ? isProj(ln) : band ? ln.band === band : ln.sources.length >= 3) || ln === current;

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
      ? U.start
      : stage > 0
        ? `${stage} ${U.of} ${NB} · ${SPEC[stage - 1].name}: ${SPEC[stage - 1].species}`
        : U.complete;

  return (
    <div className="spec-pin" ref={pinRef} style={{ "--steps": NB + 1 } as React.CSSProperties}>
    <div className="spec">
      <p className="spec-step" aria-hidden>
        {step}
      </p>
      <div className="spec-bands" role="group" aria-label={U.bandsAria}>
        <button
          type="button"
          className="sb"
          aria-pressed={band === null && revealed === NB}
          onClick={() => chooseBand(null)}
        >
          {U.all} <span>{total}</span>
        </button>
        {SPEC.map((b) => {
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
          viewBox={`0 ${VIEW_TOP} ${W} ${H - VIEW_TOP}`}
          role="img"
          aria-label={U.aria}
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
            const peak = LABEL_Y[ln.key];
            const dim = !inFocus(ln);
            return (
              <g
                key={ln.key}
                className={`spec-id${isOn(ln) ? "" : " hidden"}${dim && !isProj(ln) ? " dim" : ""}${ln === current || isProj(ln) ? " cur" : ""}`}
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
              opacity={isProj(ln) ? 1 : inFocus(ln) ? 0.35 + 0.65 * ln.amp : isOn(ln) ? 0.08 : 0}
              className={ln === current ? "spec-cur" : undefined}
            />
          ))}

          {/* cursor */}
          {cursor !== null && (
            <g className="spec-cursor">
              <line x1={cursor} x2={cursor} y1={VIEW_TOP + 4} y2={STRIP_B} />
              <text x={Math.min(cursor + 8, X1 - 90)} y={VIEW_TOP + 16}>
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
                  {current.ion} · λ {current.lambda.toFixed(2)} nm · {current.bandName} ({current.species}) · {U.intensity}{" "}
                  {current.sources.length}
                </p>
              </div>
            </div>
            <div className="sd-src">
              <p className="sd-k">{U.appearsIn}</p>
              <ul>
                {current.sources.map((s) => {
                  const src = SRC[s];
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
              {SPEC.find((b) => b.id === band)?.name} · {SPEC.find((b) => b.id === band)?.species} · {U.pick}
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
          <p className="sd-empty">{U.empty(total, SPEC.length)}</p>
        )}
      </div>
    </div>
    </div>
  );
}
