import styles from './Everything.module.css';
import { projects, getProjectCounts } from '../../content/content';
import DeviceCover, { LockTag } from './DeviceCover';

export default function Everything() {
  const counts = getProjectCounts();

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
        <div
          role="tablist"
          aria-label="Filter work"
          className={styles.tabs}
        >
          <button type="button" role="tab" aria-selected="true" className={styles.tabActive}>
            All {counts.all}
          </button>
          <button type="button" role="tab" aria-selected="false" className={styles.tab}>
            Projects {counts.project}
          </button>
          <button type="button" role="tab" aria-selected="false" className={styles.tab}>
            Snippets {counts.snippet}
          </button>
          <button type="button" role="tab" aria-selected="false" className={styles.tab}>
            Illustration {counts.illustration}
          </button>
        </div>
      </div>

      <ul className={styles.grid}>
        {projects.map((project) => (
          <li
            key={project.slug}
            className={styles.tile}
            style={project.slug === 'nestwell' ? { boxShadow: '0 0 0 2px var(--accent)' } : undefined}
          >
            <div className={styles.tileCover}>
              <DeviceCover project={project} />
              <LockTag confidentiality={project.confidentiality} />
            </div>
            <div className={styles.tileMeta}>
              <span className={styles.tileTitle}>{project.title}</span>
              <span className={styles.tileKind}>{project.kind.toUpperCase()}</span>
            </div>
          </li>
        ))}
      </ul>
      <p className={styles.note}>
        Filtering and hover states land in the next phase; this view shows everything.
      </p>
      </div>
    </section>
  );
}
