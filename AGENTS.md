# RIGOR Agents - Automation Infrastructure

## Overview

This document describes the autonomous agents created to optimize the RIGOR project workflow. Each agent can execute independently or as part of a pipeline, with auto-fix capabilities.

## Agent Structure

```
agents/
├── testing/          # Testing agents (E2E, Visual, Accessibility)
├── build/           # Build & Quality agents (Build, Lint, Dependencies)
├── performance/     # Performance agents (Lighthouse, Bundle)
└── i18n/            # Internationalization agents (Translation, Consistency)
```

---

## Usage

### Run All Agents
```bash
npm run agent:all
```

### Run Specific Agent Category
```bash
npm run agent:test        # All testing agents
npm run agent:build      # All build agents
npm run agent:perf       # All performance agents
npm run agent:i18n       # All i18n agents
```

---

## Testing Agents

### E2E Tests
```bash
npm run agent:test:e2e
```
Runs end-to-end tests with automatic retry on failure.

### Visual Regression
```bash
# Run tests
npm run agent:test:visual

# Update baselines
npm run agent:test:visual:update
```
Runs visual regression tests. Use `UPDATE_VISUAL=true` to auto-update baselines.

### Accessibility
```bash
npm run agent:test:accessibility
```
Runs axe-core accessibility tests.

---

## Build & Quality Agents

### Build
```bash
npm run agent:build:web      # Build web app only
npm run agent:build:docs     # Build docs only
npm run agent agent:build:all   # Build all packages
```

### Lint
```bash
npm run agent:lint           # Run lint checks
npm run agent:lint:fix       # Run with auto-fix
```
Runs TypeScript checks and linting. Use `AUTO_FIX=true` for automatic fixes.

### Dependencies
```bash
npm run agent:deps
```
Runs npm audit and checks for outdated packages.

---

## Performance Agents

### Lighthouse
```bash
npm run agent:perf:lighthouse
```
Runs Lighthouse audits. Configure via `lighthouserc.json`.

### Bundle Analysis
```bash
npm run agent:perf:bundle
```
Analyzes bundle sizes and detects oversized files (>500KB).

---

## i18n Agents

### Translation Validator
```bash
npm run agent:i18n:translation
```
Checks for missing translations between EN/ES locales.

### Consistency Checker
```bash
npm run agent:i18n:consistency
```
Verifies translation consistency and detects hardcoded strings.

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BASE_URL` | Target URL for tests | `http://localhost:4321` |
| `UPDATE_VISUAL` | Update visual baselines | `false` |
| `AUTO_FIX` | Enable auto-fix for lint | `false` |
| `CI` | Running in CI mode | `false` |

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Agents
on: [push, pull_request]

jobs:
  agents:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      
      - run: npm ci
      - run: npm run agent:all
```

---

## Auto-Fix Capabilities

- **Lint**: Auto-fixes formatting with Prettier
- **Visual**: Can update baselines when `UPDATE_VISUAL=true`
- **Tests**: Automatic retry on failure
- **Build**: Reports errors with suggestions

---

## Notes

- All agents use colored output for better readability
- Agents return appropriate exit codes (0 = success, 1 = failure)
- Run `npm run dev` before testing agents if not using webServer
