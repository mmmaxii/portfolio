// Utilidades astronómicas pequeñas para el cielo.

export function fmtRA(ra: number): string {
  ra = ((ra % 360) + 360) % 360;
  // Se redondea primero a décimas de segundo para no mostrar "60.0s".
  const t = Math.round((ra / 15) * 36000) % 864000;
  const hh = Math.floor(t / 36000);
  const mm = Math.floor((t % 36000) / 600);
  const ss = (t % 600) / 10;
  return `${String(hh).padStart(2, "0")}h ${String(mm).padStart(2, "0")}m ${ss.toFixed(1).padStart(4, "0")}s`;
}

export function fmtDec(d: number): string {
  const s = d < 0 ? "−" : "+";
  const t = Math.round(Math.abs(d) * 3600);
  const dd = Math.floor(t / 3600);
  const mm = Math.floor((t % 3600) / 60);
  const ss = t % 60;
  return `${s}${String(dd).padStart(2, "0")}° ${String(mm).padStart(2, "0")}′ ${String(ss).padStart(2, "0")}″`;
}

export function fmtFov(f: number): string {
  if (f >= 1) return `${f.toFixed(1)}°`;
  if (f * 60 >= 1) return `${(f * 60).toFixed(1)}′`;
  return `${(f * 3600).toFixed(0)}″`;
}

/** Separación angular entre dos puntos (grados). */
export function sepDeg(ra1: number, dec1: number, ra2: number, dec2: number): number {
  const r = Math.PI / 180;
  const s1 = Math.sin(((dec2 - dec1) * r) / 2);
  const s2 = Math.sin(((ra2 - ra1) * r) / 2);
  const a = s1 * s1 + Math.cos(dec1 * r) * Math.cos(dec2 * r) * s2 * s2;
  return (2 * Math.asin(Math.min(1, Math.sqrt(a)))) / r;
}

/** Color aproximado de una longitud de onda visible (nm) como rgb. */
export function wavelengthRGB(l: number): [number, number, number] {
  l = Math.min(780, Math.max(380, l)); // fuera del visible se usa el borde violeta o rojo
  let r = 0, g = 0, b = 0;
  if (l >= 380 && l < 440) { r = -(l - 440) / 60; b = 1; }
  else if (l < 490) { g = (l - 440) / 50; b = 1; }
  else if (l < 510) { g = 1; b = -(l - 510) / 20; }
  else if (l < 580) { r = (l - 510) / 70; g = 1; }
  else if (l < 645) { r = 1; g = -(l - 645) / 65; }
  else if (l <= 780) { r = 1; }
  let f = 1;
  if (l < 420) f = 0.3 + (0.7 * (l - 380)) / 40;
  else if (l > 700) f = 0.3 + (0.7 * (780 - l)) / 80;
  const c = (v: number) => Math.round(255 * Math.pow(v * f, 0.8));
  return [c(r), c(g), c(b)];
}
