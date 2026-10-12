"use client";

import { useEffect, useRef } from "react";
import { BANDS, TARGETS } from "@/data/content";

const BAND_SHORT = { uv: "UV", vis: "VIS", ir: "IR" } as const;

/** Catálogo de proyectos: cada fila aparece al entrar en pantalla. */
export default function Catalog() {
  const listRef = useRef<HTMLUListElement>(null);

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

  return (
    <ul className="idx" ref={listRef}>
      {TARGETS.map((t) => (
        <li key={t.id}>
          <a href="#cielo" data-target={t.id}>
            <span className={`bd ${t.band}`} title={BANDS[t.band].label}>
              <i />
              {BAND_SHORT[t.band]}
            </span>
            <h3>{t.project.title}</h3>
            <span className="tech">{t.project.tech.slice(0, 4).join(" · ")}</span>
            <span className="obj">{t.cat}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
