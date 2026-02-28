# BUILDER INSTRUCTIONS: Differentiation Specification Rewrite (v1)

**Status:** Ready for Implementation  
**Context:** Transform the Differentiation page from a conceptual overview into a normative technical specification for the RIGOR Diff Engine.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/DOCS_CHANGES_DIFFERENTATION.md`

---

## 🎯 Objectives
1.  **Full Rewrite**: Replace the current `differentiation.md` (EN and ES) with the technical specification of the `rigor diff` command.
2.  **Graph-Based Comparison**: Define how the protocol compares two specifications using the normalized Graph Model.
3.  **Classification Rules**: Document the normative rules for `breaking` vs `non-breaking` changes.
4.  **CLI Grammar Integration**: Add the formal EBNF for the `diff` command.
5.  **Output Schema**: Define the normative JSON result format for machine readability.

---

## 🛠️ Step 1: Update `apps/docs/specification/differentiation.md`

Replace the entire content with the following:

```markdown
# Differentiation (v0.1)

Differentiation is the normative process of comparing two RIGOR specifications to identify structural changes and classify them as breaking or non-breaking. Unlike raw text diffs, RIGOR differentiation operates on the normalized **Graph Model**.

## 1. Scope

The Differentiation Engine MUST:
* Compare two valid RIGOR specifications.
* Ignore non-semantic changes (formatting, comments, whitespace, field ordering).
* Classify differences based on protocol invariants.
* Produce deterministic structured output.

## 2. CLI Syntax (Normative)

The `diff` command is an extension of the formal CLI grammar.

```ebnf
diff_command    ::= "rigor" SP "diff" SP path SP path diff_opts?
diff_opts       ::= (SP diff_opt)*
diff_opt        ::= "--format=" format_type
                  | "--breaking-only"
                  | "--summary-only"
```

## 3. Execution Contract

Before performing a differentiation, the engine MUST satisfy these preconditions:
1. Parse and validate both specifications independently.
2. Normalize both into the **Graph Model**.
3. If either specification fails validation (exit code != 0), the diff process must abort with exit code `3`.

## 4. Classification Rules (Normative)

Differences are classified deterministically based on their impact on system evolution.

### 4.1 State Changes
| Change | Classification |
| :--- | :--- |
| State added | non-breaking |
| State removed | **breaking** |
| State renamed | **breaking** |
| Initial state changed | **breaking** |

### 4.2 Transition Changes
| Change | Classification |
| :--- | :--- |
| Transition added | non-breaking |
| Transition removed | **breaking** |
| Transition target changed | **breaking** |
| Guard condition added | **breaking** |
| Guard condition removed | non-breaking |

### 4.3 Context Schema Changes
| Change | Classification |
| :--- | :--- |
| Optional field added | non-breaking |
| Required field added | **breaking** |
| Field removed | **breaking** |
| Field type changed | **breaking** |
| Default value changed | non-breaking |

### 4.4 Identity Changes
| Change | Classification |
| :--- | :--- |
| Identity name changed | **breaking** |
| Spec version increased | non-breaking |

---

## 5. Output Schema (`--format=json`)

When requested, the output MUST conform to the following schema:

```json
{
  "specA": "v0.1.0",
  "specB": "v0.2.0",
  "differences": [
    {
      "type": "breaking | non-breaking",
      "category": "state | transition | context | identity",
      "location": "process.states.active",
      "description": "State removed from process",
      "oldValue": { "id": "active" },
      "newValue": null
    }
  ],
  "summary": {
    "breakingCount": 1,
    "nonBreakingCount": 0
  }
}
```

---

## 6. Exit Codes (Normative)

| Code | Meaning | Description |
| :--- | :--- | :--- |
| `0` | No differences | The specifications are semantically identical. |
| `1` | Non-breaking only | Semantic changes detected, but backward compatibility is preserved. |
| `2` | Breaking found | One or more breaking changes detected. |
| `3` | Validation error | One or both specifications are invalid. |
| `4` | CLI misuse | Invalid syntax or missing arguments. |

## 7. Algorithm Overview

1. **parse(A, B)** -> ASTs
2. **validate(AST_A, AST_B)** -> Ensure both are compliant.
3. **normalize(AST_A, AST_B)** -> GMV v0.1 Graphs.
4. **compare(Graph_A, Graph_B)** -> Identity-based node/edge comparison.
5. **classify(diffs)** -> Apply rules from Section 4.
6. **emit(result)** -> Return structured data and exit code.
```

---

## 🧱 Step 2: Update `apps/docs/es/specification/differentiation.md`

Replace with the Spanish translation.

*(Builder: Ensure terms like "Breaking" and "Non-breaking" are translated consistently as "Rompedor" and "No rompedor" or "Compatible", but "Breaking" is often kept or paired with "Cambio de ruptura" in technical Spanish. Use "Diferenciación Semántica" and "Modelo de Grafo".)*

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:docs`.
- [ ] The page correctly references the "Graph Model" and "Validation Matrix".
- [ ] Tables in Section 4 are rendered correctly in both languages.
- [ ] Exit codes match the normative contract (0, 1, 2, 3, 4).
- [ ] Sidebar link "Differentiation / Diferenciación" remains functional.
