# RIGOR

# Implementation

## Parser & Loader (Normative – v0.1)

Status: Normative
Scope: Defines how RIGOR specifications are parsed, loaded, and transformed into an intermediate representation (IR) prior to canonical graph construction.

This document defines the responsibilities, constraints, contracts, and guarantees of the Parser & Loader module.

---

# 1. Purpose

The Parser & Loader is responsible for transforming raw specification files into a structured intermediate representation (IR).

It is the only module that interacts directly with external file formats.

It MUST NOT perform semantic validation or business rule enforcement.

---

# 2. Responsibilities

The Parser & Loader MUST:

1. Read specification source files
2. Validate YAML syntax
3. Validate encoding
4. Normalize basic data structures
5. Produce a deterministic Intermediate Representation (IR)
6. Detect structural anomalies at syntax level

It MUST NOT:

* Resolve semantic references
* Build graph structures
* Validate constraints
* Perform diff logic
* Mutate data after IR generation

---

# 3. Supported Input Format

## 3.1 Primary Format

The primary supported format is:

YAML (UTF-8 encoded)

---

## 3.2 Encoding Requirements

* Input MUST be valid UTF-8
* BOM MUST be ignored if present
* Invalid encoding MUST produce a fatal parsing error

---

## 3.3 YAML Constraints

The parser MUST enforce:

* No duplicate mapping keys
* No implicit type coercion beyond YAML standard
* No anchors or aliases unless explicitly supported
* No executable tags

If unsupported YAML features are encountered, the parser MUST fail deterministically.

---

# 4. Intermediate Representation (IR)

The output of the Parser & Loader is an Intermediate Representation (IR).

The IR MUST:

* Represent mappings as ordered key-value structures
* Represent sequences as ordered lists
* Preserve scalar values as typed primitives
* Exclude comments
* Preserve original structure hierarchy

The IR MUST be:

* Deterministic
* Independent of file formatting
* Independent of key ordering in source

---

# 5. Structural Validation at Parsing Stage

The Parser & Loader MAY perform limited structural validation limited to:

* Root-level type validation (e.g., must be mapping)
* Presence of mandatory top-level keys (optional, implementation-defined)
* Detection of illegal scalar types

It MUST NOT validate:

* Referential integrity
* Process structure
* Event structure
* Constraint semantics
* Versioning rules

All semantic validation belongs to the Validation Engine.

---

# 6. Duplicate Key Handling

Duplicate keys within the same mapping:

* MUST result in a fatal error
* MUST include canonical location information
* MUST be deterministic in reporting order

Silent overwriting is prohibited.

---

# 7. Normalization Rules

The Parser & Loader MUST normalize:

* Line endings
* Scalar whitespace (no trimming unless specified)
* Numeric representation (preserve numeric type)
* Boolean representation (true/false only)

It MUST NOT:

* Reorder mappings
* Reorder sequences
* Inject default values

Default value injection is prohibited at this stage.

---

# 8. Error Model Integration

Parsing errors MUST:

* Use stable error codes
* Include file location (line and column if available)
* Be categorized as fatal
* Prevent further processing

The Parser MUST stop on fatal errors.

---

# 9. Determinism Requirements

Given identical source input:

* The IR MUST be identical
* Error output MUST be identical
* Ordering MUST be stable

Given semantically identical but syntactically different YAML:

* The IR MAY differ
* Canonical equivalence is enforced later

---

# 10. Multi-File Support (If Implemented)

If multi-file loading is supported:

* File resolution order MUST be deterministic
* Include/import mechanisms MUST be explicitly defined
* Circular inclusion MUST be detected
* Inclusion MUST produce a single merged IR

If not supported, the implementation MUST explicitly reject multi-file inputs.

---

# 11. Security Considerations

The Parser MUST:

* Disable remote resource loading
* Disable code execution tags
* Avoid arbitrary file inclusion
* Protect against entity expansion attacks

The Parser MUST be safe against malicious YAML payloads.

---

# 12. Memory and Size Constraints

The implementation SHOULD define:

* Maximum file size
* Maximum nesting depth
* Maximum mapping size
* Maximum sequence size

Exceeding limits MUST produce deterministic failure.

---

# 13. Output Contract

The Parser & Loader MUST output:

IntermediateRepresentation {
root: MappingNode
metadata: {
source_path
checksum (optional)
}
}

The exact internal structure MAY vary, but logical equivalence MUST hold.

---

# 14. Integration with Next Stage

The IR produced by this module is the sole input to:

Canonical Graph Builder

No other module may consume raw YAML.

---

# 15. Non-Goals

The Parser & Loader does NOT:

* Construct Canonical Graph
* Validate business logic
* Perform diff
* Evaluate constraints
* Generate artifacts

Its sole purpose is syntactic parsing and safe normalization.

---

# 16. Compliance Criteria

An implementation is compliant if:

* It rejects invalid YAML deterministically
* It rejects duplicate keys
* It produces stable IR
* It does not perform semantic validation
* It enforces encoding constraints

---

# 17. Summary

The Parser & Loader is:

* Deterministic
* Strict
* Non-semantic
* Immutable in output
* Security-hardened

It prepares structured data for Canonical Graph construction.
