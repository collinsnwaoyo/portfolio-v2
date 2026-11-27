'use client';

import { useEffect, useRef, type ElementType, type ReactNode, type CSSProperties } from 'react';
import styles from './Reveal.module.css';

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  delayMs?: number;
  className?: string;
  [key: string]: unknown;
}

/**
 * Section text rising into view on scroll entry (motion tokens:
 * stagger.lines 0.08s, trigger at the top 85% of the viewport). Reduced
 * motion shows the final state immediately via CSS, no JS branch needed.
 */
export default function Reveal({ children, as: Tag = 'div', delayMs = 0, className, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          el.classList.add(styles.in);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -15% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style: CSSProperties = delayMs ? { transitionDelay: `${delayMs}ms` } : {};

  return (
    <Tag ref={ref} className={`${styles.reveal} ${className ?? ''}`} style={style} {...rest}>
      {children}
    </Tag>
  );
}
