# Migraciones (v0.1)

## 1. Propósito y Definición Formal

La especificación de Migraciones define el modelo formal para migrar instancias de proceso persistidas cuando una especificación sufre un cambio de versión.

Una Migración es un conjunto ordenado y determinista de operaciones que transforma una especificación de la versión A a la versión B.

- **DEBE** ser declarativa y determinista.
- **DEBE** ser validable estáticamente.
- **NO DEBE** depender de estado externo.
- **NO DEBE** ejecutar código arbitrario.

## 2. Ubicación y Sequentialidad

Las migraciones se declaran en el bloque raíz `migrations:` del documento de especificación.

```yaml
rigor_spec_version: "0.1"
spec_version: "2.0.0"

migrations:
  - from: "1.0.0"
    to: "2.0.0"
    operations:
      - remove_state: pending

process: OrderProcess
# ...
```

### Reglas de Sequentialidad
- **DEBE** satisfacer `from < to` (solo hacia adelante).
- **DEBE** satisfacer `to == spec_version`.
- **NO DEBE** tener huecos entre versiones.
- **NO DEBE** tener bifurcaciones (múltiples caminos).
- **NO DEBE** tener ciclos.

## 3. Gramática Formal (EBNF)

```ebnf
migrations_block ::= "migrations:" migration_definition+
migration_definition ::= "-" "from:" version "to:" version "operations:" operation+
operation ::= add_state | remove_state | rename_state | add_event | remove_event | modify_transition | modify_context_schema
```

## 4. Modelo de Operaciones (Reglas Normativas)

Todas las operaciones de migración **DEBEN** satisfacer:

- **DEBEN** ser deterministas: dada la misma entrada, producir la misma salida.
- **DEBEN** ser idempotentes dentro de una sola ejecución.
- **NO DEBEN** introducir no determinismo.
- **NO DEBEN** depender de estado externo o efectos secundarios.

### 4.1 add_state

Añade un nuevo estado a la especificación.

```yaml
operations:
  - add_state:
      name: processing
      terminal: false
```

**Reglas:**
- El nombre del estado **NO DEBE** existir previamente.
- Si se marca como `initial: true`, **NO DEBE** entrar en conflicto con el estado inicial existente.

### 4.2 remove_state

Remueve un estado existente de la especificación.

```yaml
operations:
  - remove_state: pending
```

**Reglas:**
- El estado **NO DEBE** ser el `initial_state`.
- El estado **NO DEBE** tener transiciones entrantes o salientes activas (a menos que se redirija).
- Solo permitido en incrementos de versión MAJOR.

### 4.3 rename_state

Renombra un estado existente.

```yaml
operations:
  - rename_state:
      from: pending
      to: awaiting
```

**Reglas:**
- El estado origen **DEBE** existir.
- El nombre destino **NO DEBE** existir previamente.
- **DEBE** actualizar todas las referencias (transiciones, `initial_state`).

### 4.4 add_event

Añade un nuevo evento a la especificación.

```yaml
operations:
  - add_event:
      name: ProcessCompleted
      payload:
        result: string
```

**Reglas:**
- El nombre del evento **NO DEBE** existir previamente.

### 4.5 remove_event

Remueve un evento existente.

```yaml
operations:
  - remove_event: OrderCancelled
```

**Reglas:**
- Solo permitido en incrementos de versión MAJOR (cambio destructivo).
- El evento **NO DEBE** ser referenciado por ninguna transición.

### 4.6 modify_transition

Modifica una transición existente.

```yaml
operations:
  - modify_transition:
      from: created
      event: OrderPlaced
      to: processing
```

**Reglas:**
- La transición **DEBE** existir.
- **NO DEBE** romper el determinismo (sin transiciones conflictivas al mismo estado).

### 4.7 modify_context_schema

Modifica el esquema del contexto.

```yaml
operations:
  - modify_context_schema:
      field: customer_id
      type: string
      required: false
```

