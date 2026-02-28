# SPEC-REFERENCE v0.1

## RIGOR Process Specification — Normative Grammar

---

# 1. Scope

This document defines the **formal syntax and deterministic semantics** of a RIGOR v0.1 process specification file.

This specification is **normative**.

Any implementation claiming RIGOR compatibility **must conform** to:

* The grammar defined here
* The type system defined here
* The deterministic execution constraints defined here

This document defines:

* Structure
* Grammar
* Type system
* Update semantics
* Determinism guarantees

This document does **not** define:

* Persistence model
* Queueing model
* Engine internals
* Concurrency strategies

---

# 2. File Format

A RIGOR specification file:

* Must be YAML
* Must use UTF-8 encoding
* Must not use tab indentation
* May include comments using `#`

Only one process definition per file is allowed in v0.1.

---

# 3. Top-Level Structure

A valid RIGOR file must contain:

```yaml
rigor_spec_version: "0.1"
spec_version: "MAJOR.MINOR.PATCH"
process: ProcessName

initial_state: StateName

context:
  ...

events:
  ...

states:
  ...
```

All fields above are mandatory.

---

# 4. Formal Grammar (EBNF)

## 4.1 File Grammar

```ebnf
spec_file ::= version_block process_block

version_block ::= 
    "rigor_spec_version" ":" string
    "spec_version" ":" string

process_block ::= 
    "process" ":" identifier
    initial_state_block
    context_block
    events_block
    states_block
```

---

# 5. Version Fields

## 5.1 rigor_spec_version

* Must equal `"0.1"` for this version
* Engines must reject incompatible versions

## 5.2 spec_version

* Must follow semantic versioning
* Format: `MAJOR.MINOR.PATCH`
* Example: `"1.0.0"`

---

# 6. Type System

RIGOR v0.1 defines a closed type system.

## 6.1 Primitive Types

| Type     | Description           |
| -------- | --------------------- |
| string   | UTF-8 string          |
| integer  | 64-bit signed integer |
| boolean  | true or false         |
| datetime | ISO-8601 timestamp    |
| uuid     | RFC-4122 UUID         |

## 6.2 Composite Types

| Type     | Description             |
| -------- | ----------------------- |
| object   | Explicit structured map |
| array<T> | Homogeneous list        |

## 6.3 Nullable Types

Nullable types must be declared explicitly:

```
string?
integer?
```

No implicit nullability exists.

---

## 6.4 Type Grammar

```ebnf
type ::= "string"
       | "integer"
       | "boolean"
       | "datetime"
       | "uuid"
       | "object"
       | "array" "<" type ">"
       | type "?"
```

---

# 7. Context Definition

The context defines the persistent state of the process.

## 7.1 Grammar

```ebnf
context_block ::= "context:" context_field+

context_field ::= identifier ":" type
```

Example:

```yaml
context:
  order_id: uuid
  amount: integer
  status: string
  paid_at: datetime?
```

## 7.2 Rules

* Field names must be unique
* Fields not declared cannot be mutated
* Context is immutable outside transitions
* Nested objects are not allowed in v0.1 (flattened model only)

---

# 8. Event Declaration

Events define allowed external inputs.

## 8.1 Grammar

```ebnf
events_block ::= "events:" event_definition+

event_definition ::= identifier ":" payload_block

payload_block ::= "payload:" payload_field+

payload_field ::= identifier ":" type
```

Example:

```yaml
events:
  PaymentConfirmed:
    payload:
      transaction_id: uuid
```

## 8.2 Rules

* Event identifiers must be unique
* Events referenced in transitions must exist
* Payload types must match during runtime validation

---

# 9. States

States define the finite state machine.

## 9.1 Grammar

```ebnf
states_block ::= "states:" state_definition+

state_definition ::= identifier ":" transition_block*

transition_block ::= identifier ":" transition_definition
```

---

# 10. Initial State

