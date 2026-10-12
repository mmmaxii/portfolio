import Sky from "@/components/Sky";
import Spectrum from "@/components/Spectrum";
import CopyEmail from "@/components/CopyEmail";
import Catalog from "@/components/Catalog";
import { profile } from "@/data/content";

export default function Home() {
  return (
    <>
      <header className="bar">
        <a className="mono-mark" href="#cielo">
          <span>MV</span>
          <span>{profile.name}</span>
        </a>
        <nav className="nav" aria-label="Secciones">
          <a href="#cielo">Cielo</a>
          <a href="#sobre">Sobre mí</a>
          <a href="#stack">Stack</a>
          <a href="#proyectos">Proyectos</a>
          <a href="#contacto">Contacto</a>
        </nav>
      </header>

      <Sky />

      <main className="paper">
        <section className="blk" id="sobre">
          <div className="wrap">
            <div className="sec-head">
              <span className="k">Sobre mí</span>
              <h2>
                Datos del cielo,
                <br />
                software en la tierra
              </h2>
            </div>
            <div className="about">
              <dl className="facts">
                <div>
                  <dt>Base</dt>
                  <dd>Los Ángeles, Biobío</dd>
                </div>
                <div>
                  <dt>Formación</dt>
                  <dd>Licenciatura en Astronomía, PUC</dd>
                </div>
                <div>
                  <dt>Foco</dt>
                  <dd>Backend Python, datos, IA</dd>
                </div>
                <div>
                  <dt>Proyección</dt>
                  <dd>Discos protoplanetarios</dd>
                </div>
              </dl>
              <div className="txt">
                <p>
                  Estudié astronomía en la PUC. Trabajando con datos de Gaia DR3, TESS, MUSE y simulaciones como
                  IllustrisTNG descubrí que lo que más disfruto es escribir el software que procesa esos datos.
                </p>
                <p>
                  Hoy desarrollo backend en Python: APIs con Django y FastAPI, pipelines de datos y aplicaciones con
                  modelos de lenguaje. Mantengo <strong>DecoIA</strong>, una plataforma de diseño de interiores con
                  IA, y <strong>PA3Py</strong>, un paquete de simulación de crecimiento planetario.
                </p>
                <p>
                  Además soy papá a tiempo completo, lo que me obliga a ser ordenado con el tiempo. A futuro me
                  interesa investigar cómo se forman los mundos oceánicos en discos protoplanetarios.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="blk" id="stack">
          <div className="wrap">
            <div className="sec-head">
              <span className="k">Stack</span>
              <h2>Espectro de herramientas</h2>
            </div>
            <p className="lede">
              Cada herramienta es una línea de emisión. La altura de la línea es el número de proyectos o cursos donde
              la usé: mientras más marcada, más la he trabajado. Baja para ir encendiendo las bandas.
            </p>
            <Spectrum />
          </div>
        </section>

        <section className="blk" id="proyectos">
          <div className="wrap">
            <div className="sec-head">
              <span className="k">Proyectos</span>
              <h2>Catálogo</h2>
            </div>
            <p className="lede">Cada proyecto vive en un objeto real del cielo. Al abrirlo, la cámara vuela hasta él.</p>
            <Catalog />
          </div>
        </section>

        <section className="blk" id="contacto">
          <div className="wrap">
            <div className="sec-head">
              <span className="k">Contacto</span>
              <h2>Hablemos</h2>
            </div>
            <div className="contact">
              <CopyEmail email={profile.email} />
            </div>
            <div className="social">
              <a href={profile.github} target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
            </div>
          </div>
        </section>

        <footer className="wrap">
          <p>
            Cielo: Aladin Lite (CDS, Strasbourg) con HiPS de Mellinger, DSS2 (STScI), 2MASS (UMass/IPAC-Caltech) y
            GALEX GR6/7 (NASA/JPL-Caltech). Imágenes profundas: ESO y ESA/Hubble (CC BY 4.0), con su crédito en cada
            objeto. Coordenadas ICRS J2000.
          </p>
          <p>© 2026 {profile.fullName}</p>
        </footer>
      </main>
    </>
  );
}
