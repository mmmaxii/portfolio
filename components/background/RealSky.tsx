"use client";

import { useEffect, useRef } from "react";

/*
 * Cielo nocturno realista dibujado por código sobre <canvas>.
 * - Campo de estrellas con distribución de brillo realista (muchas tenues,
 *   pocas brillantes) y color-temperatura sutil.
 * - Vía Láctea austral realista: arco difuso con nebulosidades, polvo oscuro,
 *   concentración de estrellas en la banda, y colores cálidos en el núcleo.
 * - Parpadeo (twinkle) muy leve; parallax sutil con el mouse.
 * - Efecto cinematográfico de hiperespacio (Warp Speed / Starburst).
 * Los colores base se leen de las variables CSS: nada hardcodeado aquí.
 */

interface Star {
  x: number;
  y: number;
  r: number;
  base: number; // brillo base 0..1
  tw: number; // fase de twinkle
  twSpeed: number;
  hue: number; // -1 frío .. +1 cálido
}

// Nube de nebulosidad a lo largo de la Vía Láctea
interface Nebula {
  x: number;
  y: number;
  rx: number;
  ry: number;
  alpha: number;
  color: string;
  rotation: number;
}

function readVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

// Pseudo-random seeded para reproducibilidad
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export default function RealSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const cold = readVar("--ice", "#a8c8f0");
    const warm = readVar("--sky-sn", "#c79bff");
    const voidColor = readVar("--void", "#030409");

    let stars: Star[] = [];
    let bandStars: Star[] = []; // Estrellas concentradas en la Vía Láctea
    let deepSpaceStars: Star[] = [];
    let nebulae: Nebula[] = [];
    let isFocusedState = false;
    let deepAlpha = 0;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const mouse = { x: 0.5, y: 0.5 };
    const smooth = { x: 0.5, y: 0.5 };

    // Calcula la posición Y del centro de la Vía Láctea en un punto X dado.
    // Forma un arco suave que cruza la pantalla de esquina inferior-izquierda
    // a esquina superior-derecha, como se ve desde el hemisferio sur.
    function bandCenterY(xNorm: number): number {
      // Arco parabólico: sube desde abajo-izquierda, cruza el centro arriba, baja a la derecha
      const arch = -0.6 * Math.pow(xNorm - 0.5, 2) + 0.52;
      return arch * h;
    }

    // Ancho de la banda en un punto dado (más ancha en el centro galáctico)
    function bandWidth(xNorm: number): number {
      const centerProximity = 1 - Math.abs(xNorm - 0.45) * 1.2;
      return h * (0.08 + 0.14 * Math.max(0, centerProximity));
    }

    // Distancia de un punto al eje central de la Vía Láctea (normalizada 0..1)
    function bandDistance(x: number, y: number): number {
      const xn = x / w;
      const cy = bandCenterY(xn);
      const bw = bandWidth(xn);
      return Math.abs(y - cy) / (bw * 0.5);
    }

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const rng = seededRandom(42);

      // === ESTRELLAS DE CAMPO (distribuidas por todo el cielo) ===
      const count = Math.min(Math.floor((w * h) / 1600), 800);
      stars = [];
      for (let i = 0; i < count; i++) {
        const x = rng() * w;
        let y = rng() * h;
        // Leve concentración hacia la banda
        if (rng() < 0.2) {
          const xn = x / w;
          const cy = bandCenterY(xn);
          y = cy + (rng() - 0.5) * h * 0.6;
        }
        const b = Math.pow(rng(), 3.2);
        stars.push({
          x,
          y,
          r: 0.4 + b * 1.7,
          base: 0.25 + b * 0.75,
          tw: rng() * Math.PI * 2,
          twSpeed: 0.4 + rng() * 1.4,
          hue: (rng() - 0.5) * 2,
        });
      }

      // === ESTRELLAS DE LA VÍA LÁCTEA (densas, pequeñas, concentradas en la banda) ===
      bandStars = [];
      const bandCount = Math.min(Math.floor((w * h) / 800), 1400);
      for (let i = 0; i < bandCount; i++) {
        const xn = rng();
        const x = xn * w;
        const cy = bandCenterY(xn);
        const bw = bandWidth(xn);
        // Distribución gaussiana centrada en la banda
        const spread = (rng() + rng() + rng()) / 3; // aproximación gaussiana
        const offset = (spread - 0.5) * bw * 1.2;
        const y = cy + offset;

        if (y < -20 || y > h + 20) continue;

        const distFromCenter = Math.abs(offset) / (bw * 0.5);
        // Más brillantes cerca del centro de la banda
        const brightBoost = Math.max(0, 1 - distFromCenter);
        const b = Math.pow(rng(), 2.5 + distFromCenter * 2);

        bandStars.push({
          x,
          y,
          r: 0.2 + b * 0.9 + brightBoost * 0.3,
          base: (0.15 + b * 0.5 + brightBoost * 0.2) * (0.4 + brightBoost * 0.6),
          tw: rng() * Math.PI * 2,
          twSpeed: 0.6 + rng() * 2.0,
          // Más cálidas hacia el centro galáctico (xn ~ 0.45)
          hue: (rng() - 0.5) * 2 + (1 - Math.abs(xn - 0.45) * 2) * 0.5,
        });
      }

      // === NUBES DE NEBULOSIDAD ===
      nebulae = [];
      const nebulaColors = [
        "rgba(120, 100, 160, ALPHA)", // Violeta pálido
        "rgba(100, 130, 180, ALPHA)", // Azul frío
        "rgba(160, 120, 100, ALPHA)", // Marrón cálido (polvo)
        "rgba(140, 140, 170, ALPHA)", // Gris lavanda
        "rgba(90, 80, 130, ALPHA)",   // Violeta oscuro
        "rgba(130, 110, 90, ALPHA)",  // Ocre oscuro
        "rgba(100, 120, 140, ALPHA)", // Azul grisáceo
      ];
      const nebulaCount = 25;
      for (let i = 0; i < nebulaCount; i++) {
        const xn = rng() * 0.9 + 0.05;
        const cy = bandCenterY(xn);
        const bw = bandWidth(xn);
        const offset = (rng() - 0.5) * bw * 0.8;

        const baseAlpha = 0.02 + rng() * 0.06;
        const colorTemplate = nebulaColors[Math.floor(rng() * nebulaColors.length)];

        nebulae.push({
          x: xn * w,
          y: cy + offset,
          rx: 30 + rng() * 80,
          ry: 15 + rng() * 45,
          alpha: baseAlpha,
          color: colorTemplate,
          rotation: (rng() - 0.5) * 0.8,
        });
      }

      // === MICRO-ESTRELLAS DE ESPACIO PROFUNDO (reveladas con zoom) ===
      deepSpaceStars = [];
      const deepCount = Math.min(Math.floor((w * h) / 1800), 650);
      for (let i = 0; i < deepCount; i++) {
        const x = rng() * w;
        const y = rng() * h;
        const b = Math.pow(rng(), 2.8);
        deepSpaceStars.push({
          x,
          y,
          r: 0.2 + b * 1.1,
          base: 0.2 + b * 0.8,
          tw: rng() * Math.PI * 2,
          twSpeed: 0.8 + rng() * 2.2,
          hue: (rng() - 0.5) * 2,
        });
      }
    }

    // Dibuja la Vía Láctea: múltiples capas de gradientes radiales a lo largo del arco
    function drawMilkyWay() {
      ctx!.save();
      ctx!.globalCompositeOperation = "lighter";

      // CAPA 1: Resplandor difuso principal a lo largo del arco
      const steps = 30;
      for (let i = 0; i <= steps; i++) {
        const xn = i / steps;
        const x = xn * w;
        const cy = bandCenterY(xn);
        const bw = bandWidth(xn);

        // El núcleo galáctico es más brillante (xn ~ 0.4-0.5)
        const coreProximity = Math.max(0, 1 - Math.abs(xn - 0.45) * 2.5);
        const baseAlpha = 0.015 + coreProximity * 0.04;

        const grad = ctx!.createRadialGradient(x, cy, 0, x, cy, bw);
        grad.addColorStop(0, `rgba(180, 170, 200, ${baseAlpha * 1.8})`);
        grad.addColorStop(0.15, `rgba(140, 130, 170, ${baseAlpha * 1.4})`);
        grad.addColorStop(0.3, `rgba(120, 115, 150, ${baseAlpha})`);
        grad.addColorStop(0.6, `rgba(80, 75, 110, ${baseAlpha * 0.5})`);
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.ellipse(x, cy, bw, bw * 0.7, 0, 0, Math.PI * 2);
        ctx!.fill();
      }

      // CAPA 2: Núcleo galáctico más intenso y cálido
      const coreX = w * 0.45;
      const coreY = bandCenterY(0.45);
      const coreBW = bandWidth(0.45);

      const coreGrad = ctx!.createRadialGradient(coreX, coreY, 0, coreX, coreY, coreBW * 0.6);
      coreGrad.addColorStop(0, "rgba(220, 200, 180, 0.06)");
      coreGrad.addColorStop(0.3, "rgba(180, 160, 140, 0.04)");
      coreGrad.addColorStop(0.6, "rgba(140, 120, 130, 0.02)");
      coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx!.fillStyle = coreGrad;
      ctx!.beginPath();
      ctx!.ellipse(coreX, coreY, coreBW * 0.6, coreBW * 0.35, -0.15, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.restore();

      // CAPA 3: Nubes de nebulosidad (no aditivas, más sutiles)
      ctx!.save();
      for (const neb of nebulae) {
        ctx!.save();
        ctx!.translate(neb.x, neb.y);
        ctx!.rotate(neb.rotation);

        const nebGrad = ctx!.createRadialGradient(0, 0, 0, 0, 0, Math.max(neb.rx, neb.ry));
        const c = neb.color.replace("ALPHA", String(neb.alpha));
        const cFade = neb.color.replace("ALPHA", "0");
        nebGrad.addColorStop(0, c);
        nebGrad.addColorStop(0.4, c);
        nebGrad.addColorStop(1, cFade);

        ctx!.fillStyle = nebGrad;
        ctx!.beginPath();
        ctx!.ellipse(0, 0, neb.rx, neb.ry, 0, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }
      ctx!.restore();

      // CAPA 4: Bandas oscuras de polvo (restar luz con darken)
      ctx!.save();
      ctx!.globalCompositeOperation = "multiply";
      const dustCount = 12;
      const dustRng = seededRandom(777);
      for (let i = 0; i < dustCount; i++) {
        const xn = dustRng() * 0.8 + 0.1;
        const cy = bandCenterY(xn);
        const bw = bandWidth(xn);
        const offset = (dustRng() - 0.5) * bw * 0.3;

        const dx = xn * w;
        const dy = cy + offset;
        const drx = 20 + dustRng() * 50;
        const dry = 5 + dustRng() * 15;
        const rot = (dustRng() - 0.5) * 0.6;

        const dustGrad = ctx!.createRadialGradient(0, 0, 0, 0, 0, Math.max(drx, dry));
        const da = 0.92 + dustRng() * 0.06;
        dustGrad.addColorStop(0, `rgba(3, 4, 9, ${1 - da})`);
        dustGrad.addColorStop(0.5, `rgba(3, 4, 9, ${(1 - da) * 0.5})`);
        dustGrad.addColorStop(1, "rgba(3, 4, 9, 0)");

        ctx!.save();
        ctx!.translate(dx, dy);
        ctx!.rotate(rot);
        ctx!.fillStyle = dustGrad;
        ctx!.beginPath();
        ctx!.ellipse(0, 0, drx, dry, 0, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }
      ctx!.restore();
    }

    function hexMix(a: string, b: string, t: number): string {
      const pa = a.replace("#", "");
      const pb = b.replace("#", "");
      const ar = parseInt(pa.slice(0, 2), 16);
      const ag = parseInt(pa.slice(2, 4), 16);
      const ab = parseInt(pa.slice(4, 6), 16);
      const br = parseInt(pb.slice(0, 2), 16);
      const bg = parseInt(pb.slice(2, 4), 16);
      const bb = parseInt(pb.slice(4, 6), 16);
      const r = Math.round(ar + (br - ar) * t);
      const g = Math.round(ag + (bg - ag) * t);
      const bl = Math.round(ab + (bb - ab) * t);
      return `rgb(${r},${g},${bl})`;
    }

    let raf = 0;
    let t = 0;

    // Estado del efecto cinematográfico de viajes en hiperespacio (Warp Speed / Starburst)
    let warpState: { x: number; y: number; startTime: number } | null = null;
    const WARP_DURATION = 0.85; // segundos

    function onWarp(e: Event) {
      const customEvent = e as CustomEvent<{ x?: number; y?: number; isFocused?: boolean }>;
      if (customEvent.detail) {
        if (customEvent.detail.x !== undefined && customEvent.detail.y !== undefined) {
          warpState = {
            x: customEvent.detail.x,
            y: customEvent.detail.y,
            startTime: performance.now() / 1000,
          };
        }
        if (customEvent.detail.isFocused !== undefined) {
          isFocusedState = customEvent.detail.isFocused;
        }
      }
    }

    function frame() {
      t += 0.016;
      const now = performance.now() / 1000;
      smooth.x += (mouse.x - smooth.x) * 0.04;
      smooth.y += (mouse.y - smooth.y) * 0.04;
      const px = (smooth.x - 0.5) * 18;
      const py = (smooth.y - 0.5) * 18;

      // Transición suave del campo de micro-estrellas de espacio profundo al hacer zoom
      const targetDeepAlpha = isFocusedState ? 1 : 0;
      deepAlpha += (targetDeepAlpha - deepAlpha) * 0.05;

      // Cálculo del progreso de hiperespacio (0 a 1)
      let warpProgress = 0;
      let intensity = 0;
      let wx = w * 0.5;
      let wy = h * 0.5;

      if (warpState) {
        const elapsed = now - warpState.startTime;
        if (elapsed < WARP_DURATION) {
          warpProgress = elapsed / WARP_DURATION;
          // Curva suave de aceleración/desaceleración estilo película
          intensity = Math.sin(warpProgress * Math.PI);
          wx = warpState.x;
          wy = warpState.y;
        } else {
          warpState = null;
        }
      }

      // === FONDO ===
      ctx!.fillStyle = voidColor;
      ctx!.fillRect(0, 0, w, h);

      // Desplazamiento sutil del fondo completo (parallax del mouse + movimiento durante zoom)
      ctx!.save();
      const zoomShift = isFocusedState ? 8 : 0;
      ctx!.translate(px * 0.5 + zoomShift * (smooth.x - 0.5), py * 0.5 + zoomShift * (smooth.y - 0.5));

      // Dibujar Vía Láctea con todas sus capas
      drawMilkyWay();

      // === ESTRELLAS DE LA VÍA LÁCTEA (densas, pequeñas) ===
      if (intensity <= 0.05) {
        for (const s of bandStars) {
          const twinkle = reduced ? 1 : 0.7 + 0.3 * Math.sin(t * s.twSpeed + s.tw);
          const alpha = s.base * twinkle;
          const depth = s.r / 3;
          const sx = s.x + px * depth;
          const sy = s.y + py * depth;
          const color = hexMix(cold, warm, Math.max(0, Math.min(1, (s.hue + 1) / 2)));

          ctx!.beginPath();
          ctx!.arc(sx, sy, s.r, 0, Math.PI * 2);
          ctx!.fillStyle = color;
          ctx!.globalAlpha = alpha;
          ctx!.fill();
        }
      }
      ctx!.restore();

      // Render de micro-estrellas de espacio profundo (al estar enfocado)
      if (deepAlpha > 0.01 && intensity <= 0.05) {
        for (const ds of deepSpaceStars) {
          const twinkle = reduced ? 1 : 0.7 + 0.3 * Math.sin(t * ds.twSpeed + ds.tw);
          const alpha = ds.base * twinkle * deepAlpha * 0.85;
          const color = hexMix(cold, warm, (ds.hue + 1) / 2);
          ctx!.beginPath();
          ctx!.arc(ds.x, ds.y, ds.r, 0, Math.PI * 2);
          ctx!.fillStyle = color;
          ctx!.globalAlpha = alpha;
          ctx!.fill();
        }
      }

      // === ESTRELLAS DE CAMPO ===
      for (const s of stars) {
        const twinkle = reduced ? 1 : 0.7 + 0.3 * Math.sin(t * s.twSpeed + s.tw);
        const alpha = s.base * twinkle;
        const depth = s.r / 2.1;
        const sx = s.x + px * depth;
        const sy = s.y + py * depth;
        const color = hexMix(cold, warm, (s.hue + 1) / 2);

        if (intensity > 0.02) {
          // EFECTO WARP STREAKS: Estelas radiales saliendo del punto de origen
          const dx = sx - wx;
          const dy = sy - wy;
          const dist = Math.hypot(dx, dy) || 1;
          const ux = dx / dist;
          const uy = dy / dist;

          const streakLength = Math.min(dist * intensity * 0.95, 180 * intensity);
          const ex = sx + ux * streakLength;
          const ey = sy + uy * streakLength;

          const grad = ctx!.createLinearGradient(sx, sy, ex, ey);
          grad.addColorStop(0, color);
          grad.addColorStop(1, "rgba(255, 255, 255, 0)");

          ctx!.beginPath();
          ctx!.moveTo(sx, sy);
          ctx!.lineTo(ex, ey);
          ctx!.strokeStyle = grad;
          ctx!.lineWidth = s.r * (1 + intensity * 1.5);
          ctx!.globalAlpha = alpha * (0.6 + intensity * 0.4);
          ctx!.stroke();
        } else {
          // Estado normal sin hiperespacio
          ctx!.beginPath();
          ctx!.arc(sx, sy, s.r, 0, Math.PI * 2);
          ctx!.fillStyle = color;
          ctx!.globalAlpha = alpha;
          ctx!.fill();

          if (s.r > 1.3) {
            const halo = ctx!.createRadialGradient(sx, sy, 0, sx, sy, s.r * 5);
            halo.addColorStop(0, color);
            halo.addColorStop(1, "transparent");
            ctx!.globalAlpha = alpha * 0.25;
            ctx!.fillStyle = halo;
            ctx!.beginPath();
            ctx!.arc(sx, sy, s.r * 5, 0, Math.PI * 2);
            ctx!.fill();
          }
        }
      }

      // DESTELLO CINEMATOGRÁFICO DE LUZ (STARBURST / LENS FLARE)
      if (intensity > 0.05) {
        ctx!.save();
        ctx!.globalCompositeOperation = "lighter";

        // Halo radiante central
        const flareRadius = 120 * intensity;
        const flareGrad = ctx!.createRadialGradient(wx, wy, 0, wx, wy, flareRadius);
        flareGrad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
        flareGrad.addColorStop(0.2, "rgba(168, 200, 240, 0.7)");
        flareGrad.addColorStop(0.6, "rgba(127, 230, 214, 0.3)");
        flareGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx!.fillStyle = flareGrad;
        ctx!.beginPath();
        ctx!.arc(wx, wy, flareRadius, 0, Math.PI * 2);
        ctx!.fill();

        // Rayos de luz radiales explotando desde el centro (Starburst Light Rays)
        const rayCount = 16;
        ctx!.strokeStyle = "rgba(200, 230, 255, " + (0.5 * intensity) + ")";
        for (let i = 0; i < rayCount; i++) {
          const angle = (i / rayCount) * Math.PI * 2 + t * 0.2;
          const rayLen = (180 + Math.sin(i * 3 + t * 4) * 60) * intensity;
          ctx!.beginPath();
          ctx!.moveTo(wx, wy);
          ctx!.lineTo(wx + Math.cos(angle) * rayLen, wy + Math.sin(angle) * rayLen);
          ctx!.lineWidth = i % 2 === 0 ? 2 : 1;
          ctx!.stroke();
        }

        ctx!.restore();
      }

      ctx!.globalAlpha = 1;

      if (!reduced) raf = requestAnimationFrame(frame);
    }

    function onMove(e: MouseEvent) {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = e.clientY / window.innerHeight;
    }

    build();
    frame();
    window.addEventListener("resize", build);
    window.addEventListener("celestial-warp", onWarp);
    if (!reduced) window.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", build);
      window.removeEventListener("celestial-warp", onWarp);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: "var(--void)",
      }}
    />
  );
}
