# BUILDER INSTRUCTIONS: Canonical Graph Builder Specification (v1)

**Status:** Ready for Implementation  
**Context:** Replace the Graph Builder skeleton with the formal normative specification. This module transforms the Intermediate Representation (IR) into the single source of truth: the immutable Canonical Graph.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/IMPLEMENTATION/4-CANONICAL-GRAPH-BUILDER.md`

---

## 🎯 Objectives
1.  **Full Rewrite**: Replace current `graph-builder.md` (EN and ES) with the formal specification.
2.  **Define Core Principles**: Codify Determinism, Immutability, Identity-consistency, and Order-independence.
3.  **Document Construction Phases**: Detail the 5 phases: Root Construction, Structural Node Creation, Identity Registration, Reference Resolution, and Canonical Path Finalization.
4.  **Formalize Graph Model**: Define the structure of Nodes, Edges, and Canonical Paths.
5.  **Multilingual Synchronization**: Ensure English and Spanish versions are technically identical.

---

## 🧱 Step 1: Update `apps/docs/implementation/graph-builder.md`

Replace the content with the normative structure:

### 1. Purpose & Principles
Define the module's role as the transformer of IR into the single structural source of truth. List the 5 core principles (Deterministic, Immutable, Identity-consistent, Resolved, Order-independent).

### 2. Conceptual Model
- **Node**: ID, Type, Attributes, Edges, Canonical Path.
- **Edge**: Source, Target, Type, Metadata.
- **Canonical Path**: Unique, deterministic position string (e.g., `/processes/order/states/approved`).

### 3. Graph Construction Phases (1 to 5)
Detailed breakdown of the construction pipeline from root node initialization to the final "freeze" of the graph.

### 4. Identity & Ordering Rules
- Strict uniqueness requirements.
- Mandatory lexicographical ordering to ensure determinism regardless of YAML source order.

### 5. Error Handling & Integrity
- Handling of structural, identity, and reference errors.
- Requirements for circular reference detection.
- Final integrity guarantees (No broken references, no orphans).

### 6. Technical Requirements
- Traversal support (DFS, BFS, Lookup by Path/ID).
- Performance expectations (O(N+E)).
- Security (Protection against deep nesting/recursion).

### 7. Integration & Compliance
- List the next stages (Validation, Diff, etc.) that consume the graph.
- Define compliance criteria for implementations.

---

## 🧱 Step 2: Update `apps/docs/es/implementation/graph-builder.md`

Apply the same structural updates and translations to the Spanish version. Use terms like "Grafo Canónico", "Rutas Canónicas", "Resolución de Referencias" and "Inmutabilidad".

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:docs`.
- [ ] All 20 sections from the proposal are represented.
- [ ] The "Immutability Guarantee" is clearly stated.
- [ ] The 5 phases of construction are documented.
- [ ] Sidebar links remain functional.
