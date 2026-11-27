import styles from './Contact.module.css';
import { site } from '../../content/content';
import Reveal from '../Reveal/Reveal';

export default function Contact() {
  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-heading">
      <div className="page-container">
      <Reveal as="p" className={styles.eyebrow}>04 / CONTACT</Reveal>
      <Reveal as="h2" delayMs={80} id="contact-heading" className={styles.title}>
        Let&rsquo;s build.
      </Reveal>
      <div className={styles.links}>
        <div>
          <p className={styles.label}>EMAIL</p>
          <a className={styles.link} href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
        <div>
          <p className={styles.label}>LINKEDIN</p>
          <a className={styles.link} href={site.linkedin}>
            {site.linkedinLabel} <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div>
          <p className={styles.label}>CV</p>
          <a className={styles.link} href={site.cvHref}>
            Download PDF <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div>
          <p className={styles.label}>CALL</p>
          <a className={styles.link} href={site.bookingHref}>
            Book 30 minutes <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <div className={styles.footer}>
        <span>© 2026 {site.name.toUpperCase()}</span>
        <span>DESIGNED AND BUILT BY ME, IN LAGOS</span>
      </div>
      </div>
    </section>
  );
}
