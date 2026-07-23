// Single source of truth for all site content (Spanish).
// Text supports lightweight markup: **bold** and *italic*, rendered by <RichText>.

export const profile = {
  name: "Maximiliano Valderrama",
  fullName: "Maximiliano F. Valderrama",
  role: "Licenciado en Astronomía y Desarrollador FullStack Python",
  email: "maximilianovalderrama123@gmail.com",
  github: "https://github.com/mmmaxii",
  githubUser: "mmmaxii",
  contactIntro:
    "Estoy abierto a oportunidades y colaboraciones técnicas donde pueda aportar valor real a través de aplicaciones backend sólidas.",
  footer: "© 2026 Maximiliano F. Valderrama. Elaborado con Next.js y mucho espacio-tiempo.",
};

/* ------------------------------- Sobre Mí ------------------------------- */

export const aboutParagraphs: string[] = [
  "Soy originario de Los Ángeles, Chile, y estudiante de Astronomía, una carrera que me reveló mi gran vocación profesional: la **programación y automatización**. Analizar inmensos volúmenes de datos astronómicos de misiones como Kepler, Gaia DR3, TESS y simulaciones como IllustrisTNG me demostró el enorme potencial de Python para entender y modelar el universo.",
  "Considero que poseo un perfil sumamente pragmático. Descubrir que cualquier proceso que uno imagine puede automatizarse me motivó a profundizar en cursos de Programación Avanzada. Actualmente, me encuentro en la recta final de mi carrera y cursando de forma paralela un **Bootcamp de Desarrollo Fullstack**. Mi objetivo es poder tomar todo ese poder del Backend y el procesamiento de datos, y plasmarlo en interfaces visuales que destaquen por su diseño y experiencia de usuario.",
  "Mi proyecto en paralelo y hobby más demandante en la actualidad es personal: **ser padre**. Cuidar de mi hija recién nacida a tiempo completo me enseña a diario sobre resiliencia, prioridades y organización, lo que compagino firmemente con mis estudios y la programación.",
  "A futuro, el ámbito investigativo es mi mayor proyección: deseo especializarme en la simulación y análisis de **discos protoplanetarios**, para lograr encontrar relaciones directas sobre cómo se originan los mundos oceánicos (*Water Worlds*) y entender qué mecanismos rigen su creación.",
];

/* ------------------------------ Tech Stack ------------------------------ */

export interface TechCategory {
  category: string;
  items: string[];
}

export const techStack: TechCategory[] = [
  { category: "Backend", items: ["Python", "Django", "FastAPI"] },
  { category: "Frontend", items: ["HTML5", "CSS", "JavaScript", "React", "Vite", "Next.js", "TypeScript"] },
  { category: "Bases de Datos", items: ["PostgreSQL", "SQLite"] },
  { category: "Machine Learning", items: ["PyTorch", "TensorFlow"] },
  { category: "DevOps & Deploy", items: ["Git", "Vercel", "Railway"] },
  { category: "Arquitectura de Software", items: ["MVT", "DAO"] },
];

/* ------------------------------- Proyectos ------------------------------ */

export interface ProjectImage {
  src: string;
  alt: string;
}

export interface ProjectLink {
  label: string;
  href: string;
  kind: "demo" | "repo";
}

export interface Project {
  title: string;
  tech: string[];
  description: string;
  images: ProjectImage[];
  links: ProjectLink[];
  group: "main" | "ai";
  carouselSpeed?: "normal" | "fast";
}

