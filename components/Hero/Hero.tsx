import Image from 'next/image';
import styles from './Hero.module.css';
import { site } from '../../content/content';
import { asset } from '../../lib/paths';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <Image
        src={asset('/images/hero-portrait.webp')}
        alt={site.name}
        width={662}
        height={800}
        priority
        className={styles.portrait}
      />

      <div className={styles.topRow}>
        <div>
          <p className={styles.topRowLine1}>{site.location}</p>
          <p className={styles.topRowLine2}>{site.availability}</p>
        </div>
        <div className={styles.topRowRight}>
          <span className={styles.availability}>
            <span className={styles.dot} aria-hidden="true" />
            Open to senior and founding roles
          </span>
          <a href="#contact" className={styles.cta}>
            Get in touch
          </a>
        </div>
      </div>

      <div className={styles.avatarRow}>
        <div
          className={styles.avatar}
          role="img"
          aria-label={site.name}
          style={{ backgroundImage: `url(${asset('/images/hero-portrait.webp')})` }}
        />
        <p className={styles.avatarAvailability}>
          <span className={styles.dot} aria-hidden="true" />
          Open to senior and
          <br />
          founding roles
        </p>
      </div>

      <div className={styles.stackWrap}>
        <h1 className={styles.headline} data-testid="font-display">
          <span className={styles.headlineTop}>A senior product</span>
          <span className={styles.headlineBig}>Designer.</span>
          <span className={styles.headlineBottom}>
            who also <span className={styles.accent}>ships.</span>
          </span>
        </h1>
        <p className={styles.intro} data-testid="font-body">
          Nine years turning messy, rule-heavy products into simple ones. Fintech, proptech,
          compliance and AI tools. Now I build them too.
        </p>
      </div>

      <div className={styles.scrollHint}>↓ Scroll for the work</div>
    </section>
  );
}
