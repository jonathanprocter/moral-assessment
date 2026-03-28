# Moral Foundations Questionnaire (MFQ-30) Web Application

A fully client-side web application for the Moral Foundations Questionnaire (MFQ-30), a validated 32-item psychological assessment measuring five moral foundations.

## Overview

The MFQ-30 measures five moral foundations based on Moral Foundations Theory by Jonathan Haidt, Jesse Graham, and Brian Nosek:

- **Care/Harm**: Caring for others and preventing harm
- **Fairness/Cheating**: Justice, equal treatment, and reciprocity
- **Loyalty/Betrayal**: Group loyalty and commitment
- **Authority/Subversion**: Respect for authority and tradition
- **Sanctity/Degradation**: Purity, sanctity, and the sacred

## Features

✅ **Complete MFQ-30 Assessment**: All 32 verified questions with proper scales  
✅ **Interactive Results Dashboard**: Radar chart visualization with score comparisons  
✅ **Progress Saving**: Auto-save to localStorage with session resume  
✅ **Multiple Export Formats**: PDF, PNG, JSON, CSV, and shareable URLs  
✅ **AI-Powered Insights**: Optional BYOK integration with OpenAI and Anthropic  
✅ **Fully Client-Side**: No backend required, all data stored locally  
✅ **Responsive Design**: Works on mobile, tablet, and desktop  
✅ **Accessible**: ARIA labels, keyboard navigation, screen reader compatible  

## Technology Stack

- **React 18.3.1**: UI framework
- **Vite**: Build tool and dev server
- **Chart.js 4.5.1**: Data visualization
- **react-chartjs-2 5.3.1**: React wrapper for Chart.js
- **jsPDF 3.0.4**: PDF generation
- **html2canvas 1.4.1**: Chart capture for exports
- **lucide-react**: Icon library

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

## Installation

1. **Clone or download this repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - The application will open automatically at `http://localhost:3000`
   - Or manually navigate to the URL shown in the terminal

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

### Project Structure

```
./
├── index.html                 # Entry point
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite configuration
├── README.md                 # This file
├── src/
│   ├── main.jsx              # React entry point
│   ├── App.jsx               # Main application component
│   ├── index.css             # Global styles
│   ├── components/           # React components
│   │   ├── Welcome.jsx       # Landing page
│   │   ├── Assessment.jsx    # Question interface
│   │   ├── Results.jsx       # Results dashboard
│   │   ├── RadarChart.jsx    # Chart visualization
│   │   ├── ExportModal.jsx   # Export functionality
│   │   ├── AIInsights.jsx    # AI integration
│   │   └── ProgressBar.jsx   # Progress indicator
│   ├── data/
│   │   └── questions.js      # MFQ-30 questions (verified)
│   ├── utils/
│   │   ├── scoring.js        # Scoring algorithm
│   │   ├── storage.js        # localStorage utilities
│   │   ├── export.js         # Export functions
│   │   └── ai.js             # AI API integration
│   └── constants/
│       ├── normativeData.js  # Average scores and interpretations
│       └── config.js         # Design system and configuration
```

## Building for Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Output**
   - Production files will be in the `dist/` directory
   - All assets are optimized and minified
   - Code is split into vendor chunks for better caching

3. **Preview production build**
   ```bash
   npm run preview
   ```

## Deployment

### Static Hosting (Recommended)

The application is fully client-side and can be deployed to any static hosting service:

#### Netlify
1. Connect your repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy!

#### Vercel
1. Import your repository to Vercel
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy!

#### GitHub Pages
1. Build the application: `npm run build`
2. Push the `dist` folder to `gh-pages` branch
3. Enable GitHub Pages in repository settings

#### Other Options
- AWS S3 + CloudFront
- Firebase Hosting
- Cloudflare Pages
- Any web server (Apache, Nginx, etc.)

### Deployment Notes

- No server-side code required
- No environment variables needed (unless using AI features)
- All data is stored in browser localStorage
- CORS is not an issue (except for AI API calls)

## Usage

### Taking the Assessment

1. **Start**: Click "Begin Assessment" on the welcome page
2. **Part 1** (Questions 1-16): Rate relevance of moral considerations (0-5 scale)
3. **Part 2** (Questions 17-32): Rate agreement with statements (0-5 scale)
4. **Progress**: Automatically saved to localStorage
5. **Complete**: View your results with visualizations

### Understanding Results

- **Scores**: Each foundation scored 0-30 (sum of 6 questions)
- **Comparison**: Your scores vs. average American sample
- **Interpretation**: High (24-30), Moderate (15-23), Low (0-14)
- **Catch Questions**: Q6 and Q22 are not scored (validity check)

