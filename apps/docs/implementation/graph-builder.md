# Canonical Graph Builder (v0.1)

The Canonical Graph Builder is the core structural engine of RIGOR. It transforms the Intermediate Representation (IR) into a deterministic, immutable, and fully resolved directed graph that serves as the single source of truth for all subsequent operations.

## 1. Purpose

The primary goal of this module is to decouple the hierarchical nature of YAML/IR from the relational nature of the protocol. By constructing a **Canonical Graph**, RIGOR ensures that:
- References are resolved into direct edges.
- Identities are unique and globally addressable.
- The system operates on a stable model independent of source file ordering.

## 2. Core Principles

A compliant Canonical Graph **MUST** be:
1. **Deterministic**: Identical IR inputs **MUST** produce identical graph structures.
2. **Immutable**: Once finalized (Phase 5), the graph instance **MUST NOT** be modified.
3. **Identity-Consistent**: Every node **MUST** have a unique identifier and a stable canonical path.
4. **Fully Resolved**: No dangling references are permitted in a valid graph.

## 3. Conceptual Model

### 3.1 Nodes
A Node represents a semantic entity (Process, State, Event, etc.). It contains:
- **Node ID**: A stable internal identifier.
- **Type**: Strongly typed (e.g., `NodeType.STATE`).
- **Attributes**: A map of typed primitive values.
- **Canonical Path**: A human-readable unique address (e.g., `/processes/Order/states/PENDING`).

### 3.2 Edges
An Edge represents a directed relationship between two nodes.
- **Source/Target**: IDs of the connected nodes.
- **Type**: Defines the nature of the link (e.g., `DEFINES`, `TRANSITIONS_TO`, `REFERENCES`).

## 4. Graph Construction Phases

The Builder **MUST** execute the following phases in sequence:

### Phase 1: Root Initialization
Create the root node and initialize global registries for identity and path resolution.

### Phase 2: Structural Node Creation
Iterate through the IR to create nodes for all top-level sections and nested structures. At this stage, nodes are instantiated, but edges may not yet exist.

### Phase 3: Identity Registration
Register all identity-bearing nodes (Entities, Processes, States, Events). If a duplicate identifier is detected within the same scope, the Builder **MUST** raise a fatal error and stop construction.

### Phase 4: Reference Resolution
Transform identifier strings into directed edges between nodes. The Builder **MUST** detect circular references and validate that all targets exist.

### Phase 5: Finalization & Freeze
Finalize canonical paths, apply deterministic lexicographical ordering to all collections, and mark the graph as immutable.

## 5. Deterministic Ordering

The Builder **MUST** ensure that the iteration order of nodes, edges, and attributes is stable. Ordering **MUST** be independent of the YAML source order and should default to lexicographical sorting by identifier or canonical path.

## 6. Error Handling

Errors during construction (e.g., duplicate IDs, unresolved references) **MUST**:
- Include the **Canonical Path** where the error occurred.
- Use stable error codes (e.g., `ERR_GRAPH_DUPLICATE_ID`).
- Prevent the graph from being marked as "Finalized".

## 7. Traversal and Access

The Graph **MUST** support:
- Lookup by Node ID and Canonical Path.
- Deterministic Depth-First Search (DFS) and Breadth-First Search (BFS).
- Safe iteration over all nodes of a specific type.

## 8. Compliance Criteria

An implementation is RIGOR-compliant if:
- It produces identical graphs for semantically equivalent specs.
- It enforces strict identity uniqueness.
- It guarantees graph immutability after construction.
- It correctly resolves all internal references.

---
*Note: The Canonical Graph is the mandatory input for the Validation, Diff, and Migration engines.*
