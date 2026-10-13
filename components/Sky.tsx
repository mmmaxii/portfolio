"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BANDS, BAND_ORDER, CONTENT, TARGETS, type BandId, type DeepImage, type Target } from "@/data/content";
import { UI, type Locale } from "@/data/ui";
import { fmtDec, fmtFov, fmtRA, sepDeg } from "@/lib/sky";

/*
 * Cielo real con Aladin Lite (CDS). Los mapas son HiPS: mosaicos jerárquicos del cielo completo.
 * Sobre el cielo van marcadores HTML (uno por objeto) y, al acercarse, la imagen profunda de cada
 * objeto colocada con su astrometría AVM (posición, escala angular y rotación al norte).
 */

const ALADIN_SRC = "https://aladin.cds.unistra.fr/AladinLite/api/v3/3.8.2/aladin.js";

interface AladinView {
  getFov(): number[];
  getRaDec(): number[];
  setFoV(fov: number): void;
  gotoRaDec(ra: number, dec: number): void;
  setBaseImageLayer(id: string): void;
  setProjection(p: string): void;
  world2pix(ra: number, dec: number): number[] | null;
  zoomToFoV(fov: number, seconds: number, done?: () => void): void;
  animateToRaDec(ra: number, dec: number, seconds: number, done?: () => void): void;
  stopAnimation?: () => void;
  on(event: string, cb: () => void): void;
}

interface AladinGlobal {
  init: Promise<void>;
  aladin(el: string | HTMLElement, opts: Record<string, unknown>): AladinView;
}

declare global {
  interface Window {
    A?: AladinGlobal;
  }
}

function loadAladin(): Promise<AladinGlobal> {
  if (window.A) return Promise.resolve(window.A);
  return new Promise((resolve, reject) => {
    let s = document.querySelector<HTMLScriptElement>(`script[src="${ALADIN_SRC}"]`);
    if (!s) {
      s = document.createElement("script");
      s.src = ALADIN_SRC;
      s.async = true;
      document.head.appendChild(s);
    }
    s.addEventListener("load", () => (window.A ? resolve(window.A) : reject(new Error("Aladin no disponible"))));
    s.addEventListener("error", () => reject(new Error("No se pudo cargar Aladin Lite")));
  });
}

function surveyFor(b: BandId, fov: number) {
  const B = BANDS[b];
  return B.deep && fov < B.deep.below ? B.deep : B.wide;
}

