const tokens = {
  colors: {
    background: '#0A0A0A',
    surface: '#1C1C1C',
    'surface-tertiary': '#2A2A2A',
    text: '#F2F2F2',
    'text-muted': '#A3A3A3',
    accent: '#1E3A8A',
  },
  fontFamily: {
    heading: ['"IBM Plex Serif"', 'serif'],
    body: ['Inter', 'sans-serif'],
    mono: ['"JetBrains Mono"', 'monospace'],
  },
  letterSpacing: {
    wordmark: '0.08em',
  },
};

module.exports = {
  theme: {
    extend: {
      colors: tokens.colors,
      fontFamily: tokens.fontFamily,
      letterSpacing: tokens.letterSpacing,
    },
  },
};
