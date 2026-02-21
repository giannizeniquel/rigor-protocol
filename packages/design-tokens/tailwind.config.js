/**
 * RIGOR — Tailwind Preset
 * Visual Identity System v0.1
 */

export default {
  theme: {
    colors: {
      'bg-primary': '#0A0A0A',
      'bg-secondary': '#1C1C1C',
      'bg-tertiary': '#2A2A2A',
      'text-primary': '#F2F2F2',
      'text-muted': '#A3A3A3',
      'accent': '#1E3A8A',
      'diagram-stroke': '#F2F2F2',
      'diagram-accent': '#1E3A8A',
      transparent: 'transparent',
      current: 'currentColor',
    },
    fontFamily: {
      heading: ['IBM Plex Serif', 'Georgia', 'serif'],
      body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
    },
    fontSize: {
      h1: ['3.5rem', { lineHeight: '1.2', letterSpacing: '0.02em' }],
      h2: ['2.25rem', { lineHeight: '1.2', letterSpacing: '0.02em' }],
      h3: ['1.5rem', { lineHeight: '1.2', letterSpacing: '0.02em' }],
      body: ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],
      caption: ['0.875rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],
    },
    fontWeight: {
      heading: '600',
      body: '400',
    },
    letterSpacing: {
      wordmark: '0.08em',
      heading: '0.02em',
      body: '0',
      caption: '0.01em',
    },
    spacing: {
      section: '96px',
      block: '48px',
      element: '24px',
      inline: '16px',
      tight: '8px',
    },
    maxWidth: {
      container: '1280px',
    },
    borderRadius: {
      none: '0',
      minimal: '2px',
    },
    borderWidth: {
      DEFAULT: '1px',
      thin: '1px',
      diagram: '1.5px',
      0: '0',
    },
    transitionDuration: {
      fast: '150ms',
      base: '250ms',
      slow: '400ms',
    },
    transitionTimingFunction: {
      linear: 'linear',
      standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    },
    extend: {
      gridTemplateColumns: {
        '12': 'repeat(12, minmax(0, 1fr))',
      },
      gap: {
        gutter: '24px',
      },
    },
  },
  plugins: [],
  corePlugins: {
    backgroundImage: false,
    boxShadow: false,
    container: true,
    preflight: true,
  },
}
