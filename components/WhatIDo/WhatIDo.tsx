import styles from './WhatIDo.module.css';

export default function WhatIDo() {
  return (
    <section className={styles.section} aria-labelledby="what-i-do-heading">
      <div className="page-container">
      <p className={styles.eyebrow}>02 / WHAT I DO</p>
      <h2 id="what-i-do-heading" className={styles.statement}>
        <span className={styles.muted}>Logistics, energy, betting, compliance, AI, property.</span>{' '}
        Twenty-plus products, one method: the rules a product runs on, then the screens,{' '}
        <span className={styles.accent}>then the code.</span>
      </h2>
      <div className={styles.columns}>
        <div className={styles.column}>
          <p className={styles.columnLabel}>DESIGN</p>
          <p className={styles.columnBody}>
            Product strategy
            <br />
            UX and interface design
            <br />
            Design systems
            <br />
            Brand and illustration
          </p>
        </div>
        <div className={styles.column}>
          <p className={styles.columnLabel}>BUILD</p>
          <p className={styles.columnBody}>
            Claude Code as my engineer
            <br />
            Next.js, Supabase, Vercel
            <br />
            Specs, data models, tests
            <br />
            Shipped to real users
          </p>
        </div>
        <div className={`${styles.column} ${styles.proof}`}>
          <p className={`${styles.columnLabel} ${styles.proofLabel}`}>PROOF</p>
          <p className={styles.columnBody}>
            Y Combinator final-round shortlist
            <br />
            300+ listings in a startup&rsquo;s first month
            <br />
            100,000 Bible Match units sold
            <br />
            20+ client products since 2021
          </p>
        </div>
      </div>
      </div>
    </section>
  );
}
