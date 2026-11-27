import type { Metadata } from 'next';
import { Inter, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import '../styles/tokens.css';
import './globals.css';
import Dock from '../components/Dock/Dock';
import Loader from '../components/Loader/Loader';

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

const CURRENT_SITE_URL = 'https://collinsnwaoyo.github.io/portfolio/';
const SITE_DESCRIPTION =
  'Product designer and builder. Nine years turning messy, rule-heavy products into simple ones — fintech, proptech, compliance and AI tools. Now I build them too.';

export const metadata: Metadata = {
  metadataBase: new URL('https://collinsnwaoyo.github.io/portfolio-v2/'),
  title: 'Collins Nwaoyo',
  description: SITE_DESCRIPTION,
  robots: { index: false, follow: false },
  alternates: { canonical: CURRENT_SITE_URL },
  openGraph: {
    title: 'Collins Nwaoyo',
    description: SITE_DESCRIPTION,
    type: 'website',
    images: [{ url: '/images/share.png', width: 1200, height: 630, alt: 'Collins Nwaoyo — product designer and builder' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Collins Nwaoyo',
    description: SITE_DESCRIPTION,
    images: ['/images/share.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <script
          // Runs before paint so the hero never flashes visible then hides:
          // decides up front whether the loader will play at all.
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var played=localStorage.getItem('loader-played')==='1';var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;document.documentElement.dataset.loader=(played||reduce)?'done':'pending';}catch(e){document.documentElement.dataset.loader='done';}})();",
          }}
        />
        <Loader />
        {children}
        <Dock />
      </body>
    </html>
  );
}
