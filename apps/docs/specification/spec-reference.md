# Spec Reference (v0.1)

This document defines the formal syntax and semantics of the RIGOR DSL v0.1 and is normative for all compliant engines.

## 1. Introduction

The RIGOR DSL (Domain Specific Language) provides a formal syntax for defining processes. This reference defines:
- File structure grammar
- Type system
- Context schema syntax
- Event declaration syntax
- State and transition grammar
- Update expression syntax

## 2. File Structure (EBNF)

```ebnf
spec_file ::= version_block process_block
version_block ::= "rigor_spec_version" ":" string
                "spec_version" ":" string
process_block ::= "process" ":" identifier
                context_block
                events_block
                initial_state
                states_block
```
*Rule: Only one process per file in v0.1.*

## 3. Type System

### 3.1 Supported Types (v0.1)
| Type | Description |
| :--- | :--- |
| `uuid` | RFC-4122 Universal Unique Identifier |
| `string` | UTF-8 Text |
| `integer` | 64-bit Signed Integer |
| `boolean` | Boolean Value (`true` / `false`) |
| `datetime` | ISO-8601 Date/Time |
| `object` | JSON Object |
| `array<type>` | Typed Array |

### 3.2 Nullability
Explicitly declared with `?` suffix:
- `string?` - Nullable string
- `datetime?` - Nullable datetime

*Nullable fields default to `null` on process initialization.*

## 4. Context Schema

```ebnf
context_block ::= "context:" context_field+
context_field ::= identifier ":" type
```
*Rule: Fields are immutable except via transition updates.*

### 4.1 Field Naming
- **Format**: `snake_case`
- **Regex**: `^[a-z_][a-z0-9_]*$`

### 4.2 Context Initialization
| Type | Default Value |
| :--- | :--- |
| `integer` | `0` |
| `string` | `""` (empty string) |
| `boolean` | `false` |
| `datetime` | `null` |
| Nullable (`?`) | `null` |

## 5. Event Declaration

```ebnf
events_block ::= "events:" event_definition+
event_definition ::= identifier ":" payload_block
payload_block ::= "payload:" payload_field+
```

### 5.1 Event Naming
- **Format**: `PascalCase`
- **Regex**: `^[A-Z][a-zA-Z0-9]*$`

## 6. State & Transition Grammar

```ebnf
states_block ::= "states:" state_definition+
state_definition ::= identifier ":" transition_block*
transition_block ::= "on:" event_name
                    "to:" state_name
                    update_block?
initial_state ::= "initial_state:" identifier
```

### 6.1 State Naming
- **Format**: `UPPER_SNAKE_CASE`
- **Regex**: `^[A-Z][A-Z0-9_]*$`

### 6.2 State Effects
Each state must declare **exactly one** effect:
- `emit_command`: Asynchronous external action
- `invoke`: Synchronous internal use case
- `terminal`: Process conclusion (no outgoing transitions)

## 7. Update Expression Grammar

```ebnf
update_block ::= "update_context:" update_statement+
update_statement ::= identifier ":" expression
expression ::= literal | path | "now" | arithmetic_expression
path ::= "event.payload." identifier | "context." identifier
arithmetic_expression ::= "context." identifier ( "+" | "-" | "*" | "/" ) literal
```
*Rule: Only declared context fields may be updated. Type compatibility is mandatory.*

### 7.1 Supported Operations
| Operation | Description | Example |
| :--- | :--- | :--- |
| `now` | Current timestamp | `approved_at: now` |
| `increment` | Add 1 to integer | `attempts: increment` |
| `literal` | Direct value | `status: "approved"` |
| `event.payload` | From event | `error: event.payload.reason` |

## 8. Determinism Constraints

- No side effects
- Transitions are atomic
- Event processing is a transactional unit
- Each `(state, event)` pair maps to at most one transition
- Context can only mutate inside declared transitions
- No implicit state changes

## 9. Prohibited Features (v0.1)

The following features are explicitly prohibited in RIGOR v0.1:

| Feature | Reason |
| :--- | :--- |
| **Guards / Conditions** | Determinism requires unambiguous transitions |
| **Internal Events** | All events must be external and explicitly declared |
| **Parallelism** | Violates atomic transactional model |
| **Sub-processes** | Complexity prohibited in v0.1 |
| **Dynamic Fields** | Context schema must be static |
| **Nested Objects** | Only primitive types in v0.1 |
| **Computed Fields** | All values must be explicit |

## 10. DSL Validation Errors

| Code | Description |
| :--- | :--- |
| RIGOR-DSL-001 | Undefined state reference |
| RIGOR-DSL-002 | Undefined event reference |
| RIGOR-DSL-003 | Type mismatch in update |
| RIGOR-DSL-004 | Invalid path expression |
| RIGOR-DSL-005 | Duplicate declaration |
| RIGOR-DSL-006 | Undeclared context mutation |
| RIGOR-DSL-007 | Multiple state effects declared |
| RIGOR-DSL-008 | Terminal state with outgoing transitions |

## 11. Minimal Complete Example

```yaml
# Version Block
rigor_spec_version: "0.1"
spec_version: "1.0.0"

# Process Definition
process: OrderProcess

# Context Schema
context:
  order_id: uuid
  status: string
  amount: integer
  approved_at: datetime?
  rejected_at: datetime?

# Event Declarations
events:
  approve:
    payload:
      approved_by: string
  reject:
    payload:
      reason: string

# Initial State
initial_state: created

# States and Transitions
states:
  created:
    emit_command: ProcessOrder
    on:
      approve:
        to: approved
        update_context:
          status: "approved"
          approved_at: now
      reject:
        to: rejected
        update_context:
          status: "rejected"
          rejected_at: now
  approved:
    terminal: true
  rejected:
    terminal: true
```

### Example Breakdown:
- **Version Block**: `rigor_spec_version` and `spec_version` are mandatory
- **Context**: Defines `order_id`, `status`, `amount`, `approved_at`, `rejected_at`
- **Events**: `approve` and `reject` with payloads
- **Transitions**: `created` state handles both events with `update_context`
- **Terminal States**: `approved` and `rejected` have no outgoing transitions
