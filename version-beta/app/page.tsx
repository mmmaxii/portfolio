"use client";

import { useState } from "react";
import SkyScene from "@/components/scene/SkyScene";
import MobileLayout from "@/components/mobile/MobileLayout";
import styles from "./page.module.css";

export default function Home() {
  const [simple, setSimple] = useState(false);

  if (simple) {
    return (
      <>
        <MobileLayout />
        <button type="button" className={styles.viewToggle} onClick={() => setSimple(false)}>
          ✦ Ver el cielo interactivo
        </button>
      </>
    );
  }

  return (
    <>
      <div className="desktop-only">
        <SkyScene />
        <button type="button" className={styles.viewToggle} onClick={() => setSimple(true)}>
          Vista simple (no interactiva)
        </button>
      </div>
      <div className="mobile-only">
        <MobileLayout />
      </div>
    </>
  );
}
