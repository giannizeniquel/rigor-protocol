Below is a **technical design document** for the Architect.
Scope: formalization of the **Graph Model used by the RIGOR validation engine**.
This extends the current Specification and integrates with:

* Identity Core
* Protocol Model
* CLI Grammar v0.1
* Validation Matrix

This document defines the canonical validation graph abstraction.

---

# RIGOR Specification Extension

## Graph Model for Validation (GMV v0.1)

**Status:** Draft – Architect Review Required
**Layer:** Specification
**Audience:** Architect → Builder

---

# 1. Objective

Define a **formal graph abstraction** representing RIGOR artifacts during validation.

The Graph Model is:

* Deterministic
* Immutable during validation
* Environment-agnostic
* Independent from CLI implementation
* Compatible with AI-generated artifacts

The graph serves as the canonical internal representation for:

* Identity resolution
* Reference validation
* Structural validation
* Constraint propagation
* Rule execution

---

# 2. Conceptual Overview

RIGOR artifacts form a **directed, typed graph**:

* Nodes represent semantic entities.
* Edges represent typed relationships.
* Constraints operate on subgraphs.
* Validation operates over graph traversal.

Formally:

```
G = (N, E, Tn, Te, C)
```

Where:

* N = Set of Nodes
* E = Set of Edges
* Tn = Node Types
* Te = Edge Types
* C = Constraint Set

---

# 3. Node Model

## 3.1 Node Definition

Each node is defined as:

```
Node {
    id: Identity
    type: NodeType
    attributes: Map<Key, Value>
    metadata: Map<Key, Value>
}
```

### Required Properties

* `id` → globally unique (Identity Core compliant)
* `type` → declared NodeType
* `attributes` → schema-bound properties
* `metadata` → non-semantic operational data

---

## 3.2 Node Types (Initial Set)

| Type         | Description                  |
| ------------ | ---------------------------- |
| Entity       | Business-level domain entity |
| Rule         | Constraint definition        |
| Field        | Attribute of an Entity       |
| Module       | Logical grouping             |
| Relationship | Abstract association model   |
| Constraint   | Validation constraint        |
| Artifact     | Root specification file      |
| Environment  | Context definition           |

Architect must validate:

* Are these types minimal?
* Should Constraint and Rule remain separate?
* Should Relationship be a node or purely edge-driven?

---

# 4. Edge Model

## 4.1 Edge Definition

```
Edge {
    id: EdgeID
    from: NodeID
    to: NodeID
    type: EdgeType
    attributes: Map<Key, Value>
}
```

Edges are:

* Directed
* Typed
* Non-nullable
* Non-ambiguous

---

## 4.2 Edge Types (Initial Set)

| Type       | Meaning                 |
| ---------- | ----------------------- |
| DEFINES    | Artifact defines Entity |
| HAS_FIELD  | Entity → Field          |
| REFERENCES | Any node → Any node     |
| DEPENDS_ON | Module → Module         |
| VALIDATES  | Rule → Entity           |
| CONSTRAINS | Constraint → Node       |
| BELONGS_TO | Node → Module           |

Architect must validate:

* Should cardinality be encoded at edge level?
* Should VALIDATES and CONSTRAINS be merged?

---

# 5. Identity Constraints

All Node.id values must satisfy:

* Identity Core format
* Namespace uniqueness
* Cross-file uniqueness (unless explicitly scoped)

Graph validation must detect:

* Duplicate IDs
* Colliding namespaces
* Cyclic namespace inheritance (if introduced later)

---

# 6. Graph Construction Phase

Graph construction occurs before validation rules execute.

Pipeline:

```
Parse → Normalize → Resolve Identity → Build Graph → Freeze Graph → Validate
```

## 6.1 Deterministic Build

Given identical input artifacts:

* Graph must be identical.
* Node ordering must not affect structure.
* Edge resolution must be order-independent.

---

# 7. Validation over Graph

Validation operates as:

* Node-level validation
* Edge-level validation
* Subgraph validation
* Global invariants

---

# 7.1 Structural Validation

Examples:

* Every Entity must have ≥1 Field
* Rule must target existing Node
* No dangling REFERENCES edges

---

# 7.2 Referential Validation

For every REFERENCES edge:

* Target must exist
* Target must be type-compatible
* Cardinality must match rule definition

---

# 7.3 Cycle Detection

Required detection:

* Dependency cycles
* Validation cycles
* Forbidden self-references

Cycle policy:

| Edge Type  | Cycles Allowed? |
| ---------- | --------------- |
| DEPENDS_ON | No              |
| REFERENCES | Yes             |
| VALIDATES  | No              |

Architect must confirm policies.

---

# 8. Constraint Propagation

Constraints can:

* Attach to Node
* Attach to Edge
* Attach to NodeType

Constraint execution order:

1. Local node constraints
2. Edge constraints
3. Type-level constraints
4. Global constraints

This ensures deterministic failure reporting.

---

# 9. Subgraph Extraction

Validation engine must support:

```
subgraph(rootNodeID, depth)
```

Use cases:

* Scoped validation
* Partial artifact validation
* Module isolation

Architect decision required:

* Should subgraph extraction be exposed via CLI?
* Or internal only?

---

# 10. Error Localization Model

Each validation error must include:

```
ValidationError {
    code
    severity
    nodeID
    edgeID (optional)
    path
    message
}
```

Path = ordered traversal from root artifact to failing node.

This enables:

* Deterministic error formatting
* Machine-consumable output
* IDE integration

---

# 11. Strict Mode Implications

When CLI runs with `--strict`:

Graph-level constraints must additionally enforce:

* No unused nodes
* No unreachable nodes
* No ambiguous references
* No implicit type coercions
* No circular soft dependencies

Strict mode operates at graph invariants level.

---

# 12. Immutability Model

After graph freeze:

* Nodes cannot be mutated.
* Edges cannot be added.
* Constraint set cannot change.

Any transformation must generate a new graph instance.

This guarantees:

* Referential transparency
* Reproducible validation

---

# 13. Serialization Model

Graph must support canonical serialization:

```
rigor graph --format=json
```

Properties:

* Stable ordering
* Deterministic hashing
* Hash used for caching and CI pipelines

---

# 14. Performance Considerations

Initial version (v0.1):

* In-memory graph
* Single-threaded validation
* O(N + E) traversal complexity

Future considerations (v0.2+):

* Incremental validation
* Parallel subgraph validation
* Persistent graph cache

---

# 15. Open Architectural Questions

Architect must resolve:

1. Are Nodes fully normalized or partially denormalized?
2. Do we allow polymorphic node types?
3. Should constraints be nodes or external metadata?
4. Should graph allow versioned nodes?
5. Do we enforce DAG at global level?

---

# 16. Required Builder Deliverables (After Approval)

* GraphBuilder interface
* ImmutableGraph implementation
* Node/Edge type registry
* Validation traversal engine
* Cycle detection algorithm
* Canonical serializer
* Graph hashing mechanism

---

# 17. Specification Placement

This document should become:

```
Specification → Validation → Graph Model
```

New page:

```
/specification/graph-model.html
```

Cross-links required from:

* Identity Core
* Protocol Model
* CLI
* Validation Matrix

---

# 18. Summary

The Graph Model formalizes:

* How artifacts are represented internally.
* How validation operates deterministically.
* How strict mode enforces graph invariants.
* How RIGOR remains machine-derivable.

This is a foundational piece.
Without this formalization, the Validation Matrix remains abstract.

---
