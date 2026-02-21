# Referencia de la Spec (v0.1)

## 1. Consolidacion de Referencia Tecnica

Este documento define la **referencia técnica exhaustiva** para la sintaxis y semántica de la Especificación de RIGOR v0.1. Mientras que el **Núcleo** establece principios teóricos e invariantes, la **Referencia** proporciona el detalle necesario para implementar:
- Un parser completo de YAML.
- Un validador estructural y semántico.
- Un motor de ejecución compatible.
- Un generador automático de código.

## 2. Estructura del Documento Raiz

### 2.1 Nodo Principal
La raíz del archivo YAML debe contener el nodo `processes`:
```yaml
processes:
  <ProcessName>: {}
```
- **Obligatorio**: La clave `processes` debe existir.
- **Tipo**: Debe ser un objeto (mapa).
- **Requisito**: Debe contener al menos una definición de proceso.
- **Validación**:
  - `✓ Válido`: `processes: { MyProcess: {...} }`
  - `✗ Inválido`: `process: { ... }` (Nombre de clave incorrecto)
  - `✗ Inválido`: `processes: []` (Debe ser un mapa, no un array)
  - `✗ Inválido`: `processes: {}` (Mapa vacío es inválido)

### 2.2 Reglas de Nombrado de Proceso
- **Formato**: `PascalCase` (Recomendado).
- **Restricciones**: Debe comenzar con letra mayúscula, ser alfanumérico, y no contener espacios o caracteres especiales.
- **Regex**: `^[A-Z][a-zA-Z0-9]*$`
- **Ejemplos**:
  - `✓ Válido`: `OrderPaymentProcess`, `UserOnboarding`, `MultiLevelApproval2Stages`.
  - `✗ Inválido`: `orderPayment` (Comienza con minúscula), `Order_Payment` (Contiene guión bajo), `2FastProcess` (Comienza con número).

## 3. Estructura Completa del Proceso

### 3.1 Ejemplo Estructural
```yaml
processes:
  OrderPaymentProcess:
    persistence: true
    start_command: StartOrderPayment
    uniqueness:
      by: order_id
    context:
      order_id: uuid
      attempts: integer
      approved: boolean?
      approval_date: datetime?
      last_error: string?
    initial_state: INITIAL
    states:
      INITIAL:
        emit_command: RequestPayment
        on:
          PaymentApproved:
            update_context:
              approved: true
              approval_date: now
            transition_to: COMPLETED
          PaymentRejected:
            update_context:
              attempts: increment
              last_error: event.payload.reason
            transition_to: EVALUATE_RETRY
      EVALUATE_RETRY:
        invoke: EvaluateRetryPolicy
        on:
          RetryAllowed:
            transition_to: INITIAL
          RetryDenied:
            transition_to: CANCELLED
      COMPLETED:
        terminal: true
      CANCELLED:
        terminal: true
```

### 3.2 Campos Obligatorios vs. Opcionales

| Campo | Obligatorio | Tipo | Descripción |
| :--- | :---: | :--- | :--- |
| `persistence` | Sí | `boolean` | Indica si el proceso es persistido. |
| `start_command` | Sí | `string` | El comando que inicializa el proceso. |
| `uniqueness` | No | `object` | Restricciones de unicidad. |
| `context` | Sí | `object` | El modelo de datos persistente. |
| `initial_state` | Sí | `string` | El nombre del estado inicial. |
| `states` | Sí | `object` | Mapa de estados y su comportamiento. |

## 4. Especificaciones Detalladas de Campos

### 4.1 `persistence` (Obligatorio)
- **Tipo**: `boolean`
- **Valor Permitido (v0.1)**: Debe ser `true`.
- **Propósito**: Señala que las instancias deben ser almacenadas en almacenamiento permanente.
- **Semántica**: Cuando es `true`, el motor debe crear un registro en `process_instances`, persistir cada transición, asegurar atomicidad ACID, y opcionalmente mantener un historial de eventos.

