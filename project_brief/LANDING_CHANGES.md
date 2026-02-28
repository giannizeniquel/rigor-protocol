A continuación tienes un **documento estructurado listo para el agente**, con:

* Texto propuesto por sección
* Indicador de estado: `SE MANTIENE`, `SE AJUSTA`, `SE AGREGA`
* Justificación técnica breve (para validación interna)

---

# 📄 RIGOR Landing – Actualización de Contenido

Versión objetivo: alineada con Core v0.1 congelado

---

# 1️⃣ Hero Section

**Estado:** SE AJUSTA (contenido más preciso)

### Título (se mantiene)

> **RIGOR – AI Constraint Protocol**

### Subtítulo (se ajusta)

**Actual:**

> Formal boundaries for AI-generated systems

**Propuesto:**

> A typed, event-driven constraint protocol for AI-generated systems.

### Descripción breve (se ajusta)

**Propuesto:**

> RIGOR is a formal specification language designed to constrain, validate and govern AI-generated backend systems.
> It defines explicit state transitions, typed context mutation rules, and deterministic execution boundaries.

**Motivo del ajuste:**
Ahora RIGOR ya no es solo conceptual. Tiene semántica formal definida. Debe reflejarlo.

---

# 2️⃣ What is RIGOR?

**Estado:** SE AJUSTA (más técnico, menos abstracto)

### Texto Propuesto

> RIGOR is an open specification that defines how AI-generated systems must behave.
>
> It enforces:
>
> * Explicit state machines
> * Typed context schemas
> * Event-driven transitions
> * Deterministic mutation rules
> * Validation before execution
>
> RIGOR separates specification from implementation.
> The specification defines what is allowed.
> Implementations execute under those constraints.

**Motivo del ajuste:**
Se incorpora:

* Tipado formal
* Separación Spec vs Engine
* Mutación explícita

---

# 3️⃣ Core Principles

**Estado:** SE MANTIENE + SE EXPANDE**

Las ideas actuales (Explicitness, Determinism, etc.) son correctas, pero se fortalecen.

### Sección actual: Explicitness

**Se ajusta a:**

> **Explicitness**
> No implicit mutations.
> No hidden state changes.
> All context mutations must be declared within event transitions.

---

### Determinism (se mantiene, se refuerza)

> **Determinism**
> For a given state and event, the resulting transition is uniquely defined.
> The pair (state, event) must be unambiguous.

---

### Validation Before Execution (se mantiene)

> **Validation Before Execution**
> Specifications must pass structural and semantic validation before they can be executed by an engine.

---

### Separation of Layers (se ajusta levemente)

> **Specification / Implementation Separation**
> RIGOR defines a protocol.
> Engines implement it.
> The language is independent of any runtime.

---

### NUEVO PRINCIPIO — Controlled Mutation (SE AGREGA)

> **Controlled Mutation**
> Context can only mutate inside transitions triggered by declared events.
> Each event is processed as an independent transactional unit.

---

# 4️⃣ RIGOR Core v0.1 (Nueva Sección)

**Estado:** SE AGREGA

Esta sección es clave para mostrar madurez.

### Texto Propuesto

> ## RIGOR Core v0.1 — Frozen Semantic Model
>
> The semantic core of RIGOR v0.1 is formally defined and frozen.
>
> Core guarantees:
>
> * Event-driven state machine
> * Typed and validated context schema
> * Explicit mutation declaration
> * No external mutation allowed
> * Terminal state irreversibility
>
> This version establishes the minimal invariant foundation of the protocol.

**Motivo:**
Comunica estabilidad y dirección clara.

---

# 5️⃣ Architecture Model

**Estado:** SE AJUSTA

Actualmente se mencionan conceptos como:

* Intent Domain
* Constraint Contract
* Generation Boundary
* Validation Engine
* Evolution Layer

Se mantiene la estructura conceptual, pero se redefine con mayor claridad.

### Texto Propuesto

> RIGOR architecture is composed of:
>
> **Intent Domain**
> The business process definition expressed as a typed specification.
>
> **Constraint Contract**
> The formal rules that restrict system behavior.
>
> **Generation Boundary**
> The interface between AI generation and protocol enforcement.
>
> **Validation Engine**
> A deterministic validator that enforces structural and semantic correctness.
>
> **Evolution Layer**
> Controlled versioning and backward compatibility management.

---

# 6️⃣ Backend-First Strategy (Nueva Sección)

**Estado:** SE AGREGA

Refleja tu decisión estratégica.

### Texto Propuesto

> ## Backend-First Strategy
>
> RIGOR begins as a backend-focused specification language.
>
> The initial scope includes:
>
> * Process orchestration
> * Domain state machines
> * External service invocation boundaries
> * API contract governance
>
> Frontend and contract derivations may emerge from the backend specification layer.

---

# 7️⃣ Transactional Guarantees (Nueva Sección)

**Estado:** SE AGREGA

Esto comunica solidez técnica.

### Texto Propuesto

> ## Transaction Model
>
> Each processed event represents an isolated transactional unit.
>
> * Context mutation occurs only during event transitions.
> * No partial state application is allowed.
> * Strong consistency with external systems is enforced through controlled invocation patterns.

---

# 8️⃣ Project Status

**Estado:** SE AGREGA

### Texto Propuesto

> ## Project Status
>
> * Specification Core v0.1 — Frozen
> * Reference Specification (YAML/JSON) — Defined
> * Validation Rules — Defined
> * Official Engine — In development
>
> RIGOR is evolving as an open standard intended for community governance.

---

# 9️⃣ Open Standard Statement

**Estado:** SE AGREGA

### Texto Propuesto

> ## Open Standard
>
> RIGOR is designed to be an open, implementable protocol.
>
> The specification is public.
> Any team may build a compatible engine.
>
> Long-term governance is intended to be community-driven.

---

# 🔟 Links Section

**Estado:** SE AJUSTA

Agregar explícitamente:

* GitHub repository
* Documentation site
* Version reference

### Texto Propuesto

> Explore the specification:
>
> * GitHub Repository
> * Documentation (English / Spanish)
> * Core Specification v0.1

---

# 📌 Resumen de Cambios

| Sección           | Acción         |
| ----------------- | -------------- |
| Hero              | Ajuste         |
| What is RIGOR     | Ajuste técnico |
| Core Principles   | Expansión      |
| RIGOR Core v0.1   | Nueva          |
| Backend Strategy  | Nueva          |
| Transaction Model | Nueva          |
| Project Status    | Nueva          |
| Open Standard     | Nueva          |
| Links             | Ajuste         |

---

# 🧠 Observación Estratégica

La landing actual comunica visión.

Esta actualización comunica:

* Madurez técnica
* Congelamiento semántico
* Enfoque backend realista
* Gobernanza futura
* Separación Spec / Engine

Eso aumenta credibilidad frente a desarrolladores senior.
