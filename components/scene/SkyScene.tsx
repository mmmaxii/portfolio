"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { profile, skyObjects, type SkyChild, type SkyObject } from "@/data/content";
import { scatterChildPositions } from "@/lib/scatter";
import SkyNode from "./SkyNode";
import ChildNode from "./ChildNode";
import CasaPanel from "@/components/panel/CasaPanel";
import { GithubIcon, MailIcon } from "@/components/ui/Icons";
import styles from "./SkyScene.module.css";

const ZOOM = 2.2;
const FOCUS_CENTER_X = 50;
const FOCUS_CENTER_Y = 40;

export default function SkyScene() {
  const [focused, setFocused] = useState<SkyObject | null>(null);
  const [showChildren, setShowChildren] = useState(false);
  const [detail, setDetail] = useState<{ object: SkyObject; child: SkyChild | null } | null>(null);

  const openObject = useCallback((object: SkyObject) => {
    if (typeof window !== "undefined") {
      const px = (parseFloat(object.position.left) / 100) * window.innerWidth;
      const py = (parseFloat(object.position.top) / 100) * window.innerHeight;
      window.dispatchEvent(
        new CustomEvent("celestial-warp", { detail: { x: px, y: py, isFocused: true } })
      );
    }

    if (object.children && object.children.length > 0) {
      setShowChildren(false);

      // PASO 1: Durante los primeros 650ms la estrella permanece FIJA en su lugar
      // mientras explota el efecto Warp Sci-Fi radial.

      // PASO 2: A los 650ms (al terminar las estelas warp), la cámara realiza la
      // traslación y zoom para centrar suavemente la estrella en (50% X, 40% Y).
      setTimeout(() => {
        setFocused(object);
      }, 650);

      // PASO 3: A los 1200ms (cuando la cámara ha concluido su asentamiento),
      // se despliegan secuencialmente los sub-nodos y el campo estelar profundo.
      setTimeout(() => {
        setShowChildren(true);
      }, 1200);
    } else {
      setDetail({ object, child: null });
    }
  }, []);

  const exitFocus = useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("celestial-warp", { detail: { isFocused: false } })
      );
    }
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

  // Al hacer zoom, la cámara centra perfectamente la fuente seleccionada en (50% X, 40% Y)
  const universeStyle = focused
    ? {
        transformOrigin: "0 0",
        transform: `translate(${(FOCUS_CENTER_X - ZOOM * parseFloat(focused.position.left)).toFixed(2)}vw, ${(
          FOCUS_CENTER_Y -
          ZOOM * parseFloat(focused.position.top)
        ).toFixed(2)}vh) scale(${ZOOM})`,
      }
    : {
        transformOrigin: "0 0",
        transform: "translate(0vw, 0vh) scale(1)",
      };

  // Dispersión orbital simétrica en anillo alrededor del objeto centrado
  const scatterPositions = useMemo(() => {
    if (!focused?.children) return null;
    return scatterChildPositions(focused.children.length);
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
            style={{
              color: `var(${focused.colorVar})`,
              left: `${FOCUS_CENTER_X}%`,
              top: `calc(${FOCUS_CENTER_Y}% + 55px)`,
            }}
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
