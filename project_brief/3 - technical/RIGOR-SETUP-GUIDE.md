# RIGOR — Setup Guide for Developers
**Version:** 1.0  
**Date:** 2026-02-15

---

## Prerequisites

Before starting, ensure you have:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git**
- Code editor (VS Code recommended)

---

## Initial Setup (First Time)

### Step 1: Create Monorepo Structure

```bash
# Create root directory
mkdir rigor
cd rigor

# Initialize root package.json
npm init -y

# Edit package.json to add workspaces
cat > package.json << 'EOF'
{
  "name": "rigor-monorepo",
  "version": "0.1.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "dev:web": "turbo run dev --filter=web",
    "dev:docs": "turbo run dev --filter=docs"
  }
}
EOF

# Install Turborepo
npm install turbo --save-dev

# Create turbo.json
cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".astro/**", ".vitepress/dist/**"]
    }
  }
}
EOF
```

---

### Step 2: Create Design Tokens Package

```bash
# Create package structure
mkdir -p packages/design-tokens/css

cd packages/design-tokens

# Create package.json
cat > package.json << 'EOF'
{
  "name": "@rigor/design-tokens",
  "version": "0.1.0",
  "private": true,
  "main": "./tokens.json",
  "exports": {
    ".": "./tokens.json",
    "./css": "./css/variables.css",
    "./tailwind": "./tailwind.config.js"
  }
}
EOF
```

**Copy these files into `packages/design-tokens/`:**
- `tokens.json` (from deliverables)
- `css/variables.css` (from deliverables)
- `tailwind.config.js` (from deliverables)

```bash
cd ../..
```

---

### Step 3: Create Astro Landing App

```bash
# Create app directory
mkdir -p apps/web

cd apps/web

# Initialize Astro project
npm create astro@latest . -- --template minimal --no-install --no-git

# Install dependencies
npm install

# Install Tailwind
npx astro add tailwind

# Install design tokens dependency
npm install @rigor/design-tokens@*

# Create directory structure
mkdir -p src/components
mkdir -p src/layouts
mkdir -p src/styles
mkdir -p public/diagrams
```

**Configure Astro:**

```bash
cat > astro.config.mjs << 'EOF'
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
  site: 'https://rigor.dev',
});
EOF
```

**Configure Tailwind:**

```bash
cat > tailwind.config.mjs << 'EOF'
import rigorPreset from '@rigor/design-tokens/tailwind';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  presets: [rigorPreset],
}
EOF
```

**Create package.json scripts:**

```bash
cat > package.json << 'EOF'
{
  "name": "web",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "@rigor/design-tokens": "*",
    "astro": "^4.0.0",
    "@astrojs/tailwind": "^5.0.0",
    "tailwindcss": "^3.4.0"
  }
}
EOF
```

```bash
cd ../..
```

---

### Step 4: Create VitePress Docs App

```bash
# Create app directory
mkdir -p apps/docs

cd apps/docs

# Initialize package.json
cat > package.json << 'EOF'
{
  "name": "docs",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vitepress dev",
    "build": "vitepress build",
    "preview": "vitepress preview"
  },
  "dependencies": {
    "@rigor/design-tokens": "*"
  },
  "devDependencies": {
    "vitepress": "^1.0.0"
  }
}
EOF

# Create directory structure
mkdir -p .vitepress/theme
mkdir -p specification
mkdir -p implementation
mkdir -p examples
mkdir -p public

# Create VitePress config
cat > .vitepress/config.ts << 'EOF'
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'RIGOR',
  description: 'AI Constraint Protocol — Normative Specification',
  
  appearance: 'dark',
  
  themeConfig: {
    logo: '/logo-rigor.svg',
    
    nav: [
      { text: 'rigor.dev', link: 'https://rigor.dev' },
      { text: 'Specification', link: '/specification/identity-core' }
    ],
    
    sidebar: {
      '/specification/': [
        {
          text: 'Protocol Specification',
          items: [
            { text: 'Identity Core', link: '/specification/identity-core' },
            { text: 'Protocol Model', link: '/specification/protocol-model' },
            { text: 'Protocol Overview', link: '/specification/protocol-overview' }
          ]
        }
      ]
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/rigor' }
    ]
  }
})
EOF

# Create theme customization
cat > .vitepress/theme/index.ts << 'EOF'
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default DefaultTheme
EOF

cat > .vitepress/theme/custom.css << 'EOF'
@import '@rigor/design-tokens/css';

:root {
  --vp-c-bg: var(--color-bg-primary);
  --vp-c-bg-alt: var(--color-bg-secondary);
  --vp-c-text-1: var(--color-text-primary);
  --vp-c-text-2: var(--color-text-muted);
  --vp-c-brand-1: var(--color-accent);
  --vp-font-family-base: var(--font-body);
}
EOF

# Create index page
cat > index.md << 'EOF'
---
layout: home

hero:
  name: RIGOR
  text: AI Constraint Protocol
  tagline: Normative Specification
  actions:
    - theme: brand
      text: Read Specification
      link: /specification/identity-core
---
EOF

cd ../..
```

