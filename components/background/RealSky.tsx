"use client";

import { useEffect, useRef } from "react";

/*
 * Cielo nocturno realista dibujado por código sobre <canvas>.
 * - Vista general (cielo amplio):
 *   - Vía Láctea austral realista con polvo, nebulosas y concentración densa de estrellas.
 *   - Campo estelar amplio con parpadeo y distribución natural de magnitudes.
 * - Vista enfocada (zoom profundo en fuente):
 *   - El fondo denso y la Vía Láctea se desvanecen por completo.
 *   - Quedan solo unas pocas estrellas sueltas y dispersas en el vacío profundo,
 *     dando la sensación de zoom extremo y garantizando máxima legibilidad.
 * - Efecto cinematográfico de hiperespacio (Warp Speed / Starburst) durante la transición.
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
    let sparseZoomStars: Star[] = []; // Pocas estrellas sueltas para zoom profundo
    let nebulae: Nebula[] = [];
    let isFocusedState = false;
    let focusFade = 0; // 0 = cielo amplio, 1 = zoom profundo enfocado

    let w = 0;
    let h = 0;
    let dpr = 1;
    const mouse = { x: 0.5, y: 0.5 };
    const smooth = { x: 0.5, y: 0.5 };

    // Calcula la posición Y del centro de la Vía Láctea en un punto X dado.
    function bandCenterY(xNorm: number): number {
      const arch = -0.6 * Math.pow(xNorm - 0.5, 2) + 0.52;
      return arch * h;
    }

    // Ancho de la banda en un punto dado
    function bandWidth(xNorm: number): number {
      const centerProximity = 1 - Math.abs(xNorm - 0.45) * 1.2;
      return h * (0.08 + 0.14 * Math.max(0, centerProximity));
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

      // === ESTRELLAS DE CAMPO (cielo amplio) ===
      const count = Math.min(Math.floor((w * h) / 1600), 800);
      stars = [];
      for (let i = 0; i < count; i++) {
        const x = rng() * w;
        let y = rng() * h;
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

      // === ESTRELLAS DE LA VÍA LÁCTEA (densas, concentradas en la banda) ===
      bandStars = [];
      const bandCount = Math.min(Math.floor((w * h) / 800), 1400);
      for (let i = 0; i < bandCount; i++) {
        const xn = rng();
        const x = xn * w;
        const cy = bandCenterY(xn);
        const bw = bandWidth(xn);
        const spread = (rng() + rng() + rng()) / 3;
        const offset = (spread - 0.5) * bw * 1.2;
        const y = cy + offset;

        if (y < -20 || y > h + 20) continue;

        const distFromCenter = Math.abs(offset) / (bw * 0.5);
        const brightBoost = Math.max(0, 1 - distFromCenter);
        const b = Math.pow(rng(), 2.5 + distFromCenter * 2);

        bandStars.push({
          x,
          y,
          r: 0.2 + b * 0.9 + brightBoost * 0.3,
          base: (0.15 + b * 0.5 + brightBoost * 0.2) * (0.4 + brightBoost * 0.6),
          tw: rng() * Math.PI * 2,
          twSpeed: 0.6 + rng() * 2.0,
          hue: (rng() - 0.5) * 2 + (1 - Math.abs(xn - 0.45) * 2) * 0.5,
        });
      }

      // === NUBES DE NEBULOSIDAD (Vía Láctea) ===
      nebulae = [];
      const nebulaColors = [
        "rgba(120, 100, 160, ALPHA)",
        "rgba(100, 130, 180, ALPHA)",
        "rgba(160, 120, 100, ALPHA)",
        "rgba(140, 140, 170, ALPHA)",
        "rgba(90, 80, 130, ALPHA)",
        "rgba(130, 110, 90, ALPHA)",
        "rgba(100, 120, 140, ALPHA)",
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

      // === ESTRELLAS SUELTAS PARA ZOOM PROFUNDO (muy pocas, sutiles y limpias) ===
      sparseZoomStars = [];
      const sparseCount = 26; // Solo ~26 estrellas en toda la pantalla
      for (let i = 0; i < sparseCount; i++) {
        const x = rng() * w;
        const y = rng() * h;
        const b = Math.pow(rng(), 2.0);
        sparseZoomStars.push({
          x,
          y,
          r: 0.4 + b * 1.1,
          base: 0.2 + b * 0.5,
          tw: rng() * Math.PI * 2,
          twSpeed: 0.3 + rng() * 0.8,
          hue: (rng() - 0.5) * 2,
        });
      }
    }

    // Dibuja la Vía Láctea modulada por el factor de desvanecimiento
    function drawMilkyWay(globalFade: number) {
      if (globalFade <= 0.001) return;

      ctx!.save();
      ctx!.globalCompositeOperation = "lighter";

      // CAPA 1: Resplandor difuso principal a lo largo del arco
      const steps = 30;
      for (let i = 0; i <= steps; i++) {
        const xn = i / steps;
        const x = xn * w;
        const cy = bandCenterY(xn);
        const bw = bandWidth(xn);

        const coreProximity = Math.max(0, 1 - Math.abs(xn - 0.45) * 2.5);
        const baseAlpha = (0.015 + coreProximity * 0.04) * globalFade;

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
      coreGrad.addColorStop(0, `rgba(220, 200, 180, ${0.06 * globalFade})`);
      coreGrad.addColorStop(0.3, `rgba(180, 160, 140, ${0.04 * globalFade})`);
      coreGrad.addColorStop(0.6, `rgba(140, 120, 130, ${0.02 * globalFade})`);
      coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx!.fillStyle = coreGrad;
      ctx!.beginPath();
      ctx!.ellipse(coreX, coreY, coreBW * 0.6, coreBW * 0.35, -0.15, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.restore();

      // CAPA 3: Nubes de nebulosidad
      ctx!.save();
      for (const neb of nebulae) {
        ctx!.save();
        ctx!.translate(neb.x, neb.y);
        ctx!.rotate(neb.rotation);

        const nebGrad = ctx!.createRadialGradient(0, 0, 0, 0, 0, Math.max(neb.rx, neb.ry));
        const c = neb.color.replace("ALPHA", String(neb.alpha * globalFade));
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

      // CAPA 4: Bandas oscuras de polvo
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
        const dustAlpha = (1 - da) * globalFade;
        dustGrad.addColorStop(0, `rgba(3, 4, 9, ${dustAlpha})`);
        dustGrad.addColorStop(0.5, `rgba(3, 4, 9, ${dustAlpha * 0.5})`);
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

    // Estado del efecto cinematográfico de hiperespacio (Warp Speed / Starburst)
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

      // Transición suave: 0 = cielo amplio, 1 = zoom profundo
      const targetFocus = isFocusedState ? 1 : 0;
      focusFade += (targetFocus - focusFade) * 0.07;
      const wideAlpha = Math.max(0, 1 - focusFade);

      // Cálculo del progreso de hiperespacio (0 a 1)
      let warpProgress = 0;
      let intensity = 0;
      let wx = w * 0.5;
      let wy = h * 0.5;

      if (warpState) {
        const elapsed = now - warpState.startTime;
        if (elapsed < WARP_DURATION) {
          warpProgress = elapsed / WARP_DURATION;
          intensity = Math.sin(warpProgress * Math.PI);
          wx = warpState.x;
          wy = warpState.y;
        } else {
          warpState = null;
        }
      }

      // === FONDO VACÍO PROFUNDO ===
      ctx!.fillStyle = voidColor;
      ctx!.fillRect(0, 0, w, h);

      // === VÍA LÁCTEA Y ESTRELLAS DE LA BANDA (se desvanecen al hacer zoom) ===
      if (wideAlpha > 0.002) {
        ctx!.save();
        const zoomShift = isFocusedState ? 8 : 0;
        ctx!.translate(px * 0.5 + zoomShift * (smooth.x - 0.5), py * 0.5 + zoomShift * (smooth.y - 0.5));

        // Dibujar Vía Láctea con opacidad modulada
        drawMilkyWay(wideAlpha);

        // Estrellas densas de la Vía Láctea
        if (intensity <= 0.05) {
          for (const s of bandStars) {
            const twinkle = reduced ? 1 : 0.7 + 0.3 * Math.sin(t * s.twSpeed + s.tw);
            const alpha = s.base * twinkle * wideAlpha;
            if (alpha < 0.005) continue;

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
      }

      // === ESTRELLAS DE CAMPO AMPLIO ===
      if (wideAlpha > 0.002 || intensity > 0.02) {
        for (const s of stars) {
          const twinkle = reduced ? 1 : 0.7 + 0.3 * Math.sin(t * s.twSpeed + s.tw);
          const alpha = s.base * twinkle;
          const depth = s.r / 2.1;
          const sx = s.x + px * depth;
          const sy = s.y + py * depth;
          const color = hexMix(cold, warm, (s.hue + 1) / 2);

          if (intensity > 0.02) {
            // EFECTO WARP STREAKS: Estelas radiales
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
            const currentAlpha = alpha * wideAlpha;
            if (currentAlpha < 0.005) continue;

            ctx!.beginPath();
            ctx!.arc(sx, sy, s.r, 0, Math.PI * 2);
            ctx!.fillStyle = color;
            ctx!.globalAlpha = currentAlpha;
            ctx!.fill();

            if (s.r > 1.3) {
              const halo = ctx!.createRadialGradient(sx, sy, 0, sx, sy, s.r * 5);
              halo.addColorStop(0, color);
              halo.addColorStop(1, "transparent");
              ctx!.globalAlpha = currentAlpha * 0.25;
              ctx!.fillStyle = halo;
              ctx!.beginPath();
              ctx!.arc(sx, sy, s.r * 5, 0, Math.PI * 2);
              ctx!.fill();
            }
          }
        }
      }

      // === ESTRELLAS SUELTAS EN ZOOM PROFUNDO ===
      // Al hacer zoom, solo quedan unas pocas estrellas dispersas en el fondo oscuro
      if (focusFade > 0.005 && intensity <= 0.05) {
        for (const s of sparseZoomStars) {
          const twinkle = reduced ? 1 : 0.75 + 0.25 * Math.sin(t * s.twSpeed + s.tw);
          const alpha = s.base * twinkle * focusFade;
          const depth = s.r / 2.2;
          const sx = s.x + px * depth;
          const sy = s.y + py * depth;
          const color = hexMix(cold, warm, (s.hue + 1) / 2);

          ctx!.beginPath();
          ctx!.arc(sx, sy, s.r, 0, Math.PI * 2);
          ctx!.fillStyle = color;
          ctx!.globalAlpha = alpha;
          ctx!.fill();

          if (s.r > 1.1) {
            const halo = ctx!.createRadialGradient(sx, sy, 0, sx, sy, s.r * 4);
            halo.addColorStop(0, color);
            halo.addColorStop(1, "transparent");
            ctx!.globalAlpha = alpha * 0.3;
            ctx!.fillStyle = halo;
            ctx!.beginPath();
            ctx!.arc(sx, sy, s.r * 4, 0, Math.PI * 2);
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
