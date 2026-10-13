// Traducción al inglés del contenido de content.ts (solo textos; coordenadas e imágenes no cambian).

interface BandText {
  label: string;
  kicker: string;
  title: string;
  text: string;
  note: string;
}

interface TargetText {
  name: string;
  fact: string;
  title?: string;
  desc: string;
  links: string[];
  deepLabel?: string;
}

export const EN: {
  bands: Record<string, BandText>;
  targets: Record<string, TargetText>;
  spectrum: Record<string, { name: string; species: string }>;
  tools: Record<string, string>;
  sources: Record<string, string>;
} = {
  bands: {
    uv: {
      label: "Ultraviolet",
      kicker: "ULTRAVIOLET · λ 0.15–0.28 µm",
      title: "AI and automation",
      text: "In the ultraviolet, the young, hot stars of spiral arms shine. Here are the projects where I work with language models.",
      note: "GALEX covered the sky in patches and avoided the Milky Way plane: zoom out and you will see areas with no data.",
    },
    vis: {
      label: "Visible",
      kicker: "VISIBLE · λ 0.4–0.7 µm",
      title: "What I build",
      text: "The light the eye sees. Applications anyone can open and use.",
      note: "Southern sky from 37° S: Carina, Crux and the Magellanic Clouds.",
    },
    ir: {
      label: "Infrared",
      kicker: "INFRARED · λ 1.2–2.2 µm",
      title: "What I research",
      text: "Infrared light passes through dust and reveals disks, galactic nuclei and what visible light hides. My work in astronomy.",
      note: "The center of the galaxy: in visible light it is a dark dust lane; here you see the whole bulge.",
    },
  },
  targets: {
    "30dor": {
      name: "Tarantula Nebula",
      fact: "The most active star-forming region in the Local Group, in the Large Magellanic Cloud.",
      desc: "AI-powered interior design PWA. Upload a photo and get design ideas, step-by-step instructions, renders and products from Mercado Libre. In production; private code.",
      links: ["Visit site"],
      deepLabel: "Hubble + MPG/ESO 2.2 m · optical",
    },
    omegacen: {
      name: "Omega Centauri",
      fact: "The most massive globular cluster in the Milky Way: about ten million stars.",
      desc: "Digital wallet with Django templates and a SQL backend. Transactions with transaction.atomic to keep sub-accounts separate, Chart.js charts and transfers without page reloads.",
      links: ["Open app", "Repository"],
    },
    "47tuc": {
      name: "47 Tucanae",
      fact: "Globular cluster next to the Small Magellanic Cloud, visible to the naked eye from Chile.",
      title: "BancoPy Manager",
      desc: "Terminal banking system: authentication, multi-user transactions with Regular, Corporate and VIP accounts, and emails via SendGrid.",
      links: ["Repository"],
      deepLabel: "VISTA · Y J Ks (near infrared)",
    },
    pds70: {
      name: "Disk with forming planets",
      fact: "T Tauri star with two planets still forming inside its disk, observed by VLT, ALMA and JWST.",
      title: "Internship: protoplanetary disks and PA3Py",
      desc: "Open source package (pip install pa3py) that computes the growth of planetary embryos by pebble accretion on top of TriPoDPy disk simulations, with a dynamic snowline. Used for more than 5,000 trajectories over 1,300 simulations on the Geryon 2 cluster.",
      links: ["Repository"],
    },
    sgra: {
      name: "Center of the Milky Way",
      fact: "The 4-million-solar-mass black hole at the galactic center. Dust hides it in visible light; in the infrared you see the star cluster around it.",
      desc: "Relativistic ray tracing around Schwarzschild and Kerr black holes. In Schwarzschild, a network with a physics-informed loss replaces the RK45 integrator: 51 times faster, with a mean error of 4.3e-5. In Kerr, closed-form solutions in Mino time make the network unnecessary.",
      links: ["Repository"],
      deepLabel: "VLT/NACO · near infrared",
    },
    ngc5972: {
      name: "Galaxy with an active nucleus",
      fact: "Seyfert 2 galaxy with an ionized gas cloud more than 50,000 light-years across.",
      title: "IFU spectroscopy of NGC 5972",
      desc: "Gas ionization maps with MUSE data: Voronoi binning for signal-to-noise, Balmer decrement correction and a BPT diagram that confirms the AGN in the nucleus.",
      links: ["Code"],
    },
    hudf: {
      name: "Hubble Ultra Deep Field",
      fact: "A patch of sky that looks empty and holds about 10,000 galaxies. Cosmological simulations aim to reproduce galaxies like these.",
      title: "Machine learning with TNG50",
      desc: "Pipeline that extracts galaxies from the TNG50 simulation and trains models to predict stellar mass, star formation and metallicity.",
      links: ["Code"],
      deepLabel: "Hubble XDF · optical + 1.1–1.6 µm",
    },
    a370: {
      name: "Cluster acting as a lens",
      fact: "Its mass bends the light of more distant galaxies and forms giant arcs.",
      title: "Gravitational lens simulation",
      desc: "Singular isothermal sphere model with external shear; adjust the parameters and see how the background galaxy gets distorted.",
      links: ["Code"],
      deepLabel: "Hubble WFC3 + ACS · optical + 1.1–1.6 µm",
    },
    m83: {
      name: "Southern Pinwheel Galaxy",
      fact: "Barred spiral with arms full of young stars; in the ultraviolet you see almost only the arms.",
      desc: "Astrophysics research assistant with RAG and 35 tools over the NASA Exoplanet Archive, ADS, SIMBAD, Gaia DR3 and VizieR. It cites every data point, uses hybrid search with pgvector and has more than 470 tests.",
      links: ["Visit site"],
      deepLabel: "Hubble WFC3 · U (336 nm) + optical",
    },
    ngc300: {
      name: "Sculptor Spiral",
      fact: "Nearby spiral galaxy seen almost face-on, with star formation spread across the whole disk.",
      title: "DecoIA: AI engine",
      desc: "The AI side of DecoIA: photo analysis with Claude, renders with Flux Kontext and matching with real products.",
      links: ["Visit site"],
      deepLabel: "MPG/ESO 2.2 m WFI · optical",
    },
  },
  spectrum: {
    backend: { name: "Backend", species: "Hydrogen · Balmer series" },
    datos: { name: "Databases", species: "Helium" },
    analisis: { name: "Data analysis", species: "Oxygen" },
    ml: { name: "Machine learning", species: "Nitrogen" },
    dl: { name: "Deep learning", species: "Sulfur" },
    ia: { name: "AI and LLMs", species: "Neon" },
    frontend: { name: "Frontend", species: "Calcium" },
    infra: { name: "Infrastructure", species: "Iron" },
  },
  tools: {
    "APIs REST": "REST APIs",
    POO: "OOP",
    "Pruebas de hipótesis": "Hypothesis testing",
    "Regresión lineal": "Linear regression",
    "Regresión logística": "Logistic regression",
    "Árboles de decisión": "Decision trees",
  },
  sources: {
    decoiaia: "DecoIA: AI engine",
    bancopy: "BancoPy Manager",
    pa3py: "PA3Py and internship",
    ifu: "IFU spectroscopy",
    tng: "ML with TNG50",
    lens: "Gravitational lens",
    gada: "Google Advanced Data Analytics Certificate",
    bootcamp: "Python Fullstack Bootcamp",
    web: "This portfolio",
  },
};
