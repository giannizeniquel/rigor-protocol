# Events (v0.1)

## 1. Formal Definition

An Event is a named external input with an explicitly declared, statically typed payload schema that triggers state transitions within a Process.

- Events are declarative and non-executable.
- Events **MUST NOT** mutate state directly (only via transitions).

## 2. Formal Grammar (EBNF)

```ebnf
events_block ::= "events:" event_definition+
event_definition ::= identifier ":" payload_block
payload_block ::= "payload:" payload_field+
payload_field ::= identifier ":" type
```

## 3. Naming Rules (Normative)

- **Event Identifiers**: **MUST** be unique within the process and follow `PascalCase` (`^[A-Z][a-zA-Z0-9]*$`).
- **Payload Fields**: **MUST** follow `snake_case` (`^[a-z_][a-z0-9_]*$`).

## 4. Payload Schema Rules

- Payload types **MUST** conform to the RIGOR Type System.
- Optional fields **MUST** use the `?` suffix (e.g., `reason: string?`).
- Empty payloads are **ALLOWED** but **MUST** be explicitly declared as an empty `payload` block.
- **v0.1 Constraint**: No nested objects, union types, or dynamic fields.

## 5. Semantic Rules

- Events **MUST** be declared before use.
- Transitions **MUST** reference declared Events.
- Payload validation **MUST** occur before transition evaluation.
- All events in v0.1 are **External**. Internal event emission is **NOT** supported.

## 6. Event Processing Model

- Each event constitutes a single atomic transactional boundary.
- If validation or transition fails, **NO** state mutation or context update is persisted.

## 7. Runtime Event Envelope

A RIGOR-compliant event received by an engine **MUST** contain the following metadata:

| Field | Type | Description |
| :--- | :--- | :--- |
| `event_id` | `uuid` | Globally unique identifier for this event instance. |
| `event_name` | `string` | The formal name of the event (matching the spec). |
| `payload` | `object` | The data conforming to the declared payload schema. |
| `timestamp` | `datetime` | The UTC timestamp when the event was generated. |

The engine **SHOULD** use the `event_id` to ensure idempotency and prevent duplicate processing.

## 8. Validation & Error Taxonomy

| Code | Condition | Severity |
| :--- | :--- | :--- |
| EV-001 | Duplicate event_id | Error |
| EV-002 | Transition references undeclared event | Error |
| EV-003 | Payload type mismatch | Error |
| EV-004 | Unknown payload field | Error |
| EV-005 | Missing required payload field | Error |
| EV-006 | Invalid event naming pattern | Error |

## 8. Examples

### Valid Example: PaymentConfirmed

```yaml
events:
  PaymentConfirmed:
    payload:
      order_id: uuid
      amount: integer
      confirmed_at: datetime

process: OrderProcess
context:
  order_id: uuid
  status: string
  paid_at: datetime?

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
  payment_confirmed:  # EV-006
    payload:
      order_id: uuid
```