export const projects: Project[] = [
  {
    title: "Alke Wallet Fullstack",
    tech: ["Django Frontend", "SQLite", "Fetch API", "Chart.js"],
    description:
      "Evolución definitiva de Alke Wallet combinando plantillas de Django con backend SQL. Implementé manejo de estados transaccionales usando `transaction.atomic` (para separar sub-cuentas seguras), gráficos estáticos iterativos de Chart.js y optimizaciones usando JavaScript Vanilla para evitar renderizados de página al enviar dinero.",
    images: [
      { src: "/img/alke_wallet_django/alkewallet_django_home.png", alt: "Alke Wallet Django Home" },
      { src: "/img/alke_wallet_django/alkewallet_django_bolsillos.png", alt: "Alke Wallet Django Bolsillos" },
      { src: "/img/alke_wallet_django/alkewallet_django_registro.png", alt: "Alke Wallet Django Registro" },
    ],
    links: [
      { label: "Ver App", href: "https://alke-wallet-django-production.up.railway.app/", kind: "demo" },
    ],
    group: "main",
  },
  {
    title: "DecoIA",
    tech: ["React", "Django", "Claude API", "Replicate Flux", "Meli API"],
    description:
      "Innovadora PWA impulsada por IA que transforma tus espacios. Sube una foto para obtener ideas de diseño, instrucciones DIY, renders fotorrealistas (Flux Kontext Pro) y recomendaciones de productos integrados con Mercado Libre.",
    images: [{ src: "/img/decoria/decoria_home.png", alt: "DecoIA Home" }],
    links: [{ label: "Ver Sitio Web (Beta)", href: "https://www.decoia.cl/", kind: "demo" }],
    group: "main",
  },
  {
    title: "Sistema Solar Interactivo",
    tech: ["Django", "HTML5", "Vanilla CSS", "Three.js"],
    description:
      "Aplicación web interactiva construida bajo arquitectura MVT con Django, diseñada para visualizar los cuerpos celestes del sistema solar. Destaca por su avanzado diseño frontend utilizando CSS (Glassmorphism), disposiciones dinámicas y la integración de renderizado 3D de modelos astronómicos a través de Three.js.",
    images: [
      { src: "/img/solar_system/solar_system_home.png", alt: "Sistema Solar Home" },
      { src: "/img/solar_system/solar_system_sun.png", alt: "Sistema Solar Sol" },
      { src: "/img/solar_system/solar_system_saturn.png", alt: "Sistema Solar Saturno" },
    ],
    links: [{ label: "Ver Sitio Web", href: "https://solar-system-project-eta.vercel.app/", kind: "demo" }],
    group: "main",
  },
  {
    title: "Gestor BancoPy",
    tech: ["Python", "POO", "SQLite", "API SendGrid"],
    description:
      "Completo sistema de gestión bancaria. Soporta flujos de autenticación estrictos, persistencia de transacciones multi-usuario con jerarquías polimórficas (Regular, Corporate, VIP), e integración con SendGrid para enviar correos de bienvenida de manera silenciosa.",
    images: [{ src: "/img/bancopy/bancopy_terminal_1775145167302.png", alt: "Terminal de BancoPy" }],
    links: [{ label: "Repositorio", href: "https://github.com/mmmaxii/BancoPy", kind: "repo" }],
    group: "main",
  },
  {
    title: "Alke Wallet",
    tech: ["HTML", "CSS (Bootstrap)", "JavaScript (ES6)"],
    description:
      "Billetera digital interactiva diseñada con un enfoque Mobile-First. Destaca por utilizar SweetAlert2 para notificaciones fluidas y animaciones Glassmorphism (Efecto vidrio). Integra simuladores de depósitos y un buscador asíncrono para transferir dinero de forma rápida y sencilla.",
    images: [
      { src: "/img/alke_wallet/alkewallet_home.png", alt: "Alke Wallet Home" },
      { src: "/img/alke_wallet/alkewallet_login.png", alt: "Alke Wallet Login" },
      { src: "/img/alke_wallet/alkewallet_deposito.png", alt: "Alke Wallet Depósito" },
    ],
    links: [{ label: "Repositorio", href: "https://github.com/mmmaxii/Alke-Wallet", kind: "repo" }],
    group: "main",
  },
  {
    title: "Simulación de Lente Gravitacional",
    tech: ["Python", "NumPy", "Matplotlib"],
    description:
      "Simulación interactiva utilizando un modelo de Esfera Isoterma Singular (SIS) con Shear externo. Permite visualizar en tiempo real cómo la gravedad distorsiona la luz de una galaxia de fondo ajustando parámetros mediante controles interactivos.",
    images: [{ src: "/img/lensing/lente_gravitacional.gif", alt: "Simulación de lente gravitacional" }],
    links: [
      { label: "Ver Código", href: "https://github.com/mmmaxii/Simulacion-lente-gravitacional", kind: "repo" },
    ],
    group: "ai",
  },
  {
    title: "Sombra de Agujero Negro",
    tech: ["Python", "NumPy", "Matplotlib"],
    description:
      'Simulación numérica de la apariencia óptica de un agujero negro de Schwarzschild. Combina la determinación exacta del parámetro de impacto crítico ("sombra") usando Ray-Shooting Inverso, con una aproximación de campo débil para la deflexión de luz de las estrellas de fondo.',
    images: [
      { src: "/img/black-hole/v1-modelo-visual.png", alt: "Agujero negro con disco de acreción (modelo visual)" },
      { src: "/img/black-hole/v2.png", alt: "Agujero negro con disco de acreción v2" },
      { src: "/img/black-hole/v2-2.png", alt: "Agujero negro con disco de acreción v2.2" },
      { src: "/img/black-hole/v3.png", alt: "Agujero negro v3" },
      { src: "/img/black-hole/v3-1.png", alt: "Agujero negro v3.1" },
      { src: "/img/black-hole/v3-3.png", alt: "Agujero negro v3.3" },
      { src: "/img/black-hole/v3-4.png", alt: "Agujero negro v3.4" },
      { src: "/img/black-hole/v3-5.png", alt: "Agujero negro v3.5" },
    ],
    links: [
      {
        label: "Ver Código",
        href: "https://github.com/mmmaxii/ProyectosU-2025/tree/main/Proyectos%20independientes",
        kind: "repo",
      },
    ],
    group: "ai",
    carouselSpeed: "fast",
  },
  {
    title: "Análisis Espectroscópico IFU de NGC 5972",
    tech: ["Python", "NumPy", "Astropy", "Voronoi Binning"],
    description:
      "Estudio de la distribución espacial y propiedades de ionización del gas en la galaxia NGC 5972 usando datos del instrumento MUSE. Apliqué teselación de Voronoi para optimizar la relación señal-ruido, corrigiendo atenuaciones de polvo mediante el decremento de Balmer. Analicé los flujos para construir mapas espaciales y un diagrama BPT, clasificando las regiones ionizantes y confirmando la fuerte presencia del AGN en el núcleo.",
    images: [
      { src: "/img/ngc5972/galaxia.jpg", alt: "Galaxia NGC 5972" },
      { src: "/img/ngc5972/voronoi.png", alt: "Teselación de Voronoi de NGC 5972" },
      { src: "/img/ngc5972/bpt.png", alt: "Diagrama BPT de NGC 5972" },
      { src: "/img/ngc5972/flujos.png", alt: "Razones de flujo de NGC 5972" },
    ],
    links: [
      {
        label: "Ver Código",
        href: "https://github.com/mmmaxii/ProyectosU-2025/tree/main/Astrofisica%20Experimental/Experiencia%202",
        kind: "repo",
      },
    ],
    group: "ai",
  },
  {
    title: "Machine Learning con datos de TNG50",
    tech: ["PyTorch", "TensorFlow"],
    description:
      "Diseño y ejecución de un pipeline automatizado para el procesamiento de datos astronómicos extraídos de la simulación TNG50. Apliqué modelos de Machine Learning para analizar las propiedades físicas (masa estelar, tasa de formación estelar, metalicidad) de las galaxias y predecir su evolución en diferentes etapas del universo. Utiliza datos de la simulación magnetohidrodinámica cosmológica a gran escala de formación y evolución de galaxias, extraídos de forma programática.",
    images: [{ src: "/img/tng/tngsimulation.png", alt: "Simulación TNG50" }],
    links: [
      {
        label: "Ver Código",
        href: "https://github.com/mmmaxii/ProyectosU-2025/tree/main/Astrofisica%20Experimental/Experiencia%204",
        kind: "repo",
      },
    ],
    group: "ai",
  },
];

