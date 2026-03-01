# RIGOR

# Implementation

## Canonicalization Engine (Normative – v0.1)

Status: Normative
Scope: Defines the deterministic normalization of the Canonical Graph to guarantee structural equivalence, stable comparison, and reproducible outputs.

This document formalizes how a Canonical Graph is normalized prior to validation, diff, versioning, or hashing.

---

# 1. Purpose

The Canonicalization Engine ensures that semantically equivalent specifications produce structurally identical Canonical Graph representations.

It eliminates non-semantic variability introduced by:

* Input ordering
* Formatting differences
* Structural noise
* Implicit defaults

Canonicalization is mandatory before any semantic processing.

---

# 2. Core Guarantees

The Canonicalization Engine MUST guarantee:

1. Deterministic node ordering
2. Deterministic attribute ordering
3. Deterministic edge ordering
4. Stable canonical paths
5. Stable structural comparison behavior

Two semantically equivalent graphs MUST produce identical canonicalized graphs.

---

# 3. Canonicalization Scope

Canonicalization operates exclusively on:

* Nodes
* Node attributes
* Edges
* Canonical paths
* Collections

It MUST NOT:

* Modify semantic meaning
* Add implicit defaults (unless defined by Specification)
* Remove required information
* Perform validation

---

# 4. Canonical Ordering Rules

Canonical ordering MUST be applied to:

---

## 4.1 Node Collections

Nodes MUST be ordered deterministically by:

1. Node type (stable predefined type precedence)
2. Primary identifier (lexicographic)
3. Canonical path (as tie-breaker)

Type precedence MUST be defined statically and MUST NOT change between runs.

---

## 4.2 Attributes Within Nodes

Attributes MUST be ordered lexicographically by attribute name.

Nested mappings MUST also follow canonical ordering recursively.

---

## 4.3 Edges

Outgoing edges of each node MUST be ordered by:

1. Edge type
2. Target node canonical path

---

## 4.4 Sequences

Sequences that represent unordered semantic sets MUST be sorted deterministically.

Sequences that represent semantically ordered collections MUST preserve semantic order.

The Specification MUST define which collections are ordered vs unordered.

---

# 5. Canonical Path Stabilization

Canonical paths MUST:

* Be normalized
* Use consistent separators
* Use normalized identifiers
* Avoid trailing delimiters
* Be case-sensitive unless defined otherwise

Path normalization MUST NOT alter semantic identifiers.

---

# 6. Scalar Normalization

Scalars MUST be normalized as follows:

* Booleans → true / false
* Integers → canonical decimal form
* Floats → normalized decimal form
* Strings → preserved exactly
* Null → explicit null

Whitespace trimming is prohibited unless explicitly defined in Specification.

---

# 7. Structural Noise Elimination

The Canonicalization Engine MAY eliminate:

* Empty optional collections
* Explicit default values that match specification defaults

Only if the Specification explicitly permits omission.

It MUST NOT eliminate:

* Explicit user-defined values
* Semantic declarations

---

# 8. Deterministic Traversal

Canonicalization MUST produce a traversal order that is:

* Stable
* Depth-first or breadth-first (implementation-defined)
* Consistent across runs

Traversal order MUST NOT depend on original YAML ordering.

---

# 9. Structural Hash (Optional but Recommended)

The engine MAY compute a structural hash.

If implemented:

* The hash MUST depend solely on canonicalized structure
* The hash MUST be stable across runs
* The hash algorithm MUST be documented
* Hash collisions MUST be considered theoretically possible

The hash MUST NOT depend on memory addresses or runtime state.

---

# 10. Canonical Graph Immutability

Canonicalization MUST NOT mutate the original graph instance.

It MUST:

* Produce a new graph instance
  OR
* Freeze the existing graph after canonical ordering

The resulting graph MUST be immutable.

---

# 11. Handling Unordered Semantic Sets

For collections declared semantically unordered:

* Sorting MUST be applied deterministically
* Sorting key MUST be stable
* Sorting algorithm MUST be deterministic

For collections declared semantically ordered:

* Order MUST be preserved
* Canonicalization MUST NOT reorder

---

# 12. Error Handling

Canonicalization SHOULD NOT produce semantic errors.

However, it MAY produce structural errors if:

* Internal graph invariants are violated
* Node types are inconsistent
* Required attributes are missing unexpectedly

Such errors MUST be treated as fatal internal errors.

---

# 13. Performance Expectations

Canonicalization SHOULD operate in:

O(N log N)

Where N = number of nodes + edges.

Recursive normalization MUST avoid quadratic behavior.

---

# 14. Interaction with Other Engines

Canonicalization MUST precede:

* Validation Engine
* Diff Engine
* Versioning Engine
* Migration Engine

Diff MUST compare canonicalized graphs only.

Validation MUST operate on canonicalized graph only.

---

# 15. Compliance Criteria

An implementation is compliant if:

* It produces identical canonical graphs for semantically equivalent specs
* It guarantees stable ordering
* It prevents YAML order influence
* It normalizes scalars deterministically
* It preserves semantic meaning

---

# 16. Non-Goals

Canonicalization does NOT:

* Validate business logic
* Classify changes
* Perform migration
* Interpret constraints

Its purpose is structural normalization only.

---

# 17. Summary

The Canonicalization Engine:

* Freezes deterministic structure
* Eliminates non-semantic variance
* Enables reliable diffing
* Enables reproducible hashing
* Guarantees structural comparability

It is foundational for evolution and validation stability.
