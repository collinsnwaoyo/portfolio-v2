'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, type RefObject } from 'react';
import styles from './NestwellClip.module.css';
import { asset } from '../../lib/paths';
import {
  SCENES,
  CAPS,
  BED_DAYS,
  CAM_LANDSCAPE,
  CAM_PORTRAIT,
  PORTRAIT_SCENE_FOCUS,
  DURATION,
  type CamKeyframe,
  type Caption,
} from './nestwellClipData';

export interface ClipHandle {
  seek: (t: number) => void;
  restart: () => void;
  duration: number;
}

export interface NestwellClipProps {
  variant: 'landscape' | 'portrait';
  playing: boolean;
  muted: boolean;
  /** Caption text is written into this externally-owned element, so the
   * caller can place it in its own letterbox band below the picture rather
   * than overlaid on it. */
  captionsRef: RefObject<HTMLDivElement | null>;
  onTimeUpdate?: (t: number) => void;
  onEnded?: () => void;
  className?: string;
}

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function offsetWithin(el: HTMLElement | null, root: HTMLElement | null) {
  let x = 0;
  let y = 0;
  let node = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

const NestwellClip = forwardRef<ClipHandle, NestwellClipProps>(function NestwellClip(
  { variant, playing, muted, captionsRef, onTimeUpdate, onEnded, className },
  ref
) {
  const screenRef = useRef<HTMLDivElement>(null);
  const scalerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const camRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rowHRef = useRef<HTMLDivElement>(null);
  const btnRemRef = useRef<HTMLSpanElement>(null);
  const attRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const bedsRef = useRef<HTMLDivElement>(null);
  const sceneElsRef = useRef<Record<string, HTMLElement | null>>({});

  const tRef = useRef(0);
  const playingRef = useRef(playing);
  const mutedRef = useRef(muted);
  const lastRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const audioLoadedRef = useRef(false);
  const capSceneRef = useRef<Caption | null>(null);
  const capWordIdxRef = useRef(-2);
  const capHiddenRef = useRef(false);
  const camPointsRef = useRef<CamKeyframe[]>(
    (variant === 'portrait' ? CAM_PORTRAIT : CAM_LANDSCAPE).map((k) => ({ ...k }))
  );
  const bpRef = useRef({ x: 1190, y: 190 });
  const endedFiredRef = useRef(false);
  const onTimeUpdateRef = useRef(onTimeUpdate);
  const onEndedRef = useRef(onEnded);
  onTimeUpdateRef.current = onTimeUpdate;
  onEndedRef.current = onEnded;

  function measure() {
    const btn = btnRemRef.current;
    const cam = camRef.current;
    const rowH = rowHRef.current;
    const att = attRef.current;
    if (!btn || !cam || !rowH || !att) return;
    const o = offsetWithin(btn, cam);
    bpRef.current = { x: o.x + btn.offsetWidth / 2, y: o.y + btn.offsetHeight / 2 };
    const r = offsetWithin(rowH, cam);
    const a = offsetWithin(att, cam);
    const ax = a.x + att.offsetWidth / 2;
    const ay = a.y + att.offsetHeight / 2;
    const rx = r.x + rowH.offsetWidth / 2;
    const ry = r.y + rowH.offsetHeight / 2;
    const cam4 = camPointsRef.current;
    cam4[2].cx = cam4[3].cx = ax + 60;
    cam4[2].cy = cam4[3].cy = ay - 20;
    cam4[4].cx = cam4[5].cx = rx;
    cam4[4].cy = cam4[5].cy = ry + 30;
  }

  function camAt(t: number) {
    const cam = camPointsRef.current;
    const reduce =
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (t <= cam[0].t) return cam[0];
    for (let i = 0; i < cam.length - 1; i++) {
      const p = cam[i];
      const q = cam[i + 1];
      if (t <= q.t) {
        let k = (t - p.t) / (q.t - p.t);
        k = reduce ? (k < 1 ? 0 : 1) : ease(k);
        return { t, cx: p.cx + (q.cx - p.cx) * k, cy: p.cy + (q.cy - p.cy) * k, s: p.s + (q.s - p.s) * k };
      }
    }
    return cam[cam.length - 1];
  }

  // Covers the box completely (like object-fit: cover), centred, whatever
  // its exact aspect ratio turns out to be — the TV's screen cutout and the
  // dialog/mobile boxes are close to 16:9 / 4:5 but not pixel-exact.
  function fit() {
    const screen = screenRef.current;
    const scaler = scalerRef.current;
    if (!screen || !scaler) return;
    const cw = screen.clientWidth;
    const ch = screen.clientHeight;
    if (!cw || !ch) return;
    const scale = Math.max(cw / 1280, ch / 720);
    const offsetX = (cw - 1280 * scale) / 2;
    const offsetY = (ch - 720 * scale) / 2;
    scaler.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
  }

  function render(t: number) {
    SCENES.forEach((s) => {
      const el = sceneElsRef.current[s.id];
      if (!el) return;
      const fi = Math.min(1, Math.max(0, (t - (s.a - 0.15)) / 0.35));
      const fo = Math.min(1, Math.max(0, s.b + 0.2 - t) / 0.35);
      el.style.opacity = t >= s.a - 0.15 && t <= s.b + 0.2 ? String(Math.min(fi, fo)) : '0';
      if (variant === 'portrait') {
        const focus = PORTRAIT_SCENE_FOCUS[s.id];
        if (focus) {
          const tx = 640 - focus.x * focus.scale;
          const ty = 360 - focus.y * focus.scale;
          el.style.transform = `translate(${tx}px, ${ty}px) scale(${focus.scale})`;
        }
      } else {
        el.style.transform = 'none';
      }
    });

    const screen = screenRef.current;
    if (screen) {
      const fxEls = screen.querySelectorAll<HTMLElement>('[data-at]');
      fxEls.forEach((e) => {
        const at = parseFloat(e.dataset.at || '0');
        const out = e.dataset.out ? parseFloat(e.dataset.out) : undefined;
        e.classList.toggle(styles.in, t >= at && !(out !== undefined && t >= out));
      });
      const st = t < 18.95 ? 1 : t < 19.2 ? 2 : 3;
      screen.querySelectorAll<HTMLElement>('[data-status-pill]').forEach((e) => {
        e.classList.toggle(styles.on, e.dataset.statusPill === String(st));
      });
    }

    const cam = camRef.current;
    if (cam) {
      const c = camAt(t);
      cam.style.transform = `translate(${640 - c.cx * c.s}px, ${360 - c.cy * c.s}px) scale(${c.s})`;
    }

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    const rowH = rowHRef.current;
    const btn = btnRemRef.current;
    const bp = bpRef.current;
    if (cursor) {
      const showCur = t >= 16.9 && t < 18.3;
      cursor.classList.toggle(styles.in, showCur);
      cursor.style.transform =
        t >= 17.05 ? `translate(${bp.x - 4}px, ${bp.y - 2}px)` : `translate(${bp.x - 170}px, ${bp.y + 120}px)`;
    }
    if (ring) ring.classList.toggle(styles.in, t >= 17.45 && t < 18.3);
    if (rowH) rowH.classList.toggle(styles.hl, t >= 16.95 && t < 18.4);
    if (btn) {
      const go = t >= 17.48;
      btn.classList.toggle(styles.go, go);
      btn.textContent = go ? 'Send reminder' : 'Remind';
    }

    const caps = captionsRef.current;
    if (caps) {
      const s = CAPS.find((x) => t >= x.a && t < x.b) || CAPS[CAPS.length - 1];
      let cur = -1;
      s.words.forEach((o, i) => {
        if (t >= o.t) cur = i;
      });
      const phraseChanged = s !== capSceneRef.current;
      const hideNow = t >= DURATION - 2.2;
      if (phraseChanged || cur !== capWordIdxRef.current || hideNow !== capHiddenRef.current) {
        if (phraseChanged && !hideNow) {
          // a short fade between phrases: drop to 0, force the browser to
          // commit that before swapping the text and fading back in
          caps.style.opacity = '0';
          void caps.offsetHeight;
        }
        capSceneRef.current = s;
        capWordIdxRef.current = cur;
        capHiddenRef.current = hideNow;
        caps.innerHTML = '';
        if (!hideNow) {
          for (let i = 0; i <= cur; i++) {
            const sp = document.createElement('span');
            sp.className = i === cur ? 'word word-now' : 'word';
            sp.textContent = s.words[i].w;
            caps.appendChild(sp);
            if (i < cur) caps.appendChild(document.createTextNode(' '));
          }
        }
        caps.style.opacity = hideNow ? '0' : '1';
      }
    }

    onTimeUpdateRef.current?.(t);
  }

  function voActive() {
    const vo = audioRef.current;
    return !mutedRef.current && !!vo && !!vo.duration && tRef.current < vo.duration - 0.02;
  }

  function startAudio() {
    const vo = audioRef.current;
    if (!vo || mutedRef.current) return;
    if (!audioLoadedRef.current) {
      vo.src = asset('/clips/nestwell/nestwell-vo.mp3');
      vo.load();
      audioLoadedRef.current = true;
    }
    try {
      if (vo.duration && tRef.current >= vo.duration) return;
      vo.currentTime = tRef.current;
      const p = vo.play();
      if (p && p.catch) p.catch(() => {});
    } catch {
      /* ignore */
    }
  }

  function tick(now: number) {
    if (!playingRef.current) return;
    const vo = audioRef.current;
    if (voActive() && vo && !vo.paused) {
      tRef.current = vo.currentTime;
    } else {
      tRef.current += (now - lastRef.current) / 1000;
    }
    lastRef.current = now;
    if (tRef.current >= DURATION) {
      tRef.current = DURATION;
      playingRef.current = false;
      try {
        vo?.pause();
      } catch {
        /* ignore */
      }
      render(tRef.current);
      if (!endedFiredRef.current) {
        endedFiredRef.current = true;
        onEndedRef.current?.();
      }
      return;
    }
    render(tRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }

  useImperativeHandle(
    ref,
    () => ({
      seek(t: number) {
        tRef.current = Math.max(0, Math.min(DURATION, t));
        endedFiredRef.current = false;
        const vo = audioRef.current;
        if (vo && audioLoadedRef.current) {
          try {
            vo.currentTime = Math.min(tRef.current, vo.duration || tRef.current);
          } catch {
            /* ignore */
          }
        }
        render(tRef.current);
      },
      restart() {
        tRef.current = 0;
        endedFiredRef.current = false;
        render(0);
      },
      duration: DURATION,
    }),
    []
  );

  useEffect(() => {
    measure();
    fit();
    render(tRef.current);
    const onResize = () => fit();
    window.addEventListener('resize', onResize);
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (cancelled) return;
      measure();
      fit();
      render(tRef.current);
    });
    return () => {
      cancelled = true;
      window.removeEventListener('resize', onResize);
    };
  }, [variant]);

  useEffect(() => {
    mutedRef.current = muted;
    const vo = audioRef.current;
    if (!vo) return;
    if (muted) {
      try {
        vo.pause();
      } catch {
        /* ignore */
      }
    } else if (playingRef.current) {
      startAudio();
    }
  }, [muted]);

  useEffect(() => {
    playingRef.current = playing;
    if (playing) {
      if (tRef.current >= DURATION) {
        tRef.current = 0;
        endedFiredRef.current = false;
      }
      lastRef.current = performance.now();
      startAudio();
      rafRef.current = requestAnimationFrame(tick);
    } else {
      try {
        audioRef.current?.pause();
      } catch {
        /* ignore */
      }
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    }
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [playing]);

  const setScene = (id: string) => (el: HTMLElement | null) => {
    sceneElsRef.current[id] = el;
  };

  return (
    <div ref={screenRef} className={`${styles.screen} ${className ?? ''}`}>
      <div ref={scalerRef} style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0' }}>
        <div ref={stageRef} className={styles.stage}>
          <section ref={setScene('s-title')} className={`${styles.scene} ${styles.sTitle}`} aria-hidden="true">
            <div className={`${styles.disc} ${styles.fx} ${styles.pop}`} data-at="0.10" />
            <h1 className={`${styles.disp} ${styles.fx}`} data-at="0.30">
              Nestwell
            </h1>
            <p className={`${styles.mono} ${styles.fx}`} data-at="0.60">
              01 / RENT MANAGER FOR LAGOS CO-LIVING
            </p>
          </section>

          <section ref={setScene('s-beds')} className={`${styles.scene} ${styles.sBeds}`} aria-hidden="true">
            <div className={styles.stats}>
              <div className={`${styles.stat} ${styles.fx}`} data-at="2.30">
                <div className={`${styles.n} ${styles.disp}`}>4</div>
                <div className={`${styles.l} ${styles.mono}`}>PROPERTIES</div>
              </div>
              <div className={`${styles.stat} ${styles.fx}`} data-at="3.10">
                <div className={`${styles.n} ${styles.disp}`}>11</div>
                <div className={`${styles.l} ${styles.mono}`}>BEDS</div>
              </div>
              <div className={`${styles.stat} ${styles.fx}`} data-at="4.70">
                <div className={`${styles.n} ${styles.disp}`} style={{ color: 'var(--accent)' }}>
                  11
                </div>
                <div className={`${styles.l} ${styles.mono}`}>DIFFERENT DUE DAYS</div>
              </div>
            </div>
            <div className={styles.beds} ref={bedsRef}>
              {BED_DAYS.map((d, i) => (
                <div key={d} className={`${styles.bed} ${styles.fx} ${styles.pop}`} data-at={(3.5 + i * 0.1).toFixed(2)}>
                  <span className={styles.ic} />
                  <span className={`${styles.d} ${styles.mono}`}>
                    DUE
                    <b>{d}</b>
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section ref={setScene('s-mess')} className={`${styles.scene} ${styles.sMess}`} aria-hidden="true">
            <div className={`${styles.sheet} ${styles.fx} ${styles.left}`} data-at="6.30">
              <div className={`${styles.row} ${styles.h}`}>
                <div>Tenant</div>
                <div>Room</div>
                <div>Due</div>
                <div>Status</div>
                <div>Notes</div>
              </div>
              <div className={styles.row}>
                <div>Tolulope A.</div>
                <div>Lekki</div>
                <div>2nd</div>
                <div>Paid</div>
                <div>transfer</div>
              </div>
              <div className={styles.row}>
                <div>Babatunde L.</div>
                <div>Yaba</div>
                <div>21st</div>
                <div className={styles.cellBad} data-at="9.25">
                  ??
                </div>
                <div>said Friday</div>
              </div>
              <div className={styles.row}>
                <div>Halima B.</div>
                <div>Surulere</div>
                <div>9th</div>
                <div className={styles.cellBad} data-at="9.45">
                  late?
                </div>
                <div>chase</div>
              </div>
              <div className={styles.row}>
                <div>Emeka O.</div>
                <div>Surulere</div>
                <div>18th</div>
                <div className={styles.cellBad} data-at="9.65">
                  34 days
                </div>
                <div>notice??</div>
              </div>
              <div className={styles.row}>
                <div>Damilola O.</div>
                <div>Surulere</div>
                <div>24th</div>
                <div>-</div>
                <div />
              </div>
              <div className={styles.row}>
                <div>Bed 3</div>
                <div>Surulere</div>
                <div>-</div>
                <div>vacant</div>
                <div>list it</div>
              </div>
            </div>
            <div className={styles.chat}>
              <div className={`${styles.bub} ${styles.them} ${styles.fx}`} data-at="7.10">
                Good morning. Which account again?
                <small>8:02</small>
              </div>
              <div className={`${styles.bub} ${styles.me} ${styles.fx}`} data-at="7.45">
                Same as last month. Rent was due on the 9th.
                <small>8:05</small>
              </div>
              <div className={`${styles.bub} ${styles.them} ${styles.fx}`} data-at="7.80">
                Will send Friday, abeg
                <small>8:31</small>
              </div>
              <div className={`${styles.bub} ${styles.them} ${styles.fx}`} data-at="8.15">
                I paid last week o
                <small>9:14</small>
              </div>
            </div>
            <div
              className={`${styles.rcpt} ${styles.fx}`}
              data-at="8.30"
              style={{ left: 560, top: 395, transform: 'rotate(4deg)' }}
            >
              <div className={styles.rh}>Transfer successful</div>
              <div className={styles.ra}>&#8358;425,000</div>
              <div className={styles.rl}>To: NESTWELL RENTS</div>
              <div className={styles.rl}>Ref: 0942 1187 33</div>
            </div>
            <div
              className={`${styles.rcpt} ${styles.fx}`}
              data-at="8.60"
              style={{ left: 700, top: 420, transform: 'rotate(-5deg)' }}
            >
              <div className={styles.rh}>Transfer successful</div>
              <div className={styles.ra}>&#8358;180,000</div>
              <div className={styles.rl}>Narration: rent part 1</div>
              <div className={styles.rl}>Ref: 7710 0034 92</div>
            </div>
            <div className={`${styles.leak} ${styles.disp} ${styles.fx}`} data-at="10.75">
              money leaks here.
            </div>
          </section>

          <section ref={setScene('s-dash')} className={`${styles.scene} ${styles.sDash}`} aria-hidden="true">
            <div className={styles.cam} ref={camRef}>
              <div className={styles.app}>
                <aside className={styles.side}>
                  <div className={styles.brand}>
                    <i />
                    Nestwell
                  </div>
                  <div className={`${styles.nav} ${styles.on}`}>Home</div>
                  <div className={styles.nav}>Properties</div>
                  <div className={styles.nav}>Messages</div>
                  <div className={styles.sub}>In the full version</div>
                  <div className={styles.nav}>Tenants</div>
                  <div className={styles.nav}>Payment history</div>
                  <div className={styles.nav}>Reports</div>
                  <div className={styles.nav}>Settings</div>
                </aside>
                <div className={styles.main}>
                  <div>
                    <h2 className={styles.hello}>
                      Good morning, <b>Collins</b>
                    </h2>
                    <div className={`${styles.card} ${styles.rev}`}>
                      <div className={styles.t}>Revenue, last 30 days</div>
                      <div className={styles.v}>&#8358;2,125,000</div>
                      <svg width="560" height="150" viewBox="0 0 560 150" aria-hidden="true">
                        <path
                          d="M0 140 L20 130 L120 130 L140 122 L170 122 L190 112 L230 112 L250 80 L290 80 L310 66 L420 66 L440 46 L560 46"
                          fill="none"
                          stroke="#2F8A52"
                          strokeWidth="2.5"
                        />
                        <path
                          d="M0 140 L20 130 L120 130 L140 122 L170 122 L190 112 L230 112 L250 80 L290 80 L310 66 L420 66 L440 46 L560 46 L560 150 L0 150Z"
                          fill="#2F8A52"
                          opacity=".08"
                        />
                      </svg>
                    </div>
                    <div className={`${styles.card} ${styles.kpis}`}>
                      <div className={styles.kpi}>
                        <div className={styles.t}>Payments due</div>
                        <div className={styles.v} style={{ color: '#8A5A00' }}>
                          3
                        </div>
                        <div className={styles.s} style={{ color: '#B8402F' }}>
                          1 overdue
                        </div>
                      </div>
                      <div className={styles.kpi}>
                        <div className={styles.t}>Vacant beds</div>
                        <div className={styles.v}>2</div>
                        <div className={styles.s}>9 of 11 filled</div>
                      </div>
                      <div className={styles.kpi}>
                        <div className={styles.t}>Rent roll</div>
                        <div className={styles.v}>&#8358;3,005,000</div>
                        <div className={styles.s}>4 properties</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className={styles.att} ref={attRef}>
                      <h3 style={{ marginTop: 4 }}>Needs attention</h3>
                      <div className={styles.card}>
                        <div className={styles.trow}>
                          <div className={styles.av}>EO</div>
                          <div>
                            <div className={styles.nm}>Emeka Obi</div>
                            <div className={styles.mt}>Surulere 3-bed, 34 days late</div>
                          </div>
                          <span className={`${styles.pill} ${styles.pRed}`}>Notice issued</span>
                        </div>
                        <div className={styles.trow} ref={rowHRef}>
                          <div className={styles.av}>HB</div>
                          <div>
                            <div className={styles.nm}>Halima Bello</div>
                            <div className={styles.mt}>Surulere 3-bed, 12 days late</div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                            <span className={`${styles.pill} ${styles.pRed}`}>Overdue</span>
                            <span className={styles.btnrem} ref={btnRemRef}>
                              Remind
                            </span>
                          </div>
                        </div>
                        <div className={styles.trow}>
                          <div className={styles.av}>BL</div>
                          <div>
                            <div className={styles.nm}>Babatunde Lawal</div>
                            <div className={styles.mt}>Yaba studio (Akoka side)</div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                            <span className={`${styles.pill} ${styles.pAmber}`}>Due today</span>
                            <span className={styles.btnrem}>Remind</span>
                          </div>
                        </div>
                        <div className={styles.trow}>
                          <div className={styles.av}>DO</div>
                          <div>
                            <div className={styles.nm}>Damilola Ogunleye</div>
                            <div className={styles.mt}>Surulere 3-bed, due 24 Nov</div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                            <span className={`${styles.pill} ${styles.pAmber}`}>Due soon</span>
                            <span className={styles.btnrem}>Remind</span>
                          </div>
                        </div>
                        <div className={styles.trow}>
                          <div className={styles.av}>&#9638;</div>
                          <div>
                            <div className={styles.nm}>Surulere 3-bedroom</div>
                            <div className={styles.mt}>Triple room, Bed 3</div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                            <span className={`${styles.pill} ${styles.pGrey}`}>Vacant</span>
                            <span className={styles.btnrem}>Add tenant</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.qa}>
                      <h3 style={{ marginTop: 28 }}>Quick actions</h3>
                      <div className={styles.item}>
                        <i />
                        Send message
                      </div>
                      <div className={styles.item}>
                        <i />
                        Record payment
                      </div>
                      <div className={styles.item}>
                        <i />
                        View overdue
                      </div>
                      <div className={styles.item}>
                        <i />
                        Add a tenant
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${styles.callout} ${styles.mono} ${styles.fx}`} data-at="15.15" data-out="16.95" style={{ left: 1240, top: 80 }}>
                who owes what
              </div>
              <div className={`${styles.callout} ${styles.mono} ${styles.fx}`} data-at="16.00" data-out="16.95" style={{ left: 1240, top: 150 }}>
                what to do today
              </div>
              <div className={styles.cursor} ref={cursorRef}>
                <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 2 L4 20 L9 15 L12.5 22 L15.5 20.5 L12 14 L19 14 Z" fill="#0A0A0A" stroke="#fff" strokeWidth="1.5" />
                </svg>
                <div className={styles.ring} ref={ringRef} />
              </div>
            </div>
            <div className={`${styles.toast} ${styles.fx}`} data-at="17.85">
              <i />
              Reminder ready to send on WhatsApp
            </div>
          </section>

          <section ref={setScene('s-rules')} className={`${styles.scene} ${styles.sRules}`} aria-hidden="true">
            <p className={`${styles.mono} ${styles.fx}`} data-at="18.35" style={{ margin: 0, fontSize: 15, color: 'var(--muted)', letterSpacing: '.08em' }}>
              WHAT THE SYSTEM HANDLES
            </p>
            <div className={`${styles.rule} ${styles.fx}`} data-at="18.45">
              <div className={`${styles.rn} ${styles.disp}`}>01</div>
              <div className={styles.rt}>Statuses update themselves</div>
              <div className={styles.rv}>
                <span className={`${styles.pill} ${styles.pAmber} ${styles.st}`} data-status-pill="1">
                  Due soon
                </span>
                <span className={`${styles.pill} ${styles.pAmber} ${styles.st}`} data-status-pill="2">
                  Due today
                </span>
                <span className={`${styles.pill} ${styles.pRed} ${styles.st}`} data-status-pill="3">
                  Overdue
                </span>
              </div>
            </div>
            <div className={`${styles.rule} ${styles.fx}`} data-at="20.00">
              <div className={`${styles.rn} ${styles.disp}`}>02</div>
              <div className={styles.rt}>Late fees apply on schedule</div>
              <div className={styles.rv}>
                <span className={styles.mono} style={{ fontSize: 16, color: 'var(--muted)' }}>
                  3-day grace, then
                </span>
                <span className={`${styles.pill} ${styles.pRed} ${styles.fx}`} data-at="20.65">
                  + late fee
                </span>
              </div>
            </div>
            <div className={`${styles.rule} ${styles.fx}`} data-at="21.20">
              <div className={`${styles.rn} ${styles.disp}`}>03</div>
              <div className={styles.rt}>Notices flagged, I make the call</div>
              <div className={styles.rv}>
                <span className={`${styles.pill} ${styles.pRed}`}>Notice flagged</span>
                <span className={`${styles.youdecide} ${styles.fx}`} data-at="22.75">
                  You decide
                </span>
              </div>
            </div>
          </section>

          <section ref={setScene('s-end')} className={`${styles.scene} ${styles.sEnd}`} aria-hidden="true">
            <div className={styles.top}>
              <h2 className={`${styles.disp} ${styles.fx}`} data-at="23.60">
                Designed it. Built it. Shipped it.
              </h2>
              <span className={`${styles.live} ${styles.fx}`} data-at="25.05">
                <i />
                LIVE
              </span>
            </div>
            <div className={styles.chips}>
              <div className={`${styles.chip} ${styles.fx}`} data-at="25.75">
                <b>Solo</b>built with Claude Code
              </div>
              <div className={`${styles.chip} ${styles.fx}`} data-at="26.35">
                <b>100</b>accessibility score (Lighthouse)
              </div>
              <div className={`${styles.chip} ${styles.fx}`} data-at="26.95">
                <b>Stack</b>Next.js, Supabase, Vercel
              </div>
            </div>
          </section>
        </div>
      </div>

      <audio ref={audioRef} preload="none" />
    </div>
  );
});

export default NestwellClip;
