import { skyObjects, type SectionId } from "@/data/content";

/*
 * Constelación del cielo: conecta los 6 objetos en un orden que dibuja una "M"
 * (Proyectos → Astronomía → Sobre mí → IA → Tecnología → Contacto), con
 * estrellas intermedias entre cada par para que parezca un asterismo real.
 * Todo se calcula de forma determinista (jitter con semilla) → estable en SSR.
 */

export const constellationOrder: SectionId[] = [
  "projects",
  "research",
  "about",
  "ai",
  "tech",
  "contact",
];

/** Duración del dibujo secuencial de la constelación. */
export const DRAW_MS = 2600;

export interface ConPoint {
  x: number; // % horizontal
  y: number; // % vertical
  fraction: number; // 0..1 posición a lo largo del trazo (para sincronizar)
  kind: "object" | "star";
  id?: SectionId;
}

function seeded(i: number): number {
  const s = Math.sin(i * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

export interface ConstellationData {
  points: ConPoint[];
  polyPoints: string;
  objectFraction: Record<string, number>;
}

export function buildConstellation(): ConstellationData {
  const ordered = constellationOrder.map((id) => {
    const o = skyObjects.find((s) => s.id === id)!;
    return { id, x: parseFloat(o.position.left), y: parseFloat(o.position.top) };
  });

  const raw: { x: number; y: number; kind: "object" | "star"; id?: SectionId }[] = [];
  const INTER = 2; // estrellas intermedias por segmento
  for (let i = 0; i < ordered.length; i++) {
    raw.push({ x: ordered[i].x, y: ordered[i].y, kind: "object", id: ordered[i].id });
    if (i < ordered.length - 1) {
      const a = ordered[i];
      const b = ordered[i + 1];
      for (let k = 1; k <= INTER; k++) {
        const t = k / (INTER + 1);
        // Jitter perpendicular al segmento para un trazo natural (no recto)
        const jx = (seeded(i * 10 + k) - 0.5) * -(b.y - a.y) * 0.14;
        const jy = (seeded(i * 10 + k + 5) - 0.5) * (b.x - a.x) * 0.14;
        raw.push({
          x: a.x + (b.x - a.x) * t + jx,
          y: a.y + (b.y - a.y) * t + jy,
          kind: "star",
        });
      }
    }
  }

  let total = 0;
  const cum: number[] = [0];
  for (let i = 1; i < raw.length; i++) {
    total += Math.hypot(raw[i].x - raw[i - 1].x, raw[i].y - raw[i - 1].y);
    cum.push(total);
  }

  const points: ConPoint[] = raw.map((p, i) => ({
    ...p,
    fraction: total ? cum[i] / total : 0,
  }));

  const objectFraction: Record<string, number> = {};
  points.forEach((p) => {
    if (p.kind === "object" && p.id) objectFraction[p.id] = p.fraction;
  });

  const polyPoints = points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
  return { points, polyPoints, objectFraction };
}
