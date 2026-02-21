# Events (v0.1)

## 1. Purpose

While a Process defines the state machine, an **Event** defines the typed structure of the inputs that trigger transitions. The RIGOR Events specification formalizes the event contract to enable:
- Structural validation.
- Strong typing in AI-driven code generation.
- Deterministic compatibility with `update_context`.

The goal is to provide a formal contract between external systems and the RIGOR Engine.

## 2. Root Structure

The `events` node is mandatory in a RIGOR specification if the system defines processes. It is a map where each key represents a unique event.

```yaml
events:
  <EventName>:
    payload:
      <field_name>: <type>
```

### 2.1 Naming Rules
- **Event Name**: Must start with an uppercase letter, be alphanumeric, and use `PascalCase` (e.g., `PaymentApproved`).
- **Regex**: `^[A-Z][a-zA-Z0-9]*$`
- **Payload Field**: Must use `snake_case` (lowercase and underscores only).
- **Regex**: `^[a-z_]+$`

## 3. Payload Specification

### 3.1 General Rules
- The `payload` node is **mandatory** and must contain at least one field.
- Every field must have a defined type.

### 3.2 Supported Types
Events support the same primitive types as the Process context:
- `uuid`: RFC 4122 universal unique identifier.
- `string`: UTF-8 encoded text.
- `integer`: 64-bit signed integer.
- `boolean`: `true` or `false`.
- `datetime`: ISO 8601 or UTC timestamp.

Nullability is supported using the `?` suffix (e.g., `error_code: integer?`). To maintain simplicity and determinism, nested objects, lists, or composite types are **not permitted** in v0.1.

## 4. Relationship with Processes

Events are referenced within the `on:` block of a state definition:

```yaml
states:
  WAITING_FOR_PAYMENT:
    on:
      PaymentApproved:
        transition_to: COMPLETED
```

### 4.1 Constraints
- **Existence**: Every event referenced in a Process must be defined in the `events` section.
- **`update_context` Mapping**: Values from an event payload can be mapped to the process context using the `event.payload.<field>` syntax. Types must match exactly between the payload and the context field.

## 5. Engine Semantics

A RIGOR-compliant event processed by the engine must contain:
- `event_id` (UUID): Unique identifier for the event instance.
- `event_name` (String): The formal name of the event as defined in the spec.
- `payload` (Object): The data accompanying the event.
- `timestamp` (DateTime): The time the event occurred.

### 5.1 Idempotency
The engine **must** be capable of ignoring duplicate events to maintain process integrity.
- **Recommended Strategy**: Persist every processed `event_id` in a dedicated `processed_events` table linked to the `process_id`. Before executing a transition, the engine should check if the `event_id` has already been applied.

## 6. Formal Validation Rules

- **VAL-E1**: Every event referenced in a Process must exist in the `events` section.
- **VAL-E2**: The event payload must match the type definition in the specification.
- **VAL-E3**: Type compatibility must be verified when mapping payload fields to the context.
- **VAL-E4**: Mandatory payload fields (those without `?`) must be present in the event data.
- **VAL-E5 (Warning)**: Events defined in the specification but never referenced in any process should trigger a warning.

## 7. JSON Schema Representation

The following JSON Schema defines the formal structure of the `events` section:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["events"],
  "properties": {
    "events": {
      "type": "object",
      "patternProperties": {
        "^[A-Z][a-zA-Z0-9]*$": {
          "type": "object",
          "required": ["payload"],
          "properties": {
            "payload": {
              "type": "object",
              "minProperties": 1,
              "patternProperties": {
                "^[a-z_]+$": {
                  "type": "string",
                  "pattern": "^(uuid|string|integer|boolean|datetime)(\\?)?$"
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## 8. Integrated Example

The interaction between `events` and `processes` through `update_context`:

```yaml
events:
  EmailVerified:
    payload:
      user_id: uuid
      timestamp: datetime

processes:
  UserOnboardingProcess:
    persistence: true
    start_command: StartOnboarding
    context:
      user_id: uuid
      email_verified: boolean
      verified_at: datetime?
    initial_state: WAITING_FOR_VERIFICATION
    states:
      WAITING_FOR_VERIFICATION:
        on:
          EmailVerified:
            update_context:
              email_verified: true
              verified_at: event.payload.timestamp
            transition_to: COMPLETED
      COMPLETED:
        terminal: true
```

The `events` node is mandatory in a RIGOR specification if the system defines processes. It is a map where each key represents a unique event.

```yaml
events:
  <EventName>:
    payload:
      <field_name>: <type>
```

### 2.1 Naming Rules
- **Event Name**: Must start with an uppercase letter, be alphanumeric, and use `PascalCase` (e.g., `PaymentApproved`).
- **Regex**: `^[A-Z][a-zA-Z0-9]*$`

## 3. Payload Specification

### 3.1 General Rules
- The `payload` node is mandatory and must contain at least one field.
- Field names must use `snake_case`.
- **Regex**: `^[a-z_]+$`

### 3.2 Supported Types
Events support the same primitive types as the Process context:
- `uuid`
- `string`
- `integer`
- `boolean`
- `datetime`

Nullability is supported using the `?` suffix (e.g., `error_code: integer?`). Nested objects or lists are not permitted in v0.1.

## 4. Relationship with Processes

Events are referenced within the `on:` block of a state definition:

```yaml
states:
  WAITING_FOR_PAYMENT:
    on:
      PaymentApproved:
        transition_to: COMPLETED
```

### 4.1 Constraints
- **Existence**: Every event referenced in a Process must be defined in the `events` section.
- **`update_context` Mapping**: Values from an event payload can be mapped to the process context using the `event.payload.<field>` syntax.

```yaml
update_context:
  order_id: event.payload.order_id
  confirmed_at: event.payload.timestamp
```

## 5. Engine Semantics

A RIGOR-compliant event processed by the engine must contain:
- `event_id` (UUID)
- `event_name` (String)
- `payload` (Object)
- `timestamp` (DateTime)

### 5.1 Idempotency
The engine must be capable of ignoring duplicate events. It is recommended to maintain a registry of processed `event_id`s to ensure a transition is not re-executed if the event has already been applied.

## 6. Validation Rules

- **VAL-E1**: Every event referenced in a Process must exist in the `events` section.
- **VAL-E2**: The event payload must match the type definition in the specification.
- **VAL-E3**: Type compatibility must be verified when mapping payload fields to the context.
- **VAL-E4**: Mandatory payload fields (those without `?`) must be present in the event data.
