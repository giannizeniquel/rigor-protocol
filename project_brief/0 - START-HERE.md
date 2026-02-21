# RIGOR — Project Brief for AI Architect
**Version:** 1.0  
**Date:** 2026-02-15

---

## Purpose

This directory contains all documentation necessary to implement the RIGOR web presence.

You are an AI architect responsible for implementing a landing site and documentation site according to strict specifications.

---

## CRITICAL: Read in This Order

### Phase 1: Understand Identity (MUST READ FIRST)

Read these documents to understand what RIGOR is and how it must communicate:

1. **`1-identity/MASTER_IMPLEMENTATION_PROMPT.md`**
   - Core constraints
   - What RIGOR is NOT
   - Visual and communication restrictions
   - **This is your constitution. Everything else derives from this.**

2. **`1-identity/IDENTITY_CORE.md`**
   - Formal definition of RIGOR
   - Non-negotiable invariants
   - Category definition

3. **`1-identity/NARRATIVE_SYSTEM.md`**
   - How RIGOR communicates
   - Tone rules
   - Prohibited vocabulary
   - **Reference this for ALL copy decisions**

4. **`1-identity/AI_CONSTRAINT_PROTOCOL_MODEL.md`**
   - Conceptual model
   - Architecture position

5. **`1-identity/DIFFERENTIATION_AND_POSITIONING.md`**
   - Strategic positioning
   - What RIGOR is vs adjacent systems

---

### Phase 2: Understand Visual Identity

6. **`2-visual/VISUAL_IDENTITY_SYSTEM.md`**
   - Color palette (EXACT hex codes)
   - Typography system
   - Grid system
   - Prohibited design patterns
   - **This defines how everything looks**

7. **`2-visual/SYMBOL_AND_LOGO_SPEC.md`**
   - Logo rules
   - Wordmark specifications
   - Symbol geometry

---

### Phase 3: Technical Implementation

8. **`3-technical/RIGOR-TECHNICAL-ARCHITECTURE.md`**
   - Complete stack specification
   - Astro + VitePress architecture
   - Component structure
   - Deployment strategy
   - **This is your implementation blueprint**

9. **`3-technical/RIGOR-LANDING-CONTENT.md`**
   - EXACT copy for every section
   - All headlines, body text, CTAs
   - **Copy-paste this text verbatim**

10. **`3-technical/RIGOR-SETUP-GUIDE.md`**
    - Step-by-step setup commands
    - Project structure
    - Development workflow

---

### Phase 4: Assets

11. **`4-assets/design-tokens/`**
    - `tokens.json` — Source of truth for all design values
    - `variables.css` — CSS custom properties
    - `tailwind-preset.js` — Tailwind configuration
    - **Import these, don't recreate**

12. **`4-assets/diagrams/`**
    - SVG diagrams (placeholders for now)
    - Will be replaced with final designs

---

### Phase 5: Documentation Content

13. **`5-specifications/`**
    - Markdown files for docs site
    - Copy directly into `apps/docs/specification/`

---

## Implementation Checklist

Use this to track progress:

### Setup
- [ ] Create monorepo structure
- [ ] Install Turborepo
- [ ] Set up design tokens package
- [ ] Create Astro app (landing)
- [ ] Create VitePress app (docs)
- [ ] Install all dependencies

### Landing Site (rigor.dev)
- [ ] Create Layout component
- [ ] Create Hero component (use exact copy from RIGOR-LANDING-CONTENT.md)
- [ ] Create StructuralCondition component
- [ ] Create ProtocolModel component (with diagram)
- [ ] Create CoreInvariants component
- [ ] Create StructuralPositioning component (with table)
- [ ] Create ConceptualTerritory component
- [ ] Create ProtocolVsPrompt component (with table)
- [ ] Create SpecificationAccess component
- [ ] Create Footer component
- [ ] Apply design tokens consistently
- [ ] Verify zero JavaScript output
- [ ] Test responsive layout
- [ ] Validate accessibility (WCAG AA)

### Documentation Site (docs.rigor.dev)
- [ ] Configure VitePress theme
- [ ] Apply RIGOR design tokens to VitePress
- [ ] Copy specification files
- [ ] Configure sidebar navigation
- [ ] Add logo
- [ ] Test dark theme
- [ ] Verify markdown rendering

### Quality Checks
- [ ] Run Lighthouse (target: 95+ on all metrics)
- [ ] Validate HTML
- [ ] Check color contrast (WCAG AA)
- [ ] Test keyboard navigation
- [ ] Verify no prohibited vocabulary used
- [ ] Confirm zero JavaScript on landing
- [ ] Test on mobile devices

---

## Critical Constraints (DO NOT VIOLATE)

From MASTER_IMPLEMENTATION_PROMPT:

❌ **NO gradients**
❌ **NO rounded corners** (except minimal: 2px max)
❌ **NO drop shadows**
❌ **NO vibrant colors** (only #0A0A0A, #1C1C1C, #2A2A2A, #F2F2F2, #1E3A8A)
❌ **NO marketing language** (see NARRATIVE_SYSTEM for prohibited words)
❌ **NO JavaScript on landing** (Astro generates pure HTML)
❌ **NO decorative illustrations** (only diagrams)

✅ **DO use expanded letter spacing** for wordmark
✅ **DO use strict grid alignment**
✅ **DO use monochromatic diagrams**
✅ **DO use declarative tone**
✅ **DO validate all copy against NARRATIVE_SYSTEM**

---

## Questions to Ask Before Proceeding

1. Have you read MASTER_IMPLEMENTATION_PROMPT completely?
2. Have you read NARRATIVE_SYSTEM and understand prohibited vocabulary?
3. Have you reviewed VISUAL_IDENTITY_SYSTEM for exact colors/typography?
4. Do you understand that RIGOR is a PROTOCOL, not a product?
5. Do you understand the difference between prescriptive (RIGOR) vs descriptive (prompt engineering)?

If you answered NO to any question, re-read the relevant document.

---

## What to Do if Stuck

1. **For identity questions:** Re-read IDENTITY_CORE and MASTER_IMPLEMENTATION_PROMPT
2. **For tone/copy questions:** Check NARRATIVE_SYSTEM prohibited vocabulary
3. **For visual questions:** Reference VISUAL_IDENTITY_SYSTEM exact specifications
4. **For technical questions:** Reference RIGOR-TECHNICAL-ARCHITECTURE
5. **For implementation questions:** Follow RIGOR-SETUP-GUIDE step by step

---

## Expected Output

When complete, you should have:

```
rigor/
├── apps/
│   ├── web/              # Astro landing (rigor.dev)
│   └── docs/             # VitePress docs (docs.rigor.dev)
└── packages/
    └── design-tokens/    # Shared design system
```

Both sites running locally:
- Landing: http://localhost:4321
- Docs: http://localhost:5173

---

## Final Notes

- This is a protocol declaration site, NOT a SaaS marketing site
- Every design decision must align with structural constraint philosophy
- When in doubt, choose restraint over expression
- Validation precedes execution (test before building)

---

**Now read the documents in order and begin implementation.**