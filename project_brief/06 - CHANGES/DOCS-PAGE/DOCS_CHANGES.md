Below is a **formal change proposal document** intended for the **Architect Agent**.

Its purpose is to validate conceptual alignment before forwarding implementation instructions to the Builder Agent.

---

# RIGOR Documentation Update Proposal

## Root Page (Index) — Architectural Revision Plan

Version: Proposal v1.0
Scope: [https://rigor-protocol.pages.dev/](https://rigor-protocol.pages.dev/)

---

# 1. Objective

This document proposes structural and content updates to the **Root Documentation Page (Index)** of RIGOR.

The goal is to ensure the landing documentation reflects:

* The stabilized semantic core (RIGOR Core v0.1 frozen)
* The event-driven mutation model
* Transactional guarantees
* Typed and validated specifications
* RIGOR’s identity as an open, community-governed standard

This document does **not** propose changes to Specification or Implementation sections. Only the root conceptual layer.

---

# 2. Architectural Principle

The root page must:

1. Define what RIGOR is.
2. Define what RIGOR guarantees.
3. Define what RIGOR forbids.
4. Explain why RIGOR exists.
5. Communicate long-term direction without implementation noise.

It must remain conceptual, not syntactic.

---

# 3. Proposed Structural Changes

## 3.1 Add Section: “Why RIGOR?”

### Placement

After the introductory section, before Core Principles.

### Purpose

Clarify positioning relative to:

* Narrative LLM prompting
* Framework generators
* Workflow engines
* State machine libraries

### Proposed Content (Conceptual Draft)

---

## Why RIGOR?

Modern software systems increasingly rely on Large Language Models to assist in code generation. However, natural language is:

* Ambiguous
* Context-dependent
* Non-deterministic
* Difficult to validate statically

RIGOR exists to replace narrative ambiguity with:

* Typed declarative structures
* Deterministic state transitions
* Explicit mutation rules
* Static validation before execution

RIGOR is not a framework.
RIGOR is not a runtime engine.
RIGOR is a formal specification language designed for precision-first generation.

---

Architect must validate:

* Tone alignment
* Positioning neutrality
* Claims consistency

---

## 3.2 Expand Section: Core Invariants

Current invariants exist but need stronger formal articulation.

### Proposed Expansion

Add explicit statements:

### Invariant 1 — Event-Driven Mutation Only

All state mutation MUST occur exclusively inside event-triggered transitions.

* No state changes outside transitions.
* No implicit side effects.
* No direct mutation inside emit or invoke definitions.

This ensures:

* Determinism
* Traceability
* Replayability
* Static analyzability

---

### Invariant 2 — One Event = One Transaction

Each processed event MUST represent an independent transactional boundary.

The Engine must guarantee:

* Atomic state transition
* Atomic context mutation
* Persistent commit or full rollback

This invariant enables:

* Strong consistency
* Replay safety
* Distributed compatibility

---

### Invariant 3 — Typed Context Is Mandatory

Every process must define a typed `context_schema`.

* No dynamic properties allowed.
* No implicit field creation.
* All mutations must conform to schema.

This enforces:

* Static validation
* Generator reliability
* Tooling interoperability

---

### Invariant 4 — Deterministic Transitions

For any `(state, event)` pair:

* At most one transition is allowed.
* Guards must be pure.
* Guards must not mutate context.

---

### Invariant 5 — Core Semantic Freeze

RIGOR Core v0.1 defines:

* Process model
* Event model
* Transition model
* Mutation rules
* Transaction boundaries

Future versions may extend, but must not break these invariants.

---

Architect must confirm:

* These invariants are fully consistent with current specification.
* No contradictions with implemented examples.

---

## 3.3 Clarify Standard vs Engine

Add new section:

---

## Standard First, Implementation Second

RIGOR is designed as:

* An open specification.
* Engine-agnostic.
* Independently implementable.

The official RIGOR Engine is a reference implementation, not a proprietary control layer.

The standard must remain valid independently of any specific engine.

---

This aligns with long-term community governance goals.

---

## 3.4 Add Section: Design Constraints

Clarify intentional limitations.

---

## Explicit Design Constraints

RIGOR deliberately excludes:

* UI description
* Infrastructure orchestration
* Runtime scheduling
* Distributed consensus algorithms
* Direct database modeling

RIGOR focuses exclusively on:

* Process semantics
* State transitions
* Event-driven mutation

---

Architect must validate that exclusions reflect real boundaries.

---

## 3.5 Add Section: Long-Term Vision (Optional but Recommended)

---

## Long-Term Vision

While RIGOR begins with backend process modeling, its semantic model enables:

* API contract derivation
* Frontend state synchronization
* Cross-service orchestration
* Static system validation
* LLM-aligned system generation

However, these are derivative layers.
The core remains backend-first.

---

This section should remain restrained and not speculative.

---

# 4. No Changes Required

The following sections can remain structurally intact (pending architect review):

* Introductory Definition
* High-Level Vision Statement
* Community/Contribution mention (if already present)

---

# 5. Tone Adjustments

Architect to validate:

* Avoid marketing tone.
* Avoid exaggerated claims.
* Maintain engineering-first positioning.
* Keep language precise and restrained.

RIGOR should read as a standard draft, not a startup pitch.

---

# 6. Summary of Required Modifications

| Area                       | Action                     |
| -------------------------- | -------------------------- |
| Add "Why RIGOR?"           | New section                |
| Expand Core Invariants     | Strengthen and formalize   |
| Clarify Standard vs Engine | Add independence statement |
| Add Design Constraints     | Define explicit boundaries |
| Add Long-Term Vision       | Conservative roadmap       |
| Tone alignment             | Technical neutrality       |

---

# 7. Validation Questions for Architect

Before passing to Builder, architect must confirm:

1. Do invariants match current SPEC-CORE?
2. Is the transactional claim technically consistent?
3. Is the mutation model clearly and correctly defined?
4. Is standard vs engine positioning aligned with governance goals?
5. Does the page avoid premature implementation details?

---

Once validated, this document can be forwarded to Builder for:

* Content restructuring
* Section insertion
* Multilingual consistency updates
