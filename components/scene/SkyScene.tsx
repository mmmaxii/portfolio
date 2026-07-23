"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { profile, skyObjects, type SkyChild, type SkyObject } from "@/data/content";
import { scatterChildPositions } from "@/lib/scatter";
import SkyNode from "./SkyNode";
import ChildNode from "./ChildNode";
import CasaPanel from "@/components/panel/CasaPanel";
import { GithubIcon, MailIcon } from "@/components/ui/Icons";
import styles from "./SkyScene.module.css";

const ZOOM = 2.5;
// Punto donde se asienta el objeto enfocado tras el zoom: a la izquierda,
// dejando el resto de la pantalla libre para que los sub-portales se dispersen.
const FOCUS_X = 20;
const FOCUS_Y = 50;

export default function SkyScene() {
  const [focused, setFocused] = useState<SkyObject | null>(null);
  const [showChildren, setShowChildren] = useState(false);
  const [detail, setDetail] = useState<{ object: SkyObject; child: SkyChild | null } | null>(null);

  const openObject = useCallback((object: SkyObject) => {
    if (typeof window !== "undefined") {
      const px = (parseFloat(object.position.left) / 100) * window.innerWidth;
      const py = (parseFloat(object.position.top) / 100) * window.innerHeight;
      window.dispatchEvent(new CustomEvent("celestial-warp", { detail: { x: px, y: py } }));
    }

    if (object.children && object.children.length > 0) {
      setFocused(object);
      setShowChildren(false);
      // El zoom de la cámara tarda 800ms. Esperamos a que el zoom se complete
      // para desplegar los sub-portales secuencialmente sin solaparse con el movimiento.
      setTimeout(() => {
        setShowChildren(true);
      }, 700);
    } else {
      setDetail({ object, child: null });
    }
  }, []);

  const exitFocus = useCallback(() => {
    setShowChildren(false);
    // Retiramos los sub-portales de inmediato y luego deslizamos la cámara de vuelta al universo
    setTimeout(() => {
      setFocused(null);
    }, 150);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !detail && focused) {
        exitFocus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detail, focused, exitFocus]);

  const universeStyle = focused
    ? {
        transform: `translate(${(FOCUS_X - ZOOM * parseFloat(focused.position.left)).toFixed(2)}%, ${(
          FOCUS_Y -
          ZOOM * parseFloat(focused.position.top)
        ).toFixed(2)}%) scale(${ZOOM})`,
      }
    : { transform: "translate(0%, 0%) scale(1)" };

  // Dispersión estructurada de los sub-portales alrededor del objeto enfocado.
  const scatterPositions = useMemo(() => {
    if (!focused?.children) return null;
    return scatterChildPositions(focused.id, focused.children.length);
  }, [focused]);

  return (
    <main className={styles.map}>
      {/* Capa del universo: los 6 objetos; hace el "vuelo" al enfocar */}
      <div
        className={styles.universe}
        style={universeStyle}
        onClick={(e) => {
          if (e.target === e.currentTarget && focused) exitFocus();
        }}
      >
        {skyObjects.map((object) => (
          <SkyNode
            key={object.id}
            object={object}
            state={focused ? (focused.id === object.id ? "focused" : "dimmed") : "idle"}
            onOpen={() => openObject(object)}
          />
        ))}
      </div>

      {/* Hero (nivel cielo) */}
      <div className={`${styles.hero} ${focused ? styles.heroHidden : ""}`}>
        <p className={styles.heroKicker}>Cielo austral · Los Ángeles, Chile · 37° S</p>
        <h1 className={styles.heroName}>{profile.name}</h1>
        <p className={styles.heroRole}>{profile.role}</p>
      </div>

      {/* Nivel objeto: se muestra SOLO cuando el zoom ha concluido */}
      {focused && focused.children && showChildren && scatterPositions && (
        <div className={styles.childLayer}>
          <button type="button" className={styles.back} onClick={exitFocus}>
            ← Volver al cielo
          </button>
          <div
            className={styles.focusCaption}
            style={{ color: `var(${focused.colorVar})`, left: `${FOCUS_X}%`, top: `${FOCUS_Y}%` }}
          >
            <p className={styles.focusCatalog}>{focused.catalog}</p>
            <h2 className={styles.focusTitle}>{focused.section}</h2>
            <p className={styles.focusBlurb}>{focused.blurb}</p>
          </div>
          {focused.children.map((child, i) => (
            <ChildNode
              key={child.id}
              child={child}
              colorVar={focused.colorVar}
              x={scatterPositions[i].x}
              y={scatterPositions[i].y}
              appearDelay={100 * i}
              onOpen={() => setDetail({ object: focused, child })}
            />
          ))}
        </div>
      )}

      {/* HUD */}
      <p className={`${styles.hint} ${focused ? styles.hintHidden : ""}`}>
        Selecciona una fuente catalogada para observarla
      </p>
      <div className={`${styles.social} ${focused ? styles.heroHidden : ""}`}>
        <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <GithubIcon size={18} />
        </a>
        <a href={`mailto:${profile.email}`} aria-label="Email">
          <MailIcon size={18} />
        </a>
      </div>
      <footer className={`${styles.footer} ${focused ? styles.heroHidden : ""}`}>{profile.footer}</footer>

      <CasaPanel
        open={detail !== null}
        object={detail?.object ?? focused ?? null}
        child={detail?.child ?? null}
        onClose={() => setDetail(null)}
      />
    </main>
  );
}
