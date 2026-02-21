# Versioning (v0.1)

## 1. Purpose

RIGOR treats versioning as a formal structural component rather than an informal convention. The objective is to ensure controlled evolution of specifications, explicit compatibility, and safe migrations for persistent process instances.

## 2. Levels of Versioning

The RIGOR ecosystem operates across three distinct versioning levels:

### 2.1 `rigor_spec_version`
Defines the version of the RIGOR language and its formal structural contract.
- **Mandatory**: Must be declared at the root of every specification (e.g., `rigor_spec_version: 0.1.0`).
- **Trigger**: Changes to the JSON Schema or formal semantics trigger a version increment. Structural changes to the language require a **MAJOR** increment.
- **Enforcement**: The engine **must** reject specifications with an unsupported `rigor_spec_version`. The rejection must be explicit and deterministic.

### 2.2 `spec_version`
Identifies the version of a specific process implementation (states, events, transitions, and context).
- **Usage**: Used as the primary trigger for migrations, diff comparisons, and tracking rehydration of persisted instances.
- **Declaration**: Must be declared at the root (e.g., `spec_version: 1.0.0`).
- **Immutability**: Once a `spec_version` is used in production, it is immutable. Any modification requires a version increment.

### 2.3 `engine_version`
Identifies the version of the RIGOR runtime. The engine must declare its supported range for both the language and implementation versions (e.g., `supported_rigor_spec_range: "^0.1.0"`).

## 3. Semantic Versioning (SemVer) Rules

RIGOR strictly enforces `MAJOR.MINOR.PATCH` rules for structural changes:

### 3.1 MAJOR (Breaking Changes)
Required when changes are backward-incompatible. Breaking changes require a formal [Migration Path](./migrations). Examples:
- Removing or renaming an existing state or event.
- Changing the type of a context field.
- Removing a mandatory context field.
- Modifying the transition logic for an existing state/event pair.
- Changing the `initial_state`.
- Converting an optional field into a mandatory one.

### 3.2 MINOR (Compatible Additions)
Required for backward-compatible structural additions. These must not break existing persisted instances. Examples:
- Adding a new Event or State (provided it is not the new initial state).
- Adding a new transition.
- Adding an optional field to the context or event payload.

### 3.3 PATCH (Non-Structural Fixes)
Required for non-breaking adjustments that do not alter the structural contract. Examples:
- Documentation updates.
- Internal engine optimizations.
- Improving the clarity of error or log messages.

## 4. Compatibility Verification & CLI Integration

The RIGOR CLI provides tools to enforce these rules during the development lifecycle.

### 4.1 The `diff` Command
The command `rigor diff <old.yaml> <new.yaml>` is used to:
- Compare `spec_version` nodes.
- Automatically detect breaking changes based on structural analysis.
- Suggest the required version increment (PATCH, MINOR, or MAJOR).

Failure to increment the version correctly when a breaking change is detected should trigger a CI/CD failure.

## 5. Support & Deprecation Policy

To maintain ecosystem stability, RIGOR implementers are encouraged to:
- **Active Support**: Support at least the last two **MAJOR** versions active in production.
- **Deprecation Window**: Define an explicit deprecation window before removing support for an older `rigor_spec_version`.
- **Traceability**: Maintain a complete, immutable history of all published specification versions.

## 6. Formal Guarantees

The RIGOR Versioning model v0.1 guarantees:
- **Explicit Evolution**: No silent structural changes.
- **Measurable Compatibility**: Mathematical verification of backward compatibility.
- **Integrity**: Persistent instances can always be mapped to their specific structural contract.
- **Separation**: Clear distinction between the language, the implementation, and the runtime versions.
