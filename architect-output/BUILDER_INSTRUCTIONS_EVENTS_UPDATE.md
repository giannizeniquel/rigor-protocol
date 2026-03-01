# BUILDER INSTRUCTIONS: Events Specification Formalization (v1)

**Status:** Ready for Implementation  
**Context:** Elevate the Events specification to normative RIGOR Core v0.1 level, aligned with Spec Core and Spec Reference.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/DOCS_CHANGES_EVENTS.md`

---

## 🎯 Objectives
1.  **Restructure `events.md`** (EN and ES) into a normative specification using RFC keywords (MUST, SHOULD, MAY).
2.  **Add Formal Grammar (EBNF)**: Define the syntactic structure of the events block.
3.  **Codify Naming & Semantic Rules**: Formalize identifier patterns and relationship with transitions.
4.  **Define Event Processing Model**: Clarify atomicity, transactional boundaries, and external nature of events in v0.1.
5.  **Establish Error Taxonomy**: Define specific error codes (EV-001 to EV-006).

---

## 🧱 Step 1: Update `apps/docs/specification/events.md`

Replace the content with the following structure:

### 1. Formal Definition
Define an Event as "a named external input with an explicitly declared, statically typed payload schema that triggers state transitions within a Process."
- Events are declarative and non-executable.
- Events MUST NOT mutate state directly (only via transitions).

### 2. Formal Grammar (EBNF)
```ebnf
events_block ::= "events:" event_definition+
event_definition ::= identifier ":" payload_block
payload_block ::= "payload:" payload_field+
payload_field ::= identifier ":" type
```

### 3. Naming Rules (Normative)
- **Event Identifiers**: MUST be unique within the process and follow `PascalCase` (`^[A-Z][a-zA-Z0-9]*$`).
- **Payload Fields**: MUST follow `snake_case` (`^[a-z_][a-z0-9_]*$`).

### 4. Payload Schema Rules
- Payload types MUST conform to the RIGOR Type System.
- Optional fields MUST use the `?` suffix (e.g., `reason: string?`).
- Empty payloads are ALLOWED but MUST be explicitly declared as an empty `payload` block.
- **v0.1 Constraint**: No nested objects, union types, or dynamic fields.

### 5. Semantic Rules
- Events MUST be declared before use.
- Transitions MUST reference declared Events.
- Payload validation MUST occur before transition evaluation.
- All events in v0.1 are **External**. Internal event emission is NOT supported.

### 6. Event Processing Model
- Each event constitutes a single atomic transactional boundary.
- If validation or transition fails, NO state mutation or context update is persisted.

### 7. Validation & Error Taxonomy
| Code | Condition | Severity |
| :--- | :--- | :--- |
| EV-001 | Duplicate event_id | Error |
| EV-002 | Transition references undeclared event | Error |
| EV-003 | Payload type mismatch | Error |
| EV-004 | Unknown payload field | Error |
| EV-005 | Missing required payload field | Error |
| EV-006 | Invalid event naming pattern | Error |

### 8. Examples
Include a valid `PaymentConfirmed` example and an invalid naming example.

---

## 🧱 Step 2: Update `apps/docs/es/specification/events.md`

Apply the same structural updates and translations to the Spanish version.

*(Builder: Use terms like "Esquema de Payload", "Límite Transaccional", "Identificadores de Eventos", "Taxonomía de Errores".)*

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:docs`.
- [ ] The page uses normative keywords (MUST/DEBE).
- [ ] EBNF block is present and aligned with Spec Reference.
- [ ] The "Internal vs External" section clearly states internal events are not supported in v0.1.
- [ ] Error codes (EV-001 to EV-006) are documented.
