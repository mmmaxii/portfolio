import { research } from "@/data/content";
import { researchIcons as icons } from "@/components/ui/Icons";
import RichText from "@/components/ui/RichText";
import Tabs from "@/components/ui/Tabs";
import GifViewer from "@/components/ui/GifViewer";
import { ExternalIcon } from "@/components/ui/Icons";
import styles from "./sections.module.css";

function ArchitectureTab() {
  return (
    <div className={styles.researchGrid}>
      {research.architectureCards.map((card) => {
        const Icon = icons[card.icon];
        return (
          <div key={card.title} className={styles.researchCard}>
            <div className={styles.cardIcon}>
              <Icon size={19} />
            </div>
            <h4 className={styles.cardTitle}>{card.title}</h4>
            <p className={styles.cardTech}>{card.tech}</p>
            <p className={styles.paragraph}>
              <RichText text={card.lead} />
            </p>
            <ul className={styles.cardList}>
              {card.bullets.map((bullet, i) => (
                <li key={i}>
                  <RichText text={bullet} />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function AchievementsTab() {
  return (
    <div className={styles.section}>
      {research.achievements.map((achievement) => {
        const Icon = icons[achievement.icon];
        return (
          <div key={achievement.title} className={styles.achievement}>
            <div className={styles.cardIcon}>
              <Icon size={19} />
            </div>
            <div className={styles.achievementBody}>
              <h4 className={styles.cardTitle}>{achievement.title}</h4>
              <p className={styles.paragraph}>
                <RichText text={achievement.text} />
              </p>
              {achievement.acknowledgements && (
                <div className={styles.acknowledgements}>
                  <span className={styles.acknowledgementsHeading}>
                    {achievement.acknowledgements.heading}
                  </span>
                  <p className={styles.paragraph}>
                    <em>{achievement.acknowledgements.quote}</em>
                  </p>
                  <a
                    href={achievement.acknowledgements.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalIcon size={13} /> {achievement.acknowledgements.linkLabel}
                  </a>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ResearchSection() {
  return (
    <div className={styles.section}>
      <h3 className={styles.subheading}>{research.title}</h3>
      <div className={styles.heroCard}>
        {research.intro.map((paragraph, i) => (
          <p key={i} className={styles.paragraph}>
            {paragraph}
          </p>
        ))}
      </div>
      <Tabs
        tabs={[
          { id: "architecture", label: "Arquitectura y Pipeline", content: <ArchitectureTab /> },
          { id: "gallery", label: "Galería Visual", content: <GifViewer /> },
          { id: "achievements", label: "Logros Técnicos", content: <AchievementsTab /> },
        ]}
      />
    </div>
  );
}
