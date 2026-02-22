# BUILDER INSTRUCTIONS: Icon System Implementation v1

## 🎯 Objective
Integrate the official RIGOR icon set (based on the `[ ]` brackets) and establish the official favicon for both the Landing Page and Documentation.

## 📂 Phase 1: Icon Distribution
Deploy the icon assets from `project_brief/4 - assets/logo/icons/` to the application public directories.

1.  **Landing (apps/web):**
    - Create directory: `apps/web/public/assets/icons/`.
    - Copy ALL `.svg` and `.png` files from `project_brief/4 - assets/logo/icons/` to `apps/web/public/assets/icons/`.
    - **Action:** Copy `rigor-icon-white.svg` to `apps/web/public/favicon.svg` (to satisfy the current link in Layout).

2.  **Docs (apps/docs):**
    - Create directory: `apps/docs/public/assets/icons/`.
    - Copy ALL `.svg` and `.png` files from `project_brief/4 - assets/logo/icons/` to `apps/docs/public/assets/icons/`.
    - **Action:** Copy `rigor-icon-white.svg` to `apps/docs/public/favicon.svg`.

## 🛠️ Phase 2: Implementation & Favicon

1.  **Landing Layout (apps/web/src/layouts/Layout.astro):**
    - Ensure the favicon link is correctly pointing to the new file:
      ```html
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      ```
    - (Optional) Add a PNG fallback for older browsers using `rigor-icon-white.png`.

2.  **Docs Config (apps/docs/.vitepress/config.ts):**
    - Add the favicon to the `head` section:
      ```typescript
      head: [
        ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
      ],
      ```

## 🎨 Phase 3: Usage Guidelines (For future components)
- **Primary Icon:** Use `rigor-icon-white.svg` for dark backgrounds (default).
- **Accent Icon:** Use `rigor-icon-blue.svg` for specific structural callouts.
- **Filled Version:** Use `filled` variants for hover states or active UI elements.

## ✅ Phase 4: Verification
- [ ] Open `rigor-protocol.pages.dev` and verify the favicon appears in the browser tab.
- [ ] Open `rigor-docs.pages.dev` and verify the favicon appears in the browser tab.
- [ ] Verify that all icons are accessible at `/assets/icons/[filename]`.