/* --------------------- Práctica Profesional / Research ------------------- */

export interface ArchitectureCard {
  icon: "branch" | "meteor" | "eye";
  title: string;
  tech: string;
  lead: string;
  bullets: string[];
}

export interface Achievement {
  icon: "server" | "thermometer" | "chart";
  title: string;
  text: string;
  acknowledgements?: {
    heading: string;
    quote: string;
    linkLabel: string;
    href: string;
  };
}

export const research = {
  title: "Práctica Profesional: Simulaciones de Discos Protoplanetarios",
  intro: [
    'Durante mi práctica, desarrollé un marco de trabajo completo para simular y analizar la evolución termodinámica y química de los discos protoplanetarios. El objetivo principal fue estudiar la dinámica de las "snowlines" (líneas de nieve de volátiles como H₂O) y cómo el surgimiento de subestructuras (gaps planetarios y trampas de presión) influye en la migración de polvo (pebbles) y la consecuente acreción sobre embriones planetarios.',
    "Este modelamiento fue construido utilizando bases teóricas de la evolución de discos (tripodpy, dustpylib) combinando el decaimiento de la tasa de acreción en estrellas T-Tauri y regímenes de fragmentación para entender la transición entre material rocoso (rico en silicatos) y material rico en hielos.",
  ],
  architectureCards: [
    {
      icon: "branch",
      title: "1. El Pipeline Principal",
      tech: "WaterworldPipeline • Mixins",
      lead: "Arquitectura orientada a objetos que modulariza la física del disco:",
      bullets: [
        "**Disk Setup:** Define grilla radial y calcula parámetros estelares (L ≈ 1 L_sun, T ≈ 4000 K).",
        "**Disk Chemistry:** Inyecta volátiles (H₂O, CO₂, CO) sobre silicatos.",
        "**Snowline Physics:** Modelo de Oka et al. Simula migración secular hacia el interior (M_dot ≈ t^-1.5).",
        "**Pressure Bumps:** Modelos de Kanagawa, Duffell y sinusoidales para trampas de polvo.",
      ],
    },
    {
      icon: "meteor",
      title: "2. Módulo de Acreción",
      tech: "PA3Py (PebbleAccretion3)",
      lead: "Módulo para rastrear el crecimiento de embriones, regido por los modelos de **Drążkowska (2023)** y **Ormel (2017)**:",
      bullets: [
        "Masa inicial considerada 100% material rocoso.",
        "Fracción de hielo/silicato regulada estrictamente por la snowline de H₂O.",
        "Incorpora deriva de polvo y fragmentación estelar de pebbles.",
      ],
    },
    {
      icon: "eye",
      title: "3. Visualización y Análisis",
      tech: "disk_visualizer • Python 2D",
      lead: "Paquete diseñado para interpretar cientos de snapshots HDF5:",
      bullets: [
        "Mapea simultáneamente densidades de gas (Σ_gas) y polvo (Σ_dust).",
        "Rastrea paramétricamente la posición en AU de la snowline.",
        "Renderización batch de animaciones GIF de alta calidad.",
      ],
    },
  ] satisfies ArchitectureCard[],
  achievements: [
    {
      icon: "server",
      title: "Computación de Alto Rendimiento (HPC)",
      text: "Scripts automáticos (Python y PBS) para enviar jobs a clústeres computacionales, explorando vastos parámetros de atenuación, radios base y masas. En este caso particular, se utilizó la potencia computacional del clúster **Geryon 2**.",
      acknowledgements: {
        heading: "Agradecimientos / Acknowledgements",
        quote:
          '"El clúster Geryon del Centro de Astro-Ingeniería UC fue utilizado exhaustivamente para los cálculos computacionales de estas simulaciones. Los proyectos ANID BASAL FB21000, BASAL CATA PFB-06, Anillo ACT-86, FONDEQUIP AIC-57 y QUIMAL 130008 proporcionaron financiamiento para diversas mejoras del clúster Geryon 2."',
        linkLabel: "Ver información del clúster Geryon 2",
        href: "https://www3.astro.puc.cl/geryon/g2/",
      },
    },
    {
      icon: "thermometer",
      title: "Acoplamiento Térmico Extendido",
      text: "Superé limitaciones del código inyectando leyes termodinámicas y dependencias de acreción temporal teóricas de la literatura.",
    },
    {
      icon: "chart",
      title: "Herramientas de Análisis Posterior",
      text: 'Creación de scripts iterativos (analisis_pa3_vfrag.py, etc.) para medir los efectos profundos del "drift" tardío en los perfiles de densidad.',
    },
  ] satisfies Achievement[],
};

