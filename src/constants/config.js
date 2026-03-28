// Updated 2026-forward color direction

export const colors = {
  // Main palette
  backgroundPrimary: '#f5efe6', // Wax Paper-inspired
  backgroundSecondary: '#e6dbc8',
  border: '#d2c4af',
  textSecondary: '#6f635b',
  textPrimary: '#3d3431',
  
  // Foundation-specific colors
  foundations: {
    care: '#0f6b6a',        // Transformative Teal
    fairness: '#7fbf3a',    // Green Glow (toned)
    loyalty: '#6f3f35',     // Cocoa Powder
    authority: '#7a5ac9',   // Fresh Purple
    sanctity: '#c58a3a'     // Warm amber (paired with Wax Paper)
  }
};

export const typography = {
  fontPrimary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontMono: "'JetBrains Mono', 'Fira Code', monospace",
  
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '2rem'     // 32px
  },
  
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75
  }
};

export const spacing = {
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem'      // 64px
};

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px'
};

export const shadows = {
  sm: '0 1px 2px rgba(84, 88, 91, 0.05)',
  md: '0 4px 6px rgba(84, 88, 91, 0.07)',
  lg: '0 10px 15px rgba(84, 88, 91, 0.1)',
  xl: '0 20px 25px rgba(84, 88, 91, 0.15)'
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px'
};

// AI Model configurations with verified identifiers
export const aiModels = {
  openai: [
    { id: 'gpt-4o', name: 'GPT-4o', description: 'Most capable multimodal model' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Fast and efficient' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Cost-efficient small model' }
  ],
  anthropic: [
    { id: 'claude-opus-4-5-20251101', name: 'Claude Opus 4.5', description: 'Most intelligent model' },
    { id: 'claude-sonnet-4-5-20250929', name: 'Claude Sonnet 4.5', description: 'Balanced performance' },
    { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5', description: 'Fast and efficient' }
  ]
};

export const storageKeys = {
  progress: 'mfq30_progress',
  results: 'mfq30_results',
  apiKey: 'mfq30_api_key' // sessionStorage only
};

export const attribution = {
  text: "The Moral Foundations Questionnaire (MFQ-30, July 2008) by Jesse Graham, Jonathan Haidt, and Brian Nosek.",
  links: {
    moralFoundations: "https://www.moralfoundations.org",
    yourMorals: "https://www.yourmorals.org"
  }
};
