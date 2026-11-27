import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { thinkPieces } from '../../../content/content';

export function generateStaticParams() {
  return thinkPieces.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const piece = thinkPieces.find((p) => p.slug === slug);
  if (!piece) return { title: 'Think piece' };
  return { title: `${piece.title} — Collins Nwaoyo`, description: piece.stubNote };
}

function formatDate(value: string) {
  const [year, month] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1)).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default async function ThinkPiecePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const piece = thinkPieces.find((p) => p.slug === slug);
  if (!piece) notFound();

  return (
    <main className={styles.page}>
      <div className={`page-container ${styles.topRow}`}>
        <Link href="/#think" className={styles.backLink}>
          &#8592; Think pieces
        </Link>
        <span className={styles.date}>{formatDate(piece.date)}</span>
      </div>
      <div className="page-container">
        <h1 className={styles.title}>{piece.title}</h1>
        <div className={styles.body}>
          <p className={styles.stubNote}>{piece.stubNote}</p>
        </div>
      </div>
    </main>
  );
}
