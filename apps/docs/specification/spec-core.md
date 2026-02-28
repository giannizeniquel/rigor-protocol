# Spec Core (v0.1)

## 1. Introduction

A RIGOR Process is a **deterministic, event-driven state machine** where all mutations are restricted to declared transitions and executed atomically per event.

## 2. Process Definition

A Process **MUST** define:
- A unique identity
- A finite set of states
- An initial state (which **MUST** exist in the states set)
- A finite set of transitions
- A context schema

## 3. Transition Model & Mutation Declaration (CRITICAL)

The formal mapping is: `(current_state, event) -> (next_state, mutations)`

- A transition **MUST** define `from`, `on`, and `to`.
- A transition **MAY** define a `mutate` list.
- **Rule**: Transitions **MUST NOT** mutate context fields not explicitly declared in the `mutate` list. If `mutate` is omitted, the context is immutable for that transition.

## 4. Transactional Semantics

Each event **MUST** be processed atomically.

- Successful execution results in an atomic state transition and context update.
- Failure results in no state change and no mutation (rollback).

## 5. Determinism Guarantee

For any given `(state, event)` pair, there **MUST** be at most one valid transition. Ambiguous mappings are prohibited and **MUST** be rejected at validation time.

## 6. Terminal States

A terminal state is a state with no outgoing transitions. Once reached, the process **MUST NOT** accept further events.

## 7. Invariants

### 7.1 Structural Invariants
- A Process **MUST** have a single initial state.
- All transition targets **MUST** exist in the states set.
- No duplicate transitions **(state, event)** pairs **MUST** exist.

### 7.2 Runtime Invariants
- The current state **MUST** always be a member of the declared states set.
- The context **MUST** always conform to the declared schema.

## 8. Normative Example

```json
{
  "process": {
    "id": "OrderProcess",
    "version": "1.0.0",
    "initial_state": "created",
    "context_schema": {
      "order_id": { "type": "uuid" },
      "status": { "type": "string", "enum": ["created", "approved", "rejected", "shipped"] },
      "approved_at": { "type": "datetime", "required": false },
      "rejected_at": { "type": "datetime", "required": false }
    },
    "states": [
      { "id": "created", "type": "default" },
      { "id": "approved", "type": "default" },
      { "id": "rejected", "type": "terminal" },
      { "id": "shipped", "type": "terminal" }
    ],
    "transitions": [
      {
        "id": "approve",
        "from": "created",
        "on": "approve",
        "to": "approved",
        "mutate": ["status", "approved_at"]
      },
      {
        "id": "reject",
        "from": "created",
        "on": "reject",
        "to": "rejected",
        "mutate": ["status", "rejected_at"]
      },
      {
        "id": "ship",
        "from": "approved",
        "on": "ship",
        "to": "shipped",
        "mutate": ["status"]
      }
    ]
  }
}
```

### Example Breakdown:
- **Context Schema**: Defines `order_id`, `status`, `approved_at`, `rejected_at`.
- **Transition with Mutation**: The `approve` transition explicitly declares `mutate: ["status", "approved_at"]`. Only these fields may change.
- **Terminal States**: `rejected` and `shipped` have no outgoing transitions.
- **Determinism**: Each `(state, event)` pair maps to exactly one transition.
