/**
 * RIGOR — Tailwind Preset
 * Visual Identity System v0.1
 * 
 * Tailwind configuration aligned with RIGOR visual specifications.
 * No gradients. No rounded corners. No shadows. Structural precision.
 */

module.exports = {
  theme: {
    colors: {
      // Background
      'bg-primary': '#0A0A0A',
      'bg-secondary': '#1C1C1C',
      'bg-tertiary': '#2A2A2A',
      
      // Text
      'text-primary': '#F2F2F2',
      'text-muted': '#A3A3A3',
      
      // Accent
      'accent': '#1E3A8A',
      
      // Diagram
      'diagram-stroke': '#F2F2F2',
      'diagram-accent': '#1E3A8A',
      
      // Transparent (for utilities)
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
      
      // Standard Tailwind scale (for utilities)
      0: '0',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      6: '1.5rem',
      8: '2rem',
      12: '3rem',
      16: '4rem',
      24: '6rem',
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
      // Grid system
      gridTemplateColumns: {
        '12': 'repeat(12, minmax(0, 1fr))',
      },
      gap: {
        gutter: '24px',
      },
    },
  },
  
  plugins: [],
  
  // Disable features that violate visual identity
  corePlugins: {
    // Disable gradients
    backgroundImage: false,
    
    // Disable box shadows
    boxShadow: false,
    
    // Keep essential utilities
    container: true,
    preflight: true,
  },
}