# RIGOR — Technical Architecture Specification
**Version:** 1.0  
**Date:** 2026-02-15

---

## 1. Executive Summary

This document defines the complete technical architecture for the RIGOR web presence, consisting of:

- **rigor.dev** — Institutional protocol declaration site
- **docs.rigor.dev** — Normative specification documentation

The architecture embodies the RIGOR identity: structural constraint, determinism, and formal precision.

---

## 2. Stack Decision & Rationale

### 2.1 Core Technologies

```
Monorepo:     Turborepo
Landing:      Astro (Static HTML/CSS)
Docs:         VitePress
Styling:      Tailwind CSS (with RIGOR preset)
Typography:   IBM Plex Serif + Inter + JetBrains Mono
Deployment:   Vercel
```

### 2.2 Rationale

**Why Astro for Landing:**
- Zero JavaScript by default = maximum determinism
- Static HTML/CSS output = aligned with protocol philosophy
- No client-side hydration = bounded behavior
- Component-based but generates pure HTML
- Markdown-native for content
- Extremely fast build and runtime performance
- SEO-friendly without framework overhead

**Philosophical alignment:**
Astro embodies RIGOR principles:
- **Deterministic**: Build-time rendering, no runtime surprises
- **Explicit**: What you write is what gets generated
- **Bounded**: Zero JavaScript = zero runtime behavior
- **Minimal**: No framework overhead in production

**Why VitePress for Docs:**
- Built for technical documentation
- Markdown-native (aligns with existing specs)
- Extremely fast
- Sidebar/navigation automatic
- Dark theme native
- Minimal JavaScript footprint

**Why Monorepo:**
- Shared design tokens ensure visual consistency
- Single source of truth for typography/colors
- Independent deployment of landing vs docs
- Type-safe cross-package dependencies

**Why Static Export:**
- No backend = maximum reliability
- No database = no complexity
- Deploy to CDN = maximum performance
- Aligned with protocol philosophy (deterministic, bounded)

---

## 3. Project Structure

```
rigor/
├── package.json                     # Root workspace config
├── turbo.json                       # Turborepo pipeline
├── .gitignore
├── README.md
│
├── apps/
│   ├── web/                         # rigor.dev (Astro)
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   └── index.astro      # Landing page
│   │   │   ├── components/
│   │   │   │   ├── Hero.astro
│   │   │   │   ├── StructuralCondition.astro
│   │   │   │   ├── ProtocolModel.astro
│   │   │   │   ├── CoreInvariants.astro
│   │   │   │   ├── StructuralPositioning.astro
│   │   │   │   ├── ConceptualTerritory.astro
│   │   │   │   ├── ProtocolVsPrompt.astro
│   │   │   │   ├── SpecificationAccess.astro
│   │   │   │   ├── Diagram.astro
│   │   │   │   └── Footer.astro
│   │   │   ├── layouts/
│   │   │   │   └── Layout.astro      # Base layout
│   │   │   └── styles/
│   │   │       └── global.css        # Global styles
│   │   ├── public/
│   │   │   ├── logo-rigor.svg
│   │   │   ├── favicon.ico
│   │   │   └── diagrams/
│   │   │       └── protocol-flow.svg
│   │   ├── astro.config.mjs
│   │   ├── tailwind.config.mjs
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── docs/                        # docs.rigor.dev (VitePress)
│       ├── .vitepress/
│       │   ├── config.ts            # VitePress config
│       │   └── theme/
│       │       ├── index.ts         # Theme customization
│       │       └── custom.css       # RIGOR styling
│       ├── index.md                 # Docs homepage
│       ├── specification/
│       │   ├── identity-core.md
│       │   ├── protocol-model.md
│       │   ├── protocol-overview.md
│       │   ├── differentiation.md
│       │   ├── spec-core.md
│       │   ├── spec-reference.md
│       │   └── spec-appendix.md
│       ├── implementation/
│       │   ├── validation-engine.md
│       │   └── constraint-encoding.md
│       ├── examples/
│       │   ├── process-specifications.md
│       │   └── payment-flow-example.md
│       ├── public/
│       │   └── logo-rigor.svg
│       └── package.json
│
└── packages/
    └── design-tokens/               # Shared design system
        ├── package.json
        ├── tokens.json              # Design tokens (JSON)
        ├── css/
        │   └── variables.css        # CSS custom properties
        ├── tailwind.config.js       # Tailwind preset
        └── README.md
```

