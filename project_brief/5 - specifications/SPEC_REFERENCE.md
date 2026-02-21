# REFERENCIA DE ESPECIFICACIÓN v0.1 -

# Referencia Técnica Consolidada

**Versión:** 0,
**Estado:** Denitivo
**Fecha:** 15 de febrero de 2026

## 1. Propósito del Documento

Este documento dene la **referencia técnica exhaustiva** de la sintaxis y semántica de la Especicación
v0.1.
Mientras el **NÚCLEO** establecimiento principios e invariantes teóricas, el **REFERENCIA** denir:
Estructura YAML completa y precisa
Semántica exacta de cada campo
Reglas formales de validación
Restricciones obligatorias
Casos Límite y comportamientos esperados
Modelo de persistencia detallado
Este documento es **suciente** para implementar:
. Un analizador completo
. Un validador estructural y semántico
. Un motor de ejecución compatible
. Un generador automático de código

## 2. Estructura Raíz del Documento

## 2.1 Nodo Principal

La razón del archivo YAML debe contener obligatoriamente el nodo:


```
processes:
<ProcessName>: {}
```
### 2.2 Reglas del Nodo Raíz

**Obligatoriedad:**
processes es **obligatorio**
Debe ser un objeto (mapa)
Debe tener al menos un Proceso
**Estructura:**
Cada clave representa un Proceso Único
Las claves son los nombres de los Process
**Validación:**
✓ Válido: processes: { MiProcess: {...} }
✗ Inválido: process: { ... } # Nombre incorrecto
✗ Inválido: processes: [] # No es un mapa
✗ Inválido: processes: {} # Mapa vacío

## 3. Nomenclatura del Proceso

### 3.1 Reglas de Denominación

El nombre del Proceso debe acumlir:
. **Comenzar con letra mayúscula**
. **Ser alfanumérico** (letras y números)
. **Sin contener espacios ni caracteres especiales**
. **Uso PascalCase** (convención recomendada)

### 3.2 Exposición Regular

**Regex obligatorio:**

```
^[A-Z][a-zA-Z0-9]*$
```

### 3.3 Ejemplos Válidos e Inválidos

```
# ✓ Válidos
processes:
PagoOrdenProcess: {}
OnboardingUsuario: {}
AprobacionMultinivel2Etapas: {}
# ✗ Inválidos
processes:
pagoOrden: {} # No empieza con mayúscula
Pago_Orden: {} # Contiene guion bajo
Pago-Orden: {} # Contiene guion
"Pago Orden": {} # Contiene espacio
2FastProcess: {} # Empieza con número
```
## 4. Estructura Completa de un Proceso

### 4.1 Ejemplo Estructural Completo

```
processes:
PagoOrdenProcess:
persistence: true
start_command: IniciarPagoOrden
uniqueness:
by: orden_id
context:
orden_id: uuid
intentos: integer
aprobado: boolean?
fecha_aprobacion: datetime?
ultimo_error: string?
initial_state: INICIAL
states:
INICIAL:
emit_command: SolicitarPago
```

```
on:
PagoAprobado:
update_context:
aprobado: true
fecha_aprobacion: now
transition_to: COMPLETADO
PagoRechazado:
update_context:
intentos: increment
ultimo_error: event.payload.motivo
transition_to: EVALUAR_REINTENTO
EVALUAR_REINTENTO:
invoke: EvaluarPoliticaReintento
on:
ReintentoPermitido:
transition_to: INICIAL
ReintentoDenegado:
transition_to: CANCELADO
COMPLETADO:
terminal: true
CANCELADO:
terminal: true
```
### 4.2 Campos Obligatorios vs Opcionales

```
Campo Obligatorio Tipo Descripción
persistence ✓ booleano Indica persistencia
start_command ✓ cadena Comando inicial
uniqueness ✗ objeto Restricción de unicidad
context ✓ objeto Modelo de datos
initial_state ✓ cadena Estado inicial
states ✓ objeto Mapa de estados
```

## 5. Campos del Proceso - Especicación Detallada

### 5.1 persistencia (obligatorio)

**Tipo:** boolean

**Valor en v0.1:**
Debe ser true
No se permiten otros valores en esta versión
**Propósito:**
Indica que la instancia del Process debe persistir en el logro permanente
Se incluye como campo explícito para permitir futura evolución (v1.x podría permitir procesos
efímeros)
**Semántica:**
Cuando persistence: true, el sistema debe:

. Crear registro en process_instances al iniciar
. Persistir cada transición de estado
. Mantener historial en process_events (opcional pero recomendado)
. Garantizar atomicidad transaccional
**Validación:**

```
# ✓ Válido
persistence: true
# ✗ Inválido en v0.
persistence: false
persistence: "yes"
# (omitido)
```
### 5.2 start_command (obligatorio)

**Tipo:** string

**Descripción:**
Nombre del comando que inicia (crea) una nueva instancia del Process.


**Reglas:**
. **Debe ser único globalmente**
No puede repetirse entre diferentes Processes
Validación: El sistema debe mantener registro de todos los start_command declarados
. **Debe seguir nomenclatura PascalCase**
Comenzar con letra mayúscula
Ser alfanumérico
. **Debe ser un verbo en innitivo** (convención recomendada)
Ejemplos: IniciarPago, ComenzarOnboarding, CrearReserva

**Regex sugerido:**

```
^[A-Z][a-zA-Z0-9]*$
```
**Semántica de Ejecución:**
Cuando el sistema recibe un start_command:

. Valida que no exista instancia activa (si hay uniqueness)
. Crea nueva instancia con process_id único (UUID)
. Inicializa el contexto con valores del comando
. Establece estado_actual = initial_state
. Persiste la instancia
. Ejecuta el efecto del estado inicial (si existe)
**Ejemplos:**

```
# ✓ Válidos
start_command: IniciarPagoOrden
start_command: CrearReservaHotel
start_command: ComenzarVerificacionKYC
# ✗ Inválidos
start_command: iniciar_pago # No empieza con mayúscula
start_command: INICIAR_PAGO # No es PascalCase
start_command: "Iniciar Pago" # Contiene espacio
```
**Idempotencia:**


El start_command **debe ser idempotente** cuando se combina con uniqueness:

```
# Si se envía IniciarPago dos veces con el mismo orden_id:
# 1ra llamada: Crea instancia
# 2da llamada: Rechaza con ProcessAlreadyActiveException
```
### 5.3 uniqueness (opcional)

**Tipo:** object

**Estructura:**

```
uniqueness:
by: campo_contexto
```
**Descripción:**
Dene una restricción de unicidad que impide múltiples instancias activas del Process con el mismo
valor en el campo especicado.
**Reglas:**
. **El campo referenciado debe existir en** context
# ✓ Válido
context:
orden_id: uuid
uniqueness:
by: orden_id
# ✗ Inválido
context:
orden_id: uuid
uniqueness:
by: cliente_id # campo no existe
. **La vericación debe ser transaccional**
Usar índices únicos condicionales en base de datos
Evitar race conditions
. **Solo aplica a instancias activas**


Una instancia en estado terminal NO bloquea nueva instancia
Dos instancias terminadas pueden tener el mismo valor
**Semántica de Comportamiento:**
Cuando se intenta iniciar un Process con una clave que ya existe:
. **Validación del estado existente:**
SELECT estado_actual
FROM process_instances
WHERE process_name = 'PagoOrdenProcess'
AND uniqueness_key = 'orden-123'
. **Decisión:**
Si estado_actual está en estados terminales → **Permitir nueva instancia**
Si estado_actual está en estado activo → **Rechazar con**
ProcessAlreadyActiveException
. **Implementación recomendada:**
-- Índice único condicional (PostgreSQL)
CREATE UNIQUE INDEX uniq_process_key
ON process_instances (process_name, uniqueness_key)
WHERE estado_actual NOT IN ('COMPLETADO', 'CANCELADO', 'FALLIDO');

**Ejemplo Completo:**

