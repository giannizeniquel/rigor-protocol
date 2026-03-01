# BUILDER INSTRUCTIONS: Implementation Docs Skeleton (v1)

**Status:** Ready for Implementation  
**Context:** Create the definitive skeleton for the Implementation section. 14 documents must exist in both EN and ES, initially containing only their architectural purpose and expected contents.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/IMPLEMENTATION/0-MASTER_INDEX_ARCHITECTURAL_DOC_PLAN.md`

---

## 🎯 Objectives
1.  **Create/Update 14 Documents** in `apps/docs/implementation/` and `apps/docs/es/implementation/`.
2.  **Standardize Content**: Each file must start with a `# Title` and then a "Purpose" and "Expected Content" section based on the Master Plan.
3.  **Renaming**: Delete `constraint-encoding.md` and replace it with `constraint-engine.md`.
4.  **Update Sidebar**: Reflect the 14-document structure in `apps/docs/.vitepress/config.ts`.

---

## 🧱 Step 1: Create/Update English Documents (`apps/docs/implementation/`)

For each of the following, create the file (or overwrite if existing) with the content specified in the Master Plan:

1.  `index.md`: **Introduction** (Purpose: Design principles, philosophy, general architecture).
2.  `architecture.md`: **System Architecture** (Purpose: Global engine architecture, module diagram, layers).
3.  `parser-loader.md`: **Parser & Loader** (Purpose: YAML loading, syntax error handling, normalization).
4.  `graph-builder.md`: **Canonical Graph Builder** (Purpose: Transformation to internal graph model, node/edge instantiation).
5.  `canonicalization.md`: **Canonicalization Engine** (Purpose: Deterministic representation, stable hashing).
6.  `validation-engine.md`: **Validation Engine** (Purpose: Full graph validation, structural/semantic phases).
7.  `constraint-engine.md`: **Constraint Engine** (Purpose: Internal evaluation of rules, severity, short-circuiting).
8.  `diff-engine.md`: **Diff Engine** (Purpose: Graph-based comparison algorithm, ChangeSet generation).
9.  `versioning-engine.md`: **Versioning Engine** (Purpose: Breaking change analysis, automatic bump rules).
10. `migration-engine.md`: **Migration Engine** (Purpose: Atomic application of ChangeSets, idempotency).
11. `event-engine.md`: **Event Resolution Engine** (Purpose: Event registry, payload validation mapping).
12. `error-model.md`: **Error Model** (Purpose: Internal error structure, canonical paths, serialization).
13. `cli.md`: **CLI** (Purpose: Command interface, exit codes, CI/CD integration).
14. `performance-testing.md`: **Performance & Testing Strategy** (Purpose: Operational limits, regression and determinism tests).

---

## 🧱 Step 2: Create/Update Spanish Documents (`apps/docs/es/implementation/`)

Apply the same logic, translating titles and descriptions to Spanish.

1.  `index.md`: **Introducción**
2.  `architecture.md`: **Arquitectura General del Sistema**
3.  `parser-loader.md`: **Parser y Loader**
4.  `graph-builder.md`: **Constructor de Grafo Canónico**
5.  `canonicalization.md`: **Motor de Canonicalización**
6.  `validation-engine.md`: **Motor de Validación**
7.  `constraint-engine.md`: **Motor de Restricciones**
8.  `diff-engine.md`: **Motor de Diff**
9.  `versioning-engine.md`: **Motor de Versionado**
10. `migration-engine.md`: **Motor de Migraciones**
11. `event-engine.md`: **Motor de Resolución de Eventos**
12. `error-model.md`: **Modelo de Errores**
13. `cli.md`: **CLI**
14. `performance-testing.md`: **Estrategia de Rendimiento y Testing**

---

## 🛠️ Step 3: Update Sidebar (`apps/docs/.vitepress/config.ts`)

Update the `Implementation` (and `Implementación`) sidebar sections to include all 14 links in the correct order.

---

## ✅ Verification Checklist
- [ ] 14 files exist in `implementation/`.
- [ ] 14 files exist in `es/implementation/`.
- [ ] `constraint-encoding.md` is gone.
- [ ] Sidebar links are all functional.
- [ ] Content is only descriptions/skeletons.
