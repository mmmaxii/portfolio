import type { Project } from "@/data/content";
import ImageCarousel from "./ImageCarousel";
import RichText from "./RichText";
import { GithubIcon, GlobeIcon } from "./Icons";
import styles from "./ProjectCard.module.css";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={styles.card}>
      <ImageCarousel images={project.images} speed={project.carouselSpeed} />
      <div className={styles.body}>
        <h4 className={styles.title}>{project.title}</h4>
        <p className={styles.tech}>{project.tech.join(" • ")}</p>
        <p className={styles.description}>
          <RichText text={project.description} />
        </p>
        {project.links.length > 0 && (
          <div className={styles.links}>
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {link.kind === "demo" ? <GlobeIcon size={15} /> : <GithubIcon size={15} />}
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
