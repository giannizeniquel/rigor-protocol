# 📄 ARCHITECT REVIEW DOCUMENT

## Target: Specification → Versioning

## Version: Proposed RIGOR Core v0.1 Alignment

## Status: Normative Upgrade Required

---

# 1. OBJECTIVE OF THIS REVISION

Transform the current Versioning page into a **fully normative specification** that:

* Establishes formal versioning grammar and semantics for RIGOR
* Defines compatibility rules for `rigor_spec_version` and `spec_version`
* Integrates versioning into validation and CLI behavior
* Provides deterministic error handling and reporting
* Includes examples for practical understanding

---

# 2. STRUCTURAL REORGANIZATION REQUIRED

The page must be restructured into the following normative sections:

1. Versioning Overview
2. Version Identifiers

   * `rigor_spec_version`
   * `spec_version`
3. Semantic Versioning Rules

   * MAJOR / MINOR / PATCH
4. Compatibility Rules
5. Version Ranges
6. Version in Validation
7. Error Codes
8. Examples
9. Cross-References

---

# 3. REQUIRED ADDITIONS

---

## 3.1 Version Identifiers

### 3.1.1 `rigor_spec_version`

* Represents the **version of the RIGOR language/core**
* Must be compatible with Engine runtime
* Format: `"MAJOR.MINOR"` (e.g., `"0.1"`)
* Immutable within a major release

### 3.1.2 `spec_version`

* Represents the **version of a specific process specification**
* Format: `"MAJOR.MINOR.PATCH"` (e.g., `"1.0.0"`)
* Evolves according to semantic rules defined below

---

## 3.2 Semantic Versioning Rules

| Segment | Purpose                                              | Increment Rule    |
| ------- | ---------------------------------------------------- | ----------------- |
| MAJOR   | Breaking change to process spec grammar or semantics | Must increment    |
| MINOR   | Backward-compatible feature addition                 | Increment allowed |
| PATCH   | Backward-compatible bug fixes or clarifications      | Increment only    |

**Constraints:**

* Backward-compatible changes **must not break older Engine versions** compatible with the previous MAJOR
* Breaking changes must **increment MAJOR** and be clearly documented

---

## 3.3 Version Range Support

Validator/Engine should support:

* **Exact match:** Only accept the specified version
* **Range match:** Accept versions within compatible bounds

Example:

```yaml
rigor_spec_version: ">=0.1 <1.0"
spec_version: ">=1.0.0 <2.0.0"
```

* Non-compliant versions trigger `ER-VERSION-INCOMPATIBLE`

---

## 3.4 Version in Validation

Define integration with Validation Matrix:

1. Validator checks both `rigor_spec_version` and `spec_version`
2. Validator must reject:

   * Unsupported `rigor_spec_version`
   * Spec version incompatible with previous major
3. Validator errors must be **deterministic**, with clear error codes and context
4. Validator should log version evolution for audit purposes

---

## 3.5 Error Codes

| Code                      | Condition                               | Severity |
| ------------------------- | --------------------------------------- | -------- |
| ER-VERSION-INCOMPATIBLE   | Spec version not compatible with Engine | Error    |
| ER-UNSUPPORTED-RIGOR-SPEC | `rigor_spec_version` unsupported        | Error    |
| ER-INVALID-VERSION-STRING | Malformed version string                | Error    |

Each error must include:

* Specified version
* Expected range
* Location in spec

---

## 3.6 Examples

### 3.6.1 Valid Example

```yaml
rigor_spec_version: "0.1"
spec_version: "1.2.0"
```

* MAJOR = 1 → first major release of this process spec
* MINOR = 2 → compatible feature additions
* PATCH = 0 → no bug fixes yet

### 3.6.2 Invalid Example — Breaking Change Not Incremented

```yaml
spec_version: "1.2.0"
```

* Suppose a breaking change was introduced
* Must increment MAJOR
* Validator → ER-VERSION-INCOMPATIBLE

### 3.6.3 Invalid Example — Unsupported RIGOR Core

```yaml
rigor_spec_version: "1.0"
```

* If Engine supports only `0.x` → ER-UNSUPPORTED-RIGOR-SPEC

---

## 3.7 Grammar Inclusion

Add to SPEC-REFERENCE and CLI grammar:

```yaml
rigor_spec_version: "0.1"
spec_version: "1.0.0"
```

* Must be at root of YAML spec
* Mandatory for all RIGOR specs
* Used by Validator and CLI for strict version checks

---

## 3.8 Cross-References

* See [SPEC-REFERENCE](spec-reference.html)
* See [Validation Matrix](validation.html)
* See [Process Model](protocol-model.html)
* See [CLI Grammar](cli.html)

---

# 4. ARCHITECT DECISIONS REQUIRED

1. Version range syntax: operator set (`>=`, `<`, etc.)
2. Behavior for patch-level fixes across engines
3. Logging format for version evolution
4. Mapping between version ranges and CLI `--strict` validation
5. Policies for MAJOR version depreciation

---

# 5. IMPACT LEVEL

| Area                        | Impact |
| --------------------------- | ------ |
| Validator Engine            | High   |
| CLI Version Checks          | High   |
| Spec Parser                 | Medium |
| Documentation Consistency   | Medium |
| Future Migration Automation | High   |

---

# 6. RESULTING STATE AFTER APPROVAL

* Versioning page becomes **fully normative**
* All process specs include explicit `rigor_spec_version` and `spec_version`
* Validator behavior deterministic for all version-related issues
* CLI can enforce version rules during generation and validation
* Future tooling (migrations, diffing) can rely on standard versioning semantics