### Exporting Results

- **PDF**: Complete report with charts and interpretations
- **PNG**: Chart image optimized for sharing (1200x630px)
- **JSON**: Raw data for further analysis
- **CSV**: Spreadsheet format for Excel/Google Sheets
- **Share URL**: Encoded link with your scores

### AI Insights (Optional)

1. Click "Get AI Insights" on results page
2. Choose provider: OpenAI or Anthropic
3. Enter your API key (stored in session only)
4. Select model and generate insights
5. Receive personalized analysis of your moral profile

**Supported Models:**
- OpenAI: GPT-4o, GPT-4 Turbo, GPT-4o Mini
- Anthropic: Claude Opus 4.5, Claude Sonnet 4.5, Claude Haiku 4.5

**Privacy**: API keys are stored in sessionStorage only and cleared when you close the tab.

## Data Privacy

- ✅ All data stored locally in browser (localStorage)
- ✅ No server communication except optional AI API calls
- ✅ No cookies or tracking
- ✅ API keys never persisted beyond session
- ✅ Results can be cleared at any time
- ✅ Share links encode data in URL (no server storage)

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

**Required Features:**
- localStorage
- sessionStorage
- ES6+ JavaScript
- Canvas API (for chart exports)

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support (Tab, Arrow keys, Enter, 0-5 keys)
- Focus indicators for keyboard users
- Screen reader compatible
- Minimum 4.5:1 color contrast ratio
- 44x44px minimum touch targets

## Scoring Methodology

The MFQ-30 uses the following scoring system:

### Foundation Questions
- **Care/Harm**: Q1, Q7, Q12, Q17, Q23, Q28
- **Fairness/Cheating**: Q2, Q8, Q13, Q18, Q24, Q29
- **Loyalty/Betrayal**: Q3, Q9, Q14, Q19, Q25, Q30
- **Authority/Subversion**: Q4, Q10, Q15, Q20, Q26, Q31
- **Sanctity/Degradation**: Q5, Q11, Q16, Q21, Q27, Q32

### Catch Questions (Not Scored)
- **Q6**: "Whether or not someone was good at math"
- **Q22**: "It is better to do good than to do bad"

### Score Calculation
- Each foundation: Sum of 6 question responses (0-5 each)
- Range: 0-30 per foundation
- No reverse scoring in this version

### Average Scores (Moderate American Sample)
- Care/Harm: 20.2
- Fairness/Cheating: 20.5
- Loyalty/Betrayal: 16.0
- Authority/Subversion: 16.5
- Sanctity/Degradation: 12.6

## Troubleshooting

### Application won't start
- Ensure Node.js 18+ is installed: `node --version`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

### Charts not displaying
- Check browser console for errors
- Ensure Chart.js loaded correctly
- Try clearing browser cache

### Export not working
- Check browser console for errors
- Ensure pop-up blocker isn't blocking downloads
- Try a different browser

### AI insights failing
- Verify API key format (OpenAI: `sk-...`, Anthropic: `sk-ant-...`)
- Check API key has sufficient credits
- Verify internet connection
- Check browser console for detailed error

### Progress not saving
- Ensure localStorage is enabled in browser
- Check available storage space
- Try incognito/private mode to test

## Attribution

The Moral Foundations Questionnaire (MFQ-30, July 2008) by Jesse Graham, Jonathan Haidt, and Brian Nosek.

For more information about Moral Foundations Theory:
- [MoralFoundations.org](https://www.moralfoundations.org)
- [YourMorals.org](https://www.yourmorals.org)

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or contributions, please open an issue on the repository.

## Version History

### v1.0.0 (Current)
- Initial release
- All 32 MFQ-30 questions implemented
- Radar chart visualization
- PDF, PNG, JSON, CSV exports
- AI insights with OpenAI and Anthropic
- Progress saving and resume
- Fully responsive design
- Accessibility features

## Development Notes

### Design System
- Colors: Exact hex codes from specification (do not modify)
- Typography: Inter font family
- Spacing: 4px base unit system
- Components: Reusable, accessible, responsive

### Code Quality
- ESLint configured for React best practices
- Component-based architecture
- Utility functions for reusability
- Comprehensive error handling
- Loading states for async operations

### Performance
- Code splitting for vendor libraries
- Lazy loading for Chart.js
- Optimized bundle size
- Fast initial load (<2 seconds target)

---

**Built with ❤️ for understanding moral psychology**
