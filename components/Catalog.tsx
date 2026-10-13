"use client";

import { useEffect, useRef, useState } from "react";
import { CONTENT, targetsOf } from "@/data/content";
import { UI, type Locale } from "@/data/ui";
import { wavelengthRGB } from "@/lib/sky";

const BAND_SHORT = { uv: "UV", vis: "VIS", ir: "IR" } as const;
const L0 = 366;
const L1 = 738;

interface ToolFocus {
  tool: string;
  color: string;
  targets: string[];
}

/**
 * Catálogo de proyectos. Cada fila aparece al entrar en pantalla y trae un mini espectro con las
 * líneas de las herramientas que usa ese proyecto (las mismas λ del espectro grande).
 */
export default function Catalog({ locale }: { locale: Locale }) {
  const C = CONTENT[locale];
  const U = UI[locale].projects;
  const listRef = useRef<HTMLUListElement>(null);
  const [focus, setFocus] = useState<ToolFocus | null>(null);

  // Herramientas (con su λ) de cada proyecto, según las fuentes del espectro.
  const toolsOf = (id: string) =>
    C.SPECTRUM.flatMap((b) => b.tools.filter((t) => targetsOf(t.sources).includes(id)));

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    // Solo con JavaScript activo las filas parten ocultas; sin JS se ve todo.
    list.classList.add("rv-on");
    const io = new IntersectionObserver(
      (entries) => {
        let n = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.style.transitionDelay = `${n++ * 70}ms`;
          el.classList.add("in");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.15 },
    );
    list.querySelectorAll("li").forEach((li) => io.observe(li));
    return () => io.disconnect();
  }, []);

  // La línea elegida en el espectro marca aquí los proyectos que la usan.
  useEffect(() => {
    const on = (e: Event) => setFocus((e as CustomEvent<ToolFocus | null>).detail);
    window.addEventListener("portfolio:tool", on);
    return () => window.removeEventListener("portfolio:tool", on);
  }, []);

  const hover = (id: string | null) => window.dispatchEvent(new CustomEvent("portfolio:project", { detail: id }));

  return (
    <ul className="idx" ref={listRef} onMouseLeave={() => hover(null)}>
      {C.TARGETS.map((t) => {
        const hit = !!focus && focus.targets.includes(t.id);
        const tools = toolsOf(t.id);
        return (
          <li key={t.id} className={hit ? "hit" : undefined} onMouseEnter={() => hover(t.id)}>
            <a href={`#${t.id}`} data-target={t.id}>
              <span className={`bd ${t.band}`} title={C.BANDS[t.band].label}>
                <i />
                {BAND_SHORT[t.band]}
              </span>
              <h3>
                {t.project.title}
                {hit && focus && (
                  <em className="uses" style={{ borderColor: focus.color }}>
                    {U.uses} {focus.tool}
                  </em>
                )}
              </h3>
              <span className="tech">{t.project.tech.slice(0, 4).join(" · ")}</span>
              <span className="obj">
                <svg className="mini" viewBox="0 0 160 14" aria-hidden preserveAspectRatio="none">
                  <rect x="0" y="0" width="160" height="14" />
                  {tools.map((tool) => {
                    const [r, g, b] = wavelengthRGB(tool.lambda);
                    const on = hit && tool.name === focus?.tool;
                    return (
                      <line
                        key={tool.name}
                        x1={((tool.lambda - L0) / (L1 - L0)) * 160}
                        x2={((tool.lambda - L0) / (L1 - L0)) * 160}
                        y1="0"
                        y2="14"
                        stroke={`rgb(${r},${g},${b})`}
                        strokeWidth={on ? 3 : 1.4}
                        opacity={on || !hit ? 1 : 0.45}
                      />
                    );
                  })}
                </svg>
                {t.cat}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
