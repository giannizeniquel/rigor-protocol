# RIGOR Protocol

## Architectural Proposal

### Validation Matrix v0.1 (Normative Specification)

**Status:** Proposal
**Target Section:** `specification/cli.html` (Validation subsection) + nuevo documento `specification/validation-matrix.html`
**Impact Level:** High (Protocol Compliance Layer)
**Affects:** CLI, Protocol Model, Conformance Definition

---

# 1. Purpose

This document formalizes the **Validation Matrix v0.1** that defines:

* What `rigor validate` must check
* What `rigor validate --strict` must additionally enforce
* What constitutes protocol compliance
* Error classification and escalation model
* Exit code semantics

This specification transforms validation from an implementation detail into a **normative layer of the protocol**.

---

# 2. Architectural Role

The Validation Matrix becomes:

* A **core compliance contract**
* A boundary between syntactic validity and semantic rigor
* The formal definition of “Protocol-Compliant Spec”

It must be treated as normative.

---

# 3. Validation Levels

RIGOR defines two validation modes:

## 3.1 Standard Mode

Activated via:

```
rigor validate <file>
```

Purpose:

* Structural correctness
* Referential integrity
* Minimal semantic coherence

Guarantees:

* The spec is structurally usable.

Does NOT guarantee:

* Protocol invariants
* Deterministic termination properties
* Absence of unreachable states

---

## 3.2 Strict Mode

Activated via:

```
rigor validate <file> --strict
```

Purpose:

* Full protocol compliance verification.

Guarantees:

* Structural correctness
* Semantic soundness
* Protocol invariants respected
* Version compatibility
* Evolution safety

Strict mode defines **formal protocol compliance**.

---

# 4. Conformance Definition

A Spec is:

### Structurally Valid

If:

```
rigor validate spec.yaml
```

returns exit code `0`.

### Protocol-Compliant

If:

```
rigor validate spec.yaml --strict
```

returns exit code `0`.

Only Strict mode certifies protocol compliance.

This must be stated explicitly in documentation.

---

# 5. Validation Categories

Each rule belongs to a category:

| Category | Scope                  |
| -------- | ---------------------- |
| S1       | Structural             |
| S2       | Referential            |
| S3       | Semantic               |
| S4       | Protocol Invariants    |
| S5       | Evolution & Versioning |
| S6       | Best Practices         |

---

# 6. Full Validation Matrix (v0.1)

## S1 — Structural

| ID | Rule                         | Standard | Strict |
| -- | ---------------------------- | -------- | ------ |
| V1 | Valid YAML syntax            | ERROR    | ERROR  |
| V2 | Required root fields present | ERROR    | ERROR  |
| V3 | Field types match schema     | ERROR    | ERROR  |
| V4 | No unknown root-level fields | ERROR    | ERROR  |

---

## S2 — Referential Integrity

| ID | Rule                       | Standard | Strict |
| -- | -------------------------- | -------- | ------ |
| V5 | `initial_state` exists     | ERROR    | ERROR  |
| V6 | Transition `target` exists | ERROR    | ERROR  |
| V7 | Referenced event declared  | ERROR    | ERROR  |
| V8 | `event_id` unique          | ERROR    | ERROR  |
| V9 | `state_id` unique          | ERROR    | ERROR  |

---

## S3 — Semantic Validity

| ID  | Rule                                       | Standard | Strict |
| --- | ------------------------------------------ | -------- | ------ |
| V10 | Terminal state has no outgoing transitions | ERROR    | ERROR  |
| V11 | No duplicate transitions (state,event)     | ERROR    | ERROR  |
| V12 | Guards syntactically valid                 | ERROR    | ERROR  |
| V13 | Guards reference only allowed scope        | WARNING  | ERROR  |

Allowed guard scope:

* `context.*`
* `payload.*`

No global/system scope allowed.

---

## S4 — Protocol Invariants

| ID  | Rule                                 | Standard | Strict |
| --- | ------------------------------------ | -------- | ------ |
| V14 | No unreachable states                | WARNING  | ERROR  |
| V15 | At least one terminal state exists   | ERROR    | ERROR  |
| V16 | At least one terminating path exists | WARNING  | ERROR  |
| V17 | No infinite cycle without exit       | WARNING  | ERROR  |

