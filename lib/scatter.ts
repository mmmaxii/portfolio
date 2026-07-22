/*
 * Dispersión orgánica (tipo campo estelar) de los sub-portales de un objeto
 * enfocado, a la derecha de la pantalla. Determinista (semillas), estable en SSR.
 */

function seeded(i: number): number {
  const s = Math.sin(i * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

function hashSeed(id: string, i: number): number {
  let h = 0;
  const s = `${id}-${i}`;
  for (let c = 0; c < s.length; c++) h = (h * 31 + s.charCodeAt(c)) | 0;
  return Math.abs(h % 997) + i * 7;
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function scatterChildPositions(objectId: string, count: number): { x: number; y: number }[] {
  if (count === 0) return [];
  const bandH = 68 / count;
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const seed = hashSeed(objectId, i);
    const rx = seeded(seed);
    const ry = seeded(seed + 91);
    const y = 14 + bandH * i + ry * bandH * 0.75;
    const zigzag = i % 2 === 1 ? 7 : -5;
    const x = 42 + rx * 44 + zigzag;
    positions.push({ x: clamp(x, 38, 92), y: clamp(y, 10, 88) });
  }
  return positions;
}
