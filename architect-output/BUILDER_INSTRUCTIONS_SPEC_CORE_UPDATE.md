# BUILDER INSTRUCTIONS: Spec Core Specification Update (v1)

**Status:** Ready for Implementation  
**Context:** Formalize the Process Core specification with normative language, explicit mutation models, and deterministic guarantees.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/DOCS_CHANGES_SPEC_CORE.md`

---

## 🎯 Objectives
1.  **Refactor `spec-core.md`** (EN and ES) into a normative specification using RFC keywords (MUST, SHOULD, MAY).
2.  **Add 5 New Sections**: Mutation Declaration Model, Transactional Semantics, Invariants, Terminal States, and Determinism Guarantee.
3.  **Formalize Structure**: Define the mandatory components of a process (Identity, States, Initial State, Transitions, Context).
4.  **Provide a Normative Example**: A minimal but complete JSON/YAML representation demonstrating the new rules.

---

## 🛠️ Step 1: Update `apps/docs/specification/spec-core.md`

Replace/Restructure the content following this normative outline:

### 1. Introduction
Define a RIGOR Process as a "deterministic, event-driven state machine where all mutations are restricted to declared transitions and executed atomically per event."

### 2. Process Definition
A Process **MUST** define:
- A unique identity
- A finite set of states
- An initial state (which **MUST** exist in the states set)
- A finite set of transitions
- A context schema

### 3. Transition Model & Mutation Declaration (CRITICAL)
Define the formal mapping: `(current_state, event) -> (next_state, mutations)`.
- A transition **MUST** define `from`, `on`, and `to`.
- A transition **MAY** define a `mutate` list.
- **Rule**: Transitions **MUST NOT** mutate context fields not explicitly declared in the `mutate` list. If `mutate` is omitted, the context is immutable for that transition.

### 4. Transactional Semantics
Each event **MUST** be processed atomically.
- Successful execution results in an atomic state transition and context update.
- Failure results in no state change and no mutation (rollback).

### 5. Determinism Guarantee
For any given `(state, event)` pair, there **MUST** be at most one valid transition. Ambigous mappings are prohibited and **MUST** be rejected at validation time.

### 6. Terminal States
A terminal state is a state with no outgoing transitions. Once reached, the process **MUST NOT** accept further events.

### 7. Invariants
- **Structural**: Single initial state, valid targets, no duplicates.
- **Runtime**: State always in declared set, context always conforms to schema.

### 8. Normative Example
Include a JSON block showing an "OrderProcess" with:
- `context_schema`
- A transition with `mutate` (e.g., `Approve` -> `mutate: ["status", "approvedAt"]`)
- A terminal state.

---

## 🧱 Step 2: Update `apps/docs/es/specification/spec-core.md`

Apply the same structural updates and translations to the Spanish version.

*(Builder: Use technical terms: "Máquina de estados determinista", "Declaración de Mutación", "Semántica Transaccional", "Invariantes", "Estado Terminal".)*

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:docs`.
- [ ] The page uses normative keywords (MUST/DEBE, SHOULD/DEBERÍA).
- [ ] The "Mutation Declaration Model" section explicitly forbids undeclared mutations.
- [ ] The "Determinism" section forbids ambiguous mappings.
- [ ] Sidebar links remain functional.