---

### Step 5: Install All Dependencies

```bash
# From root directory
npm install
```

This will install dependencies for all workspaces.

---

## Development Workflow

### Run Both Apps Simultaneously

```bash
npm run dev
```

This starts:
- Landing at `http://localhost:4321`
- Docs at `http://localhost:5173`

### Run Apps Individually

```bash
# Landing only
npm run dev:web

# Docs only
npm run dev:docs
```

---

## Building for Production

### Build All

```bash
npm run build
```

### Build Individually

```bash
# Landing
npm run build --filter=web

# Docs
npm run build --filter=docs
```

**Output locations:**
- Landing: `apps/web/dist/`
- Docs: `apps/docs/.vitepress/dist/`

---

## Project Structure Overview

```
rigor/
├── package.json                     # Root workspace
├── turbo.json                       # Turborepo config
│
├── apps/
│   ├── web/                         # Astro landing
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   └── index.astro
│   │   │   ├── components/
│   │   │   └── layouts/
│   │   ├── public/
│   │   └── astro.config.mjs
│   │
│   └── docs/                        # VitePress docs
│       ├── .vitepress/
│       ├── specification/
│       └── index.md
│
└── packages/
    └── design-tokens/               # Shared tokens
        ├── tokens.json
        ├── css/variables.css
        └── tailwind.config.js
```

---

## Creating Your First Component

### Example: Hero Component

```bash
cd apps/web/src/components
touch Hero.astro
```

**Edit `Hero.astro`:**

```astro
---
// Build-time JavaScript (runs during build)
const title = "RIGOR";
const subtitle = "AI Constraint Protocol.";
const description = "Formal boundaries for AI-generated systems.";
---

<section class="section container">
  <div class="max-w-container">
    <h1 class="wordmark text-text-primary mb-element">
      {title}
    </h1>
    <p class="text-h2 font-heading text-text-primary mb-element">
      {subtitle}
    </p>
    <p class="text-body text-text-muted mb-block">
      {description}
    </p>
    <a href="https://docs.rigor.dev" class="cta text-accent">
      Access Specification →
    </a>
  </div>
</section>

<style>
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

**Use in `src/pages/index.astro`:**

```astro
---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';
---

<Layout>
  <Hero />
</Layout>
```

---

## Troubleshooting

### "Cannot find module '@rigor/design-tokens'"

```bash
# Reinstall from root
cd /path/to/rigor
npm install
```

### Port already in use

```bash
# Change port in package.json scripts
"dev": "astro dev --port 4322"
```

### Turbo cache issues

```bash
# Clear cache
npx turbo run build --force
```

---

## Next Steps

1. Copy content from `RIGOR-LANDING-CONTENT.md` into components
2. Create remaining components (StructuralCondition, ProtocolModel, etc)
3. Add SVG diagrams to `public/diagrams/`
4. Copy specification markdown files to `apps/docs/specification/`
5. Test locally
6. Deploy to Vercel

---

## VS Code Recommended Extensions

- **Astro** (astro-build.astro-vscode)
- **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)
- **Prettier** (esbenp.prettier-vscode)

---

**End of Setup Guide**