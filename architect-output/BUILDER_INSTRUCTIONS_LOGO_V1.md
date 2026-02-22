# BUILDER INSTRUCTIONS: Visual Identity Implementation v1

## 🎯 Objective
Replace current text-based placeholders and generic logos with the official RIGOR v1 assets. This includes updating the typography to **Space Grotesk** and implementing the new logo variants (Default, Minimal, Bold) across the Landing Page and Documentation.

## 📂 Phase 1: Asset Distribution
Deploy the official assets from `project_brief/4 - assets/logo/` to the application public directories.

1.  **Landing (apps/web):**
    - Create directory: `apps/web/public/assets/logo/`.
    - Copy ALL `.svg` and `.png` files from `project_brief/4 - assets/logo/` to `apps/web/public/assets/logo/`.

2.  **Docs (apps/docs):**
    - Create directory (if not exists): `apps/docs/public/`.
    - Copy `rigor-logo-minimal-md.svg` to `apps/docs/public/logo-rigor.svg` (Overwriting the current placeholder).

## 🎨 Phase 2: Design Tokens & Typography

1.  **Update Variables:**
    - File: `packages/design-tokens/css/variables.css`
    - Change `--font-heading` from `IBM Plex Serif` to `'Space Grotesk', 'Inter', sans-serif`.

2.  **Update Global Layout (Landing):**
    - File: `apps/web/src/layouts/Layout.astro`
    - Update the Google Fonts `<link>` to include **Space Grotesk** (weights 400, 600).
    - Maintain `Inter` and `JetBrains Mono` for body and code.

## 🚀 Phase 3: Component Implementation

### 1. Hero Component (Landing)
- File: `apps/web/src/components/Hero.astro`
- **Action:** Replace the `h1.wordmark` text with the **Default Large** SVG logo.
- **Markup:**
  ```html
  <h1 class="hero-logo-container">
    <img 
      src="/assets/logo/rigor-logo-default-lg.svg" 
      alt="RIGOR Protocol" 
      class="hero-logo"
      width="304" 
      height="144"
    />
  </h1>
  ```
- **Styles:** 
  - Ensure `.hero-logo` has a clean alignment.
  - Remove `text-transform: uppercase` and letter-spacing from the logo container as it's now an image.
  - Set `max-width: 100%` and `height: auto`.

### 2. Documentation Header (Docs)
- File: `apps/docs/.vitepress/config.ts`
- Ensure `themeConfig.logo` points to `/logo-rigor.svg` (The minimal variant copied in Phase 1).
- **VitePress Styles:** If the logo appears too small, add a custom CSS override in a VitePress theme file to set a specific height (e.g., `32px`).

## ✅ Phase 4: Verification
- [ ] Confirm `Space Grotesk` is rendering for all headings (`h1`, `h2`, `h3`).
- [ ] Verify the Logo in the Hero has the correct blue-purple gradient (Bold/Default version).
- [ ] Ensure the Doc's logo is the "Minimal" version (Clean black/white).
- [ ] Run `npm run build` in the root to ensure no broken asset paths.

---
**Note:** The logo contains the distinctive `[ ]` brackets for the letter "O". Ensure these are clearly visible and not cropped.
