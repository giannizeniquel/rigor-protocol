# BUILDER INSTRUCTIONS: Definitive Spec Reference Merger (v2)

**Status:** Ready for Implementation  
**Context:** Merge the current implementation with the new normative proposal to create the definitive DSL reference.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/DOCS_CHANGES_SPEC-REFERENCE-PROPOSAL.md`

---

## 🎯 Objectives
1.  **Merge Content**: Combine the normative tone and structure of the proposal with the specific architectural rules of the current implementation.
2.  **Naming Conventions**: Restore the explicit naming rules (Regex/Format) for fields, events, and states.
3.  **State Effects**: Restore the "Exactly One Effect" rule (`emit_command`, `invoke`, `terminal`).
4.  **Simplified Structure**: Keep `initial_state` at the top level of the process definition.
5.  **Error Codes**: Use the expanded taxonomy (RIGOR-DSL-001 to 008).
6.  **Prohibitions**: Include the "Prohibited Features" section.

---

## 🧱 Step 1: Update `apps/docs/specification/spec-reference.md`

Use the following merged structure:

### 1. Scope & Introduction
Use the formal normative language from the proposal. State that this document defines the formal syntax and deterministic semantics.

### 2. File Format & Top-Level Structure
- YAML, UTF-8, No tabs.
- Mandatory fields: `rigor_spec_version`, `spec_version`, `process`, `initial_state`, `context`, `events`, `states`.
- **Note**: `initial_state` is at the root of the process block.

### 3. Type System
- Primitive types: `string`, `integer`, `boolean`, `datetime`, `uuid`.
- Composite: `object`, `array<T>`.
- Nullability: `?` suffix.
- Include the grammar from the proposal.

### 4. Context Definition
- **Naming**: `snake_case` (`^[a-z_][a-z0-9_]*$`).
- Rules from proposal + default values from current implementation.

### 5. Event Declaration
- **Naming**: `PascalCase` (`^[A-Z][a-zA-Z0-9]*$`).
- Grammar from proposal.

### 6. States & Transitions
- **State Naming**: `UPPER_SNAKE_CASE` (`^[A-Z][A-Z0-9_]*$`).
- **CRITICAL: Exactly One Effect Rule**: Each state MUST declare exactly one of `emit_command` (Asynchronous), `invoke` (Synchronous), or `terminal: true`.
- **Transitions**: Use the ID-based mapping from the proposal (e.g., `confirm: { on: ..., to: ... }`).

### 7. Update Expressions
- Grammar from proposal (Arithmetic, `now`, `event.payload`, `context.field`).
- Logic: Only declared fields, type compatibility.

### 8. Determinism & Prohibitions
- Use the 6 guarantees from the proposal.
- Include Section 15 "Prohibited Features" (No guards, no internal events, etc.).

### 9. Validation Error Codes
- Full set: 001 to 008.

### 10. Minimal Complete Example
Use the `OrderProcess` example, ensuring it reflects both the `initial_state` placement and the state effects.

---

## 🧱 Step 2: Update `apps/docs/es/specification/spec-reference.md`

Apply the same merge logic to the Spanish version. EBNF and technical IDs remain in English.

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:docs`.
- [ ] `initial_state` is outside the `states` block.
- [ ] State naming is `UPPER_SNAKE_CASE`.
- [ ] The "Exactly One Effect" rule is explicitly mentioned.
- [ ] Prohibited Features section is present.
- [ ] Error codes go up to 008.
