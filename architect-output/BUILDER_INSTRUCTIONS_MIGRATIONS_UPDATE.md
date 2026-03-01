# BUILDER INSTRUCTIONS: Migrations Specification Formalization (v1)

**Status:** Ready for Implementation  
**Context:** Elevate Migrations from a runtime concept to a formal normative DSL specification aligned with RIGOR Core v0.1.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/DOCS_CHANGES_MIGRATIONS.md`

---

## 🎯 Objectives
1.  **Full Rewrite**: Replace current `migrations.md` (EN and ES) with the formal normative model.
2.  **Define DSL Structure**: Formalize the `migrations:` block at the root of the specification.
3.  **Formal Grammar (EBNF)**: Include the EBNF for migration blocks and operations.
4.  **Codify Operations**: Document the 7 permitted operations (`add_state`, `remove_state`, `rename_state`, `add_event`, `remove_event`, `modify_transition`, `modify_context_schema`).
5.  **Establish Validation Rules**: Define Structural, Graph, and Version compatibility validation layers.
6.  **CLI Integration**: Document the proposed `rigor migrate` command.

---

## 🧱 Step 1: Update `apps/docs/specification/migrations.md`

Replace the content with the following structure:

### 1. Formal Definition
A Migration is an ordered, deterministic set of operations that transforms a specification from version A to version B.
- Must be declarative and deterministic.
- Must be validatable.
- Cannot depend on external state.

### 2. File Structure & Location
Migrations are declared in the root `migrations:` block of the document.
- Only forward migrations are supported in v0.1 (`from < to`).
- Chain must be sequential (no gaps, cycles, or forks).

### 3. Formal Grammar (EBNF)
```ebnf
migrations_block ::= "migrations:" migration_definition+
migration_definition ::= "-" "from:" version "to:" version "operations:" operation+
operation ::= add_state | remove_state | rename_state | add_event | remove_event | modify_transition | modify_context_schema
```

### 4. Permitted Operations (v0.1)
Document each operation with its YAML syntax and rules (refer to the proposal for details):
- **add_state**: Name must not exist.
- **remove_state**: Must not be initial or have active transitions.
- **rename_state**: Must update all references.
- **add_event** / **remove_event** (Remove allowed only in MAJOR).
- **modify_transition**: Must not break determinism.
- **modify_context_schema**: Incompatible changes require MAJOR.

### 5. Validation Layers
- **Structural**: Format, sequentiality, non-empty operations.
- **Graph**: Post-migration graph must be valid (reachability, determinism).
- **Compatibility**: Permitted operations must match the SemVer increment type (MINOR = add-only, MAJOR = destructive allowed).

### 6. Error Taxonomy
| Code | Description |
| :--- | :--- |
| `ER-MIGRATION-INVALID-VERSION` | Invalid version format. |
| `ER-MIGRATION-NON-SEQUENTIAL` | Gap in migration chain. |
| `ER-MIGRATION-CYCLE` | Cycle detected in chain. |
| `ER-MIGRATION-INVALID-OPERATION` | Unsupported or malformed operation. |
| `ER-MIGRATION-GRAPH-BROKEN` | Invalid graph results after migration. |

### 7. CLI Integration
Document `rigor migrate <spec.yaml> --to <version>` and its behavior (Resolve chain -> Apply sequential -> Validate result -> Emit spec).

---

## 🧱 Step 2: Update `apps/docs/es/specification/migrations.md`

Apply the same structural updates and translations to the Spanish version.

*(Builder: Use terms like "Operaciones Permitidas", "Capas de Validación", "Taxonomía de Errores", "Integración con CLI".)*

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:docs`.
- [ ] EBNF block is present and matches the proposal.
- [ ] All 7 operations are documented with examples.
- [ ] Error codes (ER-MIGRATION-xxx) are listed.
- [ ] Sidebar links remain functional.
