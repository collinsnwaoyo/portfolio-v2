export const DURATION = 29.6;

export interface Scene {
  id: string;
  a: number;
  b: number;
}

export const SCENES: Scene[] = [
  { id: 's-title', a: 0, b: 2.1 },
  { id: 's-beds', a: 2.1, b: 5.8 },
  { id: 's-mess', a: 5.8, b: 11.45 },
  { id: 's-dash', a: 11.45, b: 18.35 },
  { id: 's-rules', a: 18.35, b: 23.4 },
  { id: 's-end', a: 23.4, b: DURATION },
];

export interface CaptionWord {
  w: string;
  t: number;
  key: boolean;
}

export interface Caption {
  id: string;
  a: number;
  b: number;
  text: string;
  words: CaptionWord[];
}

// Caption word times come from forced alignment of Collins's recording.
// These are full sentences; CAPS below splits them into short phrases (one
// clause at a time) so the on-screen caption never grows past a line or two.
const CAPTION_SENTENCES: Caption[] = [
  { id: 'c1', a: 0, b: 0.8, text: 'Nestwell.', words: [{ w: 'Nestwell.', t: 0.24, key: false }] },
  {
    id: 'c2',
    a: 0.8,
    b: 5.85,
    text: 'A co-living business in Lagos: four properties, eleven beds, every tenant on a different due day.',
    words: [
      { w: 'A', t: 0.83, key: false },
      { w: 'co-living', t: 0.88, key: false },
      { w: 'business', t: 1.24, key: false },
      { w: 'in', t: 1.55, key: false },
      { w: 'Lagos:', t: 1.66, key: false },
      { w: 'four', t: 2.36, key: true },
      { w: 'properties,', t: 2.53, key: false },
      { w: 'eleven', t: 3.16, key: true },
      { w: 'beds,', t: 3.51, key: false },
      { w: 'every', t: 4.12, key: false },
      { w: 'tenant', t: 4.32, key: false },
      { w: 'on', t: 4.63, key: false },
      { w: 'a', t: 4.7, key: false },
      { w: 'different', t: 4.76, key: true },
      { w: 'due', t: 5.14, key: false },
      { w: 'day.', t: 5.28, key: false },
    ],
  },
  {
    id: 'c3',
    a: 5.85,
    b: 10.4,
    text: 'It all ran on spreadsheets, WhatsApp and bank transfer screenshots that had to be tracked by hand.',
    words: [
      { w: 'It', t: 5.91, key: false },
      { w: 'all', t: 6.06, key: false },
      { w: 'ran', t: 6.18, key: false },
      { w: 'on', t: 6.42, key: false },
      { w: 'spreadsheets,', t: 6.55, key: true },
      { w: 'WhatsApp', t: 7.15, key: true },
      { w: 'and', t: 7.63, key: false },
      { w: 'bank', t: 7.76, key: false },
      { w: 'transfer', t: 7.95, key: false },
      { w: 'screenshots', t: 8.21, key: true },
      { w: 'that', t: 8.85, key: false },
      { w: 'had', t: 9.0, key: false },
      { w: 'to', t: 9.11, key: false },
      { w: 'be', t: 9.19, key: false },
      { w: 'tracked', t: 9.25, key: false },
      { w: 'by', t: 9.46, key: false },
      { w: 'hand.', t: 9.58, key: false },
    ],
  },
  {
    id: 'c3b',
    a: 10.4,
    b: 11.45,
    text: 'That is where money leaked.',
    words: [
      { w: 'That', t: 10.46, key: false },
      { w: 'is', t: 10.59, key: false },
      { w: 'where', t: 10.68, key: false },
      { w: 'money', t: 10.8, key: false },
      { w: 'leaked.', t: 11.03, key: true },
    ],
  },
  {
    id: 'c4',
    a: 11.45,
    b: 15.1,
    text: 'So I designed the system first, with a home screen that answers a single question every morning:',
    words: [
      { w: 'So', t: 11.53, key: false },
      { w: 'I', t: 11.65, key: false },
      { w: 'designed', t: 11.69, key: false },
      { w: 'the', t: 11.89, key: false },
      { w: 'system', t: 11.95, key: true },
      { w: 'first,', t: 12.19, key: false },
      { w: 'with', t: 12.73, key: false },
      { w: 'a', t: 12.84, key: false },
      { w: 'home', t: 12.87, key: true },
      { w: 'screen', t: 13.01, key: true },
      { w: 'that', t: 13.2, key: false },
      { w: 'answers', t: 13.33, key: false },
      { w: 'a', t: 13.6, key: false },
      { w: 'single', t: 13.82, key: false },
      { w: 'question', t: 14.02, key: false },
      { w: 'every', t: 14.34, key: false },
      { w: 'morning:', t: 14.53, key: false },
    ],
  },
  {
    id: 'c4b',
    a: 15.1,
    b: 17.2,
    text: 'who owes what, and what do I need to do today?',
    words: [
      { w: 'who', t: 15.19, key: true },
      { w: 'owes', t: 15.44, key: true },
      { w: 'what,', t: 15.53, key: true },
      { w: 'and', t: 15.92, key: false },
      { w: 'what', t: 16.03, key: false },
      { w: 'do', t: 16.14, key: false },
      { w: 'I', t: 16.2, key: false },
      { w: 'need', t: 16.25, key: false },
      { w: 'to', t: 16.34, key: false },
      { w: 'do', t: 16.43, key: false },
      { w: 'today?', t: 16.55, key: true },
    ],
  },
  {
    id: 'c5',
    a: 17.2,
    b: 18.4,
    text: 'One tap sends a reminder.',
    words: [
      { w: 'One', t: 17.29, key: false },
      { w: 'tap', t: 17.43, key: true },
      { w: 'sends', t: 17.63, key: false },
      { w: 'a', t: 17.8, key: false },
      { w: 'reminder.', t: 17.85, key: false },
    ],
  },
  {
    id: 'c6',
    a: 18.4,
    b: 23.5,
    text: 'Statuses update themselves, late fees apply on schedule, and notices get flagged, never sent without me.',
    words: [
      { w: 'Statuses', t: 18.46, key: true },
      { w: 'update', t: 18.89, key: false },
      { w: 'themselves,', t: 19.16, key: false },
      { w: 'late', t: 20.02, key: true },
      { w: 'fees', t: 20.2, key: true },
      { w: 'apply', t: 20.37, key: false },
      { w: 'on', t: 20.55, key: false },
      { w: 'schedule,', t: 20.68, key: false },
      { w: 'and', t: 21.12, key: false },
      { w: 'notices', t: 21.24, key: false },
      { w: 'get', t: 21.58, key: false },
      { w: 'flagged,', t: 21.72, key: true },
      { w: 'never', t: 22.29, key: false },
      { w: 'sent', t: 22.49, key: false },
      { w: 'without', t: 22.8, key: false },
      { w: 'me.', t: 23.04, key: false },
    ],
  },
  {
    id: 'c7',
    a: 23.5,
    b: 27.4,
    text: 'I designed it, then built and shipped it myself, with AI as my engineer.',
    words: [
      { w: 'I', t: 23.63, key: false },
      { w: 'designed', t: 23.73, key: false },
      { w: 'it,', t: 24.06, key: false },
      { w: 'then', t: 24.29, key: false },
      { w: 'built', t: 24.58, key: true },
      { w: 'and', t: 24.86, key: false },
      { w: 'shipped', t: 25.09, key: true },
      { w: 'it', t: 25.3, key: false },
      { w: 'myself,', t: 25.36, key: false },
      { w: 'with', t: 25.78, key: false },
      { w: 'AI', t: 26.1, key: true },
      { w: 'as', t: 26.35, key: false },
      { w: 'my', t: 26.54, key: false },
      { w: 'engineer.', t: 26.64, key: false },
    ],
  },
];

