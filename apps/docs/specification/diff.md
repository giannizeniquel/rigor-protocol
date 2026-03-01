# Diff Specification (v0.1)

This document defines the normative specification for computing and classifying differences between two RIGOR specifications. It establishes the rules for semantic structural comparison, breaking change detection, and versioning enforcement.

## 1. Scope

The Diff process **MUST**:
- Operate on the Canonical Graph Representation.
- Be deterministic and order-independent.
- Produce a structured ChangeSet.
- Classify changes as **Breaking** or **NonBreaking**.

Diff is defined as the formal function:
`Diff(Graph_A, Graph_B) → ChangeSet`

This specification does not define textual comparison. It defines semantic structural comparison.

## 2. Canonical Comparison Model

Before diffing, both specifications **MUST** be:
1. Validated against the [Validation Matrix](./validation-matrix).
2. Normalized and Canonicalized according to the [Graph Model](./graph-model).

If either specification fails validation, the Diff process **MUST** abort. Canonicalization **MUST** remove textual ordering variance, formatting variance, and non-semantic metadata.

## 3. Change Detection

The Diff engine **MUST** detect structural and semantic changes, represented as atomic operations.

### 3.1 Structural Change Types
- **NodeAdded** / **NodeRemoved** / **NodeRenamed**
- **EdgeAdded** / **EdgeRemoved**

### 3.2 Property Change Types
- **PropertyAdded** / **PropertyRemoved**
- **PropertyModified** / **TypeChanged**

### 3.3 Constraint Change Types
- **ConstraintStrengthened** / **ConstraintWeakened**
- **CardinalityChanged**

## 4. Breaking Change Classification

### 4.1 Formal Definition
A change is **Breaking** if and only if there exists at least one instance $I$ such that `Validate(I, Spec_A) = valid` AND `Validate(I, Spec_B) = invalid`.

### 4.2 Deterministic Rule Engine
Classification **MUST** follow these normative rules in fixed order:

#### Node-Level Rules (N)
- **N1 (NodeRemoved)**: **Breaking**.
- **N2 (NodeAdded)**: **NonBreaking** if optional; **Breaking** if required.
- **N3 (NodeRenamed)**: **Breaking** unless an explicit mapping exists (outside v0.1 scope).

#### Property-Level Rules (P)
- **P1 (PropertyRemoved)**: **Breaking**.
- **P2 (PropertyAdded)**: **NonBreaking** if optional; **Breaking** if required.
- **P3 (TypeChanged)**: **Breaking**.

#### Constraint Rules (C)
- **C1 (ConstraintStrengthened)**: **Breaking**. (e.g., `minLength` increased).
- **C2 (ConstraintWeakened)**: **NonBreaking**. (e.g., `maxValue` increased).

#### Cardinality Rules (K)
- **K1 (Cardinality Relaxed)**: **NonBreaking**. (e.g., `1` → `0..1`).
- **K2 (Cardinality Restricted)**: **Breaking**. (e.g., `0..*` → `1..*`).

#### Edge-Level Rules (E)
- **E1 (EdgeRemoved)**: **Breaking**.
- **E2 (EdgeAdded)**: **Breaking** if it introduces a required relationship.

## 5. Versioning Consistency Validation

After classification, the engine **MUST** validate semantic version consistency:
1. **Major Rule**: If `BreakingChanges > 0` AND `MAJOR_B ≤ MAJOR_A` → **VersioningError**.
2. **Minor Rule**: If `BreakingChanges = 0` AND `MINOR_B < MINOR_A` → **VersioningError**.

## 6. Standard ChangeSet Schema

The output **MUST** conform to the following JSON structure:

```json
{
  "from": "1.0.0",
  "to": "1.1.0",
  "changes": [
    {
      "id": "chg-001",
      "type": "PropertyAdded",
      "path": "/process/context/email",
      "breaking": false,
      "before": null,
      "after": { "type": "string" }
    }
  ],
  "summary": {
    "total": 1,
    "breaking": 0,
    "nonBreaking": 1
  },
  "breaking": false
}
```

## 7. CLI Integration

The `rigor diff` command serves as the normative interface.

```bash
rigor diff <specA.yaml> <specB.yaml> [options]
```

### Command Grammar (EBNF)
```ebnf
diff_command    ::= "rigor" SP "diff" SP path SP path diff_opts?
diff_opts       ::= (SP diff_opt)*
diff_opt        ::= "--format=" format_type | "--breaking-only" | "--summary-only"
format_type     ::= "json" | "yaml" | "text"
```

### Exit Codes (Normative)
| Code | Meaning | Description |
| :--- | :--- | :--- |
| `0` | No differences | The specifications are semantically identical. |
| `1` | Non-breaking | Changes detected, backward compatibility preserved. |
| `2` | Breaking | One or more breaking changes detected. |
| `3` | Error | Validation failed or versioning rules violated. |

## 8. Algorithm Overview

1. **parse(A, B)** → Parse inputs into ASTs.
2. **validate(AST_A, AST_B)** → Ensure protocol compliance.
3. **normalize(AST_A, AST_B)** → Transform to [Graph Model](./graph-model).
4. **compare(Graph_A, Graph_B)** → Semantic equivalence check and change detection.
5. **classify(changes)** → Apply deterministic rule engine (N, P, C, K, E).
6. **verify(summary)** → Check versioning consistency.
7. **emit(result)** → Return ChangeSet and exit code.

## 9. Determinism & Security
- **MUST** produce identical results for identical inputs.
- **MUST** operate offline without external network or code execution.
- **MUST NOT** modify input specifications.

## 10. Cross-References
* See [Versioning](./versioning)
* See [Validation Matrix](./validation-matrix)
* See [Graph Model](./graph-model)
* See [Migrations](./migrations)
