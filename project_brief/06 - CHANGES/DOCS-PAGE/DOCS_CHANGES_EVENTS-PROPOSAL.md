# SPEC-EVENTS.md — RIGOR Event Specification v0.1

## 1. Purpose

This document defines **Events** for RIGOR Core v0.1. It establishes a formal, normative standard for event declaration, payload typing, and integration with Process transitions.

Events are **external inputs with typed payloads** that may trigger state transitions. In v0.1, all events are considered **external**; internal event emission is not supported.

---

## 2. Event Definition

**Formal Definition:**

> An Event is a named external input with a declared, statically typed payload schema that can trigger transitions in a Process.
> Events do not mutate state directly. State mutation occurs only via transitions.

---

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

---

## 4. Naming Rules

Event identifiers must:

* Be **unique** within the process
* Match the pattern: `^[A-Z][A-Za-z0-9]+$` (PascalCase)
* Avoid snake_case, kebab-case, numeric prefixes

**Examples:**

Valid:

```yaml
PaymentConfirmed
UserRegistered
```

Invalid:

```yaml
payment_confirmed
payment-confirmed
1Event
```

---

## 5. Payload Schema Rules

* **Payload types** must follow the RIGOR Type System
* **Required fields** must be explicitly listed
* **Optional fields** can be declared as:

```yaml
field_name?: type
```

* **Empty payloads** allowed only with explicit syntax:

```yaml
payload_schema:
  type: object
  properties: {}
  required: []
```

* **No union types** or arbitrary JSON blobs
* Nested objects allowed only if explicitly typed

---

## 6. Semantic Rules

1. An Event must be declared in `events:` before use
2. A Transition must reference a declared Event
3. An Event does not mutate state directly
4. Payload validation occurs **before** transition evaluation
5. Event declarations are **immutable across compatible versions**

---

## 7. Relationship with Transitions

* Each `(state_id, event_id)` pair must be **unique**
* The `event_id` in a transition must exist in `events:` block
* Violations result in deterministic validation errors

---

## 8. Event Processing Model

* Each event is processed atomically
* Each event is a single transactional boundary
* Failed validation or transition → **no state mutation**
* Event processing aligns with Graph Model and ensures consistency

---

## 9. Validation Rules

| Rule   | Condition                              | Severity |
| ------ | -------------------------------------- | -------- |
| EV-001 | Duplicate event_id                     | Error    |
| EV-002 | Transition references undeclared event | Error    |
| EV-003 | Payload type mismatch                  | Error    |
| EV-004 | Unknown payload field                  | Error    |
| EV-005 | Missing required payload field         | Error    |
| EV-006 | Invalid event naming pattern           | Error    |

---

## 10. Error Taxonomy

Example structured errors:

```text
RIGOR-EV-002:
Transition references event 'PaymentConfirmed'
which is not declared in events block.
```

* Includes `event_id` and location
* Deterministic and actionable

---

## 11. Valid Example

```yaml
events:
  - event_id: PaymentConfirmed
    payload_schema:
      type: object
      properties:
        transactionId:
          type: string
      required:
        - transactionId
```

---

## 12. Invalid Examples

### 12.1 Undeclared in Transition

```yaml
transitions:
  - event: UnknownEvent
    target: Paid
```

Error: EV-002

---

### 12.2 Payload Type Mismatch

```yaml
events:
  - event_id: PaymentConfirmed
    payload_schema:
      type: object
      properties:
        transactionId:
          type: number
      required:
        - transactionId
```

If the process expects `string` → EV-003

---

### 12.3 Naming Violation

```yaml
event_id: payment_confirmed
```

Error: EV-006

---

## 13. Cross-References

* See [Type System](type-system.html)
* See [Validation Matrix](validation.html)
* See [Graph Model](graph-model.html)
* See [SPEC-REFERENCE](spec-reference.html)
* See [Process Model](protocol-model.html)

---

## 14. Notes

* Core v0.1 enforces **state mutation only via transitions**
* Events are **declarative**, deterministic, and typed
* Future versions may include **internal events** and queuing mechanisms

---

This completes the **normative Events v0.1 page**.

It is fully aligned with SPEC-CORE and SPEC-REFERENCE v0.1, ready to replace the current documentation page.
