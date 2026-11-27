'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Player.module.css';
import NestwellClip, { type ClipHandle } from '../Clip/NestwellClip';
import { nestwellCaseStudy, nextCaseSlug } from '../../content/caseStudies';
import { getFeaturedProjects } from '../../content/content';
import { asset } from '../../lib/paths';

export type PlayerPlacement = 'tv' | 'dialog' | 'mobile';

export interface PlayerHandle {
  unmuteAndPlay: () => void;
}

interface PlayerProps {
  placement: PlayerPlacement;
  open?: boolean;
  onClose?: () => void;
  startWithSound?: boolean;
}

function useIsNarrowViewport() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    setNarrow(mq.matches);
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return narrow;
}

const Player = forwardRef<PlayerHandle, PlayerProps>(function Player(
  { placement, open = true, onClose, startWithSound = false },
  ref
) {
  const router = useRouter();
  const clipRef = useRef<ClipHandle>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const captionsRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(!startWithSound);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const isNarrow = useIsNarrowViewport();

  const variant: 'landscape' | 'portrait' =
    placement === 'mobile' ? 'portrait' : placement === 'tv' ? 'landscape' : isNarrow ? 'portrait' : 'landscape';

  // The mobile placement is the phone-only full-screen player: on a desktop
  // viewport the TV placement handles ?play=nestwell instead.
  const effectiveOpen = placement === 'mobile' ? open && isNarrow : open;

  useImperativeHandle(
    ref,
    () => ({
      unmuteAndPlay() {
        if (ended) {
          clipRef.current?.restart();
          setEnded(false);
        }
        setMuted(false);
        setPlaying(true);
      },
    }),
    [ended]
  );

  // TV: autoplay muted once the section scrolls into view (skip for reduced motion).
  useEffect(() => {
    if (placement !== 'tv') return;
    if (typeof window === 'undefined') return;
    if (startWithSound) {
      setPlaying(true);
      return;
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setPlaying(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [placement, startWithSound]);

  // Dialog / mobile: start playing with sound the moment it opens (an explicit user gesture).
  useEffect(() => {
    if (placement === 'tv') return;
    if (effectiveOpen) {
      clipRef.current?.restart();
      setEnded(false);
      setMuted(false);
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  }, [effectiveOpen, placement]);

  // Focus trap + Escape for dialog / mobile.
  useEffect(() => {
    if (placement === 'tv' || !effectiveOpen) return;
    const root = rootRef.current;
    if (!root) return;
    const focusable = root.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    focusable[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose?.();
        return;
      }
      if (event.key !== 'Tab' || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [placement, effectiveOpen, onClose]);

  function handleEnded() {
    setEnded(true);
    setPlaying(false);
  }

  function handleToggleMute() {
    setMuted((m) => {
      const next = !m;
      if (!next) setPlaying(true);
      return next;
    });
  }

  function openCaseStudy() {
    if (placement === 'dialog') {
      onClose?.();
      return;
    }
    router.push('/work/nestwell/');
  }

  function replay() {
    clipRef.current?.restart();
    setEnded(false);
    setPlaying(true);
  }

  function goNext() {
    const next = nextCaseSlug('nestwell');
    router.push(`/work/${next}/`);
  }

  function pickDisc(slug: string) {
    if (slug === 'nestwell') {
      replay();
      return;
    }
    router.push(`/work/${slug}/`);
  }

  const endStats = nestwellCaseStudy.outcome.stats;

  const captionBand = (
    <div className={styles.captionBand}>
      <div ref={captionsRef} className={styles.captionText} aria-live="off" />
    </div>
  );

  const clipChrome = (
    <>
      <div className={styles.clipBox}>
        <NestwellClip
          ref={clipRef}
          variant={variant}
          playing={playing}
          muted={muted}
          captionsRef={captionsRef}
          onEnded={handleEnded}
        />
      </div>
      <button
        type="button"
        className={styles.muteBtn}
        onClick={handleToggleMute}
        aria-label={muted ? 'Turn sound on' : 'Mute'}
        aria-pressed={!muted}
      >
        {muted ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path d="M3 9v6h4l5 5V4L7 9H3Z" />
            <path d="M16 9l5 6M21 9l-5 6" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path d="M3 9v6h4l5 5V4L7 9H3Z" />
            <path d="M16 7a5 5 0 0 1 0 10M19 4a9 9 0 0 1 0 16" />
          </svg>
        )}
      </button>
      <div className={`${styles.endCard} ${ended ? styles.show : ''}`} inert={!ended}>
        <div className={styles.endStats}>
          {endStats.map((stat) => (
            <div key={stat.label} className={`${styles.endStat} ${stat.accent ? styles.accent : ''}`}>
              <p className={`${styles.endValue} ${stat.accent ? styles.accent : ''}`}>{stat.value}</p>
              <p className={styles.endLabel}>{stat.label}</p>
            </div>
          ))}
        </div>
        <div className={styles.endActions}>
          <button type="button" className={`${styles.endBtn} ${styles.endBtnPrimary}`} onClick={openCaseStudy}>
            Open the case study
          </button>
          <button type="button" className={styles.endBtn} onClick={replay}>
            Replay
          </button>
          <button type="button" className={styles.endBtn} onClick={goNext}>
            Next project
          </button>
        </div>
      </div>
    </>
  );

  if (placement === 'tv') {
    return (
      <div ref={rootRef} className={styles.tvWrap}>
        <div className={styles.tvBezelArea}>
          <div className={styles.tvScreenBox}>{clipChrome}</div>
          {captionBand}
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
    );
  }

  if (!effectiveOpen) return null;

  if (placement === 'dialog') {
    return (
      <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Nestwell clip">
        <div ref={rootRef} className={`${styles.dialogBox} ${isNarrow ? styles.dialogBoxPortrait : ''}`}>
          <div className={styles.dialogClip}>{clipChrome}</div>
          {captionBand}
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            &#10005;
          </button>
        </div>
      </div>
    );
  }

  // mobile: full-screen, with a disc strip to switch project
  const featured = getFeaturedProjects();
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Nestwell clip">
      <div ref={rootRef} className={styles.mobileBox}>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          &#10005;
        </button>
        <div className={styles.mobileScreenWrap}>
          <div className={styles.mobileScreen}>{clipChrome}</div>
          {captionBand}
        </div>
        <ul className={styles.discStrip}>
          {featured.map((project) => (
            <li key={project.slug}>
              <button
                type="button"
                className={`${styles.discStripItem} ${project.slug === 'nestwell' ? styles.active : ''}`}
                style={project.discImage ? { backgroundImage: `url(${asset(project.discImage)})` } : undefined}
                onClick={() => pickDisc(project.slug)}
                aria-label={project.shortTitle ?? project.title}
                aria-current={project.slug === 'nestwell' ? 'true' : undefined}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

export default Player;
