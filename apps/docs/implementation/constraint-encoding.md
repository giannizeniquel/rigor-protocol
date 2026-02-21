# Constraint Encoding (v0.1)

Constraint Encoding is the formal process of translating a high-level RIGOR specification into a **machine-verifiable persistent state machine**. This process ensures that every transition and context modification is explicitly declared and structurally sound.

## 1. Specification Node Hierarchy

The root of the specification encodes the entire intent domain through the `processes` and `events` nodes:

```yaml
# 1. Intent Domain (Root)
processes:
  # 2. Process Specification
  OrderPaymentProcess:
    # 3. Persistence Mode
    persistence: true
    # 4. Starting Command
    start_command: StartPayment
    # 5. Data Model (Context)
    context:
      order_id: uuid
      amount: integer
    # 6. Initial State
    initial_state: INITIAL
    # 7. State Machine (States & Transitions)
    states:
      INITIAL:
        emit_command: RequestPayment
        on:
          PaymentApproved:
            transition_to: COMPLETED
```

## 2. Encoding the Persistent Context

The `context` block encodes the only source of mutable state for the process. Every field is strongly typed to enable deterministic validation.

### 2.1 Primitive Type Mapping
A RIGOR-compliant engine must map specification types to their target environment equivalents:
- `uuid` → UUID (RFC 4122).
- `string` → UTF-8 string.
- `integer` → Int64 (signed 64-bit integer).
- `boolean` → Boolean (`true`/`false`).
- `datetime` → ISO 8601 UTC timestamp.

### 2.2 Nullability Encoding
The `?` suffix (e.g., `string?`) encodes explicit nullability. A field without `?` must be initialized during the `start_command` or it will result in a validation error.

## 3. Encoding the State Machine

Every state encodes exactly one effect, creating a mutually exclusive structure:

### 3.1 Asynchronous Effects (`emit_command`)
Encodes a command that will be dispatched to an external system. The encoding is **non-blocking** and **fire-and-forget**.

### 3.2 Synchronous Effects (`invoke`)
Encodes a call to an internal technical component. The encoding is **synchronous** and requires an immediate event response.

### 3.3 Terminal States (`terminal: true`)
Encodes the conclusion of the process. No further transitions can be encoded for this state.

## 4. Transition Logic Encoding (`on:`)

The `on:` block encodes the reaction of the process to external or internal events.

### 4.1 State Transition
Encodes the jump from the current state to the `transition_to` state. This jump is atomic and irreversible.

### 4.2 Context Modification (`update_context`)
Encodes the transformations to the persistent context:
- `now` → Current system timestamp.
- `increment` → Current value + 1.
- `event.payload.<field>` → Copy value from event data.

## 5. Machine Verification

The encoding is verified at three levels:
1. **Schema Level**: Correct YAML structure and key naming.
2. **Structural Level**: All state and event references exist and form a complete graph.
3. **Semantic Level**: Types in `update_context` match the `context` definition.

Any failure in encoding results in a **corrupt specification** that cannot be implemented or executed.