---

## 4. Design System Architecture

### 4.1 Token Distribution

```
Design Tokens (Source of Truth)
    ↓
CSS Variables (for VitePress)
    ↓
Tailwind Preset (for Next.js)
```

**Single source of truth:** `packages/design-tokens/tokens.json`

### 4.2 Token Categories

```json
{
  "colors": {
    "background": { ... },
    "text": { ... },
    "accent": { ... }
  },
  "typography": {
    "fontFamily": { ... },
    "fontSize": { ... },
    "letterSpacing": { ... }
  },
  "spacing": { ... },
  "layout": { ... },
  "motion": { ... }
}
```

### 4.3 Consumption

**Astro (Landing):**
```astro
---
// src/pages/index.astro
import '@rigor/design-tokens/css'
---

<div class="bg-bg-primary text-text-primary">
  <h1 class="font-heading text-h1 tracking-heading">
    RIGOR
  </h1>
</div>

<style>
  /* Or use CSS variables directly */
  h1 {
    font-family: var(--font-heading);
    color: var(--color-text-primary);
  }
</style>
```

**VitePress (Docs):**
```css
/* .vitepress/theme/custom.css */
@import '@rigor/design-tokens/css';

:root {
  --vp-c-brand-1: var(--color-accent);
  --vp-font-family-base: var(--font-body);
}
```

---

## 5. Landing Page Architecture (rigor.dev)

### 5.1 Page Structure

```astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';
import StructuralCondition from '../components/StructuralCondition.astro';
import ProtocolModel from '../components/ProtocolModel.astro';
import CoreInvariants from '../components/CoreInvariants.astro';
import StructuralPositioning from '../components/StructuralPositioning.astro';
import ConceptualTerritory from '../components/ConceptualTerritory.astro';
import ProtocolVsPrompt from '../components/ProtocolVsPrompt.astro';
import SpecificationAccess from '../components/SpecificationAccess.astro';
import Footer from '../components/Footer.astro';
---

<Layout>
  <Hero />
  <StructuralCondition />
  <ProtocolModel />
  <CoreInvariants />
  <StructuralPositioning />
  <ConceptualTerritory />
  <ProtocolVsPrompt />
  <SpecificationAccess />
  <Footer />
</Layout>
```

### 5.2 Component Specifications

#### Hero Component

```astro
---
// src/components/Hero.astro
// Build-time code (runs once during build)
const ctaUrl = "https://docs.rigor.dev";
---

<section class="section container">
  <div class="max-w-container">
    <h1 class="wordmark text-text-primary mb-element">
      RIGOR
    </h1>
    <p class="text-h2 font-heading text-text-primary mb-element">
      AI Constraint Protocol.
    </p>
    <p class="text-body text-text-muted mb-block">
      Formal boundaries for AI-generated systems.
    </p>
    <a href={ctaUrl} class="cta text-accent">
      Access Specification →
    </a>
  </div>
</section>

<style>
  /* Scoped styles - compiled at build time */
  .wordmark {
    letter-spacing: var(--tracking-wordmark);
    text-transform: uppercase;
  }
  
  .cta {
    text-decoration: none;
    border-bottom: var(--border-thin) solid var(--color-accent);
    transition: opacity var(--duration-fast) var(--easing-linear);
  }
  
  .cta:hover {
    opacity: 0.8;
  }
</style>
```

**Output:** Pure HTML with scoped CSS. Zero JavaScript.

**Constraints Applied:**
- No filled buttons
- No decorative elements
- Expanded letter spacing for wordmark
- Accent color only on CTA text
- Generous vertical spacing (96px sections)

#### Diagram Component

