import { profile, skyObjects } from "@/data/content";
import SkyGlyph from "@/components/scene/SkyGlyph";
import DetailContentView from "@/components/panel/DetailContentView";
import styles from "./MobileLayout.module.css";

export default function MobileLayout() {
  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <p className={styles.kicker}>Cielo austral · Los Ángeles, Chile · 37° S</p>
        <h1 className={styles.name}>{profile.name}</h1>
        <p className={styles.role}>{profile.role}</p>
      </header>

      {skyObjects.map((object) => (
        <section key={object.id} className={styles.card} aria-labelledby={`m-${object.id}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardArt}>
              <SkyGlyph kind={object.kind} colorVar={object.colorVar} size={52} animated={false} />
            </div>
            <div>
              <p className={styles.cardCatalog}>{object.catalog}</p>
              <h2 id={`m-${object.id}`} className={styles.cardTitle}>
                {object.section}
              </h2>
            </div>
          </div>
          <p className={styles.blurb}>{object.blurb}</p>

          {object.self && (
            <div className={styles.detail}>
              <DetailContentView detail={object.self} />
            </div>
          )}

          {object.children && (
            <div className={styles.children}>
              {object.children.map((child) => (
                <details key={child.id} className={styles.child}>
                  <summary className={styles.childSummary}>
                    <span className={styles.childLabel}>{child.label}</span>
                    {child.sublabel && <span className={styles.childSub}>{child.sublabel}</span>}
                  </summary>
                  <div className={styles.childBody}>
                    <DetailContentView detail={child.detail} />
                  </div>
                </details>
              ))}
            </div>
          )}
        </section>
      ))}

      <footer className={styles.footer}>{profile.footer}</footer>
    </main>
  );
}
