// Textos de la interfaz en español e inglés. El contenido (bandas, objetos, espectro) vive en
// content.ts y su traducción en content-en.ts.

export type Locale = "es" | "en";

export const UI = {
  es: {
    lang: "es",
    otherLocale: { href: "/en", label: "EN", title: "Read in English" },
    nav: { sky: "Cielo", about: "Sobre mí", stack: "Stack", projects: "Proyectos", contact: "Contacto", cv: "CV ↓" },
    theme: { toDark: "Cambiar a tema oscuro", toLight: "Cambiar a tema claro", label: "Tema" },
    about: {
      k: "Sobre mí",
      h2: ["Datos del cielo,", "software en la tierra"],
      facts: [
        ["Base", "Los Ángeles, Biobío"],
        ["Formación", "Licenciatura en Astronomía"],
        ["Foco", "Backend Python y data science"],
        ["Proyección", "Discos protoplanetarios"],
      ],
      // **texto** se muestra en negrita
      paragraphs: [
        "Estudié la Licenciatura en Astronomía. Trabajé con datos de distintos catálogos e instrumentos astronómicos (Gaia DR3, TESS, MUSE, entre otros) y, en astrofísica experimental, con la simulación cosmológica IllustrisTNG. Ahí descubrí que lo que más disfruto es escribir el software que procesa esos datos.",
        "También me gustan mucho la física y las matemáticas, y de ahí salen proyectos como **Neural Geodesics**, sobre la trayectoria de la luz alrededor de agujeros negros, o la simulación de **lentes gravitacionales**.",
        "Hoy me enfoco en desarrollo backend y data science, con miras a la investigación astronómica más adelante.",
      ],
    },
    stack: {
      k: "Stack",
      h2: "Espectro de herramientas",
      lede: "Cada área de trabajo es un elemento químico y cada herramienta, una de sus líneas de emisión reales: el backend es la serie de Balmer del hidrógeno. La altura de la línea es el número de proyectos o cursos donde la usé. Baja para ir encendiendo los elementos.",
    },
    projects: {
      k: "Proyectos",
      h2: "Catálogo",
      lede: "Cada proyecto vive en un objeto real del cielo. Al abrirlo, la cámara vuela hasta él.",
      uses: "usa",
    },
    contact: { k: "Contacto", h2: "Hablemos", copy: "Copiar correo", copied: "Copiado", write: "Escribir ↗", cv: "Descargar CV ↓" },
    footer: [
      "Cielo: Aladin Lite (CDS, Strasbourg) con HiPS de Mellinger, DSS2 (STScI), 2MASS (UMass/IPAC-Caltech) y GALEX GR6/7 (NASA/JPL-Caltech). Imágenes profundas: ESO y ESA/Hubble (CC BY 4.0), con su crédito en cada objeto. Coordenadas ICRS J2000.",
    ],
    sky: {
      aria: "Cielo interactivo",
      role: "Astronomía y desarrollo backend en Python.",
      filter: "Filtro",
      filterAria: "Filtro de longitud de onda",
      hintError: "El cielo no pudo cargar en este navegador (requiere WebGL2).",
      hintIdle: "Clic en el cielo para explorarlo · U V I cambian el filtro · ← → recorren los objetos",
      hintIdleTouch: "Toca el cielo para explorarlo",
      hintExplore: "Rueda para acercar o alejar · arrastra para moverte",
      hintExploreTouch: "Pellizca para acercar · arrastra para moverte",
      logbook: "Bitácora ↓",
      field: "campo",
      project: "Proyecto",
      image: "Imagen",
      close: "Cerrar ficha",
      tour: "▶ Recorrido",
      tourAria: "Recorrer los objetos de este filtro",
      tourStop: "■ Detener",
      tourOf: "de",
    },
    spectrum: {
      start: "Desliza para encender el espectro",
      complete: "Espectro completo",
      of: "de",
      all: "Todo",
      appearsIn: "Aparece en",
      intensity: "intensidad",
      pick: "elige una línea",
      empty: (total: number, n: number) =>
        `${total} líneas de ${n} elementos. Pasa el cursor por el espectro o elige un elemento; las líneas con ◎ te llevan al objeto del cielo donde está el proyecto.`,
      aria: "Espectro de emisión: cada área es un elemento químico y cada herramienta una de sus líneas; la altura es el número de proyectos o cursos donde aparece",
      bandsAria: "Elementos del espectro",
    },
  },
  en: {
    lang: "en",
    otherLocale: { href: "/", label: "ES", title: "Leer en español" },
    nav: { sky: "Sky", about: "About", stack: "Stack", projects: "Projects", contact: "Contact", cv: "CV ↓" },
    theme: { toDark: "Switch to dark theme", toLight: "Switch to light theme", label: "Theme" },
    about: {
      k: "About",
      h2: ["Data from the sky,", "software on the ground"],
      facts: [
        ["Based in", "Los Ángeles, Chile"],
        ["Education", "Licenciatura in Astronomy"],
        ["Focus", "Python backend and data science"],
        ["Next", "Protoplanetary disks"],
      ],
      paragraphs: [
        "I studied Astronomy (Licenciatura). I worked with data from several astronomical catalogs and instruments (Gaia DR3, TESS, MUSE, among others) and, in experimental astrophysics, with the IllustrisTNG cosmological simulation. That is where I found that what I enjoy most is writing the software that processes that data.",
        "I also really like physics and mathematics, which is where projects like **Neural Geodesics**, on how light travels around black holes, or the **gravitational lens** simulation come from.",
        "Right now I focus on backend development and data science, with astronomical research as a longer-term goal.",
      ],
    },
    stack: {
      k: "Stack",
      h2: "Tool spectrum",
      lede: "Each area of work is a chemical element and each tool one of its real emission lines: the backend is hydrogen's Balmer series. A line's height is the number of projects or courses where I used that tool. Scroll down to light up the elements.",
    },
    projects: {
      k: "Projects",
      h2: "Catalog",
      lede: "Each project lives on a real object in the sky. Open it and the camera flies there.",
      uses: "uses",
    },
    contact: { k: "Contact", h2: "Let's talk", copy: "Copy email", copied: "Copied", write: "Write ↗", cv: "Download CV ↓" },
    footer: [
      "Sky: Aladin Lite (CDS, Strasbourg) with HiPS from Mellinger, DSS2 (STScI), 2MASS (UMass/IPAC-Caltech) and GALEX GR6/7 (NASA/JPL-Caltech). Deep images: ESO and ESA/Hubble (CC BY 4.0), credited on each object. ICRS J2000 coordinates.",
    ],
    sky: {
      aria: "Interactive sky",
      role: "Astronomy and Python backend development.",
      filter: "Filter",
      filterAria: "Wavelength filter",
      hintError: "The sky could not load in this browser (WebGL2 required).",
      hintIdle: "Click the sky to explore it · U V I switch filters · ← → step through objects",
      hintIdleTouch: "Tap the sky to explore it",
      hintExplore: "Scroll to zoom in or out · drag to move",
      hintExploreTouch: "Pinch to zoom · drag to move",
      logbook: "Logbook ↓",
      field: "field",
      project: "Project",
      image: "Image",
      close: "Close card",
      tour: "▶ Tour",
      tourAria: "Tour the objects in this filter",
      tourStop: "■ Stop",
      tourOf: "of",
    },
    spectrum: {
      start: "Scroll to light up the spectrum",
      complete: "Full spectrum",
      of: "of",
      all: "All",
      appearsIn: "Appears in",
      intensity: "intensity",
      pick: "pick a line",
      empty: (total: number, n: number) =>
        `${total} lines from ${n} elements. Hover over the spectrum or pick an element; lines marked ◎ take you to the object in the sky where the project lives.`,
      aria: "Emission spectrum: each area is a chemical element and each tool one of its lines; the height is the number of projects or courses where it appears",
      bandsAria: "Spectrum elements",
    },
  },
} as const;

export type UIStrings = (typeof UI)[Locale];
