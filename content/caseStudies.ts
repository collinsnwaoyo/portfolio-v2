export interface CaseStudy {
  slug: string;
  caseNumber: number;
  totalCases: number;
  status: string;
  title: string;
  intro: string;
  introAccent: string;
  liveUrl: string;
  clipHref: string;
  meta: { label: string; value: string }[];
  heroImage: string;
  problem: {
    eyebrow: string;
    muted: string;
    accent: string;
    stats: { number: string; label: string }[];
  };
  decisions: {
    eyebrow: string;
    heading: string;
    items: { index: string; accent: boolean; title: string; body: string }[];
  };
  build: {
    eyebrow: string;
    heading: string;
    headingAccent: string;
    body: string;
    log: string[];
  };
  outcome: {
    eyebrow: string;
    stats: { value: string; label: string; accent: boolean }[];
    closing: string;
  };
}

export const nestwellCaseStudy: CaseStudy = {
  slug: 'nestwell',
  caseNumber: 1,
  totalCases: 14,
  status: 'Live product',
  title: 'Nestwell.',
  intro: 'A rent manager for Lagos co-living. ',
  introAccent: 'Designed, built and shipped by me.',
  liveUrl: 'https://nestwell-mocha.vercel.app',
  clipHref: '/clips/nestwell/landscape.html',
  meta: [
    { label: 'ROLE', value: 'Product designer and builder' },
    { label: 'STACK', value: 'Next.js, Supabase, Vercel' },
    { label: 'ENGINEER', value: 'Claude Code' },
    { label: 'YEAR', value: '2026' },
  ],
  heroImage: '/images/nestwell-dashboard.jpg',
  problem: {
    eyebrow: '01 / THE PROBLEM',
    muted:
      'Four properties, eleven beds, every tenant on a different due day, all tracked in spreadsheets and WhatsApp.',
    accent: 'The job was to make the one thing that needs doing today impossible to miss.',
    stats: [
      { number: '4', label: 'properties' },
      { number: '11', label: 'beds, each with its own due date' },
      { number: '3', label: 'day grace period, then a late fee' },
      { number: '2', label: 'tools juggled by hand' },
    ],
  },
  decisions: {
    eyebrow: '02 / KEY DECISIONS',
    heading: 'Four rules.',
    items: [
      {
        index: '01',
        accent: true,
        title: 'Statuses are computed, never stored.',
        body: 'Paid, due soon, overdue and on notice are worked out from payments and dates every time, so they cannot drift.',
      },
      {
        index: '02',
        accent: false,
        title: 'Honest messaging.',
        body: 'Reminders go out through WhatsApp links. The app only claims what it can know: ready, opened, sent. Never read.',
      },
      {
        index: '03',
        accent: false,
        title: 'People make the hard calls.',
        body: 'The app flags a tenant for notice but never issues it on its own.',
      },
      {
        index: '04',
        accent: false,
        title: 'Rent priced like a business.',
        body: 'A cost-plus model (lease, furnishing written off over three years, bills), priced for a 20% margin at 90% occupancy.',
      },
    ],
  },
  build: {
    eyebrow: '03 / THE BUILD',
    heading: 'I worked like I would with an engineering team. ',
    headingAccent: 'The AI sat in the engineer’s seat.',
    body: 'Spec first, a rules file the AI followed every session, a build log after every session, and each feature built, run, tested and committed before the next. My job was the decisions and the checking.',
    log: [
      'spec, data model, due-date rules',
      'rules file the AI follows each session',
      'computed statuses, grace, late fees',
      'WhatsApp reminders, honest states',
      'five visual directions, one chosen',
      '79 tests passing, deployed',
    ],
  },
  outcome: {
    eyebrow: '04 / OUTCOME',
    stats: [
      { value: '79', label: 'automated tests on the business rules', accent: true },
      { value: '100', label: 'Lighthouse accessibility, every page', accent: false },
      { value: 'Live', label: 'on a public link, demo data resets nightly', accent: false },
    ],
    closing:
      'The tool does not try to do more. It makes the one thing that needs doing today impossible to miss.',
  },
};
