# RIGOR Specification

## Spec Appendix v0.1

### Architectural Revision Proposal (Detailed Document for Architect)

Status: Proposal
Target: Normative Appendix (Auxiliary)
Scope: Complementary to all Specification Documents

---

# 1. Purpose of Spec Appendix

The Spec Appendix MUST function as:

* A normative auxiliary reference
* A clarification layer for conventions
* A structured glossary
* A repository of canonical examples
* A formalization of notational rules
* A documentation of edge cases

It MUST NOT:

* Redefine rules declared in other specifications
* Override normative behavior
* Introduce semantic changes

It MAY clarify interpretation.

---

# 2. Proposed Final Structure

The Appendix SHOULD be structured as follows:

```
Spec Appendix
 ├── A. Notation and Conventions
 ├── B. Canonical Path Syntax
 ├── C. Glossary
 ├── D. Common Validation Errors
 ├── E. YAML Style Guide
 ├── F. Edge Cases
 ├── G. Implementation Mapping Notes
 ├── H. Full Reference Example
```

Each section described below.

---

# A. Notation and Conventions (Normative Auxiliary)

## A.1 Terminology Conventions

All documents MUST interpret:

* MUST → Mandatory requirement
* MUST NOT → Prohibited
* SHOULD → Recommended but not mandatory
* MAY → Optional

Capitalization is semantic.

---

## A.2 Identifier Conventions

Identifiers MUST:

* Be ASCII
* Start with a letter
* Contain only letters, numbers, underscore
* Be case-sensitive

Regex:

```
^[A-Za-z][A-Za-z0-9_]*$
```

---

## A.3 Naming Conventions

Recommended patterns:

| Element Type | Convention |
| ------------ | ---------- |
| Entities     | PascalCase |
| Fields       | camelCase  |
| Events       | PascalCase |
| Transitions  | verbNoun   |
| Context Keys | camelCase  |

Not mandatory, but strongly recommended.

---

# B. Canonical Path Syntax (Normative)

Defines how internal nodes are referenced across:

* Diff
* Validation Matrix
* Migration
* CLI output

## B.1 Path Grammar

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
```

Paths MUST:

* Be absolute
* Be case-sensitive
* Map uniquely to one graph node

---

## B.2 Property Path Extension

Properties MUST append as:

```
/entities/User/properties/email/type
```

---

## B.3 Cardinality Path

```
/entities/User/relations/orders/cardinality
```

---

# C. Glossary (Normative)

The Appendix MUST include a glossary.

Example entries:

### Node

A structural unit in the canonical graph.

### Edge

A directed relation between nodes.

### Entity

A domain object with identity and properties.

### Process

A state machine governing transitions.

### Event

A domain signal emitted during transitions.

### Breaking Change

A modification invalidating at least one previously valid instance.

### Non-Breaking Change

A modification preserving all previously valid instances.

### Canonical Graph

The normalized graph representation used for validation and diff.

Glossary MUST be exhaustive and version-aligned.

---

# D. Common Validation Errors (Structured)

Each example MUST contain:

* Input
* Error Code
* Explanation
* Reference to Spec Section

Example:

---

### Error: Missing Required Property

Input:

```yaml
entity:
  name: User
  properties:
    email:
      type: string
```

Error Code:

```
ERR_REQUIRED_MISSING
```

Explanation:

Required flag missing on property definition.

Reference:

Spec Reference §3.2

---

Define a standard error format:

```
ERR_<CATEGORY>_<DETAIL>
```

Example categories:

* SYNTAX
* STRUCTURE
* VERSION
* CONSTRAINT
* PROCESS
* EVENT

---

# E. YAML Style Guide (Normative for Tooling)

## E.1 Indentation

* 2 spaces
* No tabs

## E.2 Ordering

Recommended block order:

1. spec_version
2. rigor_spec_version
3. entities
4. processes
5. events
6. metadata

Canonicalization MUST ignore ordering.

---

## E.3 Comments

* YAML comments are allowed
* Comments MUST be ignored by canonicalization
* Comments MUST NOT alter semantics

---

# F. Edge Cases (Normative Clarifications)

## F.1 Empty Process

A process with one state and no transitions is valid if:

* It declares an initial state
* It declares no transitions
* It is terminal by design

---

## F.2 Optional Context

If an event declares no payload, it MUST still define:

```
payload: {}
```

Explicit empty payload preferred.

---

## F.3 Terminal State Without Outgoing Edges

Allowed. MUST NOT produce validation error.

---

## F.4 Multiple Transitions to Same Target

Allowed unless conflict of guards or invariants.

---

## F.5 Identity Without Additional Properties

Allowed if explicitly declared.

---

# G. Implementation Mapping Notes (Non-Normative but Binding in Interpretation)

This section MAY include:

## G.1 Canonical Graph Representation Example

Mapping YAML → Graph nodes:

```
Entity(User)
  ├── Property(email)
  ├── Property(name)
```

---

## G.2 Validation Order

Recommended:

1. Syntax
2. Structure
3. Identity
4. Constraints
5. Process Graph
6. Events
7. Versioning

---

## G.3 JSON Schema Mapping Example

Property:

```
email:
  type: string
  required: true
```

Maps to:

```json
{
  "type": "string"
}
```

and inclusion in required array.

---

# H. Full Reference Example (Normative Demonstration)

The Appendix SHOULD include one complete spec example that contains:

* One entity
* One process
* One event
* One transition
* Constraints
* Version block

Fully valid.

Example (abbreviated):

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
  UserRegistration:
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

This example MUST pass validation.

---

# 3. Normative Constraints

The Appendix:

* MUST NOT redefine behavior
* MUST remain version-aligned
* MUST reference other specifications precisely
* MUST update when new features are introduced

---

# 4. Architectural Rationale

The Appendix becomes:

* The interpretative layer
* The onboarding layer
* The tooling alignment layer
* The edge-case formalization layer

Without overloading core specs.

---

# 5. Recommendation

Proceed with:

1. Rewriting Spec Appendix v0.1 in full normative format
2. Integrating glossary
3. Adding structured error examples
4. Adding canonical path grammar
5. Including one full reference example
6. Cross-referencing all other specifications

