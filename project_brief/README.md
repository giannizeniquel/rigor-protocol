# RIGOR — Project Brief for AI Team

**Version:** 1.1  
**Date:** 2026-02-15  
**Target:** Gemini CLI (Architect) + OpenCode CLI (Builders)

---

## Two-Agent Workflow

This project uses **separation of responsibilities**:

```
Gemini CLI (Architect)
    ↓ creates implementation plan
OpenCode CLI (Builders)
    ↓ executes code
Gemini CLI (Architect)
    ↓ reviews code
```

---

## Quick Start

### Step 1: Architect Plans & Generates Setup (Gemini CLI)

```bash
gemini-cli --context project-brief/ \
           --read 0-ARCHITECT-INSTRUCTIONS.md \
           --output architect-output/
```

**Gemini creates:**
- `setup.sh` — Executable script to create project structure
- `templates/` — All config files
- `IMPLEMENTATION_PLAN.md` — Task breakdown
- `component-specs/` — Component specifications
- `CODE_REVIEW_CHECKLIST.md` — Validation rules

### Step 2: Builder Executes Setup (OpenCode CLI)

```bash
cd architect-output
chmod +x setup.sh
./setup.sh
```

**This creates:**
- `rigor/` — Complete monorepo with:
  - apps/web (Astro)
  - apps/docs (VitePress)
  - packages/design-tokens
  - All config files
  - Dependencies installed

**Verify:**
```bash
cd rigor
npm run dev
# Landing: http://localhost:4321 (placeholder)
# Docs: http://localhost:5173 (working)
```

### Step 3: Builder Implements Components (OpenCode CLI)

```bash
opencode-cli --context architect-output/ \
             --plan IMPLEMENTATION_PLAN.md \
             --codebase rigor/ \
             --instructions ../project-brief/0-BUILDER-INSTRUCTIONS.md
```

**Builders create:**
- All landing page components
- All documentation content
- Styling and layouts

### Step 4: Architect Reviews (Gemini CLI)

```bash
gemini-cli --review rigor/ \
           --checklist architect-output/CODE_REVIEW_CHECKLIST.md
```

**Gemini validates:**
- Visual identity compliance
- Narrative compliance
- Technical compliance
- Outputs approval or requests revisions

---

## Folder Structure

```
project-brief/
├── 0-START-HERE.md                    # ⭐ AI READS THIS FIRST
│
├── 1-identity/                        # 🟡 PENDING: Add your PDF→MD conversions
│   └── README.md                      # Instructions on what's needed
│
├── 2-visual/                          # 🟡 PENDING: Add visual identity docs
│   └── README.md                      # Instructions on what's needed
│
├── 3-technical/                       # ✅ COMPLETE
│   ├── RIGOR-TECHNICAL-ARCHITECTURE.md
│   ├── RIGOR-LANDING-CONTENT.md       # Exact copy for all sections
│   └── RIGOR-SETUP-GUIDE.md           # Step-by-step commands
│
├── 4-assets/                          # ✅ COMPLETE (with placeholders)
│   ├── design-tokens/
│   │   ├── tokens.json
│   │   ├── variables.css
│   │   └── tailwind-preset.js
│   └── diagrams/
│       ├── protocol-flow-placeholder.svg
│       └── logo-rigor-placeholder.svg
│
└── 5-specifications/                  # 🟢 PARTIAL: Add remaining specs
    ├── README.md                      # Instructions on what's needed
    └── SPEC_REFERENCE.md              # ✅ Already included
```

---

## Status Summary

### ✅ Ready to Use:
- Technical architecture (Astro + VitePress)
- Landing page content (exact copy)
- Setup guide (executable commands)
- Design tokens (colors, typography, spacing)
- Placeholder SVGs (logo, diagrams)
- One specification file (SPEC_REFERENCE)

### 🟡 Needs Your Input:
- Identity documents (6 files) — See `1-identity/README.md`
- Visual identity documents (2 files) — See `2-visual/README.md`
- Additional specification files (2 files) — See `5-specifications/README.md`

---

## How to Complete

### Step 1: Convert PDFs to Markdown

You have these PDFs that need to be converted:

**Identity:**
- `MASTER_IMPLEMENTATION_PROMPT` (your original)
- `1_-_IDENTITY_CORE-V0_1.pdf`
- `2_-_AI_CONSTRAINT_PROTOCOL_MODEL-V0_1.pdf`
- `3_-_AI_CONSTRAINT_PROTOCOL_OVERVIEW-V0_1.pdf`
- `5_-_DIFFERENTIATION_AND_POSITIONING.pdf`
- `6_-_NARRATIVE_SYSTEM-V0_1.pdf`

**Visual:**
- `8_-_SYMBOL_AND_LOGO_SPEC-V0_1.pdf`
- `9_-_VISUAL_IDENTITY_SYSTEM-V0_1.pdf`

**Specifications:**
- `1_-_spec-core-v0_1.pdf`
- `3_-_spec-appendix-v0_1.pdf`

**Use this prompt with Claude or similar:**
```
Extract all text from this PDF and format as clean Markdown.
Preserve all headings, lists, and structure.
Use ## for main sections, ### for subsections.
Save as [FILENAME].md
```

### Step 2: Place Files in Correct Folders

```bash
# Identity documents go here:
project-brief/1-identity/

# Visual documents go here:
project-brief/2-visual/

# Specification documents go here:
project-brief/5-specifications/
```

### Step 3: Give to Your AI Architect

Once complete, give your AI CLI tool:

```bash
# Option A: Point to folder
cursor /path/to/project-brief

# Option B: Provide as context
aider --read project-brief/**/*.md

# Option C: Drag folder into Claude Code
# (if using visual interface)
```

**Critical:** Make sure the AI reads `0-START-HERE.md` first.

---

## What the AI Will Do

1. Read all documentation in order
2. Create monorepo structure
3. Set up Astro landing site
4. Set up VitePress docs site
5. Implement all components
6. Apply design tokens
7. Validate output (zero JS, correct colors, etc.)

---

## Expected Timeline

- **With complete documentation:** 2-4 hours
- **With missing files:** Will pause and ask for them

---

## Support

If the AI gets stuck, check:

1. Did it read `0-START-HERE.md` first?
2. Are all identity/visual docs present?
3. Did it validate against NARRATIVE_SYSTEM prohibited vocabulary?
4. Did it apply exact colors from VISUAL_IDENTITY_SYSTEM?

---

## Final Output

When complete, you'll have:

```
rigor/                                 # Your actual project
├── apps/
│   ├── web/                           # → rigor.dev
│   └── docs/                          # → docs.rigor.dev
└── packages/
    └── design-tokens/
```

Running locally at:
- Landing: http://localhost:4321
- Docs: http://localhost:5173

Ready to deploy to Vercel.

---

**Questions? Re-read `0-START-HERE.md` — it has the answers.**