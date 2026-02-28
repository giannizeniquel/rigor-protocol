# Núcleo de la Spec (v0.1)

## 1. Introducción

Un Proceso RIGOR es una **máquina de estados determinista y dirigida por eventos** donde todas las mutaciones están restringidas a transiciones declaradas y se ejecutan atómicamente por evento.

## 2. Definición de Proceso

Un Proceso **DEBE** definir:
- Una identidad única
- Un conjunto finito de estados
- Un estado inicial (que **DEBE** existir en el conjunto de estados)
- Un conjunto finito de transiciones
- Un esquema de contexto

## 3. Modelo de Transición y Declaración de Mutación (CRÍTICO)

El mapeo formal es: `(estado_actual, evento) -> (estado_siguiente, mutaciones)`

- Una transición **DEBE** definir `from`, `on`, y `to`.
- Una transición **PUEDE** definir una lista de `mutate`.
- **Regla**: Las transiciones **NO DEBEN** mutar campos de contexto no declarados explícitamente en la lista `mutate`. Si `mutate` se omite, el contexto es inmutable para esa transición.

## 4. Semántica Transaccional

Cada evento **DEBE** procesarse atómicamente.

- La ejecución exitosa resulta en una transición de estado atómica y actualización de contexto.
- El fallo resulta en ningún cambio de estado y ninguna mutación (rollback).

## 5. Garantía de Determinismo

Para cualquier par dado `(estado, evento)**, debe haber **a lo sumo** una transición válida. Los mapeos ambiguos están prohibidos y **DEBEN** ser rechazados en el momento de la validación.

## 6. Estados Terminales

Un estado terminal es un estado sin transiciones salientes. Una vez alcanzado, el proceso **NO DEBE** aceptar más eventos.

## 7. Invariantes

### 7.1 Invariantes Estructurales
- Un Proceso **DEBE** tener un único estado inicial.
- Todos los objetivos de transición **DEBEN** existir en el conjunto de estados.
- No **DEBEN** existir pares de transiciones duplicados **(estado, evento)**.

### 7.2 Invariantes de Runtime
- El estado actual **DEBE** siempre ser un miembro del conjunto de estados declarados.
- El contexto **DEBE** siempre ajustarse al esquema declarado.

## 8. Ejemplo Normativo

```json
{
  "process": {
    "id": "OrderProcess",
    "version": "1.0.0",
    "initial_state": "created",
    "context_schema": {
      "order_id": { "type": "uuid" },
      "status": { "type": "string", "enum": ["created", "approved", "rejected", "shipped"] },
      "approved_at": { "type": "datetime", "required": false },
      "rejected_at": { "type": "datetime", "required": false }
    },
    "states": [
      { "id": "created", "type": "default" },
      { "id": "approved", "type": "default" },
      { "id": "rejected", "type": "terminal" },
      { "id": "shipped", "type": "terminal" }
    ],
    "transitions": [
      {
        "id": "approve",
        "from": "created",
        "on": "approve",
        "to": "approved",
        "mutate": ["status", "approved_at"]
      },
      {
        "id": "reject",
        "from": "created",
        "on": "reject",
        "to": "rejected",
        "mutate": ["status", "rejected_at"]
      },
      {
        "id": "ship",
        "from": "approved",
        "on": "ship",
        "to": "shipped",
        "mutate": ["status"]
      }
    ]
  }
}
```

### Desglose del Ejemplo:
- **Esquema de Contexto**: Define `order_id`, `status`, `approved_at`, `rejected_at`.
- **Transición con Mutación**: La transición `approve` declara explícitamente `mutate: ["status", "approved_at"]`. Solo estos campos pueden cambiar.
- **Estados Terminales**: `rejected` y `shipped` no tienen transiciones salientes.
- **Determinismo**: Cada par `(estado, evento)` mapea a exactamente una transición.
