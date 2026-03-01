# BUILDER INSTRUCTIONS: Migration Engine Specification (v1)

**Status:** Ready for Implementation  
**Context:** Replace the Migration Engine skeleton with the formal normative specification. This module handles the deterministic transformation of Canonical Graphs between versions.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/IMPLEMENTATION/9-MIGRATION-ENGINE.md`

---

## 🎯 Objectives
1.  **Verbatim Implementation**: Use the content from the reference document to update `apps/docs/implementation/migration-engine.md` and its Spanish version.
2.  **Full 21-Section Structure**: Ensure all sections (Purpose, Preconditions, Phases, Atomicity, etc.) are present.
3.  **Markdown Fix**: **CRITICAL:** Remove any `id="..."` attributes from code blocks (e.g., change ` ```id="m9_transformation"` to just ` ``` `) to prevent VitePress build failures.
4.  **Multilingual Synchronization**: Translate the content faithfully to Spanish, maintaining technical IDs and normative terms.

---

## 🧱 Step 1: Update English Document (`apps/docs/implementation/migration-engine.md`)

Use the content from the reference file but strip out the `id` attributes from markdown blocks.

---

## 🧱 Step 2: Update Spanish Document (`apps/docs/es/implementation/migration-engine.md`)

Translate the reference content to Spanish. Use technical terms like "Motor de Migraciones", "Límite Transaccional", "Transformación Atómica" and "Integridad de Grafo".

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:docs`.
- [ ] All 21 sections are present in both languages.
- [ ] No `id` attributes exist in code blocks.
- [ ] Post-migration validation requirement is clearly stated.
- [ ] Sidebar links remain functional.
