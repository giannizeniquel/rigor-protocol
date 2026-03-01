# Migration Engine (v0.1)

## 1. Purpose

The Migration Engine is responsible for:
- Validating migration definitions
- Ensuring migration compatibility with a ChangeSet
- Executing migrations deterministically
- Producing a transformed Canonical Graph

It operates after:
- Diff Engine
- Versioning Engine
- Validation Engine

It **MUST NOT**:
- Compute diff
- Re-classify version bump
- Mutate the source graph in place

---

## 2. Conceptual Model

Migration execution is a transformation:

```
applyMigration(
    previousGraph: CanonicalGraph,
    migrationDefinition: MigrationPlan
): CanonicalGraph
```

The output **MUST** be a new Canonical Graph instance.

---

## 3. Migration Preconditions

Before execution, the engine **MUST** verify:
1. Version bump is valid
2. Migration version matches declared version transition
3. Migration plan is complete
4. Migration operations are structurally valid

If any precondition fails → execution **MUST** abort.

---

## 4. Migration Plan Model

A MigrationPlan **MUST** include:

```
MigrationPlan {
    fromVersion: SemVer
    toVersion: SemVer
    operations: OrderedCollection<MigrationOperation>
}
```

Operations **MUST** be executed in declared order.

---

## 5. Migration Operation Types

Supported operation types **MUST** be explicitly enumerated:
- ADD_NODE
- REMOVE_NODE
- MODIFY_ATTRIBUTE
- RENAME_NODE
- TRANSFORM_VALUE
- ADD_EDGE
- REMOVE_EDGE

The allowed set **MUST** be stable and versioned.

---

## 6. MigrationOperation Schema

```
MigrationOperation {
    type: OperationType
    targetPath: CanonicalPath
    parameters: object
}
```

Each operation type **MUST** define required parameters.

Example:

```json
{
  "type": "MODIFY_ATTRIBUTE",
  "targetPath": "/processes/order/states/approved",
  "parameters": {
    "attribute": "label",
    "newValue": "Approved Order"
  }
}
```

---

## 7. Execution Phases

Migration execution **MUST** occur in ordered phases:
1. Structural removals
2. Structural additions
3. Attribute modifications
4. Value transformations
5. Edge updates

This ordering ensures deterministic and conflict-free application.

---

## 8. Determinism Requirements

The Migration Engine **MUST**:
- Execute operations in deterministic order
- Reject ambiguous operations
- Produce identical output for identical input and plan
- Guarantee stable canonicalization after execution

---

## 9. Safety Guarantees

The engine **MUST** enforce:
- Target path existence before modification
- No duplicate node creation
- No orphan references
- No illegal structural states
- No partial commit (all-or-nothing behavior)

If any operation fails → entire migration **MUST** rollback.

---

## 10. Atomicity

Migration **MUST** be atomic.

Implementation **MAY**:
- Build intermediate mutable graph
- Apply operations
- Validate final graph
- Freeze into new Canonical Graph

If validation fails → discard result.

---

## 11. Integration with Validation Engine

After applying migration:
- The resulting graph **MUST** be canonicalized
- The Validation Engine **MUST** run
- Any validation error **MUST** invalidate migration

Migration success requires post-validation success.

---

## 12. Compatibility with Diff Engine

Migration **MUST** be consistent with ChangeSet:
- All breaking changes **MUST** be addressed by migration operations
- No migration operation may contradict ChangeSet classification

If ChangeSet indicates breaking change but no migration addresses it → invalid.

---

## 13. Idempotency

Migration execution **MUST NOT** be assumed idempotent.

However, the engine **MUST** detect:
- Reapplication of same migration
- Version mismatch

Reapplying a completed migration **MUST** fail.

---

## 14. Version Transition Enforcement

MigrationPlan.fromVersion **MUST** equal previous version.
MigrationPlan.toVersion **MUST** equal current version.

Mismatch **MUST** invalidate execution.

---

## 15. Performance Expectations

Migration execution **SHOULD** operate in:

**O(O + N)**

Where:
- O = number of operations
- N = number of nodes

Lookup **MUST** use canonical path indexing.

---

## 16. Conflict Detection

The engine **MUST** detect:
- Multiple operations targeting same node illegally
- Removal of node later modified
- Rename conflicts
- Edge creation pointing to non-existent nodes

Conflict detection **MUST** be deterministic.

---

## 17. Logging and Audit

The engine **MAY** produce an execution log:

```
MigrationExecutionLog {
    operationsExecuted: number
    durationMs: number
    warnings: string[]
}
```

Logging **MUST NOT** alter behavior.

---

## 18. Error Handling

Migration errors **MUST** include:
- Operation index
- Target path
- Error code
- Message

Errors **MUST** be deterministic.

---

## 19. Non-Goals

The Migration Engine does **NOT**:
- Auto-generate migration plans
- Infer missing transformations
- Relax validation rules
- Partially apply operations

---

## 20. Compliance Criteria

An implementation is compliant if:
- It enforces version transition consistency
- It applies operations atomically
- It guarantees determinism
- It validates post-migration graph
- It rejects inconsistent plans

---

## 21. Summary

The Migration Engine:
- Applies declared transformations
- Guarantees atomic execution
- Enforces structural safety
- Integrates with validation and versioning
- Produces a new canonical graph
