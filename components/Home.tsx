import { existsSync } from "node:fs";
import { join } from "node:path";
import { Fragment } from "react";
import Sky from "@/components/Sky";
import Spectrum from "@/components/Spectrum";
import CopyEmail from "@/components/CopyEmail";
import Catalog from "@/components/Catalog";
import ThemeToggle from "@/components/ThemeToggle";
import HtmlLang from "@/components/HtmlLang";
import { profile } from "@/data/content";
import { UI, type Locale } from "@/data/ui";

// El botón del CV aparece solo si el PDF está en public/cv/ al momento de compilar.
const CV_PATH = "/cv/CV-Maximiliano-Valderrama.pdf";
const hasCv = existsSync(join(process.cwd(), "public", CV_PATH));

/** Párrafo con **negritas**. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
        part.startsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}

/** Página completa; la usan / (español) y /en (inglés). */
export default function Home({ locale }: { locale: Locale }) {
  const U = UI[locale];

  const switches = (
    <span className="switches">
      <a href={U.otherLocale.href} hrefLang={locale === "es" ? "en" : "es"} title={U.otherLocale.title}>
        {U.otherLocale.label}
      </a>
      <ThemeToggle toDark={U.theme.toDark} toLight={U.theme.toLight} />
    </span>
  );

  return (
    <>
      {locale !== "es" && <HtmlLang lang={locale} />}
      <header className="bar">
        <nav className="nav" aria-label={U.nav.sky}>
          <a href="#cielo">{U.nav.sky}</a>
          <a href="#sobre">{U.nav.about}</a>
          <a href="#stack">{U.nav.stack}</a>
          <a href="#proyectos">{U.nav.projects}</a>
          <a href="#contacto">{U.nav.contact}</a>
          {hasCv && (
            <a href={CV_PATH} download>
              {U.nav.cv}
            </a>
          )}
        </nav>
        {switches}
      </header>

      <Sky locale={locale} />

      <main className="paper">
        <section className="blk" id="sobre">
          <div className="wrap">
            <div className="sec-head">
              <span className="k">{U.about.k}</span>
              <h2>
                {U.about.h2[0]}
                <br />
                {U.about.h2[1]}
              </h2>
            </div>
            <div className="about">
              <dl className="facts">
                {U.about.facts.map(([dt, dd]) => (
                  <div key={dt}>
                    <dt>{dt}</dt>
                    <dd>{dd}</dd>
                  </div>
                ))}
              </dl>
              <div className="txt">
                {U.about.paragraphs.map((p) => (
                  <p key={p.slice(0, 24)}>
                    <Rich text={p} />
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="blk" id="stack">
          <div className="wrap">
            <div className="sec-head">
              <span className="k">{U.stack.k}</span>
              <h2>{U.stack.h2}</h2>
            </div>
            <p className="lede">{U.stack.lede}</p>
            <Spectrum locale={locale} />
          </div>
        </section>

        <section className="blk" id="proyectos">
          <div className="wrap">
            <div className="sec-head">
              <span className="k">{U.projects.k}</span>
              <h2>{U.projects.h2}</h2>
            </div>
            <p className="lede">{U.projects.lede}</p>
            <Catalog locale={locale} />
          </div>
        </section>

        <section className="blk" id="contacto">
          <div className="wrap">
            <div className="sec-head">
              <span className="k">{U.contact.k}</span>
              <h2>{U.contact.h2}</h2>
            </div>
            <div className="contact">
              <CopyEmail email={profile.email} locale={locale} />
            </div>
            <div className="social">
              <a href={profile.github} target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
              {hasCv && (
                <a href={CV_PATH} download>
                  {U.contact.cv}
                </a>
              )}
            </div>
          </div>
        </section>

        <footer className="wrap">
          {U.footer.map((f) => (
            <p key={f.slice(0, 20)}>{f}</p>
          ))}
          <div className="foot-row">
            <p>© 2026 {profile.fullName}</p>
            {switches}
          </div>
        </footer>
      </main>
    </>
  );
}
