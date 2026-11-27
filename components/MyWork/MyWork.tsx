import Link from 'next/link';
import styles from './MyWork.module.css';
import { getFeaturedProjects } from '../../content/content';
import { asset } from '../../lib/paths';

function DiscCase({
  discImage,
  alt,
  size,
  floatDelay,
}: {
  discImage: string;
  alt: string;
  size: number;
  floatDelay?: string;
}) {
  return (
    <div
      className={styles.discCase}
      style={{ width: size, height: size, animationDelay: floatDelay }}
    >
      <img
        src={asset('/images/objects/case.webp')}
        alt=""
        width={480}
        height={480}
        loading="lazy"
        decoding="async"
        className={styles.caseImg}
      />
      <img
        src={asset(discImage)}
        alt={alt}
        width={480}
        height={480}
        loading="lazy"
        decoding="async"
        className={styles.discImg}
      />
    </div>
  );
}

export default function MyWork() {
  const featured = getFeaturedProjects();
  const nestwell = featured[0];
  const rest = featured.slice(1);

  return (
    <section id="work" className={styles.work} aria-label="My work">
      <div className="page-container">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>01 / THE WORK</p>
          <h2 className={styles.title}>My work.</h2>
        </div>
        <p className={styles.desc}>
          My top five. Tap a case for a 30-second walkthrough, in my own voice.
        </p>
      </div>

      <div className={styles.bodyDesktop}>
        <div className={styles.tvWrap}>
          <div className={styles.tvBezelArea}>
            <div className={styles.tvScreen}>
              <img
                src={asset('/images/nestwell-dashboard.jpg')}
                alt=""
                width={800}
                height={500}
                loading="lazy"
                decoding="async"
                className={styles.tvScreenImg}
              />
              <span className={styles.tvCaption}>&#9654; NOW SHOWING: NESTWELL</span>
            </div>
          </div>
          <img
            src={asset('/images/objects/tv.webp')}
            alt=""
            width={680}
            height={486}
            loading="lazy"
            decoding="async"
            className={styles.tvFrame}
          />
        </div>

        <ul className={styles.discRow}>
          <li className={styles.discItem}>
            <Link href={`/work/${nestwell.slug}`} className={styles.discLink}>
              <span className={styles.discStage}>
                <DiscCase discImage={nestwell.discImage!} alt="" size={170} />
              </span>
              <span className={styles.nowPlaying}>● NOW PLAYING</span>
              <span className={styles.discOutcome}>{nestwell.outcome}</span>
            </Link>
          </li>
          {rest.map((project, i) => (
            <li className={styles.discItem} key={project.slug}>
              <Link href={`/work/${project.slug}`} className={styles.discLink}>
                <span className={styles.discStage}>
                  <DiscCase
                    discImage={project.discImage!}
                    alt=""
                    size={170}
                    floatDelay={`-${1.6 + i}s`}
                  />
                </span>
                <span className={styles.discLabel}>
                  {String(i + 2).padStart(2, '0')}{' '}
                  {(project.shortTitle ?? project.title).toUpperCase()}
                </span>
                <span className={styles.discOutcome}>{project.outcome}</span>
              </Link>
            </li>
          ))}
        </ul>

        <p className={styles.scrollMore}>
          Scroll for more work <span aria-hidden="true">↓</span>
        </p>
      </div>
      </div>

      <div className={styles.bodyMobile}>
        <ul className={styles.cardRail}>
          {featured.map((project, i) => (
            <li className={styles.card} key={project.slug}>
              <Link href={`/work/${project.slug}`} className={styles.cardButton}>
                <span className={styles.srOnly}>Open the case study for</span>
                <span className={styles.cardArt}>
                  <DiscCase discImage={project.discImage!} alt="" size={230} />
                </span>
                <span className={styles.cardMeta}>
                  <span className={styles.cardIndex}>
                    {String(i + 1).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}
                  </span>
                  <span className={styles.cardTitle}>{project.shortTitle ?? project.title}</span>
                  <span className={styles.cardOutcome}>{project.outcome}</span>
                </span>
                <span className={styles.playPill} aria-hidden="true">
                  ▶ 0:30
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.swipeHint}>
          <span>Swipe for the other four</span>
          <span className={styles.swipeCount}>1 / {featured.length}</span>
        </div>
        <p className={styles.scrollMoreMobile}>
          Scroll for more work <span aria-hidden="true">↓</span>
        </p>
      </div>
    </section>
  );
}
