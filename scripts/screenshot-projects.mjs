import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '../public/images/projects');

const projects = [
  {
    name: 'toothbin',
    url: 'https://toothbin.vercel.app/',
  },
  {
    name: 'financetrack',
    url: 'https://finance-track-one.vercel.app/profiles',
  },
  {
    name: 'interactive-resume',
    url: 'https://jamesupakorn.github.io/Interactive_Resume/',
  },
];

(async () => {
  const browser = await chromium.launch();

  for (const project of projects) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 720 });

    console.log(`📸 Capturing: ${project.url}`);
    try {
      await page.goto(project.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2500);

      const outPath = path.join(OUTPUT_DIR, `${project.name}.png`);
      await page.screenshot({ path: outPath, type: 'png' });
      console.log(`✅ Saved: ${outPath}`);
    } catch (err) {
      console.error(`❌ Failed ${project.name}:`, err.message);
    }

    await page.close();
  }

  await browser.close();
  console.log('\nDone.');
})();
