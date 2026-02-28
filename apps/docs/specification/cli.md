# CLI Specification (v0.1)

The RIGOR Command Line Interface (CLI) is a normative, constituent component of the protocol. It serves as the official guardian of the standard, ensuring structural integrity, canonical formatting, and deterministic artifact generation.

## 1. Nature and Principles

The RIGOR CLI is designed for **deterministic automation** and **formal enforcement**.

### Core Principles:
- **Deterministic**: Mismo input → mismo output. Exit codes are stable.
- **Idempotent**: Re-running operations on the same input produces no additional side effects.
- **No Implicit State**: The CLI does not rely on hidden configuration or global environment state unless explicitly declared.
- **Offline-First**: All core operations must function without external network access.
- **Implementation-Independent**: It does not execute business logic, generated code, or resolve external runtime dependencies.
- **Machine-Readable**: Supports structured output (JSON) for all commands.

## 2. Modular Architecture

 The CLI is composed of three formal, independent modules:

```
CLI
 ├── Validator (Structural & Semantic Enforcement)
 ├── Generator (Artifact & Implementation Derivation)
 └── Formatter (Canonical Representation)
```

---

## 3. Module 1: Validator

The Validator ensures that a protocol document strictly adheres to the grammar, types, semantic rules, and invariants of RIGOR Core v0.1.

### 3.1 Validation Tiers
1. **Syntactic**: Correct structure, valid tokens, and mandatory sections.
2. **Semantic**: Resolution of references, type compatibility, and non-ambiguity.
3. **Structural**: Correct hierarchy and valid cardinality.
4. **Domain Rules**: Adherence to explicit constraints and protocol invariants.

### 3.2 Commands
```bash
rigor validate <file|directory> [options]
```

**Options:**
- `--strict`: Treats warnings as errors.
- `--json`: Outputs a machine-readable validation report.
- `--fail-on-warning`: Returns a non-zero exit code if warnings are found.
- `--no-color`: Disables terminal color output.

### 3.3 Exit Codes (v0.1 Contractual)

The CLI uses a stable, frozen set of exit codes for automation and CI/CD integration.

| Code | Meaning | Description |
| :--- | :--- | :--- |
| `0` | Success | Operation completed successfully. |
| `1` | Validation Error | The specification violates structural or semantic rules. |
| `2` | CLI Misuse | Invalid command syntax, unknown flags, or missing arguments. |
| `3` | Internal Error | Unexpected failure within the RIGOR engine or CLI tool. |

### 3.4 Validation Modes and Compliance

The `validate` command operates in two modes defined by the [Validation Matrix](./validation-matrix):

1. **Standard Mode**: Default behavior. Verifies structural and referential integrity.
2. **Strict Mode (`--strict`)**: Verifies full protocol compliance, including semantic invariants and evolution safety.

### Severity Model
- **ERROR**: Results in exit code `1`. The specification is non-compliant.
- **WARNING**: In Standard mode, these are advisory. In Strict mode, semantic and invariant warnings escalate to **ERROR**.

Formal protocol compliance is only certified when `rigor validate --strict` returns code `0`.

---

## 4. Module 2: Generator

The Generator transforms a valid protocol document into concrete, deterministic artifacts.

### 4.1 Fundamental Principles
- **No Implicit Behavior**: The generator must not "invent" behavior not explicitly defined in the protocol.
- **Reproducibility**: Same specification and target version must produce identical files.
- **Atomic Output**: Artifact generation should be treated as a single unit of work.

### 4.2 Commands
```bash
rigor generate <target> --from <file|directory> [options]
```

**Targets:**
- `schema`: Generates JSON-schema for the context.
- `typescript`: Generates typed interfaces and process skeletons.
- `openapi`: Generates API contracts.
- `migrations`: Generates structural migration scripts between versions.

**Options:**
- `--out <dir>`: Target output directory.
- `--stdout`: Emits content to standard output.
- `--overwrite`: Permits overwriting existing files.
- `--dry-run`: Simulates generation without writing to disk.

---

## 5. Module 3: Formatter

The Formatter guarantees a single, canonical representation of RIGOR documents.

### 5.1 Objectives
- **Normalization**: Reorders keys, standardizes indentation, and removes whitespace ambiguity.
- **Determinism**: Ensures that any compliant specification has exactly one valid textual representation.
- **AI-Human Bridge**: Allows AI-generated (potentially messy) code to be instantly normalized for human review.

### 5.2 Commands
```bash
rigor format <file|directory> [options]
```

**Options:**
- `--check`: Returns exit code 1 if the file is not in canonical format.
- `--write`: Rewrites the file in canonical format.

---

## 6. Formal Grammar (CLI v0.1)

The CLI command structure is governed by the following EBNF grammar to ensure non-ambiguous parsing by both humans and machines.

```ebnf
cli             ::= "rigor" SP action

action          ::= validate
                  | format
                  | generate

validate        ::= "validate" SP path validate_opts?
format          ::= "format" SP path format_opts?
generate        ::= "generate" SP target SP path generate_opts?

validate_opts   ::= (SP validate_opt)*
format_opts     ::= (SP format_opt)*
generate_opts   ::= (SP generate_opt)*

validate_opt    ::= "--strict"
                  | format_option

format_opt      ::= "--write"
                  | "--check"

generate_opt    ::= output_option
                  | "--dry-run"

format_option   ::= "--format=" format_type
output_option   ::= "--output=" path

format_type     ::= "json"
                  | "text"

target          ::= "schema"
                  | "types"
                  | "json-schema"
                  | "openapi"

path            ::= STRING
SP              ::= " "
```

### 6.1 Syntactic Rules (Normative)
- **Mandatory Order**: `rigor` → action → arguments → flags.
- **Flag Format**: All flags must use the `--long-name` format. No short aliases (e.g., `-s`) are supported.
- **Value Assignment**: Flags with values must use the equals sign (e.g., `--format=json`). Spaces (e.g., `--format json`) are invalid.
- **Exclusivity**: Certain flags may be mutually exclusive (e.g., `--write` and `--check` for formatting).
- **Error Handling**: Unknown flags or missing arguments result in an immediate exit with code `2`.

---

## 7. AI Integration Flow

The CLI is the formal gatekeeper in the AI-assisted development lifecycle:

1. **AI Generation**: An AI agent produces a `.rigor` file.
2. **Human Review**: A human architect reviews the business rules and constraints.
3. **Validation**: `rigor validate` ensures the document is technically sound.
4. **Formatting**: `rigor format --write` normalizes the representation.
5. **Generation**: `rigor generate` produces the implementation artifacts.

---

## 8. Machine-Readable Mode (`--json`)

For IDE integration, CI/CD, and AI agents, the CLI must emit structured errors:

```json
{
  "file": "user.rigor",
  "line": 12,
  "column": 5,
  "code": "E_TYPE_MISMATCH",
  "message": "Expected integer but got string",
  "severity": "ERROR"
}
```

---

## 9. Configuration and Versioning

### 9.1 Configuration (`rigor.config.json`)
Allows defining project-wide defaults:
- Default generation targets.
- Strictness levels.
- Output paths.

### 9.2 Versioning
The CLI must report the supported protocol version.
```bash
rigor version
```

---

## 10. Future Extensibility (Fase 2)
Future iterations may include support for custom plugins, generators, and hooks. These are not part of the v0.1 normative specification.
