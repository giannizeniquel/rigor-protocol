# BUILDER INSTRUCTIONS: Graph Model Specification (v1)

**Status:** Ready for Implementation  
**Context:** Formalize the internal graph representation used for validation and analysis. This bridges the Identity Core and the Validation Matrix.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/DOCS_CHANGES_GRAPH-MODEL.md`

---

## 🎯 Objectives
1.  **New Specification Page**: Create `graph-model.md` (EN and ES) in `apps/docs/specification/`.
2.  **Sidebar Integration**: Add "Graph Model" to the `Protocol Specification` section in `config.ts`.
3.  **Formal Definitions**: Document the Node and Edge types, Cycle policies, and the Error Localization Model.
4.  **Multilingual Synchronization**: Ensure consistency between English and Spanish versions.

---

## 🧱 Step 1: Create `apps/docs/specification/graph-model.md`

Use the following content for the English version:

```markdown
# Graph Model for Validation (v0.1)

The RIGOR Graph Model (GMV) defines the formal internal representation of specifications during validation. It enables deterministic analysis, reference resolution, and structural enforcement.

## 1. Formal Definition

A RIGOR Graph is defined as a directed, typed graph:  
`G = (N, E, Tn, Te, C)`

Where:
- **N**: Set of Nodes (semantic entities).
- **E**: Set of Edges (typed relationships).
- **Tn**: Node Types.
- **Te**: Edge Types.
- **C**: Constraint Set.

## 2. Node Model

Each node is an immutable entity with a globally unique ID.

### 2.1 Node Types
| Type | Description |
| :--- | :--- |
| **Artifact** | Root specification file. |
| **Module** | Logical grouping of entities. |
| **Entity** | Business-level domain entity. |
| **Field** | Attribute or property of an Entity. |
| **Rule** | Business-level constraint definition. |
| **Constraint** | Formal protocol validation rule. |
| **Relationship** | Explicit association between nodes. |
| **Environment** | Context and execution boundary definition. |

## 3. Edge Model

Edges represent directed, non-ambiguous relationships between nodes.

### 3.1 Edge Types
| Type | Meaning |
| :--- | :--- |
| **DEFINES** | Artifact declares a Node. |
| **BELONGS_TO** | Node is part of a Module. |
| **HAS_FIELD** | Entity contains a Field. |
| **REFERENCES** | A node points to another (Cross-reference). |
| **DEPENDS_ON** | Dependency between Modules or Entities. |
| **VALIDATES** | Rule targets an Entity or Field. |
| **CONSTRAINS** | Protocol Constraint applies to a Node. |

## 4. Cycle and Connectivity Policies

To ensure deterministic execution, the following policies are enforced:

| Edge Type | Cycles Allowed? | Note |
| :--- | :--- | :--- |
| **DEPENDS_ON** | **No** | Must form a Directed Acyclic Graph (DAG). |
| **VALIDATES** | **No** | Validation logic must not be circular. |
| **REFERENCES** | **Yes** | Allows for recursive data structures. |

## 5. Construction Pipeline

The Graph is built in a deterministic sequence:
1. **Parse**: Ingest source artifacts.
2. **Normalize**: Standardize structure and casing.
3. **Resolve Identity**: Map all IDs to the global namespace.
4. **Build Graph**: Instantiate nodes and edges.
5. **Freeze**: Make the graph immutable before validation.

## 6. Error Localization

Every validation error is mapped to the graph structure:
```json
{
  "code": "E_UNREACHABLE_STATE",
  "nodeID": "core.process.state_archived",
  "path": "root -> process -> state_archived",
  "message": "State is defined but unreachable from initial_state."
}
```

## 7. CLI Interaction

The CLI provides tools to inspect the internal graph:
- `rigor graph`: Emits the full graph in JSON format.
- `rigor graph --subgraph=<id>`: Extracts a scoped subgraph for isolated analysis.
```

---

## 🧱 Step 2: Create `apps/docs/es/specification/graph-model.md`

Translate the content to Spanish.

*(Builder: Use technical terms: "Modelo de Grafo", "Aristas", "Nodos", "Inmutabilidad", etc. Ensure Rule is "Regla" and Constraint is "Restricción" or keep "Constraint" if used as a keyword).*

---

## 🛠️ Step 3: Update `apps/docs/.vitepress/config.ts`

Add the "Graph Model" entry to the `sidebar` in both languages.

**English:**
```typescript
{ text: 'CLI', link: '/specification/cli' },
{ text: 'Validation Matrix', link: '/specification/validation-matrix' },
{ text: 'Graph Model', link: '/specification/graph-model' }, // Add this
{ text: 'Differentiation', link: '/specification/differentiation' }
```

**Spanish:**
```typescript
{ text: 'CLI', link: '/es/specification/cli' },
{ text: 'Matriz de Validación', link: '/es/specification/validation-matrix' },
{ text: 'Modelo de Grafo', link: '/es/specification/graph-model' }, // Add this
{ text: 'Diferenciación', link: '/es/specification/differentiation' }
```

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:docs`.
- [ ] `graph-model.md` exists in both languages.
- [ ] Sidebar links are functional.
- [ ] Cross-references to "Identity Core" and "Validation Matrix" are planned for future content.
