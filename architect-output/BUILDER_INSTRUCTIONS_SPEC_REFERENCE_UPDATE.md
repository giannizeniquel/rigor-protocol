# BUILDER INSTRUCTIONS: Spec Reference Formalization (v1)

**Status:** Ready for Implementation  
**Context:** Transform the Spec Reference from a descriptive guide into a formal normative DSL specification.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/DOCS_CHANGES_SPEC_REFERENCE.md`

---

## 🎯 Objectives
1.  **Full Restructure**: Reorganize the page into formal grammar and semantic sections.
2.  **EBNF Integration**: Add formal grammar for every DSL block (File, Context, Events, States, Updates, Paths).
3.  **Type System Codification**: Formalize supported types and nullability rules.
4.  **Update Logic**: Define the formal syntax for `update_context` expressions.
5.  **Error Taxonomy**: Introduce RIGOR-DSL error codes.
6.  **Implementation Decoupling**: Move persistence/DB details to implementation docs (remove from this page).

---

## 🧱 Step 1: Update `apps/docs/specification/spec-reference.md`

Replace the entire content with the following normative structure.

### 1. Introduction
State that this document defines the formal syntax and semantics of the RIGOR DSL v0.1 and is normative for all compliant engines.

### 2. File Structure (EBNF)
```ebnf
spec_file ::= version_block process_block
version_block ::= "rigor_spec_version" ":" string
                  "spec_version" ":" string
process_block ::= "process" ":" identifier
                  context_block
                  events_block
                  initial_state
                  states_block
```
*Rule: Only one process per file in v0.1.*

### 3. Type System
Formalize the types: `string`, `integer` (64-bit), `boolean`, `datetime` (ISO-8601), `uuid` (RFC-4122), `object`, and `array<type>`.  
*Nullability*: Explicitly declared with `?` (e.g., `string?`).

### 4. Context Schema
```ebnf
context_block ::= "context:" context_field+
context_field ::= identifier ":" type
```
*Rule: Fields are immutable except via transition updates.*

### 5. Event Declaration
```ebnf
events_block ::= "events:" event_definition+
event_definition ::= identifier ":" payload_block
payload_block ::= "payload:" payload_field+
```

### 6. State & Transition Grammar
```ebnf
states_block ::= "states:" state_definition+
state_definition ::= identifier ":" transition_block*
transition_block ::= "on:" event_name
                      "to:" state_name
                      update_block?
initial_state ::= "initial_state:" identifier
```

### 7. Update Expression Grammar
```ebnf
update_block ::= "update_context:" update_statement+
update_statement ::= identifier ":" expression
expression ::= literal | path | "now" | arithmetic_expression
path ::= "event.payload." identifier | "context." identifier
arithmetic_expression ::= "context." identifier ( "+" | "-" | "*" | "/" ) literal
```
*Rule: Only declared context fields may be updated. Type compatibility is mandatory.*

### 8. Determinism Constraints
* No side effects.
* Transitions are atomic.
* Event processing is a transactional unit.

### 9. DSL Validation Errors
| Code | Description |
| :--- | :--- |
| RIGOR-DSL-001 | Undefined state reference |
| RIGOR-DSL-002 | Undefined event reference |
| RIGOR-DSL-003 | Type mismatch in update |
| RIGOR-DSL-004 | Invalid path expression |
| RIGOR-DSL-005 | Duplicate declaration |
| RIGOR-DSL-006 | Undeclared context mutation |

### 10. Minimal Complete Example
Include a YAML example covering versioning, context, events, states, and transitions with `update_context`.

---

## 🧱 Step 2: Update `apps/docs/es/specification/spec-reference.md`

Apply the same structural updates and translations to the Spanish version. Ensure EBNF blocks remain in English (technical standard) but descriptions and rules are in Spanish.

*(Builder: Use terms like "Gramática EBNF", "Sistema de Tipos", "Expresiones de Actualización", "Invariantes".)*

---

## 🛠️ Step 3: Clean up Implementation Details
Remove the following sections as they belong in Implementation docs:
- "Persistence Model (Industrial Standard)"
- "Recommended Table Structure"
- "Audit Table"
- "Persistence SQL examples"

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:docs`.
- [ ] EBNF blocks are correctly formatted.
- [ ] All mandatory fields (rigor_spec_version, spec_version, process) are present.
- [ ] Persistence/DB details are removed from the Spec Reference.
- [ ] JSON/YAML examples reflect the new `update_context` and path syntax.