### 4.2 `start_command` (Obligatorio)
- **Tipo**: `string`
- **Restricciones**:
  - **Globalmente Único**: No puede repetirse entre diferentes procesos.
  - **Formato**: `PascalCase`, alfanumérico, preferiblemente un verbo en infinitivo (ej., `CreateReservation`).
  - **Regex**: `^[A-Z][a-zA-Z0-9]*$`
- **Semántica de Ejecución**: Al recibir un `start_command`, el motor valida unicidad, crea una nueva instancia con un UUID único, inicializa el contexto, establece el `current_state` al `initial_state`, y ejecuta el efecto del estado inicial.
- **Idempotencia**: Cuando se combina con `uniqueness`, llamadas subsecuentes con la misma clave deben ser rechazadas con `ProcessAlreadyActiveException`.

### 4.3 `uniqueness` (Opcional)
- **Tipo**: `object`
- **Estructura**: `uniqueness: { by: context_field }`
- **Descripción**: Previene múltiples instancias activas del mismo proceso con el mismo valor en el campo especificado.
- **Reglas**:
  - El campo referenciado **debe existir** en el `context`.
  - La verificación debe ser **transaccional** (usando índices únicos condicionales).
  - **Solo Activas**: Una instancia terminal no bloquea una nueva instancia con la misma clave.
- **Comportamiento**: Si existe una instancia activa, el motor debe rechazar el comando con `ProcessAlreadyActiveException`.

### 4.4 `context` (Obligatorio)
- **Tipo**: `object` (Mapa de campos tipificados)
- **Descripción**: El modelo de datos persistente y mutable. Es la **única** fuente de estado mutable.
- **Reglas de Nombrado**: `snake_case`, solo letras minúsculas y guiones bajos, debe comenzar con una letra, sin guiones bajos al final.
- **Regex**: `^[a-z_]+$`

#### 4.4.1 Tipos Primitivos Permitidos (v0.1)
| Tipo | Descripción | Representación Típica |
| :--- | :--- | :--- |
| `uuid` | Identificador Único Universal | RFC 4122 UUID |
| `string` | Texto UTF-8 | UTF-8 String |
| `integer` | Entero Signed de 64-bit | Int64 |
| `boolean` | Valor Booleano | `true` / `false` |
| `datetime` | Fecha/Hora ISO 8601 | ISO 8601 / UTC Timestamp |

- **Nullable**: Indicado por el sufijo `?` (ej., `datetime?`). Los campos obligatorios sin `?` deben tener un valor desde la creación.
- **Restricciones Estructurales**: No se permiten tipos complejos (objetos, arrays, mapas anidados) en v0.1 para mantener simplicidad y determinismo.

#### 4.4.2 Inicialización del Contexto
El contexto se inicializa cuando se ejecuta el `start_command`.
- Los campos proveídos en el payload del comando son mapeados.
- `integer` por defecto es `0`.
- `string` por defecto es `""` (string vacío).
- `boolean` por defecto es `false`.
- `datetime` por defecto es `null` o la marca de tiempo actual.
- Campos nulables (`?`) por defecto son `null`.

#### 4.4.3 Mutabilidad
El contexto **solo** se modifica a través de `update_context` durante las transiciones. **Nunca** es modificado directamente por código generado, comandos, o casos de uso.

### 4.5 `initial_state` (Obligatorio)
- **Tipo**: `string`
- **Reglas**:
  - Debe existir en el mapa de `states`.
  - **No puede ser un estado terminal**.
- **Semántica**: El motor establece el `current_state` a este valor al crear la instancia.

### 4.6 `states` (Obligatorio)
- **Tipo**: `object` (Mapa de estados)
- **Reglas de Nombrado**: `UPPER_SNAKE_CASE` (ej., `WAITING_FOR_VERIFICATION`).
- **Regex**: `^[A-Z_]+$`
- **Requisitos**: Debe contener al menos un estado y al menos un estado terminal.

## 5. Reglas de Definición de Estado

