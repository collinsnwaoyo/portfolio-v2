'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Everything.module.css';
import { projects, getProjectCounts, type ProjectKind } from '../../content/content';
import DeviceCover, { LockTag } from './DeviceCover';

type Filter = 'all' | ProjectKind;

// Only projects with a built case study page get a real link; the rest
// stay as inert placeholder tiles until their own page exists.
const HAS_CASE_STUDY = new Set(['nestwell']);

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'project', label: 'Projects' },
  { value: 'snippet', label: 'Snippets' },
  { value: 'illustration', label: 'Illustration' },
];

export default function Everything() {
  const counts = getProjectCounts();
  const [filter, setFilter] = useState<Filter>('all');

  return (
    <section id="everything" aria-label="All work" className={styles.everything}>
      <div className="page-container">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>ALL WORK</p>
          <h2 className={styles.title}>Everything.</h2>
          <p className={styles.desc}>
            Most of what I design lives behind a login: internal tools, compliance systems,
            client platforms. Case studies here are anonymised. I can walk you through more on a
            call.
          </p>
        </div>
        <div role="tablist" aria-label="Filter work" className={styles.tabs}>
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={filter === value}
              className={filter === value ? styles.tabActive : styles.tab}
              onClick={() => setFilter(value)}
            >
              {label} {value === 'all' ? counts.all : counts[value]}
            </button>
          ))}
        </div>
      </div>

      <ul className={styles.grid}>
        {projects.map((project) => {
          const matches = filter === 'all' || project.kind === filter;
          const subtitle =
            project.role && project.year
              ? `${project.role.toUpperCase()} · ${project.year}`
              : project.kind.toUpperCase();

          const hasCaseStudy = HAS_CASE_STUDY.has(project.slug);
          const content = (
            <>
              <span className={styles.tileCover}>
                <span className={styles.tileCoverInner}>
                  <DeviceCover project={project} />
                </span>
                <LockTag confidentiality={project.confidentiality} />
                <span className={styles.titleBar} aria-hidden="true">
                  <span className={styles.titleBarText}>
                    <span className={styles.titleBarName}>{project.title}</span>
                    <span className={styles.titleBarSubtitle}>{subtitle}</span>
                  </span>
                  <span>&#8599;</span>
                </span>
              </span>
              <span className={styles.tileMeta}>
                <span className={styles.tileTitle}>{project.title}</span>
                <span className={styles.tileKind}>{project.kind.toUpperCase()}</span>
              </span>
            </>
          );

          return (
            <li key={project.slug} className={styles.tile} inert={!matches}>
              {hasCaseStudy ? (
                <Link
                  href={`/work/${project.slug}`}
                  className={styles.tileButton}
                  style={{ opacity: matches ? 1 : 0.15 }}
                >
                  {content}
                </Link>
              ) : (
                <button
                  type="button"
                  className={styles.tileButton}
                  style={{ opacity: matches ? 1 : 0.15 }}
                >
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      <p className={styles.note}>Counts update from the content model as you filter.</p>
      </div>
    </section>
  );
}
