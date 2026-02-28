---
layout: home

hero:
  name: "RIGOR"
  tagline: "AI Constraint Protocol. Formal boundaries for AI-generated systems."
  actions:
    - theme: brand
      text: Access Specification →
      link: /specification/identity-core
    - theme: alt
      text: View on GitHub →
      link: https://github.com/giannizeniquel/rigor-protocol

features:
  - title: Explicitness
    details: All transitions must be declared. No implicit behavior is permitted.
  - title: Determinism
    details: Given state and event, the resulting transition is uniquely defined.
  - title: Typed Context
    details: Every process declares a mandatory, typed context schema.
  - title: Transactional Execution
    details: Each event represents an independent, atomic transactional boundary.
  - title: Semantic Freeze
    details: Core v0.1 is frozen, guaranteeing long-term stability and compatibility.
---

## Why RIGOR?

Modern software systems increasingly rely on Large Language Models to assist in code generation. However, natural language is:

* **Ambiguous**: Interpretable in multiple ways.
* **Context-dependent**: Meaning changes with the prompt.
* **Non-deterministic**: Produces inconsistent structural outputs.
* **Difficult to validate**: Statically verifying narrative intent is impractical.

RIGOR exists to replace narrative ambiguity with:

* **Typed declarative structures**: Formal process definitions.
* **Deterministic state transitions**: Explicitly allowed paths.
* **Explicit mutation rules**: No hidden side effects.
* **Static validation before execution**: Structural compliance is a precondition of existence.

RIGOR is not a framework. It is not a runtime engine. It is a **formal specification language** designed for precision-first generation.

---

## Core Invariants

The following invariants are formally defined in RIGOR Core v0.1 and are non-negotiable:

### 1. Event-Driven Mutation Only
All state mutation MUST occur exclusively inside event-triggered transitions. No state changes are allowed outside transitions, and no implicit side effects are permitted. This ensures determinism, traceability, and replayability.

### 2. One Event = One Transaction
Each processed event represents an independent transactional boundary. The Engine guarantees atomic state transitions and atomic context mutations. If any step fails, the entire transaction is rolled back.

### 3. Typed Context is Mandatory
Every process MUST define a typed `context_schema`. No dynamic properties or implicit field creation are allowed. All mutations must conform to the declared schema, enabling static validation and generator reliability.

### 4. Deterministic Transitions
For any `(state, event)` pair, at most one transition is allowed. Guards must be pure and must not mutate context.

### 5. Core Semantic Freeze
RIGOR Core v0.1 defines the process model, event model, transition model, mutation rules, and transaction boundaries. Future versions may extend, but must not break these foundational invariants.

---

## Standard First, Implementation Second

RIGOR is designed as an **open specification**. It is engine-agnostic and independently implementable. While the official RIGOR Engine serves as a normative reference implementation, the standard remains valid and useful independently of any specific runtime.

---

## Explicit Design Constraints

RIGOR deliberately excludes:
* UI description and Layout.
* Infrastructure orchestration (Terraform/IaC territory).
* Runtime scheduling and retries.
* Distributed consensus algorithms.
* Direct database modeling.

RIGOR focuses exclusively on **process semantics**, **state transitions**, and **event-driven mutation**.

---

## Long-Term Vision

While RIGOR begins with backend process modeling, its semantic model enables derivative layers such as API contract derivation, frontend state synchronization, and cross-service orchestration. The core remains backend-first to provide a stable foundation for AI-aligned system generation.
