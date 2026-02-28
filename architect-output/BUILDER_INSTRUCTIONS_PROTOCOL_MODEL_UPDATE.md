# BUILDER INSTRUCTIONS: Protocol Model Specification Update (v1)

**Status:** Ready for Implementation  
**Context:** Update the Protocol Model specification page to reflect RIGOR Core v0.1 frozen semantics, including transactional guarantees and the event-driven mutation model.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/DOCS_CHANGES_PROTOCOL-MODEL.md`

---

## 🎯 Objectives
1.  Enhance `protocol-model.md` (EN and ES) with normative semantic clarifications.
2.  Add detailed sections on Context Schema, Mutation Model, Transactional Semantics, and Event Queueing.
3.  Formalize the Consistency Model and Core Stability policy.
4.  Maintain the existing structural hierarchy and formal tone.

---

## 🛠️ Step 1: Update `apps/docs/specification/protocol-model.md`

Perform the following updates to the English version.

### 1. Add Context Schema to Section 3
Add `### 3.6 Context Schema and Type System` at the end of Section 3:

```markdown
### 3.6 Context Schema and Type System
Every RIGOR process MUST declare a typed `context_schema`. The context represents the persistent state data owned by the process instance.

**Requirements:**
* All fields must be explicitly declared with a static type.
* No implicit properties are allowed.
* Context mutations must conform to the declared types.
* Unknown fields are rejected at validation time.

Without a declared context schema, a process is invalid. This enables static validation, deterministic mutation legality, and cross-engine compatibility.
```

### 2. Add Event-Driven Mutation Model
Insert as a new Section 4 (and renumber subsequent sections):

```markdown
## 4. Event-Driven Mutation Model

RIGOR enforces an event-driven mutation architecture. State and context may only change inside explicitly declared transitions triggered by events.

A valid transition must:
1. Declare the triggering event.
2. Declare the target state.
3. Explicitly declare which context fields mutate.

Mutations outside transitions are prohibited by protocol. This constraint guarantees structural traceability, predictable state evolution, and the elimination of hidden side effects.
```

### 3. Replace/Extend Protocol Invariants
Update the renumbered Section 5 (formerly 4) to "Extended Protocol Invariants":

```markdown
## 5. Extended Protocol Invariants

The following properties are non-negotiable for any RIGOR-compliant system:

1. **Explicit Typing Invariant**: All context data must be declared in the schema. No dynamic properties allowed.
2. **Mutation Locality Invariant**: Context mutation may occur only inside declared transitions triggered by events.
3. **Event Atomicity Invariant**: Each event is processed as an independent transactional unit (All-or-Nothing).
4. **Deterministic Transition**: Given a State + Event, the resulting transition is uniquely defined.
5. **Deterministic Replay Invariant**: Given the same initial state and ordered event sequence, the outcome must be identical.
6. **Validation Precedence**: Structural validation must always precede execution.
7. **No Implicit Side-Effects Invariant**: The protocol does not permit hidden or undeclared state mutation.
8. **Terminal Stability Invariant**: Terminal states cannot emit further transitions.
```

### 4. Add Transactional Semantics and Queueing
Insert as new Sections 6 and 7 (renumbering others):

```markdown
## 6. Transactional Event Semantics

Each processed event constitutes a single atomic transactional unit. Event handling must execute the following steps:
1. Validate that the event is applicable in the current state.
2. Evaluate optional guards (which must be pure).
3. Apply declared context mutations.
4. Transition to the new state.
5. Persist the new state and context atomically.

If any step fails, no mutation is persisted and the process remains in its previous state. This guarantees strong consistency at the process level.

## 7. Internal Event Emission and Queueing

RIGOR allows internal event emission. However:
* Emitted events MUST be enqueued.
* They MUST NOT be processed within the same transactional boundary.
* They MUST be processed as independent subsequent events.

This preserves atomic event semantics and deterministic replay behavior.
```

### 5. Final Sections: Consistency and Stability
Add these sections at the end of the document:

```markdown
## 10. Consistency Model

RIGOR guarantees **strong consistency** at the process level. It does not require global distributed transactions. Instead, consistency is achieved via atomic per-event processing, deterministic transition logic, and explicit event contracts. External systems must integrate via event boundaries.

## 11. Core Stability and Evolution

RIGOR Core v0.1 is considered semantically frozen. Changes must be explicitly classified as:
* **Compatible** (additive)
* **Conditionally Compatible**
* **Breaking** (requires major version increment)

This policy protects ecosystem stability and ensures that breaking changes are intentional and manageable.
```

*(Note: Renumber sections 5, 6, 7 from original to 8, 9, 12 as needed to accommodate the inserts)*

---

## 🧱 Step 2: Update `apps/docs/es/specification/protocol-model.md`

Apply the same structural updates and translations to the Spanish version.

### 1. Añadir Esquema de Contexto a la Sección 3
Añadir `### 3.6 Esquema de Contexto y Sistema de Tipos` al final de la Sección 3:

