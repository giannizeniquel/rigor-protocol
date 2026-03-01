# BUILDER INSTRUCTIONS: Spec Appendix Formalization (v1)

**Status:** Ready for Implementation  
**Context:** Transform the Spec Appendix into a normative auxiliary reference, formalizing notation, paths, glossary, and edge cases.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/DOCS_CHANGES_SPEC-APPENDIX.md`

---

## 🎯 Objectives
1.  **Full Restructure**: Reorganize the page into sections A through H as defined in the proposal.
2.  **Formalize Notation**: Include RFC 2119 terminology and identifier rules (ASCII, Regex).
3.  **Define Canonical Paths**: Document the `/segment/segment` syntax for graph node referencing.
4.  **Integrate Glossary**: Add normative definitions for core RIGOR concepts.
5.  **Codify Error Taxonomy**: Define the `ERR_CATEGORY_DETAIL` format.
6.  **Clarify Edge Cases**: Document rules for empty processes, terminal states, and empty payloads.
7.  **Preserve & Relocate**: Move the existing JSON Schema to Section G (Implementation Mapping) and the full example to Section H.

---

## 🧱 Step 1: Update `apps/docs/specification/spec-appendix.md`

Replace/Restructure the content following this normative structure:

### A. Notation and Conventions
- MUST/SHOULD/MAY definitions.
- Identifier rules: `^[A-Za-z][A-Za-z0-9_]*$`.
- Naming recommendations (PascalCase for Entities/Events, snake_case for Fields).

### B. Canonical Path Syntax
- Grammar: `/Segment/Segment`.
- Examples for entities, properties, states, and transitions.

### C. Glossary
- Normative definitions for: Node, Edge, Entity, Process, Event, Breaking Change, Non-Breaking Change, Canonical Graph.

### D. Common Validation Errors
- Define categories: SYNTAX, STRUCTURE, VERSION, CONSTRAINT, PROCESS, EVENT.
- Format: `ERR_<CATEGORY>_<DETAIL>`.
- Provide at least 3 structured examples (Input, Code, Explanation).

### E. YAML Style Guide
- 2 spaces, no tabs.
- Block ordering recommendations.
- Comment handling (ignored by canonicalization).

### F. Edge Cases
- Empty processes (valid if initial state declared).
- Optional context/payload (explicit `{}` preferred).
- Terminal states (allowed without outgoing edges).

### G. Implementation Mapping Notes
- Include the **JSON Schema (Draft-07)** here.
- Include notes on validation order and mapping YAML to graph nodes.

### H. Full Reference Example
- Provide one complete, valid YAML example including versions, process, context, events, and transitions.

---

## 🧱 Step 2: Update `apps/docs/es/specification/spec-appendix.md`

Apply the same structural updates and translations to the Spanish version. Ensure technical identifiers and EBNF remain in English where applicable, but descriptions are in Spanish.

*(Builder: Use terms like "Notación y Convenciones", "Sintaxis de Rutas Canónicas", "Glosario", "Casos de Borde".)*

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:docs`.
- [ ] Section A through H are present and correctly numbered.
- [ ] Canonical path syntax is clearly explained.
- [ ] Glossary entries match the RIGOR Core v0.1 definitions.
- [ ] JSON Schema is preserved in Section G.
- [ ] Full reference example follows the latest v0.1 grammar.
