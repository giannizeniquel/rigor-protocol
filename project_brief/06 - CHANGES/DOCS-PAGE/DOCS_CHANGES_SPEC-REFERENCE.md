Perfect. Below is the **detailed technical document for the Architect** regarding the required modifications to:

> `/specification/spec-reference.html`

This document is structured for validation first (Architect), then implementation (Builder).

---

# 📘 RIGOR – Specification Update Proposal

## Target Page: `spec-reference.html`

## Objective: Elevate to Formal Normative DSL Reference

---

# 1️⃣ Purpose of This Update

The current Spec Reference page is descriptive and example-oriented.

It must evolve into:

* A **normative DSL contract**
* Formally structured
* Deterministic
* Fully implementable
* Compatible with validation engine requirements
* Consistent with previously defined:

  * Core v0.1 semantic freeze
  * CLI validation matrix
  * Graph validation model
  * Transactional event model

This proposal defines the structural upgrades required.

---

# 2️⃣ Structural Reorganization (High-Level)

The page should be reorganized into the following sections:

1. Introduction (normative scope)
2. File Structure
3. Process Structure Grammar
4. Context Schema Definition
5. Event Declaration Grammar
6. State & Transition Grammar
7. Update Expression Grammar
8. Path Expression Grammar
9. Type System
10. Versioning Fields
11. Determinism & Constraints
12. Validation Errors (DSL-level)
13. Minimal Complete Example
14. Invalid Example & Expected Error

---

# 3️⃣ Section-by-Section Specification Additions

---

## 3.1 Normative Introduction

Add a clear statement:

* This document defines the **formal syntax and semantics** of a RIGOR specification file.
* This document is normative.
* All engines must conform to this grammar.
* Validation rules are deterministic.

---

# 4️⃣ File Structure (Top-Level Grammar)

Add EBNF definition:

```ebnf
spec_file ::= version_block process_block

version_block ::= "rigor_spec_version" ":" string
                  "spec_version" ":" string

process_block ::= "process" ":" process_name
                  context_block
                  events_block
                  states_block
```

Rules:

* `rigor_spec_version` is mandatory
* `spec_version` is mandatory
* `process` is mandatory
* Only one process per file (v0.1 constraint)

---

# 5️⃣ Type System Definition

Add a formal type table:

| Type     | Description      |
| -------- | ---------------- |
| string   | UTF-8 string     |
| integer  | 64-bit signed    |
| boolean  | true/false       |
| datetime | ISO-8601         |
| uuid     | RFC-4122         |
| object   | Key-value map    |
| array<T> | Homogeneous list |

Constraints:

* No union types in v0.1
* No implicit casting
* No dynamic typing
* Nullable fields must be declared explicitly (e.g., `string?`)

Grammar:

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

# 6️⃣ Context Schema Grammar

Formalize:

```ebnf
context_block ::= "context:" context_field+

context_field ::= identifier ":" type
```

Constraints:

* Field names must be unique
* Nested objects allowed only if explicitly typed
* Context is immutable except via transitions
* Fields not declared cannot be mutated

Add rule:

> Only fields declared in context may be updated.

---

# 7️⃣ Event Declaration Grammar

Formalize:

```ebnf
events_block ::= "events:" event_definition+

event_definition ::= identifier ":" payload_block

payload_block ::= "payload:" payload_field+

payload_field ::= identifier ":" type
```

Constraints:

* Event names must be unique
* Payload fields must be typed
* Event payload must match declaration during validation
* Events referenced in transitions must exist

---

# 8️⃣ State & Transition Grammar

Formalize:

```ebnf
states_block ::= "states:" state_definition+

state_definition ::= identifier ":" transition_block*

transition_block ::= identifier ":" transition_definition

transition_definition ::= "on:" event_name
                          "to:" state_name
                          update_block?
```

Constraints:

* `initial_state` must be declared
* All `to` states must exist
* No implicit state creation
* States must be reachable (strict mode)

Add explicit:

```yaml
initial_state: Pending
```

Grammar:

```ebnf
initial_state ::= "initial_state:" identifier
```

---

# 9️⃣ Update Expression Grammar

Critical addition.

Formalize:

```ebnf
update_block ::= "update_context:" update_statement+

update_statement ::= identifier ":" expression

expression ::= literal
             | event_reference
             | now_keyword
             | arithmetic_expression

event_reference ::= "event.payload." identifier

now_keyword ::= "now"

arithmetic_expression ::= context_reference operator literal

context_reference ::= "context." identifier

operator ::= "+" | "-" | "*" | "/"
```

Constraints:

* Only declared context fields may be updated
* Arithmetic allowed only for numeric types
* Type compatibility enforced
* No function calls in v0.1
* No arbitrary scripting

---

# 🔟 Path Expression Grammar

Define explicitly:

Allowed roots:

* `event.payload`
* `context`
* `now`

Disallowed:

* Arbitrary nesting beyond declared structure
* Global references
* External calls

Formal grammar:

```ebnf
path ::= "event.payload." identifier
       | "context." identifier
```

---

# 1️⃣1️⃣ Determinism Constraints

Add explicit section:

* No side effects outside transitions
* No implicit state changes
* Every transition is atomic
* Each event processing is a transactional unit
* Engine must process one event at a time

---

# 1️⃣2️⃣ Uniqueness & Start Rules

If start_command exists:

* Define whether uniqueness key is required
* Define idempotency expectations
* Define duplicate start behavior

If not implemented in v0.1, explicitly state:

> Start uniqueness is implementation-defined in v0.1 and not part of the core DSL.

---

# 1️⃣3️⃣ DSL-Level Validation Errors

Add formal error categories:

| Code          | Description                 |
| ------------- | --------------------------- |
| RIGOR-DSL-001 | Undefined state reference   |
| RIGOR-DSL-002 | Undefined event reference   |
| RIGOR-DSL-003 | Type mismatch in update     |
| RIGOR-DSL-004 | Invalid path expression     |
| RIGOR-DSL-005 | Duplicate declaration       |
| RIGOR-DSL-006 | Undeclared context mutation |

These must be distinct from CLI errors.

---

# 1️⃣4️⃣ Comment & Formatting Rules

Specify:

* YAML-based syntax
* `#` for comments
* Indentation rules follow YAML spec
* No tab indentation allowed

---

# 1️⃣5️⃣ Minimal Complete Example (Required)

Add a canonical example including:

* version
* context
* events
* initial_state
* states
* transition
* update_context

This example becomes:

> Reference example for SDK implementers.

---

# 1️⃣6️⃣ Invalid Example Section

Add example:

```yaml
update_context:
  unknown_field: 1
```

Expected:

```
RIGOR-DSL-006: Attempted mutation of undeclared context field 'unknown_field'
```

---

# 1️⃣7️⃣ Alignment With Other Specs

This update must align with:

* Validation Matrix
* Graph Model
* CLI Strict Mode
* Core v0.1 freeze

---

# 1️⃣8️⃣ Implementation Boundary Clarification

Important:

This page defines:

* Syntax
* Semantics
* Deterministic behavior

It must NOT include:

* Internal engine algorithms
* Graph traversal strategies
* Persistence models
* Queue implementations

Those belong in Implementation documentation.

---

# 1️⃣9️⃣ Summary of Required Additions

Mandatory Additions:

* Full EBNF grammar
* Type system formalization
* Path expression grammar
* Update expression grammar
* DSL error taxonomy
* Determinism guarantees
* Minimal complete example
* Invalid example

---

# 2️⃣0️⃣ Architect Validation Questions

Architect must confirm:

1. Are nested context objects allowed in v0.1?
2. Are arrays mutable or replace-only?
3. Is arithmetic limited to numeric types?
4. Are guards part of v0.1 or postponed?
5. Is start uniqueness part of core or implementation?
6. Do we freeze grammar as closed for v0.1?