```astro
---
// src/components/Diagram.astro
interface Props {
  src: string;
  alt: string;
}

const { src, alt } = Astro.props;
---

<div class="diagram">
  <img src={src} alt={alt} />
</div>

<style>
  .diagram {
    padding: var(--spacing-block);
    background-color: var(--color-bg-secondary);
    border: var(--border-diagram) solid var(--color-text-primary);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .diagram img {
    max-width: 100%;
    height: auto;
  }
</style>
```

**Visual Requirements:**
- Monochromatic SVG diagrams
- Thin line weights (1.5px)
- Rectangular boundaries
- No curves/organic shapes

#### Layout Component

```astro
---
// src/layouts/Layout.astro
import '@rigor/design-tokens/css';

interface Props {
  title?: string;
  description?: string;
}

const { 
  title = 'RIGOR — AI Constraint Protocol',
  description = 'Formal boundaries for AI-generated systems.'
} = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@600&family=Inter:wght@400&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
  </head>
  <body>
    <slot />
  </body>
</html>

<style is:global>
  /* Global styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  body {
    font-family: var(--font-body);
    font-size: var(--text-body);
    font-weight: var(--weight-body);
    line-height: var(--leading-body);
    color: var(--color-text-primary);
    background-color: var(--color-bg-primary);
  }
</style>
```

---

## 6. Documentation Architecture (docs.rigor.dev)

### 6.1 VitePress Configuration

```typescript
// .vitepress/config.ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'RIGOR',
  description: 'AI Constraint Protocol — Normative Specification',
  
  appearance: 'dark',  // Force dark mode
  
  themeConfig: {
    logo: '/logo-rigor.svg',
    
    nav: [
      { 
        text: 'rigor.dev', 
        link: 'https://rigor.dev' 
      },
      { 
        text: 'Specification', 
        link: '/specification/identity-core' 
      },
      { 
        text: 'Implementation', 
        link: '/implementation/' 
      }
    ],
    
    sidebar: {
      '/specification/': [
        {
          text: 'Protocol Specification',
          items: [
            { 
              text: 'Identity Core', 
              link: '/specification/identity-core' 
            },
            { 
              text: 'Protocol Model', 
              link: '/specification/protocol-model' 
            },
            { 
              text: 'Protocol Overview', 
              link: '/specification/protocol-overview' 
            },
            { 
              text: 'Differentiation', 
              link: '/specification/differentiation' 
            }
          ]
        },
        {
          text: 'Process Specification',
          items: [
            { 
              text: 'Spec Core', 
              link: '/specification/spec-core' 
            },
            { 
              text: 'Spec Reference', 
              link: '/specification/spec-reference' 
            },
            { 
              text: 'Spec Appendix', 
              link: '/specification/spec-appendix' 
            }
          ]
        }
      ],
      
      '/implementation/': [
        {
          text: 'Implementation',
          items: [
            { 
              text: 'Validation Engine', 
              link: '/implementation/validation-engine' 
            },
            { 
              text: 'Constraint Encoding', 
              link: '/implementation/constraint-encoding' 
            }
          ]
        }
      ]
    },
    
    socialLinks: [
      { 
        icon: 'github', 
        link: 'https://github.com/rigor' 
      }
    ],
    
    footer: {
      message: 'AI Constraint Protocol',
      copyright: 'Specification v0.1'
    }
  }
})
```

### 6.2 Theme Customization

