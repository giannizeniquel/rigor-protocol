# RIGOR CLI (v0.1)

## 1. Purpose

The RIGOR CLI is the primary interface for interacting with specifications, the validation engine, and the runtime. It is designed to be deterministic, scriptable, and CI/CD compatible. Every operation can be executed without interactive prompts to ensure full automation.

## 2. Core Commands

### 2.1 `rigor validate`
Validates a specification file without executing it.
- **Action**: Executes the full F1–F4 pipeline defined in the [Validation Engine](../implementation/validation-engine.md).
- **Exit Codes**: `0` for success, `1` for validation errors.
- **Output**: Structured list of errors, warnings, and info. Supports `--format json`.

### 2.2 `rigor generate`
Generates implementation artifacts from a valid specification.
- **Usage**: `rigor generate <spec.yaml> <target>` (e.g., `rigor generate spec.yaml symfony`).
- **Targets**: `symfony`, `node`, `typescript`, `openapi`.
- **Action**: Validates the spec, generates an Intermediate Representation (IR), and produces the target code or adapters.

### 2.3 `rigor diff`
Compares two versions of a specification to detect structural changes.
- **Action**: Classifies differences as `PATCH`, `MINOR`, or `MAJOR` based on the [Versioning](../specification/versioning.md) rules.
- **Options**: `--fail-on-breaking` (Exit code `1` if a MAJOR change is detected).

### 2.4 `rigor run`
Initializes and starts the RIGOR Engine with a specific specification.
- **Action**: Loads the spec, verifies version compatibility, and initializes listeners/endpoints as configured.
- **Options**: `--port`, `--persistence`, `--config`.

### 2.5 `rigor migrate`
Executes migrations for persisted instances between specification versions.
- **Usage**: `rigor migrate from <v1> to <v2> --strategy <offline|lazy>`.
- **Options**: `--dry-run` to simulate the transformation without persisting changes.

### 2.6 `rigor inspect`
Provides a detailed view of a persisted process instance.
- **Output**: Displays `spec_version`, `process_name`, `current_state`, `context`, `internal_version`, and `updated_at`.

## 3. Global Exit Codes

The CLI uses stable exit codes to facilitate integration with external scripts and pipelines:

| Code | Description |
| :--- | :--- |
| `0` | Success |
| `1` | Validation Error |
| `2` | Execution Error |
| `3` | Migration Error |
| `4` | Internal CLI Error |

## 4. Automation and CI/CD

The RIGOR CLI is optimized for automation:
- **JSON Output**: Use `--format json` for machine-readable results.
- **Non-Interactive**: All commands accept arguments or configuration files to avoid blocking prompts.
- **Stable Interface**: Command names and flags are guaranteed to be stable across MINOR and PATCH versions.
