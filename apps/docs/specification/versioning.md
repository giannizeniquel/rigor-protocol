# Versioning Specification (v0.1)

## 1. Purpose & Scope

This document defines the formal versioning model for RIGOR Core v0.1. It establishes the rules for version identifiers, semantic increments, compatibility guarantees, and validation behavior.

Versioning is a formal structural constraint in RIGOR, required for deterministic evolution and safe migrations of persistent process instances.

## 2. Version Identifiers

RIGOR uses two independent version identifiers that **MUST** appear at the root level of every specification:

| Field | Scope | Purpose | Format |
| :--- | :--- | :--- | :--- |
| `rigor_spec_version` | Language/Core | Version of the RIGOR language specification. | `"MAJOR.MINOR"` |
| `spec_version` | Process | Version of the specific process definition. | `"MAJOR.MINOR.PATCH"` |

### 2.1 `rigor_spec_version`
Represents the version of the RIGOR language used to interpret the document. Engines **MUST** reject unsupported MAJOR versions.

### 2.2 `spec_version`
Represents the version of the specific process implementation (states, events, transitions, and context). It is mandatory for all process specifications.

## 3. Semantic Versioning Rules

RIGOR enforces a strict interpretation of Semantic Versioning for structural changes.

### 3.1 MAJOR (Breaking Changes)
**MUST** increment when a change invalidates backward compatibility.
**Triggers:**
- Removing or renaming an existing state or event.
- Changing the type of a context field.
- Removing a mandatory context field.
- Modifying the transition logic for an existing state/event pair.
- Changing the `initial_state`.
- Converting an optional field into a mandatory one.

### 3.2 MINOR (Backward-Compatible)
**MAY** increment for backward-compatible structural additions.
**Triggers:**
- Adding a new Event or State (provided it's not the new initial state).
- Adding a new transition.
- Adding an optional field to the context or event payload.

### 3.3 PATCH (Non-Structural)
**MAY** increment for non-breaking adjustments without behavioral impact.
**Triggers:**
- Documentation updates.
- Improving clarity of error or log messages.
- Fixing typos in non-normative fields.

## 4. Compatibility Rules

### 4.1 Engine Compatibility
The Engine **MUST** reject unsupported `rigor_spec_version` MAJOR and **SHOULD** accept equal or lower MINOR versions within the same MAJOR.

### 4.2 Process Compatibility
A MAJOR increment in `spec_version` indicates a breaking change that requires a migration path. PATCH and MINOR increments are considered fully compatible.

## 5. Version Range Support (Optional)

Engines **SHOULD** support range operators for compatibility checks. Range support is optional in Core v0.1 but recommended for future-proofing.

| Operator | Description |
| :--- | :--- |
| `=` | Exact match |
| `>` | Greater than |
| `>=` | Greater than or equal |
| `<` | Less than |
| `<=` | Less than or equal |
| `^` | Compatible (e.g., ^1.0.0 means >=1.0.0 <2.0.0) |
| `~` | Tilde (e.g., ~1.0.0 means >=1.0.0 <1.1.0) |

## 6. Validation Behavior & Determinism

Version validation **MUST** occur before structural validation. The evaluation **MUST** be deterministic.

**Validation Order:**
1. Validate version string format.
2. Validate Engine compatibility (rigor_spec_version).
3. Validate semantic compatibility (spec_version).
4. Proceed to structural validation.

If version validation fails, the engine **MUST** abort the process immediately.

## 7. Error Taxonomy

| Code | Condition | Severity |
| :--- | :--- | :--- |
| `ER-INVALID-VERSION-STRING` | Version identifier does not follow mandated format. | Error |
| `ER-UNSUPPORTED-RIGOR-SPEC` | `rigor_spec_version` is outside engine capability. | Error |
| `ER-VERSION-INCOMPATIBLE` | Spec version violates compatibility rules. | Error |
| `ER-VERSION-RANGE-UNSATISFIED` | Version not within declared optional range. | Error |

## 8. Interaction with CLI

The CLI **MUST** validate versions before running any command (validate, format, generate). In `--strict` mode, any version-related warning or mismatch is treated as a fatal error.

## 9. Examples

### Valid Example
```yaml
rigor_spec_version: "0.1"
spec_version: "1.2.0"
```

### Invalid: Breaking Change Without MAJOR Increment
```yaml
# INVALID: Removed a state but kept version 1.x
rigor_spec_version: "0.1"
spec_version: "1.3.0" # Should be 2.0.0
```

### Invalid: Unsupported Core Version
```yaml
# INVALID: Engine only supports 0.x
rigor_spec_version: "1.0"
```

## 10. Cross-References
* See [SPEC-REFERENCE](./spec-reference)
* See [Validation Matrix](./validation-matrix)
* See [Protocol Model](./protocol-model)
