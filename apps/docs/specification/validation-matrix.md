# Validation Matrix (v0.1)

The RIGOR Validation Matrix defines the normative rules that a specification must satisfy to be considered protocol-compliant. It transforms validation from an implementation detail into a core pillar of the standard.

## 1. Validation Levels

RIGOR defines two distinct operational modes for the validator:

### 1.1 Standard Mode (`rigor validate`)
Focuses on **structural correctness** and referential integrity. It ensures the specification is technically usable by an engine but does not guarantee all protocol invariants.

### 1.2 Strict Mode (`rigor validate --strict`)
Certifies **formal protocol compliance**. It enforces all semantic rules, protocol invariants, and evolution safety requirements.

---

## 2. Conformance Definition

* **Structurally Valid**: A specification that returns exit code `0` in Standard Mode.
* **Protocol-Compliant**: A specification that returns exit code `0` in Strict Mode.

Only Strict Mode provides the formal guarantee that a system adheres to the RIGOR standard.

---

## 3. The Matrix

Rules are categorized as:
* **S1**: Structural
* **S2**: Referential
* **S3**: Semantic
* **S4**: Protocol Invariants
* **S5**: Evolution & Versioning
* **S6**: Best Practices

| ID | Category | Rule | Standard | Strict |
| :--- | :--- | :--- | :--- | :--- |
| **V1** | S1 | Valid YAML syntax | ERROR | ERROR |
| **V2** | S1 | Required root fields present | ERROR | ERROR |
| **V3** | S1 | Field types match schema | ERROR | ERROR |
| **V4** | S1 | No unknown root-level fields | ERROR | ERROR |
| **V5** | S2 | `initial_state` exists | ERROR | ERROR |
| **V6** | S2 | Transition `target` exists | ERROR | ERROR |
| **V7** | S2 | Referenced event declared | ERROR | ERROR |
| **V8** | S2 | `event_id` unique | ERROR | ERROR |
| **V9** | S2 | `state_id` unique | ERROR | ERROR |
| **V10** | S3 | Terminal state has no outgoing transitions | ERROR | ERROR |
| **V11** | S3 | No duplicate transitions (state, event) | ERROR | ERROR |
| **V12** | S3 | Guards syntactically valid | ERROR | ERROR |
| **V13** | S3 | Guards reference only allowed scope (`context`, `payload`) | WARNING | ERROR |
| **V14** | S4 | No unreachable states | WARNING | ERROR |
| **V15** | S4 | At least one terminal state exists | ERROR | ERROR |
| **V16** | S4 | At least one terminating path exists from initial | WARNING | ERROR |
| **V17** | S4 | No infinite cycles without an exit path | WARNING | ERROR |
| **V18** | S5 | `rigor_spec_version` supported | ERROR | ERROR |
| **V19** | S5 | `spec_version` valid SemVer | ERROR | ERROR |
| **V20** | S5 | No deprecated fields used | WARNING | ERROR |
| **V21** | S6 | Canonical section ordering | WARNING | WARNING |
| **V22** | S6 | Naming conventions respected (snake_case) | WARNING | WARNING |

---

## 4. Severity and Escalation

### 4.1 ERROR
- The specification is **invalid**.
- Exit code must be `1`.
- Artifact generation is prohibited.

### 4.2 WARNING
- In **Standard Mode**: Information only; spec remains valid.
- In **Strict Mode**: Rules in categories S3, S4, and S5 escalate to **ERROR**. S6 rules remain as warnings.

---

## 5. Algorithmic Expectations

Compliant validators MUST implement the following logic:
- **Reachability (V14)**: Graph traversal from `initial_state` to identify orphaned nodes.
- **Cycle Detection (V17)**: Identification of strongly connected components without an exit transition.
- **Determinism**: The validation process must be pure, idempotent, and independent of external state.

---

## 6. Matrix Versioning
The Validation Matrix is versioned alongside the protocol core. This document describes **Matrix v0.1**, compatible with **RIGOR Core v0.1**.
