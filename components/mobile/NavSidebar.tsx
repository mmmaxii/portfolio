"use client";

import { useEffect, useState } from "react";
import { skyObjects } from "@/data/content";
import styles from "./NavSidebar.module.css";

/*
 * Sidebar de navegación para la vista simple/no interactiva. Solo visible en
 * pantallas anchas (ver NavSidebar.module.css) — en móvil angosto no hay
 * espacio para ella y el scroll simple ya es suficiente.
 */
export default function NavSidebar() {
  const [active, setActive] = useState<string>(skyObjects[0]?.id ?? "");

  useEffect(() => {
    const sections = skyObjects
      .map((o) => document.getElementById(`m-${o.id}`))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id.replace(/^m-/, ""));
          }
        });
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className={styles.sidebar} aria-label="Navegación de secciones">
      <span className={styles.kicker}>Secciones</span>
      <ul className={styles.list}>
        {skyObjects.map((object) => (
          <li key={object.id}>
            <a
              href={`#m-${object.id}`}
              className={`${styles.link} ${active === object.id ? styles.linkActive : ""}`}
            >
              <span className={styles.dot} style={{ color: `var(${object.colorVar})` }} aria-hidden="true" />
              {object.section}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
