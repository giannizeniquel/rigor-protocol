# BUILDER INSTRUCTIONS: Diff Algorithm Integration (v2)

**Status:** Ready for Implementation  
**Context:** Integrate the formal "Breaking Change Classification Algorithm" into the Diff specification. This adds the mathematical rule engine that powers deterministic change classification.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/DOCS_CHANGES_DIFF_BREAKING-CHANGE-CLASSIFICATION-ALGORITM.md`

---

## 🎯 Objectives
1.  **Formalize Classification**: Add the deterministic rule engine (N, P, C, K, E rules) to `diff.md`.
2.  **Define Breaking Condition**: Explicitly state the instance invalidation criteria.
3.  **Codify Versioning Enforcement**: Include the logic for validating version bumps based on diff results.
4.  **Describe the Pipeline**: Document the 6-step classification pipeline.
5.  **Multilingual Accuracy**: Ensure the algorithm logic is perfectly synchronized in English and Spanish.

---

## 🧱 Step 1: Update `apps/docs/specification/diff.md`

Add/Update the following sections:

### 1. Breaking Change Definition (Mathematical)
Include the formal definition: A change is breaking if there exists an instance $I$ such that `Validate(I, Spec_A) = valid` and `Validate(I, Spec_B) = invalid`.

### 2. The Deterministic Rule Engine
Implement a detailed section documenting the classification rules:
- **Node-Level (N1-N3)**: Removal (Breaking), Addition (Non-breaking if optional), Renaming (Breaking).
- **Property-Level (P1-P3)**: Removal (Breaking), Addition (Breaking if required), Type Change (Breaking).
- **Constraint-Level (C1-C2)**: Strengthening (Breaking), Weakening (Non-breaking).
- **Cardinality (K1-K2)**: Relaxing optionality (Non-breaking), Strengthening optionality (Breaking).
- **Edge-Level (E1-E2)**: Removal (Breaking), Addition (Breaking if required).

### 3. Semantic Equivalence Rule
Explicitly state that if `Normalize(Graph_A) == Normalize(Graph_B)`, the result must be `NoChange`, preventing false positives from reordering or formatting.

### 4. Classification Pipeline
Document the 6 sequential steps:
1. Canonicalize Graphs.
2. Generate Raw Changes.
3. Apply Classification Rules per change.
4. Aggregate Summary.
5. Validate Version Bump Consistency.
6. Emit Result.

### 5. Versioning Consistency Check
Codify the requirements for version increments:
- `BreakingChanges > 0` -> **MAJOR** increment mandatory.
- `BreakingChanges == 0` AND `StructuralChanges > 0` -> **MINOR** increment recommended.

---

## 🧱 Step 2: Update `apps/docs/es/specification/diff.md`

Translate the algorithm and rules to Spanish. Maintain technical IDs (N1, P1, etc.) and formal definitions. Use terms like "Motor de Reglas", "Invalidación de Instancia" and "Consistencia de Versionado".

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:docs`.
- [ ] All rules (N, P, C, K, E) are present in both languages.
- [ ] The "Versioning Consistency Check" logic is explicitly documented.
- [ ] The 6-step pipeline is clearly listed.
