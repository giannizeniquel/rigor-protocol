# Migrations (v0.1)

## 1. Purpose & Formal Definition

The Migrations specification defines the formal model for migrating persisted process instances when a specification undergoes a version change.

A Migration is an ordered, deterministic set of operations that transforms a specification from version A to version B.

- **MUST** be declarative and deterministic.
- **MUST** be statically validatable.
- **MUST NOT** depend on external state.
- **MUST NOT** execute arbitrary code.

## 2. Location & Sequentiality

Migrations are declared in the root `migrations:` block of the specification document.

```yaml
rigor_spec_version: "0.1"
spec_version: "2.0.0"

migrations:
  - from: "1.0.0"
    to: "2.0.0"
    operations:
      - remove_state: pending

process: OrderProcess
# ...
```

### Sequentiality Rules
- **MUST** satisfy `from < to` (forward only).
- **MUST** satisfy `to == spec_version`.
- **MUST NOT** have gaps between versions.
- **MUST NOT** have forks (multiple paths).
- **MUST NOT** have cycles.

## 3. Formal Grammar (EBNF)

```ebnf
migrations_block ::= "migrations:" migration_definition+
migration_definition ::= "-" "from:" version "to:" version "operations:" operation+
operation ::= add_state | remove_state | rename_state | add_event | remove_event | modify_transition | modify_context_schema
```

## 4. Operation Model (Normative Rules)

All migration operations **MUST** satisfy:

- **MUST** be deterministic: given the same input, produce the same output.
- **MUST** be idempotent within a single execution.
- **MUST NOT** introduce non-determinism.
- **MUST NOT** depend on external state or side effects.

### 4.1 add_state

Adds a new state to the specification.

```yaml
operations:
  - add_state:
      name: processing
      terminal: false
```

**Rules:**
- State name **MUST NOT** already exist.
- If marked as `initial: true`, it **MUST NOT** conflict with existing initial state.

### 4.2 remove_state

Removes an existing state from the specification.

```yaml
operations:
  - remove_state: pending
```

**Rules:**
- State **MUST NOT** be the `initial_state`.
- State **MUST NOT** have active incoming or outgoing transitions (unless redirected).
- Allowed only in MAJOR version increments.

### 4.3 rename_state

Renames an existing state.

```yaml
operations:
  - rename_state:
      from: pending
      to: awaiting
```

**Rules:**
- Source state **MUST** exist.
- Target name **MUST NOT** already exist.
- **MUST** update all references (transitions, `initial_state`).

### 4.4 add_event

Adds a new event to the specification.

```yaml
operations:
  - add_event:
      name: ProcessCompleted
      payload:
        result: string
```

**Rules:**
- Event name **MUST NOT** already exist.

### 4.5 remove_event

Removes an existing event.

```yaml
operations:
  - remove_event: OrderCancelled
```

**Rules:**
- Allowed only in MAJOR version increments (destructive change).
- Event **MUST NOT** be referenced by any transition.

### 4.6 modify_transition

Modifies an existing transition.

```yaml
operations:
  - modify_transition:
      from: created
      event: OrderPlaced
      to: processing
```

**Rules:**
- Transition **MUST** exist.
- **MUST NOT** break determinism (no conflicting transitions to same state).

### 4.7 modify_context_schema

Modifies the context schema.

```yaml
operations:
  - modify_context_schema:
      field: customer_id
      type: string
      required: false
```

**Rules:**
- Incompatible type changes **MUST** require MAJOR increment.
- Adding optional fields is MINOR.
- Adding required fields **MUST** include default value.

## 5. Validation Phases

### 5.1 Structural Validation
- Migration block syntax is valid.
- Version formats are correct.
- Chain satisfies sequentiality rules.

### 5.2 Semantic Validation
- Operation legality matches SemVer increment type.
- Operations are properly formatted.

### 5.3 Graph Validation
- Post-migration graph **MUST** be valid.
- All states remain reachable from `initial_state`.
- `initial_state` exists in the new graph.
- Determinism is preserved (no ambiguous transitions).

## 6. Version Compatibility Matrix

| Version Increment | Permitted Operations |
| :--- | :--- |
| **PATCH** | Metadata only (documentation, comments). |
| **MINOR** | Additive only: `add_state`, `add_event`, `add_transition`, `modify_context_schema` (optional fields). |
| **MAJOR** | Additive + Destructive: All operations including `remove_state`, `remove_event`, `rename_state`, type-changing `modify_context_schema`. |

## 7. Atomicity & Security

### 7.1 Atomicity
Migration application is **atomic**:
- All operations **MUST** succeed or all **MUST** fail.
- Partial application is not permitted.
- On failure, the specification **MUST** remain unchanged.

### 7.2 Security
- Migration **MUST NOT** execute arbitrary code.
- Migration **MUST** be purely declarative.
- No imperative logic, loops, or conditionals beyond YAML structure.

## 8. Chain Model

The migration chain represents the sequential path from one version to another:

```
1.0.0 → 1.1.0 → 2.0.0 → 2.1.0
```

### Chain Rules
- Each link **MUST** satisfy `from(n) == to(n-1)`.
- Chain **MUST** start from the current `spec_version`.
- Chain **MUST** end at the target version.
- Engine **MUST** resolve intermediate steps automatically.

## 9. Error Taxonomy

| Code | Description |
| :--- | :--- |
| `ER-MIG-INVALID-VERSION` | Invalid version format. |
| `ER-MIG-NON-SEQUENTIAL` | Gap in migration chain. |
| `ER-MIG-CYCLE` | Cycle detected in chain. |
| `ER-MIG-FORK` | Fork detected in chain. |
| `ER-MIG-INVALID-OPERATION` | Unsupported or malformed operation. |
| `ER-MIG-GRAPH-BROKEN` | Invalid graph results after migration. |
| `ER-MIG-VERSION-MISMATCH` | Migration target does not match `spec_version`. |

## 10. CLI Integration

The `rigor migrate` command resolves and applies migration chains:

```bash
rigor migrate <spec.yaml> --to <version>
```

### Execution Steps

1. **Resolve Chain**: Find sequential path from current version to target.
2. **Validate Preconditions**: Verify all migrations in chain are valid.
3. **Apply Operations**: Execute each migration operation in order atomically.
4. **Validate Graph**: Run graph validation on resulting specification.
5. **Emit Spec**: Output the migrated specification with updated `spec_version`.

### Exit Codes
- `0`: Migration successful.
- `1`: Validation error or chain resolution failure.
