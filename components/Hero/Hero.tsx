import styles from './Hero.module.css';
import { site } from '../../content/content';
import { asset } from '../../lib/paths';

const SKILLS = [
  'Product strategy',
  'Design systems',
  'User research',
  'Claude Code',
  'Interaction design',
  'Illustration',
  'Prototyping',
  'Product operations',
  'UI design',
];

function Track() {
  // Doubled so a translateX(-50%) loop is seamless.
  const items = [...SKILLS, ...SKILLS];
  return (
    <div className={styles.track}>
      {items.map((skill, i) => (
        <span key={i}>
          {skill}
          <b aria-hidden="true">&#8226;</b>
        </span>
      ))}
    </div>
  );
}

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.marquee} aria-hidden="true">
        <Track />
      </div>

      {/*
        Phase-7 loader handover: the loader's last frame is this same
        square photo. At handover it should GSAP-Flip (or similar) from
        the loader's frame into this element's live rect while the blue
        curtain lifts. #hero-photo is the stable Flip target.
      */}
      <div className={styles.photo} id="hero-photo">
        <picture>
          <source
            srcSet={`${asset('/images/hero-face-400.avif')} 1x, ${asset('/images/hero-face-800.avif')} 2x`}
            type="image/avif"
          />
          <source
            srcSet={`${asset('/images/hero-face-400.webp')} 1x, ${asset('/images/hero-face-800.webp')} 2x`}
            type="image/webp"
          />
          <img
            src={asset('/images/hero-face-400.webp')}
            alt={site.name}
            width={400}
            height={400}
            fetchPriority="high"
          />
        </picture>
      </div>

      <div className={styles.topBand}>
        <div className={`page-container ${styles.top}`}>
          <div className={styles.topLeft}>
            <p className={styles.topLeftLine1}>{site.location}</p>
            <p className={styles.topLeftLine2}>{site.availability}</p>
          </div>
          <div className={styles.topCenter} data-testid="font-display">
            {site.name}
          </div>
          <div className={styles.topRight}>
            <span className={styles.availability}>
              <span className={styles.dot} aria-hidden="true" />
              Open to senior and founding roles
            </span>
            <a href="#contact" className={styles.cta}>
              Get in touch
            </a>
          </div>
        </div>
      </div>

      <div className={styles.below}>
        <h1 className={styles.kicker} data-testid="font-mono">
          A senior product designer who also ships
        </h1>
        <p className={styles.sub} data-testid="font-body">
          Nine years turning messy, rule-heavy products into simple ones. Fintech, proptech,
          compliance and AI tools. Now I build them too.
        </p>
        <span className={styles.scroll}>↓ Scroll for the work</span>
      </div>
    </section>
  );
}
