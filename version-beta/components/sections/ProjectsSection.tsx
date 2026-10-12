import { projects } from "@/data/content";
import ProjectCard from "@/components/ui/ProjectCard";
import styles from "./sections.module.css";

export default function ProjectsSection() {
  const mainProjects = projects.filter((p) => p.group === "main");
  const aiProjects = projects.filter((p) => p.group === "ai");

  return (
    <div className={styles.section}>
      <h3 className={styles.subheading}>Proyectos Principales</h3>
      <div className={styles.projectsGrid}>
        {mainProjects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
      <h3 className={styles.subheading}>IA y Simulación Astrofísica</h3>
      <div className={styles.projectsGrid}>
        {aiProjects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </div>
  );
}
