"use client";

import { useEffect, useRef } from "react";

/*
 * Cielo nocturno realista dibujado por código sobre <canvas>.
 * - Campo de estrellas con distribución de brillo realista (muchas tenues,
 *   pocas brillantes) y color-temperatura sutil.
 * - Banda difusa de la Vía Láctea austral.
 * - Parpadeo (twinkle) muy leve; parallax sutil con el mouse.
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

function readVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
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
    const bandColor = readVar("--amethyst-deep", "#6b4fae");
    const voidColor = readVar("--void", "#030409");

    let stars: Star[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    const mouse = { x: 0.5, y: 0.5 };
    const smooth = { x: 0.5, y: 0.5 };

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(Math.floor((w * h) / 1400), 900);
      stars = [];
      for (let i = 0; i < count; i++) {
        // Concentra levemente las estrellas hacia la banda diagonal (Vía Láctea)
        const x = Math.random() * w;
        let y = Math.random() * h;
        const bandY = h * 0.5 + (x - w * 0.5) * 0.35;
        if (Math.random() < 0.35) {
          y = bandY + (Math.random() - 0.5) * h * 0.5;
        }
        // Brillo: mayoría tenues, pocas muy brillantes (ley de potencia)
        const b = Math.pow(Math.random(), 3.2);
        stars.push({
          x,
          y,
          r: 0.4 + b * 1.7,
          base: 0.25 + b * 0.75,
          tw: Math.random() * Math.PI * 2,
          twSpeed: 0.4 + Math.random() * 1.4,
          hue: (Math.random() - 0.5) * 2,
        });
      }
    }

    function drawBand() {
      // Banda difusa de la Vía Láctea austral: gradiente suave inclinado
      ctx!.save();
      ctx!.translate(w * 0.5, h * 0.5);
      ctx!.rotate(0.34);
      const grad = ctx!.createLinearGradient(0, -h * 0.5, 0, h * 0.5);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.46, "transparent");
      grad.addColorStop(0.5, bandColor);
      grad.addColorStop(0.54, "transparent");
      grad.addColorStop(1, "transparent");
      ctx!.globalAlpha = 0.1;
      ctx!.fillStyle = grad;
      ctx!.fillRect(-w, -h, w * 2, h * 2);
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
      const customEvent = e as CustomEvent<{ x: number; y: number }>;
      if (customEvent.detail) {
        warpState = {
          x: customEvent.detail.x,
          y: customEvent.detail.y,
          startTime: performance.now() / 1000,
        };
      }
    }

    function frame() {
      t += 0.016;
      const now = performance.now() / 1000;
      smooth.x += (mouse.x - smooth.x) * 0.04;
      smooth.y += (mouse.y - smooth.y) * 0.04;
      const px = (smooth.x - 0.5) * 18;
      const py = (smooth.y - 0.5) * 18;

      ctx!.fillStyle = voidColor;
      ctx!.fillRect(0, 0, w, h);
      drawBand();

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