/* ----------------------- Galería paramétrica (GIFs) ---------------------- */

export type GifScenario = "base" | "gap" | "sinusoidal";

export const ALPHAS = ["0.01", "0.005", "0.003", "0.001", "0.0005", "0.0001"] as const;
export type Alpha = (typeof ALPHAS)[number];

export const alphaDisplay: Record<Alpha, string> = {
  "0.01": "10⁻²",
  "0.005": "5×10⁻³",
  "0.003": "3×10⁻³",
  "0.001": "10⁻³",
  "0.0005": "5×10⁻⁴",
  "0.0001": "10⁻⁴",
};

export const gifScenarios: { id: GifScenario; label: string }[] = [
  { id: "base", label: "Baseline (M_gap = 0.01)" },
  { id: "gap", label: "Gap 15 AU (3 M_jup)" },
  { id: "sinusoidal", label: "Estructura Sinusoidal" },
];

export function buildGifSrc(scenario: GifScenario, alpha: Alpha): string {
  switch (scenario) {
    case "base":
      return `/img/practica/gifs/base/run_r5.0_m0.01_a${alpha}.gif`;
    case "gap":
      return `/img/practica/gifs/gap/run_r15.0_m3.0_a${alpha}.gif`;
    case "sinusoidal":
      return "/img/practica/gifs/sinusoidal/MuchosGaps_A0.7.gif";
  }
}

