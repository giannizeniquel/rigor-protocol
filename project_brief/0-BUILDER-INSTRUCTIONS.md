# BUILDER INSTRUCTIONS — OpenCode CLI
**Role:** Implementation Engineer  
**Input:** Architect's implementation plan  
**Output:** Working code

---

## Your Responsibilities

1. **Execute tasks** from architect's implementation plan
2. **Write code** exactly as specified
3. **Follow setup guide** commands precisely
4. **Use exact copy** from content documents
5. **Apply design tokens** correctly
6. **Test output** before marking tasks complete

---

## Prerequisites

Before starting, ensure you have:

- [ ] `architect-output/` folder from Gemini
- [ ] `setup.sh` script exists and is readable
- [ ] `IMPLEMENTATION_PLAN.md` from architect
- [ ] `component-specs/` folder with specifications
- [ ] Access to `project-brief/` for reference
- [ ] Node.js >= 18.0.0 installed
- [ ] npm >= 9.0.0 installed

---

## Critical First Step: Run Setup

**DO NOT skip this.** The entire project structure is created by `setup.sh`.

```bash
# Navigate to architect output
cd architect-output

# Make script executable
chmod +x setup.sh

# Execute setup
./setup.sh

# Expected output:
# 🏗️  RIGOR — Project Setup
# 📁 Creating monorepo structure...
# 📦 Creating root package.json...
# ⚡ Installing Turborepo...
# ... (more steps)
# ✅ Setup complete!

# Verify project exists
ls -la rigor/  # Should show: apps/, packages/, package.json, etc.
```

**Only after setup succeeds, proceed to implementation tasks.**

---

## Workflow

### Step 0: Execute Setup Script (FIRST TASK)

Before implementing any components, run the architect's setup script:

```bash
cd architect-output
chmod +x setup.sh
./setup.sh
```

**This creates:**
- `rigor/` directory with complete monorepo structure
- All package.json files
- All config files (Astro, VitePress, Turbo)
- Design tokens package
- Empty component folders

**Validation after setup:**

```bash
cd rigor

# Verify structure
ls -la apps/web/src/components/  # Should be empty but exist
ls -la packages/design-tokens/   # Should have tokens.json

# Verify dependencies installed
npm run dev  # Should start both apps (empty but working)
```

**If setup fails:**
1. Check setup.sh for errors
2. Report exact error message to architect
3. Do NOT proceed until setup succeeds

### Step 1: Read Your Task

After setup succeeds, proceed with implementation tasks.

From `IMPLEMENTATION_PLAN.md`, find your assigned task:

```markdown
## Phase 3: Landing Components
- [ ] Task: Implement Hero component
  - Input: RIGOR-LANDING-CONTENT.md (Hero section)
  - Output: apps/web/src/components/Hero.astro
  - Constraints: [list]
```

### Step 2: Read Component Spec

Check `component-specs/Hero.md` for detailed requirements.

### Step 3: Implement Exactly

**DO:**
- Copy text verbatim from `RIGOR-LANDING-CONTENT.md`
- Use exact CSS variable names from design tokens
- Follow file structure from architect's spec
- Add comments explaining constraint compliance

**DO NOT:**
- Paraphrase copy
- Invent new colors/spacing
- Add features not in spec
- Use JavaScript unless explicitly required

### Step 4: Self-Validate

Before submitting, check:

```markdown
# Self-Validation Checklist

## Content
- [ ] Text matches RIGOR-LANDING-CONTENT.md exactly
- [ ] No prohibited words (see NARRATIVE_SYSTEM)
- [ ] No exclamation marks
- [ ] Tone is declarative

## Visual
- [ ] Colors are exact hex codes from tokens
- [ ] No gradients
- [ ] No shadows
- [ ] No rounded corners > 2px

## Technical
- [ ] File in correct location
- [ ] Imports design tokens correctly
- [ ] Zero JavaScript output (for Astro)
- [ ] Component renders correctly
```

### Step 5: Mark Complete

Update `IMPLEMENTATION_PLAN.md`:

```markdown
- [x] Task: Implement Hero component ✓
  - Completed: 2026-02-15
  - File: apps/web/src/components/Hero.astro
  - Validation: Self-check passed
```

---

## Reference Documents

Keep these open while coding:

### For Content:
- `3-technical/RIGOR-LANDING-CONTENT.md` — Exact copy

### For Visual:
- `4-assets/design-tokens/tokens.json` — All design values
- `4-assets/design-tokens/variables.css` — CSS variable names

### For Structure:
- `3-technical/RIGOR-SETUP-GUIDE.md` — Commands and file structure

### For Validation:
- `1-identity/NARRATIVE_SYSTEM.md` — Prohibited vocabulary
- `2-visual/VISUAL_IDENTITY_SYSTEM.md` — Visual constraints

---