### 5.1 La Regla de "Exactamente Un Efecto"
Cada estado debe declarar **exactamente uno** de los siguientes efectos mutuamente excluyentes:
- `emit_command`: Una cadena representando un comando externo asíncrono.
- `invoke`: Una cadena representando un caso de uso interno síncrono.
- `terminal`: Un booleano establecido en `true`.

**Ejemplo de Validación Estructural**:
```json
{
  "oneOf": [
    {"required": ["emit_command"]},
    {"required": ["invoke"]},
    {"required": ["terminal"]}
  ]
}
```

### 5.2 `emit_command` (Asíncrono)
- **Tipo**: `string` (PascalCase, preferiblemente un verbo en infinitivo como `RequestPayment`).
- **Características**:
  - **Fire-and-forget**: El proceso emite el comando y no espera una respuesta inmediata.
  - **Ejecución Única**: Emitido solo una vez al entrar al estado.
  - **Desacoplado**: El proceso no sabe cómo se ejecuta el comando o su resultado inmediato.
- **Flujo de Ejecución**:
  1. El proceso transiciona al estado.
  2. El motor despacha el comando con el payload del contexto.
  3. El proceso espera por una respuesta de evento.
  4. El sistema externo procesa el comando y emite un evento de respuesta.
  5. El proceso recibe el evento y evalúa la transición en `on:`.

### 5.3 `invoke` (Síncrono)
- **Tipo**: `string` (PascalCase, preferiblemente un verbo como `EvaluateRetryPolicy`).
- **Características**:
  - **Lógica Síncrona**: El motor ejecuta el UseCase y espera su resultado (un evento).
  - **Determinístico**: Las mismas entradas deben producir el mismo resultado/evento.
  - **Idempotente**: Debe ser seguro ejecutar múltiples veces (ej., en errores de red).
- **Flujo de Ejecución**:
  1. El proceso transiciona al estado.
  2. El motor ejecuta el UseCase.
  3. El UseCase emite un evento de resultado.
  4. El proceso recibe el evento y evalúa la transición en `on:`.

### 5.4 `terminal` (Conclusión del Proceso)
- **Tipo**: `boolean` (El valor debe ser `true`).
- **Reglas**:
  - **No se permite bloque `on:`**: Los estados terminales no tienen transiciones salientes.
  - **No se permiten efectos**: No puede emitir comandos ni invocar casos de uso.
  - **No puede ser el `initial_state`**.
- **Semántica**: Cuando un proceso alcanza un estado terminal, se vuelve inactivo, y su clave de unicidad (si existe) es liberada para nuevas instancias.

## 6. Transiciones (`on:`)

Define cómo el proceso reacciona a eventos y qué transiciones de estado ejecutar.

### 6.1 Estructura
```yaml
on:
  EventName:
    update_context: # Opcional
      field: value
    transition_to: TARGET_STATE # Obligatorio
```

### 6.2 Nombrado de Eventos
- **Formato**: `PascalCase`, alfanumérico, preferiblemente tiempo pasado (ej., `PaymentApproved`).
- **Regex**: `^[A-Z][a-zA-Z0-9]*$`

### 6.3 Campos de Transición
- **`transition_to` (Obligatorio)**: Debe referenciar un estado existente en el mapa de `states`.
- **`update_context` (Opcional)**: Un mapa declarativo de modificaciones al contexto que ocurren **antes** de que la transición sea completada.

## 7. `update_context` - Especificacion Exhaustiva

### 7.1 Restricciones Fundamentales
- Solo puede modificar campos existentes en el `context`.
- No puede crear o eliminar campos.
- Garantiza evaluación determinística sin efectos secundarios.

### 7.2 Operaciones Permitidas

#### 7.2.1 `now` (Marca de Tiempo del Sistema)
- **Aplicable a**: `datetime` o `datetime?`.
- **Semántica**: Asigna la marca de tiempo UTC exacta de la transición.
- **Ejemplo**: `approval_date: now`

#### 7.2.2 `increment` (Incremento Numérico)
- **Aplicable a**: `integer`.
- **Semántica**: Incrementa el valor actual en 1. Si el campo es `null` (nullable), se establece en 1.
- **Ejemplo**: `attempts: increment`

