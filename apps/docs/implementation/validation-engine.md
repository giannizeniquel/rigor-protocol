# Validation Engine (v0.1)

## 1. Purpose

The RIGOR Validation Engine defines the **formal pipeline** for specification verification before engine execution. The objective is to guarantee that every Spec is:
- Syntactically correct
- Structurally consistent
- Semantically coherent
- Deterministically executable

## 2. Validation Phases (F1–F4)

The validation pipeline must execute in the following order. If any phase fails, the process stops.

### F1: Schema Validation (JSON/YAML Schema)
Validates the base structure against the **Core**, **Events**, and **Reference** schemas.
- **Mandatory Keys**: Checks for `processes`, `context`, `initial_state`, `states`, etc.
- **Data Types**: Validates that fields have correct types (boolean, integer, string, etc.).
- **Naming Regex**: Ensures PascalCase and snake_case adherence.

### F2: Cross-Structural Validation
Verifies consistency between different sections of the Spec:
- **Event References**: All events referenced in a Process must exist in the Events definition.
- **State Existence**: All `transition_to` references must point to existing states in the `states` map.
- **Initial State**: The `initial_state` must exist and **cannot** be a terminal state.
- **Reachability**: All states must be reachable from the `initial_state`. No "orphan" states are allowed.
- **Process Closure**: A process must have at least one terminal state.
- **Process States**: A process cannot exist without a defined `states` map.

### F3: Semantic Validation
Checks for logical and type-specific consistency:
- **`update_context` Compatibility**: Types in `update_context` must match the field type in `context`.
- **Operator Usage**: `increment` is only allowed on `integer` fields; `now` is only allowed on `datetime` fields.
- **Persistence Requirements**: If `persistence` were `false`, the `increment` operator would be prohibited (unsupported in v0.1).
- **Mutuality**: States must have exactly one effect (`emit_command`, `invoke`, or `terminal`).
- **Terminal Transitions**: Terminal states **must not** have outgoing transitions (`on:`).

### F4: Executability Validation
Ensures the state machine is safe for the engine:
- **Finite Graph**: The state machine graph must be finite (Error).
- **Terminal Path**: Every state should have a valid path toward a terminal state. Failure to find a terminal path produces a **WARNING** (potential infinite loop).
- **Missing Terminal**: A process without at least one terminal state produces a **WARNING**.
- **Start Command**: A `start_command` must be defined if `persistence` is true.

## 3. Error Classification
Validation results are classified to guide developers:
- **ERROR (VAL-XXX)**: Structural or semantic violation. **Invalidates execution**.
- **WARNING**: Potential risk (e.g., unreachable state or infinite loop). Execution is possible but not recommended.
- **INFO**: Structural recommendations or naming convention reminders.

## 4. Stability Error Codes
...
| `VAL-006` | Invalid Operator | `increment` or `now` used on an invalid field type. |
| `VAL-007` | Missing Terminal | No terminal state defined in the process. |

## 5. Compliance Report Format
...

## 6. Validator's Guarantee
A specification that passes RIGOR VALIDATION v0.1 is guaranteed to be:
- **Structurally Sound**: No broken references or missing keys.
- **Unambiguous**: Clear transition paths for all declared events.
- **Type-Coherent**: Consistent data handling in context updates.
- **Deterministically Executable**: Safe for processing by the RIGOR Engine.

The Validation Engine produces a JSON report:
```json
{
  "valid": false,
  "errors": [
    {
      "code": "VAL-002",
      "message": "Transition to non-existent state: 'PENDING'",
      "location": "processes.OrderProcess.states.INITIAL.on.PaymentApproved"
    }
  ],
  "warnings": [],
  "info": []
}
```
A specification is only **RIGOR-compliant** if the report returns `valid: true`.
