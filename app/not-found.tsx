import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main className={styles.page}>
      <p className={styles.eyebrow}>404</p>
      <h1 className={styles.title}>Not here.</h1>
      <p className={styles.sub}>This page doesn&rsquo;t exist, or moved. Everything else still does.</p>
      <Link href="/" className={styles.home}>
        Back to home
      </Link>
    </main>
  );
}
