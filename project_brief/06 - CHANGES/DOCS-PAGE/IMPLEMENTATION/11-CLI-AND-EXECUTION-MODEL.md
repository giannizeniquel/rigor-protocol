# RIGOR

# Implementation

## CLI & Execution Model (Normative – v0.1)

Status: Normative
Scope: Defines the command-line interface behavior, execution pipeline, orchestration rules, exit codes, and determinism guarantees of the RIGOR toolchain.

This document formalizes how all engines are invoked and composed in a compliant implementation.

---

# 1. Purpose

The CLI & Execution Model defines:

* Command structure
* Execution pipeline order
* Engine orchestration
* Output formats
* Exit codes
* Determinism guarantees
* Error handling model

It is the integration layer between all normative engines.

---

# 2. Execution Pipeline Overview

The canonical execution pipeline MUST be:

1. Parser & Loader
2. Canonical Graph Builder
3. Canonicalization Engine
4. Validation Engine
5. Diff Engine (if previous version provided)
6. Versioning Engine (if diff executed)
7. Migration Engine (if migration requested)
8. Event Resolution Engine
9. Output Rendering

Each step MUST execute in the defined order.

---

# 3. CLI Command Model

The CLI MUST expose deterministic commands.

Minimum required commands:

* `rigor validate`
* `rigor diff`
* `rigor version`
* `rigor migrate`
* `rigor resolve-events`

Optional commands MAY exist but MUST NOT alter core behavior.

---

# 4. Command Definitions

## 4.1 Validate

```id="cli_validate"
rigor validate <spec-file> [--strict] [--json]
```

Execution:

* Parse
* Build graph
* Canonicalize
* Validate
* Resolve events

Exit codes:

* 0 → valid
* 1 → validation errors
* > 1 → internal failure

---

## 4.2 Diff

```id="cli_diff"
rigor diff <previous-spec> <current-spec> [--json]
```

Execution:

* Parse both
* Build both graphs
* Canonicalize both
* Compute ChangeSet
* Output ChangeSet

Exit codes:

* 0 → no change
* 2 → changes detected
* > 2 → internal failure

---

## 4.3 Version

```id="cli_version"
rigor version <previous-spec> <current-spec> [--json]
```

Execution:

* Parse both
* Canonicalize
* Diff
* Evaluate version

Exit codes:

* 0 → valid version
* 3 → version violation
* > 3 → internal failure

---

## 4.4 Migrate

```id="cli_migrate"
rigor migrate <previous-spec> <current-spec> <migration-file> [--json]
```

Execution:

* Parse both
* Canonicalize
* Diff
* Version evaluation
* Apply migration
* Validate migrated graph
* Resolve events

Exit codes:

* 0 → success
* 4 → migration failure
* > 4 → internal failure

---

## 4.5 Resolve Events

```id="cli_resolve"
rigor resolve-events <spec-file> [--json]
```

Execution:

* Parse
* Canonicalize
* Resolve events

Exit codes:

* 0 → valid
* 5 → resolution errors
* > 5 → internal failure

---

# 5. Determinism Requirements

The CLI MUST guarantee:

* Stable ordering of outputs
* Stable JSON structure
* No timestamp injection (unless explicitly requested)
* No non-deterministic logging

Identical inputs MUST produce identical outputs.

---

# 6. Output Formats

The CLI MUST support:

* Human-readable text (default)
* JSON (`--json` flag)

JSON output MUST:

* Exactly serialize engine output contracts
* Preserve ordering defined in normative documents
* Use stable key ordering

No additional keys allowed.

---

# 7. Error Handling Model

Errors are categorized as:

* Validation errors
* Version violations
* Migration failures
* Internal engine failures

Internal failures MUST:

* Produce non-zero exit > 10
* Output structured error object (if JSON mode)

---

# 8. Logging Model

Logging MUST be optional.

Flags MAY include:

* `--verbose`
* `--debug`

Logs MUST NOT alter behavior or output structure.

---

# 9. Configuration Model

CLI MAY accept configuration file:

```id="cli_config_schema"
RigorConfig {
    validationMode: "strict" | "non-strict"
    versionPolicy: object
    outputFormat: "text" | "json"
}
```

CLI flags MUST override config file.

---

# 10. Streaming & Large Files

Implementation MAY support streaming parsing.

However:

* Canonical Graph MUST be fully constructed before diff/validation.
* Partial validation is not allowed in normative mode.

---

# 11. Execution Isolation

Each CLI invocation MUST:

* Be stateless
* Not cache previous runs (unless deterministic cache)
* Not modify input files

Temporary files MUST be cleaned deterministically.

---

# 12. Parallel Execution

Parallelization MAY be used internally if:

* It does not alter output order
* It preserves determinism

Rule execution parallelization MUST preserve ordered aggregation.

---

# 13. Stability Guarantees

Breaking changes in:

* CLI flags
* Exit codes
* JSON schema

MUST require major version increment of RIGOR.

---

# 14. Non-Goals

The CLI does NOT:

* Provide runtime execution environment
* Integrate with external systems
* Provide interactive UI
* Auto-fix errors

It is a deterministic orchestration interface.

---

# 15. Compliance Criteria

An implementation is compliant if:

* It executes engines in defined order
* It enforces exit codes precisely
* It guarantees deterministic output
* It respects JSON schema contracts
* It isolates execution per invocation

---

# 16. Execution Model Summary

The CLI & Execution Model:

* Orchestrates all engines
* Defines deterministic execution flow
* Guarantees stable output
* Enforces strict exit code discipline
* Ensures composability of the toolchain

---

At this stage, the full RIGOR implementation architecture includes:

1. Parser & Loader
2. Canonical Graph Builder
3. Canonicalization Engine
4. Validation Engine
5. Diff Engine
6. Versioning Engine
7. Migration Engine
8. Event Resolution Engine
9. CLI & Execution Model

The implementation layer is now structurally complete under normative definition.
