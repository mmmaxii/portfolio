# Portafolio · Maximiliano Valderrama

Un cielo real con zoom (Aladin Lite + HiPS del CDS) y tres filtros: ultravioleta, visible e infrarrojo. Cada filtro agrupa un tipo de trabajo y cada objeto real del cielo es un proyecto. Al acercarse a un objeto aparece su imagen profunda (ESO, ESA/Hubble) ubicada con su astrometría AVM. Abajo, una bitácora con scroll: sobre mí, el espectro de herramientas, el catálogo de proyectos y contacto.

- **Stack:** Next.js (App Router) + TypeScript, CSS global con tokens, Aladin Lite v3 cargado desde el CDS.
- **Contenido:** todo vive en [`data/content.ts`](data/content.ts): bandas, objetos (con su proyecto e imagen profunda) y el espectro de herramientas.
- **Versión anterior:** el mapa estelar dibujado con CSS quedó en [`version-beta/`](version-beta/).

## Desarrollo

```bash
npm install
npm run dev    # http://localhost:3000
npm run build
```

## Agregar un proyecto al cielo

1. Elige un objeto real y su banda (`uv`, `vis` o `ir`) y agrégalo a `TARGETS` con su RA/Dec (ICRS, grados).
2. Para la imagen profunda, busca la imagen en [AstroPix](https://www.astropix.org) y copia sus metadatos AVM:
   `widthDeg = |escala| × ancho_px`, `fx = refX / ancho`, `fy = 1 − refY / alto` (AVM cuenta Y desde abajo) y `rot = Spatial.Rotation`.
3. Si el proyecto usa herramientas nuevas, agrégalas en `SPECTRUM` con sus fuentes en `SOURCES`.
