import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import lighthouse from 'lighthouse';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = 4300;
const DEBUG_PORT = 9222;
const URL_TO_TEST = `http://localhost:${PORT}/portfolio-v2/`;

const BUDGETS = {
  performance: 0.9,
  accessibility: 1,
  'best-practices': 0.9,
};

async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Server did not respond at ${url} within ${timeoutMs}ms`);
}

async function main() {
  const server = spawn(process.execPath, [join(__dirname, 'preview-server.mjs')], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: 'inherit',
  });

  let browser;
  try {
    await waitForServer(URL_TO_TEST);

    browser = await chromium.launch({
      args: [`--remote-debugging-port=${DEBUG_PORT}`],
    });

    const result = await lighthouse(URL_TO_TEST, {
      port: DEBUG_PORT,
      output: 'json',
      onlyCategories: Object.keys(BUDGETS),
      logLevel: 'error',
    });

    const { categories } = result.lhr;
    let failed = false;
    for (const [key, min] of Object.entries(BUDGETS)) {
      const score = categories[key]?.score ?? 0;
      const pass = score >= min;
      if (!pass) failed = true;
      console.log(
        `${pass ? 'PASS' : 'FAIL'}  ${key}: ${Math.round(score * 100)} (budget ${Math.round(min * 100)})`
      );
    }

    if (failed) {
      console.error('\nLighthouse budgets not met.');
      process.exitCode = 1;
    } else {
      console.log('\nAll Lighthouse budgets met.');
    }
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
