'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './MyWork.module.css';
import { getFeaturedProjects } from '../../content/content';
import { asset } from '../../lib/paths';
import Player, { type PlayerHandle } from '../Player/Player';
import Reveal from '../Reveal/Reveal';

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
  const router = useRouter();
  const playerRef = useRef<PlayerHandle>(null);
  const [startWithSound, setStartWithSound] = useState(false);

  // Avoids useSearchParams(), which would force this whole section out of
  // the static export's prerendered HTML and into a client-only Suspense
  // fallback. Synced on mount and on the browser back/forward gesture; our
  // own open/close handlers below update it directly for instant feedback.
  useEffect(() => {
    function syncFromUrl() {
      setStartWithSound(new URLSearchParams(window.location.search).get('play') === 'nestwell');
    }
    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  function pickDesktopDisc(slug: string) {
    if (slug === nestwell.slug) {
      playerRef.current?.unmuteAndPlay();
      return;
    }
    router.push(`/work/${slug}/`);
  }

  function pickMobileDisc(slug: string) {
    if (slug === nestwell.slug) {
      router.push(`/?play=${slug}`, { scroll: false });
      setStartWithSound(true);
      return;
    }
    router.push(`/work/${slug}/`);
  }

  function closeMobilePlayer() {
    router.replace('/', { scroll: false });
    setStartWithSound(false);
  }

  return (
    <section id="work" className={styles.work} aria-label="My work">
      <div className="page-container">
      <div className={styles.header}>
        <div>
          <Reveal as="p" className={styles.eyebrow}>01 / THE WORK</Reveal>
          <Reveal as="h2" delayMs={80} className={styles.title}>My work.</Reveal>
        </div>
        <Reveal as="p" delayMs={160} className={styles.desc}>
          My top five. Tap a case for a 30-second walkthrough, in my own voice.
        </Reveal>
      </div>

      <div className={styles.bodyDesktop}>
        <Player ref={playerRef} placement="tv" startWithSound={startWithSound} />

        <ul className={styles.discRow}>
          <li className={styles.discItem}>
            <button type="button" onClick={() => pickDesktopDisc(nestwell.slug)} className={styles.discLink}>
              <span className={styles.discStage}>
                <DiscCase discImage={nestwell.discImage!} alt="" size={170} />
              </span>
              <span className={styles.nowPlaying}>● NOW PLAYING</span>
              <span className={styles.discOutcome}>{nestwell.outcome}</span>
            </button>
          </li>
          {rest.map((project, i) => (
            <li className={styles.discItem} key={project.slug}>
              <button type="button" onClick={() => pickDesktopDisc(project.slug)} className={styles.discLink}>
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
              </button>
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
              <button type="button" onClick={() => pickMobileDisc(project.slug)} className={styles.cardButton}>
                <span className={styles.srOnly}>
                  {project.slug === nestwell.slug ? 'Play the walkthrough for' : 'Open the case study for'}
                </span>
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
              </button>
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

      <Player placement="mobile" open={startWithSound} onClose={closeMobilePlayer} />
    </section>
  );
}
