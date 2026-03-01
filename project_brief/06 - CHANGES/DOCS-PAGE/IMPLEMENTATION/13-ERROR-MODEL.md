# RIGOR

# Implementation

## Error Model (Normative – v0.1)

Status: Normative
Scope: Defines the unified error taxonomy, structure, lifecycle, serialization format, and determinism guarantees across all RIGOR engines.

This document establishes a single, stable, and versioned error model used by:

* Parser & Loader
* Canonical Graph Builder
* Canonicalization Engine
* Validation Engine
* Constraint Engine
* Diff Engine
* Versioning Engine
* Migration Engine
* Event Resolution Engine
* CLI Layer

---

# 1. Purpose

The Error Model ensures:

* Structural consistency of all errors
* Deterministic ordering
* Stable error codes
* Predictable serialization
* Version-safe evolution

All engines MUST emit errors compliant with this model.

---

# 2. Error Taxonomy

Errors are classified into top-level categories:

* PARSER
* GRAPH
* CANONICALIZATION
* VALIDATION
* CONSTRAINT
* DIFF
* VERSION
* MIGRATION
* EVENT
* CLI
* INTERNAL

Each category MUST be namespaced.

---

# 3. Error Code Model

Every error MUST have a stable code:

```id="err_code_format"
RIGOR-<CATEGORY>-<NNN>
```

Examples:

* RIGOR-PARSER-001
* RIGOR-VALIDATION-014
* RIGOR-VERSION-003

Rules:

* Codes MUST be immutable once released
* Codes MUST NOT change semantic meaning
* Removed codes MUST be deprecated, not reused
* Code list MUST be versioned

---

# 4. Base Error Schema

All errors MUST conform to:

```id="err_base_schema"
RigorError {
    code: string
    category: string
    message: string
    path?: CanonicalPath
    metadata?: object
}
```

Constraints:

* `code` MUST follow namespaced format
* `category` MUST match taxonomy
* `message` MUST be deterministic and static
* `path` MUST be canonical if present
* `metadata` MUST NOT affect determinism

---

# 5. Severity Model

Severity levels:

* error
* warning
* fatal (reserved for internal failures)

Severity MUST NOT alter error structure.

Mapping:

* Validation failures → error
* Constraint warnings → warning
* Internal engine crash → fatal

---

# 6. Deterministic Ordering

All error collections MUST be ordered by:

1. category (lexicographic)
2. path (lexicographic, if present)
3. code (lexicographic)

If path is absent, it MUST be treated as empty string for ordering.

Identical inputs MUST produce identical error ordering.

---

# 7. Engine-Specific Extensions

Engines MAY extend the base error model with typed wrappers, but serialization MUST conform to `RigorError`.

Example extension:

```id="err_version_extension"
VersionViolation extends RigorError {
    expectedBump: string
    declaredBump: string
}
```

However, JSON output MUST flatten into base schema with metadata.

---

# 8. Fatal Errors

Fatal errors represent:

* Unrecoverable internal state corruption
* Graph invariant breach
* Execution pipeline failure

Fatal errors MUST:

* Halt execution immediately
* Produce exit code > 10
* Not produce partial results

Fatal errors MUST still serialize under base schema.

---

# 9. Multi-Error Handling

Engines MUST:

* Accumulate errors when safe
* Avoid cascading failures
* Avoid duplicating equivalent errors

Partial aggregation MUST remain deterministic.

---

# 10. Error Message Rules

Messages MUST:

* Be stable across versions unless breaking change
* Avoid dynamic runtime values
* Avoid timestamps
* Avoid memory addresses
* Avoid nondeterministic formatting

Allowed:

* Canonical path insertion
* Stable attribute names
* Stable constraint IDs

---

# 11. Localization

The normative error message language is English.

Localization MAY be implemented, but:

* Error codes MUST remain unchanged
* CLI JSON MUST emit canonical English message
* Localization MUST occur at presentation layer only

---

# 12. CLI Integration

CLI MUST serialize errors:

## Text Mode

Human-readable structured format:

```
[ERROR] RIGOR-VALIDATION-003
Path: /processes/order/states/approved
Message: State transition target does not exist.
```

## JSON Mode

```id="err_json_output"
{
  "status": "invalid",
  "errors": [
    {
      "code": "RIGOR-VALIDATION-003",
      "category": "VALIDATION",
      "message": "...",
      "path": "...",
      "metadata": {}
    }
  ]
}
```

No additional keys allowed.

---

# 13. Backward Compatibility

Changes to error model:

* Adding new codes → minor version
* Removing codes → major version
* Changing message semantics → major version
* Adding metadata fields → minor version (if optional)

Breaking changes MUST follow SemVer.

---

# 14. Cross-Engine Consistency

All engines MUST:

* Use the same base schema
* Use stable category names
* Avoid conflicting codes
* Avoid overlapping semantic meanings

Central error registry MUST exist.

---

# 15. Internal Errors

INTERNAL category MUST be used only for:

* Unexpected state
* Invariant violation
* Implementation bug

Internal errors MUST:

* Be deterministic in classification
* Avoid exposing sensitive runtime details

Stack traces MAY be shown only in debug mode.

---

# 16. Error Lifecycle

Error lifecycle:

1. Detected in engine
2. Wrapped in RigorError
3. Added to ordered collection
4. Returned to caller
5. Serialized by CLI

Errors MUST NOT be mutated after creation.

---

# 17. Aggregation Guarantees

If multiple engines produce errors:

* Errors MUST be merged
* Global ordering MUST be re-applied
* No engine may override another’s error

Aggregation MUST remain stable.

---

# 18. Compliance Criteria

An implementation is compliant if:

* All errors conform to base schema
* Codes are stable and namespaced
* Ordering is deterministic
* Serialization matches specification
* Fatal errors halt execution

---

# 19. Summary

The Error Model:

* Unifies all engine error reporting
* Guarantees deterministic structure and ordering
* Enforces stable, versioned error codes
* Enables CLI integration and machine processing
* Preserves backward compatibility across releases
