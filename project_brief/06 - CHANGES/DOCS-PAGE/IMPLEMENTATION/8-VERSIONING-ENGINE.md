# RIGOR

# Implementation

## Versioning Engine (Normative – v0.1)

Status: Normative
Scope: Defines how RIGOR evaluates, enforces, and validates specification version changes based on a computed ChangeSet.

This document formalizes the internal behavior of the Versioning Engine and its interaction with the Diff and Validation engines.

---

# 1. Purpose

The Versioning Engine determines whether a version change between two specifications is:

* Valid
* Required
* Correctly incremented
* Compatible with the computed ChangeSet

It operates exclusively on:

* A ChangeSet (from Diff Engine)
* The previous version
* The current declared version

It MUST NOT:

* Compute diff
* Modify graphs
* Apply migrations

---

# 2. Version Model

RIGOR MUST use Semantic Versioning:

```
MAJOR.MINOR.PATCH
```

Each component MUST be:

* Non-negative integer
* No leading zeros (except 0 itself)

Pre-release and build metadata MAY be supported if defined in Specification.

---

# 3. Input and Output Contracts

## 3.1 Input

```id="v8_input_contract"
evaluateVersion(
    previousVersion: SemVer,
    currentVersion: SemVer,
    changeSet: ChangeSet
): VersionEvaluationResult
```

All inputs MUST be validated before evaluation.

---

## 3.2 Output

```id="v8_output_contract"
VersionEvaluationResult {
    status: "valid" | "invalid"
    requiredBump: "none" | "patch" | "minor" | "major"
    declaredBump: "none" | "patch" | "minor" | "major"
    violations: OrderedCollection<VersionViolation>
}
```

If violations exist → status MUST be `"invalid"`.

---

# 4. Declared Bump Calculation

The engine MUST compute declared bump as:

* major if MAJOR increased
* minor if MINOR increased and MAJOR unchanged
* patch if PATCH increased and MAJOR/MINOR unchanged
* none if identical

Any downgrade MUST be invalid.

Skipping versions is allowed unless restricted by policy.

---

# 5. Change Classification

The ChangeSet MUST be classified into:

* Non-breaking changes
* Backward-compatible additions
* Breaking changes

Classification rules MUST be deterministic.

---

## 5.1 Breaking Changes

Examples (normative concept, exact list defined by Specification):

* Removing a node
* Removing required attribute
* Changing attribute type
* Changing constraint semantics
* Changing process transition behavior

Breaking changes REQUIRE major bump.

---

## 5.2 Backward-Compatible Changes

Examples:

* Adding optional attribute
* Adding new process state without affecting existing transitions
* Adding non-required constraint

Require minor bump.

---

## 5.3 Non-Semantic Changes

Examples:

* Metadata update
* Documentation field change
* Internal ordering change (should not appear in ChangeSet)

Require patch bump.

---

# 6. Required Bump Determination

The engine MUST determine required bump as:

* major if any breaking change
* minor if no breaking but at least one compatible addition
* patch if only non-semantic changes
* none if no changes

Required bump MUST reflect highest-impact change.

---

# 7. Validation Rules

Version is valid if:

* declaredBump >= requiredBump

Invalid if:

* declaredBump < requiredBump
* version unchanged but ChangeSet not empty
* version changed but ChangeSet empty (unless allowed by policy)
* downgrade detected

---

# 8. VersionViolation Schema

```id="v8_violation_schema"
VersionViolation {
    code: string
    message: string
    expectedBump: "patch" | "minor" | "major"
    declaredBump: "none" | "patch" | "minor" | "major"
}
```

Codes MUST be stable and namespaced.

---

# 9. Determinism Requirements

The Versioning Engine MUST:

* Classify changes deterministically
* Produce identical results for identical ChangeSets
* Order violations deterministically
* Not depend on rule execution order randomness

---

# 10. Integration with Validation Engine

The Versioning Engine MAY:

* Be invoked inside Validation Engine during version phase
* Produce violations as ValidationErrors

When integrated:

* Version violations MUST map to validation errors
* Error codes MUST remain stable

---

# 11. Policy Extensibility

The engine MAY support policy configuration:

```id="v8_policy_example"
VersionPolicy {
    allowEmptyVersionBump: boolean
    allowPatchForMinor: boolean
}
```

Default policy MUST enforce strict SemVer compliance.

Policy MUST NOT alter classification rules unless explicitly documented.

---

# 12. Edge Cases

The engine MUST handle:

* First version (no previous) → no bump required
* Pre-release transitions (if supported)
* Metadata-only differences
* Multi-change classification

If multiple change types exist, highest impact MUST win.

---

# 13. Performance Expectations

The Versioning Engine SHOULD operate in:

O(C)

Where C = number of changes in ChangeSet.

It MUST NOT traverse full graph.

---

# 14. Non-Goals

The Versioning Engine does NOT:

* Compute diff
* Apply migrations
* Validate graph correctness
* Modify version field

It only evaluates compliance.

---

# 15. Compliance Criteria

An implementation is compliant if:

* It classifies changes deterministically
* It enforces SemVer rules
* It detects insufficient bump
* It rejects downgrades
* It produces stable violations

---

# 16. Summary

The Versioning Engine:

* Consumes ChangeSet
* Determines required version bump
* Validates declared version
* Produces deterministic evaluation result
* Enforces evolution discipline
