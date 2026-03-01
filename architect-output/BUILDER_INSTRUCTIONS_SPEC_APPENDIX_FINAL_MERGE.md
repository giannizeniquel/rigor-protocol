# BUILDER INSTRUCTIONS: Definitive Spec Appendix Merger (v2)

**Status:** Ready for Implementation  
**Context:** Merge the normative Spec Appendix proposal with the current implementation. The proposal provides the normative structure (A-K), while the current implementation provides industrial blueprints (JSON Schema, Testing, CI/CD).  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/DOCS_CHANGES_SPEC-APPENDIX-PROPOSAL.md`

---

## 🎯 Objectives
1.  **Adopt Proposal Structure**: Use sections A through K from the proposal as the primary normative framework.
2.  **Integrate Industrial Blueprints**:
    - Add the **JSON Schema (Draft-07)** into the "Implementation Mapping" section.
    - Preserve the **Testing Model (Pseudocode)** and **Conceptual Diagrams**.
    - Preserve the **CI/CD Strategy** and **Future Distributed Execution** notes.
3.  **Consolidate Examples**: Keep the Proposal's minimal example as the "Normative Baseline" and the current "User Onboarding" as the "Industrial Reference".
4.  **Sync Multilingual**: Ensure English and Spanish versions are fully aligned.

---

## 🧱 Step 1: Update `apps/docs/specification/spec-appendix.md`

Use the following merged structure:

### A. Normative Terminology
Adopt from Proposal (MUST, SHOULD, MAY).

### B. Notation and Conventions
Adopt from Proposal (Identifiers regex, naming recommendations).

### C. Canonical Path Syntax (Normative)
Adopt from Proposal (Path grammar and examples).

### D. Glossary (Normative)
Adopt from Proposal (Node, Edge, Entity, etc.).

### E. YAML Structural Guide
Adopt from Proposal (Indentation, Block order, Comments).

### F. Common Validation Errors
Adopt from Proposal (Standard error format and examples).

### G. Edge Cases (Normative Clarifications)
Adopt from Proposal (Empty process, terminal states, optional fields).

### H. Implementation Mapping & JSON Schema
- Include **H.1 Canonical Graph Derivation** from Proposal.
- Include **H.2 Formal JSON Schema (Draft-07)** rescued from the current implementation.

### I. Full Reference Example (Normative Baseline)
Adopt the minimal "UserLifecycle" example from the Proposal.

### J. Industrial Reference Example (Detailed)
Include the "User Onboarding with Email Verification" example from the current implementation.

### K. Testing and Execution Models
Include **K.1 Pure State Machine Principle** and the **K.2 Test Case Example (Pseudocode)** rescued from current implementation.

### L. Operational Strategies
Include **L.1 CI/CD Validation Strategy** and **L.2 Future Distributed Execution** rescued from current implementation.

### M. Conformance & Version Alignment
Adopt Sections J and K from the Proposal.

---

## 🧱 Step 2: Update `apps/docs/es/specification/spec-appendix.md`

Apply the same merger logic to the Spanish version. Maintain Technical IDs and Regex in English.

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:docs`.
- [ ] Sections A through M are present.
- [ ] JSON Schema block is correctly formatted.
- [ ] Canonical path syntax is clearly explained.
- [ ] Both Baseline and Industrial examples are present.
