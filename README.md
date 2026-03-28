# Moral Assessment (MFQ-30)

Client-side web app for the Moral Foundations Questionnaire (MFQ-30), a 32-item assessment of five moral foundations.

Live site:
`https://jonathanprocter.github.io/moral-assessment/`

## Features
- Full MFQ-30 assessment (all 32 items)
- Results dashboard with radar chart and score comparison
- Progress autosave and session resume
- Exports: PDF, PNG, JSON, CSV, shareable link
- Optional BYOK AI insights (OpenAI / Anthropic)
- Fully client-side, no backend
- Responsive and accessible

## Tech
- React 18 + Vite
- Chart.js + react-chartjs-2
- jsPDF + html2canvas
- lucide-react

## Getting Started
```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
```

Preview the build:
```bash
npm run preview
```

## Project Structure
```
.
├── index.html
├── package.json
├── vite.config.js
└── src
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── components
    ├── constants
    ├── data
    └── utils
```

## Notes
- Data is stored locally in the browser (localStorage / sessionStorage).
- Share links encode scores in the URL hash.
- AI keys are stored in sessionStorage only.

## Attribution
Moral Foundations Questionnaire (MFQ-30, July 2008) by Jesse Graham, Jonathan Haidt, and Brian Nosek.
