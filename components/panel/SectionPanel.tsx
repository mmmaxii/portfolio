"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CloseIcon } from "@/components/ui/Icons";
import styles from "./SectionPanel.module.css";

interface SectionPanelProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function SectionPanel({ open, title, onClose, children }: SectionPanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.scrollTop = 0;
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onClose={onClose}
      onClick={(e) => {
        // Clicks on the ::backdrop report the dialog element itself as target
        if (e.target === dialogRef.current) onClose();
      }}
      aria-label={title}
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar panel">
            <CloseIcon size={20} />
          </button>
        </header>
        <div className={styles.content}>{children}</div>
      </div>
    </dialog>
  );
}
