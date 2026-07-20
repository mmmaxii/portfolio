"use client";

import { useCallback, useEffect, useState } from "react";
import { profile, skyObjects, type SkyChild, type SkyObject } from "@/data/content";
import { buildConstellation, DRAW_MS } from "@/lib/constellation";
import SkyNode from "./SkyNode";
import ChildNode from "./ChildNode";
import Constellation from "./Constellation";
import ChildConstellation from "./ChildConstellation";
import CasaPanel from "@/components/panel/CasaPanel";
import { GithubIcon, MailIcon } from "@/components/ui/Icons";
import styles from "./SkyScene.module.css";

const ZOOM = 2.5;
const RING_RADIUS = 30; // vmin
const { objectFraction } = buildConstellation();

export default function SkyScene() {
  const [focused, setFocused] = useState<SkyObject | null>(null);
  const [detail, setDetail] = useState<{ object: SkyObject; child: SkyChild | null } | null>(null);

  const openObject = useCallback((object: SkyObject) => {
    if (object.children && object.children.length > 0) {
      setFocused(object);
    } else {
      setDetail({ object, child: null });
    }
  }, []);

  const exitFocus = useCallback(() => setFocused(null), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !detail && focused) {
        setFocused(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detail, focused]);

  const universeStyle = focused
    ? {
        transform: `translate(${(50 - ZOOM * parseFloat(focused.position.left)).toFixed(2)}%, ${(
          50 -
          ZOOM * parseFloat(focused.position.top)
        ).toFixed(2)}%) scale(${ZOOM})`,
      }
    : { transform: "translate(0%, 0%) scale(1)" };

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
        <Constellation hidden={focused !== null} />
        {skyObjects.map((object) => (
          <SkyNode
            key={object.id}
            object={object}
            state={focused ? (focused.id === object.id ? "focused" : "dimmed") : "idle"}
            appearDelay={Math.round((objectFraction[object.id] ?? 0) * DRAW_MS)}
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

      {/* Nivel objeto: anillo de sub-portales */}
      {focused && focused.children && (
        <div className={styles.childLayer}>
          <button type="button" className={styles.back} onClick={exitFocus}>
            ← Volver al cielo
          </button>
          <ChildConstellation
            count={focused.children.length}
            radiusVmin={RING_RADIUS}
            colorVar={focused.colorVar}
          />
          <div className={styles.focusCaption} style={{ color: `var(${focused.colorVar})` }}>
            <p className={styles.focusCatalog}>{focused.catalog}</p>
            <h2 className={styles.focusTitle}>{focused.section}</h2>
            <p className={styles.focusBlurb}>{focused.blurb}</p>
          </div>
          {focused.children.map((child, i) => {
            const n = focused.children!.length;
            const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
            return (
              <ChildNode
                key={child.id}
                child={child}
                colorVar={focused.colorVar}
                angle={angle}
                radius={RING_RADIUS}
                delay={0.18 + 0.08 * i}
                onOpen={() => setDetail({ object: focused, child })}
              />
            );
          })}
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