```css
/* .vitepress/theme/custom.css */
@import '@rigor/design-tokens/css';

/**
 * Override VitePress default theme with RIGOR identity
 */

:root {
  /* Colors */
  --vp-c-bg: var(--color-bg-primary);
  --vp-c-bg-alt: var(--color-bg-secondary);
  --vp-c-bg-elv: var(--color-bg-tertiary);
  
  --vp-c-text-1: var(--color-text-primary);
  --vp-c-text-2: var(--color-text-muted);
  
  --vp-c-brand-1: var(--color-accent);
  --vp-c-brand-2: var(--color-accent);
  --vp-c-brand-3: var(--color-accent);
  
  /* Typography */
  --vp-font-family-base: var(--font-body);
  --vp-font-family-mono: var(--font-mono);
  
  /* Spacing */
  --vp-layout-max-width: var(--layout-max-width);
}

/* Remove rounded corners */
.vp-doc :where(h1, h2, h3, h4, h5, h6) {
  border-radius: 0;
}

/* Diagram styling */
.vp-doc img {
  border: var(--border-diagram) solid var(--color-diagram-stroke);
  background-color: var(--color-bg-secondary);
  padding: var(--spacing-block);
}

/* Code blocks */
.vp-doc div[class*='language-'] {
  background-color: var(--color-bg-secondary);
  border: var(--border-thin) solid var(--color-bg-tertiary);
  border-radius: 0;
}
```

---

## 7. Typography Implementation

### 7.1 Font Loading (Astro)

Fonts are loaded via Google Fonts CDN in the Layout component:

```astro
---
// src/layouts/Layout.astro
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Preconnect for performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Load fonts -->
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@600&family=Inter:wght@400&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
  </head>
  <body>
    <slot />
  </body>
</html>
```

**Fonts used:**
- **IBM Plex Serif 600** — Headings
- **Inter 400** — Body text
- **JetBrains Mono 400** — Code/monospace

**Alternative (self-hosted for maximum control):**

```
public/
└── fonts/
    ├── ibm-plex-serif-600.woff2
    ├── inter-400.woff2
    └── jetbrains-mono-400.woff2
```

```css
/* src/styles/fonts.css */
@font-face {
  font-family: 'IBM Plex Serif';
  src: url('/fonts/ibm-plex-serif-600.woff2') format('woff2');
  font-weight: 600;
  font-display: swap;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-400.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/jetbrains-mono-400.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```

### 7.2 Font Loading (VitePress)

```typescript
// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Font loading handled via Google Fonts CDN
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@600&family=Inter:wght@400&family=JetBrains+Mono:wght@400&display=swap'
    document.head.appendChild(link)
  }
}
```

---

## 8. Deployment Strategy

### 8.1 Vercel Configuration

**Landing (rigor.dev):**

```json
{
  "buildCommand": "npm run build --filter=web",
  "outputDirectory": "apps/web/dist",
  "installCommand": "npm install",
  "framework": "astro"
}
```

**Astro config for static output:**

```javascript
// apps/web/astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',  // Static HTML output
  integrations: [tailwind()],
  site: 'https://rigor.dev',
});
```

**Docs (docs.rigor.dev):**

```json
{
  "buildCommand": "cd apps/docs && npm run build",
  "outputDirectory": "apps/docs/.vitepress/dist",
  "installCommand": "npm install"
}
```

### 8.2 Domain Configuration

```
rigor.dev           → Vercel project: rigor-web
docs.rigor.dev      → Vercel project: rigor-docs
```

### 8.3 Build Pipeline (Turborepo)

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "out/**", ".vitepress/dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

---

## 9. Performance Requirements

### 9.1 Metrics Targets

| Metric | Target | Rationale |
|--------|--------|-----------|
| First Contentful Paint | < 0.8s | Immediate authority (Astro = no hydration delay) |
| Largest Contentful Paint | < 1.2s | Pure HTML = instant render |
| Cumulative Layout Shift | < 0.05 | Stability = determinism (no client-side framework shifts) |
| Time to Interactive | < 1.0s | No JavaScript = instant interaction |
| Total JavaScript | 0 KB | Zero JS by default (Astro philosophy) |

**Astro Performance Advantages:**
- No hydration waterfall
- No framework runtime overhead
- Pure HTML/CSS output
- Optimal lighthouse scores by default

### 9.2 Optimization Strategies

**Image Optimization:**
- SVG diagrams only (no raster images)
- Inline critical SVGs
- Lazy load below-fold diagrams

**Font Optimization:**
- Preconnect to Google Fonts
- Font display: swap
- Subset to Latin only

