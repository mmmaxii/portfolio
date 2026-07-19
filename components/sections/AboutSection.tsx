import { aboutParagraphs } from "@/data/content";
import RichText from "@/components/ui/RichText";
import styles from "./sections.module.css";

export default function AboutSection() {
  return (
    <div className={styles.section}>
      {aboutParagraphs.map((paragraph, i) => (
        <p key={i} className={styles.paragraph}>
          <RichText text={paragraph} />
        </p>
      ))}
    </div>
  );
}
