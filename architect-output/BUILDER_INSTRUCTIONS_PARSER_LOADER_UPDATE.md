# BUILDER INSTRUCTIONS: Parser & Loader Specification (v1)

**Status:** Ready for Implementation  
**Context:** Replace the Parser & Loader skeleton with the formal normative specification. This module handles the initial ingestion and syntax validation of RIGOR specifications.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/IMPLEMENTATION/3-PARSER-AND-LOADER.md`

---

## 🎯 Objectives
1.  **Full Rewrite**: Replace current `parser-loader.md` (EN and ES) with the formal specification.
2.  **Define Responsibilities**: Clarify that this module only handles syntax, encoding, and basic normalization (No semantic validation).
3.  **Codify YAML Constraints**: Document strict rules against duplicate keys, anchors, aliases, and executable tags.
4.  **Describe the IR**: Define the Intermediate Representation (IR) structure and its deterministic properties.
5.  **Multilingual Synchronization**: Ensure English and Spanish versions are technically identical.

---

## 🧱 Step 1: Update `apps/docs/implementation/parser-loader.md`

Replace the content with the normative structure:

### 1. Purpose
Define the module as the sole entry point for external file formats, transforming raw text into structured IR.

### 2. Responsibilities
List mandatory tasks (Read source, validate syntax/encoding, normalize, produce IR) and prohibitions (No semantic references, no graph building, no business logic).

### 3. Supported Input Format (YAML)
- Mandate UTF-8.
- Document YAML constraints: No duplicates, no coercion beyond standard, no anchors/aliases, no executable tags.

### 4. Intermediate Representation (IR)
Define the IR contract: Ordered mappings/sequences, typed primitives, no comments, deterministic hierarchy.

### 5. Structural Validation (Syntax Stage)
Define the scope of early validation (root type, mandatory top-level keys). Explicitly state that referential integrity is NOT handled here.

### 6. Duplicate Key Handling
Mandate fatal errors for duplicates. Prohibit silent overwriting.

### 7. Normalization Rules
Define what is normalized (line endings, boolean/numeric representation) and what is preserved (mapping/sequence order).

### 8. Error Model & Security
- Integrate with the Error Model (Line/Column reporting).
- List security constraints: No remote loading, protection against expansion attacks.

### 9. Output Contract & Integration
Specify the output structure (MappingNode + metadata) and state that IR is the sole input for the Graph Builder.

---

## 🧱 Step 2: Update `apps/docs/es/implementation/parser-loader.md`

Apply the same structural updates and translations to the Spanish version. Use terms like "Representación Intermedia (IR)", "Claves Duplicadas", and "Normalización".

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:docs`.
- [ ] All 17 sections from the proposal are represented.
- [ ] "No duplicate keys" rule is prominent.
- [ ] IR definition matches the architectural plan.
- [ ] Sidebar links remain functional.
