# Spec Reference (v0.1)

## 1. Technical Reference Consolidation

This document defines the **exhaustive technical reference** for the RIGOR Specification v0.1 syntax and semantics. While the **Core** establishes theoretical principles and invariants, the **Reference** provides the necessary detail to implement:
- A complete YAML parser.
- A structural and semantic validator.
- A compatible execution engine.
- An automatic code generator.

## 2. Root Document Structure

### 2.1 Main Node
The root of the YAML file must contain the `processes` node:
```yaml
processes:
  <ProcessName>: {}
```
- **Mandatory**: The `processes` key must exist.
- **Type**: Must be an object (map).
- **Requirement**: Must contain at least one process definition.
- **Validation**:
  - `✓ Valid`: `processes: { MyProcess: {...} }`
  - `✗ Invalid`: `process: { ... }` (Incorrect key name)
  - `✗ Invalid`: `processes: []` (Must be a map, not an array)
  - `✗ Invalid`: `processes: {}` (Empty map is invalid)

### 2.2 Process Naming Rules
- **Format**: `PascalCase` (Recommended).
- **Constraints**: Must start with an uppercase letter, be alphanumeric, and contain no spaces or special characters.
- **Regex**: `^[A-Z][a-zA-Z0-9]*$`
- **Examples**:
  - `✓ Valid`: `OrderPaymentProcess`, `UserOnboarding`, `MultiLevelApproval2Stages`.
  - `✗ Invalid`: `orderPayment` (Starts with lowercase), `Order_Payment` (Contains underscore), `2FastProcess` (Starts with a number).

## 3. Full Process Structure

### 3.1 Structural Example
```yaml
processes:
  OrderPaymentProcess:
    persistence: true
    start_command: StartOrderPayment
    uniqueness:
      by: order_id
    context:
      order_id: uuid
      attempts: integer
      approved: boolean?
      approval_date: datetime?
      last_error: string?
    initial_state: INITIAL
    states:
      INITIAL:
        emit_command: RequestPayment
        on:
          PaymentApproved:
            update_context:
              approved: true
              approval_date: now
            transition_to: COMPLETED
          PaymentRejected:
            update_context:
              attempts: increment
              last_error: event.payload.reason
            transition_to: EVALUATE_RETRY
      EVALUATE_RETRY:
        invoke: EvaluateRetryPolicy
        on:
          RetryAllowed:
            transition_to: INITIAL
          RetryDenied:
            transition_to: CANCELLED
      COMPLETED:
        terminal: true
      CANCELLED:
        terminal: true
```

### 3.2 Mandatory vs. Optional Fields

| Field | Mandatory | Type | Description |
| :--- | :---: | :--- | :--- |
| `persistence` | Yes | `boolean` | Indicates if the process is persisted. |
| `start_command` | Yes | `string` | The command that initializes the process. |
| `uniqueness` | No | `object` | Uniqueness constraints. |
| `context` | Yes | `object` | The persistent data model. |
| `initial_state` | Yes | `string` | The starting state name. |
| `states` | Yes | `object` | Map of states and their behavior. |

## 4. Detailed Field Specifications

### 4.1 `persistence` (Mandatory)
- **Type**: `boolean`
- **Allowed Value (v0.1)**: Must be `true`.
- **Purpose**: Signals that instances must be stored in permanent storage.
- **Semantics**: When `true`, the engine must create a record in `process_instances`, persist every transition, ensure ACID atomicity, and optionally maintain an event history.

### 4.2 `start_command` (Mandatory)
- **Type**: `string`
- **Constraints**:
  - **Globally Unique**: Cannot be repeated across different processes.
  - **Format**: `PascalCase`, alphanumeric, preferably an infinitive verb (e.g., `CreateReservation`).
  - **Regex**: `^[A-Z][a-zA-Z0-9]*$`
- **Execution Semantics**: Upon receiving a `start_command`, the engine validates uniqueness, creates a new instance with a unique UUID, initializes the context, sets the `current_state` to `initial_state`, and executes the initial state's effect.
- **Idempotency**: When combined with `uniqueness`, subsequent calls with the same key must be rejected with a `ProcessAlreadyActiveException`.

