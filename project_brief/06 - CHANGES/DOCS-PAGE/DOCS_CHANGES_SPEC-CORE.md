# RIGOR – Architect Document

## Specification Update Proposal

### Page: `spec-core.html`

### Strategy: Normative Hybrid (Conceptual + Formal, no runtime internals)

---

# 1. Objective

Redefine **Process Core Specification** to:

* Strengthen semantic guarantees
* Explicitly declare mutability rules
* Formalize transactional behavior (conceptual level)
* Introduce invariants
* Avoid runtime/algorithmic implementation detail
* Keep Validation Matrix and graph algorithms in Implementation section

This document defines:

* What must change
* What must be added
* What remains
* Proposed structure
* Normative language to introduce

---

# 2. Structural Refactor Proposal

## Current Problem (High Level)

The page describes processes but:

* Does not formally declare invariants
* Does not explicitly define atomicity rules
* Does not formalize mutation restrictions
* Does not define event ownership model
* Does not define terminal state constraints
* Does not define determinism guarantees clearly

---

# 3. Proposed Final Structure

```
1. Introduction
2. Process Definition
3. Process Structure
4. State Model
5. Event Model
6. Transition Model
7. Context Schema
8. Mutation Declaration Model (NEW)
9. Transactional Semantics (NEW)
10. Invariants (NEW)
11. Terminal States (NEW)
12. Determinism Guarantee (NEW)
13. Minimal Example
```

---

# 4. Section-by-Section Changes

---

## 4.1 Introduction (Refined)

### Keep:

High-level explanation.

### Add:

Explicit positioning:

> A RIGOR Process is a deterministic, event-driven state machine where all mutations are restricted to declared transitions and executed atomically per event.

---

## 4.2 Process Definition (Clarify Normatively)

Add formal constraints:

A Process MUST define:

* A unique identity
* A finite set of states
* An initial state
* A finite set of transitions
* A context schema

A Process MUST NOT:

* Mutate state outside transitions
* Emit side effects outside event handling

---

## 4.3 Process Structure

Add formal JSON skeleton example:

```json
{
  "process": "OrderProcess",
  "initial": "Pending",
  "states": [...],
  "context": {...},
  "transitions": [...]
}
```

Clarify:

* Structure is declarative
* No executable logic allowed
* No imperative constructs

---

## 4.4 State Model (Formalize)

Add constraints:

* States MUST be finite
* State names MUST be unique
* Initial state MUST exist in declared states

Optional (if desired):
Allow terminal state declaration explicitly.

---

## 4.5 Event Model (Clarification Required)

Add explicit rule:

* Events MAY be external or internally enqueued
* All events MUST be processed sequentially
* Each event processing cycle forms one transactional boundary

Do not define queue implementation (belongs to Implementation section).

---

## 4.6 Transition Model (Critical Enhancement)

Define transition structure formally:

```
(current_state, event) -> (next_state, mutations)
```

Add constraints:

* A transition MUST define:

  * from
  * on
  * to
* A transition MAY define:

  * mutate (explicit list of fields)

Add prohibition:

* Transitions MUST NOT mutate fields not explicitly declared.

---

# 5. NEW SECTION – Mutation Declaration Model

## Purpose

Enforce strong immutability and explicit change declaration.

---

## Required Addition

Each transition MUST declare allowed mutations explicitly.

Example:

```json
{
  "from": "Pending",
  "on": "Approve",
  "to": "Approved",
  "mutate": ["approvedAt", "approvedBy"]
}
```

Rules:

* Fields not listed are immutable during that transition.
* Omitted `mutate` = no context mutation allowed.
* The `mutate` list MUST reference valid context schema fields.

Normative Rule:

> A transition that modifies context fields not declared in its mutate list is invalid.

---

# 6. NEW SECTION – Transactional Semantics

Define conceptually:

* Each event is processed atomically.
* State transition + mutations are applied as a single logical unit.
* Partial application is forbidden.

Normative:

> Processing of a single event MUST result in exactly one of:
>
> * A successful atomic transition
> * A rejected event (no mutation, no state change)

No retry semantics defined here.

---

# 7. NEW SECTION – Invariants

Introduce process-level invariants:

### 7.1 Structural Invariants

* Single initial state
* All transitions reference valid states
* No duplicate transition (same from + event)

### 7.2 Runtime Invariants (Conceptual)

* State always belongs to declared set
* Context always conforms to declared schema
* Mutations only occur via transitions
* Exactly one transition may match a (state, event) pair

---

# 8. NEW SECTION – Terminal States

Define:

A terminal state is a state with:

* No outgoing transitions.

Normative rule:

> Once a process reaches a terminal state, it MUST NOT accept further events.

Optional future extension:
Explicit `terminal: true` declaration (can defer).

---

# 9. NEW SECTION – Determinism Guarantee

This is critical for RIGOR identity.

Define:

> For any given state and event, there MUST be at most one valid transition.

Implications:

* No ambiguity allowed
* No guard conditions (unless formally declared later)
* No runtime decision branching

This ensures:

* Predictable execution
* AI-friendly interpretation
* Strong validation

---

# 10. What Must NOT Be Added Here

Do NOT include:

* Validation Matrix
* Graph traversal algorithm
* Strict mode details
* CLI validation logic
* Exit codes
* Error taxonomy
* Internal event queue design

Those belong in Implementation.

---

# 11. Example Section

Include one minimal but complete example:

* States
* Context
* Transitions
* Explicit mutate declarations
* Terminal state

Example must demonstrate:

* One mutating transition
* One non-mutating transition
* Deterministic mapping

---

# 12. Language Strengthening (Normative Keywords)

Throughout the page, adopt RFC-style keywords:

* MUST
* MUST NOT
* SHOULD
* MAY

This elevates the page from descriptive to normative.

---

# 13. What Remains Unchanged

* Conceptual introduction
* Overall explanation of state machine model
* High-level examples (refined but not removed)

---

# 14. Impact Analysis

## Positive Effects

* Aligns specification with prior architectural decisions
* Enforces immutability discipline
* Clarifies atomicity model
* Supports future validator formalization
* Improves community credibility
* Makes RIGOR clearly different from loose DSLs

## No Breaking Conceptual Changes

This is a clarification and formal strengthening, not a redesign.

---

# 15. Summary of Additions

| Area                 | Action                        |
| -------------------- | ----------------------------- |
| Mutability           | Explicit declaration required |
| Transaction model    | Conceptually defined          |
| Determinism          | Normatively guaranteed        |
| Invariants           | Explicitly listed             |
| Terminal states      | Defined formally              |
| Ambiguity prevention | Enforced                      |

---

# 16. Approval Criteria for Architect

The Architect should validate:

1. Separation of concerns (Spec vs Implementation)
2. No leakage of runtime mechanics
3. Normative clarity
4. Backward conceptual compatibility
5. Alignment with RIGOR Core v0.1 freeze goal

---

If approved, the Builder can:

* Refactor `spec-core.html`
* Insert new sections
* Strengthen wording
* Add examples
* Maintain conceptual clarity

---

If you want, next step we can:

* Move to the next Process Specification document
  or
* Tighten the formal definition of Context Schema constraints
  or
* Begin drafting the Implementation-side validator behavior for Process Core.
