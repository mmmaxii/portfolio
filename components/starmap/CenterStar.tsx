import { profile } from "@/data/content";
import styles from "./CenterStar.module.css";

export default function CenterStar() {
  return (
    <div className={styles.container}>
      <div className={styles.burst} aria-hidden="true">
        <span className={styles.spikeV} />
        <span className={styles.spikeH} />
        <span className={styles.spikeD1} />
        <span className={styles.spikeD2} />
        <span className={styles.core} />
      </div>
      <h1 className={styles.name}>{profile.name}</h1>
      <p className={styles.role}>{profile.role}</p>
    </div>
  );
}