### 4.3 `uniqueness` (Optional)
- **Type**: `object`
- **Structure**: `uniqueness: { by: context_field }`
- **Description**: Prevents multiple active instances of the same process with the same value in the specified field.
- **Rules**:
  - The referenced field **must exist** in the `context`.
  - Verification must be **transactional** (using conditional unique indexes).
  - **Active Only**: A terminal instance does not block a new instance with the same key.
- **Behavior**: If an active instance exists, the engine must reject the command with a `ProcessAlreadyActiveException`.

### 4.4 `context` (Mandatory)
- **Type**: `object` (Map of typed fields)
- **Description**: The persistent, mutable data model. It is the **only** source of mutable state.
- **Naming Rules**: `snake_case`, lowercase letters and underscores only, must start with a letter, no trailing underscores.
- **Regex**: `^[a-z_]+$`

#### 4.4.1 Allowed Primitive Types (v0.1)
| Type | Description | Typical Representation |
| :--- | :--- | :--- |
| `uuid` | Universal Unique Identifier | RFC 4122 UUID |
| `string` | UTF-8 Text | UTF-8 String |
| `integer` | 64-bit Signed Integer | Int64 |
| `boolean` | Boolean Value | `true` / `false` |
| `datetime` | ISO 8601 Date/Time | ISO 8601 / UTC Timestamp |

- **Nullability**: Indicated by the `?` suffix (e.g., `datetime?`). Mandatory fields without `?` must have a value from creation.
- **Structural Constraints**: No complex types (objects, arrays, nested maps) are allowed in v0.1 to maintain simplicity and determinism.

#### 4.4.2 Context Initialization
The context is initialized when the `start_command` is executed.
- Fields provided in the command payload are mapped.
- `integer` defaults to `0`.
- `string` defaults to `""` (empty string).
- `boolean` defaults to `false`.
- `datetime` defaults to `null` or the current timestamp.
- Nullable fields (`?`) default to `null`.

#### 4.4.3 Mutability
The context is **only** modified via `update_context` during transitions. It is **never** directly modified by generated code, commands, or use cases.

### 4.5 `initial_state` (Mandatory)
- **Type**: `string`
- **Rules**:
  - Must exist in the `states` map.
  - **Cannot be a terminal state**.
- **Semantics**: The engine sets the `current_state` to this value upon instance creation.

### 4.6 `states` (Mandatory)
- **Type**: `object` (Map of states)
- **Naming Rules**: `UPPER_SNAKE_CASE` (e.g., `WAITING_FOR_VERIFICATION`).
- **Regex**: `^[A-Z_]+$`
- **Requirements**: Must contain at least one state and at least one terminal state.

## 5. State Definition Rules

### 5.1 The "Exactly One Effect" Rule
Each state must declare **exactly one** of the following mutually exclusive effects:
- `emit_command`: A string representing an asynchronous external command.
- `invoke`: A string representing a synchronous internal use case.
- `terminal`: A boolean set to `true`.

**Structural Validation Example**:
```json
{
  "oneOf": [
    {"required": ["emit_command"]},
    {"required": ["invoke"]},
    {"required": ["terminal"]}
  ]
}
```

### 5.2 `emit_command` (Asynchronous)
- **Type**: `string` (PascalCase, preferably an infinitive verb like `RequestPayment`).
- **Characteristics**:
  - **Fire-and-forget**: The process emits the command and does not wait for an immediate response.
  - **Single Execution**: Emitted only once upon entering the state.
  - **Decoupled**: The process does not know how the command is executed or its immediate result.
- **Execution Flow**:
  1. Process transitions to the state.
  2. Engine dispatches the command with the context payload.
  3. Process waits for an event response.
  4. External system processes the command and emits a response event.
  5. Process receives the event and evaluates the transition in `on:`.

### 5.3 `invoke` (Synchronous)
- **Type**: `string` (PascalCase, preferably a verb like `EvaluateRetryPolicy`).
- **Characteristics**:
  - **Synchronous Logic**: The engine executes the UseCase and waits for its result (an event).
  - **Deterministic**: Same inputs must produce the same result/event.
  - **Idempotent**: Must be safe to execute multiple times (e.g., on network errors).
- **Execution Flow**:
  1. Process transitions to the state.
  2. Engine executes the UseCase.
  3. UseCase emits a result event.
  4. Process receives the event and evaluates the transition in `on:`.

