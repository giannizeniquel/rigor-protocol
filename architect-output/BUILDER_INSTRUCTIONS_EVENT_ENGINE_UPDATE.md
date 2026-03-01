# BUILDER INSTRUCTIONS: Event Resolution Engine Specification (v1)

**Status:** Ready for Implementation  
**Context:** Replace the Event Engine skeleton with the formal normative specification. This module handles the structural resolution and integrity of event triggers and handlers within the Canonical Graph.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/IMPLEMENTATION/10-EVENT-RESOLUTION-ENGINE.md`

---

## 🎯 Objectives
1.  **Full Rewrite**: Replace current `event-engine.md` (EN and ES) with the formal normative model.
2.  **Verbatim Implementation**: Follow the reference document precisely, ensuring all 19 sections are present.
3.  **Markdown Fix**: **CRITICAL:** Remove any `id="..."` attributes from markdown code blocks (e.g., change ` ```id="e10_input_contract"` to just ` ``` `) to prevent VitePress build failures.
4.  **Multilingual Synchronization**: Ensure English and Spanish versions are technically identical and synchronized.

---

## 🧱 Step 1: Update English Document (`apps/docs/implementation/event-engine.md`)

Replace the content using the provided reference document. Remember to strip the `id` attributes from code blocks.

---

## 🧱 Step 2: Update Spanish Document (`apps/docs/es/implementation/event-engine.md`)

Translate the content to Spanish. Use technical terms like "Motor de Resolución de Eventos", "Detección de Ciclos", "Integridad de Dependencias" and "Compatibilidad de Triggers".

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:docs`.
- [ ] All 19 sections are present in both languages.
- [ ] No `id` attributes exist in code blocks.
- [ ] The 5 phases of resolution are documented.
- [ ] Deterministic ordering rules are clearly stated.
- [ ] Sidebar links remain functional.
