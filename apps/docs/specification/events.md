# Events Specification (v0.1)

## 1. Purpose

This document defines **Events** for RIGOR Core v0.1. It establishes a formal, normative standard for event declaration, payload typing, and integration with Process transitions.

Events are **external inputs with typed payloads** that trigger state transitions. In v0.1, all events are considered **external**; internal event emission is not supported.

## 2. Event Definition

**Formal Definition:**
> An Event is a named external input with a declared, statically typed payload schema that triggers transitions in a Process.
> Events are declarative and non-executable. They **MUST NOT** mutate state directly; state mutation occurs exclusively via transitions.

## 3. Event Grammar (EBNF)

```ebnf
events_block       ::= "events:" event_definition+

event_definition   ::= "-" "event_id:" identifier NEWLINE
                       INDENT "payload_schema:" payload_schema DEDENT

payload_schema     ::= "type: object" NEWLINE
                       INDENT "properties:" properties
                       "required:" required_fields DEDENT

properties         ::= (field_name ":" type_reference)+
required_fields    ::= field_name+
field_name         ::= identifier
type_reference     ::= "string" | "integer" | "boolean" | "uuid" | "datetime"
```

## 4. Naming Rules (Normative)

- **Event Identifiers**: **MUST** be unique within the process and follow `PascalCase` (`^[A-Z][a-zA-Z0-9]+$`).
- **Payload Fields**: **MUST** follow `snake_case` (`^[a-z_][a-z0-9_]*$`).

## 5. Payload Schema Rules

- **Type System**: Payload types **MUST** conform to the RIGOR Type System.
- **Required Fields**: **MUST** be explicitly listed in the `required` block.
- **Optional Fields**: Can be declared using the `?` suffix in properties (e.g., `reason: string?`).
- **Empty Payloads**: **ALLOWED** but **MUST** use explicit syntax:
```yaml
payload_schema:
  type: object
  properties: {}
  required: []
```
- **v0.1 Constraints**: No union types, no dynamic fields, and no nested objects (unless explicitly typed as a formal sub-structure).

## 6. Semantic Rules

1. An Event **MUST** be declared in `events:` before use.
2. A Transition **MUST** reference a declared Event.
3. An Event **MUST NOT** cause mutation outside a Transition.
4. Payload validation **MUST** occur before transition evaluation.
5. Event declarations are **immutable across compatible versions**.

## 7. Event Processing Model

- Each event is processed atomically and constitutes a single **transactional boundary**.
- Failed validation or transition results in **NO** state mutation or context update being persisted.
- Event processing ensures strong consistency at the process level.

## 8. Runtime Event Envelope

A RIGOR-compliant event received by an engine **MUST** contain the following metadata:

| Field | Type | Description |
| :--- | :--- | :--- |
| `event_id` | `uuid` | Globally unique identifier for this event instance. |
| `event_name` | `string` | The formal name of the event (matching the spec). |
| `payload` | `object` | The data conforming to the declared payload schema. |
| `timestamp` | `datetime` | The UTC timestamp when the event was generated. |

The engine **SHOULD** use the `event_id` to ensure idempotency and prevent duplicate processing.

## 9. Validation & Error Taxonomy

| Code | Condition | Severity |
| :--- | :--- | :--- |
| EV-001 | Duplicate event_id | Error |
| EV-002 | Transition references undeclared event | Error |
| EV-003 | Payload type mismatch | Error |
| EV-004 | Unknown payload field | Error |
| EV-005 | Missing required payload field | Error |
| EV-006 | Invalid event naming pattern | Error |

## 10. Examples

### Valid Example: PaymentConfirmed

```yaml
events:
  - event_id: PaymentConfirmed
    payload_schema:
      type: object
      properties:
        order_id: uuid
        amount: integer
        confirmed_at: datetime
      required:
        - order_id
        - amount
        - confirmed_at

process: OrderProcess
initial_state: pending

states:
  pending:
    on:
      PaymentConfirmed:
        to: paid
        update_context:
          status: "paid"
          paid_at: event.payload.confirmed_at
  paid:
    terminal: true
```

### Invalid Naming Example

```yaml
# INVALID: starts with lowercase
events:
  - event_id: payment_confirmed  # EV-006
    payload_schema:
      type: object
      properties:
        order_id: uuid
      required:
        - order_id
```

## 11. Cross-References
* See [Type System](./spec-reference#3-type-system)
* See [Validation Matrix](./validation-matrix)
* See [Graph Model](./graph-model)
* See [Spec Core](./spec-core)
