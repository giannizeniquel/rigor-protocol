# Especificación de Diff (v0.1)

Este documento define la especificación normativa para computar y clasificar diferencias entre dos especificaciones RIGOR. Establece las reglas para la comparación estructural semántica, la detección de cambios de ruptura (breaking changes) y el cumplimiento del versionado.

## 1. Alcance

El proceso de Diff **DEBE**:
- Operar sobre la Representación de Grafo Canónico.
- Ser determinista e independiente del orden.
- Producir un ChangeSet estructurado.
- Clasificar los cambios como **Rompedores (Breaking)** o **No Rompedores (NonBreaking)**.

El Diff se define como la función formal:
`Diff(Grafo_A, Grafo_B) → ChangeSet`

Esta especificación no define la comparación textual. Define la comparación estructural semántica.

## 2. Modelo de Comparación Canónica

Antes de realizar el diff, ambas especificaciones **DEBEN** ser:
1. Validadas contra la [Matriz de Validación](./validation-matrix).
2. Normalizadas y Canonicalizadas de acuerdo con el [Modelo de Grafo](./graph-model).

Si alguna especificación falla la validación, el proceso de Diff **DEBE** abortar. La canonicalización **DEBE** eliminar la varianza del orden textual, la varianza del formato y los metadatos no semánticos.

## 3. Detección de Cambios

El motor de Diff **DEBE** detectar cambios estructurales y semánticos, representados como operaciones atómicas.

### 3.1 Tipos de Cambios Estructurales
- **NodeAdded** / **NodeRemoved** / **NodeRenamed**
- **EdgeAdded** / **EdgeRemoved**

### 3.2 Tipos de Cambios de Propiedad
- **PropertyAdded** / **PropertyRemoved**
- **PropertyModified** / **TypeChanged**

### 3.3 Tipos de Cambios de Restricción
- **ConstraintStrengthened** / **ConstraintWeakened**
- **CardinalityChanged**

## 4. Clasificación de Cambios de Ruptura (Breaking Changes)

### 4.1 Definición Formal
Un cambio es **Rompedor (Breaking)** si y solo si existe al menos una instancia $I$ tal que `Validate(I, Spec_A) = valid` Y `Validate(I, Spec_B) = invalid`.

### 4.2 Motor de Reglas Determinista
La clasificación **DEBE** seguir estas reglas normativas en orden fijo:

#### Reglas a Nivel de Nodo (N)
- **N1 (NodeRemoved)**: **Rompedor**.
- **N2 (NodeAdded)**: **No Rompedor** si es opcional; **Rompedor** si es requerido.
- **N3 (NodeRenamed)**: **Rompedor** a menos que exista un mapeo explícito (fuera del alcance de v0.1).

#### Reglas a Nivel de Propiedad (P)
- **P1 (PropertyRemoved)**: **Rompedor**.
- **P2 (PropertyAdded)**: **No Rompedor** si es opcional; **Rompedor** si es requerida.
- **P3 (TypeChanged)**: **Rompedor**.

#### Reglas de Restricción (C)
- **C1 (ConstraintStrengthened)**: **Rompedor**. (ej., aumento de `minLength`).
- **C2 (ConstraintWeakened)**: **No Rompedor**. (ej., aumento de `maxValue`).

#### Reglas de Cardinalidad (K)
- **K1 (Cardinality Relaxed)**: **No Rompedor**. (ej., `1` → `0..1`).
- **K2 (Cardinality Restricted)**: **Rompedor**. (ej., `0..*` → `1..*`).

#### Reglas a Nivel de Arista (E)
- **E1 (EdgeRemoved)**: **Rompedor**.
- **E2 (EdgeAdded)**: **Rompedor** si introduce una relación requerida.

## 5. Validación de Consistencia de Versionado

Después de la clasificación, el motor **DEBE** validar la consistencia del versionado semántico:
1. **Regla Major**: Si `BreakingChanges > 0` Y `MAJOR_B ≤ MAJOR_A` → **VersioningError**.
2. **Regla Minor**: Si `BreakingChanges = 0` Y `MINOR_B < MINOR_A` → **VersioningError**.

## 6. Esquema de ChangeSet Estándar

La salida **DEBE** ajustarse a la siguiente estructura JSON:

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

## 7. Integración con CLI

El comando `rigor diff` sirve como la interfaz normativa.

```bash
rigor diff <specA.yaml> <specB.yaml> [opciones]
```

### Gramática del Comando (EBNF)
```ebnf
diff_command    ::= "rigor" SP "diff" SP path SP path diff_opts?
diff_opts       ::= (SP diff_opt)*
diff_opt        ::= "--format=" format_type | "--breaking-only" | "--summary-only"
format_type     ::= "json" | "yaml" | "text"
```

### Códigos de Salida (Normativo)
| Código | Significado | Descripción |
| :--- | :--- | :--- |
| `0` | Sin diferencias | Las especificaciones son semánticamente idénticas. |
| `1` | No rompedor | Se detectaron cambios, se preserva la compatibilidad hacia atrás. |
| `2` | Rompedor | Se detectaron uno o más cambios rompedores. |
| `3` | Error | Falló la validación o se violaron las reglas de versionado. |

## 8. Visión General del Algoritmo

1. **parse(A, B)** → Parsear las entradas a ASTs.
2. **validate(AST_A, AST_B)** → Asegurar el cumplimiento del protocolo.
3. **normalize(AST_A, AST_B)** → Transformar al [Modelo de Grafo](./graph-model).
4. **compare(Graph_A, Graph_B)** → Verificación de equivalencia semántica y detección de cambios.
5. **classify(changes)** → Aplicar el motor de reglas determinista (reglas N, P, C, K, E).
6. **verify(summary)** → Verificar la consistencia del versionado.
7. **emit(result)** → Retornar el ChangeSet y el código de salida.

## 9. Determinismo y Seguridad
- **DEBE** producir resultados idénticos para entradas idénticas.
- **DEBE** operar offline sin red externa ni ejecución de código.
- **NO DEBE** modificar las especificaciones de entrada.

## 10. Referencias Cruzadas
* Ver [Versionado](./versioning)
* Ver [Matriz de Validación](./validation-matrix)
* Ver [Modelo de Grafo](./graph-model)
* Ver [Migraciones](./migrations)
