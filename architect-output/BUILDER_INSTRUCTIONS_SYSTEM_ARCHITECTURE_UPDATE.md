# BUILDER INSTRUCTIONS: System Architecture Specification (v1)

**Status:** Ready for Implementation  
**Context:** Replace the architecture skeleton with the formal normative System Architecture specification.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/IMPLEMENTATION/2-SYSTEM-ARCHITECTURE.md`

---

## 🎯 Objectives
1.  **Full Rewrite**: Replace current `architecture.md` (EN and ES) with the formal architecture overview.
2.  **Define Modules**: Document the 13 logical modules and their specific responsibilities, inputs, and outputs.
3.  **Establish Contracts**: Codify the data contracts for Canonical Graph, ChangeSet, and Validation Reports.
4.  **Formalize Interaction Rules**: Document allowed and forbidden interactions between engines.
5.  **Multilingual Synchronization**: Ensure English and Spanish versions are technically and structurally identical.

---

## 🧱 Step 1: Update `apps/docs/implementation/architecture.md`

Replace the content with the normative structure:

### 1. Architectural Objectives
List the 6 mandatory objectives: Determinism, Isolation, Canonical Graph centrality, Evolution support, Testability, and Stable Contracts.

### 2. High-Level System Architecture
Include the ASCII diagram showing the layers: CLI Interface → Application API → Core Processing (Pipeline).

### 3. Module Decomposition
Detail each of the 13 modules (Parser, Graph Builder, Canonicalization, Validation, Constraint, Diff, Versioning, Migration, Event, Error Model, Application API, CLI, Performance/Testing) with:
- Responsibility
- Input
- Output
- Constraints/Guarantees

### 4. Data Flow Contracts
Define the requirements for:
- **Canonical Graph**: Immutability, Stable IDs, Canonical Paths, Deterministic iteration.
- **ChangeSet**: Ordered changes, classification, canonical paths.
- **Validation Report**: Ordered error list, severity, path, error code.

### 5. Engine Interaction Rules
List allowed (e.g., Parser → Graph Builder) and forbidden (e.g., CLI mutating Graph) interactions.

### 6. Deterministic Ordering & Concurrency
Codify the lexicographical stability requirement and the single-threaded default model.

### 7. Extensibility & Non-Goals
Define what can be extended and what is outside the engine's scope (Persistence, Runtime logic, etc.).

---

## 🧱 Step 2: Update `apps/docs/es/implementation/architecture.md`

Apply the same structural updates and translations to the Spanish version. Maintain technical terms like "Canonical Graph", "ChangeSet", and "EBNF" where appropriate, but translate descriptions and headers.

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:docs`.
- [ ] All 13 modules are listed with their responsibilities.
- [ ] The "Forbidden interactions" section is explicitly included.
- [ ] Data flow contracts are documented for Graph, ChangeSet, and Report.
- [ ] Sidebar links remain functional.
