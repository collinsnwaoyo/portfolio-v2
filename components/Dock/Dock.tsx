'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Dock.module.css';
import { site } from '../../content/content';

const MENU_LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#think', label: 'Think pieces' },
  { href: site.cvHref, label: 'CV' },
  { href: '#contact', label: 'Contact' },
];

export default function Dock() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const menu = menuRef.current;
    if (!menu) return;

    const focusable = menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    focusable[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
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
  }, [open]);

  return (
    <>
      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)} aria-hidden="true" />
      )}
      <nav className={styles.dock} aria-label="Site" data-reveal="dock">
        <span className={styles.identity}>
          <span className={styles.name}>{site.name}</span>
          <span className={styles.role}>{site.role.toUpperCase()}</span>
        </span>
        <button
          ref={toggleRef}
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="site-menu"
          className={styles.toggle}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '✕' : '☰'}
        </button>
      </nav>
      {open && (
        <div id="site-menu" ref={menuRef} role="dialog" aria-modal="true" aria-label="Site menu" className={styles.menu}>
          <ul className={styles.menuList}>
            {MENU_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={styles.menuLink} onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
