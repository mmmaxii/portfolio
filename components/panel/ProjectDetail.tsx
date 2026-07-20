import type { Project } from "@/data/content";
import ImageCarousel from "@/components/ui/ImageCarousel";
import RichText from "@/components/ui/RichText";
import { GithubIcon, GlobeIcon } from "@/components/ui/Icons";
import styles from "./ProjectDetail.module.css";

/*
 * Tarjeta de proyecto en el visor: texto a la izquierda, imagen a la derecha,
 * y el código / enlaces al final (a lo ancho). En pantallas angostas se apila.
 */
export default function ProjectDetail({ project }: { project: Project }) {
  return (
    <article className={styles.card}>
      <div className={styles.row}>
        <div className={styles.text}>
          <h3 className={styles.title}>{project.title}</h3>
          <p className={styles.tech}>{project.tech.join(" • ")}</p>
          <p className={styles.desc}>
            <RichText text={project.description} />
          </p>
        </div>
        <div className={styles.media}>
          <ImageCarousel images={project.images} speed={project.carouselSpeed} />
        </div>
      </div>

      {project.links.length > 0 && (
        <div className={styles.links}>
          <span className={styles.linksLabel}>// código &amp; enlaces</span>
          <div className={styles.linkRow}>
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
        </div>
      )}
    </article>
  );
}