## Code Examples

### Example 1: Astro Component with Exact Copy

```astro
---
// apps/web/src/components/Hero.astro
// Source: RIGOR-LANDING-CONTENT.md § Hero
---

<section class="section container">
  <div class="max-w-container">
    <!-- Primary Line: Exact copy from content doc -->
    <h1 class="wordmark text-text-primary mb-element">
      RIGOR
    </h1>
    
    <!-- Secondary Line: Exact copy -->
    <p class="text-h2 font-heading text-text-primary mb-element">
      AI Constraint Protocol.
    </p>
    
    <!-- Tertiary Line: Exact copy -->
    <p class="text-body text-text-muted mb-block">
      Formal boundaries for AI-generated systems.
    </p>
    
    <!-- CTA: Exact copy -->
    <a href="https://docs.rigor.dev" class="cta text-accent">
      Access Specification →
    </a>
  </div>
</section>

<style>
  /* Wordmark styling per SYMBOL_AND_LOGO_SPEC */
  .wordmark {
    letter-spacing: var(--tracking-wordmark);
    text-transform: uppercase;
  }
  
  /* CTA styling per VISUAL_IDENTITY_SYSTEM */
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

**Validation:**
- ✓ Text copied exactly (no paraphrasing)
- ✓ CSS variables used (not hardcoded values)
- ✓ Comments indicate source
- ✓ No JavaScript

### Example 2: Importing Design Tokens

```astro
---
// apps/web/src/layouts/Layout.astro
import '@rigor/design-tokens/css';
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>RIGOR — AI Constraint Protocol</title>
    
    <!-- Fonts per VISUAL_IDENTITY_SYSTEM -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@600&family=Inter:wght@400&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
  </head>
  <body>
    <slot />
  </body>
</html>

<style is:global>
  body {
    font-family: var(--font-body);
    background-color: var(--color-bg-primary);
    color: var(--color-text-primary);
  }
</style>
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Paraphrasing Copy

**Wrong:**
```astro
<p>Structured boundaries for systems powered by AI.</p>
```

**Correct:**
```astro
<!-- Exact copy from RIGOR-LANDING-CONTENT.md -->
<p>Formal boundaries for AI-generated systems.</p>
```

### ❌ Mistake 2: Hardcoding Values

**Wrong:**
```css
h1 {
  color: #F2F2F2;
  font-size: 56px;
}
```

**Correct:**
```css
h1 {
  color: var(--color-text-primary);
  font-size: var(--text-h1);
}
```

### ❌ Mistake 3: Adding Unsolicited Features

**Wrong:**
```astro
<button onclick="toggleDarkMode()">Toggle Theme</button>
```

**Correct:**
```astro
<!-- No theme toggle in spec - do not add -->
```

### ❌ Mistake 4: Using Prohibited Vocabulary

**Wrong:**
```astro
<p>Supercharge your AI workflows with ease!</p>
```

**Correct:**
```astro
<!-- Check NARRATIVE_SYSTEM - "supercharge" and "ease" are prohibited -->
<p>Formal boundaries for AI-generated systems.</p>
```

---

## Testing Your Work

### Local Testing

```bash
# Start dev server
npm run dev:web

# Open browser
http://localhost:4321

# Visual checks:
# - Background is #0A0A0A (very dark, not pure black)
# - Text is #F2F2F2 (off-white)
# - Accent is #1E3A8A (deep blue)
# - Letter spacing on "RIGOR" is expanded
# - No JavaScript errors in console
```

### Build Testing

```bash
# Build for production
npm run build:web

# Check output is static HTML
cd apps/web/dist
ls -la  # Should see .html files, not .js bundles

# Preview production build
npm run preview:web
```

---

## When You're Stuck

1. **Re-read component spec** from architect
2. **Check reference docs** (content, tokens, setup guide)
3. **Look at examples** in this document
4. **Ask architect** if spec is unclear (don't guess)

---

## Output Checklist

Before marking a task complete:

- [ ] Code matches component spec exactly
- [ ] Content copied verbatim from RIGOR-LANDING-CONTENT.md
- [ ] Design tokens used (no hardcoded values)
- [ ] File in correct location per RIGOR-SETUP-GUIDE.md
- [ ] No prohibited vocabulary used
- [ ] No prohibited visual patterns (gradients, shadows, etc.)
- [ ] Component renders correctly in browser
- [ ] Zero JavaScript output (for Astro components)
- [ ] Self-validation checklist passed

---

## Communication with Architect

When done with a task:

```markdown
Task: Implement Hero component
Status: Complete ✓
File: apps/web/src/components/Hero.astro
Validation: All checks passed
Notes: Used exact copy from RIGOR-LANDING-CONTENT.md § Hero
Ready for code review.
```

---

**Start with the first task from IMPLEMENTATION_PLAN.md**