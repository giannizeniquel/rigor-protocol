# RIGOR Testing Plan

## 1. Purpose
This document outlines the comprehensive strategy for testing the RIGOR web presence, ensuring functional correctness, visual and narrative compliance, technical adherence, accessibility, and performance. The goal is to verify that the implemented solution perfectly embodies the RIGOR identity of structural precision and determinism.

## 2. Testing Principles
*   **Deterministic Validation:** Tests must yield consistent results, reflecting the deterministic nature of the protocol.
*   **Explicit Verification:** All aspects, from content to visual styles, must be explicitly verified against specifications.
*   **Bounded Scope:** Focus on critical functionalities and compliance with established constraints.
*   **Automation First:** Prioritize automated testing where feasible to ensure efficiency and reproducibility.

## 3. Scope of Testing

### 3.1. Functional Compliance
*   **Navigation:** Verify all internal and external links (`https://rigor.dev`, `https://docs.rigor.dev`, GitHub link) are functional and lead to the correct destinations.
*   **CTAs:** Ensure all Call to Action elements (e.g., "Access Specification →") are clickable and perform the expected action (e.g., navigate to docs).

### 3.2. Content Accuracy & Narrative Compliance
*   **Exact Copy:** Verify all text content on the landing page matches `RIGOR-LANDING-CONTENT.md` exactly.
*   **Prohibited Vocabulary:** Scan for and confirm absence of prohibited words (e.g., "fast", "easy", "empower").
*   **Tone & Structure:** Confirm the declarative, non-promotional tone and adherence to the "Definition → Constraint → Mechanism → Outcome → Implication" pattern where applicable.
*   **No Exclamation Marks:** Verify absence of exclamation marks.

### 3.3. Visual Compliance
*   **Color System:** Verify all colors (background, text, accent) match `VISUAL_IDENTITY_SYSTEM.md`'s hex codes exactly.
*   **Typography:** Confirm correct font families, sizes, weights, letter spacing, and line heights are applied as per specification.
*   **Layout & Spacing:** Validate generous spacing, strict grid alignment (12-column), and absence of overlapping/floating elements.
*   **Prohibited Visuals:** Confirm absence of gradients, shadows, rounded corners (>2px), vibrant colors, and decorative illustrations.
*   **Diagrams:** Verify diagrams are monochromatic, have thin line weight, rectangular boundaries, and explicit arrows.

### 3.4. Technical Compliance
*   **Astro Zero JavaScript:** For `apps/web`, confirm the generated HTML contains zero client-side JavaScript.
*   **Design Token Usage:** Verify CSS variables and Tailwind classes correctly apply values from the design tokens package.
*   **File Structure:** Ensure no unexpected files or deviations in the expected project structure.
*   **Meta Tags & SEO:** Confirm correct meta tags, canonical URLs, and structured data are present.

### 3.5. Accessibility (WCAG 2.1 AA)
*   **Color Contrast:** Verify sufficient contrast for text and interactive elements.
*   **Keyboard Navigation:** Test full navigability using keyboard only.
*   **Semantic HTML:** Verify correct use of headings, landmark roles, and alt text for images.
*   **Screen Reader Compatibility:** Basic verification of content readability by screen readers.

### 3.6. Performance (Core Web Vitals)
*   **Metrics:** Monitor First Contentful Paint (FCP), Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and Time to Interactive (TTI) against defined targets.
*   **Optimization:** Verify image optimization (SVG only), font optimization, and minimal JavaScript impact.

## 4. Testing Methodologies and Tools

### 4.1. End-to-End (E2E) Testing
*   **Purpose:** Simulate user interactions across the entire application flow.
*   **Tool:** **Playwright**
    *   **Tasks:**
        *   Navigate to landing page (`rigor.dev`).
        *   Click on all CTAs and verify navigation to `docs.rigor.dev` or GitHub.
        *   Verify main navigation links on both sites.
        *   Check for broken links.

### 4.2. Visual Regression Testing
*   **Purpose:** Catch unintended visual changes that could violate the strict visual identity.
*   **Tool:** **Playwright with visual comparison capabilities** or a dedicated service like **Percy.io / Chromatic**.
    *   **Tasks:**
        *   Capture screenshots of key landing page sections and documentation pages.
        *   Compare against baseline screenshots on every build.
        *   Report visual discrepancies.

### 4.3. Accessibility Testing
*   **Purpose:** Ensure WCAG 2.1 AA compliance.
*   **Tool:** **axe-core (integrated with Playwright)** and **Manual Review**.
    *   **Tasks:**
        *   Automated scans with axe-core on all pages.
        *   Manual keyboard navigation test.
        *   Spot-check semantic HTML and alt text.

### 4.4. Performance Testing
*   **Purpose:** Monitor Core Web Vitals and overall page performance.
*   **Tool:** **Lighthouse CI** (integrated into CI/CD pipeline).
    *   **Tasks:**
        *   Run Lighthouse audits on critical pages (landing page, main doc pages).
        *   Set performance budgets and fail builds if thresholds are exceeded.

### 4.5. Content & Narrative Audit (Manual)
*   **Purpose:** Verify exact copy, tone, and absence of prohibited vocabulary.
*   **Tool:** **Manual inspection** (can be supported by text linting tools if available).
    *   **Tasks:**
        *   Thorough review of all content against `RIGOR-LANDING-CONTENT.md`.
        *   Cross-reference with `NARRATIVE_SYSTEM.md` and `MASTER_IMPLEMENTATION_PROMPT.md` for tone and vocabulary compliance.

## 5. Test Plan Structure (Tasks for Builder Agent)

### Phase 1: Setup Testing Environment
- [ ] Task: Install Playwright and necessary browsers.
- [ ] Task: Configure Playwright for local and CI/CD execution.
- [ ] Task: Integrate axe-core into Playwright tests.
- [ ] Task: Set up Lighthouse CI for performance monitoring.

### Phase 2: Implement E2E Tests
- [ ] Task: Write E2E tests for main navigation and CTAs on `rigor.dev`.
- [ ] Task: Write E2E tests for key navigation on `docs.rigor.dev`.
- [ ] Task: Implement broken link checking across both sites.

### Phase 3: Implement Visual Regression Tests
- [ ] Task: Write visual regression tests for each major component/section on `rigor.dev`.
- [ ] Task: Write visual regression tests for key documentation pages.
- [ ] Task: Establish baseline screenshots.

### Phase 4: Implement Accessibility Tests
- [ ] Task: Integrate automated axe-core checks into E2E test suite.
- [ ] Task: Document manual accessibility review process.

### Phase 5: Implement Performance Monitoring
- [ ] Task: Configure Lighthouse CI with performance budgets.
- [ ] Task: Integrate Lighthouse CI into the build process.

### Phase 6: Content & Narrative Verification
- [ ] Task: Develop a process for manual content audits.
- [ ] Task: (Optional) Research and integrate text linting tools for vocabulary and tone.

## 6. Reporting and Feedback
All test results must be clearly reported. Automated test failures should provide actionable feedback for the builder. Manual audit findings should be documented concisely.

## 7. Iteration and Maintenance
The testing plan is a living document and should evolve with the project. New features and content changes require corresponding updates to the test suite.
