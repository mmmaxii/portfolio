"use client";

import { useState } from "react";
import { celestialSections, profile, type SectionId } from "@/data/content";
import AboutSection from "@/components/sections/AboutSection";
import ResearchSection from "@/components/sections/ResearchSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import TechStackSection from "@/components/sections/TechStackSection";
import ContactSection from "@/components/sections/ContactSection";
import CenterStar from "./CenterStar";
import CelestialObject from "./CelestialObject";
import SectionPanel from "@/components/panel/SectionPanel";
import styles from "./StarMap.module.css";

const sectionComponents: Record<SectionId, React.ComponentType> = {
  about: AboutSection,
  research: ResearchSection,
  projects: ProjectsSection,
  stack: TechStackSection,
  contact: ContactSection,
};

export default function StarMap() {
  const [activeId, setActiveId] = useState<SectionId | null>(null);

  const activeSection = celestialSections.find((s) => s.id === activeId) ?? null;
  const ActiveContent = activeId ? sectionComponents[activeId] : null;

  return (
    <main className={styles.map}>
      <CenterStar />
      {celestialSections.map((section, i) => (
        <CelestialObject
          key={section.id}
          section={section}
          index={i}
          onOpen={() => setActiveId(section.id)}
        />
      ))}
      <p className={styles.hint}>Haz clic en un objeto para explorar</p>
      <footer className={styles.footer}>{profile.footer}</footer>
      <SectionPanel
        open={activeId !== null}
        title={activeSection?.label ?? ""}
        onClose={() => setActiveId(null)}
      >
        {ActiveContent && <ActiveContent />}
      </SectionPanel>
    </main>
  );
}
