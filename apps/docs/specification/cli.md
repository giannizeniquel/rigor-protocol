# CLI Specification (v0.1)

## 1. Purpose

The RIGOR Command Line Interface (CLI) is the primary normative interface for interacting with the protocol's core components. It serves as the stable operational surface for:
- **Specification Validation**: Ensuring structural and semantic correctness.
- **Code Generation**: Translating specifications into target implementations.
- **Evolution Governance**: Comparing versions and detecting breaking changes.
- **Engine Execution**: Running the runtime environment for valid specifications.
- **Migration Management**: Handling structural upgrades for persisted instances.

## 2. Design Principles

The RIGOR CLI is built for **deterministic automation**. It must adhere to the following principles:
- **Deterministic**: Identical inputs must yield identical outputs and exit codes.
- **Scriptable**: Fully compatible with CI/CD pipelines and shell scripting.
- **Non-Interactive**: No mandatory user prompts; all operations must support flags for automated execution.
- **Stable Exit Codes**: Exit codes are part of the formal contract and do not change between minor versions.
- **Machine-Readable**: Supports JSON output for all commands.

## 3. Command: `validate`

Validates a specification file without execution.

### Usage
```bash
rigor validate <spec.yaml> [options]
```

### Actions
1. Executes the complete four-phase pipeline defined in the [Validation Engine](../implementation/validation-engine).
2. Reports structured errors, warnings, and info messages.

### Exit Codes
- `0`: Validation successful (valid: true).
- `1`: Validation failed (one or more ERRORs found).

### Options
- `--format json`: Outputs the [Compliance Report](../implementation/validation-engine#5-compliance-report-format) as a JSON object.

## 4. Command: `generate`

Generates implementation artifacts or adapters from a valid specification.

### Usage
```bash
rigor generate <spec.yaml> <target> [options]
```

### Supported Targets (v0.1)
- `typescript`: Generates typed interfaces and state machine skeletons.
- `openapi`: Generates an OpenAPI/Swagger definition for the process.
- `symfony`: Generates PHP/Symfony-compatible process definitions.
- `node`: Generates Node.js-compatible logic.

### Rules
- **Validation Precedence**: Must fail immediately if `validate` returns errors.
- **Deterministic Output**: Same specification and target version must produce identical code structure.

## 5. Command: `diff`

Compares two versions of a specification to determine structural compatibility.

### Usage
```bash
rigor diff <old_spec.yaml> <new_spec.yaml> [options]
```

### Actions
1. Detects all structural differences between the two versions.
2. Classifies the change level as `PATCH`, `MINOR`, or `MAJOR` according to [Versioning](./versioning) rules.
3. Identifies specific **breaking changes**.

### Exit Codes
- `0`: Changes are compatible (PATCH or MINOR).
- `1`: Breaking changes detected (MAJOR) and `--fail-on-breaking` is set.

### Options
- `--format json`: Outputs a structured diff report.
- `--fail-on-breaking`: Returns exit code 1 if a MAJOR change is detected.

## 6. Command: `run`

Initializes and runs the RIGOR Engine for a given specification.

### Usage
```bash
rigor run <spec.yaml> [options]
```

### Actions
1. Loads the specification and verifies `rigor_spec_version` compatibility.
2. Initializes the [Validation Engine](../implementation/validation-engine).
3. Starts the runtime process, exposing defined endpoints or listeners.

### Options
- `--port <number>`: Sets the execution port.
- `--persistence <driver>`: Defines the persistence adapter (e.g., `postgresql`).
- `--config <path>`: Path to engine configuration.

## 7. Command: `migrate`

Executes structural migrations for persisted instances between MAJOR versions.

### Usage
```bash
rigor migrate from <v_old> to <v_new> [options]
```

### Strategies
- `offline`: Stops the engine to migrate all instances at once.
- `lazy`: Migrates instances individually upon being read by the engine.

### Exit Codes
- `0`: Migration successful.
- `3`: Migration failed (structural corruption or transformer error).

### Options
- `--strategy <offline|lazy>`: Selects the migration strategy.
- `--dry-run`: Simulates the migration without persisting changes.
- `--spec <spec.yaml>`: Path to the new specification.

## 8. Command: `inspect`

Inspects a persisted process instance for debugging or audit purposes.

### Usage
```bash
rigor inspect <instance_id> [options]
```

### Data Provided
- `spec_version`: The version the instance currently adheres to.
- `process_name`: Formal process identifier.
- `current_state`: Current stable phase.
- `context`: Full serialized persistent data.
- `version`: Incremental transition counter.
- `updated_at`: Timestamp of the last transition.

## 9. Global Exit Codes

The CLI uses a stable set of global exit codes:

| Code | Meaning | Description |
| :--- | :--- | :--- |
| `0` | Success | Operation completed successfully. |
| `1` | Validation Error | The specification violates structural or semantic rules. |
| `2` | Execution Error | Runtime failure within the engine. |
| `3` | Migration Error | Failure during instance upgrade or transformation. |
| `4` | Internal Error | Failure within the CLI tool itself. |

## 10. Extensibility

The RIGOR CLI is designed to be extensible through:
- **Custom Generation Targets**: Registering new implementation generators.
- **Persistence Adapters**: Adding support for different database engines.
- **CI/CD Integration**: Easy embedding as a binary in automated pipelines.

Extension must not break the compatibility of existing commands or stable exit codes.
