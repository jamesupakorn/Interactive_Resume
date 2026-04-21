# Interactive Resume (React + Three.js)

A lightweight interactive resume built with React and a Three.js animated 3D background.

## Run

```bash
npm install
npm run dev
```

Open the URL shown by Vite (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Export Thai CV to A4 PDF

```bash
npm install
npx playwright install chromium
npm run export:cv:th
```

Output files:

- `exports/Supakorn_CV_TH_A4.pdf`
- `exports/Supakorn_CV_TH_A4.html`

## Deploy (GitHub Pages)

```bash
npm run deploy
```

This will build the project and publish `dist` to the `gh-pages` branch.

## Customize

- Update profile text and localized section content in `src/data/resumeContent.js`
- Update journey generation and animation helper logic in `src/utils/journeyUtils.js`
- Update visual theme colors and layout in `src/styles.css`
