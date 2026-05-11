# CLAUDE.md

Quick guide for working in this repo.

## What This Is

- React + Vite interactive resume.
- TH/EN bilingual content.
- 3D life journey / avatar view using `@react-three/fiber`, `@react-three/drei`, `three`.
- PDF CV export for Thai, English, and combined EN-first then TH.
- GitHub Pages deploys from `PRD` and the app lives under `/Interactive_Resume/`.

## Core Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

CV export:

```bash
npm run export:cv:th
npm run export:cv:en
npm run export:cv:combined
npm run export:cv
```

Deploy:

```bash
npm run deploy
```

## Key Files

- `src/App.jsx`: app shell, resume view, avatar view, CV download modal.
- `src/data/resumeContent.js`: localized UI content.
- `src/cv_th.txt`, `src/cv_en.txt`: CV source text used by export scripts.
- `src/styles.css`: layout, modal, print and PDF styling.
- `src/utils/journeyUtils.js`: journey helpers for the 3D view.
- `scripts/export-cv-th-pdf.mjs`: Thai PDF export.
- `scripts/export-cv-en-pdf.mjs`: English PDF export.
- `scripts/export-cv-combined-pdf.mjs`: combined PDF export.

Generated output:

- `exports/`
- `public/cv/`

## Rules To Follow

- Use `apply_patch` for edits.
- Keep changes small and localized.
- Do not revert unrelated user changes.
- After editing `src/App.jsx`, `src/data/resumeContent.js`, or `src/styles.css`, run `npm run build`.
- After changing CV source files, modal download logic, or export scripts, run `npm run export:cv`.

## Conventions

- Displayed Line text: `Line: manofmoon`.
- Line URL: `https://line.me/ti/p/~manofmoon`.
- Always use `import.meta.env.BASE_URL` for assets/downloads that must work on GitHub Pages.
- Combined PDF order: English first, Thai second.

## Git Flow

- `DEV` is for development.
- `PRD` is production.
- Promotion order: push `DEV`, merge into `PRD`, then push `PRD`.
