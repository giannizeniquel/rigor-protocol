## Hero Component Spec

**File:** `apps/web/src/components/Hero.astro`

**Props:** None (static content)

**Content Sources:**
- Heading: RIGOR-LANDING-CONTENT.md § Hero > Primary Line
- Subheading: RIGOR-LANDING-CONTENT.md § Hero > Secondary Line
- Tertiary Line: RIGOR-LANDING-CONTENT.md § Hero > Tertiary Line
- CTA: RIGOR-LANDING-CONTENT.md § Hero > CTA

**Visual Constraints:**
- Typography: `font-heading` for H1/H2, `font-body` for tertiary line.
- Letter spacing: `wordmark` for H1.
- Color: `text` for primary text, `text-muted` for tertiary line, `accent` for CTA.
- No JavaScript output.

**Validation Checklist:**
- [ ] Exact copy from content doc.
- [ ] Correct CSS variables used for colors and fonts.
- [ ] CTA links to `https://docs.rigor.dev`.
- [ ] No prohibited vocabulary.
