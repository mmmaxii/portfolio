// Fuente única de contenido del portafolio (español).
// Cielo: bandas (filtros) y objetos reales; cada objeto lleva un proyecto y, si existe,
// una imagen profunda con su astrometría (metadatos AVM de ESO / ESA/Hubble).

export const profile = {
  name: "Maximiliano Valderrama",
  fullName: "Maximiliano F. Valderrama",
  role: "Astronomía (PUC) y desarrollo backend en Python.",
  email: "mvalderrav@uc.cl",
  github: "https://github.com/mmmaxii",
  linkedin: "https://www.linkedin.com/in/maximiliano-valderrama-vargas/",
};

/* ------------------------------- Bandas ------------------------------- */

export type BandId = "uv" | "vis" | "ir";

export interface Survey {
  // URL directa del HiPS en alasky (CDS): evita que Aladin busque espejos que bloquean CORS.
  id: string;
  name: string;
}

export interface Band {
  id: BandId;
  label: string; // botón
  range: string; // botón, línea pequeña
  kicker: string;
  title: string;
  text: string;
  note: string;
  home: { ra: number; dec: number; fov: number };
  wide: Survey;
  /** Survey de mayor resolución bajo cierto campo (grados). */
  deep?: Survey & { below: number };
  /** Cambiar de objeto con un corte a negro en vez de volar (GALEX tiene huecos). */
  jump?: boolean;
}

export const BANDS: Record<BandId, Band> = {
  uv: {
    id: "uv",
    label: "Ultravioleta",
    range: "GALEX · 0.15–0.28 µm",
    kicker: "ULTRAVIOLETA · λ 0.15–0.28 µm",
    title: "IA y automatización",
    text: "En ultravioleta brillan las estrellas jóvenes y calientes de los brazos espirales. Acá están los proyectos donde trabajo con modelos de lenguaje.",
    note: "GALEX cubrió el cielo en parches y evitó el plano de la Vía Láctea: al alejarte verás zonas sin datos.",
    home: { ra: 204.254, dec: -29.866, fov: 2.5 },
    wide: { id: "https://alasky.cds.unistra.fr/GALEX/GALEXGR6_7_color", name: "GALEX GR6/7" },
    jump: true,
  },
  vis: {
    id: "vis",
    label: "Visible",
    range: "Mellinger · DSS2 · 0.4–0.7 µm",
    kicker: "VISIBLE · λ 0.4–0.7 µm",
    title: "Lo que construyo",
    text: "La luz que ve el ojo. Aplicaciones que cualquiera puede abrir y usar.",
    note: "Cielo austral desde 37° S: Carina, Crux y las Nubes de Magallanes.",
    home: { ra: 175.0, dec: -64.0, fov: 110 },
    wide: { id: "https://alasky.cds.unistra.fr/MellingerRGB", name: "Mellinger" },
    deep: { id: "https://alasky.cds.unistra.fr/DSS/DSSColor", name: "DSS2 color", below: 6 },
  },
  ir: {
    id: "ir",
    label: "Infrarrojo",
    range: "2MASS · 1.2–2.2 µm",
    kicker: "INFRARROJO · λ 1.2–2.2 µm",
    title: "Lo que investigo",
    text: "El infrarrojo atraviesa el polvo y deja ver discos, núcleos galácticos y lo que el visible esconde. Mi trabajo en astronomía.",
    note: "El centro de la galaxia: en visible es una franja oscura de polvo, acá se ve el bulbo completo.",
    home: { ra: 266.4, dec: -29.0, fov: 60 },
    wide: { id: "https://alasky.cds.unistra.fr/2MASS/Color", name: "2MASS J H Ks" },
  },
};

export const BAND_ORDER: BandId[] = ["uv", "vis", "ir"];

/* ------------------------------- Objetos ------------------------------- */

export interface DeepImage {
  src: string;
  ra: number; // coordenadas del píxel de referencia (ICRS, grados)
  dec: number;
  widthDeg: number; // ancho angular de la imagen completa
  fx: number; // píxel de referencia como fracción del ancho (desde la izquierda)
  fy: number; // píxel de referencia como fracción del alto (desde arriba)
  rot: number; // AVM Spatial.Rotation: el norte está `rot` grados a la izquierda de la vertical
  label: string;
  credit: string;
  fadeFrom?: number; // campo (grados) donde empieza a aparecer
  fadeTo?: number; // campo donde ya se ve completa
}

export interface Project {
  title: string;
  tech: string[];
  desc: string;
  img?: string;
  links: { label: string; href: string }[];
}

