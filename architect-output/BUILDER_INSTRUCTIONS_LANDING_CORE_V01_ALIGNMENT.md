# BUILDER INSTRUCTIONS: Landing Page Alignment with Core v0.1

**Status:** Ready for Implementation  
**Context:** This update formalizes the landing page messaging to reflect RIGOR Core v0.1 being frozen and normative.  
**Reference:** `project_brief/LANDING_CHANGES_V2.md`

---

## 🎯 Objectives
1.  Add semantic maturity signaling to the Hero section.
2.  Implement 3 new technical sections (Semantic Guarantees, Typed Context, Spec vs Engine).
3.  Update existing sections (Transaction Model, Project Status, Contribution Call).
4.  Ensure full i18n support (English/Spanish).

---

## 🛠️ Step 1: Update i18n Keys (`apps/web/src/i18n/ui.ts`)

You MUST update `apps/web/src/i18n/ui.ts` with the following content. Replace existing keys where noted and add the new ones.

### English (`en`)
- **Hero (Update):**
  - `hero.maturity`: "Core Semantic Version v0.1 — Frozen and Normative"
  - `hero.maturityDesc`: "RIGOR Core v0.1 defines the formal semantics of the language and is now frozen. This guarantees determinism, structural consistency, and long-term compatibility for future implementations."
- **Semantic Guarantees (NEW):**
  - `semanticGuarantees.title`: "Semantic Guarantees"
  - `semanticGuarantees.intro`: "RIGOR enforces strict semantic rules at the language level:"
  - `semanticGuarantees.list.1`: "Explicit state transitions only"
  - `semanticGuarantees.list.2`: "No implicit mutation"
  - `semanticGuarantees.list.3`: "Deterministic event processing"
  - `semanticGuarantees.list.4`: "Typed and validated context schema"
  - `semanticGuarantees.list.5`: "One event → one transaction"
  - `semanticGuarantees.outro`: "All state changes must occur inside declared transitions triggered by events. No mutation is permitted outside this boundary."
- **Typed Context Model (NEW):**
  - `typedContext.title`: "Typed Context & Structural Validation"
  - `typedContext.intro`: "Every RIGOR Process declares an explicit context schema."
  - `typedContext.list.1`: "Strongly typed fields"
  - `typedContext.list.2`: "Explicitly declared mutable fields"
  - `typedContext.list.3`: "Structural validation before execution"
  - `typedContext.list.4`: "JSON-schema compatible"
  - `typedContext.outro`: "The Engine validates structure and types before processing events. Invalid specifications are rejected before runtime."
- **Specification vs Implementation (NEW/UPDATE):**
  - `specVsEngine.title`: "Specification First. Engine Second."
  - `specVsEngine.intro`: "RIGOR is a specification, not an engine."
  - `specVsEngine.list.1`: "The Core defines the semantics."
  - `specVsEngine.list.2`: "Any compliant engine may implement execution."
  - `specVsEngine.list.3`: "The official reference engine will serve as a normative implementation, but the language remains implementation-independent."
- **Transaction Model (Update):**
  - `transactionModel.title`: "Transactional Event Processing"
  - `transactionModel.intro`: "RIGOR processes events sequentially and transactionally."
  - `transactionModel.list.1`: "1. Load process state"
  - `transactionModel.list.2`: "2. Validate transition"
  - `transactionModel.list.3`: "3. Apply declared mutations"
  - `transactionModel.list.4`: "4. Persist atomically"
  - `transactionModel.list.5`: "5. Emit resulting commands or events"
  - `transactionModel.outro`: "Failure at any step aborts the transaction."
- **Project Status (Update):**
  - `projectStatus.list.1`: "RIGOR Core v0.1 — Formal Specification Complete"
  - `projectStatus.list.2`: "Specification Documents — Public"
  - `projectStatus.list.3`: "Validator CLI — In development"
  - `projectStatus.list.4`: "Reference Engine (MVP) — Planned"
  - `projectStatus.list.5`: "Community Governance — Target Phase"
  - `projectStatus.outro`: "RIGOR aims to become an open, implementable standard for deterministic AI-constrained systems."
- **Contribution Call (Update):**
  - `specificationAccess.title`: "Contribute on GitHub"
  - `specificationAccess.body`: "Help refine the specification. Build compatible engines. Participate in future governance."

### Spanish (`es`)
Translate the above keys consistently with the RIGOR technical terminology.
- **Hero (Actualización):**
  - `hero.maturity`: "Versión Semántica Core v0.1 — Congelada y Normativa"
  - `hero.maturityDesc`: "RIGOR Core v0.1 define la semántica formal del lenguaje y ahora está congelado. Esto garantiza el determinismo, la consistencia estructural y la compatibilidad a largo plazo para futuras implementaciones."
- **Semantic Guarantees (NUEVO):**
  - `semanticGuarantees.title`: "Garantías Semánticas"
  - `semanticGuarantees.intro`: "RIGOR aplica reglas semánticas estrictas a nivel de lenguaje:"
  - `semanticGuarantees.list.1`: "Solo transiciones de estado explícitas"
  - `semanticGuarantees.list.2`: "Sin mutaciones implícitas"
  - `semanticGuarantees.list.3`: "Procesamiento de eventos determinista"
  - `semanticGuarantees.list.4`: "Esquema de contexto tipado y validado"
  - `semanticGuarantees.list.5`: "Un evento → una transacción"
  - `semanticGuarantees.outro`: "Todos los cambios de estado deben ocurrir dentro de transiciones declaradas activadas por eventos. No se permite ninguna mutación fuera de este límite."