export function gifTitle(scenario: GifScenario, alpha: Alpha): string {
  const names: Record<GifScenario, string> = {
    base: "Baseline",
    gap: "Gap 15 AU",
    sinusoidal: "Estructura Sinusoidal",
  };
  const display = scenario === "sinusoidal" ? "10⁻³ (Fijo)" : alphaDisplay[alpha];
  return `Escenario: ${names[scenario]} | α = ${display}`;
}

export function gifDescription(scenario: GifScenario, alpha: Alpha): string {
  switch (scenario) {
    case "base":
      return `Evolución de la densidad de polvo a 10 Myr bajo el régimen de viscosidad de Shakura-Sunyaev (α = ${alpha}). Sin interacción planetaria fuerte (M_gap = 0.01).`;
    case "gap":
      return `Planeta de 3 M_jup en 15 AU esculpiendo un gap profundo. La eficiencia de atrapamiento depende fuertemente de la viscosidad (α = ${alpha}).`;
    case "sinusoidal":
      return "Perturbaciones sinusoidales en el disco generando múltiples trampas de polvo locales. (Ejemplo con A=0.7).";
  }
}

/* -------------------- Cielo real austral (Los Ángeles, Chile) ------------ */
/*
 * Seis objetos astronómicos reales, visibles desde latitud ~37° S, ubicados
 * de forma aproximada a como aparecerían en el cielo. Cada objeto es un portal
 * temático. Navegación de 3 niveles: cielo → objeto (zoom) → sub-portal → detalle.
 *
 * Los colores NUNCA se hardcodean en los componentes: cada objeto referencia
 * un token CSS (colorVar) definido en app/globals.css.
 */

export type SectionId = "about" | "projects" | "research" | "ai" | "tech" | "contact";

export type SkyKind =
  | "hypergiant" // Eta Carinae
  | "galaxy-cluster" // Fornax
  | "proto-disk" // PDS 70
  | "pulsar" // PSR B1257+12
  | "irregular" // Gran Nube de Magallanes
  | "supernova"; // SN 1987A

export type DetailContent =
  | { type: "about" }
  | { type: "contact" }
  | { type: "research" }
  | { type: "project"; projectTitle: string }
  | { type: "tech"; category: string }
  | { type: "note"; body: string[] };

export interface SkyChild {
  id: string;
  label: string;
  sublabel?: string;
  detail: DetailContent;
}