const COARSE = "(pointer: coarse)";
const isCoarse = () => window.matchMedia(COARSE).matches;
const subscribeCoarse = (cb: () => void) => {
  const m = window.matchMedia(COARSE);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** En pantallas verticales el campo amplio se acorta, para no ver el borde del hemisferio. */
function homeFov(fov: number, el: HTMLElement | null) {
  if (!el || fov < 10) return fov;
  return el.clientWidth / Math.max(1, el.clientHeight) < 1.1 ? fov * 0.62 : fov;
}
const MAX_DEEP_PX = 60000; // sobre esto el navegador ya no puede dibujar la imagen
const TOUR_DWELL = 11000; // ms en cada objeto durante el recorrido
const BAND_SHORT = { uv: "UV", vis: "VIS", ir: "IR" } as const;
const BAND_KEYS: Record<string, BandId> = { u: "uv", v: "vis", i: "ir" };

export default function Sky({ locale }: { locale: Locale }) {
  const C = CONTENT[locale];
  const T = UI[locale].sky;
  const [band, setBand] = useState<BandId>("vis");
  const [active, setActive] = useState<Target | null>(null);
  const [exploring, setExploringState] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const touch = useSyncExternalStore(subscribeCoarse, isCoarse, () => false);

  const rootRef = useRef<HTMLElement>(null);
  const aladinRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const deepBgRef = useRef<HTMLDivElement>(null);
  const deepTagRef = useRef<HTMLParagraphElement>(null);
  const readoutRef = useRef<HTMLParagraphElement>(null);
  const markerEls = useRef<Record<string, HTMLButtonElement | null>>({});
  const deepEls = useRef<Record<string, HTMLImageElement | null>>({});
  const deepMeta = useRef<Record<string, { requested: boolean; ratio?: number }>>({});

  const al = useRef<AladinView | null>(null);
  const bandRef = useRef<BandId>("vis");
  const activeRef = useRef<Target | null>(null);
  const exploringRef = useRef(false);
  const flightRef = useRef(0);
  const surveyRef = useRef("");
  const projRef = useRef<"SIN" | "AIT">("SIN");
  const skyVisibleRef = useRef(true);
  const tourRef = useRef<{ ids: string[]; i: number; timer: number } | null>(null);
  const [tour, setTour] = useState<{ i: number; n: number } | null>(null);

  const setExploring = useCallback((v: boolean) => {
    exploringRef.current = v;
    setExploringState(v);
  }, []);

  const veil = useCallback((on: boolean) => {
    veilRef.current?.classList.toggle("on", on);
  }, []);

  const updateSurvey = useCallback((force = false) => {
    const a = al.current;
    if (!a) return;
    const s = surveyFor(bandRef.current, a.getFov()[0]);
    if (force || s.id !== surveyRef.current) {
      surveyRef.current = s.id;
      a.setBaseImageLayer(s.id);
    }
  }, []);

  const fly = useCallback(
    (ra: number, dec: number, fov: number) => {
      const a = al.current;
      if (!a) return;
      const id = ++flightRef.current;
      const live = () => id === flightRef.current;
      a.stopAnimation?.();
      if (BANDS[bandRef.current].jump) {
        veil(true);
        window.setTimeout(() => {
          if (!live()) return;
          a.gotoRaDec(ra, dec);
          a.setFoV(Math.min(fov * 4, 4));
          updateSurvey(true);
          veil(false);
          a.zoomToFoV(fov, 1.6);
        }, 380);
        return;
      }
      const cur = a.getFov()[0];
      const mid = Math.max(Math.min(cur, 60), 25);
      a.zoomToFoV(mid, cur > mid ? 0.6 : 0.9, () => {
        if (!live()) return;
        a.animateToRaDec(ra, dec, 1.6, () => {
          if (!live()) return;
          a.zoomToFoV(fov, 2.2, () => {
            if (live()) updateSurvey();
          });
        });
      });
    },
    [updateSurvey, veil],
  );

  const goHome = useCallback(
    (b: BandId) => {
      const h = BANDS[b].home;
      fly(h.ra, h.dec, homeFov(h.fov, aladinRef.current));
    },
    [fly],
  );

  const requestDeep = useCallback((t: Target) => {
    const im = deepEls.current[t.id];
    const meta = (deepMeta.current[t.id] ??= { requested: false });
    if (t.deep && im && !meta.requested) {
      meta.requested = true;
      im.src = t.deep.src;
    }
  }, []);

  const stopTour = useCallback(() => {
    if (tourRef.current) window.clearTimeout(tourRef.current.timer);
    tourRef.current = null;
    setTour(null);
  }, []);

  const switchBand = useCallback(
    (b: BandId, keepView = false) => {
      if (b === bandRef.current && !keepView) return;
      bandRef.current = b;
      setBand(b);
      if (!BANDS[b].jump) {
        veil(true);
        window.setTimeout(() => {
          updateSurvey(true);
          veil(false);
        }, 350);
      }
      if (!keepView) {
        activeRef.current = null;
        setActive(null);
        goHome(b);
      }
    },
    [goHome, updateSurvey, veil],
  );

  const openTarget = useCallback(
    (t: Target, fromTour = false) => {
      if (!fromTour) stopTour();
      if (t.band !== bandRef.current) switchBand(t.band, true);
      // Enlace directo: la dirección queda como …/#pds70 y se puede compartir.
      window.history.replaceState(null, "", `#${t.id}`);
      activeRef.current = t;
      setActive(t);
      setExploring(true);
      requestDeep(t);
      fly(t.ra, t.dec, t.fov);
    },
    [fly, requestDeep, setExploring, stopTour, switchBand],
  );

  const closeCard = useCallback(() => {
    stopTour();
    activeRef.current = null;
    setActive(null);
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    goHome(bandRef.current);
  }, [goHome, stopTour]);

  // Recorrido guiado: vuela por los objetos de la banda actual, uno tras otro.
  const startTour = useCallback(() => {
    const ids = C.TARGETS.filter((t) => t.band === bandRef.current).map((t) => t.id);
    if (!ids.length) return;
    setExploring(true);
    const step = (i: number) => {
      const t = C.TARGETS.find((x) => x.id === ids[i]);
      if (!t) return;
      openTarget(t, true);
      setTour({ i: i + 1, n: ids.length });
      const timer = window.setTimeout(() => {
        if (!tourRef.current) return;
        if (i + 1 < ids.length) step(i + 1);
        else closeCard();
      }, TOUR_DWELL);
      tourRef.current = { ids, i, timer };
    };
    step(0);
  }, [C, closeCard, openTarget, setExploring]);

  const userSwitchBand = useCallback(
    (b: BandId) => {
      stopTour();
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      switchBand(b);
    },
    [stopTour, switchBand],
  );

  // Enlaces directos: al cargar con …/#id (o al cambiar el hash) se abre ese objeto.
  useEffect(() => {
    if (status !== "ready") return;
    const fromHash = () => {
      const t = C.TARGETS.find((x) => x.id === window.location.hash.slice(1));
      if (t && t.id !== activeRef.current?.id) {
        rootRef.current?.scrollIntoView();
        openTarget(t);
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [C, openTarget, status]);

  useEffect(() => () => stopTour(), [stopTour]);

  // Modo objeto: se oculta todo lo de la izquierda y la barra superior.
  useEffect(() => {
    document.body.classList.toggle("focused", !!active);
    return () => document.body.classList.remove("focused");
  }, [active]);

  // Carga de Aladin Lite.
  useEffect(() => {
    let cancelled = false;
    loadAladin()
      .then(async (A) => {
        await A.init;
        if (cancelled || al.current || !aladinRef.current) return;
        const h = BANDS.vis.home;
        const fov0 = homeFov(h.fov, aladinRef.current);
        const first = surveyFor("vis", fov0);
        const a = A.aladin("#aladin-lite", {
          survey: first.id,
          target: `${h.ra} ${h.dec}`,
          fov: fov0,
          projection: "SIN",
          cooFrame: "ICRSd",
          showReticle: false,
          showZoomControl: false,
          showFullscreenControl: false,
          showLayersControl: false,
          showFrame: false,
          showFov: false,
          showCooLocation: false,
          showProjectionControl: false,
          showStatusBar: false,
          showSimbadPointerControl: false,
          showCooGridControl: false,
          showSettingsControl: false,
          showShareControl: false,
          showContextMenu: false,
          backgroundColor: "rgb(4,6,10)",
        });
        al.current = a;
        surveyRef.current = first.id;
        a.on("zoomChanged", () => {
          const f = a.getFov()[0];
          // SIN llega como máximo a 180°: para ver el cielo completo se pasa a Aitoff.
          if (projRef.current === "SIN" && f >= 178) {
            projRef.current = "AIT";
            a.setProjection("AIT");
          } else if (projRef.current === "AIT" && f < 140) {
            projRef.current = "SIN";
            a.setProjection("SIN");
          }
          updateSurvey();
        });
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [updateSurvey]);

  // Bucle de dibujo: marcadores, imágenes profundas y lectura de coordenadas.
  useEffect(() => {
    let raf = 0;
    let visible = true;
    const root = rootRef.current;
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        skyVisibleRef.current = e.intersectionRatio >= 0.5;
        if (e.intersectionRatio < 0.55 && exploringRef.current && !activeRef.current) setExploring(false);
      },
      { threshold: [0, 0.55, 1] },
    );
    if (root) io.observe(root);

    const fieldLabel = T.field;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const a = al.current;
      const box = aladinRef.current;
      if (!a || !box || !visible) return;
      const W = box.clientWidth;
      const fov = a.getFov()[0];
      const [cRa, cDec] = a.getRaDec();
      const b = bandRef.current;
      let shown: DeepImage | null = null;
      let maxA = 0;

      for (const t of TARGETS) {
        const d = t.deep;
        const im = deepEls.current[t.id];
        if (!d || !im) continue;
        const meta = (deepMeta.current[t.id] ??= { requested: false });
        const near = t.band === b && sepDeg(cRa, cDec, d.ra, d.dec) < fov + d.widthDeg;
        const p = near ? a.world2pix(d.ra, d.dec) : null;
        const f0 = d.fadeFrom ?? d.widthDeg * 1.6;
        const f1 = d.fadeTo ?? d.widthDeg * 1.05;
        if (!meta.requested && p && fov < f0 * 4) {
          meta.requested = true;
          im.src = d.src;
        }
        const w = (d.widthDeg / fov) * W;
        const ok = p && isFinite(p[0]) && meta.ratio && w < MAX_DEEP_PX;
        const av = ok ? clamp01((f0 - fov) / (f0 - f1)) : 0;
        im.style.opacity = av.toFixed(3);
        markerEls.current[t.id]?.classList.toggle("deep-on", av > 0.4);
        if (av > 0 && p && meta.ratio) {
          const h = w * meta.ratio;
          im.style.width = `${w}px`;
          im.style.transform = `translate(${p[0]}px, ${p[1]}px) rotate(${d.rot}deg) translate(${-w * d.fx}px, ${-h * d.fy}px)`;
          if (av > 0.5) shown = d;
        }
        maxA = Math.max(maxA, av);
      }
      if (deepBgRef.current) deepBgRef.current.style.opacity = maxA.toFixed(3);
      const tag = deepTagRef.current;
      if (tag) {
        tag.style.opacity = shown ? "1" : "0";
        if (shown) tag.textContent = `${shown.label} · ${shown.credit}`;
      }

      const horizon = projRef.current === "AIT" ? 180 : 85;
      for (const t of TARGETS) {
        const el = markerEls.current[t.id];
        if (!el || t.band !== b) continue;
        const p = a.world2pix(t.ra, t.dec);
        el.style.transform =
          p && isFinite(p[0]) && sepDeg(cRa, cDec, t.ra, t.dec) < horizon
            ? `translate(${p[0]}px, ${p[1]}px)`
            : "translate(-9999px, -9999px)";
      }

      // El texto de la izquierda se esconde al acercarse: bajo 70° en el visible, o bajo el 70 % del
      // campo inicial en los filtros que ya parten más cerca (infrarrojo y ultravioleta).
      const hideBelow = Math.min(70, BANDS[b].home.fov * 0.7);
      root?.classList.toggle("zoomed", fov < hideBelow);

      if (readoutRef.current) {
        readoutRef.current.innerHTML = `α <b>${fmtRA(cRa)}</b> &nbsp;δ <b>${fmtDec(cDec)}</b> · ${fieldLabel} <b>${fmtFov(fov)}</b> · ${surveyFor(b, fov).name}`;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [setExploring, T.field]);

  // Interacción: la rueda y el arrastre solo llegan al cielo en modo exploración, así la página
  // se puede recorrer con scroll sin quedar atrapada en el mapa.
  useEffect(() => {
    const root = rootRef.current;
    const box = aladinRef.current;
    if (!root || !box) return;
    const inSky = (e: Event) => box.contains(e.target as Node);
    let down: { x: number; y: number } | null = null;

    const block = (e: Event) => {
      if (!exploringRef.current && inSky(e)) e.stopPropagation();
    };
    const onDown = (e: PointerEvent) => {
      if (!inSky(e)) return;
      if (tourRef.current) stopTour();
      if (!exploringRef.current) {
        down = { x: e.clientX, y: e.clientY };
        e.stopPropagation();
      }
    };
    const onUp = (e: PointerEvent) => {
      if (down && inSky(e) && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 8) setExploring(true);
      down = null;
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && !activeRef.current) setExploring(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeRef.current) {
        closeCard();
        return;
      }
      // Atajos: U V I cambian el filtro, ← → recorren los objetos. Solo con el cielo a la vista.
      const el = e.target instanceof Element ? e.target : null;
      if (e.metaKey || e.ctrlKey || e.altKey || el?.closest("input, textarea, [contenteditable]")) return;
      if (!skyVisibleRef.current) return;
      const b = BAND_KEYS[e.key.toLowerCase()];
      if (b) {
        userSwitchBand(b);
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const list = C.TARGETS.filter((t) => t.band === bandRef.current);
        if (!list.length) return;
        e.preventDefault();
        const i = list.findIndex((t) => t.id === activeRef.current?.id);
        const next =
          e.key === "ArrowRight" ? list[(i + 1) % list.length] : list[i < 0 ? list.length - 1 : (i - 1 + list.length) % list.length];
        openTarget(next);
      }
    };
    const onDocClick = (e: MouseEvent) => {
      const el = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-target]") : null;
      if (!el) return;
      const t = C.TARGETS.find((x) => x.id === el.dataset.target);
      if (!t) return;
      e.preventDefault();
      root.scrollIntoView({ behavior: "smooth" });
      window.setTimeout(() => openTarget(t), 550);
    };

    const opts = { capture: true };
    root.addEventListener("wheel", block, { capture: true, passive: true });
    root.addEventListener("touchstart", block, { capture: true, passive: true });
    root.addEventListener("touchmove", block, { capture: true, passive: true });
    root.addEventListener("mousedown", block, opts);
    root.addEventListener("pointerdown", onDown, opts);
    root.addEventListener("pointerup", onUp, opts);
    root.addEventListener("pointerleave", onLeave);
    // Sin el menú de herramientas de Aladin al hacer clic derecho sobre el cielo.
    const onMenu = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest("#aladin-lite")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    root.addEventListener("contextmenu", onMenu, { capture: true });
    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onDocClick);
    return () => {
      root.removeEventListener("wheel", block, opts);
      root.removeEventListener("touchstart", block, opts);
      root.removeEventListener("touchmove", block, opts);
      root.removeEventListener("mousedown", block, opts);
      root.removeEventListener("pointerdown", onDown, opts);
      root.removeEventListener("pointerup", onUp, opts);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("contextmenu", onMenu, { capture: true });
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onDocClick);
    };
  }, [C, closeCard, openTarget, setExploring, stopTour, userSwitchBand]);

  const B = C.BANDS[band];
  const hint =
    status === "error"
      ? T.hintError
      : exploring
        ? touch
          ? T.hintExploreTouch
          : T.hintExplore
        : touch
          ? T.hintIdleTouch
          : T.hintIdle;

  return (
    <section
      ref={rootRef}
      className={`sky${exploring ? " exploring" : ""}`}
      id="cielo"
      aria-label={T.aria}
      data-band={band}
    >
      <div id="aladin-lite" ref={aladinRef} />
      <div className="veil" ref={veilRef} />
      <div className="markers">
        <div className="deep-bg" ref={deepBgRef} />
        {C.TARGETS.filter((t) => t.deep).map((t) => (
          // Imagen astronómica externa posicionada por coordenadas; next/image no aplica aquí.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`deep-${t.id}`}
            className="deep"
            alt=""
            decoding="async"
            ref={(el) => {
              deepEls.current[t.id] = el;
            }}
            onLoad={(e) => {
              const im = e.currentTarget;
              (deepMeta.current[t.id] ??= { requested: true }).ratio = im.naturalHeight / im.naturalWidth;
            }}
          />
        ))}
        {C.TARGETS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`mk${t.band === band ? "" : " off"}${active?.id === t.id ? " active" : ""}`}
            data-band={t.band}
            aria-label={`${t.project.title}, ${t.name}`}
            tabIndex={t.band === band ? 0 : -1}
            ref={(el) => {
              markerEls.current[t.id] = el;
            }}
            onClick={(e) => {
              e.stopPropagation();
              openTarget(t);
            }}
          >
            <span className="ring" />
            <span className="lab">
              <span className="cat">{t.cat}</span>
              <span className="ttl">{t.project.title}</span>
            </span>
          </button>
        ))}
      </div>
      <p className="deep-tag" ref={deepTagRef} />

      <div className="intro">
        <p className="kicker">{B.kicker}</p>
        <h1>
          Maximiliano
          <br />
          Valderrama
        </h1>
        <p className="role">{T.role}</p>
        <div className="theme">
          <h2>{B.title}</h2>
          <p>{B.text}</p>
          <p className="note">{B.note}</p>
        </div>
      </div>

      <div className="filters" role="group" aria-label={T.filterAria}>
        <div className="lbl">{T.filter}</div>
        {BAND_ORDER.map((id) => (
          <button
            key={id}
            type="button"
            className="fb"
            data-band={id}
            aria-pressed={band === id}
            onClick={() => userSwitchBand(id)}
          >
            <span className="dot" />
            <span>
              <b>{C.BANDS[id].label}</b>
              <b className="short" aria-hidden>
                {BAND_SHORT[id]}
              </b>
              <small>{C.BANDS[id].range}</small>
            </span>
          </button>
        ))}
        <button
          type="button"
          className={`tour${tour ? " on" : ""}`}
          aria-label={tour ? undefined : T.tourAria}
          onClick={() => (tour ? closeCard() : startTour())}
        >
          {tour ? (
            <>
              ■<span className="tl"> {T.tourStop} ·</span> {tour.i}
              <span className="tl"> {T.tourOf} </span>
              <span className="ts" aria-hidden>/</span>
              {tour.n}
            </>
          ) : (
            <>
              ▶<span className="tl"> {T.tour}</span>
            </>
          )}
        </button>
      </div>

      <p className="readout" ref={readoutRef}>
        α <b>--</b> δ <b>--</b> · {T.field} <b>--</b>
      </p>
      <a className="powered" href="https://aladin.cds.unistra.fr/AladinLite/" target="_blank" rel="noopener noreferrer">
        {T.powered}
      </a>
      <p className={`hint${status === "error" ? " err" : ""}`}>{hint}</p>
      <a className="down" href="#sobre">
        {T.logbook}
      </a>

      {active && (
        <aside className="card" aria-live="polite">
          <button className="x" type="button" aria-label={T.close} onClick={closeCard}>
            ✕
          </button>
          <p className="cat">
            {active.cat} · {C.BANDS[active.band].label.toUpperCase()}
          </p>
          <h3>{active.name}</h3>
          <p className="coords">
            α {fmtRA(active.ra)} &nbsp; δ {fmtDec(active.dec)}
          </p>
          <p className="fact">{active.fact}</p>
          {active.deep && (
            <p className="coords">
              {T.image}: {active.deep.label} · {active.deep.credit}
            </p>
          )}
          <hr />
          <p className="pk">{T.project}</p>
          <h4>{active.project.title}</h4>
          <p className="desc">{active.project.desc}</p>
          {active.project.img && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={active.project.img} alt={`Captura de ${active.project.title}`} loading="lazy" />
          )}
          <ul className="tags">
            {active.project.tech.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <div className="links">
            {active.project.links.map((l, i) => (
              <a key={l.href} className={i ? "sec" : ""} href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label} ↗
              </a>
            ))}
          </div>
        </aside>
      )}
    </section>
  );
}