```ebnf
initial_state_block ::= "initial_state:" identifier
```

Rules:

* Must reference an existing state
* Only one initial state allowed
* Initial state must be reachable (trivially true)

---

# 11. Transitions

## 11.1 Grammar

```ebnf
transition_definition ::= 
    "on:" event_name
    "to:" state_name
    update_block?
```

Example:

```yaml
states:
  Pending:
    confirm:
      on: PaymentConfirmed
      to: Paid
      update_context:
        status: "paid"
        paid_at: now
```

---

## 11.2 Transition Rules

* (state, event) pair must be unique
* Target state must exist
* Transitions are atomic
* No implicit state creation
* No transition allowed from terminal state (state with no transitions)

---

# 12. Update Semantics

Context mutation is allowed **only inside transitions**.

---

## 12.1 Grammar

```ebnf
update_block ::= "update_context:" update_statement+

update_statement ::= identifier ":" expression
```

---

## 12.2 Expressions

```ebnf
expression ::= literal
             | event_reference
             | context_reference
             | now_keyword
             | arithmetic_expression

event_reference ::= "event.payload." identifier
context_reference ::= "context." identifier
now_keyword ::= "now"

arithmetic_expression ::= context_reference operator literal

operator ::= "+" | "-" | "*" | "/"
```

---

## 12.3 Update Rules

* Only declared context fields may be updated
* Type compatibility must be enforced
* Arithmetic only allowed for integer fields
* No function calls allowed
* No external references allowed
* No nested mutation allowed

---

# 13. Path Expression Rules

Allowed roots:

* `event.payload`
* `context`
* `now`

Disallowed:

* Global scope
* External service calls
* Nested path resolution beyond declared fields

---

# 14. Determinism Guarantees

RIGOR v0.1 enforces deterministic execution.

Guarantees:

1. One event processed at a time
2. Each event is a transactional unit
3. State mutation only via declared transitions
4. No side effects outside transitions
5. No implicit behavior
6. Engine must be able to reproduce identical output for identical input

---

# 15. Prohibited Features (v0.1)

The following are explicitly not allowed:

* Guards
* Conditional branching outside transitions
* Nested objects in context
* Dynamic typing
* Union types
* Side effects
* Internal event emission (v0.1 external events only)
* Multiple processes per file

---

# 16. Validation Error Codes (DSL-Level)

Implementations must support these errors:

| Code          | Description                                  |
| ------------- | -------------------------------------------- |
| RIGOR-DSL-001 | Undefined state reference                    |
| RIGOR-DSL-002 | Undefined event reference                    |
| RIGOR-DSL-003 | Type mismatch in update                      |
| RIGOR-DSL-004 | Invalid path expression                      |
| RIGOR-DSL-005 | Duplicate declaration                        |
| RIGOR-DSL-006 | Undeclared context mutation                  |
| RIGOR-DSL-007 | Invalid initial state                        |
| RIGOR-DSL-008 | Multiple transitions for same (state, event) |

---

# 17. Minimal Complete Example

```yaml
rigor_spec_version: "0.1"
spec_version: "1.0.0"
process: OrderProcess

initial_state: Pending

context:
  order_id: uuid
  status: string
  paid_at: datetime?

events:
  PaymentConfirmed:
    payload:
      transaction_id: uuid

states:
  Pending:
    confirm:
      on: PaymentConfirmed
      to: Paid
      update_context:
        status: "paid"
        paid_at: now

  Paid:
```

---

# 18. Invalid Example

```yaml
update_context:
  unknown_field: 1
```

Must produce:

```
RIGOR-DSL-006: Attempted mutation of undeclared context field 'unknown_field'
```

---

# 19. Conformance Requirement

A RIGOR Engine is compliant with v0.1 if and only if:

* It validates specifications according to this grammar
* It enforces all deterministic constraints
* It produces DSL error codes as defined
* It rejects unsupported constructs

---

# End of SPEC-REFERENCE v0.1
