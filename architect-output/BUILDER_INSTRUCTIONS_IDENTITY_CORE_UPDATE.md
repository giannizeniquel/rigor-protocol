# BUILDER INSTRUCTIONS: Identity Core Update (v1)

**Status:** Ready for Implementation  
**Context:** Update the Identity Core specification page to include formalized semantic pillars from RIGOR Core v0.1.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/DOCS_CHANGES_IDENTITY-CORE.md`

---

## 🎯 Objectives
1.  Add 5 new formal sections to `identity-core.md` (EN and ES):
    *   Typed Context & Static Validation
    *   Event-Driven Mutation Model
    *   Transactional Event Semantics
    *   Specification vs Implementation
    *   Versioning & Core Freeze
2.  Expand the "Protocol Positioning" section.
3.  Maintain the existing formal and precise tone.

---

## 🛠️ Step 1: Update `apps/docs/specification/identity-core.md`

Insert the following sections after "Core Principles" and update "Protocol Positioning".

```markdown
## Typed Context & Static Validation

RIGOR processes operate over an explicitly declared and statically validated context schema. Every process must declare a structured context schema, explicit property types, and required fields.

No implicit fields are permitted. All context mutations must conform to the declared schema. Type violations must be detected at validation time, not runtime.

This ensures:
* Deterministic behavior
* Compile-time structural validation
* Elimination of ambiguous state mutation

RIGOR specifications are structurally verifiable before execution.

## Event-Driven Mutation Model

RIGOR enforces a strict event-driven mutation model. Context may only mutate inside explicitly declared transitions, triggered by declared events, and according to permitted mutation rules.

No state change is allowed outside a transition, inside arbitrary execution blocks, or through implicit side effects. All state evolution must be observable, explicit, and declared.

This guarantees:
* Full traceability
* Predictable state evolution
* Elimination of hidden mutations

## Transactional Event Semantics

Each processed event constitutes a single transactional unit. For every event:
1. The current state is read
2. A matching transition is evaluated
3. Guard conditions are checked
4. Context mutation is applied
5. State transition occurs
6. Changes are committed atomically

If any step fails, the transition is aborted and no mutation is persisted. This ensures strong consistency, atomic transitions, and deterministic replay capability.

## Specification vs Implementation

RIGOR is a specification, not an engine. The protocol defines structural rules, mutation constraints, event semantics, and versioning guarantees. It does not mandate a specific runtime, storage engine, or programming language.

Any engine that conforms to the formal specification, passes validation requirements, and preserves semantic guarantees may be considered RIGOR-compliant. An official reference engine may exist, but it does not define the protocol.

## Versioning & Core Freeze

RIGOR Core v0.1 defines the foundational semantic guarantees of the protocol. The Core semantic model is considered frozen.

Future evolution must:
* Preserve backward compatibility where declared
* Explicitly classify changes (compatible, conditionally compatible, breaking)
* Maintain deterministic semantics

Specification versions follow semantic versioning principles. The identity of RIGOR is stable by design.

## Protocol Positioning

RIGOR operates upstream of execution. It does not orchestrate. It does not execute. It constrains structural possibility.

RIGOR defines strict semantic guarantees that downstream implementations must preserve. The protocol is not an orchestration engine. It is a deterministic specification language for describing stateful processes. Execution engines interpret RIGOR specifications — they do not redefine them.
```

---

## 🧱 Step 2: Update `apps/docs/es/specification/identity-core.md`

Translate and insert the sections accordingly.

```markdown
## Contexto Tipado y Validación Estática

Los procesos de RIGOR operan sobre un esquema de contexto declarado explícitamente y validado estáticamente. Cada proceso debe declarar un esquema de contexto estructurado, tipos de propiedades explícitos y campos obligatorios.

No se permiten campos implícitos. Todas las mutaciones de contexto deben ajustarse al esquema declarado. Las violaciones de tipo deben detectarse en el momento de la validación, no en el tiempo de ejecución.

Esto asegura:
* Comportamiento determinista
* Validación estructural en tiempo de compilación
* Eliminación de la mutación de estado ambigua

Las especificaciones de RIGOR son verificables estructuralmente antes de la ejecución.

## Modelo de Mutación Dirigido por Eventos

RIGOR aplica un modelo estricto de mutación dirigido por eventos. El contexto solo puede mutar dentro de transiciones declaradas explícitamente, activadas por eventos declarados y de acuerdo con las reglas de mutación permitidas.

No se permite ningún cambio de estado fuera de una transición, dentro de bloques de ejecución arbitrarios o mediante efectos secundarios implícitos. Toda la evolución del estado debe ser observable, explícita y declarada.

Esto garantiza:
* Trazabilidad completa
* Evolución de estado predecible
* Eliminación de mutaciones ocultas

## Semántica de Eventos Transaccionales

Cada evento procesado constituye una única unidad transaccional. Para cada evento:
1. Se lee el estado actual
2. Se evalúa una transición coincidente
3. Se verifican las condiciones de guard (guards)
4. Se aplica la mutación del contexto
5. Ocurre la transición de estado
6. Los cambios se confirman atómicamente

Si falla algún paso, la transición se aborta y no se persiste ninguna mutación. Esto garantiza una consistencia fuerte, transiciones atómicas y capacidad de reproducción determinista.

## Especificación vs Implementación

RIGOR es una especificación, no un motor. El protocolo define reglas estructurales, restricciones de mutación, semántica de eventos y garantías de versionado. No impone un entorno de ejecución, motor de almacenamiento o lenguaje de programación específico.

Cualquier motor que cumpla con la especificación formal, supere los requisitos de validación y preserve las garantías semánticas puede considerarse compatible con RIGOR. Puede existir un motor de referencia oficial, pero este no define el protocolo.

## Versionado y Congelación del Núcleo

RIGOR Core v0.1 define las garantías semánticas fundamentales del protocolo. El modelo semántico del Núcleo se considera congelado.

La evolución futura debe:
* Preservar la compatibilidad con versiones anteriores donde se declare
* Clasificar explícitamente los cambios (compatibles, condicionalmente compatibles, rompedores)
* Mantener la semántica determinista

Las versiones de la especificación siguen los principios de versionado semántico. La identidad de RIGOR es estable por diseño.

## Posicionamiento del Protocolo

RIGOR opera aguas arriba de la ejecución. No orquesta. No ejecuta. Restringe la posibilidad estructural.

RIGOR define garantías semánticas estrictas que las implementaciones posteriores deben preservar. El protocolo no es un motor de orquestación. Es un lenguaje de especificación determinista para describir procesos con estado. Los motores de ejecución interpretan las especificaciones de RIGOR; no las redefinen.
```

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:docs`.
- [ ] Check both English and Spanish "Identity Core" pages.
- [ ] Ensure all 5 new sections are present and correctly formatted.
- [ ] Verify the expansion of "Protocol Positioning".
