# Versioning (v0.1)

## 1. Introduction

Versioning is a formal structural constraint in RIGOR, required for deterministic evolution and safe migrations.

## 2. Version Identifiers (Normative)

### 2.1 `rigor_spec_version`
- Represents the RIGOR language/core version.
- Format: `"MAJOR.MINOR"` (e.g., `"0.1"`).
- Engines **MUST** reject specifications with an unsupported language version.

### 2.2 `spec_version`
- Represents the version of a specific process definition.
- Format: `"MAJOR.MINOR.PATCH"` (e.g., `"1.0.0"`).
- Follows Semantic Versioning rules.

## 3. Semantic Rules (Increment Logic)

| Segment | Increment Rule | Purpose |
| :--- | :--- | :--- |
| **MAJOR** | **MUST** increment | Breaking changes (removed states, changed types). |
| **MINOR** | **MAY** increment | Backward-compatible features (new optional fields). |
| **PATCH** | **MAY** increment | Bug fixes, clarifications, or documentation. |

### 3.1 MAJOR (Breaking Changes)
- Removing or renaming an existing state or event.
- Changing the type of a context field.
- Removing a mandatory context field.
- Modifying the transition logic for an existing state/event pair.
- Changing the `initial_state`.
- Converting an optional field into a mandatory one.

### 3.2 MINOR (Backward-Compatible)
- Adding a new Event or State.
- Adding a new transition.
- Adding an optional field to the context or event payload.

### 3.3 PATCH (Non-Structural)
- Documentation updates.
- Improving clarity of error or log messages.
- Clarifications without behavioral change.

## 4. Version Range Support

Engines **SHOULD** support range operators for compatibility checks:

| Operator | Description |
| :--- | :--- |
| `=` | Exact match |
| `>` | Greater than |
| `>=` | Greater than or equal |
| `<` | Less than |
| `<=` | Less than or equal |
| `^` | Compatible (e.g., ^1.0.0 means >=1.0.0 <2.0.0) |
| `~` | Tilde (e.g., ~1.0.0 means >=1.0.0 <1.1.0) |

**Behavior**: A spec is valid only if the identifiers satisfy the engine's supported range.

## 5. Versioning in Validation

Integration with the Validation Matrix:
1. Validator **MUST** verify both identifiers at the start of the process.
2. Mismatches or malformed strings trigger immediate failure.
3. Version evolution **SHOULD** be logged for auditability.

## 6. Error Taxonomy

| Code | Condition | Severity |
| :--- | :--- | :--- |
| `ER-VERSION-INCOMPATIBLE` | Spec version not supported by engine. | Error |
| `ER-UNSUPPORTED-RIGOR-SPEC` | `rigor_spec_version` is outside engine capability. | Error |
| `ER-INVALID-VERSION-STRING` | Version identifier does not follow mandated format. | Error |

## 7. Examples

### Valid: Standard Compliant Version Block

```yaml
rigor_spec_version: "0.1"
spec_version: "1.2.0"

process: OrderProcess
context:
  order_id: uuid
states:
  created:
    terminal: true
```

### Invalid: Breaking Change Without MAJOR Increment

```yaml
# INVALID: Removed 'pending' state but didn't increment MAJOR
rigor_spec_version: "0.1"
spec_version: "1.0.0"  # Should be "2.0.0"

process: OrderProcess
# 'pending' state was removed
states:
  completed:
    terminal: true
```

### Invalid: Engine Rejects Future Language Version

```yaml
# INVALID: Engine supports "0.1" but spec uses "2.0"
rigor_spec_version: "2.0"  # ER-UNSUPPORTED-RIGOR-SPEC
spec_version: "1.0.0"
```
