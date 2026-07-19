import { profile } from "@/data/content";
import { GithubIcon, MailIcon } from "@/components/ui/Icons";
import styles from "./sections.module.css";

export default function ContactSection() {
  return (
    <div className={styles.section}>
      <p className={styles.paragraph}>{profile.contactIntro}</p>
      <div className={styles.contactLinks}>
        <a href={`mailto:${profile.email}`} className={styles.contactLink}>
          <MailIcon size={17} />
          {profile.email}
        </a>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.contactLink}
        >
          <GithubIcon size={17} />
          github.com/{profile.githubUser}
        </a>
      </div>
    </div>
  );
}