#### 7.2.3 Valores Literales
- **Aplicable a**: Todos los tipos.
- **Ejemplos**: `is_approved: true`, `status: "processed"`, `retry_count: 5`.

#### 7.2.4 Valores del Payload del Evento
- **Sintaxis**: `context_field: event.payload.subfield`
- **Reglas**:
  - El subcampo debe existir en la definición formal del evento.
  - Los tipos deben coincidir (ej., un campo payload `integer` no puede ser mapeado a un campo de contexto `string`).
- **Ejemplo**: `last_error: event.payload.reason`

### 7.3 Atomicidad
Todas las operaciones en un bloque `update_context` son aplicadas **atómicamente** como parte de la transacción de transición. No se permiten referencias cruzadas (ej., `field_a: field_b`) en v0.1.

## 8. Reglas de Validacion Global

Antes de que una especificación pueda ser usada, el validador debe verificar estas **reglas obligatorias**:

### V1: `initial_state` Válido
- Debe existir en el mapa de `states`.
- **No puede ser un estado terminal**.
- `✓ Válido`: `initial_state: START` (donde START no es terminal).
- `✗ Inválido`: `initial_state: END` (donde END tiene `terminal: true`).

### V2: `transition_to` Válido
- Cada `transition_to` debe referenciar un estado existente en el mapa de `states`.
- `✓ Válido`: `transition_to: COMPLETED` (existe).
- `✗ Inválido`: `transition_to: UNKNOWN` (no existe).

### V3: Al Menos Un Estado Terminal
- Cada proceso debe tener al menos un estado con `terminal: true`.
- `✓ Válido`: Al menos un estado es terminal.
- `✗ Inválido`: Un proceso con solo ciclos (bucle infinito).

### V4: Estados Alcanzables
- Cada estado debe ser alcanzable desde el `initial_state` usando un algoritmo DFS/BFS.
- `✗ Inválido`: Un estado "huerfano" sin transiciones entrantes.

### V5: Sin Ciclos sin Salida
- Cada estado debe tener un camino a un estado terminal.
- `✗ Inválido`: Un ciclo sin camino a un estado terminal (bucle infinito).

### V6: `start_command` Globalmente Único
- No dos procesos pueden compartir el mismo `start_command`.

## 9. Modelo de Persistencia (Estandar Industrial)

Los motores compatibles con RIGOR deben implementar una capa de persistencia que garantice propiedades ACID.

### 9.1 Estructura de Tabla Recomendada (`process_instances`)
**DDL (Ejemplo PostgreSQL):**
```sql
CREATE TABLE process_instances (
  process_id UUID PRIMARY KEY,
  process_name VARCHAR(100) NOT NULL,
  current_state VARCHAR(50) NOT NULL,
  serialized_context JSONB NOT NULL,
  uniqueness_key VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  -- Index for filtering by process name and state
  INDEX idx_process_type_state (process_name, current_state),
  -- Conditional unique index for uniqueness constraints
  UNIQUE INDEX uniq_process_key (process_name, uniqueness_key)
  WHERE is_active = true AND uniqueness_key IS NOT NULL
);
```

### 9.2 Tabla de Auditoría (`process_events`)
**DDL (Ejemplo PostgreSQL):**
```sql
CREATE TABLE process_events (
  event_id UUID PRIMARY KEY,
  process_id UUID NOT NULL REFERENCES process_instances(process_id),
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  previous_state VARCHAR(50),
  new_state VARCHAR(50),
  occurred_at TIMESTAMP NOT NULL DEFAULT NOW(),
  -- Index for auditing by process ID
  INDEX idx_process_events (process_id, occurred_at DESC)
);
```

