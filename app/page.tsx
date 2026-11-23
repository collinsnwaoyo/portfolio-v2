export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        gap: '1rem',
      }}
    >
      <h1
        data-testid="font-display"
        style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2rem', margin: 0 }}
      >
        Portfolio v2
      </h1>
      <p data-testid="font-body" style={{ fontFamily: 'var(--font-body)', margin: 0 }}>
        Phase 1 scaffold &mdash; static export, basePath, self-hosted fonts.
      </p>
      <p
        data-testid="font-mono"
        style={{ fontFamily: 'var(--font-mono)', margin: 0, fontSize: '0.8rem' }}
      >
        /portfolio-v2
      </p>
    </main>
  );
}
