import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const sourcePath = path.join(projectRoot, "src", "cv_th.txt");
const outputDir = path.join(projectRoot, "exports");
const publicCvDir = path.join(projectRoot, "public", "cv");
const outputPdfPath = path.join(outputDir, "Supakorn_CV_TH_A4.pdf");
const publicPdfPath = path.join(publicCvDir, "Supakorn_CV_TH_A4.pdf");
const outputHtmlPath = path.join(outputDir, "Supakorn_CV_TH_A4.html");
const resumeOnlineUrl = "https://jamesupakorn.github.io/Interactive_Resume/";

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function toListItems(lines) {
  return lines
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<li>${escapeHtml(line)}</li>`)
    .join("\n");
}

function parseCvThai(rawText) {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 3) {
    throw new Error("cv_th.txt ไม่มีข้อมูลเพียงพอสำหรับสร้างเอกสาร");
  }

  const headingMap = {
    "ข้อมูลติดต่อ": "contact",
    "สรุปโปรไฟล์": "summary",
    "ประสบการณ์ทํางาน": "experience",
    "ประสบการณ์ทำงาน": "experience",
    "ทักษะด้านเทคนิค": "technical",
    "ทักษะด้านบุคคล": "soft",
    "การศึกษา": "education",
  };

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

    if (current) {
      data[current].push(line);
    }
  }

  const contactLines = data.contact.filter((line) => !line.startsWith("ผลงานออนไลน์:"));
  const onlineLine = data.contact.find((line) => line.startsWith("ผลงานออนไลน์:")) || "";
  const portfolioLinks = onlineLine
    .replace("ผลงานออนไลน์:", "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const experiences = [];
  let currentJob = null;

  for (const line of data.experience) {
    if (line.includes("|") && /\(.*\)$/.test(line)) {
      if (currentJob) {
        experiences.push(currentJob);
      }
      currentJob = { roleLine: line, details: [] };
      continue;
    }

    if (!currentJob) {
      currentJob = { roleLine: "ประสบการณ์เพิ่มเติม", details: [] };
    }
    currentJob.details.push(line);
  }

  if (currentJob) {
    experiences.push(currentJob);
  }

  return {
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

function buildCvHtml(parsedCv) {
  const contactHtml = parsedCv.contactLines
    .map((line) => {
      const lineMatch = line.match(/^Line:\s*(https:\/\/line\.me\/ti\/p\/~(\S+))$/);
      if (lineMatch) {
        return `<div>Line: <a href="${escapeHtml(lineMatch[1])}">${escapeHtml(lineMatch[2])}</a></div>`;
      }
      return `<div>${escapeHtml(line)}</div>`;
    })
    .join("\n");

  const portfolioHtml = parsedCv.portfolioLinks
    .map((link) => {
      const href = link.startsWith("http") ? link : `https://${link}`;
      return `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${escapeHtml(link)}</a>`;
    })
    .join("<span> | </span>");

  const expHtml = parsedCv.experiences
    .map(
      (item) => `
      <article class="exp-item">
        <h3>${escapeHtml(item.roleLine)}</h3>
        <ul>
          ${toListItems(item.details)}
        </ul>
      </article>
    `
    )
    .join("\n");

  const techHtml = parsedCv.technicalSkills
    .map((line) => {
      const [label, ...rest] = line.split(":");
      if (!rest.length) {
        return `<li>${escapeHtml(line)}</li>`;
      }
      return `<li><strong>${escapeHtml(label.trim())}:</strong> ${escapeHtml(rest.join(":").trim())}</li>`;
    })
    .join("\n");

  const softHtml = toListItems(parsedCv.softSkills);
  const educationHtml = toListItems(parsedCv.education);

  return `<!doctype html>
<html lang="th">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CV - ${escapeHtml(parsedCv.name)}</title>
    <style>
      @page {
        size: A4;
        margin: 12mm;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: "TH Sarabun New", "Sarabun", "Noto Sans Thai", Arial, sans-serif;
        color: #1e2a35;
        font-size: 11pt;
        line-height: 1.42;
        background: #fff;
      }

      .page {
        width: 100%;
      }

      .header {
        border-bottom: 2px solid #0d3b66;
        padding-bottom: 5mm;
        margin-bottom: 5mm;
      }

      .name {
        margin: 0;
        font-size: 24pt;
        line-height: 1.12;
        color: #0d3b66;
      }

      .title {
        margin: 1mm 0 3mm;
        font-size: 13pt;
        font-weight: 600;
        color: #1f4f7a;
      }

      .meta {
        display: grid;
        gap: 1mm;
        font-size: 10.5pt;
      }

      .meta a {
        color: #0d3b66;
        text-decoration: none;
      }

      .meta a:hover {
        text-decoration: underline;
      }

      section {
        margin-top: 4mm;
      }

      h2 {
        margin: 0 0 2mm;
        font-size: 12.5pt;
        color: #0d3b66;
        border-left: 4px solid #1f4f7a;
        padding-left: 2.5mm;
      }

      p {
        margin: 0;
      }

      ul {
        margin: 1mm 0 0 4.5mm;
        padding: 0;
      }

      li {
        margin: 0 0 1.2mm;
      }

      .exp-item {
        margin-bottom: 3mm;
        page-break-inside: avoid;
      }

      .exp-item h3 {
        margin: 0;
        font-size: 11.5pt;
        color: #123f66;
      }

      .portfolio-links {
        margin-top: 1mm;
        font-size: 10pt;
      }

      .portfolio-links a {
        color: #1f4f7a;
        text-decoration: none;
      }

      .portfolio-links a:hover {
        text-decoration: underline;
      }

    </style>
  </head>
  <body>
    <main class="page">
      <header class="header">
        <h1 class="name">${escapeHtml(parsedCv.name)}</h1>
        <p class="title">${escapeHtml(parsedCv.title)}</p>
        <div class="meta">
          ${contactHtml}
          <div>
            Resume Online: <a href="${escapeHtml(resumeOnlineUrl)}" target="_blank" rel="noreferrer">${escapeHtml(
              resumeOnlineUrl
            )}</a>
          </div>
          <div class="portfolio-links">ผลงานออนไลน์: ${portfolioHtml}</div>
        </div>
      </header>

      <section>
        <h2>สรุปโปรไฟล์</h2>
        <p>${escapeHtml(parsedCv.summary)}</p>
      </section>

      <section>
        <h2>ประสบการณ์ทำงาน</h2>
        ${expHtml}
      </section>

      <section>
        <h2>ทักษะด้านเทคนิค</h2>
        <ul>
          ${techHtml}
        </ul>
      </section>

      <section>
        <h2>ทักษะด้านบุคคล</h2>
        <ul>
          ${softHtml}
        </ul>
      </section>

      <section>
        <h2>การศึกษา</h2>
        <ul>
          ${educationHtml}
        </ul>
      </section>

    </main>
  </body>
</html>`;
}

async function exportCvPdf() {
  const rawText = await fs.readFile(sourcePath, "utf-8");
  const parsedCv = parseCvThai(rawText);
  const html = buildCvHtml(parsedCv);

  await fs.mkdir(outputDir, { recursive: true });
  await fs.mkdir(publicCvDir, { recursive: true });
  await fs.writeFile(outputHtmlPath, html, "utf-8");

  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    throw new Error(
      "ไม่พบแพ็กเกจ playwright กรุณารัน: npm install และ npx playwright install chromium"
    );
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle" });
  await page.pdf({
    path: outputPdfPath,
    format: "A4",
    printBackground: true,
    margin: {
      top: "12mm",
      right: "12mm",
      bottom: "12mm",
      left: "12mm",
    },
  });

  await browser.close();

  // Also copy to public/cv/ so it can be downloaded from the web app
  await fs.copyFile(outputPdfPath, publicPdfPath);

  console.log(`Exported HTML: ${outputHtmlPath}`);
  console.log(`Exported PDF:  ${outputPdfPath}`);
  console.log(`Copied to public: ${publicPdfPath}`);
}

exportCvPdf().catch((error) => {
  console.error("CV export failed:", error.message);
  process.exitCode = 1;
});
