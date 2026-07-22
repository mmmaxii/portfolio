"use client";

import type { SkyObject } from "@/data/content";
import SkyGlyph from "./SkyGlyph";
import styles from "./SkyNode.module.css";

type NodeState = "idle" | "focused" | "dimmed";

interface SkyNodeProps {
  object: SkyObject;
  state: NodeState;
  onOpen: () => void;
}

export default function SkyNode({ object, state, onOpen }: SkyNodeProps) {
  const markerSize = object.size + 40;
  return (
    <button
      type="button"
      className={`${styles.node} ${styles[state]}`}
      style={{ top: object.position.top, left: object.position.left }}
      onClick={onOpen}
      tabIndex={state === "dimmed" ? -1 : 0}
      aria-haspopup="dialog"
      aria-label={`${object.section} — ${object.object}`}
    >
      <span className={styles.glyphWrap}>
        <span
          className={styles.marker}
          style={{ width: markerSize, height: markerSize }}
          aria-hidden="true"
        />
        <SkyGlyph kind={object.kind} colorVar={object.colorVar} size={object.size} />
      </span>
      <span className={styles.tag}>
        <span className={styles.catalog}>{object.catalog}</span>
        <span className={styles.label}>{object.section}</span>
      </span>
    </button>
  );
}
