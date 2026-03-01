# BUILDER INSTRUCTIONS: Definitive Versioning Specification Merger (v2)

**Status:** Ready for Implementation  
**Context:** Merge the normative Versioning proposal with the current implementation. The proposal's structure and compatibility rules prevail, while the current implementation's granular examples are preserved.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/DOCS_CHANGES_VERSIONING_PROPOSAL.md`

---

## 🎯 Objectives
1.  **Adopt Proposal Structure**: Use the formal sections (Scope, Identifiers, Compatibility, Determinism, CLI Interaction).
2.  **Preserve Granular Triggers**: Keep the detailed lists of what triggers MAJOR, MINOR, and PATCH increments from the current implementation.
3.  **Adopt Formal Error Codes**: Use the 4 codes: `ER-INVALID-VERSION-STRING`, `ER-UNSUPPORTED-RIGOR-SPEC`, `ER-VERSION-INCOMPATIBLE`, and `ER-VERSION-RANGE-UNSATISFIED`.
4.  **Formalize Engine Compatibility**: Include the normative table for Engine vs Spec version results.

---

## 🧱 Step 1: Update `apps/docs/specification/versioning.md`

Use the following merged content:

### 1. Purpose & Scope
Use the formal text from the proposal. State that versioning is mandatory and defines identifiers, rules, and compatibility.

### 2. Version Identifiers
Include the comparison table (`rigor_spec_version` vs `spec_version`).
- **`rigor_spec_version`**: Format "MAJOR.MINOR". Mandatory root field.
- **`spec_version`**: Format "MAJOR.MINOR.PATCH". Mandatory root field.

### 3. Semantic Versioning Rules
Combine the proposal's logic with the current implementation's detail:
- **MAJOR**: Increment for breaking changes. **INCLUDE LIST**: Removing states/events, changing types, removing mandatory fields, changing initial_state, converting optional to mandatory.
- **MINOR**: Increment for compatible features. **INCLUDE LIST**: Adding new optional events/states, adding new transitions, adding optional fields.
- **PATCH**: Increment for non-structural fixes. **INCLUDE LIST**: Documentation, error message clarity, typos.

### 4. Compatibility Rules
Include the **Engine Compatibility table** and the **Process Compatibility table** from the proposal.

### 5. Version Ranges
Document range support as "Optional in v0.1 but recommended". Include the operator table (=, >, >=, <, <=, ^, ~) from the current implementation.

### 6. Validation Behavior & Determinism
Adopt sections 6, 7, and 8 from the proposal. Ensure the 4-step validation order is clear.

### 7. Interaction with CLI & Validation Matrix
Adopt sections 10 and 11 from the proposal.

### 8. Examples
Keep the "Valid" and "Invalid" examples, ensuring they use the full spec-version strings.

---

## 🧱 Step 2: Update `apps/docs/es/specification/versioning.md`

Apply the same merger logic to the Spanish version. Technical IDs and Error Codes remain in English.

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:docs`.
- [ ] Detailed increment triggers (e.g., "Removing states") are preserved.
- [ ] The Engine Compatibility table is present.
- [ ] 4 Error codes are documented.
- [ ] `rigor_spec_version` is defined as "MAJOR.MINOR".