**JavaScript:**
- **Zero client-side JavaScript** (Astro default)
- All interactivity via HTML/CSS (if needed)
- No runtime framework code

**CSS:**
- Scoped styles per component
- Critical CSS automatically inlined
- Unused CSS automatically removed
- Design tokens compiled at build time

---

## 10. SEO Strategy

### 10.1 Meta Tags (Landing)

```astro
---
// src/layouts/Layout.astro
interface Props {
  title?: string;
  description?: string;
}

const { 
  title = 'RIGOR — AI Constraint Protocol',
  description = 'Formal boundaries for AI-generated systems. Structural constraint protocol for deterministic evolution.'
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Primary Meta Tags -->
    <title>{title}</title>
    <meta name="title" content={title} />
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:site_name" content="RIGOR" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content={canonicalURL} />
    <meta property="twitter:title" content={title} />
    <meta property="twitter:description" content={description} />
    
    <!-- Keywords -->
    <meta name="keywords" content="AI, constraint, protocol, deterministic, formal specification, bounded execution" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

### 10.2 Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  "name": "RIGOR",
  "description": "AI Constraint Protocol for formal boundaries in AI-generated systems",
  "url": "https://rigor.dev",
  "programmingLanguage": "YAML",
  "runtimePlatform": "Protocol"
}
```

---

## 11. Content Strategy

### 11.1 Landing Page Content Map

```
Section 1: Hero
- RIGOR
- AI Constraint Protocol
- Formal boundaries for AI-generated systems
- CTA: Access Specification

Section 2: Structural Condition
- "AI systems increase generation velocity beyond human structural oversight capacity."
- Define: Generation throughput > Validation throughput
- Result: Structural entropy

Section 3: Structural Entropy (Definition)
- Formal definition
- Manifestation conditions
- Cumulative nature
- RIGOR as entropy-reduction protocol

Section 4: Protocol Model (Diagram)
- Human Intent → Rigor Specification → AI Generation → Validation → Execution
- Five normative components listed

Section 5: Core Invariants
- Explicitness
- Determinism
- Classified Evolution
- Validation Before Execution
- Separation of Layers

Section 6: Structural Positioning
- Table: RIGOR vs Adjacent Systems
  - Temporal/Step Functions (Orchestration)
  - Terraform (IaC)
  - Static Analysis
  - DSLs
- Non-overlap explanation

Section 7: Conceptual Territory
- Pre-Execution Structural Protocol
- AI Structural Boundedness
- Deterministic Evolution Governance
- Version-Typed Process Contracts
- Structural Entropy Reduction

Section 8: Protocol vs Prompt Engineering
- Comparison table
- Prescriptive vs Descriptive
- Bounded vs Probabilistic

Section 9: Specification Access
- Link to docs.rigor.dev
- "Normative documentation available"

Section 10: Footer
- Minimal
- Link to GitHub
- Specification version
```

### 11.2 Tone Enforcement Checklist

Before publishing any content, verify:

✓ No emotional adjectives  
✓ No marketing superlatives  
✓ No exclamation marks  
✓ Declarative sentences  
✓ Structural vocabulary only  
✓ Follows pattern: Condition → Principle → Guarantee  
✓ No hype-based claims  

---

## 12. Accessibility Requirements

### 12.1 WCAG 2.1 AA Compliance

**Color Contrast:**
- Text on #0A0A0A background: #F2F2F2 (16.8:1 contrast) ✓
- Accent #1E3A8A on #0A0A0A: (7.1:1 contrast) ✓

**Keyboard Navigation:**
- All interactive elements focusable
- Focus indicators visible (accent color border)
- Logical tab order

**Semantic HTML:**
- Proper heading hierarchy (h1 → h2 → h3)
- Landmark regions (main, nav, footer)
- Alt text for all diagrams

**Screen Reader:**
- Descriptive link text (no "click here")
- ARIA labels where needed
- Skip to content link

---

## 13. Security Considerations

### 13.1 Static Site Benefits

- No authentication = no credential storage
- No database = no SQL injection
- No API endpoints = no API attacks
- No user input = no XSS vectors

