import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { nestwellCaseStudy } from '../../../content/caseStudies';
import { asset } from '../../../lib/paths';

const CASE_STUDIES = { nestwell: nestwellCaseStudy };

export function generateStaticParams() {
  return Object.keys(CASE_STUDIES).map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = CASE_STUDIES[slug as keyof typeof CASE_STUDIES];
  return { title: study ? `${study.title.replace(/\.$/, '')} — Collins Nwaoyo` : 'Case study' };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = CASE_STUDIES[slug as keyof typeof CASE_STUDIES];
  if (!study) notFound();

  return (
    <main className={styles.page}>
      <section className={`page-container ${styles.titleCard}`}>
        <div className={styles.topRow}>
          <Link href="/#everything" className={styles.backLink}>
            &#8592; All work
          </Link>
          <span className={styles.caseNumber}>
            CASE {String(study.caseNumber).padStart(2, '0')} OF {study.totalCases}
          </span>
        </div>

        <div className={styles.titleGrid}>
          <div>
            <p className={styles.status}>
              <span className={styles.statusDot} aria-hidden="true" />
              {study.status}
            </p>
            <h1 className={styles.title}>{study.title}</h1>
            <p className={styles.intro}>
              {study.intro}
              <span className={styles.accent}>{study.introAccent}</span>
            </p>
          </div>
          <div className={styles.ctas}>
            <a
              href={study.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaPrimary}
            >
              Open the live product <span aria-hidden="true">&#8599;</span>
            </a>
            <a
              href={asset(study.clipHref)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaSecondary}
            >
              <span aria-hidden="true">&#9654;</span> Play the 30-second brief
            </a>
          </div>
        </div>

        <div className={styles.metaRow}>
          {study.meta.map((item) => (
            <div key={item.label}>
              <p className={styles.metaLabel}>{item.label}</p>
              <p className={styles.metaValue}>{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`page-container ${styles.heroShotSection}`}>
        <div className={styles.heroShot}>
          <div className={styles.heroScreen}>
            <div className={styles.heroScreenChrome}>
              <img
                src={asset(study.heroImage)}
                alt="Nestwell home screen: who owes what today"
                width={800}
                height={500}
                className={styles.heroScreenImg}
              />
            </div>
          </div>
          <div className={styles.heroDisc}>
            <img
              src={asset('/images/objects/case.webp')}
              alt=""
              width={480}
              height={480}
              className={styles.heroDiscCase}
            />
            <img
              src={asset('/images/discs/nestwell.webp')}
              alt=""
              width={480}
              height={480}
              className={styles.heroDiscDisc}
            />
          </div>
        </div>
      </section>

      <section className={`page-container ${styles.problemSection}`}>
        <p className={styles.eyebrow}>{study.problem.eyebrow}</p>
        <p className={styles.problemStatement}>
          <span className={styles.muted}>{study.problem.muted}</span> {study.problem.accent}
        </p>
        <div className={styles.statGrid}>
          {study.problem.stats.map((stat) => (
            <div key={stat.label} className={styles.statCol}>
              <p className={styles.statNumber}>{stat.number}</p>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.decisionsSection}>
        <div className="page-container">
          <p className={styles.eyebrow}>{study.decisions.eyebrow}</p>
          <h2 className={styles.decisionsHeading}>{study.decisions.heading}</h2>
          <div className={styles.decisionsGrid}>
            {study.decisions.items.map((item) => (
              <div
                key={item.index}
                className={item.accent ? styles.decisionCardAccent : styles.decisionCard}
              >
                <p className={item.accent ? styles.decisionIndexAccent : styles.decisionIndex}>
                  {item.index}
                </p>
                <p className={styles.decisionTitle}>{item.title}</p>
                <p className={styles.decisionBody}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.buildSection}>
        <div className="page-container">
          <p className={styles.eyebrowOnDark}>{study.build.eyebrow}</p>
          <div className={styles.buildGrid}>
            <div>
              <h2 className={styles.buildHeading}>
                {study.build.heading}
                <span className={styles.accentOnDark}>{study.build.headingAccent}</span>
              </h2>
              <p className={styles.buildBody}>{study.build.body}</p>
            </div>
            <div className={styles.buildLog}>
              <span className={styles.buildLogPrompt}>$ build-log --tail</span>
              <br />
              {study.build.log.map((line, i) => (
                <span key={line}>
                  {String(i + 1).padStart(2, '0')}
                  &nbsp;&nbsp;{line}
                  <br />
                </span>
              ))}
              <span className={styles.buildLogLive}>&#9679; LIVE</span>
            </div>
          </div>
        </div>
      </section>

      <section className={`page-container ${styles.outcomeSection}`}>
        <p className={styles.eyebrow}>{study.outcome.eyebrow}</p>
        <div className={styles.outcomeGrid}>
          {study.outcome.stats.map((stat) => (
            <div
              key={stat.label}
              className={stat.accent ? styles.outcomeColAccent : styles.outcomeCol}
            >
              <p className={stat.accent ? styles.outcomeValueAccent : styles.outcomeValue}>
                {stat.value}
              </p>
              <p className={styles.outcomeLabel}>{stat.label}</p>
            </div>
          ))}
        </div>
        <p className={styles.closing}>{study.outcome.closing}</p>
        <div className={styles.footer}>
          <span>&#169; 2026 COLLINS NWAOYO</span>
          <span>DESIGNED AND BUILT BY ME, IN LAGOS</span>
        </div>
      </section>
    </main>
  );
}
