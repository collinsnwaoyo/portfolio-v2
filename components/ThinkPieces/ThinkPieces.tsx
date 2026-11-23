import styles from './ThinkPieces.module.css';
import { thinkPieces } from '../../content/content';

export default function ThinkPieces() {
  return (
    <section id="think" className={styles.section} aria-label="Think pieces">
      <div className={styles.grid}>
        <div>
          <p className={styles.eyebrow}>03 / THINK PIECES</p>
          <h2 className={styles.title}>How I think about the work.</h2>
        </div>
        <div className={styles.rows}>
          {thinkPieces.map((piece) => (
            <a key={piece.slug} className={styles.row} href={`/writing/${piece.slug}/`}>
              {piece.title}
              <span aria-hidden="true">→</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
