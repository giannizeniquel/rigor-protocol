# BUILDER INSTRUCTIONS: Canonicalization Engine Specification (v1)

**Status:** Ready for Implementation  
**Context:** Replace the Canonicalization Engine skeleton with the formal normative specification. This module ensures structural identity for semantically equivalent specifications, enabling reliable diffing and hashing.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/IMPLEMENTATION/5-CANONICALIZATION-ENGINE.md`

---

## 🎯 Objectives
1.  **Full Rewrite**: Replace current `canonicalization.md` (EN and ES) with the formal specification.
2.  **Define Ordering Rules**: Document the mandatory deterministic ordering for nodes, attributes, edges, and sequences.
3.  **Establish Stabilization Rules**: Codify canonical path stabilization and scalar normalization (booleans, numbers, etc.).
4.  **Codify Immutability**: Mandate that canonicalization must either freeze the graph or produce a new immutable instance.
5.  **Multilingual Synchronization**: Ensure English and Spanish versions are technically identical.

---

## 🧱 Step 1: Update `apps/docs/implementation/canonicalization.md`

Replace the content with the normative structure:

### 1. Purpose & Scope
Define the module's role in eliminating non-semantic variability (ordering, formatting, noise). State that it is mandatory before any semantic processing.

### 2. Core Guarantees
List the 5 guarantees: Deterministic node/attribute/edge ordering, stable paths, and stable structural comparison.

### 3. Canonical Ordering Rules (CRITICAL)
Document the hierarchy:
- **Nodes**: Order by Type (predefined precedence), then ID (lexicographic), then Path.
- **Attributes**: Lexicographical by name.
- **Edges**: Order by Edge Type, then Target Node Canonical Path.
- **Sequences**: Differentiate between Unordered Sets (must be sorted) and Ordered Collections (must be preserved).

### 4. Canonical Path & Scalar Stabilization
- Define rules for normalized path separators and delimiters.
- Define scalar normalization: Booleans (true/false), Integers (decimal), Floats (normalized decimal), Null (explicit).

### 5. Structural Noise Elimination
Define what can be omitted (empty optional collections, explicit defaults matching specs) and what must be preserved.

### 6. Immutability & Deterministic Traversal
Mandate that the resulting graph MUST be immutable and traversal MUST be independent of original YAML ordering.

### 7. Structural Hash
Recommend stable hashing based solely on canonicalized structure.

### 8. Performance & Compliance
- O(N log N) expectation.
- List compliance criteria (identical graphs for equivalent specs, stable ordering, etc.).

---

## 🧱 Step 2: Update `apps/docs/es/implementation/canonicalization.md`

Apply the same structural updates and translations to the Spanish version. Use terms like "Ordenamiento Determinista", "Normalización de Escalares", "Eliminación de Ruido Estructural" and "Hash Estructural".

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:docs`.
- [ ] Hierarchy of ordering (Type -> ID -> Path) is correctly documented.
- [ ] Distinction between ordered and unordered sequences is clear.
- [ ] "Immutability" requirement is prominent.
- [ ] Sidebar links remain functional.
