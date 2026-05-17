/**
 * Exports a combined A4 PDF with English CV first, Thai CV second.
 * Output: exports/Supakorn_CV_Combined_A4.pdf
 *         public/cv/Supakorn_CV_Combined_A4.pdf
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const sourceEnPath = path.join(projectRoot, "src", "cv_en.txt");
const sourceThPath = path.join(projectRoot, "src", "cv_th.txt");
const outputDir = path.join(projectRoot, "exports");
const publicCvDir = path.join(projectRoot, "public", "cv");
const outputPdfPath = path.join(outputDir, "Supakorn_CV_Combined_A4.pdf");
const publicPdfPath = path.join(publicCvDir, "Supakorn_CV_Combined_A4.pdf");
const outputHtmlPath = path.join(outputDir, "Supakorn_CV_Combined_A4.html");
const resumeOnlineUrl = "https://jamesupakorn.github.io/Interactive_Resume/";

// ─── Helpers ────────────────────────────────────────────────────────────────

function escapeHtml(v) {
  return v
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function toListItems(lines) {
  return lines
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => `<li>${escapeHtml(l)}</li>`)
    .join("\n");
}

// ─── Parsers ─────────────────────────────────────────────────────────────────

function parseCvEnglish(rawText) {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const headingMap = {
    "Contact Information": "contact",
    "Profile Summary": "summary",
    "Work Experience": "experience",
    "Technical Skills": "technical",
    "Soft Skills": "soft",
    "Education": "education",
  };
  return parseGeneric(lines, headingMap, "Portfolio:", "EN");
}

function parseCvThai(rawText) {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const headingMap = {
    "ข้อมูลติดต่อ": "contact",
    "สรุปโปรไฟล์": "summary",
    "ประสบการณ์ทํางาน": "experience",
    "ประสบการณ์ทำงาน": "experience",
    "ทักษะด้านเทคนิค": "technical",
    "ทักษะด้านบุคคล": "soft",
    "การศึกษา": "education",
  };
  return parseGeneric(lines, headingMap, "ผลงานออนไลน์:", "TH");
}

function parseGeneric(lines, headingMap, portfolioPrefix, lang) {
  const data = {
    name: lines[0],
    title: lines[1],
    contact: [],
    summary: [],
    experience: [],
    technical: [],
    soft: [],
    education: [],
  };
  let current = null;
  for (const line of lines.slice(2)) {
    const mapped = headingMap[line];
    if (mapped) {
      current = mapped;
      continue;
    }
    if (current) data[current].push(line);
  }
  const contactLines = data.contact.filter((l) => !l.startsWith(portfolioPrefix));
  const portfolioLine = data.contact.find((l) => l.startsWith(portfolioPrefix)) || "";
  const portfolioLinks = portfolioLine
    .replace(portfolioPrefix, "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const experiences = [];
  let currentJob = null;
  for (const line of data.experience) {
    if (line.includes("|") && /\(.*\)$/.test(line)) {
      if (currentJob) experiences.push(currentJob);
      currentJob = { roleLine: line, details: [] };
      continue;
    }
    if (!currentJob)
      currentJob = {
        roleLine: lang === "TH" ? "ประสบการณ์เพิ่มเติม" : "Additional Experience",
        details: [],
      };
    currentJob.details.push(line);
  }
  if (currentJob) experiences.push(currentJob);

  return {
    lang,
    name: data.name,
    title: data.title,
    contactLines,
    portfolioLinks,
    summary: data.summary.join(" "),
    experiences,
    technicalSkills: data.technical,
    softSkills: data.soft,
    education: data.education,
  };
}

// ─── Section builders ────────────────────────────────────────────────────────

function buildSection(cv) {
  const isEN = cv.lang === "EN";

  const contactHtml = cv.contactLines.map((l) => `<div>${escapeHtml(l)}</div>`).join("\n");
  const portfolioHtml = cv.portfolioLinks
    .map((link) => {
      const href = link.startsWith("http") ? link : `https://${link}`;
      return `<a href="${escapeHtml(href)}">${escapeHtml(link)}</a>`;
    })
    .join(" | ");

  const expHtml = cv.experiences
    .map(
      (item) => `
    <article class="exp-item">
      <h3>${escapeHtml(item.roleLine)}</h3>
      <ul>${toListItems(item.details)}</ul>
    </article>`
    )
    .join("\n");

  const techHtml = cv.technicalSkills
    .map((line) => {
      const [label, ...rest] = line.split(":");
      if (!rest.length) return `<li>${escapeHtml(line)}</li>`;
      return `<li><strong>${escapeHtml(label.trim())}:</strong> ${escapeHtml(rest.join(":").trim())}</li>`;
    })
    .join("\n");

  const h = {
    profile: isEN ? "Profile Summary" : "สรุปโปรไฟล์",
    experience: isEN ? "Work Experience" : "ประสบการณ์ทำงาน",
    technical: isEN ? "Technical Skills" : "ทักษะด้านเทคนิค",
    soft: isEN ? "Soft Skills" : "ทักษะด้านบุคคล",
    education: isEN ? "Education" : "การศึกษา",
    portfolio: isEN ? "Portfolio" : "ผลงานออนไลน์",
    online: isEN ? "Resume Online" : "Resume Online",
  };

  return `
  <section class="cv-page">
    <header class="cv-header">
      <div>
        <h1 class="cv-name">${escapeHtml(cv.name)}</h1>
        <p class="cv-job-title">${escapeHtml(cv.title)}</p>
      </div>
      <div class="cv-header-right">
        ${contactHtml}
        <div>${h.online}: <a href="${escapeHtml(resumeOnlineUrl)}">${escapeHtml(resumeOnlineUrl)}</a></div>
        <div class="portfolio-links">${h.portfolio}: ${portfolioHtml}</div>
      </div>
    </header>
    <hr class="cv-rule" />

    <div class="cv-section cv-section-compact">
      <h2 class="cv-section-title">${h.profile}</h2>
      <p>${escapeHtml(cv.summary)}</p>
    </div>

    <div class="cv-section cv-section-flow">
      <h2 class="cv-section-title">${h.experience}</h2>
      ${expHtml}
    </div>

    <div class="cv-section cv-section-compact">
      <h2 class="cv-section-title">${h.technical}</h2>
      <ul>${techHtml}</ul>
    </div>

    <div class="cv-section cv-section-compact">
      <h2 class="cv-section-title">${h.soft}</h2>
      <ul>${toListItems(cv.softSkills)}</ul>
    </div>

    <div class="cv-section cv-section-compact">
      <h2 class="cv-section-title">${h.education}</h2>
      <ul>${toListItems(cv.education)}</ul>
    </div>
  </section>`;
}

// ─── Combined HTML ────────────────────────────────────────────────────────────

function buildCombinedHtml(enCv, thCv) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>CV – ${escapeHtml(enCv.name)}</title>
  <style>
    @page { size: A4; margin: 14mm 16mm 16mm 16mm; }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      background: #fff;
      color: #1e2a35;
      font-size: 10.5pt;
      line-height: 1.45;
      font-family: "Aptos", "Segoe UI", "Noto Sans Thai", "TH Sarabun New", Arial, sans-serif;
    }

    /* Each language occupies its own A4 page */
    .cv-page {
      width: 100%;
      min-height: auto;
      padding: 0;
      page-break-after: always;
    }
    .cv-page:last-child { page-break-after: auto; }

    /* ── Header ── */
    .cv-header {
      display: grid;
      grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
      align-items: start;
      column-gap: 6mm;
      margin-bottom: 2.5mm;
    }
    .cv-name {
      margin: 0;
      font-size: 20pt;
      line-height: 1.1;
      color: #0d3b66;
      letter-spacing: 0.2px;
    }
    .cv-job-title {
      margin: 0.8mm 0 0;
      font-size: 11.2pt;
      font-weight: 600;
      color: #1f4f7a;
    }
    .cv-header-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.8mm;
      font-size: 10pt;
      color: #333;
      white-space: normal;
      text-align: right;
      line-height: 1.35;
    }
    .cv-header-right > div {
      max-width: 100%;
      overflow-wrap: anywhere;
      word-break: break-word;
    }
    .cv-header-right a { color: #0d3b66; text-decoration: none; }
    .portfolio-links {
      font-size: 9pt;
      color: #555;
      line-height: 1.35;
    }
    .portfolio-links a { color: #1f4f7a; }

    .cv-rule {
      border: none;
      border-top: 1.5px solid #0d3b66;
      margin: 2mm 0 3.5mm;
    }

    /* ── Sections ── */
    .cv-section {
      margin-bottom: 3.2mm;
      page-break-inside: auto;
      break-inside: auto;
    }
    .cv-section-flow {
      page-break-inside: auto;
      break-inside: auto;
    }
    .cv-section-compact {
      page-break-inside: avoid;
      break-inside: avoid-page;
    }
    .cv-section-title {
      margin: 0 0 1.8mm;
      font-size: 11pt;
      font-weight: 700;
      color: #0d3b66;
      border-left: 3.5px solid #1f4f7a;
      padding-left: 2.5mm;
      letter-spacing: 0.5px;
      page-break-after: avoid;
      break-after: avoid-page;
    }
    p { margin: 0; }
    ul { margin: 0.8mm 0 0 4mm; padding: 0; }
    li {
      margin-bottom: 0.9mm;
      page-break-inside: avoid;
      break-inside: avoid-page;
    }

    /* ── Experience ── */
    .exp-item {
      margin-bottom: 2.2mm;
      page-break-inside: avoid;
      break-inside: avoid-page;
    }
    .exp-item h3 { margin: 0 0 0.5mm; font-size: 10.5pt; color: #123f66; }

    /* ── Language separator ── */
    .lang-divider {
      display: flex;
      align-items: center;
      gap: 3mm;
      margin-bottom: 4mm;
      font-size: 8pt;
      color: #aaa;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .lang-divider::before,
    .lang-divider::after {
      content: "";
      flex: 1;
      border-top: 0.5px solid #ddd;
    }
  </style>
</head>
<body>
  ${buildSection(enCv)}
  ${buildSection(thCv)}
</body>
</html>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function exportCombinedPdf() {
  const [enRaw, thRaw] = await Promise.all([
    fs.readFile(sourceEnPath, "utf-8"),
    fs.readFile(sourceThPath, "utf-8"),
  ]);

  const enCv = parseCvEnglish(enRaw);
  const thCv = parseCvThai(thRaw);
  const html = buildCombinedHtml(enCv, thCv);

  await fs.mkdir(outputDir, { recursive: true });
  await fs.mkdir(publicCvDir, { recursive: true });
  await fs.writeFile(outputHtmlPath, html, "utf-8");

  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    throw new Error("playwright not found. Run: npm install && npx playwright install chromium");
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.pdf({
    path: outputPdfPath,
    printBackground: true,
    preferCSSPageSize: true,
  });
  await browser.close();

  await fs.copyFile(outputPdfPath, publicPdfPath);

  console.log(`Exported HTML: ${outputHtmlPath}`);
  console.log(`Exported PDF:  ${outputPdfPath}`);
  console.log(`Copied to public: ${publicPdfPath}`);
}

exportCombinedPdf().catch((err) => {
  console.error("CV combined export failed:", err.message);
  process.exitCode = 1;
});
