# BUILDER INSTRUCTIONS: Hyperlink Revision & Validation

## 🎯 Objective
Review and update all external and internal hyperlinks across the Landing Page (Astro) to ensure they point to the correct production-ready URLs and respect the i18n context.

## 🛠️ Phase 1: Global URL Updates
The following base URLs must be updated globally in all components:

1.  **Documentation Link:**
    - **Old:** `https://docs.rigor.dev`
    - **New:** `https://rigor-docs.pages.dev`
    - **Note:** Maintain the `/es/` suffix for Spanish versions when applicable.

2.  **GitHub Link:**
    - **Old:** `https://github.com/rigor`
    - **New:** `https://github.com/giannizeniquel/rigor-protocol`

3.  **Main Domain (if used in hardcoded strings):**
    - **Old:** `https://rigor.dev`
    - **New:** `https://rigor-protocol.pages.dev`

## 📂 Phase 2: Component-Specific Fixes

### 1. Header (`apps/web/src/components/Header.astro`)
- **Brand Link:** Ensure it points to `{lang === 'es' ? '/es/' : '/'}`.
- **Home Link:** Ensure it points to `{lang === 'es' ? '/es/' : '/'}`.
- **Docs Link:**
  - English: `https://rigor-docs.pages.dev/`
  - Spanish: `https://rigor-docs.pages.dev/es/`
- **Language Switcher:**
  - "ES" button -> `/es/`
  - "EN" button -> `/`

### 2. Hero (`apps/web/src/components/Hero.astro`)
- **CTA Link:** Should point to `https://rigor-docs.pages.dev/` (EN) or `https://rigor-docs.pages.dev/es/` (ES).

### 3. Specification Access (`apps/web/src/components/SpecificationAccess.astro`)
- **CTA Link:** `https://rigor-docs.pages.dev/`
- **GitHub Link:** `https://github.com/giannizeniquel/rigor-protocol`

### 4. Footer (`apps/web/src/components/Footer.astro`)
- **Specification Link:** `https://rigor-docs.pages.dev/`
- **GitHub Link:** `https://github.com/giannizeniquel/rigor-protocol`
- **Language Switcher:** Fix any hardcoded links to ensure they match the Header logic.

### 5. Layout (`apps/web/src/layouts/Layout.astro`)
- **Canonical Link:** Update `https://rigor.dev` to `https://rigor-protocol.pages.dev`.
- **Alternate Links:** Update both `en` and `es` URLs to use the `.pages.dev` domain.
- **OG/Twitter Meta:** Update `og:url` to use the `.pages.dev` domain.

## ✅ Phase 3: Verification
- [ ] Clicking "Docs" from the Spanish landing takes you to the Spanish documentation.
- [ ] Clicking the Brand logo always returns you to the home page of the current language.
- [ ] All GitHub links point to the correct repository.
- [ ] No link points to the non-existent `rigor.dev` or `docs.rigor.dev` domains (until they are officially mapped).