**Reglas:**
- Cambios de tipo incompatibles **DEBEN** requerir incremento MAJOR.
- Añadir campos opcionales es MINOR.
- Añadir campos requeridos **DEBEN** incluir valor por defecto.

## 5. Fases de Validación

### 5.1 Validación Estructural
- La sintaxis del bloque de migración es válida.
- Los formatos de versión son correctos.
- La cadena satisface las reglas de sequentialidad.

### 5.2 Validación Semántica
- La legalidad de operaciones coincide con el tipo de incremento SemVer.
- Las operaciones tienen el formato correcto.

### 5.3 Validación de Grafo
- El grafo post-migración **DEBE** ser válido.
- Todos los estados permanecen alcanzables desde `initial_state`.
- `initial_state` existe en el nuevo grafo.
- El determinismo se preserva (sin transiciones ambiguas).

## 6. Matriz de Compatibilidad de Versión

| Incremento de Versión | Operaciones Permitidas |
| :--- | :--- |
| **PATCH** | Solo metadatos (documentación, comentarios). |
| **MINOR** | Solo aditivas: `add_state`, `add_event`, `add_transition`, `modify_context_schema` (campos opcionales). |
| **MAJOR** | Aditivas + Destructivas: Todas las operaciones incluyendo `remove_state`, `remove_event`, `rename_state`, `modify_context_schema` con cambio de tipo. |

## 7. Atomicidad y Seguridad

### 7.1 Atomicidad
La aplicación de migración es **atómica**:
- Todas las operaciones **DEBEN** tener éxito o **DEBEN** fallar todas.
- La aplicación parcial no está permitida.
- En caso de fallo, la especificación **DEBE** permanecer sin cambios.

### 7.2 Seguridad
- La migración **NO DEBE** ejecutar código arbitrario.
- La migración **DEBE** ser puramente declarativa.
- Sin lógica imperativa, bucles o condicionales más allá de la estructura YAML.

## 8. Modelo de Cadena

La cadena de migración representa el camino secuencial de una versión a otra:

```
1.0.0 → 1.1.0 → 2.0.0 → 2.1.0
```

### Reglas de Cadena
- Cada enlace **DEBE** satisfacer `from(n) == to(n-1)`.
- La cadena **DEBE** comenzar desde la `spec_version` actual.
- La cadena **DEBE** terminar en la versión objetivo.
- El motor **DEBE** resolver los pasos intermedios automáticamente.

## 9. Taxonomía de Errores

| Código | Descripción |
| :--- | :--- |
| `ER-MIG-INVALID-VERSION` | Formato de versión inválido. |
| `ER-MIG-NON-SEQUENTIAL` | Hueco en la cadena de migración. |
| `ER-MIG-CYCLE` | Ciclo detectado en la cadena. |
| `ER-MIG-FORK` | Bifurcación detectada en la cadena. |
| `ER-MIG-INVALID-OPERATION` | Operación no soportada o mal formada. |
| `ER-MIG-GRAPH-BROKEN` | Grafo inválido resulta después de la migración. |
| `ER-MIG-VERSION-MISMATCH` | El objetivo de migración no coincide con `spec_version`. |

## 10. Integración con CLI

El comando `rigor migrate` resuelve y aplica cadenas de migración:

```bash
rigor migrate <spec.yaml> --to <version>
```

### Pasos de Ejecución

1. **Resolver Cadena**: Encontrar el camino secuencial desde la versión actual hasta la objetivo.
2. **Validar Precondiciones**: Verificar que todas las migraciones en la cadena son válidas.
3. **Aplicar Operaciones**: Ejecutar cada operación de migración en orden atómicamente.
4. **Validar Grafo**: Ejecutar validación de grafo en la especificación resultante.
5. **Emitir Spec**: Salida de la especificación migrada con `spec_version` actualizada.

### Códigos de Salida
- `0`: Migración exitosa.
- `1`: Error de validación o fallo en resolución de cadena.
