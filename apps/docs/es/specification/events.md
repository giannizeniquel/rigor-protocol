# Eventos (v0.1)

## 1. Propósito

Mientras que un Proceso define la máquina de estados, un **Evento** define la estructura tipificada de las entradas que activan las transiciones. La especificación de Eventos de RIGOR formaliza el contrato de eventos para permitir:
- Validación estructural.
- Tipado fuerte en generación de código impulsada por IA.
- Compatibilidad determinística con `update_context`.

El objetivo es proporcionar un contrato formal entre los sistemas externos y el Motor de RIGOR.

## 2. Estructura Raíz

El nodo `events` es obligatorio en una especificación de RIGOR si el sistema define procesos. Es un mapa donde cada clave representa un evento único.

```yaml
events:
  <EventName>:
    payload:
      <field_name>: <type>
```

### 2.1 Reglas de Nombrado
- **Nombre del Evento**: Debe comenzar con letra mayúscula, ser alfanumérico, y usar `PascalCase` (ej., `PaymentApproved`).
- **Regex**: `^[A-Z][a-zA-Z0-9]*$`
- **Campo de Payload**: Debe usar `snake_case` (solo letras minúsculas y guiones bajos).
- **Regex**: `^[a-z_]+$`

## 3. Especificación de Payload

### 3.1 Reglas Generales
- El nodo `payload` es **obligatorio** y debe contener al menos un campo.
- Cada campo debe tener un tipo definido.

### 3.2 Tipos Soportados
Los eventos soportan los mismos tipos primitivos que el contexto del Proceso:
- `uuid`: Identificador único universal RFC 4122.
- `string`: Texto codificado en UTF-8.
- `integer`: Entero signed de 64 bits.
- `boolean`: `true` o `false`.
- `datetime`: Marca de tiempo ISO 8601 o UTC.

La nulabilidad se soporta usando el sufijo `?` (ej., `error_code: integer?`). Para mantener simplicidad y determinismo, objetos anidados, listas, o tipos compuestos **no están permitidos** en v0.1.

## 4. Relacion con Procesos

Los eventos son referenciados dentro del bloque `on:` de una definición de estado:

```yaml
states:
  WAITING_FOR_PAYMENT:
    on:
      PaymentApproved:
        transition_to: COMPLETED
```

### 4.1 Restricciones
- **Existencia**: Cada evento referenciado en un Proceso debe estar definido en la sección `events`.
- **Mapeo `update_context`**: Los valores del payload de un evento pueden ser mapeados al contexto del proceso usando la sintaxis `event.payload.<field>`. Los tipos deben coincidir exactamente entre el payload y el campo del contexto.

## 5. Semantica del Motor

Un evento compatible con RIGOR procesado por el motor debe contener:
- `event_id` (UUID): Identificador único para la instancia del evento.
- `event_name` (String): El nombre formal del evento como está definido en la especificación.
- `payload` (Object): Los datos que acompañan al evento.
- `timestamp` (DateTime): La hora en que ocurrió el evento.

### 5.1 Idempotencia
El motor **debe** ser capaz de ignorar eventos duplicados para mantener la integridad del proceso.
- **Estrategia Recomendada**: Persistir cada `event_id` procesado en una tabla dedicada `processed_events` vinculada al `process_id`. Antes de ejecutar una transición, el motor debe verificar si el `event_id` ya ha sido aplicado.

## 6. Reglas de Validacion Formal

- **VAL-E1**: Cada evento referenciado en un Proceso debe existir en la sección `events`.
- **VAL-E2**: El payload del evento debe coincidir con la definición de tipo en la especificación.
- **VAL-E3**: La compatibilidad de tipos debe ser verificada al mapear campos del payload al contexto.
- **VAL-E4**: Los campos de payload obligatorios (aquellos sin `?`) deben estar presentes en los datos del evento.
- **VAL-E5 (Advertencia)**: Los eventos definidos en la especificación pero nunca referenciados en cualquier proceso deben activar una advertencia.

## 7. Representacion JSON Schema

El siguiente JSON Schema define la estructura formal de la sección `events`:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["events"],
  "properties": {
    "events": {
      "type": "object",
      "patternProperties": {
        "^[A-Z][a-zA-Z0-9]*$": {
          "type": "object",
          "required": ["payload"],
          "properties": {
            "payload": {
              "type": "object",
              "minProperties": 1,
              "patternProperties": {
                "^[a-z_]+$": {
                  "type": "string",
                  "pattern": "^(uuid|string|integer|boolean|datetime)(\\?)?$"
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## 8. Ejemplo Integrado

La interacción entre `events` y `processes` a través de `update_context`:

```yaml
events:
  EmailVerified:
    payload:
      user_id: uuid
      timestamp: datetime

processes:
  UserOnboardingProcess:
    persistence: true
    start_command: StartOnboarding
    context:
      user_id: uuid
      email_verified: boolean
      verified_at: datetime?
    initial_state: WAITING_FOR_VERIFICATION
    states:
      WAITING_FOR_VERIFICATION:
        on:
          EmailVerified:
            update_context:
              email_verified: true
              verified_at: event.payload.timestamp
            transition_to: COMPLETED
      COMPLETED:
        terminal: true
```
