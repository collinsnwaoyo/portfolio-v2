import { execSync } from 'node:child_process';

function run(label, command) {
  console.log(`\n▶ ${label}`);
  execSync(command, { stdio: 'inherit' });
}

try {
  run('Type-checking', 'npx tsc --noEmit');
  run('Linting', 'npx eslint .');
  run('Building static export', 'npx next build');
  run('Running Playwright (flows, screenshots, accessibility)', 'npx playwright test');
  run('Checking Lighthouse budgets', 'node scripts/lighthouse-check.mjs');
  console.log('\nAll checks passed.');
} catch {
  console.error('\nCheck failed.');
  process.exit(1);
}