---

## S5 — Evolution & Versioning

| ID  | Rule                           | Standard | Strict |
| --- | ------------------------------ | -------- | ------ |
| V18 | `rigor_spec_version` supported | ERROR    | ERROR  |
| V19 | `spec_version` valid SemVer    | ERROR    | ERROR  |
| V20 | No deprecated fields used      | WARNING  | ERROR  |

---

## S6 — Best Practices

| ID  | Rule                         | Standard | Strict  |
| --- | ---------------------------- | -------- | ------- |
| V21 | Canonical section ordering   | WARNING  | WARNING |
| V22 | Naming conventions respected | WARNING  | WARNING |

S6 never escalates to ERROR in Strict mode.

---

# 7. Severity Semantics

## ERROR

* Spec invalid.
* Exit code = 1.
* Validation halts after evaluation completes.

## WARNING

* Spec remains valid in Standard.
* In Strict:

  * S3, S4, S5 warnings escalate to ERROR.
  * S6 remains WARNING.

---

# 8. Exit Code Semantics

| Condition                | Exit Code |
| ------------------------ | --------- |
| No errors                | 0         |
| ≥1 ERROR                 | 1         |
| Internal runtime failure | ≥2        |

Exit codes must be deterministic.

---

# 9. Determinism Requirements

Validation must be:

* Pure (no side effects)
* Deterministic
* Independent of system clock
* Independent of external services

Given same input, output must be identical.

---

# 10. Algorithmic Notes (Normative Expectations)

The implementation MUST include:

### Reachability Check (V14)

* Graph traversal (DFS or BFS)
* Starting from `initial_state`
* Mark reachable nodes
* All unmarked → unreachable

### Infinite Cycle Detection (V17)

* Detect strongly connected components
* For each SCC:

  * If no path to terminal → violation

### Termination Path Check (V16)

* At least one path from initial to terminal
* Graph search with early stop

These are required behaviors, even if algorithm details are left to implementation.

---

# 11. CLI Documentation Impact

The following must be updated in `cli.html`:

1. Add “Validation Modes” section
2. Add full severity model explanation
3. Define compliance formally
4. Clarify exit code semantics
5. Reference Validation Matrix as normative

---

# 12. New Documentation Page

Create:

```
specification/validation-matrix.html
```

Content structure:

1. Purpose
2. Validation Levels
3. Conformance Definition
4. Categories
5. Full Matrix Table
6. Severity Model
7. Algorithmic Guarantees
8. Determinism
9. Versioning of Matrix

Version tag:

```
Validation Matrix: v0.1
Protocol Compatibility: RIGOR Core v0.1
```

---

# 13. Versioning Policy

Validation Matrix must evolve via:

* Minor version → add new WARNING rules
* Major version → add new ERROR rules or change severity

The CLI must display:

```
RIGOR Validation Matrix v0.1
```

in `--version` output.

---

# 14. Architectural Significance

This formalization:

* Moves RIGOR from DSL to protocol
* Defines measurable compliance
* Enables tooling interoperability
* Enables certification
* Prepares ecosystem for generators and runtime engines

Without a validation matrix, protocol boundaries are ambiguous.

With it, protocol compliance becomes objective.

---

# 15. Freeze Recommendation

Proposed freeze:

* CLI Grammar v0.1
* Validation Matrix v0.1

This establishes:

* Stable CLI interface
* Stable compliance contract
* Stable protocol core

---

# 16. Open Architectural Questions (For Architect Review)

1. Should infinite cycle detection be mandatory in v0.1 or deferred to v0.2?
2. Should S6 escalate in Strict in future versions?
3. Should validation allow plugin rule injection in v0.x?
4. Should matrix version be independent from protocol version?

These require explicit architectural decision.

---

# 17. Implementation Complexity Estimate

Medium-high.

Requires:

* Schema validator
* Graph model builder
* DFS/SCC algorithm
* SemVer parser
* Deterministic output formatter

---

# 18. Final Statement

Approval of this document formally defines:

Protocol compliance in RIGOR.

It is a foundational decision.

---
