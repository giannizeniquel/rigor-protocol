# Especificación de Eventos (v0.1)

## 1. Propósito

Este documento define los **Eventos** para RIGOR Core v0.1. Establece un estándar formal y normativo para la declaración de eventos, el tipado de payloads y la integración con las transiciones de los Procesos.

Los eventos son **entradas externas con payloads tipados** que activan transiciones de estado. En la v0.1, todos los eventos se consideran **externos**; no se soporta la emisión de eventos internos.

## 2. Definición de Evento

**Definición Formal:**
> Un Evento es una entrada externa nombrada con un esquema de payload declarado y estáticamente tipado que activa transiciones en un Proceso.
> Los eventos son declarativos y no ejecutables. **NO DEBEN** mutar el estado directamente; la mutación del estado ocurre exclusivamente a través de las transiciones.

## 3. Gramática de Eventos (EBNF)

```ebnf
events_block       ::= "events:" event_definition+

event_definition   ::= "-" "event_id:" identifier NEWLINE
                       INDENT "payload_schema:" payload_schema DEDENT

payload_schema     ::= "type: object" NEWLINE
                       INDENT "properties:" properties
                       "required:" required_fields DEDENT

properties         ::= (field_name ":" type_reference)+
required_fields    ::= field_name+
field_name         ::= identifier
type_reference     ::= "string" | "integer" | "boolean" | "uuid" | "datetime"
```

## 4. Reglas de Nombrado (Normativas)

- **Identificadores de Eventos**: **DEBEN** ser únicos dentro del proceso y seguir `PascalCase` (`^[A-Z][a-zA-Z0-9]+$`).
- **Campos de Payload**: **DEBEN** seguir `snake_case` (`^[a-z_][a-z0-9_]*$`).

## 5. Reglas del Esquema de Payload

- **Sistema de Tipos**: Los tipos de payload **DEBEN** ajustarse al Sistema de Tipos de RIGOR.
- **Campos Requeridos**: **DEBEN** listarse explícitamente en el bloque `required`.
- **Campos Opcionales**: Pueden declararse usando el sufijo `?` en las propiedades (ej., `reason: string?`).
- **Payloads Vacíos**: **PERMITIDOS** pero **DEBEN** usar la sintaxis explícita:
```yaml
payload_schema:
  type: object
  properties: {}
  required: []
```
- **Restricciones v0.1**: No se permiten tipos de unión, campos dinámicos ni objetos anidados (a menos que se tipen explícitamente como una sub-estructura formal).

## 6. Reglas Semánticas

1. Un Evento **DEBE** declararse en `events:` antes de su uso.
2. Una Transición **DEBE** referenciar un Evento declarado.
3. Un Evento **NO DEBE** causar mutación fuera de una Transición.
4. La validación del payload **DEBE** ocurrir antes de la evaluación de la transición.
5. Las declaraciones de eventos son **inmutables entre versiones compatibles**.

## 7. Modelo de Procesamiento de Eventos

- Cada evento se procesa de forma atómica y constituye un único **límite transaccional**.
- El fallo en la validación o en la transición resulta en que **NO** se persiste ninguna mutación de estado ni actualización de contexto.
- El procesamiento de eventos asegura una consistencia fuerte a nivel de proceso.

## 8. Sobre de Evento en Tiempo de Ejecución (Envelope)

Un evento compatible con RIGOR recibido por un motor **DEBE** contener los siguientes metadatos:

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `event_id` | `uuid` | Identificador único global para esta instancia de evento. |
| `event_name` | `string` | El nombre formal del evento (coincidente con la spec). |
| `payload` | `object` | Los datos que se ajustan al esquema de payload declarado. |
| `timestamp` | `datetime` | La marca de tiempo UTC cuando se generó el evento. |

El motor **DEBERÍA** usar el `event_id` para asegurar la idempotencia y prevenir el procesamiento duplicado.

## 9. Validación y Taxonomía de Errores

| Código | Condición | Severidad |
| :--- | :--- | :--- |
| EV-001 | event_id duplicado | Error |
| EV-002 | Transición referencia evento no declarado | Error |
| EV-003 | Incompatibilidad de tipos en payload | Error |
| EV-004 | Campo de payload desconocido | Error |
| EV-005 | Campo de payload requerido faltante | Error |
| EV-006 | Patrón de nombre de evento inválido | Error |

## 10. Ejemplos

### Ejemplo Válido: PaymentConfirmed

```yaml
events:
  - event_id: PaymentConfirmed
    payload_schema:
      type: object
      properties:
        order_id: uuid
        amount: integer
        confirmed_at: datetime
      required:
        - order_id
        - amount
        - confirmed_at

process: OrderProcess
initial_state: pending

states:
  pending:
    on:
      PaymentConfirmed:
        to: paid
        update_context:
          status: "paid"
          paid_at: event.payload.confirmed_at
  paid:
    terminal: true
```

### Ejemplo de Nombrado Inválido

```yaml
# INVÁLIDO: comienza con minúscula
events:
  - event_id: payment_confirmed  # EV-006
    payload_schema:
      type: object
      properties:
        order_id: uuid
      required:
        - order_id
```

## 11. Referencias Cruzadas
* Ver [Sistema de Tipos](./spec-reference#3-sistema-de-tipos)
* Ver [Matriz de Validación](./validation-matrix)
* Ver [Modelo de Grafo](./graph-model)
* Ver [Núcleo de la Spec](./spec-core)
