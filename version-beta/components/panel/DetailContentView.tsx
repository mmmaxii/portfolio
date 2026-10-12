import {
  getProject,
  getTechCategory,
  type DetailContent,
} from "@/data/content";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import ResearchSection from "@/components/sections/ResearchSection";
import ProjectDetail from "./ProjectDetail";
import RichText from "@/components/ui/RichText";
import styles from "./DetailContentView.module.css";

export default function DetailContentView({ detail }: { detail: DetailContent }) {
  switch (detail.type) {
    case "about":
      return <AboutSection />;
    case "contact":
      return <ContactSection />;
    case "research":
      return <ResearchSection />;
    case "project": {
      const project = getProject(detail.projectTitle);
      if (!project) return null;
      return <ProjectDetail project={project} />;
    }
    case "tech": {
      const cat = getTechCategory(detail.category);
      if (!cat) return null;
      return (
        <div className={styles.section}>
          <h3 className={styles.heading}>{cat.category}</h3>
          <div className={styles.techGrid}>
            {cat.items.map((item) => (
              <span key={item} className={styles.techItem}>
                {item}
              </span>
            ))}
          </div>
        </div>
      );
    }
    case "note":
      return (
        <div className={styles.section}>
          {detail.body.map((p, i) => (
            <p key={i} className={styles.paragraph}>
              <RichText text={p} />
            </p>
          ))}
        </div>
      );
  }
}