```
processes:
OnboardingUsuarioProcess:
persistence: true
start_command: IniciarOnboarding
uniqueness:
by: usuario_id
context:
usuario_id: uuid
email_verificado: boolean
```
**Comportamiento esperado:**


```
# Usuario 1 inicia onboarding
process1 = start(IniciarOnboarding(usuario_id="user-123"))
# ✓ Éxito: Instancia creada
# Usuario 1 intenta iniciar onboarding nuevamente
process2 = start(IniciarOnboarding(usuario_id="user-123"))
# ✗ Error: ProcessAlreadyActiveException
# Proceso 1 llega a estado terminal COMPLETADO
process1.handle(EmailVerificado())
# Estado: COMPLETADO
# Usuario 1 inicia onboarding nuevamente
process3 = start(IniciarOnboarding(usuario_id="user-123"))
# ✓ Éxito: Instancia anterior está terminada
```
### 5.4 context (obligatorio)

**Tipo:** object (mapa de campos tipados)

**Descripción:**
Dene el **modelo de datos persistente** del Process. Es la única fuente de estado mutable durante la
ejecución.
**Propósito:**
Almacenar información relevante para la coordinación
Proveer datos para decisiones en transiciones
Mantener trazabilidad de valores clave

**5.4.1 Reglas de Nomenclatura de Campos**

**Formato obligatorio:** snake_case

**Regex sugerido:**

```
^[a-z_]+$
```
**Restricciones:**
Solo letras minúsculas y guiones bajos
Debe comenzar con letra


No puede terminar con guion bajo
**Ejemplos:**

```
# ✓ Válidos
context:
orden_id: uuid
intentos: integer
fecha_aprobacion: datetime?
ultimo_error: string?
# ✗ Inválidos
context:
OrdenId: uuid # No es snake_case
orden-id: uuid # Usa guion en lugar de guion bajo
_orden_id: uuid # Comienza con guion bajo
orden_id_: uuid # Termina con guion bajo
3_intentos: integer # Comienza con número
```
**5.4.2 Tipos Primitivos Permitidos**

En v0.1, los tipos permitidos son **exclusivamente** :

```
Tipo Descripción Representación típica
uuid Identicador único universal RFC 4122 UUID
string Cadena de texto UTF-8 string
integer Número entero 64-bit signed integer
boolean Valor booleano true / false
datetime Fecha y hora ISO 8601 / timestamp UTC
```
**Nulabilidad:**
Se indica con el sujo? al nal del tipo:

```
context:
# Campos obligatorios (no nullable)
orden_id: uuid
intentos: integer
# Campos opcionales (nullable)
fecha_aprobacion: datetime?
```

```
ultimo_error: string?
aprobado: boolean?
```
**Semántica de nulabilidad:**
Campo sin ?: Debe tener valor desde creación
Campo con ?: Puede ser null inicialmente

**5.4.3 Restricciones Estructurales**

**NO se permiten:**
. **Tipos compuestos:**
# ✗ Inválido
context:
direccion: object # No se permiten objetos
. **Listas o arrays:**
# ✗ Inválido
context:
productos: array # No se permiten arrays
items: list[uuid] # No se permiten listas
. **Objetos anidados:**
# ✗ Inválido
context:
cliente:
nombre: string
email: string
. **Tipos personalizados:**
# ✗ Inválido
context:
estado_pago: EstadoPago # No hay enums custom
monto: Decimal # No hay tipos custom

**Razón de las restricciones:**


```
Mantener simplicidad y determinismo
Facilitar persistencia en JSONB
Evitar ambigüedades en validación
Permitir validación estática completa
```
**5.4.4 Inicialización del Contexto**

El contexto se inicializa cuando se ejecuta el start_command:

```
# Spec
context:
orden_id: uuid
intentos: integer
aprobado: boolean?
# Al ejecutar: IniciarPagoOrden(orden_id="abc-123")
# Contexto inicial:
{
"orden_id": "abc-123", # Desde comando
"intentos": 0, # Valor por defecto
"aprobado": null # Nullable, inicia en null
}
```
**Valores por defecto según tipo:**

```
Tipo Valor por defecto si no se especica
uuid Debe venir del comando
string "" (string vacío)
integer 0
boolean false
datetime null o timestamp actual
```
**Campos nullable:**
Si el campo tiene ?, su valor por defecto es null

**5.4.5 Mutabilidad del Contexto**

El contexto **solo puede modicarse** mediante:
. update_context **en transiciones**


. **Nunca directamente por código generado
Importante:** El contexto NO es modicable por:
Los comandos (emit_command)
Los use cases invocados (invoke)
Efectos externos
Solo el Process, mediante transiciones declaradas, modica su contexto.

**5.4.6 Ejemplo Completo**

```
context:
# Identificadores
orden_id: uuid
usuario_id: uuid
# Contadores
intentos: integer
reintentos_maximos: integer
# Estados
aprobado: boolean?
verificado: boolean
# Timestamps
fecha_creacion: datetime
fecha_aprobacion: datetime?
fecha_ultimo_intento: datetime?
# Datos de error
ultimo_error: string?
codigo_error: string?
```
### 5.5 initial_state (obligatorio)

**Tipo:** string

**Descripción:**
Nombre del estado en el que comienza toda instancia del Process cuando se ejecuta el
start_command.

**Reglas obligatorias:**


. **Debe existir en** states
# ✓ Válido
initial_state: INICIAL
states:
INICIAL: {...}
# ✗ Inválido
initial_state: PENDIENTE
states:
INICIAL: {...} # PENDIENTE no existe
. **No puede ser un estado terminal**
# ✗ Inválido
initial_state: COMPLETADO
states:
COMPLETADO:
terminal: true
**Razón:** Un estado terminal no tiene transiciones salientes, por lo que el Process quedaría
bloqueado inmediatamente.
**Semántica:**
Cuando se crea una instancia:

```
# Pseudocódigo
instance = ProcessInstance(
process_id=uuid(),
process_name="PagoOrdenProcess",
estado_actual=spec.initial_state, # "INICIAL"
context=initialize_context()
)
```
**Validación:**

```
# Ejemplo válido
initial_state: SOLICITANDO_PAGO
states:
SOLICITANDO_PAGO:
```

```
emit_command: SolicitarPago
on:
PagoAprobado:
transition_to: COMPLETADO
COMPLETADO:
terminal: true
```
### 5.6 states (obligatorio)

**Tipo:** object (mapa de estados)

**Descripción:**
Dene todos los estados posibles del Process y su comportamiento.
**Reglas generales:**
. **Debe contener al menos un estado**
# ✗ Inválido
states: {}
. **Debe contener al menos un estado terminal**
# ✗ Inválido
states:
INICIAL:
emit_command: Algo
on:
Evento:
transition_to: INICIAL # Ciclo infinito sin salida

**5.6.1 Nomenclatura de Estados**

**Formato obligatorio:** UPPER_SNAKE_CASE

**Regex sugerido:**

```
^[A-Z_]+$
```
**Convenciones recomendadas:**


Usar nombres descriptivos del estado lógico
Evitar verbos (el estado ES algo, no hace algo)
Usar participios para estados resultantes de acciones
**Ejemplos:**

```
# ✓ Válidos (nombres que describen estado)
states:
INICIAL: {}
SOLICITANDO_PAGO: {}
ESPERANDO_VERIFICACION: {}
COMPLETADO: {}
CANCELADO: {}
FALLIDO: {}
# ✓ Válidos (participios)
states:
CREADO: {}
APROBADO: {}
RECHAZADO: {}
PROCESADO: {}
# ✗ Inválidos (no siguen formato)
states:
inicial: {} # No está en mayúsculas
Inicial: {} # No está en mayúsculas
esperando-verificacion: {} # Usa guiones
esperandoVerificacion: {} # No es UPPER_SNAKE_CASE
# ⚠ No recomendados (verbos activos)
states:
SOLICITAR_PAGO: {} # Mejor: SOLICITANDO_PAGO
VERIFICAR: {} # Mejor: VERIFICANDO o VERIFICADO
```
**5.6.2 Estructura de un Estado**

