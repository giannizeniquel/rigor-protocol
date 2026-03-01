# BUILDER INSTRUCTIONS: Versioning Specification Formalization (v1)

**Status:** Ready for Implementation  
**Context:** Transform the Versioning specification into a fully normative document, integrating version range support and formal validation error codes.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/DOCS_CHANGES_VERSIONING.md`

---

## 🎯 Objectives
1.  **Fully Normative Restructure**: Use RFC keywords (MUST, SHOULD, MAY) to define versioning behavior.
2.  **Define Version Identifiers**: Codify `rigor_spec_version` (MAJOR.MINOR) and `spec_version` (MAJOR.MINOR.PATCH).
3.  **Establish Range Support**: Document how engines MUST handle version range operators (>=, <, etc.).
4.  **Integrate with Validation**: Define formal error codes (ER-xxx) for version mismatches and malformed strings.
5.  **Provide Canonical Examples**: Include structured YAML snippets for valid and invalid versioning scenarios.

---

## 🧱 Step 1: Update `apps/docs/specification/versioning.md`

Replace the content with the following normative outline:

### 1. Introduction
State that versioning is a formal structural constraint in RIGOR, required for deterministic evolution and safe migrations.

### 2. Version Identifiers (Normative)
- **`rigor_spec_version`**:
  - Represents the RIGOR language/core version.
  - Format: `"MAJOR.MINOR"` (e.g., `"0.1"`).
  - Engines **MUST** reject specifications with an unsupported language version.
- **`spec_version`**:
  - Represents the version of a specific process definition.
  - Format: `"MAJOR.MINOR.PATCH"` (e.g., `"1.0.0"`).
  - Follows Semantic Versioning rules.

### 3. Semantic Rules (Increment Logic)
| Segment | Increment Rule | Purpose |
| :--- | :--- | :--- |
| **MAJOR** | **MUST** increment | Breaking changes (removed states, changed types). |
| **MINOR** | **MAY** increment | Backward-compatible features (new optional fields). |
| **PATCH** | **MAY** increment | Bug fixes, clarifications, or documentation. |

### 4. Version Range Support
Engines **SHOULD** support range operators for compatibility checks:
- **Operators**: `=`, `>`, `>=`, `<`, `<=`, `^`, `~`.
- **Behavior**: A spec is valid only if the identifiers satisfy the engine's supported range.

### 5. Versioning in Validation
Integration with the Validation Matrix:
1. Validator **MUST** verify both identifiers at the start of the process.
2. Mismatches or malformed strings trigger immediate failure.
3. Version evolution **SHOULD** be logged for auditability.

### 6. Error Taxonomy
| Code | Condition | Severity |
| :--- | :--- | :--- |
| `ER-VERSION-INCOMPATIBLE` | Spec version not supported by engine. | Error |
| `ER-UNSUPPORTED-RIGOR-SPEC` | `rigor_spec_version` is outside engine capability. | Error |
| `ER-INVALID-VERSION-STRING` | Version identifier does not follow mandated format. | Error |

### 7. Examples
- **Valid**: Show a standard compliant version block.
- **Invalid (Breaking Change)**: Show a major structural change without a MAJOR increment.
- **Invalid (Language)**: Show an engine rejecting a future `rigor_spec_version: "2.0"`.

---

## 🧱 Step 2: Update `apps/docs/es/specification/versioning.md`

Apply the same structural updates and translations to the Spanish version. Maintain the ER-xxx error codes in English as technical constants.

*(Builder: Use terms like "Identificadores de Versión", "Rangos de Versión", "Taxonomía de Errores", "Incremento Semántico".)*

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:docs`.
- [ ] Language is normative (MUST/DEBE).
- [ ] Range operators are explicitly listed.
- [ ] Error codes (ER-VERSION-INCOMPATIBLE, etc.) are present.
- [ ] Examples are rendered in YAML blocks.
