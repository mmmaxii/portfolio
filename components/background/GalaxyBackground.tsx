"use client";

import dynamic from "next/dynamic";

const Galaxy = dynamic(() => import("./Galaxy"), { ssr: false });

export default function GalaxyBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: "var(--bg-deep)",
      }}
    >
      <Galaxy
        hueShift={240}
        saturation={0.35}
        glowIntensity={0.35}
        twinkleIntensity={0.35}
        density={1.2}
        speed={0.6}
        starSpeed={0.3}
        rotationSpeed={0.03}
        mouseRepulsion={false}
        mouseInteraction
        transparent={false}
      />
    </div>
  );
}
