# Eventos (v0.1)

## 1. Definición Formal

Un Evento es una entrada externa nombrada con un esquema de payload explícitamente declarado y estáticamente tipado que activa transiciones de estado dentro de un Proceso.

- Los eventos son declarativos y no ejecutables.
- Los eventos **NO DEBEN** mutar el estado directamente (solo vía transiciones).

## 2. Gramática Formal (EBNF)

```ebnf
events_block ::= "events:" event_definition+
event_definition ::= identifier ":" payload_block
payload_block ::= "payload:" payload_field+
payload_field ::= identifier ":" type
```

## 3. Reglas de Nombrado (Normativas)

- **Identificadores de Eventos**: **DEBEN** ser únicos dentro del proceso y seguir `PascalCase` (`^[A-Z][a-zA-Z0-9]*$`).
- **Campos de Payload**: **DEBEN** seguir `snake_case` (`^[a-z_][a-z0-9_]*$`).

## 4. Reglas del Esquema de Payload

- Los tipos de payload **DEBEN** ajustarse al Sistema de Tipos de RIGOR.
- Los campos opcionales **DEBEN** usar el sufijo `?` (ej., `reason: string?`).
- Los payloads vacíos **ESTÁN PERMITIDOS** pero **DEBEN** declararse explícitamente como un bloque `payload` vacío.
- **Restricción v0.1**: No se permiten objetos anidados, tipos de unión, o campos dinámicos.

## 5. Reglas Semánticas

- Los eventos **DEBEN** declararse antes de su uso.
- Las transiciones **DEBEN** referenciar Eventos declarados.
- La validación del payload **DEBE** ocurrir antes de la evaluación de la transición.
- Todos los eventos en v0.1 son **Externos**. La emisión de eventos internos **NO** está soportada.

## 6. Modelo de Procesamiento de Eventos

- Cada evento constituye un único límite transaccional atómico.
- Si la validación o transición falla, **NINGUNA** mutación de estado o actualización de contexto es persistida.

## 7. Sobre de Evento en Tiempo de Ejecución (Envelope)

Un evento compatible con RIGOR recibido por un motor **DEBE** contener los siguientes metadatos:

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `event_id` | `uuid` | Identificador único global para esta instancia de evento. |
| `event_name` | `string` | El nombre formal del evento (coincidente con la spec). |
| `payload` | `object` | Los datos que se ajustan al esquema de payload declarado. |
| `timestamp` | `datetime` | La marca de tiempo UTC cuando se generó el evento. |

El motor **DEBERÍA** usar el `event_id` para asegurar la idempotencia y prevenir el procesamiento duplicado.

## 8. Taxonomía de Validación y Errores

| Código | Condición | Severidad |
| :--- | :--- | :--- |
| EV-001 | event_id duplicado | Error |
| EV-002 | Transición referencia evento no declarado | Error |
| EV-003 | Incompatibilidad de tipos en payload | Error |
| EV-004 | Campo de payload desconocido | Error |
| EV-005 | Campo de payload requerido faltante | Error |
| EV-006 | Patrón de nombre de evento inválido | Error |

## 8. Ejemplos

### Ejemplo Válido: PaymentConfirmed

```yaml
events:
  PaymentConfirmed:
    payload:
      order_id: uuid
      amount: integer
      confirmed_at: datetime

process: OrderProcess
context:
  order_id: uuid
  status: string
  paid_at: datetime?

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
  payment_confirmed:  # EV-006
    payload:
      order_id: uuid
```
