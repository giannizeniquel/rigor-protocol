# RIGOR

# Implementation

## Diff Engine (Normative – v0.1)

Status: Normative
Scope: Defines the deterministic computation of structural differences between two Canonical Graph instances.

This document formalizes the internal algorithm, contracts, guarantees, and constraints of the Diff Engine.

---

# 1. Purpose

The Diff Engine computes a ChangeSet representing the structural differences between:

* A previous Canonical Graph (G₁)
* A current Canonical Graph (G₂)

It is responsible for:

* Detecting additions
* Detecting removals
* Detecting modifications
* Classifying change types
* Producing a deterministic ChangeSet

It MUST NOT:

* Perform validation
* Perform migrations
* Mutate either graph
* Apply changes

---

# 2. Input and Output Contracts

## 2.1 Input

```
diff(previous: CanonicalGraph, current: CanonicalGraph): ChangeSet
```

Both graphs MUST be canonicalized prior to diff.

The engine MUST reject non-canonical graphs.

---

## 2.2 Output

The engine MUST return:

```
ChangeSet {
    status: "no-change" | "changed"
    changes: OrderedCollection<Change>
    summary: ChangeSummary
}
```

`status` MUST be `"no-change"` if and only if no structural differences exist.

---

# 3. Core Diff Model

Diff operates on:

* Node identity
* Node attributes
* Edge relationships

Comparison MUST be:

* Deterministic
* Order-independent
* Based on canonical paths and node IDs

---

# 4. Identity Matching

Nodes MUST be matched by:

1. Canonical path
2. Stable identity key (if defined)

If a node exists in G₂ but not in G₁ → ADD
If a node exists in G₁ but not in G₂ → REMOVE
If exists in both → compare attributes and edges

---

# 5. Change Types

Each Change MUST be one of:

* ADD_NODE
* REMOVE_NODE
* MODIFY_ATTRIBUTE
* ADD_EDGE
* REMOVE_EDGE
* REORDER (only if semantically ordered)

Change type set MUST be stable and versioned.

---

# 6. Change Object Schema

Each change MUST include:

```
Change {
    type: ChangeType
    path: CanonicalPath
    nodeType: NodeType
    attribute?: string
    oldValue?: any
    newValue?: any
    metadata?: object
}
```

Fields MUST be present only when relevant.

---

# 7. Diff Algorithm (Normative Behavior)

The algorithm MUST:

### Phase 1 – Node Set Comparison

* Build node maps keyed by canonical path
* Identify added nodes
* Identify removed nodes

### Phase 2 – Attribute Comparison

For matched nodes:

* Compare attribute sets
* Detect added attributes
* Detect removed attributes
* Detect modified attributes

Attribute comparison MUST be deep and deterministic.

### Phase 3 – Edge Comparison

For matched nodes:

* Compare outgoing edges
* Detect additions and removals
* Detect semantic reorder (if applicable)

### Phase 4 – Normalization

* Sort changes deterministically
* Remove redundant changes
* Finalize ChangeSet

---

# 8. Deterministic Ordering Rules

Changes MUST be ordered by:

1. Canonical path (lexicographic)
2. ChangeType (stable internal precedence)
3. Attribute name (if applicable)

The same input graphs MUST produce identical ChangeSets.

---

# 9. Deep Equality Rules

Deep comparison MUST:

* Compare scalars strictly
* Compare mappings recursively
* Compare unordered sets by sorted canonical form
* Compare ordered lists by position

Floating point comparison MUST be exact unless Specification defines tolerance.

---

# 10. Semantic Reorder Handling

For semantically ordered collections:

* A change in order MUST produce REORDER
* Implementation MUST detect minimal reorder delta

For unordered sets:

* Order differences MUST NOT produce changes

---

# 11. Structural Hash Optimization (Optional)

If Canonical Graph includes structural hash:

* Hash mismatch MAY trigger deep comparison
* Hash equality MAY short-circuit diff

Hash use MUST NOT affect correctness.

---

# 12. Summary Object

ChangeSummary MUST include:

```
ChangeSummary {
    totalChanges: number
    additions: number
    removals: number
    modifications: number
    reorders: number
}
```

Counts MUST be consistent with ChangeSet.

---

# 13. Performance Expectations

The Diff Engine SHOULD operate in:

O(N + E)

Where:

* N = nodes
* E = edges

Attribute comparison SHOULD avoid quadratic behavior.

Memory usage SHOULD scale linearly.

---

# 14. Large Graph Considerations

The engine SHOULD:

* Use hash maps for node lookup
* Avoid nested full scans
* Avoid redundant comparisons

Streaming diff is OPTIONAL and MUST remain deterministic if implemented.

---

# 15. Integration with Versioning Engine

The ChangeSet MUST be consumable by:

* Versioning Engine
* Migration Engine
* CLI output

The Diff Engine MUST NOT interpret version bump rules.

---

# 16. Error Handling

Diff SHOULD NOT produce semantic errors.

It MAY produce fatal errors if:

* Graph invariants are violated
* Canonical path collision detected
* Non-canonical graph provided

Such errors MUST be deterministic.

---

# 17. Stability Across Versions

Change types and output structure MUST be versioned.

Breaking changes in ChangeSet schema MUST increment RIGOR major version.

---

# 18. Non-Goals

The Diff Engine does NOT:

* Validate correctness
* Classify semantic severity
* Decide version bump
* Apply migrations
* Generate patches

It only describes structural differences.

---

# 19. Compliance Criteria

An implementation is compliant if:

* It produces deterministic ChangeSets
* It correctly identifies add/remove/modify
* It ignores non-semantic ordering
* It preserves stable ordering of changes
* It operates only on canonicalized graphs

---

# 20. Summary

The Diff Engine:

* Compares two Canonical Graphs
* Produces deterministic structural ChangeSet
* Is order-independent
* Is immutable and pure
* Is foundational for evolution and versioning

---