export interface Target {
  id: string;
  band: BandId;
  cat: string; // designación de catálogo
  name: string;
  ra: number;
  dec: number;
  fov: number; // campo al llegar (grados)
  fact: string;
  project: Project;
  deep?: DeepImage;
}

const HUBBLE = "https://cdn.esahubble.org/archives/images/";
const ESO = "https://cdn.eso.org/images/";

export const TARGETS: Target[] = [
  // ---- Visible: lo que construyo
  {
    id: "30dor", band: "vis", cat: "NGC 2070", name: "Nebulosa de la Tarántula", ra: 84.676, dec: -69.101, fov: 0.17,
    fact: "La región de formación estelar más activa del Grupo Local, en la Gran Nube de Magallanes.",
    project: {
      title: "DecoIA", tech: ["React", "Django", "PostgreSQL", "Claude API", "Replicate Flux", "API Mercado Libre"],
      desc: "PWA de diseño de interiores con IA. Subes una foto y entrega ideas de diseño, instrucciones paso a paso, renders y productos de Mercado Libre. Producto en producción; código privado.",
      img: "/img/decoia/decoia_home.png", links: [{ label: "Ver sitio", href: "https://www.decoia.cl/" }],
    },
    deep: { src: HUBBLE + "publicationjpg/heic1206a.jpg", ra: 84.5711688876, dec: -69.1258976867, widthDeg: 0.2235754, fx: 0.5, fy: 0.5, rot: 35.02, label: "Hubble + MPG/ESO 2.2 m · óptico", credit: "NASA, ESA, ESO, D. Lennon, E. Sabbi et al." },
  },
  {
    id: "omegacen", band: "vis", cat: "NGC 5139", name: "Omega Centauri", ra: 201.697, dec: -47.479, fov: 0.4,
    fact: "El cúmulo globular más masivo de la Vía Láctea: unos diez millones de estrellas.",
    project: {
      title: "Alke Wallet Fullstack", tech: ["Django", "SQLite", "JavaScript", "Chart.js"],
      desc: "Billetera digital con plantillas Django y backend SQL. Transacciones con transaction.atomic para separar sub-cuentas, gráficos con Chart.js y envíos sin recargar la página.",
      img: "/img/alke_wallet_django/alkewallet_django_home.png",
      links: [
        { label: "Ver app", href: "https://alke-wallet-django-production.up.railway.app/" },
        { label: "Repositorio", href: "https://github.com/mmmaxii/alke-wallet-django" },
      ],
    },
    deep: { src: ESO + "publicationjpg/eso0844a.jpg", ra: 201.697148, dec: -47.479684, widthDeg: 0.5312968, fx: 0.48472, fy: 0.47172, rot: -0.0072, label: "MPG/ESO 2.2 m WFI · B V I", credit: "ESO" },
  },
  {
    id: "47tuc", band: "vis", cat: "NGC 104", name: "47 Tucanae", ra: 6.024, dec: -72.081, fov: 0.55,
    fact: "Cúmulo globular junto a la Pequeña Nube de Magallanes, visible a simple vista desde Chile.",
    project: {
      title: "Gestor BancoPy", tech: ["Python", "POO", "SQLite", "SendGrid"],
      desc: "Sistema de gestión bancaria por terminal: autenticación, transacciones multiusuario con cuentas Regular, Corporate y VIP, y correos con SendGrid.",
      img: "/img/bancopy/bancopy_terminal_1775145167302.png", links: [{ label: "Repositorio", href: "https://github.com/mmmaxii/BancoPy" }],
    },
    deep: { src: ESO + "publicationjpg/eso1302a.jpg", ra: 6.022499, dec: -72.081497, widthDeg: 0.781549, fx: 0.5008, fy: 0.5049, rot: -6.27, label: "VISTA · Y J Ks (infrarrojo cercano)", credit: "ESO/M.-R. Cioni/VISTA Magellanic Cloud survey" },
  },

  // ---- Infrarrojo: lo que investigo
  {
    id: "pds70", band: "ir", cat: "PDS 70", name: "Disco con planetas en formación", ra: 212.0423325, dec: -41.3979441, fov: 0.0009,
    fact: "Estrella T Tauri con dos planetas que todavía se forman dentro de su disco, observada por VLT, ALMA y JWST.",
    project: {
      title: "Práctica: discos protoplanetarios y PA3Py", tech: ["Python", "NumPy", "SciPy", "h5py", "pytest", "PyPI", "HPC"],
      desc: "Paquete open source (pip install pa3py) que calcula el crecimiento de embriones planetarios por acreción de pebbles sobre simulaciones de disco de TriPoDPy, con snowline dinámica. Usado para más de 5.000 trayectorias sobre 1.300 simulaciones en el cluster Geryon 2.",
      img: "/img/practica/gifs/gap/run_r15.0_m3.0_a0.001.gif", links: [{ label: "Repositorio", href: "https://github.com/mmmaxii/PA3Py" }],
    },
    deep: { src: ESO + "screen/eso1821a.jpg", ra: 212.042332518, dec: -41.3979441244, widthDeg: 0.0003675818, fx: 0.5, fy: 0.5, rot: 90.3, label: "VLT/SPHERE · 1.6 µm", credit: "ESO/A. Müller et al.", fadeFrom: 0.011, fadeTo: 0.0035 },
  },
  {
    id: "sgra", band: "ir", cat: "Sgr A*", name: "Centro de la Vía Láctea", ra: 266.417, dec: -29.008, fov: 0.005,
    fact: "El agujero negro de 4 millones de masas solares en el centro galáctico. En visible lo tapa el polvo; en infrarrojo se ve el cúmulo de estrellas que lo rodea.",
    project: {
      title: "Neural Geodesics", tech: ["Python", "PyTorch", "PINN", "RK45", "ONNX"],
      desc: "Ray tracing relativista alrededor de agujeros negros de Schwarzschild y Kerr. En Schwarzschild, una red con pérdida informada por la física reemplaza al integrador RK45: 51 veces más rápida, con error medio de 4.3e-5. En Kerr, las soluciones cerradas en tiempo de Mino hacen innecesaria la red.",
      img: "https://raw.githubusercontent.com/mmmaxii/neural-geodesics/main/docs/hero_kerr.png",
      links: [{ label: "Repositorio", href: "https://github.com/mmmaxii/neural-geodesics" }],
    },
    deep: { src: ESO + "screen/eso0846a.jpg", ra: 266.417038167, dec: -29.0065441679, widthDeg: 0.006787312, fx: 0.5, fy: 0.5, rot: -0.34, label: "VLT/NACO · infrarrojo cercano", credit: "ESO/S. Gillessen et al." },
  },
  {
    id: "ngc5972", band: "ir", cat: "NGC 5972", name: "Galaxia con núcleo activo", ra: 234.726, dec: 17.026, fov: 0.02,
    fact: "Galaxia Seyfert 2 con una nube de gas ionizado de más de 50 mil años luz.",
    project: {
      title: "Espectroscopía IFU de NGC 5972", tech: ["Python", "Astropy", "Voronoi binning", "MUSE"],
      desc: "Mapas de ionización del gas con datos de MUSE: teselación de Voronoi para la señal-ruido, corrección por decremento de Balmer y diagrama BPT que confirma el AGN del núcleo.",
      img: "/img/ngc5972/galaxia.jpg",
      links: [{ label: "Código", href: "https://github.com/mmmaxii/ProyectosU-2025/tree/main/Astrofisica%20Experimental/Experiencia%202" }],
    },
    deep: { src: HUBBLE + "large/heic1507c.jpg", ra: 234.725174953, dec: 17.0270774701, widthDeg: 0.02757685, fx: 0.49975, fy: 0.50025, rot: 89.8, label: "Hubble ACS + WFC3 · [OIII], Hα, R, I", credit: "NASA, ESA, W. Keel" },
  },
  {
    id: "hudf", band: "ir", cat: "HUDF", name: "Campo Ultraprofundo de Hubble", ra: 53.1625, dec: -27.7914, fov: 0.03,
    fact: "Un trozo de cielo que parece vacío y contiene unas 10.000 galaxias. Las simulaciones cosmológicas buscan reproducir galaxias como esas.",
    project: {
      title: "Machine Learning con TNG50", tech: ["PyTorch", "TensorFlow"],
      desc: "Pipeline que extrae galaxias de la simulación TNG50 y entrena modelos para predecir masa estelar, formación estelar y metalicidad.",
      img: "/img/tng/tngsimulation.png",
      links: [{ label: "Código", href: "https://github.com/mmmaxii/ProyectosU-2025/tree/main/Astrofisica%20Experimental/Experiencia%204" }],
    },
    deep: { src: HUBBLE + "large/heic1214a.jpg", ra: 53.1618, dec: -27.7917, widthDeg: 0.03971416, fx: 0.64129, fy: 0.67141, rot: 51.16, label: "Hubble XDF · óptico + 1.1–1.6 µm", credit: "NASA, ESA, G. Illingworth, D. Magee, P. Oesch, R. Bouwens y HUDF09 Team" },
  },
  {
    id: "a370", band: "ir", cat: "Abell 370", name: "Cúmulo que actúa como lente", ra: 39.9708, dec: -1.5778, fov: 0.026,
    fact: "Su masa curva la luz de galaxias más lejanas y forma arcos gigantes.",
    project: {
      title: "Simulación de lente gravitacional", tech: ["Python", "NumPy", "Matplotlib"],
      desc: "Modelo de esfera isoterma singular con shear externo; se ajustan los parámetros y se ve cómo se deforma la galaxia de fondo.",
      img: "/img/lensing/lente_gravitacional.gif",
      links: [{ label: "Código", href: "https://github.com/mmmaxii/Simulacion-lente-gravitacional" }],
    },
    deep: { src: HUBBLE + "publicationjpg/heic1711a.jpg", ra: 39.9702863319, dec: -1.57683079556, widthDeg: 0.03470539, fx: 0.5, fy: 0.5, rot: -27.94, label: "Hubble WFC3 + ACS · óptico + 1.1–1.6 µm", credit: "NASA, ESA/Hubble, HST Frontier Fields" },
  },

  // ---- Ultravioleta: IA
  {
    id: "m83", band: "uv", cat: "M83", name: "Galaxia del Molinete Austral", ra: 204.254, dec: -29.866, fov: 0.095,
    fact: "Espiral barrada con brazos llenos de estrellas jóvenes; en ultravioleta casi solo se ven los brazos.",
    project: {
      title: "Asterion", tech: ["LangChain", "Gemini", "FastAPI", "Postgres + pgvector", "ChromaDB", "Docker", "AWS"],
      desc: "Asistente de investigación astrofísica con RAG y 35 herramientas sobre NASA Exoplanet Archive, ADS, SIMBAD, Gaia DR3 y VizieR. Cita cada dato, usa búsqueda híbrida con pgvector y tiene más de 470 tests.",
      links: [{ label: "Ver sitio", href: "https://asterion-rag.vercel.app/" }],
    },
    deep: { src: HUBBLE + "publicationjpg/heic1403a.jpg", ra: 204.251540572, dec: -29.8631893734, widthDeg: 0.125407, fx: 0.5, fy: 0.5, rot: -84.68, label: "Hubble WFC3 · U (336 nm) + óptico", credit: "NASA, ESA, Hubble Heritage Team; W. Blair" },
  },
  {
    id: "ngc300", band: "uv", cat: "NGC 300", name: "Espiral de Sculptor", ra: 13.723, dec: -37.684, fov: 0.38,
    fact: "Galaxia espiral cercana, casi de frente, con formación estelar repartida en todo el disco.",
    project: {
      title: "DecoIA: motor de IA", tech: ["Claude API", "Replicate Flux Kontext", "Django"],
      desc: "La parte de IA de DecoIA: análisis de la foto con Claude, generación de renders con Flux Kontext y cruce con productos reales.",
      links: [{ label: "Ver sitio", href: "https://www.decoia.cl/" }],
    },
    deep: { src: ESO + "publicationjpg/eso1037a.jpg", ra: 13.722861, dec: -37.684236, widthDeg: 0.5035894, fx: 0.504, fy: 0.50238, rot: 0.1095, label: "MPG/ESO 2.2 m WFI · óptico", credit: "ESO" },
  },
];

