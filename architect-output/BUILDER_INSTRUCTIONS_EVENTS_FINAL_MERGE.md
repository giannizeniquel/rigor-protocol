# BUILDER INSTRUCTIONS: Definitive Events Specification Merger (v2)

**Status:** Ready for Implementation  
**Context:** Merge the normative Event proposal with the current implementation to create the definitive specification. The proposal's DSL syntax prevails.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/DOCS_CHANGES_EVENTS-PROPOSAL.md`

---

## 🎯 Objectives
1.  **Adopt Proposal Syntax**: Shift from Map-based events to List-based events with `payload_schema` (as defined in the proposal's EBNF).
2.  **Maintain Operational Contract**: Keep the "Runtime Event Envelope" section from the current implementation.
3.  **Strengthen Semantics**: Include the "immutable across compatible versions" rule.
4.  **Sync Multilingual**: Ensure English and Spanish versions are identical in structure and technical rigor.

---

## 🧱 Step 1: Update `apps/docs/specification/events.md`

Use the following merged structure:

### 1. Purpose & Definition
Use the formal text from the proposal. Define Events as external inputs with typed payloads.

### 2. Formal Grammar (EBNF)
**MUST** use the grammar from the proposal:
```ebnf
events_block       ::= "events:" event_definition+
event_definition   ::= "-" "event_id:" identifier NEWLINE
                       INDENT "payload_schema:" payload_schema DEDENT
payload_schema     ::= "type: object" NEWLINE
                       INDENT "properties:" properties
                       "required:" required_fields DEDENT
```

### 3. Naming Rules
Use `PascalCase` for `event_id` and `snake_case` for payload fields.

### 4. Payload Schema Rules
Include the rules for explicit required fields, optional fields using `?`, and the prohibition of nested objects in v0.1.

### 5. Semantic Rules
Combine both sources. Ensure rule 5 (immutability across versions) is present.

### 6. Event Processing & Runtime Envelope
- **Processing Model**: Atomic and transactional boundary.
- **Runtime Event Envelope**: **RESTORE** the metadata table (`event_id`, `event_name`, `payload`, `timestamp`) as it defines the protocol's runtime interface.

### 7. Validation & Error Taxonomy
Use the EV-001 to EV-006 codes.

### 8. Examples
Update the examples to use the new list-style syntax with `payload_schema`.

---

## 🧱 Step 2: Update `apps/docs/es/specification/events.md`

Apply the same merger logic to the Spanish version. Maintain EBNF and Error Codes in English.

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:docs`.
- [ ] Events are defined as a list (`- event_id: ...`) instead of a map.
- [ ] The `payload_schema` block is used instead of a simple `payload` key.
- [ ] The "Runtime Event Envelope" table is present.
- [ ] Error codes (EV-001 to EV-006) are documented.
