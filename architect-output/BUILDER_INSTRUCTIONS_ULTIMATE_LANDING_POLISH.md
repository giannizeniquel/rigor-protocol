# BUILDER INSTRUCTIONS: Ultimate Landing Page Polish (v3)

**Status:** Ready for Implementation  
**Context:** Final refinement to elevate RIGOR from a conceptual protocol to a formally grounded standard.  
**Reference:** `project_brief/06 - CHANGES/ULTIMATE_LANDING_CHANGES.md`

---

## 🎯 Objectives
1.  Implement the "Why RIGOR?" section to clarify the problem/solution fit.
2.  Enhance technical sections: Typed Context, Deterministic Mutation, Transactional Model, and Stable Core.
3.  Ensure terminology consistency across all sections and languages.
4.  Maintain the established visual identity (Zero JS, monochromatic, ruled sections).

---

## 🛠️ Step 1: Update i18n Keys (`apps/web/src/i18n/ui.ts`)

Update/Add the following keys in `apps/web/src/i18n/ui.ts`.

### English (`en`)
- **Why RIGOR? (NEW):**
  - `whyRigor.title`: "Why RIGOR?"
  - `whyRigor.p1`: "Modern software increasingly relies on AI-assisted generation. Narrative prompts are expressive but ambiguous. As systems grow in complexity, ambiguity increases, drift becomes inevitable, and regeneration becomes unpredictable."
  - `whyRigor.p2`: "RIGOR exists to introduce structure where narrative fails. It is not a framework or an engine—it is a formal protocol designed to make AI-assisted system generation reliable."
  - `whyRigor.list.1`: "Deterministic execution semantics"
  - `whyRigor.list.2`: "Explicit state mutation boundaries"
  - `whyRigor.list.3`: "Typed context validation"
  - `whyRigor.list.4`: "Replayable event processing"
  - `whyRigor.list.5`: "Specification-level invariants"
  - `whyRigor.outro`: "RIGOR turns architectural intent into a verifiable contract."
- **Typed Context (Refinement):**
  - `typedContext.title`: "Typed Context & Schema Validation"
  - `typedContext.body`: "RIGOR specifications define an explicit and typed context schema. Every process declares the structure of its persistent state, allowed data types, and required fields. RIGOR eliminates runtime ambiguity by enforcing compile-time structural validation."
- **Deterministic Mutation (NEW/Refinement):**
  - `deterministicMutation.title`: "Deterministic Event-Driven Mutation"
  - `deterministicMutation.body`: "In RIGOR, state cannot be modified arbitrarily. All mutations must occur inside explicitly declared transitions triggered by events. No state change is allowed outside the transition model."
  - `deterministicMutation.guarantees`: "This guarantees deterministic execution, traceable behavior, predictable regeneration, and strong consistency boundaries."
- **Transactional Execution (Refinement):**
  - `transactionModel.title`: "Transactional Execution Model"
  - `transactionModel.body`: "Every event processed by a RIGOR Engine is handled in isolation, produces at most one state transition, and persists its effects atomically. Failure during processing results in no partial state mutation or ambiguous intermediate states."
- **Stable Core (Refinement):**
  - `coreVersion.title`: "Stable Core, Classified Evolution"
  - `coreVersion.body`: "RIGOR Core v0.1 defines the minimal invariant semantics of the protocol. Core invariants are frozen and versioned. Future evolution follows a classified model (Patch, Minor, Major) to ensure safe long-term adoption."

### Spanish (`es`)
- **Why RIGOR? (NUEVO):**
  - `whyRigor.title`: "¿Por qué RIGOR?"
  - `whyRigor.p1`: "El software moderno depende cada vez más de la generación asistida por IA. Los prompts narrativos son expresivos pero ambiguos. A medida que los sistemas crecen en complejidad, la ambigüedad aumenta, el desvío se vuelve inevitable y la regeneración se vuelve impredecible."
  - `whyRigor.p2`: "RIGOR existe para introducir estructura donde la narrativa falla. No es un framework ni un motor; es un protocolo formal diseñado para hacer que la generación de sistemas asistida por IA sea confiable."
  - `whyRigor.list.1`: "Semántica de ejecución determinista"
  - `whyRigor.list.2`: "Límites explícitos de mutación de estado"
  - `whyRigor.list.3`: "Validación de contexto tipada"
  - `whyRigor.list.4`: "Procesamiento de eventos reproducible"
  - `whyRigor.list.5`: "Invariantes a nivel de especificación"
  - `whyRigor.outro`: "RIGOR convierte la intención arquitectónica en un contrato verificable."