/* ------------------------- Espectro de herramientas ------------------------- */
// Cada herramienta es una línea de emisión. La intensidad de la línea es el número de
// proyectos o cursos donde aparece (las fuentes de abajo), no una autoevaluación.
// El ancho de cada banda en λ se calcula según cuántas herramientas tiene.

export interface Source {
  label: string;
  target?: string; // id del objeto del cielo donde vive ese proyecto
}

export const SOURCES: Record<string, Source> = {
  decoia: { label: "DecoIA", target: "30dor" },
  decoiaia: { label: "DecoIA: motor de IA", target: "ngc300" },
  alke: { label: "Alke Wallet Fullstack", target: "omegacen" },
  bancopy: { label: "Gestor BancoPy", target: "47tuc" },
  pa3py: { label: "PA3Py y práctica", target: "pds70" },
  ngeo: { label: "Neural Geodesics", target: "sgra" },
  ifu: { label: "Espectroscopía IFU", target: "ngc5972" },
  tng: { label: "ML con TNG50", target: "hudf" },
  lens: { label: "Lente gravitacional", target: "a370" },
  asterion: { label: "Asterion", target: "m83" },
  gada: { label: "Certificado Google Advanced Data Analytics" },
  bootcamp: { label: "Bootcamp Fullstack Python" },
  web: { label: "Este portafolio" },
};