Cada estado puede contener los siguientes campos:

```
Campo Tipo Descripción Obligatorio
emit_command string Comando a emitir Mutuamente excluyente
invoke string UseCase a invocar Mutuamente excluyente
terminal boolean Marca estado nal Mutuamente excluyente
```

```
Campo Tipo Descripción Obligatorio
on object Transiciones Opcional (obligatorio si no es terminal)
compensate_with string Compensación (futuro) Opcional
```
## 6. Denición de un Estado - Especicación Detallada

### 6.1 Regla Crítica: Exactamente Un Efecto

**Cada estado debe declarar EXACTAMENTE uno de:**
emit_command
invoke
terminal

**Validación estructural equivalente:**

```
{
"oneOf": [
{"required": ["emit_command"]},
{"required": ["invoke"]},
{"required": ["terminal"]}
]
}
```
**Ejemplos de validación:**

```
# ✓ Válido: Un solo efecto
SOLICITANDO:
emit_command: SolicitarPago
# ✓ Válido: Un solo efecto
EVALUANDO:
invoke: EvaluarPolitica
# ✓ Válido: Estado terminal
COMPLETADO:
terminal: true
# ✗ Inválido: Dos efectos
```

#### PROCESANDO:

```
emit_command: ProcesarPago
invoke: ValidarDatos # No se permite
# ✗ Inválido: Sin efecto
ESPERANDO:
on:
Evento:
transition_to: OTRO # Falta efecto
# ✗ Inválido: Terminal con efecto
FINAL:
terminal: true
emit_command: Notificar # Contradicción
```
### 6.2 emit_command

**Tipo:** string

**Descripción:**
Representa un **comando externo asincrónico** que el Process emite hacia otro agregado, contexto, o
servicio externo.

**6.2.1 Semántica de Ejecución**