export interface SkyObject {
  id: SectionId;
  section: string; // "Sobre mí"
  object: string; // "Eta Carinae"
  catalog: string; // "η Car"
  blurb: string; // línea descriptiva del objeto real
  kind: SkyKind;
  colorVar: string; // token CSS, p.ej. "--sky-eta"
  size: number; // tamaño del glifo en el cielo (px)
  position: { top: string; left: string }; // ubicación aproximada en el cielo austral
  ra: string;
  dec: string;
  /** Sub-portales (nivel 2). Si no hay, el objeto abre su propio detalle. */
  children?: SkyChild[];
  /** Detalle propio cuando el objeto es singular (Sobre mí, Contacto). */
  self?: DetailContent;
}

export const skyObjects: SkyObject[] = [
  {
    id: "about",
    section: "Sobre mí",
    object: "Nebulosa de Carina",
    catalog: "NGC 3372",
    blurb: "Una de las nebulosas de emisión más impresionantes del cielo austral, cuna de estrellas masivas observada por JWST (Cosmic Cliffs).",
    kind: "hypergiant",
    colorVar: "--sky-eta",
    size: 74,
    position: { top: "43%", left: "50%" },
    ra: "10 45 03.6",
    dec: "-59 41 04",
    self: { type: "about" },
  },
  {
    id: "projects",
    section: "Proyectos",
    object: "Cúmulo de Fornax",
    catalog: "Fornax Cluster",
    blurb: "Cúmulo de cientos de galaxias en la constelación del Horno. Cada galaxia, un proyecto.",
    kind: "galaxy-cluster",
    colorVar: "--sky-fornax",
    size: 120,
    position: { top: "73%", left: "26%" },
    ra: "03 38 29.0",
    dec: "-35 27 03",
    children: [
      { id: "alke-fs", label: "Alke Wallet Fullstack", sublabel: "Django · SQLite", detail: { type: "project", projectTitle: "Alke Wallet Fullstack" } },
      { id: "decoia", label: "DecoIA", sublabel: "PWA · IA", detail: { type: "project", projectTitle: "DecoIA" } },
      { id: "solar", label: "Sistema Solar Interactivo", sublabel: "Django · Three.js", detail: { type: "project", projectTitle: "Sistema Solar Interactivo" } },
      { id: "bancopy", label: "Gestor BancoPy", sublabel: "Python · POO", detail: { type: "project", projectTitle: "Gestor BancoPy" } },
      { id: "alke", label: "Alke Wallet", sublabel: "HTML · JS", detail: { type: "project", projectTitle: "Alke Wallet" } },
    ],
  },
  {
    id: "research",
    section: "Astronomía",
    object: "PDS 70",
    catalog: "PDS 70",
    blurb: "Estrella T-Tauri con disco protoplanetario y planetas en formación, observada por ALMA y JWST. Mi área de investigación.",
    kind: "proto-disk",
    colorVar: "--sky-pds70",
    size: 96,
    position: { top: "18%", left: "40%" },
    ra: "14 08 10.2",
    dec: "-41 23 53",
    children: [
      { id: "practica", label: "Práctica: Discos Protoplanetarios", sublabel: "PA3Py · TriPoDPy", detail: { type: "research" } },
      { id: "lente", label: "Lente Gravitacional", sublabel: "SIS + Shear", detail: { type: "project", projectTitle: "Simulación de Lente Gravitacional" } },
      { id: "bh", label: "Sombra de Agujero Negro", sublabel: "Ray-Shooting", detail: { type: "project", projectTitle: "Sombra de Agujero Negro" } },
      { id: "ngc5972", label: "Espectroscopía IFU NGC 5972", sublabel: "MUSE · Voronoi", detail: { type: "project", projectTitle: "Análisis Espectroscópico IFU de NGC 5972" } },
      { id: "tng50", label: "ML con datos de TNG50", sublabel: "PyTorch · TensorFlow", detail: { type: "project", projectTitle: "Machine Learning con datos de TNG50" } },
    ],
  },
  {
    id: "ai",
    section: "Inteligencia Artificial",
    object: "PSR B1257+12",
    catalog: "PSR B1257+12",
    blurb: "El primer sistema planetario descubierto fuera del Sol: planetas orbitando un púlsar. Cada planeta, una faceta de mi trabajo con IA.",
    kind: "pulsar",
    colorVar: "--sky-pulsar",
    size: 68,
    position: { top: "20%", left: "73%" },
    ra: "13 00 01.0",
    dec: "+12 40 57",
    children: [
      { id: "decoia-ai", label: "DecoIA", sublabel: "Claude API · Flux", detail: { type: "project", projectTitle: "DecoIA" } },
      { id: "ml-astro", label: "Machine Learning astronómico", sublabel: "TNG50", detail: { type: "project", projectTitle: "Machine Learning con datos de TNG50" } },
      {
        id: "llm-agents",
        label: "LLMs, Agentes & MCP",
        sublabel: "Orquestación",
        detail: {
          type: "note",
          body: [
            "Integro modelos de lenguaje en aplicaciones reales: en **DecoIA** uso la API de Claude para generar ideas de diseño e instrucciones DIY a partir de una foto.",
            "Me interesa la construcción de **agentes** y flujos con herramientas (function calling, MCP) para automatizar tareas de análisis y procesamiento de datos.",
          ],
        },
      },
      {
        id: "rag",
        label: "RAG & Embeddings",
        sublabel: "Recuperación",
        detail: {
          type: "note",
          body: [
            "Exploro **Retrieval-Augmented Generation**: indexación con embeddings y recuperación semántica para dar contexto fiable a los modelos.",
            "Objetivo: conectar literatura científica y datos propios a asistentes que respondan con fuentes verificables.",
          ],
        },
      },
      {
        id: "cv",
        label: "Visión por Computador",
        sublabel: "Imágenes",
        detail: {
          type: "note",
          body: [
            "Procesamiento de imágenes aplicado: en **DecoIA**, renders fotorrealistas con Flux Kontext Pro a partir de fotos de espacios reales.",
            "En astronomía, análisis de imágenes IFU/MUSE y mapas de simulaciones para extraer propiedades físicas.",
          ],
        },
      },
    ],
  },
  {
    id: "tech",
    section: "Tecnologías",
    object: "Gran Nube de Magallanes",
    catalog: "LMC",
    blurb: "Galaxia irregular satélite de la Vía Láctea, un tesoro del cielo austral. Cada región, un grupo de tecnologías.",
    kind: "irregular",
    colorVar: "--sky-lmc",
    size: 130,
    position: { top: "70%", left: "77%" },
    ra: "05 23 34.5",
    dec: "-69 45 22",
    children: [
      { id: "tech-backend", label: "Backend", sublabel: "Python · Django · FastAPI", detail: { type: "tech", category: "Backend" } },
      { id: "tech-frontend", label: "Frontend", sublabel: "React · Next.js · TS", detail: { type: "tech", category: "Frontend" } },
      { id: "tech-db", label: "Bases de Datos", sublabel: "PostgreSQL · SQLite", detail: { type: "tech", category: "Bases de Datos" } },
      { id: "tech-ml", label: "Machine Learning", sublabel: "PyTorch · TensorFlow", detail: { type: "tech", category: "Machine Learning" } },
      { id: "tech-devops", label: "DevOps & Deploy", sublabel: "Git · Vercel · Railway", detail: { type: "tech", category: "DevOps & Deploy" } },
      { id: "tech-arch", label: "Arquitectura", sublabel: "MVT · DAO", detail: { type: "tech", category: "Arquitectura de Software" } },
    ],
  },
  {
    id: "contact",
    section: "Contacto",
    object: "SN 1987A",
    catalog: "SN 1987A",
    blurb: "La supernova más cercana y estudiada en siglos, en la Gran Nube de Magallanes. Una explosión que sigue evolucionando: comencemos algo nuevo.",
    kind: "supernova",
    colorVar: "--sky-sn",
    size: 72,
    position: { top: "50%", left: "89%" },
    ra: "05 35 28.0",
    dec: "-69 16 11",
    self: { type: "contact" },
  },
];

export function getProject(title: string): Project | undefined {
  return projects.find((p) => p.title === title);
}

export function getTechCategory(category: string): TechCategory | undefined {
  return techStack.find((t) => t.category === category);
}
