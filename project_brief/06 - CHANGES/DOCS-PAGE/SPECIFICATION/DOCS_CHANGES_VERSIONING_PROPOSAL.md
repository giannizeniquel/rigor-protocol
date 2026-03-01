# SPEC-VERSIONING.md — RIGOR Versioning Specification v0.1

## 1. Purpose

This document defines the formal versioning model for RIGOR Core v0.1.

It establishes:

* Version identifiers
* Semantic Versioning rules
* Compatibility guarantees
* Validation behavior
* Error taxonomy
* Integration with CLI and Engine

Versioning is mandatory for all RIGOR specifications.

---

# 2. Version Identifiers

RIGOR uses two independent version identifiers:

| Field                | Scope         | Purpose                                                 |
| -------------------- | ------------- | ------------------------------------------------------- |
| `rigor_spec_version` | Language/Core | Defines the version of the RIGOR specification language |
| `spec_version`       | Process       | Defines the version of the specific process definition  |

Both fields MUST appear at the root level of every RIGOR specification.

---

## 2.1 `rigor_spec_version`

### Definition

Represents the version of the RIGOR language specification used to interpret the document.

### Format

```
MAJOR.MINOR
```

Example:

```yaml
rigor_spec_version: "0.1"
```

### Rules

1. Must match supported Engine versions.
2. Engine MUST reject unsupported MAJOR versions.
3. MINOR versions MAY introduce backward-compatible extensions.
4. Breaking grammar or semantic changes require MAJOR increment.

---

## 2.2 `spec_version`

### Definition

Represents the version of the specific process specification.

### Format

```
MAJOR.MINOR.PATCH
```

Example:

```yaml
spec_version: "1.0.0"
```

### Mandatory

All process specifications MUST define `spec_version`.

---

# 3. Semantic Versioning Rules

RIGOR adopts a strict interpretation of Semantic Versioning.

---

## 3.1 MAJOR

Increment when:

* Removing states
* Removing events
* Changing transition semantics
* Altering required payload fields
* Any backward-incompatible change

MAJOR increments invalidate backward compatibility.

---

## 3.2 MINOR

Increment when:

* Adding new optional events
* Adding new states not affecting existing transitions
* Adding optional payload fields
* Backward-compatible enhancements

MINOR increments preserve compatibility.

---

## 3.3 PATCH

Increment when:

* Clarifying documentation
* Fixing non-semantic errors
* Correcting typos
* Adjusting metadata without behavioral impact

PATCH increments preserve full compatibility.

---

# 4. Compatibility Rules

## 4.1 Engine Compatibility

Engine MUST:

* Reject unsupported `rigor_spec_version` MAJOR
* Accept supported MAJOR with equal or lower MINOR
* Reject unsupported MAJOR

Example:

Engine supports: `0.1`

| Spec Version | Result |
| ------------ | ------ |
| 0.1          | Accept |
| 0.2          | Reject |
| 1.0          | Reject |

---

## 4.2 Process Compatibility

For `spec_version`:

| Change Type | Compatible |
| ----------- | ---------- |
| PATCH       | Yes        |
| MINOR       | Yes        |
| MAJOR       | No         |

A MAJOR increment indicates breaking change.

---

# 5. Version Ranges (Optional Support)

RIGOR MAY support version range syntax.

Allowed operators:

* `>=`
* `>`
* `<=`
* `<`
* Exact match

Example:

```yaml
rigor_spec_version: ">=0.1 <1.0"
spec_version: ">=1.0.0 <2.0.0"
```

If version does not satisfy declared range → validation error.

Range support is optional in Core v0.1 but recommended for future tooling.

---

# 6. Validation Behavior

Version validation MUST occur before structural validation.

Validation order:

1. Validate version string format
2. Validate Engine compatibility
3. Validate semantic compatibility
4. Proceed to structural validation

If version validation fails → abort validation process.

---

# 7. Error Codes

| Code                         | Condition                                 |
| ---------------------------- | ----------------------------------------- |
| ER-INVALID-VERSION-STRING    | Version format invalid                    |
| ER-UNSUPPORTED-RIGOR-SPEC    | Engine does not support MAJOR             |
| ER-VERSION-INCOMPATIBLE      | Spec version violates compatibility rules |
| ER-VERSION-RANGE-UNSATISFIED | Version not within declared range         |

---

## Example Error

```
RIGOR-ER-VERSION-INCOMPATIBLE

Spec version: 1.2.0
Expected: >=2.0.0
Location: root.spec_version
```

---

# 8. Determinism Requirement

Version evaluation MUST be deterministic:

* Same input → same validation result
* No implicit version inference
* No fallback versions allowed

---

# 9. Examples

---

## 9.1 Valid Specification

```yaml
rigor_spec_version: "0.1"
spec_version: "1.0.0"
```

---

## 9.2 Invalid Version String

```yaml
spec_version: "1.0"
```

Result:

```
ER-INVALID-VERSION-STRING
```

---

## 9.3 Unsupported Core Version

```yaml
rigor_spec_version: "1.0"
```

If Engine supports only 0.x → error:

```
ER-UNSUPPORTED-RIGOR-SPEC
```

---

## 9.4 Breaking Change Without MAJOR Increment

If spec removes a required payload field but keeps:

```
spec_version: 1.2.0
```

Validator MUST raise:

```
ER-VERSION-INCOMPATIBLE
```

---

# 10. Interaction with CLI

CLI MUST:

* Validate versions before running commands
* Support `--strict` mode for version enforcement
* Output structured version errors

Example:

```
rigor validate spec.yaml --strict
```

---

# 11. Interaction with Validation Matrix

Version validation is part of the Validation Matrix category:

| Category | Rule                   |
| -------- | ---------------------- |
| VERSION  | Format                 |
| VERSION  | Engine compatibility   |
| VERSION  | Semantic compatibility |

---

# 12. Future Extensions (Non-Normative)

Future RIGOR versions may include:

* Automated migration tooling
* Version diff generation
* Deprecation warnings
* Compatibility hints

---

# 13. Cross-References

* SPEC-REFERENCE
* Validation Matrix
* CLI Grammar
* Graph Model
* Process Model

---

This completes the normative **Versioning v0.1 specification**.

It is:

* Deterministic
* Fully aligned with SemVer principles
* Integrated with validation and CLI
* Architect-ready
* Builder-ready
