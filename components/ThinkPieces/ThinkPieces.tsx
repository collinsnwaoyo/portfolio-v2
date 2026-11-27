import Link from 'next/link';
import styles from './ThinkPieces.module.css';
import { thinkPieces } from '../../content/content';
import Reveal from '../Reveal/Reveal';

export default function ThinkPieces() {
  return (
    <section id="think" className={styles.section} aria-label="Think pieces">
      <div className="page-container">
      <div className={styles.grid}>
        <div>
          <Reveal as="p" className={styles.eyebrow}>03 / THINK PIECES</Reveal>
          <Reveal as="h2" delayMs={80} className={styles.title}>How I think about the work.</Reveal>
        </div>
        <div className={styles.rows}>
          {thinkPieces.map((piece) => (
            <Link key={piece.slug} className={styles.row} href={`/writing/${piece.slug}/`}>
              {piece.title}
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
