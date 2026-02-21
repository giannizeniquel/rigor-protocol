# Spec Core

## 1. Purpose

The RIGOR Spec Core defines the **formal conceptual model** for a declarative specification system oriented toward precise AI-driven code generation.

The objective is to establish:
- Theoretical foundations.
- Formal execution model.
- Structural constraints.
- Explicit contracts.
- Non-negotiable structural invariants.

This document defines the conceptual architecture that any implementation must adhere to.

## 2. Problem Statement

AI-driven code generation requires specifications that are:
- **Deterministic**: No probabilistic outcomes.
- **Unambiguous**: Only one valid interpretation.
- **Structurally Validated**: Pre-execution verification.
- **Free of Implicit Logic**: No hidden behaviors.

Traditional systems often mix technical orchestration, business rules, implicit state, and undeclared side effects. RIGOR strictly separates **Declaration** from **Execution, Persistence, and Effects**, allowing an AI to generate precise code without uncontrolled inferences.

## 3. Core Principles

### 3.1 Explicit Constraint Declaration
All system behavior must be explicitly declared. RIGOR prohibits:
- Implicit transaction references.
- Hidden state mutations.
- Undeclared side effects.

### 3.2 Explicit State Machine (FSM)
A Process is a finite state machine defined by:
- A closed set of states.
- Explicit transitions.
- Defined events.
- Persistent state context.

There are no implicit transitions.

### 3.3 Formal Persistence
Every process instance must have:
- A unique identifier (UUID).
- A persisted current state.
- A persistent typed context.
- (Optional) Event history.

The process state cannot depend on volatile memory.

### 3.4 Determinism
Given a current state, a persistent context, and a received event, the resulting transition must be completely deterministic.

### 3.5 Controlled Flexibility
Extension points are allowed only under explicit contract. Extending the model through ad-hoc code outside the specification is strictly prohibited.

## 4. Formal Process Definition

A Process is a logical entity defined as:
**Process = (States, Initial State, Context, Transitions)**

Where:
- **States**: A finite set of possible stable phases.
- **Initial State**: The starting node ($\in$ States).
- **Context**: A set of typed variables.
- **Transitions**: Mapping of (States $\times$ Event) $\to$ States.

## 5. Context Model

The Context is the only mutable source within a Process. It is:
- **Persistent**: Stored between transitions.
- **Typed**: Strictly defined fields.
- **Declarative**: Changes only through `update_context`.
- **Closed**: No dynamic field creation or removal.

### Supported Types (v0.1)
- `uuid`, `string`, `integer`, `boolean`, `datetime`.

Explicit nullability is supported using the `?` suffix.

## 6. State Effects

To ensure simplicity and determinism, each state must declare **exactly one** of the following effects:

### 6.1 `emit_command` (Asynchronous)
Represents an external action. It is non-blocking and produces effects outside the process boundary.

### 6.2 `invoke` (Synchronous)
Represents a technical invocation (e.g., an internal UseCase). It must be deterministic and idempotent.

### 6.3 `terminal` (Conclusion)
Marks the end of the process. No outgoing transitions are allowed.

## 7. Execution Model

The engine handles the process lifecycle through these stages:
1. Reception of a `start_command`.
2. Uniqueness validation (see Section 8).
3. Creation of a persistent instance.
4. Assignment of the `initial_state`.
5. Execution of the state's effect.
6. Event wait/reception.
7. Transition evaluation and `update_context`.
8. Persistence of the new state.

The engine must guarantee atomicity per transition.

## 8. Uniqueness Rule
A process can optionally declare uniqueness by a context field. No two active instances can exist with the same value for the declared field. A terminal instance does not block new instances.

## 9. Conceptual Proof
A process must be executable as a pure state machine, independent of external infrastructure or real dependencies, by injecting events and observing the final state and updated context.

## 10. Deliberate Limits (v0.1)
To preserve generative precision, RIGOR v0.1 intentionally excludes:
- Sub-processes.
- Complex conditional transitions.
- Parallelism.
- Composite events.

## 11. Architectural Goal
RIGOR is designed to enable reliable automatic code generation, support future distributed execution, and scale in complexity without introducing structural ambiguity. It prioritizes verifiable stability over unlimited expressiveness.
