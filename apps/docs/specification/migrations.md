# Migrations (v0.1)

## 1. Purpose

The RIGOR Migrations specification defines the formal model for migrating persisted process instances when a specification undergoes a `MAJOR` version change. This applies strictly to processes with `persistence: true`. The objective is to ensure data integrity and prevent structural state corruption during evolution.

## 2. Triggering a Migration

A migration is mandatory whenever a `MAJOR` change occurs, specifically when:
- A context field type changes.
- An existing state is removed or renamed.
- A required field is removed from the context.
- The `initial_state` is changed.

Migrations are **not required** for `MINOR` or `PATCH` changes.

## 3. Migration Strategies

RIGOR supports two primary migration strategies:

### 3.1 Offline Migration
- **Process**: Stop the engine, transform all persisted instances to the new specification, and restart.
- **Trade-off**: Simpler to implement but requires downtime.

### 3.2 On-Read (Lazy) Migration
- **Process**: Multiple specification versions remain active. An instance is migrated automatically when it is loaded by the engine.
- **Requirement**: A deterministic transformer and immediate persistence of the migrated version.

## 4. Migration Transformer

A migration must be defined as a formal function: `migrate(v_old) -> v_new`.

### 4.1 Mandatory Properties
- **Deterministic**: Given the same input, it must produce the same output.
- **Pure**: No external side effects (e.g., API calls) during transformation.
- **Idempotent**: Can be safely executed multiple times without altering the result.

## 5. Structural Transformation Rules

### 5.1 State Migration
If a state is removed, an equivalent destination state must be defined. An instance cannot be left in a non-existent state after migration.

### 5.2 Context Migration
- **New Required Fields**: Must have an explicit default value.
- **Removed Fields**: Must be discarded.
- **Type Conversion**: Must be explicitly handled (e.g., converting an `integer` to a `string`).

## 6. Instance Version Control

Every persisted instance must store:
- `spec_version`: The version of the specification it currently adheres to.
- `migrated_at`: (Nullable) The timestamp of the last migration.

The engine must compare the instance's `spec_version` with the current specification's version before processing any event. If they differ, the migration must be executed first.

## 7. Post-Migration Validation

Immediately after a migration, the engine must:
1. Run **Semantic Validation** on the migrated instance.
2. Verify the `current_state` exists in the new specification.
3. Confirm all context types are coherent.

If validation fails, the instance must be marked as **corrupt** and execution must be halted to prevent further inconsistency.
