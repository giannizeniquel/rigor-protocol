# BUILDER INSTRUCTIONS: Documentation Index Update (v1)

**Status:** Ready for Implementation  
**Context:** Structural and content update to the Root Documentation Page (Index) to reflect RIGOR Core v0.1 maturity.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/DOCS_CHANGES.md`

---

## 🎯 Objectives
1.  Update the VitePress `index.md` (EN and ES) to include new sections: "Why RIGOR?", "Core Invariants", "Standard First", "Design Constraints", and "Long-Term Vision".
2.  Maintain a formal, engineering-first tone.
3.  Ensure consistency between English and Spanish versions.

---

## 🛠️ Step 1: Update `apps/docs/index.md`

Replace the content of `apps/docs/index.md` with the following structure. Keep the existing frontmatter but add the content below.

```markdown
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
```

---

## 🧱 Step 2: Update `apps/docs/es/index.md`

Translate the content following the same structure and tone.

```markdown
---
layout: home

hero:
  name: "RIGOR"
  tagline: "Protocolo de Restricción de IA. Límites formales para sistemas generados por IA."
  actions:
    - theme: brand
      text: Acceder a Especificación →
      link: /es/specification/identity-core
    - theme: alt
      text: Ver en GitHub →
      link: https://github.com/giannizeniquel/rigor-protocol

features:
  - title: Explicitud
    details: Todas las transiciones deben ser declaradas. No se permite comportamiento implícito.
  - title: Determinismo
    details: Dado estado y evento, la transición resultante está definida de forma única.
  - title: Contexto Tipado
    details: Cada proceso declara un esquema de contexto tipado y obligatorio.
  - title: Ejecución Transaccional
    details: Cada evento representa un límite transaccional atómico e independiente.
  - title: Congelación Semántica
    details: El Core v0.1 está congelado, garantizando estabilidad y compatibilidad a largo plazo.
---

## ¿Por qué RIGOR?

Los sistemas de software modernos dependen cada vez más de los Modelos de Lenguaje Grandes (LLM) para asistir en la generación de código. Sin embargo, el lenguaje natural es:

* **Ambiguo**: Interpretable de múltiples maneras.
* **Dependiente del contexto**: El significado cambia con el prompt.
* **No determinista**: Produce resultados estructurales inconsistentes.
* **Difícil de validar**: La verificación estática de la intención narrativa es impracticable.

RIGOR existe para reemplazar la ambigüedad narrativa con:

* **Estructuras declarativas tipadas**: Definiciones formales de procesos.
* **Transiciones de estado deterministas**: Rutas permitidas explícitamente.
* **Reglas de mutación explícitas**: Sin efectos secundarios ocultos.
* **Validación estática previa a la ejecución**: El cumplimiento estructural es una precondición de existencia.

RIGOR no es un framework. No es un motor de ejecución. Es un **lenguaje de especificación formal** diseñado para una generación centrada en la precisión.

---

## Invariantes del Núcleo

Los siguientes invariantes están definidos formalmente en RIGOR Core v0.1 y son no negociables:

### 1. Solo Mutación Dirigida por Eventos
Toda mutación de estado DEBE ocurrir exclusivamente dentro de transiciones activadas por eventos. No se permiten cambios de estado fuera de las transiciones, ni efectos secundarios implícitos. Esto asegura el determinismo, la trazabilidad y la capacidad de reproducción.

### 2. Un Evento = Una Transacción
Cada evento procesado representa un límite transaccional independiente. El Motor garantiza transiciones de estado y mutaciones de contexto atómicas. Si algún paso falla, se revierte toda la transacción.

### 3. El Contexto Tipado es Obligatorio
Cada proceso DEBE definir un `context_schema` tipado. No se permiten propiedades dinámicas ni la creación implícita de campos. Todas las mutaciones deben ajustarse al esquema declarado, permitiendo la validación estática y la confiabilidad del generador.

### 4. Transiciones Deterministas
Para cualquier par `(estado, evento)`, se permite como máximo una transición. Los guards deben ser puros y no deben mutar el contexto.

### 5. Congelación Semántica del Núcleo
RIGOR Core v0.1 define el modelo de proceso, el modelo de eventos, el modelo de transición, las reglas de mutación y los límites de transacción. Las versiones futuras pueden extender, pero no deben romper estos invariantes fundamentales.

---

## El Estándar Primero, la Implementación Segundo

RIGOR está diseñado como una **especificación abierta**. Es independiente del motor y puede implementarse de forma autónoma. Mientras que el Motor RIGOR oficial sirve como una implementación de referencia normativa, el estándar sigue siendo válido y útil independientemente de cualquier entorno de ejecución específico.

---

## Restricciones de Diseño Explícitas

RIGOR excluye deliberadamente:
* Descripción de UI y Layout.
* Orquestación de infraestructura (territorio de Terraform/IaC).
* Programación de tiempo de ejecución y reintentos.
* Algoritmos de consenso distribuido.
* Modelado directo de bases de datos.

RIGOR se centra exclusivamente en la **semántica de procesos**, **transiciones de estado** y **mutación dirigida por eventos**.

---

## Visión a Largo Plazo

Aunque RIGOR comienza con el modelado de procesos de backend, su modelo semántico permite capas derivadas como la derivación de contratos de API, la sincronización del estado del frontend y la orquestación entre servicios. El núcleo sigue centrándose primero en el backend para proporcionar una base estable para la generación de sistemas alineados con la IA.
```

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build --filter docs` (or equivalent in docs app).
- [ ] Check both English and Spanish homepages.
- [ ] Ensure links in the Hero still work.
- [ ] Verify that the added content renders correctly below the features grid.
