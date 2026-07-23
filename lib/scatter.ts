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

export function scatterChildPositions(
  originLeft: number,
  originTop: number,
  count: number
): { x: number; y: number }[] {
  if (count === 0) return [];
  const positions: { x: number; y: number }[] = [];

  const isRight = originLeft > 50;
  const isTop = originTop < 40;

  // Dirección y rango del arco orbital alrededor del centro de la estrella enfocada
  let startAngle = isRight ? Math.PI * 0.75 : -Math.PI * 0.35;
  let endAngle = isRight ? Math.PI * 1.25 : Math.PI * 0.35;

  if (isTop) {
    startAngle += 0.25;
    endAngle += 0.25;
  }

  const stepAngle = count > 1 ? (endAngle - startAngle) / (count - 1) : 0;

  for (let i = 0; i < count; i++) {
    const angle = count === 1 ? (startAngle + endAngle) / 2 : startAngle + i * stepAngle;
    const r = 21 + (i % 2 === 1 ? 5 : 0);
    const x = originLeft + Math.cos(angle) * r * 1.15;
    const y = originTop + Math.sin(angle) * r * 0.95;

    positions.push({
      x: Math.min(88, Math.max(10, Number(x.toFixed(2)))),
      y: Math.min(86, Math.max(10, Number(y.toFixed(2)))),
    });
  }

  return positions;
}
