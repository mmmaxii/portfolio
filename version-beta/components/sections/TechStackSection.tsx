import { techStack } from "@/data/content";
import styles from "./sections.module.css";

export default function TechStackSection() {
  return (
    <div className={styles.stackGrid}>
      {techStack.map((cat) => (
        <div key={cat.category} className={styles.stackCard}>
          <h4 className={styles.stackCategory}>{cat.category}</h4>
          <div className={styles.stackItems}>
            {cat.items.map((item) => (
              <span key={item} className={styles.stackItem}>
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
