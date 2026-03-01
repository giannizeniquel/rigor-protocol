El objetivo es elevarla a **nivel normativo RIGOR Core v0.1**, alineado con SPEC-CORE, SPEC-REFERENCE y el Validation Matrix.

---

# 📄 ARCHITECT REVIEW DOCUMENT

## Target: Specification → Events

## Version: Proposed RIGOR Core v0.1 Alignment

## Status: Normative Upgrade Required

---

# 1. OBJECTIVE OF THIS REVISION

Transform the current Events page from a descriptive explanation into a **formally normative specification document** that:

* Defines Event grammar
* Defines Event semantics
* Establishes payload typing rules
* Enforces linkage constraints with transitions
* Declares validation behavior
* Clarifies internal vs external events (Core v0.1)
* Aligns with the Type System and Graph Model

---

# 2. STRUCTURAL REORGANIZATION REQUIRED

The page must be restructured into the following normative sections:

1. Definition of Event
2. Event Block Grammar (EBNF)
3. Event Declaration Structure
4. Naming Rules
5. Payload Schema Rules
6. Semantic Rules
7. Relationship with Transitions
8. Event Processing Model (Core v0.1)
9. Validation Rules
10. Error Taxonomy
11. Valid / Invalid Examples
12. Cross-References

---

# 3. REQUIRED ADDITIONS

---

# 3.1 Formal Definition of Event

Add normative definition:

> An Event is a named external input with an explicitly declared, statically typed payload schema that may trigger state transitions within a Process.

Clarify:

* Events are declarative constructs.
* Events are not executable.
* Events do not mutate state directly.
* State mutation occurs only via transitions.

---

# 3.2 Formal Grammar (EBNF)

The following grammar must be added:

```ebnf
events_block       ::= "events:" event_definition+

event_definition   ::= "-" event_id ":" NEWLINE INDENT payload_schema DEDENT

event_id           ::= identifier

payload_schema     ::= "payload:" NEWLINE INDENT payload_fields DEDENT

payload_fields     ::= payload_field+

payload_field      ::= identifier ":" type_reference
```

If YAML-based structure is canonical:

```ebnf
event_definition ::= 
  "- event_id:" identifier NEWLINE
  INDENT
    "payload_schema:" object_schema
  DEDENT
```

Grammar must be aligned with SPEC-REFERENCE v0.1.

---

# 3.3 Naming Rules (Normative)

Add explicit constraints:

### Event Identifier Rules

* Must be unique within the process.
* Must follow pattern:

```
^[A-Z][A-Za-z0-9]*$
```

Example:

```
PaymentConfirmed
UserRegistered
```

Disallowed:

```
payment_confirmed
payment-confirmed
1Event
```

Rationale:
Ensure consistency and prevent DSL ambiguity.

---

# 3.4 Payload Schema Rules

The page must explicitly define:

### 3.4.1 Type System Integration

Payload types must:

* Conform to the RIGOR Type System
* Be statically resolvable
* Not allow implicit typing

### 3.4.2 Required vs Optional Fields

Define syntax for optional fields:

```
field_name?: string
```

or:

```
optional: true
```

Architect must decide canonical syntax.

---

### 3.4.3 Allowed Structures

Core v0.1 constraints:

* Primitive types allowed
* Structured objects allowed if explicitly defined
* No union types
* No dynamic fields
* No arbitrary JSON blobs

---

### 3.4.4 Empty Payload

Must explicitly define:

* Whether events may have empty payload.
* If allowed, canonical syntax:

```yaml
payload_schema:
  type: object
  properties: {}
  required: []
```

---

# 3.5 Semantic Rules (Normative)

Add:

1. An Event MUST be declared in `events:` before use.
2. A Transition MUST reference a declared Event.
3. An Event MUST NOT cause mutation outside a Transition.
4. Payload validation MUST occur before transition evaluation.
5. Event declaration MUST be immutable across compatible versions.

---

# 3.6 Relationship with Transitions

Add formal rule:

For every transition:

```
(state_id, event_id)
```

* event_id MUST exist in events block.
* Each pair (state, event) MUST be unique.

Violation → validation error.

---

# 3.7 Internal vs External Events (Core v0.1)

Explicitly state:

> In RIGOR Core v0.1, all events are considered external inputs.
> Internal event emission is not supported in Core v0.1.

Future roadmap may introduce internal events via queue mechanism.

This must be documented to prevent ambiguity.

---

# 3.8 Event Processing Model

Clarify:

* Each event is processed atomically.
* Each event constitutes a single transactional boundary.
* If validation fails → no state mutation occurs.
* If transition fails → no partial mutation allowed.

This aligns with Graph Model + Transactional Guarantee.

---

# 3.9 Validation Rules (Normative)

Add explicit validation matrix subset for events:

| Rule   | Condition                              | Severity |
| ------ | -------------------------------------- | -------- |
| EV-001 | Duplicate event_id                     | Error    |
| EV-002 | Transition references undeclared event | Error    |
| EV-003 | Payload type mismatch                  | Error    |
| EV-004 | Unknown payload field                  | Error    |
| EV-005 | Missing required payload field         | Error    |
| EV-006 | Invalid event naming pattern           | Error    |

Must reference Validation Matrix document.

---

# 3.10 Error Taxonomy

Add structured error examples:

```
RIGOR-EV-002:
Transition references event 'PaymentConfirmed'
which is not declared in events block.
```

Errors must:

* Include event_id
* Include location reference
* Be deterministic

---

# 3.11 Valid and Invalid Examples

## Valid Example

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

## Invalid Example — Undeclared in Transition

```yaml
transitions:
  - event: UnknownEvent
    target: Paid
```

Error: EV-002

---

## Invalid Example — Type Mismatch

```yaml
transactionId:
  type: number
```

If declared as string → error.

---

## Invalid Example — Naming Violation

```yaml
event_id: payment_confirmed
```

Error: EV-006

---

# 3.12 Cross-References Required

At bottom of page add:

* See Type System
* See Validation Matrix
* See Graph Model
* See SPEC-REFERENCE
* See Process Model

---

# 4. ALIGNMENT CHECK WITH CORE PRINCIPLES

Ensure page explicitly reinforces:

* State mutation only via transitions
* Strong typing
* Deterministic behavior
* Explicit declaration
* No implicit event creation

---

# 5. WHAT MUST NOT BE INCLUDED HERE

Do NOT include:

* CLI flag behavior
* Engine runtime internals
* Implementation-specific queue systems
* Code generation details

Those belong to Implementation section.

---

# 6. ARCHITECT DECISIONS REQUIRED

The architect must confirm:

1. Final event naming convention
2. Optional field syntax
3. Empty payload policy
4. Primitive type list (if centralized or repeated)
5. Error code namespace standard

---

# 7. IMPACT LEVEL

| Area                   | Impact |
| ---------------------- | ------ |
| Validation Engine      | Medium |
| CLI Strict Mode        | Medium |
| Spec Parser            | Low    |
| Docs Consistency       | High   |
| Future Internal Events | High   |

---

# 8. RESULTING STATE AFTER APPROVAL

After implementation:

* Events page becomes fully normative.
* RIGOR Core v0.1 event model becomes unambiguous.
* Validation behavior becomes deterministic.
* DSL ambiguity eliminated.
* Spec quality significantly elevated.

---
