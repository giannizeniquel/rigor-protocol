Formalizamos **Differentiation v0.1** como:

> ✅ **Semantics-aware, RIGOR-specific diff**
> ❌ No structural raw diff
> ❌ No metadata-only comparison
> ✔ Graph-model based comparison
> ✔ Classification tied to Validation Matrix

A continuación tienes el documento completo para el arquitecto.

---

# RIGOR Specification Update Proposal

## Differentiation — Formalization v0.1

**Target:** `/specification/differentiation.html`
**Scope:** Normative specification upgrade

---

# 1. Objective

Transform the current Differentiation page from descriptive documentation into a **normative, protocol-level specification** aligned with:

* CLI Grammar v0.1
* Graph Model formalization
* Validation Matrix
* Protocol Model invariants

---

# 2. Scope of Differentiation v0.1

Differentiation MUST:

* Compare two valid RIGOR specifications
* Operate on the **normalized Graph Model**
* Classify differences as:

  * `breaking`
  * `non-breaking`
* Produce deterministic structured output
* Provide deterministic exit codes

Differentiation MUST NOT:

* Compare comments
* Compare formatting
* Compare ordering differences (after normalization)
* Compare external metadata outside the protocol model

---

# 3. CLI Grammar Extension (Normative)

Extend CLI Grammar v0.1 with:

```
rigor diff <specA> <specB> [--format=json|text] [--breaking-only] [--summary-only]
```

### Formal EBNF Addition

```
<diff-command> ::= "rigor" "diff" <file> <file> <diff-options>?

<diff-options> ::= <diff-option>*

<diff-option> ::= "--format=" <format>
                | "--breaking-only"
                | "--summary-only"

<format> ::= "json" | "text"
```

---

# 4. Execution Contract

## 4.1 Preconditions

Before diffing:

1. Parse specA
2. Parse specB
3. Validate both specs independently
4. Normalize both into Graph Model
5. Abort if validation fails

---

# 5. Graph-Level Comparison Strategy

Comparison MUST operate on:

* Nodes
* Edges (transitions)
* Context schema
* Identity block
* Version block
* Invariants

Comparison MUST ignore:

* Source ordering
* Formatting
* Comments
* Whitespace

---

# 6. Difference Categories

Each difference MUST include:

* `type`
* `category`
* `location`
* `oldValue`
* `newValue`
* `description`

---

# 7. Classification Rules (Normative)

These rules are deterministic and MUST be applied in order.

## 7.1 State Changes

| Change                | Classification |
| --------------------- | -------------- |
| State added           | non-breaking   |
| State removed         | breaking       |
| State renamed         | breaking       |
| Initial state changed | breaking       |

---

## 7.2 Transition Changes

| Change                    | Classification |
| ------------------------- | -------------- |
| Transition added          | non-breaking   |
| Transition removed        | breaking       |
| Transition target changed | breaking       |
| Guard condition added     | breaking       |
| Guard condition removed   | non-breaking   |

---

## 7.3 Context Schema Changes

| Change                | Classification |
| --------------------- | -------------- |
| Optional field added  | non-breaking   |
| Required field added  | breaking       |
| Field removed         | breaking       |
| Field type changed    | breaking       |
| Default value changed | non-breaking   |

---

## 7.4 Identity Changes

| Change                    | Classification  |
| ------------------------- | --------------- |
| Version increased (minor) | non-breaking    |
| Version increased (major) | depends on diff |
| Identity name changed     | breaking        |

---

# 8. Diff Result Schema (Normative)

If `--format=json` is used, output MUST conform to:

```json
{
  "specA": "string",
  "specB": "string",
  "differences": [
    {
      "type": "breaking | non-breaking",
      "category": "state | transition | context | identity",
      "location": "string",
      "description": "string",
      "oldValue": "any",
      "newValue": "any"
    }
  ],
  "summary": {
    "breakingCount": 0,
    "nonBreakingCount": 0
  }
}
```

This schema MUST be added to documentation.

---

# 9. Exit Codes (Normative)

| Code | Meaning                       |
| ---- | ----------------------------- |
| 0    | No differences                |
| 1    | Only non-breaking differences |
| 2    | Breaking differences found    |
| 3    | Validation error              |
| 4    | CLI misuse                    |

These MUST be documented explicitly.

---

# 10. Diff Algorithm (Normative Pseudocode)

```
function diff(specA, specB):

    astA = parse(specA)
    astB = parse(specB)

    validate(astA)
    validate(astB)

    graphA = normalize(astA)
    graphB = normalize(astB)

    differences = compare(graphA, graphB)

    classified = classify(differences)

    return structured_result(classified)
```

---

# 11. Integration Points

Differentiation depends on:

* Graph Model formalization
* Validation Matrix
* CLI Grammar v0.1

These references MUST be cross-linked in the page.

---

# 12. Required Page Structure (Final Layout)

The updated page should contain:

1. Overview
2. Scope of Differentiation
3. CLI Syntax (Normative)
4. Execution Contract
5. Graph Comparison Model
6. Classification Rules
7. Output Schema
8. Exit Codes
9. Algorithm
10. Examples (JSON + text)

---

# 13. Examples to Include

### Example 1 — Non-breaking

Add state only → exit code 1

### Example 2 — Breaking

Remove transition → exit code 2

### Example 3 — No diff

Identical graphs → exit code 0

---

# 14. Architectural Decision

Diff is:

* Semantic
* Deterministic
* Graph-based
* Validation-aware

This closes the structural foundation of:

* Identity
* Protocol Model
* Graph Model
* CLI
* Validation Matrix
* Differentiation

At this point, the specification core becomes internally consistent.

---