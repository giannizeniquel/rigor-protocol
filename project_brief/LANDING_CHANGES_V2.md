Below is a **structured handoff document** intended for:

* 🧠 **Architect Agent** → validate semantic alignment with RIGOR Core v0.1
* 🏗 **Builder Agent** → implement approved content changes on the landing

This document is intentionally detailed and prescriptive.

---

# LANDING UPDATE SPEC

## RIGOR Protocol — Alignment with Core v0.1

**Target:** [https://rigor-protocol.pages.dev/](https://rigor-protocol.pages.dev/)
**Language:** English (multilingual system already supported)
**Status:** Proposal for validation

---

# 1. Objective

Align the production landing page with the latest formal definitions of:

* RIGOR Core v0.1 (semantic freeze)
* Typed context model
* Strict mutation model
* Specification vs Implementation separation
* Event-driven transactional execution
* Community governance direction

The landing must communicate that:

> RIGOR is no longer a conceptual DSL — it is a formally defined, frozen semantic specification approaching implementation maturity.

---

# 2. Architectural Positioning Adjustments

The current landing communicates the philosophical direction well.
The following changes elevate it to a *formal standard in progress* rather than an experimental idea.

---

# 3. Section-by-Section Change Specification

---

## SECTION A — Hero / Primary Identity Block

### Current Positioning

AI Constraint Protocol
Declarative control over AI-driven systems

### Required Enhancement

Add explicit semantic maturity signaling.

### Add Below Main Tagline:

```text
Core Semantic Version v0.1 — Frozen and Normative
```

### Supporting Paragraph (Short, precise)

```text
RIGOR Core v0.1 defines the formal semantics of the language and is now frozen.
This guarantees determinism, structural consistency, and long-term compatibility
for future implementations.
```

### Architectural Rationale

* Signals maturity.
* Enables external implementers to trust stability.
* Separates “vision” from “specification”.

---

## SECTION B — Add New Section: “Semantic Guarantees”

Place after the conceptual introduction.

### Section Title

```text
Semantic Guarantees
```

### Content

```text
RIGOR enforces strict semantic rules at the language level:

• Explicit state transitions only  
• No implicit mutation  
• Deterministic event processing  
• Typed and validated context schema  
• One event → one transaction  

All state changes must occur inside declared transitions triggered by events.
No mutation is permitted outside this boundary.
```

### Architectural Rationale

This reflects decisions we formalized:

* Mutation only in transitions
* Transactional event handling
* Deterministic execution
* Context schema validation

This section is critical for differentiation.

---

## SECTION C — Add New Section: “Typed Context Model”

### Title

```text
Typed Context & Structural Validation
```

### Content

```text
Every RIGOR Process declares an explicit context schema.

• Strongly typed fields  
• Explicitly declared mutable fields  
• Structural validation before execution  
• JSON-schema compatible  

The Engine validates structure and types before processing events.
Invalid specifications are rejected before runtime.
```

### Architectural Rationale

Reflects:

* context_schema definition
* explicit mutation declarations
* static validation
* CLI validation system

---

## SECTION D — Clarify Specification vs Implementation

### Title

```text
Specification First. Engine Second.
```

### Content

```text
RIGOR is a specification, not an engine.

The Core defines the semantics.
Any compliant engine may implement execution.

The official reference engine will serve as a normative implementation,
but the language remains implementation-independent.
```

### Architectural Rationale

Supports:

* Open standard ambition
* Community governance direction
* Avoids vendor lock-in perception
* Allows ecosystem growth

---

## SECTION E — Execution Model Clarification

Add a compact section or expandable block.

### Title

```text
Transactional Event Processing
```

### Content

```text
RIGOR processes events sequentially and transactionally.

Each event:
1. Loads process state
2. Validates transition
3. Applies declared mutations
4. Persists atomically
5. Emits resulting commands or events

Failure at any step aborts the transaction.
```

### Architectural Rationale

This reflects:

* Per-event transaction boundary
* Strong consistency model
* Queue-based internal event processing
* Deterministic engine design

---

## SECTION F — Add Project Status Block

Place near footer or before CTA.

### Title

```text
Project Status
```

### Content

```text
RIGOR Core v0.1 — Formal Specification Complete  
Specification Documents — Public  
Validator CLI — In development  
Reference Engine (MVP) — Planned  
Community Governance — Target Phase  

RIGOR aims to become an open, implementable standard
for deterministic AI-constrained systems.
```

### Architectural Rationale

Clarifies roadmap maturity without overstating progress.

---

## SECTION G — Add Contribution Call

### Content

```text
Contribute on GitHub.

Help refine the specification.
Build compatible engines.
Participate in future governance.
```

Include GitHub link prominently.

---

# 4. Content That Should Remain Unchanged

The following conceptual elements are already aligned and should remain:

* AI Constraint Protocol terminology
* Declarative orientation
* Determinism emphasis
* Architectural rigor messaging
* Multilingual structure

No need to rewrite those.

---

# 5. Messaging Constraints

Builder must ensure:

* Tone remains formal and technical
* Avoid hype language
* Avoid startup-marketing tone
* Maintain protocol/standard voice
* Use structured bullet formatting
* Keep typography consistent with current layout

---

# 6. Multilingual Requirement

Because landing supports multilingual:

* English content above becomes base version
* Spanish translation must preserve technical precision
* Avoid idiomatic expressions
* Use terminology consistently:

  * Core Semantic Version
  * Transactional Event Processing
  * Typed Context
  * Specification
  * Engine

Architect must validate terminology consistency before translation.

---

# 7. Acceptance Criteria

The update is considered correct when:

1. Landing communicates Core v0.1 freeze.
2. Mutation restrictions are explicitly described.
3. Transactional event model is visible.
4. Typed context + validation is mentioned.
5. Specification vs implementation separation is clear.
6. Project status is transparent.
7. GitHub contribution is explicit.

---

# 8. Strategic Outcome

After this update, the landing should communicate:

* RIGOR is formally defined.
* RIGOR is stable at semantic level.
* RIGOR is deterministic and enforceable.
* RIGOR is intended to be an open standard.
* RIGOR is approaching implementation phase.

This transitions RIGOR from “conceptual DSL” to:

> Emerging formal protocol specification.