```markdown
### 3.6 Esquema de Contexto y Sistema de Tipos
Cada proceso RIGOR DEBE declarar un `context_schema` tipado. El contexto representa los datos de estado persistentes propiedad de la instancia del proceso.

**Requisitos:**
* Todos los campos deben declararse explícitamente con un tipo estático.
* No se permiten propiedades implícitas.
* Las mutaciones de contexto deben ajustarse a los tipos declarados.
* Los campos desconocidos se rechazan en el momento de la validación.

Sin un esquema de contexto declarado, un proceso no es válido. Esto permite la validación estática, la legalidad de la mutación determinista y la compatibilidad entre motores.
```

### 2. Añadir Modelo de Mutación Dirigido por Eventos
Insertar como nueva Sección 4 (y renumerar las siguientes):

```markdown
## 4. Modelo de Mutación Dirigido por Eventos

RIGOR impone una arquitectura de mutación dirigida por eventos. El estado y el contexto solo pueden cambiar dentro de transiciones declaradas explícitamente activadas por eventos.

Una transición válida debe:
1. Declarar el evento activador.
2. Declarar el estado de destino.
3. Declarar explícitamente qué campos del contexto mutan.

El protocolo prohíbe las mutaciones fuera de las transiciones. Esta restricción garantiza la trazabilidad estructural, la evolución predecible del estado y la eliminación de efectos secundarios ocultos.
```

### 3. Reemplazar/Extender Invariantes del Protocolo
Actualizar la Sección 5 (antes 4) a "Invariantes Extendidos del Protocolo":

```markdown
## 5. Invariantes Extendidos del Protocolo

Las siguientes propiedades son obligatorias para cualquier sistema compatible con RIGOR:

1. **Invariante de Tipado Explícito**: Todos los datos del contexto deben estar declarados en el esquema.
2. **Invariante de Localidad de Mutación**: La mutación del contexto solo puede ocurrir dentro de transiciones declaradas.
3. **Invariante de Atomicidad de Eventos**: Cada evento se procesa como una unidad transaccional independiente (Todo o Nada).
4. **Transición Determinística**: Dado un Estado + Evento, la transición resultante está definida de forma única.
5. **Invariante de Reproducción Determinista**: Dado el mismo estado inicial y una secuencia de eventos ordenada, el resultado debe ser idéntico.
6. **Precedencia de Validación**: La validación estructural siempre debe preceder a la ejecución.
7. **Invariante de Ausencia de Efectos Secundarios Implícitos**: El protocolo no permite mutaciones de estado ocultas o no declaradas.
8. **Invariante de Estabilidad Terminal**: Los estados terminales no pueden emitir más transiciones.
```

### 4. Añadir Semántica Transaccional y Cola
Insertar como nuevas Secciones 6 y 7:

```markdown
## 6. Semántica de Eventos Transaccionales

Cada evento procesado constituye una única unidad transaccional atómica. El manejo de eventos debe ejecutar los siguientes pasos:
1. Validar que el evento es aplicable en el estado actual.
2. Evaluar guards opcionales (que deben ser puros).
3. Aplicar mutaciones de contexto declaradas.
4. Transicionar al nuevo estado.
5. Persistir el nuevo estado y el contexto de forma atómica.

Si falla algún paso, no se persiste ninguna mutación y el proceso permanece en su estado anterior. Esto garantiza una consistencia fuerte a nivel de proceso.

## 7. Emisión y Cola de Eventos Internos

RIGOR permite la emisión de eventos internos. Sin embargo:
* Los eventos emitidos DEBEN ponerse en cola.
* NO DEBEN procesarse dentro del mismo límite transaccional.
* DEBEN procesarse como eventos posteriores independientes.

Esto preserva la semántica de eventos atómicos y el comportamiento de reproducción determinista.
```

### 5. Secciones Finales: Consistencia y Estabilidad
Añadir estas secciones al final del documento:

```markdown
## 10. Modelo de Consistencia

RIGOR garantiza una **consistencia fuerte** a nivel de proceso. No requiere transacciones distribuidas globales. En su lugar, la consistencia se logra mediante el procesamiento atómico por evento, la lógica de transición determinista y los contratos de eventos explícitos. Los sistemas externos deben integrarse a través de límites de eventos.

## 11. Estabilidad y Evolución del Núcleo

RIGOR Core v0.1 se considera semánticamente congelado. Los cambios deben clasificarse explícitamente como:
* **Compatible** (aditivo)
* **Condicionalmente Compatible**
* **Rompedor** (Breaking - requiere un incremento de versión mayor)

Esta política protege la estabilidad del ecosistema y garantiza que los cambios rompedores sean intencionales y manejables.
```

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:docs`.
- [ ] Check both English and Spanish "Protocol Model" pages.
- [ ] Verify that section renumbering is correct and consistent.
- [ ] Ensure all new technical terms are translated accurately.
