# RIGOR — UI/UX Redesign Documentation v1.1

## 🎯 Design Vision: "Structural Boundedness"
The redesign transitions from a generic technical look to a proprietary visual language that reflects the protocol's core mission: **constraining structural possibility**. The aesthetic is monochromatic, high-contrast, and strictly industrial.

---

## 🎨 Global Design System (Monorepo)

### 1. Color Palette (Monochromatic + Single Accent)
- **Deep Black (#0A0A0A):** Primary background. Represents the void before constraint.
- **Structural Gray (#1C1C1C):** Secondary surfaces and containers.
- **Technical Gray (#2A2A2A):** Dividers, borders, and inactive UI elements.
- **Controlled White (#F2F2F2):** Primary text and structural strokes.
- **Deep Blue (#1E3A8A):** The ONLY accent color. Used exclusively for **Structural Invariants** and **Constraint Layers**.

### 📐 2. Structural Rules
- **Border Radius:** `0px` (Strict). No rounded corners allowed. Every element must feel architectural and rigid.
- **Borders:** `1px` or `1.5px` (Thin). Used to define boundaries without adding visual weight.
- **Shadows:** `None`. Depth is created through layer colors (`#0A0A0A` vs `#1C1C1C`), not through artificial shadows.

### 🔡 3. Typography Pairings
- **Brand & Headings:** `Space Grotesk`. A modern, geometric sans-serif that balances technical precision with institutional clarity.
- **Documentation Body:** `IBM Plex Sans`. Chosen for its high legibility in long-form technical specifications.
- **Labels & Metadata:** `JetBrains Mono`. Used for all "System Metadata" (Fig labels, versions, nav links).

---

## 🚀 Landing Page Redesign (`apps/web`)

### 1. Hero Section (Structural Impact)
- **Layout:** Shifted to a 2-column asymmetric grid.
- **Visual:** Introduced "FIG. 01 — Architectural Position", a live SVG diagram that illustrates the protocol's flow from Human Intent to Execution.
- **Branding:** The wordmark "RIGOR" is now set in `Space Grotesk` with `0.12em` tracking, achieving a monumental presence.
- **UX:** Clear primary CTA to "Access Specification" with a single-line underline style.

### 2. Information Architecture
- Sections are now separated by `1px` borders (`#2A2A2A`) instead of whitespace alone.
- Labels are prefixed with monospace "FIG." tags to treat the marketing site as a technical document.

### 3. Header & Navigation
- **Sticky Blur:** Background uses `rgba(10, 10, 10, 0.9)` with `backdrop-filter: blur(8px)`.
- **Language Switcher:** Redesigned as a discrete bordered box in the top right.

---

## 📚 Documentation Redesign (`apps/docs`)

### 1. Unified Theme
- Created a custom VitePress theme (`custom.css`) that maps internal VitePress variables to the RIGOR Design System.
- Eliminated all default VitePress border-radii and blue gradients.

### 2. Sidebar & Navigation
- Group titles in the sidebar use monospace, uppercase, and extra tracking for a "Registry" feel.
- Active items are marked by a `2px Deep Blue` left border, reinforcing the "Constraint" theme.

### 3. Technical Content Styling
- **Tables:** Redesigned to look like formal registries with gray headers and monospace labels.
- **Code Blocks:** Background changed to `#1C1C1C` with a `Deep Blue` left border to distinguish code from general content.
- **Blockquotes:** Styled as "Normative Notes" with a blue accent bar.

---

## ✅ UX Improvements
- **Contextual i18n:** Navigation between Landing and Docs now preserves the language state via explicit `/es/` routing.
- **Readability:** Content width in documentation is capped at `720px` to optimize the line length for technical reading.
- **High Signal/Noise:** Removed all decorative elements, gradients, and icons that don't serve a structural purpose.

---
**Status:** IMPLEMENTED AND VERIFIED.
**Authority:** Gemini CLI (Architect)
