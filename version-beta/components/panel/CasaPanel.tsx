"use client";

import { useEffect, useRef } from "react";
import type { SkyObject, SkyChild, DetailContent, SectionId } from "@/data/content";
import SkyGlyph from "@/components/scene/SkyGlyph";
import Spectrum from "./Spectrum";
import DetailContentView from "./DetailContentView";
import { CloseIcon } from "@/components/ui/Icons";
import styles from "./CasaPanel.module.css";

interface CasaPanelProps {
  open: boolean;
  object: SkyObject | null;
  child: SkyChild | null;
  onClose: () => void;
}

const MENU_ITEMS = ["Archivo", "Editar", "Ver", "Análisis", "Ayuda"];

export default function CasaPanel({ open, object, child, onClose }: CasaPanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      contentRef.current?.scrollTo(0, 0);
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, child, object]);

  if (!object) {
    return <dialog ref={dialogRef} className={styles.dialog} onClose={onClose} />;
  }

  const detail: DetailContent = child?.detail ?? object.self ?? { type: "about" };
  const sectionId: SectionId = object.id;
  const title = child?.label ?? object.section;
  const source = child?.label ?? object.object;
  const fileName = `${object.catalog
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase()}.fits`;

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      aria-label={`Visor de ${title}`}
    >
      <div className={styles.window} style={{ color: `var(${object.colorVar})` }}>
        <div className={styles.titlebar}>
          <span className={styles.titleText}>CASA Viewer v4.7.1 — {fileName}</span>
          <div className={styles.winButtons}>
            <span className={styles.winBtn} aria-hidden="true">
              _
            </span>
            <span className={styles.winBtn} aria-hidden="true">
              □
            </span>
            <button type="button" className={`${styles.winBtn} ${styles.winClose}`} onClick={onClose} aria-label="Cerrar visor">
              <CloseIcon size={12} />
            </button>
          </div>
        </div>

        <div className={styles.menubar} aria-hidden="true">
          {MENU_ITEMS.map((item) => (
            <span key={item} className={styles.menuItem}>
              {item}
            </span>
          ))}
        </div>

        <div className={styles.body} ref={contentRef}>
          <div className={styles.viewerRow}>
            <div className={styles.imagePane}>
              <span className={styles.paneLabel}>IMAGEN — {object.catalog}</span>
              <div className={styles.imageView}>
                <span className={styles.crossV} aria-hidden="true" />
                <span className={styles.crossH} aria-hidden="true" />
                <SkyGlyph kind={object.kind} colorVar={object.colorVar} size={120} />
              </div>
              <span className={styles.readout}>
                RA {object.ra} · DEC {object.dec}
              </span>
            </div>
            <div className={styles.spectrumPane}>
              <span className={styles.paneLabel}>ESPECTRO — {source.toUpperCase()}</span>
              <Spectrum sectionId={sectionId} />
            </div>
          </div>

          <div className={styles.content}>
            <DetailContentView detail={detail} />
          </div>
        </div>

        <div className={styles.statusbar}>
          <span className={styles.statusReady}>READY</span>
          <span>{object.catalog}</span>
          <span>
            RA {object.ra} DEC {object.dec}
          </span>
          <span className={styles.statusRight}>S/N 42.7 · PIPELINE OK</span>
        </div>
      </div>
    </dialog>
  );
}
