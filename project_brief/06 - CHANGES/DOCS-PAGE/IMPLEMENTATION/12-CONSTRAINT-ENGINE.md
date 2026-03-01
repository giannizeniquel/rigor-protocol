# RIGOR

# Implementation

## Constraint Engine (Normative – v0.1)

Status: Normative
Scope: Defines the evaluation, enforcement, and deterministic resolution of declarative constraints within the Canonical Graph.

This document formalizes how constraints are defined, resolved, evaluated, and integrated with the Validation Engine.

---

# 1. Purpose

The Constraint Engine is responsible for:

* Resolving constraint declarations
* Validating constraint structure
* Evaluating constraint expressions
* Detecting violations deterministically
* Producing structured constraint results

It operates over a Canonical Graph and MUST be pure.

It MUST NOT:

* Mutate the graph
* Execute runtime side effects
* Perform migrations
* Modify validation state outside its defined output

---

# 2. Conceptual Model

Constraints are declarative invariants attached to:

* Nodes
* Attributes
* Processes
* Global graph scope

They represent logical conditions that MUST hold true for the graph to be valid.

---

# 3. Input and Output Contracts

## 3.1 Input

```id="c12_input_contract"
evaluateConstraints(
    graph: CanonicalGraph
): ConstraintEvaluationResult
```

Graph MUST be canonicalized before evaluation.

---

## 3.2 Output

```id="c12_output_contract"
ConstraintEvaluationResult {
    status: "valid" | "invalid"
    violations: OrderedCollection<ConstraintViolation>
    evaluatedCount: number
}
```

If violations exist → status MUST be `"invalid"`.

---

# 4. Constraint Model

Each constraint MUST include:

```id="c12_constraint_schema"
Constraint {
    id: string
    scope: CanonicalPath | "graph"
    expression: Expression
    severity: "error" | "warning"
}
```

Constraints MUST have stable, unique IDs.

---

# 5. Constraint Scope

Scope defines evaluation context.

Allowed scopes:

* Graph-level
* Node-level
* Attribute-level
* Process-level

The engine MUST bind the constraint to its scope deterministically.

Invalid scope references MUST produce violations.

---

# 6. Expression Model

Expressions MUST be:

* Declarative
* Side-effect free
* Deterministic
* Purely evaluative

Expressions MAY reference:

* Attributes of scoped node
* Related nodes via defined edges
* Aggregated collections
* Constants

Expressions MUST NOT:

* Access external systems
* Depend on time
* Depend on randomness
* Modify state

---

# 7. Evaluation Phases

Constraint evaluation MUST occur in phases:

### Phase 1 – Resolution

* Validate scope path
* Validate referenced attributes
* Parse expression grammar

Invalid reference → violation.

---

### Phase 2 – Dependency Graph Construction

* Identify referenced nodes and attributes
* Build dependency map
* Detect circular constraint dependencies

Circular dependency MUST invalidate evaluation.

---

### Phase 3 – Expression Evaluation

* Evaluate expression per scope instance
* Collect violations
* Respect declared severity

Evaluation order MUST be deterministic.

---

# 8. Determinism Requirements

The engine MUST guarantee:

* Stable evaluation order
* Stable violation ordering
* Stable expression parsing
* Stable error codes

Ordering MUST follow:

1. Scope path (lexicographic)
2. Constraint ID (lexicographic)
3. Violation message

Identical input MUST produce identical output.

---

# 9. ConstraintViolation Schema

```id="c12_violation_schema"
ConstraintViolation {
    code: string
    constraintId: string
    path: CanonicalPath
    message: string
    severity: "error" | "warning"
}
```

Codes MUST be stable and namespaced.

---

# 10. Aggregation Constraints

The engine MUST support deterministic aggregation:

Examples:

* COUNT(collection) > 0
* ALL(states, condition)
* EXISTS(nodes, condition)

Aggregations MUST operate over canonicalized and sorted collections.

---

# 11. Cross-Node Constraints

Constraints MAY reference related nodes via edges.

The engine MUST:

* Resolve references deterministically
* Prevent infinite traversal
* Enforce acyclic evaluation

Traversal order MUST be lexicographically sorted.

---

# 12. Performance Expectations

The Constraint Engine SHOULD operate in:

O(C × N)

Where:

* C = number of constraints
* N = nodes in relevant scope

Implementations MAY cache intermediate lookups but MUST preserve determinism.

---

# 13. Integration with Validation Engine

Constraint evaluation MAY execute during Validation Phase "SEMANTIC".

Constraint violations MUST be mapped into ValidationErrors or ValidationWarnings.

Constraint IDs MUST remain stable across versions.

---

# 14. Interaction with Versioning

Constraint addition, removal, or modification MAY be classified as:

* Breaking change (if strengthens invariant)
* Minor change (if relaxes invariant)
* Patch (if metadata-only)

Classification rules MUST be defined in Versioning Engine.

---

# 15. Conflict Handling

The engine MUST detect:

* Duplicate constraint IDs
* Unresolvable attribute references
* Conflicting constraint scopes
* Invalid expression grammar

Such conditions MUST produce deterministic violations.

---

# 16. Non-Goals

The Constraint Engine does NOT:

* Auto-correct violations
* Generate suggestions
* Modify graph
* Execute runtime data validation
* Perform database-level validation

It validates specification invariants only.

---

# 17. Compliance Criteria

An implementation is compliant if:

* It evaluates constraints deterministically
* It enforces scope correctness
* It detects circular dependencies
* It produces stable violation ordering
* It integrates cleanly with Validation Engine

---

# 18. Summary

The Constraint Engine:

* Enforces declarative invariants
* Operates purely over Canonical Graph
* Guarantees deterministic evaluation
* Detects scope and dependency errors
* Integrates into validation lifecycle
