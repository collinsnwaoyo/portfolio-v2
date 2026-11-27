'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Loader.module.css';
import { asset } from '../../lib/paths';

const HOP = 'cubic-bezier(0.9, 0, 0.1, 1)';
const OUT = 'cubic-bezier(0.215, 0.61, 0.355, 1)';
const FRAMES = ['sDash', 'sBlack', 'sCase', 'sTv', 'sFace'] as const;
const SCALES = [0.6, 0.7, 0.8, 0.9, 1];
const FLIP_MS = 300;
const STORAGE_KEY = 'loader-played';

export default function Loader() {
  const [active, setActive] = useState(false);
  const winRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const slideRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const doneRef = useRef(false);

  useEffect(() => {
    if (document.documentElement.dataset.loader !== 'pending') return;
    setActive(true);
  }, []);

  useEffect(() => {
    if (!active) return;

    const winMaybe = winRef.current;
    const countMaybe = countRef.current;
    if (!winMaybe || !countMaybe) return;
    const win: HTMLDivElement = winMaybe;
    const count: HTMLSpanElement = countMaybe;

    const timers: number[] = [];
    const anims: Animation[] = [];
    let raf = 0;

    function after(ms: number, fn: () => void) {
      timers.push(window.setTimeout(fn, ms));
    }
    function anim(el: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
      const a = el.animate(keyframes, { fill: 'forwards', ...options });
      anims.push(a);
      return a;
    }
    function show(id: string) {
      FRAMES.forEach((f) => {
        const el = slideRefs.current[f];
        if (el) el.classList.toggle(styles.on, f === id);
      });
    }
    function counter(total: number) {
      const t0 = performance.now();
      const tick = () => {
        const p = Math.min(1, (performance.now() - t0) / total);
        if (count) count.textContent = String(Math.round(p * 100)).padStart(3, '0');
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      tick();
    }

    function finish() {
      if (doneRef.current) return;
      doneRef.current = true;
      timers.forEach(clearTimeout);
      anims.forEach((a) => a.cancel());
      cancelAnimationFrame(raf);
      document.documentElement.dataset.loader = 'done';
      try {
        localStorage.setItem(STORAGE_KEY, '1');
      } catch {
        /* ignore */
      }
      const heroPhoto = document.getElementById('hero-photo');
      if (heroPhoto) heroPhoto.style.opacity = '1';
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      setActive(false);
    }

    function heroIn(base: number) {
      const kicker = document.querySelector<HTMLElement>('[data-reveal="kicker"]');
      const sub = document.querySelector<HTMLElement>('[data-reveal="sub"]');
      const dock = document.querySelector<HTMLElement>('[data-reveal="dock"]');
      if (kicker) {
        anim(
          kicker,
          [
            { opacity: 0, transform: 'translateY(24px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          { duration: 700, delay: base, easing: OUT }
        );
      }
      if (sub) {
        anim(
          sub,
          [
            { opacity: 0, transform: 'translateY(16px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          { duration: 700, delay: base + 120, easing: OUT }
        );
      }
      if (dock) {
        // Transform-only (no opacity): moved fully off-screen below the
        // viewport up front, so it needs no fade to stay out of sight, and
        // never blends its high-contrast chrome with the page behind it
        // mid-transition the way an opacity fade would.
        dock.style.opacity = '1';
        dock.style.transform = 'translateY(160%)';
        anim(dock, [{ transform: 'translateY(160%)' }, { transform: 'translateY(0)' }], {
          duration: 800,
          delay: base + 260,
          easing: OUT,
        });
      }
    }

    function run() {
      counter(2000);
      win.style.transform = `scale(${SCALES[0]})`;
      const loaderEl = win.parentElement; // the fixed cobalt layer
      FRAMES.forEach((id, i) => {
        after(150 + i * FLIP_MS, () => {
          show(id);
          anim(win, [{ transform: `scale(${SCALES[i - 1] ?? 0.6})` }, { transform: `scale(${SCALES[i]})` }], {
            duration: 420,
            easing: OUT,
          });
        });
      });

      const end = 150 + FRAMES.length * FLIP_MS + 250;

      after(end, () => {
        if (loaderEl) {
          anim(loaderEl, [{ clipPath: 'inset(0 0 0% 0)' }, { clipPath: 'inset(0 0 100% 0)' }], {
            duration: 1100,
            easing: HOP,
          });
        }

        const heroPhoto = document.getElementById('hero-photo');
        if (heroPhoto) {
          const winRect = win.getBoundingClientRect();
          const targetRect = heroPhoto.getBoundingClientRect();
          const scaleX = targetRect.width / winRect.width;
          const scaleY = targetRect.height / winRect.height;
          const dx = targetRect.left + targetRect.width / 2 - (winRect.left + winRect.width / 2);
          const dy = targetRect.top + targetRect.height / 2 - (winRect.top + winRect.height / 2);
          anim(
            win,
            [
              { transform: 'translate(0, 0) scale(1)', opacity: 1 },
              { transform: `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`, opacity: 0 },
            ],
            { duration: 900, easing: HOP }
          );
          after(500, () => {
            heroPhoto.style.transition = 'opacity 400ms ease';
            heroPhoto.style.opacity = '1';
          });
        }

        heroIn(560);
      });

      after(end + 1250, finish);
    }

    run();

    return () => {
      timers.forEach(clearTimeout);
      anims.forEach((a) => a.cancel());
      cancelAnimationFrame(raf);
    };
  }, [active]);

  function handleSkip() {
    document.documentElement.dataset.loader = 'done';
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    const heroPhoto = document.getElementById('hero-photo');
    if (heroPhoto) heroPhoto.style.opacity = '1';
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    setActive(false);
  }

  if (!active) return null;

  return (
    <div className={styles.loader} role="dialog" aria-label="Loading">
      <div ref={winRef} className={styles.win} aria-hidden="true">
        <div
          ref={(el) => {
            slideRefs.current.sDash = el;
          }}
          className={`${styles.slide} ${styles.sDash}`}
        >
          <img src={asset('/images/nestwell-dashboard.jpg')} alt="" />
        </div>
        <div
          ref={(el) => {
            slideRefs.current.sBlack = el;
          }}
          className={`${styles.slide} ${styles.sBlack}`}
        />
        <div
          ref={(el) => {
            slideRefs.current.sCase = el;
          }}
          className={`${styles.slide} ${styles.sCase}`}
        >
          <div className={styles.cd}>
            <img src={asset('/images/objects/case.webp')} alt="" />
            <img className={styles.disc} src={asset('/images/discs/nestwell.webp')} alt="" />
          </div>
        </div>
        <div
          ref={(el) => {
            slideRefs.current.sTv = el;
          }}
          className={`${styles.slide} ${styles.sTv}`}
        >
          <img src={asset('/images/objects/tv.webp')} alt="" />
        </div>
        <div
          ref={(el) => {
            slideRefs.current.sFace = el;
          }}
          className={`${styles.slide} ${styles.sFace}`}
        >
          <img src={asset('/images/hero-face-400.webp')} alt="" />
        </div>
      </div>
      <div className={styles.meta} aria-hidden="true">
        <span>COLLINS NWAOYO</span>
        <span ref={countRef}>000</span>
      </div>
      <button type="button" className={styles.skip} onClick={handleSkip}>
        Skip intro
      </button>
    </div>
  );
}