export interface SpectrumBand {
  id: string;
  name: string;
  tools: { name: string; sources: string[] }[];
}

export const SPECTRUM: SpectrumBand[] = [
  {
    id: "backend", name: "Backend",
    tools: [
      { name: "Python", sources: ["bancopy", "pa3py", "ngeo", "ifu", "tng", "lens", "asterion", "gada"] },
      { name: "Django", sources: ["decoia", "alke", "bootcamp"] },
      { name: "FastAPI", sources: ["asterion"] },
      { name: "APIs REST", sources: ["decoia", "asterion"] },
      { name: "POO", sources: ["bancopy", "bootcamp"] },
      { name: "pytest", sources: ["pa3py", "asterion"] },
      { name: "JWT", sources: ["bootcamp"] },
    ],
  },
  {
    id: "datos", name: "Bases de datos",
    tools: [
      { name: "SQL", sources: ["alke", "bancopy", "asterion", "gada"] },
      { name: "PostgreSQL", sources: ["decoia", "asterion"] },
      { name: "pgvector", sources: ["asterion"] },
      { name: "SQLite", sources: ["alke", "bancopy", "asterion"] },
      { name: "MySQL", sources: ["bootcamp"] },
      { name: "ChromaDB", sources: ["asterion"] },
      { name: "BigQuery", sources: ["gada"] },
    ],
  },
  {
    id: "analisis", name: "Análisis de datos",
    tools: [
      { name: "NumPy", sources: ["pa3py", "ngeo", "ifu", "tng", "lens"] },
      { name: "pandas", sources: ["gada"] },
      { name: "SciPy", sources: ["pa3py"] },
      { name: "Matplotlib", sources: ["pa3py", "ifu", "lens"] },
      { name: "Jupyter", sources: ["gada"] },
      { name: "EDA", sources: ["gada"] },
      { name: "Pruebas de hipótesis", sources: ["gada"] },
      { name: "Tableau", sources: ["gada"] },
      { name: "Astropy", sources: ["ifu"] },
      { name: "h5py", sources: ["pa3py"] },
    ],
  },
  {
    id: "ml", name: "Machine learning",
    tools: [
      { name: "scikit-learn", sources: ["gada"] },
      { name: "Regresión lineal", sources: ["gada"] },
      { name: "Regresión logística", sources: ["gada"] },
      { name: "Naive Bayes", sources: ["gada"] },
      { name: "Árboles de decisión", sources: ["gada"] },
      { name: "Random Forest", sources: ["gada"] },
      { name: "XGBoost", sources: ["gada"] },
      { name: "K-means", sources: ["gada"] },
    ],
  },
  {
    id: "dl", name: "Deep learning",
    tools: [
      { name: "PyTorch", sources: ["ngeo", "tng", "asterion"] },
      { name: "TensorFlow", sources: ["tng"] },
      { name: "CUDA", sources: ["ngeo", "asterion"] },
      { name: "PINNs", sources: ["ngeo"] },
      { name: "ONNX", sources: ["ngeo"] },
    ],
  },
  {
    id: "ia", name: "IA y LLM",
    tools: [
      { name: "LLMs", sources: ["decoiaia", "asterion"] },
      { name: "RAG", sources: ["asterion"] },
      { name: "LangChain", sources: ["asterion"] },
      { name: "Claude API", sources: ["decoiaia"] },
      { name: "Gemini API", sources: ["asterion"] },
      { name: "Embeddings", sources: ["asterion"] },
    ],
  },
  {
    id: "frontend", name: "Frontend",
    tools: [
      { name: "React", sources: ["decoia"] },
      { name: "Next.js", sources: ["web"] },
      { name: "TypeScript", sources: ["web"] },
      { name: "JavaScript", sources: ["alke", "bootcamp"] },
      { name: "Vite", sources: ["decoia"] },
    ],
  },
  {
    id: "infra", name: "Infraestructura",
    tools: [
      { name: "Git", sources: ["decoia", "pa3py", "asterion", "web"] },
      { name: "Docker", sources: ["asterion"] },
      { name: "GitHub Actions", sources: ["pa3py"] },
      { name: "AWS", sources: ["asterion"] },
      { name: "Vercel", sources: ["asterion", "web"] },
      { name: "Railway", sources: ["alke"] },
      { name: "HPC (Geryon 2)", sources: ["pa3py"] },
    ],
  },
];
