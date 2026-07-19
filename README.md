# Portafolio — Maximiliano Valderrama

Portafolio personal con estética de **mapa estelar interactivo**: un evento astronómico central rodeado de objetos celestes clickeables (planeta, galaxia espiral, disco protoplanetario, cúmulo estelar y púlsar), cada uno abriendo una sección del sitio. En pantallas menores a 1024px se muestra un layout de scroll vertical clásico con el mismo contenido.

- **Stack:** Next.js (App Router) + TypeScript, CSS Modules, [ogl](https://github.com/oframe/ogl) para el fondo Galaxy (WebGL, componente de [React Bits](https://reactbits.dev)).
- **Contenido:** todo el contenido vive tipado en [`data/content.ts`](data/content.ts).
- **Sin backend:** sitio 100% estático, pensado para Vercel.

## Desarrollo

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # build de producción
```

## Estructura

```
app/                  # layout (fuentes, metadata), page, globals.css
components/
  background/         # fondo Galaxy (WebGL)
  starmap/            # mapa estelar desktop (objetos SVG + estrella central)
  panel/              # <dialog> modal de secciones
  sections/           # contenido compartido desktop/móvil
  mobile/             # layout scroll para pantallas chicas
  ui/                 # carrusel, tabs, visor de GIFs, íconos
data/content.ts       # fuente de verdad del contenido (español)
public/img/           # imágenes y GIFs de proyectos/simulaciones
```
