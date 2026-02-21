# Code Review Checklist

## Visual Identity Compliance
- [ ] Colors match VISUAL_IDENTITY_SYSTEM exactly
  - Background: #0A0A0A (not #000000)
  - Accent: #1E3A8A (not any other blue)
- [ ] No gradients used
- [ ] No rounded corners > 2px
- [ ] No drop shadows

## Narrative Compliance
- [ ] No prohibited vocabulary (check NARRATIVE_SYSTEM)
- [ ] Tone is declarative, not conversational
- [ ] No exclamation marks

## Technical Compliance
- [ ] Astro generates zero JavaScript
- [ ] Design tokens imported correctly
- [ ] File structure matches TECHNICAL_ARCHITECTURE
