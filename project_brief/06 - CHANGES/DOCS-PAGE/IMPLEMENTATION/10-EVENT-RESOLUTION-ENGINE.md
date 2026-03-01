# RIGOR

# Implementation

## Event Resolution Engine (Normative – v0.1)

Status: Normative
Scope: Defines the evaluation, resolution, and integrity enforcement of event definitions within the Canonical Graph.

This document formalizes how events are validated for structural correctness, dependency integrity, execution semantics, and determinism.

---

# 1. Purpose

The Event Resolution Engine is responsible for:

* Resolving event references
* Validating event triggers and handlers
* Enforcing event dependency integrity
* Detecting cycles
* Producing a deterministic execution model

It operates over the Canonical Graph and produces a resolved Event Model.

It MUST NOT:

* Execute runtime events
* Perform migrations
* Mutate the Canonical Graph

---

# 2. Conceptual Model

Events in RIGOR represent declarative triggers bound to:

* Nodes
* Process transitions
* Attribute changes
* External signals (if supported)

The engine transforms declarative definitions into a Resolved Event Graph.

---

# 3. Input and Output Contracts

## 3.1 Input

```id="e10_input_contract"
resolveEvents(graph: CanonicalGraph): EventResolutionResult
```

The graph MUST be canonicalized and validated structurally before resolution.

---

## 3.2 Output

```id="e10_output_contract"
EventResolutionResult {
    status: "valid" | "invalid"
    resolvedEvents: OrderedCollection<ResolvedEvent>
    violations: OrderedCollection<EventViolation>
}
```

If violations exist → status MUST be `"invalid"`.

---

# 4. Event Model

Each event MUST define:

* id (stable and unique)
* trigger
* scope
* condition (optional)
* action

---

## 4.1 Event Schema (Canonical Form)

```id="e10_event_schema"
Event {
    id: string
    trigger: TriggerDefinition
    scope: CanonicalPath
    condition?: Expression
    action: ActionDefinition
}
```

---

# 5. Trigger Types

Supported trigger types MUST be explicitly enumerated:

* ON_CREATE
* ON_UPDATE
* ON_DELETE
* ON_STATE_ENTER
* ON_STATE_EXIT
* ON_ATTRIBUTE_CHANGE
* CUSTOM (if allowed by specification)

Trigger types MUST be stable across versions.

---

# 6. Resolution Process

Event resolution MUST occur in phases:

### Phase 1 – Scope Resolution

* Verify target path exists
* Bind event to node
* Validate trigger compatibility with node type

---

### Phase 2 – Dependency Resolution

* Resolve referenced attributes
* Resolve process states
* Resolve referenced nodes

Unresolved reference → violation.

---

### Phase 3 – Condition Validation

* Parse condition expression (if present)
* Validate referenced fields
* Enforce deterministic evaluation grammar

Invalid expression → violation.

---

### Phase 4 – Action Validation

* Validate action type
* Validate action parameters
* Ensure action target exists

---

### Phase 5 – Cycle Detection

* Build event dependency graph
* Detect direct or indirect cycles
* Reject cyclic event chains

Cycle detection MUST be deterministic.

---

# 7. ResolvedEvent Schema

```id="e10_resolved_event_schema"
ResolvedEvent {
    id: string
    trigger: TriggerType
    scope: CanonicalPath
    resolvedDependencies: string[]
    executionOrderIndex: number
}
```

Execution order MUST be deterministic.

---

# 8. Deterministic Execution Ordering

Resolved events MUST be ordered by:

1. Scope path (lexicographic)
2. Trigger precedence (stable internal mapping)
3. Event ID (lexicographic)

The same graph MUST always produce identical ordering.

---

# 9. Trigger Compatibility Rules

The engine MUST enforce:

* ON_STATE_ENTER only valid for process state nodes
* ON_ATTRIBUTE_CHANGE only valid for attribute-bearing nodes
* ON_DELETE only valid where deletion semantics exist

Invalid combinations MUST produce violations.

---

# 10. Action Types

Supported action types MAY include:

* SET_ATTRIBUTE
* TRANSITION_STATE
* EMIT_EVENT
* LOG
* CUSTOM (if allowed)

Each action type MUST define required parameters.

---

# 11. Expression Constraints

Conditions MUST:

* Be side-effect free
* Be deterministic
* Not access external systems
* Not depend on runtime values

The engine MUST validate syntax and referenced identifiers.

---

# 12. Event Dependency Graph

Dependencies include:

* Event → Node
* Event → Attribute
* Event → Process State
* Event → Other Event (if EMIT_EVENT)

The dependency graph MUST be acyclic.

---

# 13. Violation Schema

```id="e10_violation_schema"
EventViolation {
    code: string
    eventId: string
    path: CanonicalPath
    message: string
}
```

Codes MUST be stable and namespaced.

---

# 14. Integration with Validation Engine

Event resolution MAY be invoked during Validation Phase "EVENT".

If resolution fails:

* Violations MUST surface as validation errors
* Validation status MUST be invalid

---

# 15. Integration with Migration Engine

Migration MAY modify event definitions.

After migration:

* Event resolution MUST re-run
* Cycles or invalid references MUST invalidate migration

---

# 16. Performance Expectations

The engine SHOULD operate in:

O(E + D)

Where:

* E = number of events
* D = number of dependencies

Cycle detection SHOULD use deterministic graph traversal (e.g., DFS with ordered adjacency lists).

---

# 17. Non-Goals

The Event Resolution Engine does NOT:

* Execute events
* Schedule runtime triggers
* Integrate with external systems
* Perform side effects

It is purely structural and semantic validation.

---

# 18. Compliance Criteria

An implementation is compliant if:

* It resolves event references deterministically
* It detects cycles reliably
* It enforces trigger compatibility
* It validates expressions statically
* It produces stable ordering

---

# 19. Summary

The Event Resolution Engine:

* Resolves declarative events
* Enforces structural integrity
* Detects cycles
* Produces deterministic execution model
* Integrates with validation and migration
