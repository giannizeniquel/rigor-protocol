# RIGOR

# Implementation

## Canonical Graph Builder (Normative – v0.1)

Status: Normative
Scope: Defines the construction of the Canonical Graph from the Intermediate Representation (IR).

This document formalizes the internal structural model used by all subsequent engines.

---

# 1. Purpose

The Canonical Graph Builder transforms the Intermediate Representation (IR) into a deterministic, immutable Canonical Graph.

The Canonical Graph is the single structural source of truth for:

* Validation
* Diff
* Versioning
* Migration
* Event resolution

No engine may operate directly on IR.

---

# 2. Core Principles

The Canonical Graph MUST be:

1. Deterministic
2. Immutable after construction
3. Identity-consistent
4. Fully resolved (no unresolved references)
5. Independent from YAML ordering

The Builder MUST guarantee identical Canonical Graphs for semantically identical IR inputs.

---

# 3. Conceptual Model

The Canonical Graph is a directed, typed graph composed of:

* Nodes
* Edges
* Canonical Paths

---

## 3.1 Node

A Node MUST contain:

* Stable Node ID
* Type
* Attributes (typed)
* Outgoing edges
* Canonical Path

Node IDs MUST be deterministic and stable across runs.

---

## 3.2 Edge

An Edge MUST contain:

* Source Node ID
* Target Node ID
* Edge Type
* Optional metadata

Edges MUST represent structural or referential relationships.

---

## 3.3 Canonical Path

Each node MUST have a unique canonical path representing its position in the graph.

Canonical paths MUST:

* Be deterministic
* Be independent of YAML ordering
* Remain stable across equivalent representations

Example (conceptual):

```
/processes/order/states/approved
```

Canonical path syntax is implementation-defined but MUST be stable.

---

# 4. Node Typing

Each node MUST have a defined type.

Examples of node types (illustrative, not exhaustive):

* Root
* Process
* State
* Transition
* Event
* Entity
* Constraint
* Version

The implementation MUST define an exhaustive set of node types aligned with the Specification.

Node types MUST be strongly typed internally.

---

# 5. Graph Construction Phases

The Canonical Graph Builder MUST operate in ordered phases.

---

## Phase 1: Root Construction

* Create root node
* Validate IR root type
* Initialize global registries

---

## Phase 2: Structural Node Creation

* Create nodes for all top-level sections
* Create nodes for nested structures
* Assign provisional canonical paths

At this stage, references MAY remain unresolved.

---

## Phase 3: Identity Registration

* Register all identity-bearing nodes
* Enforce uniqueness
* Detect duplicate identifiers

Duplicate identities MUST produce fatal error.

---

## Phase 4: Reference Resolution

* Resolve references between nodes
* Validate existence
* Create edges
* Detect circular references if invalid

Unresolved references MUST produce validation errors or fatal errors depending on severity.

---

## Phase 5: Canonical Path Finalization

* Normalize canonical paths
* Apply deterministic ordering rules
* Freeze node ordering

After this phase, the graph MUST be immutable.

---

# 6. Identity Rules

Identity-bearing nodes MUST:

* Have globally unique identifiers within scope
* Be registered before reference resolution
* Produce deterministic canonical paths

Identity comparison MUST be case-sensitive unless otherwise defined.

---

# 7. Deterministic Ordering Rules

The Builder MUST apply deterministic ordering for:

* Top-level sections
* Nodes within sections
* Attributes within nodes
* Edges

Ordering SHOULD default to lexicographic by identifier unless the Specification defines semantic ordering.

YAML input order MUST NOT affect final graph order.

---

# 8. Immutability Guarantee

After graph construction:

* Nodes MUST NOT be mutated
* Edges MUST NOT be altered
* Attributes MUST NOT change

Any transformation (e.g., migration) MUST create a new Canonical Graph instance.

---

# 9. Error Handling During Construction

The Builder MAY produce:

* Structural errors
* Identity errors
* Reference errors

Errors MUST:

* Include canonical path (if available)
* Include stable error code
* Be deterministic in ordering

Fatal errors MUST stop construction.

---

# 10. Circular Reference Handling

The Builder MUST:

* Detect illegal circular references
* Allow circular structures only if Specification permits
* Produce deterministic cycle detection

Cycle detection MUST be algorithmically stable.

---

# 11. Graph Integrity Guarantees

A valid Canonical Graph MUST guarantee:

* All referenced nodes exist
* No duplicate identities
* No orphaned required nodes
* Fully constructed canonical paths
* Deterministic traversal order

---

# 12. Traversal Requirements

The Canonical Graph MUST support:

* Depth-first traversal
* Breadth-first traversal
* Deterministic iteration
* Lookup by canonical path
* Lookup by node ID

Traversal order MUST be stable across executions.

---

# 13. Performance Expectations

Graph construction SHOULD:

* Be O(N + E)
* Avoid quadratic reference resolution
* Use efficient identity registries (e.g., hash maps)

Worst-case complexity MUST be documented if different.

---

# 14. Multi-Spec Considerations

If multi-spec loading is supported:

* Each spec MUST produce independent Canonical Graph
* Cross-spec references MUST be explicitly defined
* Graph merging MUST be deterministic

If unsupported, cross-spec references MUST be rejected.

---

# 15. Security Considerations

The Builder MUST:

* Avoid dynamic code execution
* Avoid reflection-based instantiation from untrusted input
* Protect against deep nesting attacks

Maximum recursion depth SHOULD be limited.

---

# 16. Output Contract

The Canonical Graph MUST expose:

```
CanonicalGraph {
    nodes: OrderedCollection<Node>
    root: Node
    lookupById(id)
    lookupByPath(path)
    traversalIterator()
}
```

The exact internal structure MAY vary but logical guarantees MUST hold.

---

# 17. Integration with Next Stages

The Canonical Graph is the sole input to:

* Canonicalization Engine
* Validation Engine
* Diff Engine
* Versioning Engine
* Migration Engine
* Event Resolution Engine

No engine may consume IR directly.

---

# 18. Non-Goals

The Canonical Graph Builder does NOT:

* Validate semantic rules
* Evaluate constraints
* Perform diff
* Classify changes
* Generate artifacts

It constructs structure only.

---

# 19. Compliance Criteria

An implementation is compliant if:

* It produces deterministic Canonical Graphs
* It enforces identity uniqueness
* It resolves references deterministically
* It guarantees immutability
* It produces stable canonical paths

---

# 20. Summary

The Canonical Graph Builder:

* Converts IR into a typed graph
* Enforces structural identity
* Resolves references
* Freezes deterministic structure
* Serves as the foundation of the entire engine
