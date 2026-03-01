# Migraciones (v0.1)

## 1. Definición Formal

Una Migración es un conjunto ordenado y determinista de operaciones que transforma una especificación de la versión A a la versión B.

- **DEBE** ser declarativa y determinista.
- **DEBE** ser validable.
- **NO DEBE** depender de estado externo.

## 2. Estructura del Archivo y Ubicación

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

**Reglas:**
- Solo migraciones hacia adelante son soportadas en v0.1 (`from < to`).
- La cadena debe ser secuencial (sin huecos, ciclos o bifurcaciones).

## 3. Gramática Formal (EBNF)

```ebnf
migrations_block ::= "migrations:" migration_definition+
migration_definition ::= "-" "from:" version "to:" version "operations:" operation+
operation ::= add_state | remove_state | rename_state | add_event | remove_event | modify_transition | modify_context_schema
```

## 4. Operaciones Permitidas (v0.1)

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

## 5. Capas de Validación

### 5.1 Validación Estructural
- El formato del bloque de migración es válido.
- La cadena es secuencial (sin huecos o bifurcaciones).
- Las operaciones no están vacías y tienen el formato correcto.

### 5.2 Validación de Grafo
- El grafo post-migración **DEBE** ser válido.
- Todos los estados permanecen alcanzables desde `initial_state`.
- El determinismo se preserva (sin transiciones ambiguas).

### 5.3 Validación de Compatibilidad
- Las operaciones permitidas **DEBEN** coincidir con el tipo de incremento SemVer.
- Incrementos MINOR: solo operaciones de adición.
- Incrementos MAJOR: operaciones destructivas permitidas.

## 6. Taxonomía de Errores

| Código | Descripción |
| :--- | :--- |
| `ER-MIGRATION-INVALID-VERSION` | Formato de versión inválido. |
| `ER-MIGRATION-NON-SEQUENTIAL` | Hueco en la cadena de migración. |
| `ER-MIGRATION-CYCLE` | Ciclo detectado en la cadena. |
| `ER-MIGRATION-INVALID-OPERATION` | Operación no soportada o mal formada. |
| `ER-MIGRATION-GRAPH-BROKEN` | Grafo inválido resulta después de la migración. |

## 7. Integración con CLI

El comando `rigor migrate` resuelve y aplica cadenas de migración:

```bash
rigor migrate <spec.yaml> --to <version>
```

**Comportamiento:**
1. **Resolver Cadena**: Encontrar el camino secuencial desde la versión actual hasta la objetivo.
2. **Aplicar Secuencialmente**: Ejecutar cada operación de migración en orden.
3. **Validar Resultado**: Ejecutar validación completa en la especificación resultante.
4. **Emitir Spec**: Salida de la especificación migrada.

**Códigos de Salida:**
- `0`: Migración exitosa.
- `1`: Error de validación o fallo en resolución de cadena.
