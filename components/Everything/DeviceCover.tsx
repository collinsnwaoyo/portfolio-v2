import styles from './Everything.module.css';
import type { Project } from '../../content/content';
import { asset } from '../../lib/paths';

const LockIcon = () => (
  <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

export function LockTag({ confidentiality }: { confidentiality: Project['confidentiality'] }) {
  if (confidentiality === 'public') return null;
  return (
    <span className={styles.lockTag}>
      <LockIcon />
      {confidentiality === 'internal' ? 'Internal tool' : 'Under NDA'}
    </span>
  );
}

export default function DeviceCover({ project }: { project: Project }) {
  const { cover } = project;

  if (cover.variant === 'browser' && cover.image) {
    return (
      <div className={styles.coverBrowser}>
        <div className={styles.browserChrome}>
          <img
            src={asset(cover.image)}
            alt=""
            width={800}
            height={500}
            loading="lazy"
            decoding="async"
            className={styles.browserImg}
          />
        </div>
        <div className={styles.browserBase} />
      </div>
    );
  }

  if (cover.variant === 'image' && cover.image) {
    return (
      <img
        src={asset(cover.image)}
        alt=""
        width={200}
        height={200}
        loading="lazy"
        decoding="async"
        className={styles.coverImageTag}
      />
    );
  }

  if (cover.variant === 'disc') {
    return (
      <div className={styles.coverDisc}>
        <img
          src={asset('/images/objects/case.webp')}
          alt=""
          width={480}
          height={480}
          loading="lazy"
          decoding="async"
          className={styles.coverDiscCase}
        />
        <img
          src={asset('/images/discs/nestwell.webp')}
          alt=""
          width={480}
          height={480}
          loading="lazy"
          decoding="async"
          className={styles.coverDiscDisc}
        />
      </div>
    );
  }

  if (cover.variant === 'terminal') {
    return (
      <div className={styles.coverTerminal}>
        <span>$ build-log --tail</span>
        <br />
        <span className={styles.terminalLine}>{project.outcome}</span>
      </div>
    );
  }

  if (cover.variant === 'phone') {
    return (
      <div
        className={styles.coverPhoneOuter}
        style={cover.rotate ? { transform: 'rotate(-4deg)' } : undefined}
      >
        <div className={styles.coverPhoneScreen} style={{ background: cover.bg }} />
      </div>
    );
  }

  if (cover.variant === 'tilted') {
    return (
      <div className={styles.coverTilted} style={{ background: cover.bg }}>
        <span className={styles.coverBracketOnLight}>[{cover.label}]</span>
      </div>
    );
  }

  return <span className={styles.coverBracket}>[{cover.label}]</span>;
}
