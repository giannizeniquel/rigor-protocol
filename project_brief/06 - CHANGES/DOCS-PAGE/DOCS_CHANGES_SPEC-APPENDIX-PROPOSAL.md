# RIGOR Specification

## Spec Appendix v0.1 (Normative)

Status: Draft
Version: 0.1
Scope: Normative Auxiliary Specification

This document complements the RIGOR Core Specification.
It defines auxiliary normative conventions, notational rules, glossary terms, structured error examples, and edge-case clarifications.

This document MUST NOT override or redefine rules declared in:

* Spec Core v0.1
* Spec Reference v0.1
* Events v0.1
* Versioning v0.1
* Migrations v0.1
* Diff v0.1

If conflict occurs, primary specifications prevail.

---

# A. Normative Terminology

The following keywords are normative:

* MUST — Mandatory requirement
* MUST NOT — Prohibited
* SHOULD — Strong recommendation
* MAY — Optional

These keywords are case-sensitive and semantically binding.

---

# B. Notation and Conventions

## B.1 Identifier Rules

Identifiers MUST:

* Be ASCII
* Begin with a letter
* Contain only letters, numbers, underscore
* Be case-sensitive

Formal regex:

```regex
^[A-Za-z][A-Za-z0-9_]*$
```

Identifiers violating this rule MUST produce a validation error.

---

## B.2 Naming Recommendations

The following naming patterns are recommended but not mandatory:

| Element Type | Convention |
| ------------ | ---------- |
| Entities     | PascalCase |
| Processes    | PascalCase |
| Events       | PascalCase |
| Properties   | camelCase  |
| Context Keys | camelCase  |
| Transitions  | verbNoun   |

Canonicalization MUST NOT alter naming.

---

# C. Canonical Path Syntax (Normative)

Paths are used in:

* Diff ChangeSets
* Validation errors
* Migration mappings
* CLI output

## C.1 Path Grammar

```
Path := "/" Segment { "/" Segment }
Segment := Identifier
```

Examples:

```
/entities/User
/entities/User/properties/email
/processes/Order/states/Paid
/processes/Order/transitions/pay
/events/UserCreated/payload/userId
```

Paths MUST:

* Be absolute
* Be case-sensitive
* Map to exactly one node in the canonical graph
* Be stable across canonicalization

---

## C.2 Property Attribute Path

Attributes of properties MUST append as:

```
/entities/User/properties/email/type
/entities/User/properties/email/required
```

---

## C.3 Cardinality Path

```
/entities/User/relations/orders/cardinality
```

---

# D. Glossary (Normative)

## Node

A structural element in the canonical graph.

## Edge

A directed relationship between nodes.

## Entity

A domain object with identity and properties.

## Property

A typed attribute belonging to an entity.

## Process

A state machine governing transitions.

## State

A discrete process configuration.

## Transition

A directed change between states.

## Event

A domain signal emitted during transitions.

## Payload

Structured data emitted by an event.

## Canonical Graph

Normalized graph representation derived from a specification.

## Breaking Change

A modification that invalidates at least one instance valid under a previous specification.

## NonBreaking Change

A modification preserving all previously valid instances.

## ChangeSet

Structured list of atomic changes produced by Diff.

## Migration

A deterministic transformation from one version to another.

---

# E. YAML Structural Guide (Normative for Tooling)

## E.1 Indentation

* Two spaces
* Tabs MUST NOT be used

---

## E.2 Recommended Block Order

Recommended but not required:

1. spec_version
2. rigor_spec_version
3. entities
4. processes
5. events
6. metadata

Canonicalization MUST ignore ordering.

---

## E.3 Comments

* YAML comments are permitted
* Comments MUST be ignored during canonicalization
* Comments MUST NOT affect semantics

---

# F. Common Validation Errors (Normative Examples)

Each error MUST contain:

* Error Code
* Canonical Path
* Message
* Specification Reference

## F.1 Missing Required Attribute

Input:

```yaml
entities:
  User:
    properties:
      email:
        type: string
```

Error:

```
Code: ERR_STRUCTURE_REQUIRED_MISSING
Path: /entities/User/properties/email/required
Message: Required attribute must be explicitly declared.
Reference: Spec Reference v0.1 §3
```

---

## F.2 Invalid Identifier

Input:

```yaml
entities:
  123User:
    identity: id
```

Error:

```
Code: ERR_SYNTAX_INVALID_IDENTIFIER
Path: /entities/123User
Message: Identifier does not match required pattern.
Reference: Appendix §B.1
```

---

## F.3 Version Violation (Breaking Without Major Bump)

Error:

```
Code: ERR_VERSION_MAJOR_REQUIRED
Message: Breaking changes detected without major version increment.
Reference: Versioning v0.1
```

---

## F.4 Undefined State in Transition

Error:

```
Code: ERR_PROCESS_UNDEFINED_STATE
Path: /processes/Order/transitions/pay
Message: Transition references undefined state.
Reference: Spec Reference v0.1
```

---

## Error Code Format

All error codes MUST follow:

```
ERR_<CATEGORY>_<DETAIL>
```

Categories include:

* SYNTAX
* STRUCTURE
* PROCESS
* EVENT
* CONSTRAINT
* VERSION
* MIGRATION
* DIFF

---

# G. Edge Cases (Normative Clarifications)

## G.1 Process With Single Terminal State

A process with one state and no transitions is valid if:

* An initial state is declared
* No transitions exist
* The state is terminal

---

## G.2 Explicit Empty Payload

Events with no data SHOULD declare:

```yaml
payload: {}
```

Implicit null payload MAY be rejected by strict validators.

---

## G.3 Terminal State Without Outgoing Transitions

Allowed. MUST NOT produce validation error.

---

## G.4 Multiple Transitions to Same Target

Permitted unless semantic conflict is defined by guard or invariant rules.

---

## G.5 Entity With Only Identity

Allowed if explicitly declared.

---

## G.6 Optional Fields With Default

If a field has:

```
required: false
default: <value>
```

The default MUST be type-valid.

---

# H. Implementation Mapping Notes (Interpretative)

This section clarifies expected implementation behavior.

## H.1 Canonical Graph Derivation

Each entity MUST map to a node:

```
Entity(User)
  ├── Property(id)
  ├── Property(email)
```

Processes MUST map to:

```
Process(Order)
  ├── State(Pending)
  ├── State(Paid)
  ├── Transition(pay)
```

---

## H.2 Recommended Validation Order

1. Syntax validation
2. Structural validation
3. Identity validation
4. Constraint validation
5. Process graph validation
6. Event validation
7. Version validation

Order MUST be deterministic.

---

# I. Full Reference Example (Normative Demonstration)

The following specification MUST validate successfully under RIGOR v0.1:

```yaml
spec_version: 1.0.0
rigor_spec_version: 0.1

entities:
  User:
    identity: id
    properties:
      id:
        type: uuid
        required: true
      email:
        type: string
        required: true

processes:
  UserLifecycle:
    initial: Pending
    states:
      Pending: {}
      Active: {}
    transitions:
      activate:
        from: Pending
        to: Active
        event: UserActivated

events:
  UserActivated:
    payload:
      userId:
        type: uuid
```

This example:

* Defines one entity
* Defines one process
* Defines one event
* Includes identity
* Includes required properties
* Includes valid transition

It MUST pass validation.

---

# J. Conformance

An implementation claiming compliance with RIGOR v0.1 MUST:

* Implement canonical path resolution
* Implement structured error codes
* Follow identifier constraints
* Respect canonicalization rules
* Interpret this appendix consistently with primary specifications

---

# K. Version Alignment

This Appendix is aligned with:

RIGOR Spec Core v0.1

If future versions introduce new structural elements, this appendix MUST be updated accordingly.

---

End of Spec Appendix v0.1 (Normative)