### 5.4 `terminal` (Process Conclusion)
- **Type**: `boolean` (Value must be `true`).
- **Rules**:
  - **No `on:` block allowed**: Terminal states do not have outgoing transitions.
  - **No effects allowed**: Cannot emit commands or invoke use cases.
  - **Cannot be the `initial_state`**.
- **Semantics**: When a process reaches a terminal state, it becomes inactive, and its uniqueness key (if any) is released for new instances.

## 6. Transitions (`on:`)

Defines how the process reacts to events and which state transitions to execute.

### 6.1 Structure
```yaml
on:
  EventName:
    update_context: # Optional
      field: value
    transition_to: TARGET_STATE # Mandatory
```

### 6.2 Event Naming
- **Format**: `PascalCase`, alphanumeric, preferably past tense (e.g., `PaymentApproved`).
- **Regex**: `^[A-Z][a-zA-Z0-9]*$`

### 6.3 Transition Fields
- **`transition_to` (Mandatory)**: Must reference an existing state in the `states` map.
- **`update_context` (Optional)**: A declarative map of modifications to the context that occur **before** the transition is completed.

## 7. `update_context` - Exhaustive Specification

### 7.1 Fundamental Constraints
- Can only modify existing fields in the `context`.
- Cannot create or remove fields.
- Guaranteed deterministic evaluation with no side effects.

### 7.2 Permitted Operations

#### 7.2.1 `now` (System Timestamp)
- **Applicable to**: `datetime` or `datetime?`.
- **Semantics**: Assigns the exact UTC timestamp of the transition.
- **Example**: `approval_date: now`

#### 7.2.2 `increment` (Numeric Increment)
- **Applicable to**: `integer`.
- **Semantics**: Increases the current value by 1. If the field is `null` (nullable), it is set to 1.
- **Example**: `attempts: increment`

#### 7.2.3 Literal Values
- **Applicable to**: All types.
- **Examples**: `is_approved: true`, `status: "processed"`, `retry_count: 5`.

#### 7.2.4 Values from Event Payload
- **Syntax**: `context_field: event.payload.subfield`
- **Rules**:
  - The subfield must exist in the formal event definition.
  - Types must match (e.g., an `integer` payload field cannot be mapped to a `string` context field).
- **Example**: `last_error: event.payload.reason`

### 7.3 Atomicity
All operations in an `update_context` block are applied **atomically** as part of the transition transaction. No cross-references (e.g., `field_a: field_b`) are allowed in v0.1.

## 8. Global Validation Rules

Before a specification can be used, the validator must verify these **mandatory rules**:

### V1: Valid `initial_state`
- Must exist in the `states` map.
- **Cannot be a terminal state**.
- `✓ Valid`: `initial_state: START` (where START is not terminal).
- `✗ Invalid`: `initial_state: END` (where END has `terminal: true`).

### V2: Valid `transition_to`
- Every `transition_to` must reference an existing state in the `states` map.
- `✓ Valid`: `transition_to: COMPLETED` (exists).
- `✗ Invalid`: `transition_to: UNKNOWN` (does not exist).

### V3: At Least One Terminal State
- Every process must have at least one state with `terminal: true`.
- `✓ Valid`: At least one state is terminal.
- `✗ Invalid`: A process with only cycles (infinite loop).

### V4: Reachable States
- Every state must be reachable from the `initial_state` using a DFS/BFS algorithm.
- `✗ Invalid`: An "orphan" state with no incoming transitions.

### V5: No Dead-End Cycles
- Every state must have a path to a terminal state.
- `✗ Invalid`: A cycle with no path out to a terminal state (infinite loop).

### V6: Globally Unique `start_command`
- No two processes can share the same `start_command`.

## 9. Persistence Model (Industrial Standard)

RIGOR-compliant engines must implement a persistence layer that guarantees ACID properties.

### 9.1 Recommended Table Structure (`process_instances`)
**DDL (PostgreSQL Example):**
```sql
CREATE TABLE process_instances (
  process_id UUID PRIMARY KEY,
  process_name VARCHAR(100) NOT NULL,
  current_state VARCHAR(50) NOT NULL,
  serialized_context JSONB NOT NULL,
  uniqueness_key VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  -- Index for filtering by process name and state
  INDEX idx_process_type_state (process_name, current_state),
  -- Conditional unique index for uniqueness constraints
  UNIQUE INDEX uniq_process_key (process_name, uniqueness_key)
  WHERE is_active = true AND uniqueness_key IS NOT NULL
);
```