### 13.2 Headers

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}
```

---

## 14. Maintenance & Evolution

### 14.1 Version Control

```
main          → Production-ready code
develop       → Integration branch
feature/*     → Feature branches
```

### 14.2 Release Process

1. Update specification version in docs
2. Update changelog
3. Build and test locally
4. Merge to main
5. Vercel auto-deploys
6. Verify in production

### 14.3 Content Updates

**Specification Changes:**
- Edit markdown files in `apps/docs/specification/`
- VitePress rebuilds automatically
- Deploy via Vercel

**Landing Updates:**
- Edit React components in `apps/web/components/`
- Test locally with `npm run dev`
- Deploy via Vercel

### 14.4 Design Token Updates

If design tokens change:

1. Update `packages/design-tokens/tokens.json`
2. Regenerate CSS variables
3. Rebuild both apps
4. Visual regression testing

---

## 15. Monitoring & Analytics

### 15.1 Performance Monitoring

- Vercel Analytics (built-in)
- Core Web Vitals tracking
- Error logging (Vercel)

### 15.2 Analytics (Optional)

If analytics are needed:
- Use privacy-focused solution (Plausible, Fathom)
- No tracking cookies
- No personal data collection
- Aggregate metrics only

**Rationale:** RIGOR is a protocol, not a product. Conversion tracking is unnecessary.

---

## 16. Testing Strategy

### 16.1 Visual Regression

- Percy.io or Chromatic
- Test critical pages
- Verify design token changes

### 16.2 Accessibility Testing

- axe DevTools
- Lighthouse CI
- Manual keyboard navigation

### 16.3 Performance Testing

- Lighthouse CI in GitHub Actions
- Fail build if metrics degrade

---

## 17. Documentation for Developers

### 17.1 Getting Started

```bash
# Clone repo
git clone https://github.com/rigor/rigor.git
cd rigor

# Install dependencies
npm install

# Run both apps in dev mode
npm run dev

# Or run individually
npm run dev:web   # Landing only
npm run dev:docs  # Docs only

# Access sites
# Landing: http://localhost:4321
# Docs:    http://localhost:5173
```

### 17.2 Common Tasks

**Add new component to landing:**
```bash
cd apps/web/src/components
touch NewComponent.astro

# Example component structure:
# ---
# // Build-time JavaScript
# const data = "something";
# ---
# 
# <!-- HTML template -->
# <div>{data}</div>
# 
# <style>
#   /* Scoped CSS */
# </style>
```

**Add new page:**
```bash
cd apps/web/src/pages
touch new-page.astro

# Astro automatically creates route from filename
# new-page.astro → /new-page
```

**Add new doc page:**
```bash
cd apps/docs/specification
touch new-page.md
# Add to sidebar in .vitepress/config.ts
```

**Update design tokens:**
```bash
cd packages/design-tokens
# Edit tokens.json
# Tokens auto-propagate to both apps
```

---

## 18. Conclusion

This architecture embodies RIGOR identity:

✓ **Deterministic** — Astro generates pure HTML/CSS, zero runtime surprises  
✓ **Bounded** — Zero JavaScript = zero runtime behavior  
✓ **Explicit** — What you write in .astro is what gets generated  
✓ **Validated** — Type-safe, tested, accessible  
✓ **Separated** — Landing ≠ Docs, concerns isolated  
✓ **Minimal** — No framework overhead, no hydration complexity

**Philosophical Alignment:**

Astro embodies constraint:
- Components compile away (no runtime overhead)
- JavaScript is opt-in, not default
- Output is pure, deterministic HTML
- Build process is transparent and predictable

The system is:
- Simple to maintain (Astro is easier than React)
- Extremely fast (zero JS = instant load)
- Aligned with protocol philosophy
- Scalable to future needs

**Astro vs React Trade-off:**

We chose determinism over ecosystem size.
We chose bounded execution over framework familiarity.
We chose structural purity over developer convenience.

This is aligned with RIGOR's core proposition:
> "Generation requires boundaries."

---

**End of Document**