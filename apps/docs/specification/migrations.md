# Migrations (v0.1)

## 1. Formal Definition

A Migration is an ordered, deterministic set of operations that transforms a specification from version A to version B.

- **MUST** be declarative and deterministic.
- **MUST** be validatable.
- **MUST NOT** depend on external state.

## 2. File Structure & Location

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

### Rules
- Only forward migrations are supported in v0.1 (`from < to`).
- Chain must be sequential (no gaps, cycles, or forks).

## 3. Formal Grammar (EBNF)

```ebnf
migrations_block ::= "migrations:" migration_definition+
migration_definition ::= "-" "from:" version "to:" version "operations:" operation+
operation ::= add_state | remove_state | rename_state | add_event | remove_event | modify_transition | modify_context_schema
```

## 4. Permitted Operations (v0.1)

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

## 5. Validation Layers

### 5.1 Structural Validation
- Migration block format is valid.
- Chain is sequential (no gaps or forks).
- Operations are non-empty and properly formatted.

### 5.2 Graph Validation
- Post-migration graph **MUST** be valid.
- All states remain reachable from `initial_state`.
- Determinism is preserved (no ambiguous transitions).

### 5.3 Compatibility Validation
- Permitted operations **MUST** match the SemVer increment type.
- MINOR increments: add-only operations.
- MAJOR increments: destructive operations allowed.

## 6. Error Taxonomy

| Code | Description |
| :--- | :--- |
| `ER-MIGRATION-INVALID-VERSION` | Invalid version format. |
| `ER-MIGRATION-NON-SEQUENTIAL` | Gap in migration chain. |
| `ER-MIGRATION-CYCLE` | Cycle detected in chain. |
| `ER-MIGRATION-INVALID-OPERATION` | Unsupported or malformed operation. |
| `ER-MIGRATION-GRAPH-BROKEN` | Invalid graph results after migration. |

## 7. CLI Integration

The `rigor migrate` command resolves and applies migration chains:

```bash
rigor migrate <spec.yaml> --to <version>
```

**Behavior:**
1. **Resolve Chain**: Find sequential path from current version to target.
2. **Apply Sequential**: Execute each migration operation in order.
3. **Validate Result**: Run full validation on resulting specification.
4. **Emit Spec**: Output the migrated specification.

**Exit Codes:**
- `0`: Migration successful.
- `1`: Validation error or chain resolution failure.
