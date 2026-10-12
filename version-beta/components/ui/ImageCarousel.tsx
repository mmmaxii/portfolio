"use client";

import { useEffect, useState } from "react";
import type { ProjectImage } from "@/data/content";
import styles from "./ImageCarousel.module.css";

interface ImageCarouselProps {
  images: ProjectImage[];
  /** "fast" replicates the old black-hole carousel (1.2 s per slide). */
  speed?: "normal" | "fast";
}

export default function ImageCarousel({ images, speed = "normal" }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const delay = speed === "fast" ? 1200 : 4000;

  useEffect(() => {
    if (images.length < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, delay);
    return () => clearInterval(id);
  }, [images.length, paused, delay]);

  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className={styles.frame}>
        <img src={images[0].src} alt={images[0].alt} className={styles.single} loading="lazy" />
      </div>
    );
  }

  return (
    <div
      className={styles.frame}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {images.map((img, i) => (
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          className={`${styles.slide} ${i === index ? styles.slideActive : ""} ${
            speed === "fast" ? styles.slideFast : ""
          }`}
          loading={i === 0 ? "eager" : "lazy"}
        />
      ))}
      <div className={styles.dots}>
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
            aria-label={`Imagen ${i + 1} de ${images.length}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
