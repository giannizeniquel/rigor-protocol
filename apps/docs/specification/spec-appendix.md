# Spec Appendix (v0.1)

This document complements the RIGOR Specification Suite. It defines auxiliary normative conventions, notational rules, glossary terms, structured error examples, and implementation blueprints.

## A. Normative Terminology

The following keywords are normative across all RIGOR documentation:

- **MUST**: Mandatory requirement.
- **MUST NOT**: Prohibited behavior.
- **SHOULD**: Strong recommendation.
- **MAY**: Optional feature or behavior.

These keywords are semantically binding for any implementation claiming protocol compliance.

## B. Notation and Conventions

### B.1 Identifier Rules
Identifiers (for entities, processes, states, events, and fields) **MUST**:
- Be ASCII-only.
- Begin with a letter.
- Contain only letters, numbers, and underscores.
- Be case-sensitive.

**Formal Regex:** `^[A-Za-z][A-Za-z0-9_]*$`

### B.2 Naming Recommendations
While not mandatory, the following patterns are strongly recommended for interoperability:
- **Entities / Processes / Events**: `PascalCase`
- **Fields / Context Keys**: `snake_case`
- **States**: `UPPER_SNAKE_CASE`
- **Transitions**: `verbNoun`

## C. Canonical Path Syntax (Normative)

Paths are used to uniquely reference nodes in the [Graph Model](./graph-model) for Diff reports, validation errors, and CLI outputs.

### C.1 Path Grammar
```
Path    ::= "/" Segment { "/" Segment }
Segment ::= Identifier
```

**Examples:**
- `/entities/User`
- `/processes/Order/states/PAID`
- `/processes/Order/transitions/pay`
- `/events/UserCreated/payload/user_id`

### C.2 Attribute Access
Property attributes are accessed by appending the attribute name:
- `/entities/User/properties/email/type`
- `/entities/User/relations/orders/cardinality`

## D. Glossary (Normative)

- **Node**: A structural unit in the canonical graph representation.
- **Edge**: A directed, typed relationship between two nodes.
- **Entity**: A domain object with identity and typed properties.
- **Process**: A deterministic state machine governing transitions and mutations.
- **State**: A discrete configuration within a process.
- **Transition**: A directed change from one state to another triggered by an event.
- **Event**: A named external input with a typed payload.
- **Canonical Graph**: The normalized internal representation used for formal validation.
- **Breaking Change**: A modification that invalidates at least one previously valid instance.
- **ChangeSet**: A structured list of atomic changes produced by the Diff engine.

## E. YAML Structural Guide (Normative for Tooling)

### E.1 Format Rules
- **Indentation**: Exactly 2 spaces.
- **Tabs**: **MUST NOT** be used.
- **Encoding**: UTF-8.

### E.2 Recommended Block Order
1. `spec_version`
2. `rigor_spec_version`
3. `entities`
4. `process`
5. `events`
6. `migrations`

## F. Common Validation Errors (Examples)

### ERR_STRUCTURE_REQUIRED_MISSING
**Input:** Missing `rigor_spec_version` at root.
**Resolution:** Add the mandatory language version field.

### ERR_SYNTAX_INVALID_IDENTIFIER
**Input:** `event_id: 123Payment`
**Resolution:** Identifiers must start with a letter (see §B.1).

### ERR_PROCESS_UNDEFINED_STATE
**Input:** Transition `to: COMPLETED` where `COMPLETED` is not in the states list.
**Resolution:** Declare all target states in the `states:` block.

## G. Edge Cases (Normative Clarifications)

- **Empty Process**: A process with a single state and no transitions is **VALID** if the state is marked as terminal.
- **Terminal Transitions**: A state marked as `terminal: true` **MUST NOT** have outgoing transitions.
- **Explicit Empty Payload**: Events with no data SHOULD declare `payload_schema: { type: object, properties: {}, required: [] }`.

## H. Implementation Mapping & JSON Schema

### H.1 Canonical Graph Derivation
Implementations **MUST** map every DSL entity to a unique graph node. Nesting in YAML (e.g., fields inside entities) maps to `HAS_FIELD` or `BELONGS_TO` edges.

### H.2 Formal JSON Schema (Draft-07)
The following schema provides basic structural validation:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["rigor_spec_version", "spec_version", "process"],
  "properties": {
    "rigor_spec_version": { "type": "string" },
    "spec_version": { "type": "string" },
    "process": { "type": "string" }
  }
}
```
*(Full schema available in the RIGOR Repository /schemas directory)*

## I. Full Reference Example (Normative Baseline)

```yaml
rigor_spec_version: "0.1"
spec_version: "1.0.0"

process: UserLifecycle
initial_state: PENDING

events:
  - event_id: UserActivated
    payload_schema:
      type: object
      properties:
        user_id: uuid
      required: [user_id]

states:
  PENDING:
    on:
      UserActivated:
        to: ACTIVE
  ACTIVE:
    terminal: true
```

## J. Testing and Execution Models

### J.1 Pure State Machine Principle
A RIGOR process acts as a pure function: `(State, Event) -> (NewState, Mutations)`.

### J.2 Test Case (Pseudocode)
```python
def test_activation():
    instance = Engine.load(UserLifecycle, state="PENDING")
    result = instance.handle(UserActivated(user_id="..."))
    assert result.new_state == "ACTIVE"
    assert result.transaction_committed == True
```

## K. Operational Strategies

### K.1 CI/CD Validation Strategy
1. **Lint**: Check YAML indentation and style (§E).
2. **Schema**: Validate against JSON Schema (§H.2).
3. **Semantic**: Run `rigor validate --strict`.
4. **Diff**: Check version consistency using `rigor diff`.

### K.2 Distributed Execution
RIGOR enables safe distributed Sagas by providing deterministic state boundaries and explicit event contracts.

## L. Conformance & Version Alignment

An implementation claiming RIGOR v0.1 compliance **MUST** implement canonical path resolution, follow identifier constraints, and pass all rules in the [Validation Matrix](./validation-matrix).

This Appendix is aligned with **RIGOR Core v0.1**.