**Características:**
. **Fire-and-forget (asíncrono)**
El Process emite el comando y NO espera respuesta inmediata
Continúa su ejecución después de emitir
NO bloquea
. **Se ejecuta UNA SOLA VEZ por entrada al estado**
Cuando el Process transiciona a este estado, emite el comando
Si hay reintentos, debe haber lógica de idempotencia externa
. **Debe registrarse para trazabilidad**
INSERT INTO process_events (
process_id,
event_type,
payload,


```
occurred_at
) VALUES (
'process-123',
'CommandEmitted',
'{"command": "SolicitarPago", "orden_id": "orden-456"}',
NOW()
);
. El comando es responsabilidad externa
El Process NO sabe cómo se ejecuta
El Process NO sabe si tuvo éxito inmediatamente
El Process solo espera un evento de respuesta
```
**6.2.2 Flujo de Ejecución**

1. Process transiciona a estado con emit_command
2. Motor ejecuta: dispatch(comando, payload)
3. Comando se envía a message broker / event bus
4. Process queda en estado ESPERANDO evento
5. Sistema externo procesa comando
6. Sistema externo emite evento de respuesta
7. Process recibe evento
8. Process evalúa transición en `on:`

**6.2.3 Formato del Comando**

**Regex sugerido:**

```
^[A-Z][a-zA-Z0-9]*$
```
**Convención:**
Usar verbos en innitivo
PascalCase
Descriptivo
**Ejemplos:**

```
# ✓ Válidos
emit_command: SolicitarPago
emit_command: EnviarEmailVerificacion
emit_command: ReservarInventario
```

```
emit_command: NotificarCliente
# ✗ Inválidos
emit_command: solicitar_pago # No es PascalCase
emit_command: SOLICITAR_PAGO # No es PascalCase
emit_command: "Solicitar Pago" # Contiene espacio
```
**6.2.4 Payload del Comando**

El payload se construye automáticamente desde el contexto:

```
context:
orden_id: uuid
monto: integer
states:
INICIAL:
emit_command: ProcesarPago
# Implícitamente se pasa:
# ProcesarPago({
# orden_id: context.orden_id,
# monto: context.monto
# })
```
**Nota:** El mapeo exacto del payload es responsabilidad del generador de código.

**6.2.5 Ejemplo Completo**

```
states:
SOLICITANDO_PAGO:
emit_command: ProcesarPago
on:
PagoAprobado:
update_context:
aprobado: true
fecha_aprobacion: now
transition_to: COMPLETADO
PagoRechazado:
update_context:
intentos: increment
```

```
ultimo_error: event.payload.motivo
transition_to: EVALUAR_REINTENTO
```
**Flujo:**
. Process entra en SOLICITANDO_PAGO
. Emite comando ProcesarPago
. Espera evento PagoAprobado o PagoRechazado
. Al recibir evento, ejecuta update_context y transiciona

### 6.3 invoke

**Tipo:** string

**Descripción:**
Representa una **invocación síncrona** a un UseCase dentro del mismo bounded context.

**6.3.1 Diferencias con emit_command**

```
Aspecto emit_command invoke
Sincronía Asíncrono (re-and-forget) Síncrono (espera resultado)
Destino Agregado externo / Servicio UseCase interno
Respuesta Mediante evento posterior Evento inmediato
Contexto Puede ser otro bounded context Mismo bounded context
Trazabilidad Comando enviado Invocación ejecutada
```
**6.3.2 Semántica de Ejecución**

**Características:**
. **Síncrono a nivel lógico**
El motor ejecuta el UseCase y espera su resultado
El UseCase debe emitir un evento que el Process maneja
. **Debe ser determinístico**
Mismos inputs → mismo output
Sin efectos aleatorios no controlados
. **No debe contener lógica de negocio compleja**


```
El UseCase invocado es de coordinación/decisión, no de negocio core
Ejemplo: "EvaluarPoliticaReintento" decide SI/NO, no ejecuta el reintento
. Debe producir exactamente un evento
El evento indica el resultado de la invocación
El Process usa este evento para decidir siguiente transición
```
**6.3.3 Flujo de Ejecución**

1. Process transiciona a estado con invoke
2. Motor ejecuta: result = useCase.execute(context)
3. UseCase emite evento de resultado
4. Motor entrega evento al Process
5. Process evalúa transición en `on:`
6. Process actualiza contexto (opcional)
7. Process transiciona a nuevo estado

**6.3.4 Formato del UseCase**

**Regex sugerido:**

```
^[A-Z][a-zA-Z0-9]*$
```
**Convención:**
Usar verbos que indican decisión o evaluación
PascalCase
Nombres descriptivos de la operación
**Ejemplos:**

```
# ✓ Válidos
invoke: EvaluarPoliticaReintento
invoke: ValidarDisponibilidadInventario
invoke: CalcularDescuentoAplicable
invoke: VerificarLimitesCredito
# ✗ Inválidos
invoke: evaluar_politica # No es PascalCase
invoke: EVALUAR_POLITICA # No es PascalCase
```
**6.3.5 Idempotencia**


Los UseCases invocados **deben ser idempotentes** :

```
# Si el Process se ejecuta dos veces por error de red:
result1 = EvaluarPoliticaReintento(context)
result2 = EvaluarPoliticaReintento(context)
assert result1 == result2 # Mismo resultado
```
**6.3.6 Ejemplo Completo**

```
states:
EVALUAR_REINTENTO:
invoke: EvaluarPoliticaReintento
on:
ReintentoPermitido:
transition_to: SOLICITANDO_PAGO
ReintentoDenegado:
update_context:
ultimo_error: "Reintentos agotados"
transition_to: CANCELADO
```
**Implementación conceptual del UseCase:**

```
class EvaluarPoliticaReintento:
def execute(self, context):
if context.intentos < 3 :
return ReintentoPermitido()
else:
return ReintentoDenegado()
```
### 6.4 terminal

**Tipo:** boolean

**Valor permitido:** true (no tiene sentido false)

**Descripción:**
Marca un estado como **terminal** (nal), indicando que el Process ha concluido su ejecución.

**6.4.1 Reglas Estrictas**


```
. No puede tener on
# ✗ Inválido
COMPLETADO:
terminal: true
on:
AlgoMas: # Los terminales no tienen transiciones
transition_to: OTRO
. No puede tener efectos
# ✗ Inválido
COMPLETADO:
terminal: true
emit_command: Notificar # Los terminales no emiten
. No debe ser el initial_state
# ✗ Inválido
initial_state: COMPLETADO
states:
COMPLETADO:
terminal: true
```
**6.4.2 Semántica**

Cuando un Process llega a un estado terminal:
. **No hay más transiciones posibles**
El Process ha concluido
No reacciona a más eventos
. **La instancia se marca como "inactiva"**
UPDATE process_instances
SET estado_actual = 'COMPLETADO',
is_active = false
WHERE process_id = 'abc-123';
. **Si hay** uniqueness **, se libera la clave**


```
Otra instancia puede crearse con el mismo valor
El índice único condicional lo permite
```
**6.4.3 Estados Terminales Típicos**

**Convenciones comunes:**

```
states:
COMPLETADO:
terminal: true
CANCELADO:
terminal: true
FALLIDO:
terminal: true
RECHAZADO:
terminal: true
EXPIRADO:
terminal: true
```
**6.4.4 Mínimo de Estados Terminales**

**Regla de validación:**
Todo Process debe tener **al menos un estado terminal**.

```
# ✗ Inválido: Sin estado terminal
states:
INICIAL:
emit_command: Algo
on:
Evento:
transition_to: INICIAL # Ciclo infinito
# ✓ Válido: Tiene estado terminal
states:
INICIAL:
emit_command: Algo
on:
Exito:
```

```
transition_to: COMPLETADO
Error:
transition_to: FALLIDO
COMPLETADO:
terminal: true
FALLIDO:
terminal: true
```
**6.4.5 Ejemplo Completo**

```
states:
SOLICITANDO_PAGO:
emit_command: ProcesarPago
on:
PagoAprobado:
transition_to: COMPLETADO
PagoRechazado:
update_context:
intentos: increment
transition_to: EVALUAR_REINTENTO
EVALUAR_REINTENTO:
invoke: EvaluarPoliticaReintento
on:
ReintentoPermitido:
transition_to: SOLICITANDO_PAGO
ReintentoDenegado:
transition_to: CANCELADO
COMPLETADO:
terminal: true
CANCELADO:
terminal: true
```
## 7. Transiciones (on)


**Tipo:** object (mapa de eventos → transiciones)

**Descripción:**
Dene cómo el Process reacciona a eventos y qué transiciones de estado ejecuta.

### 7.1 Estructura

```
on:
EventoNombre:
update_context: # Opcional
campo: valor
transition_to: ESTADO_DESTINO # Obligatorio
```
### 7.2 Reglas

**Nomenclatura de Eventos:**
Debe comenzar con letra mayúscula
PascalCase
Preferiblemente en pasado (indica que algo ocurrió)
**Regex sugerido:**

```
^[A-Z][a-zA-Z0-9]*$
```
**Ejemplos:**

```
# ✓ Válidos (participio pasado)
on:
PagoAprobado: {...}
EmailEnviado: {...}
VerificacionCompletada: {...}
ClienteCreado: {...}
# ✓ Válidos (sustantivo)
on:
ErrorValidacion: {...}
TimeoutExpirado: {...}
# ✗ Inválidos
on:
```

```
pago_aprobado: {...} # No es PascalCase
PAGO_APROBADO: {...} # No es PascalCase
"Pago Aprobado": {...} # Contiene espacio
```
### 7.3 Campos de la Transición

**7.3.1 transition_to (obligatorio)**

**Tipo:** string

**Descripción:**
Nombre del estado al que el Process debe transicionar cuando recibe el evento.
**Validación:**
El estado referenciado **debe existir** en states
# ✓ Válido
states:
INICIAL:
emit_command: Algo
on:
Evento:
transition_to: COMPLETADO # Existe en states
COMPLETADO:
terminal: true
# ✗ Inválido
states:
INICIAL:
emit_command: Algo
on:
Evento:
transition_to: INEXISTENTE # No existe

**7.3.2 update_context (opcional)**

**Tipo:** object

**Descripción:**
Mapa declarativo de modicaciones al contexto que se ejecutan **antes** de la transición.


**Ver sección 8 para detalles completos.**

### 7.4 Múltiples Eventos

Un estado puede reaccionar a múltiples eventos:

```
ESPERANDO:
on:
Evento1:
transition_to: ESTADO_A
Evento2:
update_context:
campo: valor
transition_to: ESTADO_B
Evento3:
transition_to: ESTADO_C
```
### 7.5 Semántica de Ejecución

Cuando el Process recibe un evento:
. **Verica que está en estado correcto**
if event.name not in current_state.on:
raise UnexpectedEventException
. **Ejecuta** update_context (si existe)
if transition.update_context:
apply_updates(context, transition.update_context)
. **Cambia el estado**
process.estado_actual = transition.transition_to
. **Persiste cambios**


```
UPDATE process_instances
SET estado_actual = ?,
contexto_serializado = ?,
fecha_actualizacion = NOW()
WHERE process_id = ?;
. Registra el evento (auditoría)
INSERT INTO process_events (...);
```
### 7.6 Ejemplo Completo

```
states:
SOLICITANDO_PAGO:
emit_command: ProcesarPago
on:
PagoAprobado:
update_context:
aprobado: true
fecha_aprobacion: now
transition_to: COMPLETADO
PagoRechazado:
update_context:
intentos: increment
ultimo_error: event.payload.motivo
fecha_ultimo_intento: now
transition_to: EVALUAR_REINTENTO
TimeoutPago:
update_context:
ultimo_error: "Timeout en procesamiento"
transition_to: CANCELADO
```
## 8. update_context - Especicación Exhaustiva

**Tipo:** object (mapa declarativo)


**Descripción:**
Dene modicaciones al contexto del Process que ocurren durante una transición.

### 8.1 Restricciones Fundamentales

**Solo puede:**
. **Modicar campos existentes**
. **No crear nuevos campos**
. **No eliminar campos
Garantías:**
Evaluación determinística
Sin efectos secundarios
Sin lógica condicional compleja

### 8.2 Operaciones No Permitidas

```
# ✗ Inválido: Crear campo nuevo
update_context:
campo_nuevo: "valor" # campo_nuevo no existe en context
# ✗ Inválido: Expresiones complejas
update_context:
total: campo_a + campo_b
# ✗ Inválido: Condicionales
update_context:
estado: if(intentos > 3, "fallido", "activo")
# ✗ Inválido: Referencias cruzadas
update_context:
campo_a: campo_b
```
### 8.3 Operaciones Permitidas

**8.3.1 Operación:** now

**Aplicable a:** datetime o datetime?

**Sintaxis:**


```
update_context:
campo_datetime: now
```
**Semántica:**
Asigna el **timestamp UTC** exacto del momento de la transición
El valor es determinista para una ejecución dada
Formato: ISO 8601 / Unix timestamp (dependiendo de implementación)
**Ejemplos:**

```
context:
fecha_aprobacion: datetime?
fecha_ultimo_intento: datetime
timestamp_evento: datetime?
states:
ALGUNO:
on:
Evento:
update_context:
fecha_aprobacion: now # ✓ Válido
fecha_ultimo_intento: now # ✓ Válido
timestamp_evento: now # ✓ Válido
transition_to: OTRO
```
**Restricciones:**

```
context:
intentos: integer
nombre: string
update_context:
intentos: now # ✗ Inválido: intentos no es datetime
nombre: now # ✗ Inválido: nombre no es datetime
```
**Valor generado (ejemplo):**

```
{
"fecha_aprobacion": "2026-02-15T14:30:00.000Z"
}
```

**8.3.2 Operación:** increment

**Aplicable a:** integer

**Sintaxis:**

```
update_context:
campo_integer: increment
```
**Semántica:**
Incrementa el valor actual en 1
Si el campo es null (nullable), se establece en 1

**Ejemplos:**

```
context:
intentos: integer
reintentos: integer?
states:
ALGUNO:
on:
Error:
update_context:
intentos: increment # ✓ Válido
reintentos: increment # ✓ Válido
transition_to: REINTENTO
```
**Comportamiento:**

```
# Caso 1: Campo tiene valor
context.intentos = 2
apply_update("intentos", "increment")
# Resultado: context.intentos = 3
# Caso 2: Campo es null (nullable)
context.reintentos = None
apply_update("reintentos", "increment")
# Resultado: context.reintentos = 1
```
**Restricciones:**


```
context:
nombre: string
aprobado: boolean
update_context:
nombre: increment # ✗ Inválido: nombre no es integer
aprobado: increment # ✗ Inválido: aprobado no es integer
```
**Nota:** No existe decrement en v0.1. Si necesitas decrementar, debes usar valores literales o esperar
v1.x.

**8.3.3 Valores Literales**

**Aplicable a:** Todos los tipos
**Sintaxis:**

```
update_context:
campo_boolean: true
campo_string: "valor literal"
campo_integer: 42
campo_uuid: "550e8400-e29b-41d4-a716-446655440000"
```
**Ejemplos por tipo:
Booleanos:**

```
context:
aprobado: boolean
verificado: boolean?
update_context:
aprobado: true # ✓ Válido
verificado: false # ✓ Válido
```
**Strings:**

```
context:
estado: string
ultimo_error: string?
```

```
update_context:
estado: "procesado" # ✓ Válido
ultimo_error: "Fondos insuficientes" # ✓ Válido
```
**Enteros:**

```
context:
intentos: integer
reintentos_maximos: integer
update_context:
intentos: 0 # ✓ Válido: Reset
reintentos_maximos: 5 # ✓ Válido: Configura límite
```
**UUIDs:**

```
context:
transaccion_id: uuid?
update_context:
transaccion_id: "550e8400-e29b-41d4-a716-446655440000" # ✓ Válido
```
**Nota sobre UUIDs:** Se recomienda **obtener UUIDs desde eventos** en lugar de usar literales:

```
# ✓ Mejor práctica
update_context:
transaccion_id: event.payload.transaccion_id
# ⚠ No recomendado
update_context:
transaccion_id: "uuid-hardcodeado"
```
**8.3.4 Valores desde Evento**

**Sintaxis:**

```
update_context:
campo: event.payload.subcampo
```

**Descripción:**
Permite copiar valores del payload del evento que disparó la transición al contexto del Process.
**Reglas:**
. **El campo referenciado debe existir en la denición formal del evento**
# events.yaml
events:
PagoRechazado:
payload:
orden_id: uuid
motivo: string
codigo_error: integer
# process.yaml
update_context:
ultimo_error: event.payload.motivo # ✓ Válido
codigo: event.payload.codigo_error # ✓ Válido
inexistente: event.payload.campo_falso # ✗ Inválido
. **El tipo debe coinciir con el tipo del campo de contexto**

```
. No se permite acceso arbitrario a propiedades no declaradas
```
```
# events.yaml
events:
Evento:
payload:
valor_string: string
valor_int: integer
# process.yaml
context:
campo_string: string
campo_int: integer
update_context:
campo_string: event.payload.valor_string # ✓ Válido: tipos coinci
campo_int: event.payload.valor_int # ✓ Válido: tipos coinci
campo_string: event.payload.valor_int # ✗ Inválido: tipos no c
```

```
# ✗ Inválido: Acceso dinámico
update_context:
campo: event.payload[dynamic_key]
# ✗ Inválido: Path anidado arbitrario
update_context:
campo: event.payload.nivel1.nivel2.nivel3
```
**Ejemplos completos:**

```
# Definición de eventos
events:
PagoRechazado:
payload:
orden_id: uuid
motivo: string
codigo_error: integer
timestamp: datetime
# Definición de contexto
context:
orden_id: uuid
ultimo_error: string?
codigo_error: integer?
fecha_error: datetime?
# Uso en transición
states:
PROCESANDO:
on:
PagoRechazado:
update_context:
ultimo_error: event.payload.motivo
codigo_error: event.payload.codigo_error
fecha_error: event.payload.timestamp
transition_to: FALLIDO
```
**Payload del evento en runtime:**

```
{
"event_type": "PagoRechazado",
"payload": {
```

```
"orden_id": "orden-123",
"motivo": "Fondos insuficientes",
"codigo_error": 4001,
"timestamp": "2026-02-15T14:30:00.000Z"
}
}
```
**Contexto después de update_context:**

```
{
"orden_id": "orden-123",
"ultimo_error": "Fondos insuficientes",
"codigo_error": 4001,
"fecha_error": "2026-02-15T14:30:00.000Z"
}
```
### 8.4 Combinación de Operaciones

Puedes combinar múltiples operaciones en un solo update_context:

```
update_context:
# Operación especial
intentos: increment
fecha_ultimo_intento: now
# Literal
en_proceso: false
# Desde evento
ultimo_error: event.payload.motivo
codigo_error: event.payload.codigo
```
**Orden de ejecución:**
El orden de las operaciones en el YAML **no importa**
Todas se aplican **atómicamente** en una sola transacción
No hay dependencias entre operaciones (no puedes hacer campo_b: campo_a)

### 8.5 Validaciones en Parse Time


El validador debe vericar:
. **Campos existen en context:**
for field in update_context.keys():
assert field in context, f"Campo {field} no existe en context"
. **Operaciones compatibles con tipo:**
if update.value == "now":
assert context[field].type in ["datetime", "datetime?"]
if update.value == "increment":
assert context[field].type == "integer"
. **Valores literales tienen tipo correcto:**
if context[field].type == "boolean":
assert update.value in [true, false]
if context[field].type == "integer":
assert isinstance(update.value, int)
. **Paths de evento existen en denición de evento:**
if update.value.startswith("event.payload."):
field_path = update.value.split(".")[- 1 ]
assert field_path in event_definition.payload

### 8.6 Ejemplo Exhaustivo

```
# Definición de eventos
events:
PagoRechazado:
payload:
orden_id: uuid
motivo: string
codigo: integer
monto_fallido: integer
```

```
# Contexto del Process
context:
orden_id: uuid
intentos: integer
aprobado: boolean
fecha_ultimo_intento: datetime?
ultimo_error: string?
codigo_error: integer?
monto_total: integer
# Estado con update_context complejo
states:
PROCESANDO_PAGO:
emit_command: ProcesarPago
on:
PagoRechazado:
update_context:
# Incrementar contador
intentos: increment
# Timestamp actual
fecha_ultimo_intento: now
# Valores literales
aprobado: false
# Desde evento
ultimo_error: event.payload.motivo
codigo_error: event.payload.codigo
monto_total: event.payload.monto_fallido
transition_to: EVALUAR_REINTENTO
```
## 9. Compensación (Preparado para v1.1)

**Estado:** Diseñado pero **no obligatorio en v0.1**

### 9.1 Estructura Futura


```
states:
RESERVANDO_INVENTARIO:
invoke: ReservarStock
compensate_with: LiberarStock
on:
StockReservado:
transition_to: PROCESANDO_PAGO
StockInsuficiente:
transition_to: CANCELADO
```
### 9.2 Reglas Previstas

```
. Solo aplicable a estados con efecto
Estados con emit_command o invoke
No aplica a estados terminales
. Debe ejecutarse en orden inverso
Si hay múltiples estados compensables en la historia del Process
Ejecutar compensaciones en orden LIFO (stack)
. No obligatoria
Es un mecanismo opcional de rollback
Útil para sagas distribuidas
```
### 9.3 Semántica Esperada (v1.1)

Cuando un Process necesita hacer rollback:
. **Identica estados ejecutados con compensación**
SELECT state_name, compensate_with
FROM process_events
WHERE process_id =?
AND compensate_with IS NOT NULL
ORDER BY occurred_at DESC;
. **Ejecuta compensaciones en orden inverso**


```
for state in reversed(compensable_states):
execute_compensation(state.compensate_with)
. Transiciona a estado de compensación
transition_to: COMPENSADO
. Emite evento nal
emit: ProcessCompensated
```
### 9.4 Ejemplo Conceptual

```
processes:
ReservaHotelProcess:
states:
RESERVANDO_VUELO:
invoke: ReservarVuelo
compensate_with: CancelarVuelo
on:
VueloReservado:
transition_to: RESERVANDO_HOTEL
RESERVANDO_HOTEL:
invoke: ReservarHabitacion
compensate_with: CancelarHabitacion
on:
HabitacionReservada:
transition_to: PROCESANDO_PAGO
HabitacionNoDisponible:
# Trigger compensación
transition_to: COMPENSANDO
COMPENSANDO:
# Sistema ejecuta automáticamente:
# 1. CancelarHabitacion (no se ejecutó)
# 2. CancelarVuelo (se ejecutó, necesita rollback)
terminal: true
```

**Nota:** Esta funcionalidad **no está implementada en v0.1**. El modelo está diseñado para soportarla sin
romper compatibilidad.

## 10. Reglas Globales de Validación

El validador debe vericar estas reglas **antes** de permitir uso de la spec:

### 10.1 V1: initial_state Válido

**Regla:**
initial_state debe existir en states
initial_state no puede ser terminal

**Validación:**

```
assert spec.initial_state in spec.states, \
f"initial_state '{spec.initial_state}' no existe en states"
assert not spec.states[spec.initial_state].terminal, \
f"initial_state '{spec.initial_state}' no puede ser terminal"
```
**Ejemplos:**

```
# ✓ Válido
initial_state: INICIAL
states:
INICIAL:
emit_command: Algo
# ✗ Inválido: No existe
initial_state: INEXISTENTE
states:
INICIAL: {...}
# ✗ Inválido: Es terminal
initial_state: COMPLETADO
states:
COMPLETADO:
terminal: true
```

### 10.2 V2: transition_to Válido

**Regla:**
Todos los transition_to deben referenciar estados existentes

**Validación:**

**Ejemplos:**

```
# ✓ Válido
states:
INICIAL:
on:
Evento:
transition_to: COMPLETADO
COMPLETADO:
terminal: true
# ✗ Inválido
states:
INICIAL:
on:
Evento:
transition_to: INEXISTENTE # No existe
```
### 10.3 V3: Al Menos Un Estado Terminal

**Regla:**
Debe existir al menos un estado con terminal: true

**Validación:**

```
for state_name, state in spec.states.items():
if state.on:
for event_name, transition in state.on.items():
assert transition.transition_to in spec.states, \
f"Estado '{state_name}', evento '{event_name}': " \
f"transition_to '{transition.transition_to}' no existe"
```

```
terminal_states = [
name for name, state in spec.states.items()
if state.terminal
]
assert len(terminal_states) > 0 , \
"Debe existir al menos un estado terminal"
```
**Ejemplos:**

```
# ✓ Válido
states:
INICIAL:
emit_command: Algo
on:
Exito:
transition_to: COMPLETADO
COMPLETADO:
terminal: true
# ✗ Inválido: Sin terminales
states:
INICIAL:
emit_command: Algo
on:
Evento:
transition_to: INICIAL # Ciclo infinito
```
### 10.4 V4: Estados Alcanzables

**Regla:**
Todos los estados deben ser alcanzables desde initial_state
No deben existir estados "huérfanos"
**Algoritmo (DFS):**

```
def find_reachable_states(spec):
visited = set()
queue = [spec.initial_state]
```

```
while queue:
current = queue.pop( 0 )
if current in visited:
continue
visited.add(current)
state = spec.states[current]
if state.on:
for transition in state.on.values():
queue.append(transition.transition_to)
return visited
reachable = find_reachable_states(spec)
all_states = set(spec.states.keys())
unreachable = all_states - reachable
assert len(unreachable) == 0 , \
f"Estados inalcanzables: {unreachable}"
```
**Ejemplos:**

```
# ✓ Válido: Todos alcanzables
initial_state: A
states:
A:
on:
E1: {transition_to: B}
B:
on:
E2: {transition_to: C}
C:
terminal: true
# ✗ Inválido: Estado D inalcanzable
initial_state: A
states:
A:
on:
E1: {transition_to: B}
B:
```

```
terminal: true
D: # ← Inalcanzable
terminal: true
```
### 10.5 V5: Ciclos Sin Salida Externa

**Regla:**
No puede haber ciclos innitos sin posibilidad de llegar a estado terminal
**Algoritmo:**

**Ejemplos:**

```
def has_path_to_terminal(state_name, spec, visited=None):
if visited is None:
visited = set()
if state_name in visited:
return False # Ciclo detectado
visited.add(state_name)
state = spec.states[state_name]
if state.terminal:
return True
if not state.on:
return False
for transition in state.on.values():
if has_path_to_terminal(transition.transition_to, spec, visited.c
return True
return False
for state_name in spec.states:
assert has_path_to_terminal(state_name, spec), \
f"Estado '{state_name}' no tiene camino a estado terminal"
```

```
# ✓ Válido: Ciclo con salida
states:
A:
on:
Reintentar: {transition_to: A}
Exito: {transition_to: B}
B:
terminal: true
# ✗ Inválido: Ciclo sin salida
states:
A:
on:
Evento: {transition_to: B}
B:
on:
Evento: {transition_to: A} # Ciclo infinito
```
### 10.6 V6: start_command Único Globalmente

**Regla:**
No pueden existir dos Processes con el mismo start_command

**Validación:**

```
start_commands = {}
for process_name, process in spec.processes.items():
cmd = process.start_command
if cmd in start_commands:
raise ValidationError(
f"start_command '{cmd}' duplicado: "
f"{start_commands[cmd]} y {process_name}"
)
start_commands[cmd] = process_name
```
**Ejemplos:**


```
# ✓ Válido
processes:
PagoProcess:
start_command: IniciarPago
OnboardingProcess:
start_command: IniciarOnboarding
# ✗ Inválido: Comando duplicado
processes:
Process1:
start_command: IniciarProceso
Process2:
start_command: IniciarProceso # Duplicado
```
### 10.7 V7: Campos update_context Existen

**Regla:**
Todos los campos referenciados en update_context deben existir en context

**Validación:**

### 10.8 V8: Operaciones Compatibles con Tipo

**Regla:**
Las operaciones en update_context deben ser compatibles con el tipo del campo

**Validación:**

```
for state_name, state in spec.states.items():
if state.on:
for event_name, transition in state.on.items():
if transition.update_context:
for field in transition.update_context.keys():
assert field in spec.context, \
f"Estado '{state_name}', evento '{event_name}': "
f"Campo '{field}' no existe en context"
```

### 10.9 V9: Eventos No Manejados (Warning)

**Regla:**
Si un evento esperado nunca es emitido → Warning
Si un evento emitido nunca es manejado → Warning
**Nota:** Esto es un **warning** , no un error bloqueante.
**Validación:**

```
# Eventos esperados
expected_events = set()
for state in spec.states.values():
if state.on:
expected_events.update(state.on.keys())
# Eventos emitidos (requiere info externa de UseCases y Commands)
emitted_events = get_events_from_usecases_and_commands()
# Warnings
unhandled = emitted_events - expected_events
if unhandled:
warn(f"Eventos emitidos pero no manejados: {unhandled}")
never_emitted = expected_events - emitted_events
if never_emitted:
warn(f"Eventos esperados pero nunca emitidos: {never_emitted}")
```
```
for field, operation in transition.update_context.items():
field_type = spec.context[field]
if operation == "now":
assert field_type in ["datetime", "datetime?"], \
f"'now' solo aplicable a datetime, campo '{field}' es {field_
if operation == "increment":
assert field_type == "integer", \
f"'increment' solo aplicable a integer, campo '{field}' es {f
```

## 11. Modelo de Persistencia

### 11.1 Estructura Recomendada

**11.1.1 Tabla process_instances**

**DDL (PostgreSQL):**

```
CREATE TABLE process_instances (
process_id UUID PRIMARY KEY,
process_name VARCHAR( 100 ) NOT NULL,
estado_actual VARCHAR( 50 ) NOT NULL,
contexto_serializado JSONB NOT NULL,
uniqueness_key VARCHAR( 255 ),
fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
fecha_actualizacion TIMESTAMP NOT NULL DEFAULT NOW(),
is_active BOOLEAN NOT NULL DEFAULT true,
-- Índice para queries por tipo y estado
INDEX idx_process_type_state (process_name, estado_actual),
-- Índice para queries por estado activo
INDEX idx_active_processes (is_active) WHERE is_active = true,
-- Índice único condicional para unicidad
UNIQUE INDEX uniq_process_key (process_name, uniqueness_key)
WHERE is_active = true AND uniqueness_key IS NOT NULL
);
```
**Campos:**

```
Campo Tipo Descripción
process_id UUID Identicador único de la instancia
process_name VARCHAR(100) Nombre del Process (ej: "PagoOrdenProcess")
estado_actual VARCHAR(50) Estado actual (ej: "PROCESANDO_PAGO")
contexto_serializado JSONB Contexto completo en formato JSON
uniqueness_key VARCHAR(255) Valor del campo de unicidad (si aplica)
fecha_creacion TIMESTAMP Cuándo se creó la instancia
```

```
Campo Tipo Descripción
fecha_actualizacion TIMESTAMP Última transición
is_active BOOLEAN false si está en estado terminal
```
**Índice único condicional:**
El índice uniq_process_key es **crítico** para garantizar:

```
"No pueden existir dos instancias activas con el mismo valor de unicidad."
-- Solo aplica cuando:
-- 1. La instancia está activa (is_active = true)
-- 2. Hay valor de unicidad (uniqueness_key IS NOT NULL)
CREATE UNIQUE INDEX uniq_process_key
ON process_instances (process_name, uniqueness_key)
WHERE is_active = true AND uniqueness_key IS NOT NULL;
```
**Comportamiento:**

```
-- Primera instancia
INSERT INTO process_instances (
process_id, process_name, uniqueness_key, estado_actual, ...
) VALUES (
'id-1', 'PagoProcess', 'orden-123', 'INICIAL', ...
);
-- ✓ Éxito
-- Segunda instancia con misma clave (mientras está activa)
INSERT INTO process_instances (
process_id, process_name, uniqueness_key, estado_actual, ...
) VALUES (
'id-2', 'PagoProcess', 'orden-123', 'INICIAL', ...
);
-- ✗ Error: Violación de índice único
-- Primera instancia llega a terminal
UPDATE process_instances
SET estado_actual = 'COMPLETADO', is_active = false
WHERE process_id = 'id-1';
-- Ahora sí se permite nueva instancia
```

```
INSERT INTO process_instances (
process_id, process_name, uniqueness_key, estado_actual, ...
) VALUES (
'id-3', 'PagoProcess', 'orden-123', 'INICIAL', ...
);
-- ✓ Éxito: La anterior ya no está activa
```
**11.1.2 Tabla process_events (Auditoría)**

**DDL (PostgreSQL):**

```
CREATE TABLE process_events (
event_id UUID PRIMARY KEY,
process_id UUID NOT NULL REFERENCES process_instances(process_id),
event_type VARCHAR( 100 ) NOT NULL,
payload JSONB NOT NULL,
previous_state VARCHAR( 50 ),
new_state VARCHAR( 50 ),
occurred_at TIMESTAMP NOT NULL DEFAULT NOW(),
-- Índice para queries por proceso
INDEX idx_process_events (process_id, occurred_at DESC),
-- Índice para queries por tipo de evento
INDEX idx_event_type (event_type, occurred_at DESC)
);
```
**Campos:**

```
Campo Tipo Descripción
event_id UUID ID único del evento registrado
process_id UUID FK a process_instances
event_type VARCHAR(100) Nombre del evento (ej: "PagoAprobado")
payload JSONB Datos del evento
previous_state VARCHAR(50) Estado antes de la transición
new_state VARCHAR(50) Estado después de la transición
occurred_at TIMESTAMP Cuándo ocurrió
```
**Propósito:**


. **Auditoría completa:**
Cada transición queda registrada
Trazabilidad de eventos
. **Replay de eventos:**
Reconstruir estado del Process en cualquier punto
Debugging de transiciones
. **Análisis:**
Tiempos entre estados
Eventos más comunes
Paths más frecuentes
**Ejemplo de registro:**

```
{
"event_id": "evt-456",
"process_id": "proc-123",
"event_type": "PagoAprobado",
"payload": {
"orden_id": "orden-789",
"transaccion_id": "txn-abc",
"monto": 15000
},
"previous_state": "PROCESANDO_PAGO",
"new_state": "COMPLETADO",
"occurred_at": "2026-02-15T14:30:00.000Z"
}
```
### 11.2 Atomicidad Requerida

**Cada transición debe ejecutarse dentro de una transacción:**

```
@transactional
def handle_event(process_id, event):
# 1. Obtener instancia con lock
instance = get_process_instance_for_update(process_id)
# 2. Validar estado
if not can_handle_event(instance, event):
```

```
raise UnexpectedEventException
# 3. Aplicar update_context
new_context = apply_updates(instance.context, event)
# 4. Obtener nuevo estado
new_state = get_transition_target(instance, event)
# 5. Actualizar instancia
update_process_instance(
process_id=process_id,
new_state=new_state,
new_context=new_context,
is_active=(new_state not in terminal_states)
)
# 6. Registrar evento
insert_process_event(
process_id=process_id,
event_type=event.type,
payload=event.payload,
previous_state=instance.state,
new_state=new_state
)
# 7. Commit implícito
```
**Garantías:**
Si cualquier paso falla → Rollback completo
No hay estados intermedios inconsistentes
La base de datos reeja siempre el estado actual correcto

### 11.3 Consultas Típicas

**Obtener instancia activa por clave de unicidad:**

```
SELECT *
FROM process_instances
WHERE process_name = 'PagoOrdenProcess'
AND uniqueness_key = 'orden-123'
AND is_active = true;
```

**Obtener historial completo de transiciones:**

```
SELECT
event_type,
previous_state,
new_state,
occurred_at
FROM process_events
WHERE process_id = 'proc-123'
ORDER BY occurred_at ASC;
```
**Contar instancias por estado:**

```
SELECT
estado_actual,
COUNT(*) as total
FROM process_instances
WHERE process_name = 'PagoOrdenProcess'
AND is_active = true
GROUP BY estado_actual;
```
**Instancias bloqueadas (sin transición reciente):**

```
SELECT *
FROM process_instances
WHERE is_active = true
AND fecha_actualizacion < NOW() - INTERVAL '1 hour'
ORDER BY fecha_actualizacion ASC;
```
## 12. Testing Requerido

### 12.1 Principio Fundamental

**Un Process debe poder ejecutarse como máquina de estados pura:**
Sin infraestructura externa
Sin base de datos
Sin servicios reales
Mediante inyección de eventos


### 12.2 Testabilidad como Propiedad

El Process debe cumplir:

```
# Dado un estado inicial y un evento
initial_state = "PROCESANDO"
event = PagoAprobado(orden_id="123")
# Cuando se maneja el evento
new_state, new_context = process.handle(event)
# Entonces el resultado es determinístico
assert new_state == "COMPLETADO"
assert new_context.aprobado == True
```
### 12.3 Ejemplo de Test

```
def test_pago_exitoso():
# Arrange
process = PagoOrdenProcess(
orden_id="orden-123",
initial_context={
"orden_id": "orden-123",
"intentos": 0 ,
"aprobado": None
}
)
# Act: Inicia en estado INICIAL
process.start()
assert process.state == "SOLICITANDO_PAGO"
# Act: Recibe evento de éxito
process.handle(PagoAprobado(orden_id="orden-123"))
# Assert
assert process.state == "COMPLETADO"
assert process.context["aprobado"] == True
assert process.context["fecha_aprobacion"] is not None
```
```
def test_pago_con_reintentos():
```

```
# Arrange
process = PagoOrdenProcess(orden_id="orden-456")
process.start()
# Act: Primer rechazo
process.handle(PagoRechazado(
orden_id="orden-456",
motivo="Fondos insuficientes"
))
# Assert: Transiciona a evaluación
assert process.state == "EVALUAR_REINTENTO"
assert process.context["intentos"] == 1
assert process.context["ultimo_error"] == "Fondos insuficientes"
# Act: Se permite reintento
process.handle(ReintentoPermitido())
# Assert: Vuelve a solicitar pago
assert process.state == "SOLICITANDO_PAGO"
# Act: Segundo rechazo
process.handle(PagoRechazado(
orden_id="orden-456",
motivo="Tarjeta bloqueada"
))
# Assert
assert process.state == "EVALUAR_REINTENTO"
assert process.context["intentos"] == 2
# Act: Se deniega reintento
process.handle(ReintentoDenegado())
# Assert: Proceso cancela
assert process.state == "CANCELADO"
assert process.is_terminal == True
```
### 12.4 Property-Based Testing

```
from hypothesis import given, strategies as st
```

```
@given(
intentos=st.integers(min_value= 0 , max_value= 10 ),
limite=st.integers(min_value= 1 , max_value= 5 )
)
def test_politica_reintento_determinista(intentos, limite):
"""La política de reintentos debe ser determinista"""
context1 = {"intentos": intentos, "limite": limite}
context2 = {"intentos": intentos, "limite": limite}
result1 = EvaluarPoliticaReintento(context1)
result2 = EvaluarPoliticaReintento(context2)
# Mismo contexto → mismo resultado
assert result1 == result2
# Resultado predecible
if intentos < limite:
assert isinstance(result1, ReintentoPermitido)
else:
assert isinstance(result1, ReintentoDenegado)
```
## 13. Contrato de Generación para IA

### 13.1 Principios Obligatorios

La IA que genere código a partir de esta Spec **debe:**
. **Respetar todos los tipos declarados**
uuid → UUID/GUID en el lenguaje target
integer → int/long/i64
boolean → bool/boolean
datetime → DateTime/Timestamp
string → string/String
. **No agregar lógica no especicada**
No inferir validaciones adicionales
No agregar campos al contexto
No modicar transiciones


```
. No introducir efectos implícitos
No emitir eventos no declarados
No hacer llamadas a servicios no mencionados
No crear side-effects ocultos
. Generar código determinístico
Misma spec → mismo código (módulo nombres de variables)
Sin randomización
Sin timestamps en nombres
. Preservar trazabilidad
Cada evento debe registrarse
Cada transición debe auditarse
Estados y contexto deben ser observables
```
### 13.2 Estructura de Código Generado

**Para cada Process, generar:**

```
# 1. Entidad ProcessInstance
class PagoOrdenProcessInstance:
process_id: UUID
estado_actual: str
context: PagoOrdenContext
fecha_creacion: datetime
fecha_actualizacion: datetime
# 2. Context dataclass
@dataclass
class PagoOrdenContext:
orden_id: UUID
intentos: int
aprobado: Optional[bool]
fecha_aprobacion: Optional[datetime]
# 3. Enum de estados
class PagoOrdenState(Enum):
INICIAL = "INICIAL"
EVALUAR_REINTENTO = "EVALUAR_REINTENTO"
COMPLETADO = "COMPLETADO"
CANCELADO = "CANCELADO"
```

```
# 4. State Machine
class PagoOrdenStateMachine:
def handle_event(self, instance, event):
# Validar estado permite este evento
# Aplicar update_context
# Obtener nuevo estado
# Persistir cambios
# Registrar evento
pass
# 5. Command Dispatcher
class PagoOrdenCommandDispatcher:
def emit_command(self, command_name, payload):
# Publicar en message broker
pass
# 6. Event Subscribers
@subscribe_to("PagoAprobado")
def on_pago_aprobado(event):
# Obtener instancia
# Llamar state_machine.handle_event
pass
```
### 13.3 Desviaciones Prohibidas

**Cualquier desviación de estas reglas rompe el contrato del modelo:**

```
# ❌ PROHIBIDO: Agregar validación no especificada
def handle_event(self, instance, event):
if instance.context.intentos > 100 : # No está en la spec
raise TooManyAttemptsException
# ❌ PROHIBIDO: Modificar contexto fuera de update_context
def emit_command(self, command):
self.context.timestamp = datetime.now() # No declarado
# ❌ PROHIBIDO: Lógica condicional no declarada
def transition_to_next_state(self, event):
if random.random() > 0.5: # No determinístico
return "STATE_A"
else:
return "STATE_B"
```

```
# ❌ PROHIBIDO: Side-effects ocultos
def on_state_enter(self, state):
log.info(f"Entered {state}") # Ok
send_email_notification() # No especificado
```
## 14. Compatibilidad Futura

### 14.1 Evolución Prevista

La v0.1 está diseñada para evolucionar hacia:
**v1.1 - Compensaciones:**

```
states:
RESERVANDO:
invoke: ReservarInventario
compensate_with: LiberarInventario
```
**v1.2 - Timeouts:**

```
states:
ESPERANDO:
timeout: 10m
on_timeout:
transition_to: CANCELADO
```
**v1.3 - Paralelismo:**

```
states:
PROCESANDO:
parallel:
```
- emit_command: TareaA
- emit_command: TareaB
join_on:
- TareaACompletada
- TareaBCompletada

**v1.4 - Sub-procesos:**


```
states:
COMPLEJO:
subprocess: SubProcess
on:
SubProcessCompletado:
transition_to: SIGUIENTE
```
### 14.2 Garantías de Compatibilidad

**Toda spec v0.1 válida debe seguir siendo válida en versiones futuras.
Principios:**
. **Aditivo, nunca destructivo**
Nuevas primitivas se agregan
Primitivas existentes no cambian semántica
. **Opt-in para nuevas features**
Features nuevas requieren sintaxis explícita
Sin cambios implícitos en comportamiento
. **Versionado explícito**
spec_version: 0.1 # Opcional pero recomendado
. **Deprecation gradual**
Si algo debe cambiar, se marca deprecated
Se mantiene por al menos 2 versiones major

## 15. Conclusión

Este documento dene **completamente** la estructura, semántica, y persistencia necesarias para una
**implementación industrial** del sistema de Process declarativos v0.1.

### 15.1 Capacidades Provistas

Con esta especicación, se puede:


✅ **Parsear** archivos YAML de Process
✅ **Validar** estructura y semántica
✅ **Generar** código determinístico
✅ **Persistir** instancias con garantías ACID
✅ **Ejecutar** state machines puras
✅ **Testear** sin infraestructura
✅ **Auditar** transiciones completas
✅ **Escalar** hacia features avanzadas

### 15.2 Obligaciones del Implementador

**Cualquier implementación compatible debe:**
. Cumplir estrictamente estas reglas
. Validar todas las restricciones listadas
. Generar código que preserve semántica
. Mantener atomicidad transaccional
. Proveer trazabilidad completa

### 15.3 Contacto y Evolución

Para propuestas de cambio a la spec:
Discutir en el repositorio del proyecto
Proponer mediante RFC formal
Demostrar compatibilidad hacia atrás

**FIN DEL DOCUMENTO**


