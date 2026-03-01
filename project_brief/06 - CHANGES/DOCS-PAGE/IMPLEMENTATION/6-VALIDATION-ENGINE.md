# RIGOR

# Implementation

## Validation Engine (Normative – v0.1)

Status: Normative
Scope: Defines the architecture, contracts, lifecycle, and determinism requirements of the Validation Engine operating over the Canonical Graph.

This document supersedes any descriptive documentation and establishes the formal specification for a compliant Validation Engine.

---

# 1. Purpose

The Validation Engine evaluates a Canonical Graph against the rules defined by the RIGOR Specification.

It is responsible for:

* Structural validation
* Referential validation
* Semantic validation
* Process validation
* Event validation
* Version validation

It MUST NOT:

* Mutate the Canonical Graph
* Perform diff logic
* Apply migrations
* Generate artifacts

The Validation Engine is a pure evaluation system.

---

# 2. Input and Output Contracts

## 2.1 Input

The engine MUST accept:

```
validate(graph: CanonicalGraph, options?: ValidationOptions)
```

Where:

* `graph` MUST be canonicalized
* `options` MAY include strictness and filtering parameters

The engine MUST NOT accept raw YAML or IR.

---

## 2.2 Output

The engine MUST return a Validation Report:

```
ValidationReport {
    status: "valid" | "invalid"
    errors: OrderedCollection<ValidationError>
    warnings: OrderedCollection<ValidationWarning>
    metadata: {
        ruleCount
        executionTime
    }
}
```

`status` MUST be `"invalid"` if at least one error exists.

---

# 3. Architectural Decomposition

The Validation Engine MUST consist logically of the following components:

---

## 3.1 Rule Registry

Responsible for:

* Registering validation rules
* Providing deterministic rule ordering
* Enforcing unique rule identifiers

Each rule MUST have:

```
Rule {
    id: string
    category: RuleCategory
    severity: "error" | "warning"
    appliesTo: NodeType | "graph"
    execute(graph, context): RuleResult[]
}
```

Rule IDs MUST be stable and immutable.

---

## 3.2 Rule Executor

Responsible for:

* Iterating rules in deterministic order
* Executing rule logic
* Collecting violations
* Respecting execution phases

---

## 3.3 Validation Context

Provides:

* Graph access
* Node lookup
* Helper utilities
* Shared read-only state

The context MUST NOT allow mutation.

---

## 3.4 Error Aggregator

Responsible for:

* Collecting errors
* Enforcing deterministic ordering
* Deduplicating if necessary
* Producing final report

---

# 4. Validation Phases

Rules MUST execute in defined ordered phases.

The phases MUST be:

1. Structural
2. Referential
3. Semantic
4. Process
5. Event
6. Version

Rules within a phase MUST execute in deterministic lexicographic order of Rule ID.

A later phase MUST NOT execute if a fatal structural invariant is violated (implementation-defined threshold).

---

# 5. Rule Categories

Each rule MUST belong to one category:

* STRUCTURAL
* REFERENTIAL
* SEMANTIC
* PROCESS
* EVENT
* VERSION

Categories determine execution phase.

---

# 6. Determinism Requirements

The engine MUST guarantee:

* Stable rule execution order
* Stable error ordering
* Stable error codes
* Stable canonical paths

Given identical Canonical Graph input, output MUST be identical.

Error ordering MUST follow:

1. Canonical path (lexicographic)
2. Rule ID
3. Message

---

# 7. ValidationError Schema

Each error MUST include:

```
ValidationError {
    code: string
    ruleId: string
    path: CanonicalPath
    message: string
    severity: "error"
}
```

Warnings MUST follow:

```
ValidationWarning {
    code: string
    ruleId: string
    path: CanonicalPath
    message: string
    severity: "warning"
}
```

Codes MUST be stable across versions.

---

# 8. Strict vs Non-Strict Mode

ValidationOptions MAY include:

```
ValidationOptions {
    mode: "strict" | "non-strict"
    disabledRules?: string[]
}
```

In strict mode:

* All rules MUST execute

In non-strict mode:

* Implementation MAY downgrade specific errors to warnings
* Disabled rules MUST be excluded deterministically

Rule disabling MUST NOT alter ordering of remaining rules.

---

# 9. Short-Circuit Strategy

The engine MAY implement short-circuiting only at phase boundaries.

It MUST NOT short-circuit inside a phase in a non-deterministic way.

Example:

* If structural phase yields fatal invariant violation,
  semantic phase MAY be skipped.

This behavior MUST be documented and stable.

---

# 10. Rule Implementation Constraints

Rules MUST:

* Be pure functions
* Not mutate graph
* Not depend on global state
* Not depend on execution order side-effects
* Not modify other rule behavior

Rules MUST NOT:

* Register new rules at runtime
* Access filesystem
* Perform network calls

---

# 11. Graph Access Rules

Rules MAY:

* Traverse nodes
* Inspect attributes
* Follow edges
* Query lookup maps

Rules MUST NOT:

* Modify nodes
* Modify edges
* Add derived attributes

---

# 12. Version Validation

Version rules MUST:

* Compare declared version
* Validate semantic version format
* Enforce bump requirements (if ChangeSet provided)

If ChangeSet is not provided, version bump validation MAY be skipped.

---

# 13. Integration with Diff Engine

If validation is executed in evolution context:

```
validate(graph, { changeSet })
```

The engine MAY:

* Execute version rules
* Execute migration safety checks

Validation MUST NOT compute diff itself.

---

# 14. Performance Expectations

The engine SHOULD operate in:

O(R × N)

Where:

* R = number of rules
* N = number of nodes

Rules SHOULD avoid nested full-graph traversals.

Caching MAY be used within context but MUST be deterministic.

---

# 15. Error Codes

Error codes MUST:

* Be stable
* Be namespaced (e.g., RIGOR-VAL-001)
* Never be reused for different meanings

Removing a rule MUST deprecate its code explicitly.

---

# 16. CLI Integration

CLI behavior MUST follow:

* Exit code 0 → no errors
* Exit code 1 → validation errors present
* Exit code >1 → internal failure

Output format MUST support:

* JSON
* Human-readable text

JSON output MUST serialize ValidationReport exactly.

---

# 17. Logging

The Validation Engine MAY emit logs, but:

* Logs MUST NOT affect behavior
* Logs MUST NOT alter determinism
* Logging MUST be optional

---

# 18. Testing Requirements

The Validation Engine MUST support:

* Unit tests per rule
* Integration tests over sample graphs
* Golden tests for error output
* Determinism tests (same input, same output)
* Regression tests for rule evolution

Rule behavior MUST be independently testable.

---

# 19. Non-Goals

The Validation Engine does NOT:

* Apply changes
* Fix errors automatically
* Generate migrations
* Reorder graph
* Canonicalize graph

Canonicalization MUST occur prior.

---

# 20. Compliance Criteria

An implementation is compliant if:

* It executes rules in deterministic phased order
* It produces stable ValidationReport
* It respects immutability
* It enforces stable error codes
* It supports strict mode

---

# 21. Summary

The Validation Engine is:

* Deterministic
* Phase-driven
* Pure
* Rule-based
* Immutable in behavior

It enforces specification correctness without altering structure and provides a stable, reproducible validation result.