### 9.2 Audit Table (`process_events`)
**DDL (PostgreSQL Example):**
```sql
CREATE TABLE process_events (
  event_id UUID PRIMARY KEY,
  process_id UUID NOT NULL REFERENCES process_instances(process_id),
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  previous_state VARCHAR(50),
  new_state VARCHAR(50),
  occurred_at TIMESTAMP NOT NULL DEFAULT NOW(),
  -- Index for auditing by process ID
  INDEX idx_process_events (process_id, occurred_at DESC)
);
```

### 9.3 Atomicity Guarantees
Every transition must execute within a single transaction:
1. **Acquire Lock**: Load the instance with an exclusive lock.
2. **Validate State**: Confirm the event is allowed in the current state.
3. **Apply `update_context`**: Deterministically update the context.
4. **Change State**: Transition to the new state.
5. **Persist Instance**: Update the database record.
6. **Log Event**: Insert the audit record.
7. **Commit Transaction**.

Failure at any stage must trigger a full rollback, ensuring no inconsistent intermediate states exist.

### 9.4 Typical Queries

**Find Active Instance by Uniqueness Key**:
```sql
SELECT * FROM process_instances 
WHERE process_name = 'PaymentProcess' 
AND uniqueness_key = 'order-123' 
AND is_active = true;
```

**Get Full Transition History**:
```sql
SELECT event_type, previous_state, new_state, occurred_at 
FROM process_events 
WHERE process_id = 'proc-123' 
ORDER BY occurred_at ASC;
```

## 10. Required Testing Standards

### 10.1 Pure State Machine Principle
A process must be executable as a **pure state machine**:
- Without external infrastructure (no DB, no network).
- Through event injection.
- Resulting in a deterministic final state and updated context.

### 10.2 Determinism Check
The process should satisfy:
```python
# Given an initial state and an event
initial_state = "PROCESSING"
event = PaymentApproved(order_id="123")
# When the event is handled
new_state, new_context = process.handle(event)
# Then the result is deterministic
assert new_state == "COMPLETED"
assert new_context.is_approved == True
```

### 10.3 Property-Based Testing
Engines should verify that identical inputs always yield identical outcomes and that process behavior remains predictable across a wide range of state/event combinations.

## 11. Generation Contract for AI

Any AI generating implementation code from a RIGOR Specification **must** adhere to these mandatory principles:

### 11.1 Type Strictness
- `uuid` → UUID/GUID
- `integer` → Int64/Int/i64
- `boolean` → Bool/Boolean
- `datetime` → DateTime/Timestamp
- `string` → String

### 11.2 No Unspecified Logic
- Do **not** infer additional validations not present in the specification.
- Do **not** add extra fields to the context.
- Do **not** modify transition logic.

### 11.3 No Implicit Effects
- Do **not** emit events not declared in the specification.
- Do **not** make service calls not mentioned in the specification.
- Do **not** create hidden side effects.

### 11.4 Traceability
- Every event must be logged.
- Every transition must be audited.
- States and context must remain observable.

## 12. Future Compatibility

RIGOR v0.1 is designed to evolve into:
- **v1.1 - Compensations**: `compensate_with: RollbackAction`.
- **v1.2 - Timeouts**: `timeout: 10m`.
- **v1.3 - Parallelism**: `parallel: [TaskA, TaskB]`.
- **v1.4 - Sub-processes**: `subprocess: AnotherProcess`.

Specifications written in v0.1 **must** remain valid in future versions.

## 13. Conclusion

The RIGOR Specification v0.1 provides a complete framework for an **industrial-grade implementation** of declarative processes. It enables:
✅ **Parsing** of YAML process files.
✅ **Validation** of structure and semantics.
✅ **Generation** of deterministic implementation code.
✅ **Persistence** with ACID guarantees.
✅ **Auditing** of all transitions.
✅ **Testing** without external infrastructure.
✅ **Scaling** toward advanced features without breaking compatibility.

Implementers are obligated to strictly follow these rules to maintain the **Rigor Compliance** guarantee.
