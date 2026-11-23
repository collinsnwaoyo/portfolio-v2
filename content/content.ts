export type Confidentiality = 'public' | 'anonymised' | 'internal';
export type ProjectKind = 'project' | 'snippet' | 'illustration';
export type CoverVariant = 'browser' | 'phone' | 'tilted' | 'disc' | 'terminal' | 'text' | 'image';

export interface ProjectCover {
  variant: CoverVariant;
  image?: string;
  bg?: string;
  label?: string;
  rotate?: boolean;
}

export interface Project {
  slug: string;
  title: string;
  shortTitle?: string;
  role?: string;
  year?: string;
  outcome: string;
  kind: ProjectKind;
  featured?: number;
  confidentiality: Confidentiality;
  cover: ProjectCover;
  liveUrl?: string;
  discImage?: string;
}

export const projects: Project[] = [
  {
    slug: 'nestwell',
    title: 'Nestwell',
    role: 'Product designer and builder',
    year: '2026',
    outcome: 'Rent manager, live, 79 tests',
    kind: 'project',
    featured: 1,
    confidentiality: 'public',
    cover: { variant: 'browser', image: '/images/nestwell-dashboard.jpg' },
    discImage: '/images/discs/nestwell.webp',
  },
  {
    slug: 'race-day-companion',
    title: 'Race day companion app',
    outcome: 'A race-day companion app for runners',
    kind: 'project',
    confidentiality: 'public',
    cover: { variant: 'phone', bg: '#E9F5EC', label: 'Race day app' },
  },
  {
    slug: 'cd-player',
    title: 'The CD player',
    outcome: 'A CD-case concept used across this site',
    kind: 'snippet',
    confidentiality: 'public',
    cover: { variant: 'disc' },
  },
  {
    slug: 'business-verification',
    title: 'Business verification',
    outcome: 'A business verification flow',
    kind: 'project',
    confidentiality: 'anonymised',
    cover: { variant: 'phone', bg: '#DCE4F7', label: 'Business verification', rotate: true },
  },
  {
    slug: 'ai-scoping-workbench',
    title: 'AI scoping workbench',
    shortTitle: 'AI Workbench',
    outcome: 'Brief to draft in under 8 hours',
    kind: 'project',
    featured: 3,
    confidentiality: 'internal',
    cover: { variant: 'tilted', bg: '#E7E7E7', label: 'AI scoping workbench' },
    discImage: '/images/discs/ai-workbench.webp',
  },
  {
    slug: 'stradha',
    title: 'Dining pre-order',
    shortTitle: 'Stradha',
    outcome: 'Two-sided dining app, in development',
    kind: 'project',
    featured: 4,
    confidentiality: 'anonymised',
    cover: { variant: 'phone', bg: '#F7E6D6', label: 'Dining pre-order' },
    discImage: '/images/discs/stradha.webp',
  },
  {
    slug: 'nestwell-build-log',
    title: 'Nestwell build log',
    outcome: '79 tests passing, deployed',
    kind: 'snippet',
    confidentiality: 'public',
    cover: { variant: 'terminal' },
  },
  {
    slug: 'employee-relocation',
    title: 'Employee relocation platform',
    outcome: 'An employee relocation platform',
    kind: 'project',
    confidentiality: 'anonymised',
    cover: { variant: 'phone', bg: '#EFE7FA', label: 'Employee relocation', rotate: true },
  },
  {
    slug: 'bible-match',
    title: 'Bible Match',
    outcome: '100,000 units sold',
    kind: 'illustration',
    confidentiality: 'public',
    cover: { variant: 'text', label: 'Bible Match illustration' },
  },
  {
    slug: 'design-system',
    title: 'Multi-brand design system',
    shortTitle: 'Design System',
    outcome: 'Feature work about 35% faster',
    kind: 'project',
    featured: 5,
    confidentiality: 'anonymised',
    cover: { variant: 'text', label: 'Design system components' },
    discImage: '/images/discs/design-system.webp',
  },
  {
    slug: 'voice-synced-clip',
    title: 'Voice-synced motion clip',
    outcome: 'Captions keyed off word timings',
    kind: 'snippet',
    confidentiality: 'public',
    cover: { variant: 'image', image: '/images/objects/tv.webp' },
  },
  {
    slug: 'trade-pre-clearance',
    title: 'Compliance pre-clearance app',
    outcome: 'A trade pre-clearance workflow',
    kind: 'project',
    confidentiality: 'anonymised',
    cover: { variant: 'phone', bg: '#F3F3F1', label: 'Trade pre-clearance', rotate: true },
  },
  {
    slug: 'sirjhoe',
    title: 'Sirjhoe, Shopify build',
    outcome: 'A Shopify storefront build',
    kind: 'snippet',
    confidentiality: 'public',
    cover: { variant: 'text', label: 'Sirjhoe store' },
  },
  {
    slug: 'liveable',
    title: 'Liveable Lagos',
    shortTitle: 'Liveable',
    outcome: '300+ listings in month one',
    kind: 'project',
    featured: 2,
    confidentiality: 'public',
    cover: { variant: 'tilted', bg: '#E4EFE7', label: 'Liveable listings' },
    discImage: '/images/discs/liveable.webp',
  },
];

export function getFeaturedProjects(): Project[] {
  return projects
    .filter((p): p is Project & { featured: number } => typeof p.featured === 'number')
    .sort((a, b) => a.featured - b.featured);
}

export function getProjectCounts() {
  return {
    all: projects.length,
    project: projects.filter((p) => p.kind === 'project').length,
    snippet: projects.filter((p) => p.kind === 'snippet').length,
    illustration: projects.filter((p) => p.kind === 'illustration').length,
  };
}

export interface ThinkPiece {
  slug: string;
  title: string;
}

export const thinkPieces: ThinkPiece[] = [
  { slug: 'design-is-the-discipline-of-installing-rules', title: 'Design is the discipline of installing rules.' },
  { slug: 'the-autopilot-has-always-been-there', title: 'The autopilot has always been there. The pilot still matters.' },
  { slug: 'a-design-system-is-a-contract', title: 'A design system is a contract, not a component library.' },
  { slug: 'handoff-is-not-a-moment', title: 'Handoff is not a moment. It is a process.' },
];

export const site = {
  name: 'Collins Nwaoyo',
  role: 'Product designer, builder, illustrator',
  location: 'Based in Lagos',
  availability: 'Working worldwide, remote',
  email: 'collinsnwaoyo@gmail.com',
  linkedin: 'https://www.linkedin.com/in/collinsnwaoyo/',
  linkedinLabel: '/in/collinsnwaoyo',
  // TODO: not yet decided (PRD open items) — wire up once Collins provides them
  cvHref: '#',
  bookingHref: '#',
};