// Splits each full sentence into short phrases at commas, colons and full
// stops, so one phrase is on screen at a time. Word timings come straight
// from the sentence they were split from; a phrase's end is simply where
// the next phrase begins.
function splitIntoPhrases(sentences: Caption[]): Caption[] {
  const phrases: Caption[] = [];
  for (const sentence of sentences) {
    let bucket: CaptionWord[] = [];
    const flush = () => {
      if (bucket.length === 0) return;
      phrases.push({
        id: `${sentence.id}-${phrases.length}`,
        a: bucket[0].t,
        b: sentence.b,
        text: bucket.map((w) => w.w).join(' '),
        words: bucket,
      });
      bucket = [];
    };
    for (const word of sentence.words) {
      bucket.push(word);
      if (/[,:.]$/.test(word.w)) flush();
    }
    flush();
  }
  for (let i = 0; i < phrases.length - 1; i++) {
    phrases[i].b = phrases[i + 1].a;
  }
  return phrases;
}

export const CAPS: Caption[] = splitIntoPhrases(CAPTION_SENTENCES);

export const BED_DAYS = ['2nd', '5th', '7th', '9th', '12th', '14th', '18th', '21st', '24th', '27th', '30th'];

export interface CamKeyframe {
  t: number;
  cx: number;
  cy: number;
  s: number;
}

// Dashboard camera keyframes, app coords 1280x800, stage 1280x720.
// cx/cy for the pan steps (indices 2-5) are refined at runtime once the
// "Remind" button and attention card are measured in the live layout.
export const CAM_LANDSCAPE: CamKeyframe[] = [
  { t: 11.45, cx: 640, cy: 400, s: 0.9 },
  { t: 12.8, cx: 640, cy: 400, s: 0.9 },
  { t: 14.9, cx: 1050, cy: 300, s: 1.55 },
  { t: 16.85, cx: 1050, cy: 300, s: 1.55 },
  { t: 17.35, cx: 1080, cy: 200, s: 2.3 },
  { t: 18.0, cx: 1080, cy: 200, s: 2.3 },
  { t: 18.4, cx: 640, cy: 400, s: 0.9 },
];

// Portrait is tighter throughout, not just during the dashboard pan.
export const CAM_PORTRAIT: CamKeyframe[] = [
  { t: 11.45, cx: 640, cy: 400, s: 1.35 },
  { t: 12.8, cx: 640, cy: 400, s: 1.35 },
  { t: 14.9, cx: 1050, cy: 300, s: 2.1 },
  { t: 16.85, cx: 1050, cy: 300, s: 2.1 },
  { t: 17.35, cx: 1080, cy: 200, s: 2.9 },
  { t: 18.0, cx: 1080, cy: 200, s: 2.9 },
  { t: 18.4, cx: 640, cy: 400, s: 1.35 },
];

// Static per-scene zoom/pan for the portrait crop, keyed by scene id.
// Timing (when a scene is on screen) is identical to landscape; only the
// framing within the scene is tighter.
export const PORTRAIT_SCENE_FOCUS: Record<string, { scale: number; x: number; y: number }> = {
  's-title': { scale: 1.3, x: 640, y: 330 },
  's-beds': { scale: 1.3, x: 640, y: 330 },
  's-mess': { scale: 1.35, x: 560, y: 330 },
  's-rules': { scale: 1.2, x: 640, y: 330 },
  's-end': { scale: 1.25, x: 460, y: 330 },
};
