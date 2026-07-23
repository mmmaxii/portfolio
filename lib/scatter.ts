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

export function scatterChildPositions(count: number): { x: number; y: number }[] {
  if (count === 0) return [];
  const positions: { x: number; y: number }[] = [];

  // Anillo orbital simétrico centrado alrededor de la estrella enfocada en el centro (50% X, 40% Y)
  const centerX = 50;
  const centerY = 40;
  const radiusX = 27; // % del viewport en X
  const radiusY = 24; // % del viewport en Y

  // Distribución circular simétrica y balanceada
  const startAngle = -Math.PI * 0.75;
  const stepAngle = (Math.PI * 2) / count;

  for (let i = 0; i < count; i++) {
    const angle = startAngle + i * stepAngle;
    const rVar = i % 2 === 1 ? 1.05 : 0.95;
    const x = centerX + Math.cos(angle) * radiusX * rVar;
    const y = centerY + Math.sin(angle) * radiusY * rVar;

    positions.push({
      x: Math.min(92, Math.max(8, Number(x.toFixed(2)))),
      y: Math.min(88, Math.max(10, Number(y.toFixed(2)))),
    });
  }

  return positions;
}
