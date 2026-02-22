# BUILDER INSTRUCTIONS: Logo Update v1.1 (Color & Design Rule Correction)

## 🎯 Objective
Replace the previously implemented RIGOR logos with the updated v1.1 versions. These new assets strictly follow the protocol's official color palette and design rules (monochromatic and specific gradients).

## 📂 Phase 1: Asset Replacement (Crucial)
Overwrite the files in the public directories with the new assets from `project_brief/4 - assets/logo/`.

1.  **Landing (apps/web):**
    - Source: `project_brief/4 - assets/logo/`
    - Destination: `apps/web/public/assets/logo/`
    - **Action:** Replace ALL `.svg` and `.png` files. Ensure the old ones are completely overwritten.

2.  **Docs (apps/docs):**
    - Source: `project_brief/4 - assets/logo/rigor-logo-minimal-md.svg`
    - Destination: `apps/docs/public/logo-rigor.svg`
    - **Action:** Replace the existing `logo-rigor.svg` with the new minimal version.

## 🎨 Phase 2: Design Rule Verification

1.  **Monochromatic Check:**
    - The **Minimal** version (used in Docs) should be strictly monochromatic (#F2F2F2 on dark background).
    - The **Default/Bold** versions (used in Landing Hero) should now use the corrected color palette (verify the gradients are according to the new spec).

2.  **Hero Logo (Landing):**
    - File: `apps/web/src/components/Hero.astro`
    - Ensure the `img` tag still points to `/assets/logo/rigor-logo-default-lg.svg`.
    - Verify that no hardcoded CSS colors are overriding the SVG's internal colors.

## ✅ Phase 3: Final Verification
- [ ] Confirm the logo in `rigor.dev` (Landing) shows the corrected colors.
- [ ] Confirm the logo in `docs.rigor.dev` (VitePress) shows the corrected minimal design.
- [ ] Run `npm run build` to ensure the cache is cleared and new assets are correctly bundled.

---
**Warning:** Do not use the previous versions. The current files in `project_brief/4 - assets/logo` are the only valid ones.
