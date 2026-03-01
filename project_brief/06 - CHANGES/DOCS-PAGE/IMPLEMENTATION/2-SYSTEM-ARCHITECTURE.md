# RIGOR

# Implementation

## Architecture Overview (Normative – v0.1)

Status: Normative
Scope: Defines the global architecture, module boundaries, contracts, and data flow of a compliant RIGOR implementation.

This document formalizes the structural architecture of the RIGOR engine and the relationships between its internal modules.

---

# 1. Architectural Objectives

A compliant RIGOR implementation MUST:

1. Be fully deterministic
2. Isolate processing stages
3. Operate on a Canonical Graph
4. Support diff and evolution workflows
5. Be testable at module level
6. Maintain stable contracts between engines

The architecture MUST prevent cross-layer implicit dependencies.

---

# 2. High-Level System Architecture

The system is composed of independent engines organized in a layered pipeline.

```text
                    ┌──────────────────────┐
                    │     CLI Interface     │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │    Application API    │
                    └──────────┬───────────┘
                               │
 ┌─────────────────────────────────────────────────────────┐
 │                    Core Processing                      │
 │                                                         │
 │  Parser → Graph Builder → Canonicalization → Validation│
 │                                  │                      │
 │                                  ▼                      │
 │                    Diff → Versioning → Migration        │
 └─────────────────────────────────────────────────────────┘
```

Each module MUST expose explicit inputs and outputs.

---

# 3. Module Decomposition

The architecture consists of 13 logical modules.

---

## 3.1 Parser & Loader

### Responsibility

* Parse YAML
* Validate syntax
* Normalize basic structures
* Detect early structural violations

### Input

* Raw YAML text

### Output

* Parsed intermediate representation (IR)

### Constraints

* No semantic validation
* No graph construction
* No mutation of input data

---

## 3.2 Canonical Graph Builder

### Responsibility

* Transform IR into Canonical Graph
* Resolve references
* Enforce identity uniqueness
* Construct node and edge structures

### Input

* Parsed IR

### Output

* Canonical Graph

### Constraints

* Deterministic ordering
* Immutable node construction
* No validation side-effects

---

## 3.3 Canonicalization Engine

### Responsibility

* Normalize ordering
* Remove irrelevant noise
* Produce stable structure
* Compute structural hash (optional)

### Input

* Canonical Graph

### Output

* Canonical Graph (normalized)

### Guarantees

Two semantically equivalent specs MUST produce identical canonical representations.

---

## 3.4 Validation Engine

### Responsibility

* Structural validation
* Semantic validation
* Process validation
* Event validation
* Version validation

### Input

* Canonical Graph

### Output

* Validation Report

### Constraints

* Must not mutate graph
* Must accumulate errors deterministically
* Must not perform diff logic

---

## 3.5 Constraint Engine

### Responsibility

* Evaluate declared constraints
* Compose constraints
* Short-circuit when required
* Produce structured violations

### Input

* Canonical Graph
* Validation context

### Output

* Constraint violations

---

## 3.6 Diff Engine

### Responsibility

* Compare two Canonical Graphs
* Detect structural differences
* Generate ChangeSet
* Classify changes

### Input

* Old Canonical Graph
* New Canonical Graph

### Output

* Deterministic ChangeSet

### Guarantees

Identical inputs MUST produce identical ChangeSets.

---

## 3.7 Versioning Engine

### Responsibility

* Analyze ChangeSet
* Determine breaking changes
* Validate semantic version compliance
* Enforce bump rules

### Input

* ChangeSet
* Declared versions

### Output

* Version validation result

---

## 3.8 Migration Engine

### Responsibility

* Apply ChangeSet
* Transform Canonical Graph
* Validate result
* Ensure idempotence

### Input

* Canonical Graph
* ChangeSet

### Output

* New Canonical Graph

---

## 3.9 Event Resolution Engine

### Responsibility

* Validate event declarations
* Validate event payload types
* Link events to transitions
* Ensure cross-spec coherence

### Input

* Canonical Graph

### Output

* Event validation result

---

## 3.10 Error Model

### Responsibility

* Define error structure
* Guarantee stable error codes
* Provide serialization formats
* Maintain deterministic ordering

### Output

* Structured error objects

---

## 3.11 Application API

### Responsibility

* Expose programmatic interface
* Orchestrate engines
* Provide stable integration layer

This API MUST:

* Be stateless
* Accept explicit inputs
* Return structured outputs

---

## 3.12 CLI Interface

### Responsibility

* Parse CLI arguments
* Invoke Application API
* Format output
* Set exit codes

CLI MUST NOT:

* Contain business logic
* Implement validation rules
* Implement diff logic

---

## 3.13 Performance & Testing Layer

### Responsibility

* Enforce complexity limits
* Define performance benchmarks
* Provide regression testing hooks
* Validate determinism

---

# 4. Data Flow Contracts

Each engine MUST respect strict data contracts.

---

## 4.1 Canonical Graph Contract

The Canonical Graph MUST:

* Be immutable
* Have stable node IDs
* Provide canonical paths
* Expose deterministic iteration order

No engine may rely on YAML ordering.

---

## 4.2 ChangeSet Contract

ChangeSet MUST:

* Contain ordered atomic changes
* Classify each change
* Include canonical paths
* Be reproducible

---

## 4.3 Validation Report Contract

Validation Report MUST:

* Include ordered error list
* Include severity
* Include canonical path
* Include error code
* Be serializable to JSON

---

# 5. Engine Interaction Rules

Allowed interactions:

* Parser → Graph Builder
* Graph Builder → Canonicalization
* Canonicalization → Validation
* Validation → CLI
* Canonicalization → Diff
* Diff → Versioning
* Diff → Migration

Forbidden interactions:

* CLI directly mutating Graph
* Validation invoking Diff implicitly
* Migration modifying original Graph instance
* Diff reading raw YAML

---

# 6. Deterministic Ordering Requirements

The system MUST ensure deterministic ordering for:

* Entities
* Properties
* Processes
* States
* Transitions
* Events
* Errors
* ChangeSet entries

Ordering MUST be lexicographically stable unless otherwise defined.

---

# 7. Concurrency Model

Unless explicitly implemented:

* The engine SHOULD operate single-threaded.
* Parallelization MUST NOT break determinism.
* Shared mutable state is prohibited.

---

# 8. Extensibility Boundaries

Extensions MAY include:

* New validation rules
* New constraint types
* New artifact generators
* New CLI commands

Extensions MUST NOT:

* Alter Canonical Graph semantics
* Modify existing error codes
* Change diff classification rules

---

# 9. Non-Goals

The architecture does NOT define:

* Persistence implementation
* Runtime execution of business logic
* Database schema generation
* Deployment strategy

These are external to the RIGOR engine.

---

# 10. Compliance Requirements

An implementation is compliant if:

1. All modules exist logically (even if combined physically)
2. Data contracts are respected
3. Determinism is guaranteed
4. Canonical Graph is immutable
5. Diff and Versioning integrate correctly

Physical code organization MAY vary, but logical separation MUST exist.

---

# 11. Summary

The RIGOR architecture is:

* Layered
* Deterministic
* Graph-centered
* Evolution-aware
* Strictly modular

Subsequent documents define each module in technical depth.

