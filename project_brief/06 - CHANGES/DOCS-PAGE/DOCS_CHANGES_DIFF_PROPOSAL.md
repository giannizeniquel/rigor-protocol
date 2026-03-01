# RIGOR Specification

## Diff v0.1 (Normative)

Status: Draft
Version: 0.1
Scope: Normative

---

# 1. Scope

This document defines the normative specification for computing and classifying differences between two RIGOR specifications.

The Diff process MUST:

* Operate on the Canonical Graph Representation.
* Be deterministic.
* Be order-independent.
* Produce a structured ChangeSet.
* Classify changes as Breaking or NonBreaking.

Diff is defined as:

```
Diff(Graph_A, Graph_B) → ChangeSet
```

This specification does not define textual comparison. It defines semantic structural comparison.

---

# 2. Canonical Comparison Model

Before diffing, both specifications MUST be:

1. Validated.
2. Normalized.
3. Canonicalized according to the Graph Model specification.

If either specification fails validation, the Diff process MUST abort.

Canonicalization MUST remove:

* Textual ordering variance
* Formatting variance
* Non-semantic metadata

Diff MUST operate exclusively on canonical graphs.

---

# 3. Change Detection

Diff MUST detect structural and semantic changes between Graph_A and Graph_B.

Detected changes MUST be represented as atomic operations.

## 3.1 Structural Change Types

* NodeAdded
* NodeRemoved
* NodeRenamed
* EdgeAdded
* EdgeRemoved

## 3.2 Property Change Types

* PropertyAdded
* PropertyRemoved
* PropertyModified
* TypeChanged

## 3.3 Constraint Change Types

* ConstraintStrengthened
* ConstraintWeakened
* CardinalityChanged

Each change MUST include:

* type
* path
* before (if applicable)
* after (if applicable)

---

# 4. Breaking Change Classification

## 4.1 Formal Definition

A change is Breaking if and only if:

```
∃ instance I :
Validate(I, Spec_A) = valid
AND
Validate(I, Spec_B) = invalid
```

If such an instance exists, the change MUST be classified as Breaking.

If no such instance can exist under structural analysis rules, the change MUST be classified as NonBreaking.

Diff implementations MUST NOT perform runtime instance validation. Classification MUST be rule-based and deterministic.

---

## 4.2 Classification Function

```
Classify(Change C) → {Breaking, NonBreaking}
```

Classification MUST follow the rules defined below in fixed order.

---

## 4.3 Node-Level Rules

### Rule N1 — NodeRemoved

NodeRemoved MUST be Breaking.

---

### Rule N2 — NodeAdded

If the added node is optional → NonBreaking.
If the added node is required → Breaking.

---

### Rule N3 — NodeRenamed

NodeRenamed MUST be Breaking unless an explicit migration mapping exists.
Migration mappings are outside the scope of Diff v0.1.

---

## 4.4 Property-Level Rules

### Rule P1 — PropertyRemoved

PropertyRemoved MUST be Breaking.

---

### Rule P2 — PropertyAdded

If required = false → NonBreaking.
If required = true → Breaking.

---

### Rule P3 — TypeChanged

TypeChanged MUST be Breaking.

---

## 4.5 Constraint Rules

### Rule C1 — ConstraintStrengthened

A constraint is strengthened if it reduces the valid input domain.

Examples:

* minLength increased
* maxValue decreased
* pattern more restrictive

ConstraintStrengthened MUST be Breaking.

---

### Rule C2 — ConstraintWeakened

A constraint is weakened if it expands the valid input domain.

Examples:

* minLength decreased
* maxValue increased
* pattern less restrictive

ConstraintWeakened MUST be NonBreaking.

---

## 4.6 Cardinality Rules

### Rule K1 — Cardinality Relaxed

If cardinality expands the allowed range:

Examples:

* 1 → 0..1
* 1 → 0..*
* 1..* → 0..*

Cardinality relaxation MUST be NonBreaking.

---

### Rule K2 — Cardinality Restricted

If cardinality reduces the allowed range:

Examples:

* 0..1 → 1
* 0..* → 1..*
* 1..* → 1

Cardinality restriction MUST be Breaking.

---

## 4.7 Edge-Level Rules

### Rule E1 — EdgeRemoved

EdgeRemoved MUST be Breaking.

---

### Rule E2 — EdgeAdded

If the new edge introduces a required relationship → Breaking.
If optional → NonBreaking.

---

## 4.8 Composite Change Evaluation

Each atomic change MUST be classified independently.

If any change in the ChangeSet is Breaking:

```
ChangeSet.breaking = true
```

If no changes are Breaking:

```
ChangeSet.breaking = false
```

---

# 5. Versioning Consistency Validation

After classification, Diff MUST validate semantic version consistency.

Let:

* Version_A = MAJOR_A.MINOR_A.PATCH_A
* Version_B = MAJOR_B.MINOR_B.PATCH_B

## 5.1 Major Version Rule

If BreakingChanges > 0
AND MAJOR_B ≤ MAJOR_A
THEN VersioningError MUST be raised.

---

## 5.2 Minor Version Rule

If BreakingChanges = 0
AND MINOR_B < MINOR_A
THEN VersioningError MUST be raised.

---

Versioning validation MUST NOT mutate ChangeSet.

---

# 6. ChangeSet Output Structure

Diff MUST produce a structured output in JSON-compatible format.

Example:

```json
{
  "from": "1.0.0",
  "to": "1.1.0",
  "changes": [
    {
      "type": "PropertyAdded",
      "path": "/entities/User/email",
      "breaking": false
    }
  ],
  "summary": {
    "total": 1,
    "breaking": 0,
    "nonBreaking": 1
  },
  "breaking": false
}
```

Fields:

* from (required)
* to (required)
* changes (required)
* summary (required)
* breaking (required)

Output MUST be deterministic and canonically ordered by path.

---

# 7. Determinism Requirements

An implementation of Diff MUST:

* Produce identical ChangeSet for identical graph pairs.
* Not depend on file ordering.
* Not depend on runtime data.
* Not depend on external services.
* Not rely on instance sampling.
* Apply classification rules in fixed order.

---

# 8. CLI Integration (Informative but Binding for Implementations)

Expected command:

```
rigor diff specA.yaml specB.yaml
```

Optional flags MAY include:

* --format json
* --summary
* --strict
* --classify

CLI behavior MUST conform to this specification.

---

# 9. Error Conditions

Diff MUST fail if:

* Either specification is invalid.
* Canonicalization fails.
* Versions are malformed.
* Versioning rules are violated (when strict mode enabled).

---

# 10. Security and Integrity

Diff MUST:

* Operate offline.
* Not execute external code.
* Not modify input specifications.
* Not require network access.

---

# 11. Extensibility

Future versions MAY:

* Introduce alternative rulesets.
* Support migration-aware classification.
* Support rename detection with equivalence mapping.

Such extensions MUST version the ruleset explicitly.

---

# 12. Normative Guarantees

A compliant Diff implementation guarantees:

* Structural completeness of change detection.
* Deterministic classification of breaking changes.
* Semantic alignment with Versioning.
* Compatibility with Migration specification.

---

End of Diff v0.1 (Normative)
