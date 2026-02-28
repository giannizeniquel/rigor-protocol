Below is the **Architect Review Document** for updating:

> `/specification/identity-core.html`
> (Identity Core – RIGOR Specification)

This document is written for architectural validation before passing to the Builder Agent.

---

# RIGOR — Identity Core Page Update

### Architect Review Document

Target: `specification/identity-core.html`
Language: English (primary), multi-language compatible

---

# 1. Objective of This Update

The current Identity Core page communicates philosophical positioning and general principles.
However, it does not yet reflect the full semantic commitments formalized in RIGOR Core v0.1 / v0.2.

The goal of this update is:

* Preserve existing conceptual tone
* Introduce missing semantic pillars
* Align Identity Core with frozen Core semantics
* Clarify separation between Spec and Engine
* Reinforce RIGOR as an open, implementable standard

This is not a redesign.
It is a semantic reinforcement.

---

# 2. High-Level Change Strategy

We do **NOT** replace existing content.

We:

1. Keep current sections:

   * Core Principles
   * Protocol Positioning
   * Narrative System

2. Add new formal subsections after Core Principles.

3. Slightly expand Protocol Positioning.

---

# 3. Proposed Structural Outline (After Update)

```
Identity Core

1. Core Principles
2. Typed Context & Static Validation   (NEW)
3. Event-Driven Mutation Model         (NEW)
4. Transactional Event Semantics       (NEW)
5. Specification vs Implementation     (NEW)
6. Versioning & Core Freeze            (NEW)
7. Protocol Positioning (expanded)
8. Narrative System (unchanged)
```

---

# 4. New Sections — Detailed Content Proposal

---

## 4.1 Typed Context & Static Validation (NEW)

### Purpose

Formalize that RIGOR is not an untyped narrative language.

### Proposed Content

### Typed Context & Static Validation

RIGOR processes operate over an explicitly declared and statically validated context schema.

Every process must declare:

* A structured context schema
* Explicit property types
* Required fields

No implicit fields are permitted.

All context mutations must conform to the declared schema.
Type violations must be detected at validation time, not runtime.

This ensures:

* Deterministic behavior
* Compile-time structural validation
* Elimination of ambiguous state mutation

RIGOR specifications are structurally verifiable before execution.

---

## 4.2 Event-Driven Mutation Model (NEW)

### Purpose

Codify the rule that mutations only occur inside transitions triggered by events.

### Proposed Content

### Event-Driven Mutation Model

RIGOR enforces a strict event-driven mutation model.

Context may only mutate:

* Inside explicitly declared transitions
* Triggered by declared events
* According to permitted mutation rules

No state change is allowed:

* Outside a transition
* Inside arbitrary execution blocks
* Through implicit side effects

All state evolution must be observable, explicit, and declared.

This guarantees:

* Full traceability
* Predictable state evolution
* Elimination of hidden mutations

---

## 4.3 Transactional Event Semantics (NEW)

### Purpose

Define atomic processing.

### Proposed Content

### Transactional Event Semantics

Each processed event constitutes a single transactional unit.

For every event:

1. The current state is read
2. A matching transition is evaluated
3. Guard conditions are checked
4. Context mutation is applied
5. State transition occurs
6. Changes are committed atomically

If any step fails, the transition is aborted and no mutation is persisted.

This ensures:

* Strong consistency
* Atomic transitions
* Deterministic replay capability

RIGOR processes are defined as deterministic state machines.

---

## 4.4 Specification vs Implementation (NEW)

### Purpose

Clarify standard openness and separation from engine.

### Proposed Content

### Specification vs Implementation

RIGOR is a specification, not an engine.

The protocol defines:

* Structural rules
* Mutation constraints
* Event semantics
* Versioning guarantees

It does not mandate:

* A specific runtime
* A specific storage engine
* A specific programming language

Any engine that:

* Conforms to the formal specification
* Passes validation requirements
* Preserves semantic guarantees

may be considered RIGOR-compliant.

An official reference engine may exist, but it does not define the protocol.

The specification remains independent of implementation.

---

## 4.5 Versioning & Core Freeze (NEW)

### Purpose

Communicate stability and maturity.

### Proposed Content

### Versioning & Core Freeze

RIGOR Core v0.1 defines the foundational semantic guarantees of the protocol.

The Core semantic model is considered frozen.

Future evolution must:

* Preserve backward compatibility where declared
* Explicitly classify changes (compatible, conditionally compatible, breaking)
* Maintain deterministic semantics

Specification versions follow semantic versioning principles.

The identity of RIGOR is stable by design.

---

# 5. Expansion to Existing Section: Protocol Positioning

Current positioning states RIGOR operates upstream of execution.

We recommend adding:

### Additional Paragraph (to append)

RIGOR operates upstream of runtime execution, but it defines strict semantic guarantees that downstream implementations must preserve.

The protocol is not an orchestration engine.
It is a deterministic specification language for describing stateful processes.

Execution engines interpret RIGOR specifications — they do not redefine them.

---

# 6. What Should NOT Change

The following sections remain intact:

* Core Principles (Explicitness, Determinism, Classified Evolution)
* Narrative System section (tone and identity)
* Overall philosophical positioning language

We preserve brand voice while reinforcing technical substance.

---

# 7. Rationale for Architect

This update:

* Aligns Identity Core with formal documentation (SPEC-CORE, SPEC-REFERENCE, ENGINE, VALIDATION)
* Prevents conceptual drift between landing and spec
* Strengthens credibility for technical adopters
* Signals maturity and standardization intent
* Makes RIGOR appear as a serious protocol, not a narrative DSL experiment

---

# 8. Builder Instructions (Post-Approval)

If Architect approves:

* Insert new sections after “Core Principles”
* Maintain heading hierarchy consistent with documentation theme
* Ensure anchor links for new sections
* Preserve translation structure (i18n keys)
* Do not alter URL structure

---

# 9. Final Validation Criteria

The page must clearly communicate:

* Typed context
* Event-driven mutation only
* Transactional semantics
* Spec/engine separation
* Core semantic freeze

If those five are visible, the update is successful.