- **Typed Context (Refinamiento):**
  - `typedContext.title`: "Contexto Tipado y Validación de Esquema"
  - `typedContext.body`: "Las especificaciones RIGOR definen un esquema de contexto explícito y tipado. Cada proceso declara la estructura de su estado persistente, los tipos de datos permitidos y los campos obligatorios. RIGOR elimina la ambigüedad en tiempo de ejecución al aplicar una validación estructural en tiempo de compilación."
- **Deterministic Mutation (NUEVO/Refinamiento):**
  - `deterministicMutation.title`: "Mutación Determinista Dirigida por Eventos"
  - `deterministicMutation.body`: "En RIGOR, el estado no puede modificarse arbitrariamente. Todas las mutaciones deben ocurrir dentro de transiciones declaradas explícitamente activadas por eventos. No se permite ningún cambio de estado fuera del modelo de transición."
  - `deterministicMutation.guarantees`: "Esto garantiza una ejecución determinista, un comportamiento rastreable, una regeneración predecible y límites de consistencia fuertes."
- **Transactional Execution (Refinamiento):**
  - `transactionModel.title`: "Modelo de Ejecución Transaccional"
  - `transactionModel.body`: "Cada evento procesado por un Motor RIGOR se maneja de forma aislada, produce como máximo una transición de estado y persiste sus efectos de forma atómica. El fallo durante el procesamiento no produce mutaciones parciales de estado ni estados intermedios ambiguos."
- **Stable Core (Refinamiento):**
  - `coreVersion.title`: "Núcleo Estable, Evolución Clasificada"
  - `coreVersion.body`: "RIGOR Core v0.1 define la semántica invariante mínima del protocolo. Los invariantes del núcleo están congelados y versionados. La evolución futura sigue un modelo clasificado (Parche, Menor, Mayor) para garantizar una adopción segura a largo plazo."

---

## 🧱 Step 2: Component Creation & Refactoring

### 1. New Component: `WhyRigor.astro`
Create this component in `apps/web/src/components/`.
- Use the `section--ruled` pattern.
- Include the intro paragraphs, the 5-point list, and the outro.

### 2. Refactor: `SemanticGuarantees.astro` -> `DeterministicMutation.astro`
- Rename the component and update it to focus on the mutation model and guarantees.
- Update the i18n keys usage.

### 3. Update: `TypedContext.astro`, `TransactionModel.astro`, `CoreVersion.astro`
- Update the text to match the refined content in Step 1.
- Ensure `CoreVersion.astro` emphasizes "Classified Evolution".

---

## 📄 Step 3: Page Integration (`apps/web/src/pages/index.astro` and `/es/index.astro`)

Update the sequence to:
1.  `Hero`
2.  `WhyRigor` **(NEW)**
3.  `WhatIsRigor`
4.  `DeterministicMutation` **(Refined)**
5.  `StructuralCondition`
6.  `StructuralEntropy`
7.  `CoreInvariants`
8.  `CoreVersion` (Stable Core)
9.  `TypedContext` (Schema Validation)
10. `ProtocolModel`
11. `BackendFirst`
12. `TransactionModel` (Execution Model)
13. `SpecVsEngine`
14. `StructuralPositioning`
15. `ConceptualTerritory`
16. `ProtocolVsPrompt`
17. `ProjectStatus`
18. `SpecificationAccess` (Contribution Call)
19. `Footer`

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:web`.
- [ ] "Why RIGOR?" appears early in the scroll flow.
- [ ] All technical sections use the refined "formal standard" terminology.
- [ ] i18n is consistent across both EN and ES versions.
