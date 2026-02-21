# Testing Agent - RIGOR Project

## Overview

This document contains the testing infrastructure created for the RIGOR project.

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test Suites
```bash
# E2E tests
npm run test:e2e

# Visual regression tests
npm run test:visual

# Accessibility tests
npm run test:accessibility
```

### Update Visual Baselines
When making visual changes, update baselines with:
```bash
npm run test:visual:update
```

## Test Structure

```
tests/
├── e2e/
│   ├── navigation.spec.ts    # Navigation and link tests
│   └── content.spec.ts       # Content verification
├── accessibility/
│   └── accessibility.spec.ts # Axe-core accessibility tests
└── visual/
    ├── visual.spec.ts        # Visual regression tests
    └── visual-identity.spec.ts # Visual identity verification
```

## Configuration

- Playwright: `playwright.config.ts`
- Lighthouse: `lighthouserc.json`

## Notes

- Tests run against `http://localhost:4321` by default
- Use `BASE_URL` environment variable to test different environments
- Visual baselines are stored in `tests/visual/visual.spec.ts-snapshots/`
