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

export function scatterChildPositions(_objectId: string, count: number): { x: number; y: number }[] {
  if (count === 0) return [];
  const positions: { x: number; y: number }[] = [];

  // Dispersión estructurada en arco orbital a la derecha del objeto enfocado
  const startY = 18;
  const endY = 82;
  const stepY = count > 1 ? (endY - startY) / (count - 1) : 0;

  for (let i = 0; i < count; i++) {
    const y = count === 1 ? 50 : startY + i * stepY;
    const normalized = count > 1 ? i / (count - 1) : 0.5; // 0 a 1
    // Curva en arco orbital: el centro se proyecta suavemente a la derecha
    const arcOffset = Math.sin(normalized * Math.PI) * 14;
    const staggerX = i % 2 === 1 ? 5 : 0;
    const x = 44 + arcOffset + staggerX;

    positions.push({
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
    });
  }

  return positions;
}
