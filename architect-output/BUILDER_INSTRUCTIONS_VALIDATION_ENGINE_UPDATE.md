# BUILDER INSTRUCTIONS: Validation Engine Specification (v1)

**Status:** Ready for Implementation  
**Context:** Replace the current descriptive Validation Engine documentation with the formal normative specification. This module is the primary gatekeeper of protocol compliance.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/IMPLEMENTATION/6-VALIDATION-ENGINE.md`

---

## 🎯 Objectives
1.  **Full Rewrite**: Replace current `validation-engine.md` (EN and ES) with the formal normative model.
2.  **Define Architecture**: Document the 4 core components: Rule Registry, Rule Executor, Validation Context, and Error Aggregator.
3.  **Codify Validation Phases**: Establish the 6-phase pipeline (Structural, Referential, Semantic, Process, Event, Version).
4.  **Define Contracts**: Codify the `ValidationReport`, `ValidationError`, and `ValidationWarning` schemas.
5.  **Enforce Determinism**: Document the rules for stable error ordering and pure rule execution.
6.  **Multilingual Synchronization**: Ensure English and Spanish versions are technically identical.

---

## 🧱 Step 1: Update `apps/docs/implementation/validation-engine.md`

Replace the content with the normative structure:

### 1. Purpose & Scope
Define the module as a pure evaluation system over the Canonical Graph. List prohibited actions (No mutation, no diff, no artifacts).

### 2. Input & Output Contracts
- **Input**: `validate(graph, options)`. Mandate canonicalized graph input.
- **Output**: `ValidationReport` with `status`, `errors` (ordered), and `warnings`.

### 3. Architectural Decomposition
Detail the responsibilities of:
- **Rule Registry**: Unique rule IDs, deterministic ordering.
- **Rule Executor**: Phase-based execution, violation collection.
- **Validation Context**: Read-only access to graph and lookup maps.
- **Error Aggregator**: Deduplication and stable sorting.

### 4. Validation Phases (1 to 6)
Document the mandatory order: Structural → Referential → Semantic → Process → Event → Version. Define short-circuit strategy at phase boundaries.

### 5. Determinism & Error Schema
- Mandate ordering by: 1. Canonical Path, 2. Rule ID, 3. Message.
- Define `ValidationError` and `ValidationWarning` schemas.
- Ensure error codes are stable and namespaced.

### 6. Execution Modes & Constraints
- **Strict vs Non-Strict**: Rule escalation and exclusion rules.
- **Rule Constraints**: Rules MUST be pure functions, MUST NOT mutate the graph, and MUST NOT perform I/O.

### 7. Performance & Compliance
- O(R x N) expectation.
- List compliance criteria (deterministic order, stable codes, strict mode support).

---

## 🧱 Step 2: Update `apps/docs/es/implementation/validation-engine.md`

Apply the same structural updates and translations to the Spanish version. Use technical terms like "Motor de Validación", "Registro de Reglas", "Fases de Validación" and "Reporte de Cumplimiento".

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:docs`.
- [ ] All 21 sections from the proposal are represented.
- [ ] The 6 validation phases are correctly listed.
- [ ] Error ordering rules (Path → ID → Message) are explicit.
- [ ] "No mutation" rule is prominent.
- [ ] Sidebar links remain functional.