- **Typed Context Model (NUEVO):**
  - `typedContext.title`: "Contexto Tipado y Validación Estructural"
  - `typedContext.intro`: "Cada proceso RIGOR declara un esquema de contexto explícito."
  - `typedContext.list.1`: "Campos fuertemente tipados"
  - `typedContext.list.2`: "Campos mutables declarados explícitamente"
  - `typedContext.list.3`: "Validación estructural previa a la ejecución"
  - `typedContext.list.4`: "Compatible con JSON-schema"
  - `typedContext.outro`: "El Motor valida la estructura y los tipos antes de procesar los eventos. Las especificaciones no válidas se rechazan antes del tiempo de ejecución."
- **Specification vs Implementation (NUEVO/ACTUALIZACIÓN):**
  - `specVsEngine.title`: "Primero la Especificación. Segundo el Motor."
  - `specVsEngine.intro`: "RIGOR es una especificación, no un motor."
  - `specVsEngine.list.1`: "El Core define la semántica."
  - `specVsEngine.list.2`: "Cualquier motor compatible puede implementar la ejecución."
  - `specVsEngine.list.3`: "El motor de referencia oficial servirá como una implementación normativa, pero el lenguaje sigue siendo independiente de la implementación."
- **Transaction Model (Actualización):**
  - `transactionModel.title`: "Procesamiento de Eventos Transaccional"
  - `transactionModel.intro`: "RIGOR procesa los eventos de forma secuencial y transaccional."
  - `transactionModel.list.1`: "1. Cargar el estado del proceso"
  - `transactionModel.list.2`: "2. Validar la transición"
  - `transactionModel.list.3`: "3. Aplicar mutaciones declaradas"
  - `transactionModel.list.4`: "4. Persistir atómicamente"
  - `transactionModel.list.5`: "5. Emitir comandos o eventos resultantes"
  - `transactionModel.outro`: "Cualquier fallo en algún paso aborta la transacción."
- **Project Status (Actualización):**
  - `projectStatus.list.1`: "RIGOR Core v0.1 — Especificación Formal Completa"
  - `projectStatus.list.2`: "Documentos de Especificación — Públicos"
  - `projectStatus.list.3`: "CLI de Validación — En desarrollo"
  - `projectStatus.list.4`: "Motor de Referencia (MVP) — Planificado"
  - `projectStatus.list.5`: "Gobernanza Comunitaria — Fase Objetivo"
  - `projectStatus.outro`: "RIGOR aspira a convertirse en un estándar abierto e implementable para sistemas deterministas restringidos por IA."
- **Contribution Call (Actualización):**
  - `specificationAccess.title`: "Contribuye en GitHub"
  - `specificationAccess.body`: "Ayuda a refinar la especificación. Construye motores compatibles. Participa en la futura gobernanza."

---

## 🧱 Step 2: Component Creation & Refactoring

### 1. New Components
Create these in `apps/web/src/components/`. Use the `section--ruled` pattern.

- `SemanticGuarantees.astro`
- `TypedContext.astro`
- `SpecVsEngine.astro`

### 2. Updated Components
Modify these existing components:
- `Hero.astro`: Add the maturity signaling block below the main tagline/wordmark.
- `TransactionModel.astro`: Update list to show the 5 transactional steps.
- `OpenStandard.astro`: You may replace it with `SpecVsEngine.astro` or update it. `LANDING_CHANGES_V2.md` suggests "Specification First. Engine Second."
- `SpecificationAccess.astro`: Update titles and text to reflect the contribution call.

---

## 📄 Step 3: Page Integration (`apps/web/src/pages/index.astro` and `/es/index.astro`)

Update both files to include the new components and ensure the sequence is logical (follow the order in `LANDING_CHANGES_V2.md` where possible).

Suggested Order:
1.  `Hero` (Updated)
2.  `WhatIsRigor`
3.  `SemanticGuarantees` **(NEW)**
4.  `StructuralCondition`
5.  `StructuralEntropy`
6.  `CoreInvariants`
7.  `CoreVersion`
8.  `TypedContext` **(NEW)**
9.  `ProtocolModel`
10. `BackendFirst`
11. `TransactionModel` (Updated)
12. `SpecVsEngine` **(NEW - replaces OpenStandard)**
13. `StructuralPositioning`
14. `ConceptualTerritory`
15. `ProtocolVsPrompt`
16. `ProjectStatus` (Updated)
17. `SpecificationAccess` (Updated as Contribution Call)
18. `Footer`

---

## ✅ Verification Checklist
- [ ] Run `npm run build:web` to ensure no build errors.
- [ ] Verify both `/` and `/es/` routes.
- [ ] Verify the "Core v0.1 — Frozen" message in the Hero.
- [ ] Ensure all transactional steps are correctly listed in `TransactionModel`.
