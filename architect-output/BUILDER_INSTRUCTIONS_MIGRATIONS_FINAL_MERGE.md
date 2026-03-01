# BUILDER INSTRUCTIONS: Definitive Migrations Specification Merger (v2)

**Status:** Ready for Implementation  
**Context:** Merge the normative Migrations proposal with the current implementation. The proposal's rigorous language, chain model, and safety constraints prevail.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/DOCS_CHANGES_MIGRATIONS_PROPOSAL.md`

---

## 🎯 Objectives
1.  **Adopt Normative Language**: Use RFC 2119 keywords (MUST, SHOULD, MAY) throughout the document.
2.  **Formalize Chain Model**: Include Section 9 (Chain Model) and Section 15 (Atomicity) from the proposal.
3.  **Integrate Safety Constraints**: Add Section 17 regarding purely declarative execution and no arbitrary code.
4.  **Consolidate Taxonomy**: Use the conciser error codes (`ER-MIG-xxx`) and include `ER-MIG-VERSION-MISMATCH`.
5.  **Sync Multilingual**: Ensure English and Spanish versions are identical in technical depth.

---

## 🧱 Step 1: Update `apps/docs/specification/migrations.md`

Use the following merged structure:

### 1. Purpose & Formal Definition
Combine both. Define a Migration as an ordered set of operations. **MUST** be declarative, deterministic, and statically validatable.

### 2. Location & Sequentiality
- Defined at the root.
- Sequentiality: `from < to`, `to == spec_version`.
- No forks, no gaps, no cycles.

### 3. Formal Grammar (EBNF)
Use the proposal's abstract grammar.

### 4. Operation Model (Normative Rules)
Include the 7 operations from current implementation but add the "Atomic Transformation" rules from the proposal:
- MUST be deterministic.
- MUST be idempotent within a single execution.
- MUST NOT introduce non-determinism.

### 5. Validation Phases
Adopt the three phases from the proposal:
1. **Structural**: Syntax and versions.
2. **Semantic**: Operation legality vs SemVer type.
3. **Graph**: Post-application invariants (Reachability, Initial State existence, etc.).

### 6. Version Compatibility Matrix
Include the table:
- **PATCH**: Metadata only.
- **MINOR**: Additive operations only.
- **MAJOR**: Additive + Destructive.

### 7. Atomicity & Security
- **Atomicity**: All-or-nothing application.
- **Security**: No arbitrary code, strictly declarative.

### 8. Error Taxonomy
Use the `ER-MIG-xxx` codes from the proposal.

### 9. CLI Integration
Refine the `rigor migrate` section to match the 5 steps in the proposal (Resolve -> Validate -> Apply -> Validate Graph -> Emit).

---

## 🧱 Step 2: Update `apps/docs/es/specification/migrations.md`

Apply the same merger logic to the Spanish version. Technical IDs and Error Codes remain in English.

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:docs`.
- [ ] Section on "Migration Atomicity" is present.
- [ ] The rule "MUST NOT execute arbitrary code" is included.
- [ ] Error codes are conciser (`ER-MIG-xxx`).
- [ ] Sequentiality rules strictly forbid forks and gaps.
