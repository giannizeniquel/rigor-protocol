# BUILDER INSTRUCTIONS: Landing Page Technical Update (v2)

**Status:** Ready for Implementation  
**Context:** Aligning the landing page with RIGOR Core v0.1 (Frozen) and projecting technical maturity.  
**Reference:** `project_brief/LANDING_CHANGES.md`

---

## 🎯 Objectives
1.  Update landing page content to reflect technical precision over abstract vision.
2.  Add 5 new technical sections (Core v0.1, Backend-First, Transaction Model, Project Status, Open Standard).
3.  Ensure full i18n support (English/Spanish).
4.  Maintain the RIGOR visual identity: deterministic, bounded, and monochromatic.

---

## 🛠️ Step 1: Update i18n Keys (`apps/web/src/i18n/ui.ts`)

You MUST update `apps/web/src/i18n/ui.ts` with the following content. Replace existing keys and add the new ones.

### English (`en`)
- **Hero:** 
  - `hero.subtitle`: "A typed, event-driven constraint protocol for AI-generated systems."
  - `hero.tertiary`: "RIGOR is a formal specification language designed to constrain, validate and govern AI-generated backend systems."
  - `hero.optional`: "It defines explicit state transitions, typed context mutation rules, and deterministic execution boundaries."
- **What is RIGOR? (NEW):**
  - `whatIsRigor.title`: "What is RIGOR?"
  - `whatIsRigor.intro`: "RIGOR is an open specification that defines how AI-generated systems must behave."
  - `whatIsRigor.list.1`: "Explicit state machines"
  - `whatIsRigor.list.2`: "Typed context schemas"
  - `whatIsRigor.list.3`: "Event-driven transitions"
  - `whatIsRigor.list.4`: "Deterministic mutation rules"
  - `whatIsRigor.list.5`: "Validation before execution"
  - `whatIsRigor.outro`: "RIGOR separates specification from implementation. The specification defines what is allowed. Implementations execute under those constraints."
- **Core Principles (Updated):**
  - `coreInvariants.1.description`: "No implicit mutations. No hidden state changes. All context mutations must be declared within event transitions."
  - `coreInvariants.2.description`: "For a given state and event, the resulting transition is uniquely defined. The pair (state, event) must be unambiguous."
  - `coreInvariants.5.title`: "Controlled Mutation"
  - `coreInvariants.5.description`: "Context can only mutate inside transitions triggered by declared events. Each event is processed as an independent transactional unit."
  - `coreInvariants.6.title`: "Specification / Implementation Separation"
  - `coreInvariants.6.description`: "RIGOR defines a protocol. Engines implement it. The language is independent of any runtime."
- **RIGOR Core v0.1 (NEW):**
  - `coreVersion.title`: "RIGOR Core v0.1 — Frozen Semantic Model"
  - `coreVersion.intro`: "The semantic core of RIGOR v0.1 is formally defined and frozen."
  - `coreVersion.list.1`: "Event-driven state machine"
  - `coreVersion.list.2`: "Typed and validated context schema"
  - `coreVersion.list.3`: "Explicit mutation declaration"
  - `coreVersion.list.4`: "No external mutation allowed"
  - `coreVersion.list.5`: "Terminal state irreversibility"
  - `coreVersion.outro`: "This version establishes the minimal invariant foundation of the protocol."
- **Protocol Model (Updated):**
  - Update descriptions for Intent Domain, Constraint Contract, Generation Boundary, Validation Engine, Evolution Layer according to section 5 of `LANDING_CHANGES.md`.
- **Backend-First Strategy (NEW):**
  - `backendFirst.title`: "Backend-First Strategy"
  - `backendFirst.intro`: "RIGOR begins as a backend-focused specification language."
  - `backendFirst.list.1`: "Process orchestration"
  - `backendFirst.list.2`: "Domain state machines"
  - `backendFirst.list.3`: "External service invocation boundaries"
  - `backendFirst.list.4`: "API contract governance"
  - `backendFirst.outro`: "Frontend and contract derivations may emerge from the backend specification layer."
- **Transaction Model (NEW):**
  - `transactionModel.title`: "Transaction Model"
  - `transactionModel.intro`: "Each processed event represents an isolated transactional unit."
  - `transactionModel.list.1`: "Context mutation occurs only during event transitions."
  - `transactionModel.list.2`: "No partial state application is allowed."
  - `transactionModel.list.3`: "Strong consistency with external systems is enforced through controlled invocation patterns."
- **Project Status (NEW):**
  - `projectStatus.title`: "Project Status"
  - `projectStatus.list.1`: "Specification Core v0.1 — Frozen"
  - `projectStatus.list.2`: "Reference Specification (YAML/JSON) — Defined"
  - `projectStatus.list.3`: "Validation Rules — Defined"
  - `projectStatus.list.4`: "Official Engine — In development"
  - `projectStatus.outro`: "RIGOR is evolving as an open standard intended for community governance."
- **Open Standard (NEW):**
  - `openStandard.title`: "Open Standard"
  - `openStandard.body`: "RIGOR is designed to be an open, implementable protocol. The specification is public. Any team may build a compatible engine. Long-term governance is intended to be community-driven."

### Spanish (`es`)
- Translate the above keys consistently with the style used in `ui.ts`.

---

## 🧱 Step 2: Component Creation & Refactoring

### 1. New Components
Create the following components in `apps/web/src/components/`. Use the existing `section--ruled` pattern.

- `WhatIsRigor.astro`
- `CoreVersion.astro`
- `BackendFirst.astro`
- `TransactionModel.astro`
- `ProjectStatus.astro`
- `OpenStandard.astro`

### 2. Updated Components
Modify these existing components:
- `Hero.astro`: Update text mapping.
- `CoreInvariants.astro`: Update loop to handle 6 principles (or reorder to match the 5 listed in `LANDING_CHANGES.md`).
- `ProtocolModel.astro`: Update list item text.
- `SpecificationAccess.astro`: Ensure links point to the correct documentation sections.

---

## 📄 Step 3: Page Integration (`apps/web/src/pages/index.astro` and `/es/index.astro`)

Update both files to include the new components in this order:

1.  `Hero`
2.  `WhatIsRigor` **(NEW)**
3.  `StructuralCondition`
4.  `StructuralEntropy`
5.  `CoreInvariants`
6.  `CoreVersion` **(NEW)**
7.  `ProtocolModel`
8.  `BackendFirst` **(NEW)**
9.  `TransactionModel` **(NEW)**
10. `StructuralPositioning`
11. `ConceptualTerritory`
12. `ProtocolVsPrompt`
13. `ProjectStatus` **(NEW)**
14. `OpenStandard` **(NEW)**
15. `SpecificationAccess`
16. `Footer`

---

## ✅ Verification Checklist
- [ ] Run `npm run build` in `apps/web` to ensure no build errors.
- [ ] Verify both `/` and `/es/` routes.
- [ ] Check contrast ratios and typography consistency (using Design Tokens).
- [ ] Ensure all diagrams (SVGs) in Hero and ProtocolModel still render correctly.
