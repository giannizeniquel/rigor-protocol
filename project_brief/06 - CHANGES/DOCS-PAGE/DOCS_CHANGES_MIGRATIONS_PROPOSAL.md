# RIGOR — Migrations Specification v0.1

Status: Normative
Scope: Specification Layer
Depends on: Versioning, Graph Model, Validation Matrix

---

# 1. Purpose

This document defines the formal migration model used to evolve a RIGOR specification across versions in a deterministic and verifiable manner.

A Migration:

* MUST be declarative
* MUST be deterministic
* MUST be statically validatable
* MUST preserve graph consistency
* MUST comply with semantic versioning constraints

---

# 2. Definition

A **Migration** is an ordered set of operations transforming a specification from version `Vₙ` to version `Vₙ₊₁`.

A Migration:

* MUST declare a single `from` version
* MUST declare a single `to` version
* MUST include one or more operations
* MUST result in a valid specification

---

# 3. Location in Specification

Migrations are declared at the root level.

```yaml
rigor_spec_version: "0.1"
spec_version: "1.1.0"

migrations:
  - from: "1.0.0"
    to: "1.1.0"
    operations:
      - add_state:
          name: "Escalated"
```

---

# 4. Version Constraints

## 4.1 Semantic Versioning

All versions MUST follow SemVer:

```
MAJOR.MINOR.PATCH
```

## 4.2 Sequentiality

* `from` MUST be strictly lower than `to`
* `to` MUST equal the declared `spec_version`
* Only sequential migrations are allowed
* Skipping intermediate versions is NOT allowed

Invalid:

```
1.0.0 → 1.2.0   (without 1.1.0)
```

---

# 5. Migration Structure

Formal grammar (abstract form):

```
MIGRATIONS      ::= "migrations:" MIGRATION_LIST
MIGRATION_LIST  ::= "-" MIGRATION { "-" MIGRATION }
MIGRATION       ::= FROM TO OPERATIONS
FROM            ::= "from:" VERSION
TO              ::= "to:" VERSION
OPERATIONS      ::= "operations:" OPERATION_LIST
OPERATION_LIST  ::= "-" OPERATION { "-" OPERATION }
```

---

# 6. Operation Model

Operations are atomic transformations.

Each operation:

* MUST be deterministic
* MUST be idempotent within a single migration execution
* MUST not introduce non-determinism in the state graph

---

# 7. Allowed Operations (v0.1)

---

## 7.1 add_state

Adds a new state.

```yaml
- add_state:
    name: "Escalated"
```

Constraints:

* State MUST NOT already exist
* MUST NOT create unreachable mandatory flows
* MUST preserve graph validity

---

## 7.2 remove_state

Removes an existing state.

```yaml
- remove_state:
    name: "Deprecated"
```

Constraints:

* MUST NOT remove initial state
* MUST NOT remove state with active transitions
* MUST NOT break graph connectivity
* Allowed ONLY in MAJOR increments

---

## 7.3 rename_state

Renames an existing state.

```yaml
- rename_state:
    from: "Pending"
    to: "Awaiting"
```

Constraints:

* Target name MUST NOT already exist
* All transitions MUST be updated
* Graph MUST remain deterministic

---

## 7.4 add_event

Adds a new event.

```yaml
- add_event:
    name: "ESCALATE"
```

Allowed in MINOR and MAJOR increments.

---

## 7.5 remove_event

Removes an event.

Allowed ONLY in MAJOR increments.

Event MUST NOT be referenced by transitions at removal time.

---

## 7.6 modify_transition

Modifies an existing transition.

```yaml
- modify_transition:
    from: "Open"
    event: "APPROVE"
    to: "Approved"
```

Constraints:

* MUST NOT introduce non-determinism
* MUST reference existing states and events
* MUST preserve graph invariants

---

## 7.7 modify_context_schema

Alters context structure.

Constraints:

* Backward-compatible changes allowed in MINOR
* Breaking changes require MAJOR

---

# 8. Graph Consistency Requirements

After applying all operations, the resulting specification MUST:

1. Contain at least one initial state
2. Contain no duplicate states
3. Contain no duplicate transitions
4. Be deterministic
5. Contain no orphan transitions
6. Maintain event consistency

Failure MUST result in validation error.

---

# 9. Migration Chain Model

Migrations form a directed acyclic chain:

```
V₁ → V₂ → V₃ → V₄
```

Constraints:

* No cycles
* No forks
* No multiple migrations targeting same version
* Only one path between versions

---

# 10. Validation Phases

Migration validation occurs in three phases.

---

## 10.1 Structural Validation

* Valid YAML structure
* Valid version format
* Operations non-empty
* Valid operation types

---

## 10.2 Semantic Validation

* Version increment type matches operation category
* Operation legality
* No conflicting operations

---

## 10.3 Graph Validation

* Apply operations
* Validate graph invariants
* Validate determinism
* Validate connectivity

---

# 11. Version Compatibility Matrix

| Version Change | Allowed Operations     |
| -------------- | ---------------------- |
| PATCH          | Metadata only          |
| MINOR          | Additive operations    |
| MAJOR          | Additive + destructive |

Destructive operations include:

* remove_state
* remove_event
* incompatible context changes

---

# 12. Determinism Guarantee

Applying a migration:

* MUST produce identical output for identical input
* MUST not depend on execution environment
* MUST apply operations in declared order

---

# 13. Error Codes

The following errors MUST be supported:

| Code                    | Meaning                      |
| ----------------------- | ---------------------------- |
| ER-MIG-INVALID-VERSION  | Invalid version format       |
| ER-MIG-NON-SEQUENTIAL   | Non-sequential migration     |
| ER-MIG-CYCLE            | Cycle detected               |
| ER-MIG-FORK             | Fork detected                |
| ER-MIG-INVALID-OP       | Invalid operation            |
| ER-MIG-GRAPH-BROKEN     | Graph invalid post-migration |
| ER-MIG-VERSION-MISMATCH | Version type mismatch        |

---

# 14. CLI Integration (Normative Expectation)

CLI implementations MUST support:

```
rigor migrate <file> --to <version>
```

Required behavior:

1. Resolve migration chain
2. Validate sequential integrity
3. Apply operations in order
4. Validate final graph
5. Emit updated specification

Options MAY include:

* `--dry-run`
* `--strict`
* `--output`

---

# 15. Migration Atomicity

A migration MUST be atomic:

* If any operation fails, the entire migration MUST fail.
* Partial application is forbidden.

---

# 16. Backward Compatibility

A migration:

* MUST clearly indicate compatibility type (MAJOR/MINOR/PATCH)
* MUST respect SemVer constraints
* MUST NOT silently introduce breaking changes in MINOR/PATCH

---

# 17. Security and Integrity Considerations

Migration definitions:

* MUST NOT execute arbitrary code
* MUST remain purely declarative
* MUST be statically analyzable

---

# 18. Example Complete Migration

```yaml
rigor_spec_version: "0.1"
spec_version: "2.0.0"

migrations:
  - from: "1.1.0"
    to: "2.0.0"
    operations:
      - rename_state:
          from: "Pending"
          to: "Awaiting"
      - remove_event:
          name: "DEPRECATED_EVENT"
      - modify_context_schema:
          field: "priority"
          type: "integer"
```

---

# 19. Compliance

A specification claiming compliance with RIGOR v0.1:

* MUST conform to this migration model
* MUST pass structural, semantic, and graph validation
* MUST produce deterministic transformation results

---

# End of Normative Specification — Migrations v0.1

---