### 9.3 Garantías de Atomicidad
Cada transición debe ejecutar dentro de una sola transacción:
1. **Adquirir Bloqueo**: Cargar la instancia con un bloqueo exclusivo.
2. **Validar Estado**: Confirmar que el evento es permitido en el estado actual.
3. **Aplicar `update_context`**: Actualizar el contexto determinísticamente.
4. **Cambiar Estado**: Transicionar al nuevo estado.
5. **Persistir Instancia**: Actualizar el registro de la base de datos.
6. **Registrar Evento**: Insertar el registro de auditoría.
7. **Confirmar Transacción**.

El fallo en cualquier etapa debe activar un rollback completo, asegurando que no existan estados intermedios inconsistentes.

### 9.4 Consultas Típicas

**Encontrar Instancia Activa por Clave de Unicidad**:
```sql
SELECT * FROM process_instances 
WHERE process_name = 'PaymentProcess' 
AND uniqueness_key = 'order-123' 
AND is_active = true;
```

**Obtener Historial Completo de Transiciones**:
```sql
SELECT event_type, previous_state, new_state, occurred_at 
FROM process_events 
WHERE process_id = 'proc-123' 
ORDER BY occurred_at ASC;
```

## 10. Estándares de Prueba Requeridos

### 10.1 Principio de Maquina de Estados Pura
Un proceso debe ser ejecutable como una **máquina de estados pura**:
- Sin infraestructura externa (sin DB, sin red).
- A través de inyección de eventos.
- Resultando en un estado final determinístico y contexto actualizado.

### 10.2 Verificación de Determinismo
El proceso debe satisfacer:
```python
# Dado un estado inicial y un evento
initial_state = "PROCESSING"
event = PaymentApproved(order_id="123")
# Cuando el evento es manejado
new_state, new_context = process.handle(event)
# Entonces el resultado es determinístico
assert new_state == "COMPLETED"
assert new_context.is_approved == True
```

### 10.3 Pruebas Basadas en Propiedades
Los motores deben verificar que entradas idénticas siempre producen resultados idénticos y que el comportamiento del proceso permanece predecible a través de un amplio rango de combinaciones de estado/evento.

## 11. Contrato de Generacion para IA

Cualquier IA que genere código de implementación desde una Especificación de RIGOR **debe** adherirse a estos principios obligatorios:

### 11.1 Tipado Estricto
- `uuid` → UUID/GUID
- `integer` → Int64/Int/i64
- `boolean` → Bool/Boolean
- `datetime` → DateTime/Timestamp
- `string` → String

### 11.2 Sin Lógica No Especificada
- **No** inferir validaciones adicionales no presentes en la especificación.
- **No** añadir campos extra al contexto.
- **No** modificar lógica de transición.

### 11.3 Sin Efectos Implícitos
- **No** emitir eventos no declarados en la especificación.
- **No** hacer llamadas a servicios no mencionados en la especificación.
- **No** crear efectos secundarios ocultos.

### 11.4 Trazabilidad
- Cada evento debe ser registrado.
- Cada transición debe ser auditada.
- Estados y contexto deben permanecer observables.

## 12. Compatibilidad Futura

RIGOR v0.1 está diseñado para evolucionar a:
- **v1.1 - Compensaciones**: `compensate_with: RollbackAction`.
- **v1.2 - Tiempos de espera**: `timeout: 10m`.
- **v1.3 - Paralelismo**: `parallel: [TaskA, TaskB]`.
- **v1.4 - Sub-procesos**: `subprocess: AnotherProcess`.

Las especificaciones escritas en v0.1 **deben** permanecer válidas en versiones futuras.

## 13. Conclusion

La Especificación de RIGOR v0.1 proporciona un marco completo para una implementación **de nivel industrial** de procesos declarativos. Permite:
✅ **Parsing** de archivos de proceso YAML.
✅ **Validación** de estructura y semántica.
✅ **Generación** de código de implementación determinístico.
✅ **Persistencia** con garantías ACID.
✅ **Auditoría** de todas las transiciones.
✅ **Pruebas** sin infraestructura externa.
✅ **Escalabilidad** hacia características avanzadas sin romper compatibilidad.

Los implementadores están obligados a seguir estrictamente estas reglas para mantener la garantía de **Cumplimiento de Rigor**.
