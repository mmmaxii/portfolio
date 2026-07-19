import { celestialSections, profile } from "@/data/content";
import AboutSection from "@/components/sections/AboutSection";
import ResearchSection from "@/components/sections/ResearchSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import TechStackSection from "@/components/sections/TechStackSection";
import ContactSection from "@/components/sections/ContactSection";
import CelestialArt from "@/components/starmap/CelestialArt";
import type { SectionId } from "@/data/content";
import styles from "./MobileLayout.module.css";

const sectionComponents: Record<SectionId, React.ComponentType> = {
  about: AboutSection,
  research: ResearchSection,
  projects: ProjectsSection,
  stack: TechStackSection,
  contact: ContactSection,
};

export default function MobileLayout() {
  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <h1 className={styles.name}>{profile.name}</h1>
        <p className={styles.role}>{profile.role}</p>
      </header>

      {celestialSections.map((section) => {
        const Section = sectionComponents[section.id];
        return (
          <section key={section.id} className={styles.card} aria-labelledby={`m-${section.id}`}>
            <div className={styles.cardHeader}>
              <div className={styles.cardArt} aria-hidden="true">
                <CelestialArt kind={section.object} size={54} />
              </div>
              <div>
                <h2 id={`m-${section.id}`} className={styles.cardTitle}>
                  {section.label}
                </h2>
                <p className={styles.cardTagline}>{section.tagline}</p>
              </div>
            </div>
            <Section />
          </section>
        );
      })}

      <footer className={styles.footer}>{profile.footer}</footer>
    </main>
  );
}
