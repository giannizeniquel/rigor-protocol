# Referencia de la Spec (v0.1)

Este documento define la sintaxis y semántica formal del DSL de RIGOR v0.1 y es normativo para todos los motores compatibles.

## 1. Introducción

El DSL de RIGOR (Lenguaje Específico de Dominio) proporciona una sintaxis formal para definir procesos. Esta referencia define:
- Gramática de estructura de archivos
- Sistema de tipos
- Sintaxis de esquema de contexto
- Sintaxis de declaración de eventos
- Gramática de estados y transiciones
- Sintaxis de expresiones de actualización

## 2. Estructura del Archivo (EBNF)

```ebnf
spec_file ::= version_block process_block
version_block ::= "rigor_spec_version" ":" string
                "spec_version" ":" string
process_block ::= "process" ":" identifier
                context_block
                events_block
                initial_state
                states_block
```
*Regla: Solo un proceso por archivo en v0.1.*

## 3. Sistema de Tipos

### 3.1 Tipos Soportados (v0.1)
| Tipo | Descripción |
| :--- | :--- |
| `uuid` | Identificador Único Universal RFC-4122 |
| `string` | Texto UTF-8 |
| `integer` | Entero Signed de 64 bits |
| `boolean` | Valor Booleano (`true` / `false`) |
| `datetime` | Fecha/Hora ISO-8601 |
| `object` | Objeto JSON |
| `array<type>` | Array Tipado |

### 3.2 Nullableidad
Declarado explícitamente con el sufijo `?`:
- `string?` - String nullable
- `datetime?` - Datetime nullable

*Los campos nullable tienen como valor por defecto `null` en la inicialización del proceso.*

## 4. Esquema de Contexto

```ebnf
context_block ::= "context:" context_field+
context_field ::= identifier ":" type
```
*Regla: Los campos son inmutables excepto mediante actualizaciones de transición.*

### 4.1 Nombrado de Campos
- **Formato**: `snake_case`
- **Regex**: `^[a-z_][a-z0-9_]*$`

### 4.2 Inicialización del Contexto
| Tipo | Valor por Defecto |
| :--- | :--- |
| `integer` | `0` |
| `string` | `""` (string vacío) |
| `boolean` | `false` |
| `datetime` | `null` |
| Nullable (`?`) | `null` |

## 5. Declaración de Eventos

```ebnf
events_block ::= "events:" event_definition+
event_definition ::= identifier ":" payload_block
```

### 5.1 Nombrado de Eventos
- **Formato**: `PascalCase`
- **Regex**: `^[A-Z][a-zA-Z0-9]*$`

## 6. Gramática de Estados y Transiciones

```ebnf
states_block ::= "states:" state_definition+
state_definition ::= identifier ":" transition_block*
transition_block ::= "on:" event_name
                    "to:" state_name
                    update_block?
initial_state ::= "initial_state:" identifier
```

### 6.1 Nombrado de Estados
- **Formato**: `UPPER_SNAKE_CASE`
- **Regex**: `^[A-Z][A-Z0-9_]*$`

### 6.2 Efectos de Estado
Cada estado debe declarar **exactamente un** efecto:
- `emit_command`: Acción externa asíncrona
- `invoke`: Caso de uso interno síncrono
- `terminal`: Conclusión del proceso (sin transiciones salientes)

## 7. Gramática de Expresión de Actualización

```ebnf
update_block ::= "update_context:" update_statement+
update_statement ::= identifier ":" expression
expression ::= literal | path | "now" | arithmetic_expression
path ::= "event.payload." identifier | "context." identifier
arithmetic_expression ::= "context." identifier ( "+" | "-" | "*" | "/" ) literal
```
*Regla: Solo los campos de contexto declarados pueden actualizarse. La compatibilidad de tipos es obligatoria.*

### 7.1 Operaciones Soportadas
| Operación | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `now` | Marca de tiempo actual | `approved_at: now` |
| `increment` | Sumar 1 al entero | `attempts: increment` |
| `literal` | Valor directo | `status: "approved"` |
| `event.payload` | Del evento | `error: event.payload.reason` |

## 8. Restricciones de Determinismo

- Sin efectos secundarios
- Las transiciones son atómicas
- El procesamiento de eventos es una unidad transaccional
- Cada par `(estado, evento)` mapea a lo sumo a una transición
- El contexto solo puede mutar dentro de transiciones declaradas
- Sin cambios de estado implícitos

## 9. Características Prohibidas (v0.1)

Las siguientes características están explícitamente prohibidas en RIGOR v0.1:

| Característica | Razón |
| :--- | :--- |
| **Guards / Condiciones** | El determinismo requiere transiciones no ambiguas |
| **Eventos Internos** | Todos los eventos deben ser externos y explícitamente declarados |
| **Paralelismo** | Viola el modelo transaccional atómico |
| **Sub-procesos** | Complejidad prohibida en v0.1 |
| **Campos Dinámicos** | El esquema de contexto debe ser estático |
| **Objetos Anidados** | Solo tipos primitivos en v0.1 |
| **Campos Calculados** | Todos los valores deben ser explícitos |

## 10. Errores de Validación del DSL

| Código | Descripción |
| :--- | :--- |
| RIGOR-DSL-001 | Referencia a estado no definida |
| RIGOR-DSL-002 | Referencia a evento no definida |
| RIGOR-DSL-003 | Incompatibilidad de tipos en actualización |
| RIGOR-DSL-004 | Expresión de ruta inválida |
| RIGOR-DSL-005 | Declaración duplicada |
| RIGOR-DSL-006 | Mutación de contexto no declarada |
| RIGOR-DSL-007 | Múltiples efectos de estado declarados |
| RIGOR-DSL-008 | Estado terminal con transiciones salientes |

## 11. Ejemplo Completo Mínimo

```yaml
# Bloque de Versión
rigor_spec_version: "0.1"
spec_version: "1.0.0"

# Definición de Proceso
process: OrderProcess

# Esquema de Contexto
context:
  order_id: uuid
  status: string
  amount: integer
  approved_at: datetime?
  rejected_at: datetime?

# Declaraciones de Eventos
events:
  approve:
    payload:
      approved_by: string
  reject:
    payload:
      reason: string

# Estado Inicial
initial_state: created

# Estados y Transiciones
states:
  created:
    emit_command: ProcessOrder
    on:
      approve:
        to: approved
        update_context:
          status: "approved"
          approved_at: now
      reject:
        to: rejected
        update_context:
          status: "rejected"
          rejected_at: now
  approved:
    terminal: true
  rejected:
    terminal: true
```

### Desglose del Ejemplo:
- **Bloque de Versión**: `rigor_spec_version` y `spec_version` son obligatorios
- **Contexto**: Define `order_id`, `status`, `amount`, `approved_at`, `rejected_at`
- **Eventos**: `approve` y `reject` con payloads
- **Transiciones**: El estado `created` maneja ambos eventos con `update_context`
- **Estados Terminales**: `approved` y `rejected` no tienen transiciones salientes
