# EVENTS.md — Especicación Formal de

# Eventos v0.

# 1. Propósito

Este documento dene el modelo formal de **Eventos** utilizados por los Process.

Mientras que el Process dene la máquina de estados, el Event dene la estructura tipada de las
entradas que pueden producir transiciones.

El objetivo es:

```
Formalizar el contrato de los eventos
Permitir validación estructural
Habilitar tipado fuerte en generación de código
Garantizar compatibilidad con update_context
```
# 2. Estructura Raíz

```
events:
<EventName>:
payload:
<field>: <type>
```
Reglas:

```
events es obligatorio si el sistema dene Processes.
Es un mapa.
Cada clave representa un Event.
```
Regex del nombre del evento:

^[A-Z][a-zA-Z0-9]*$


# 3. Denición de Evento

Ejemplo completo:

```
events:
PagoAprobado:
payload:
orden_id: uuid
transaccion_id: string
monto: integer
timestamp: datetime
```
# 4. Payload

## 4.1 Reglas Generales

```
payload es obligatorio.
Debe tener al menos un campo.
Cada campo debe estar en snake_case.
```
Regex campo:

^[a-z_]+$

## 4.2 Tipos Permitidos

Los mismos tipos primitivos que en context:

```
uuid
string
integer
boolean
datetime
```
Nulabilidad permitida con ?.

No se permiten:


```
Objetos anidados
Listas
Tipos compuestos
```
# 5. Relación con Process

Un evento puede ser referenciado dentro de:

```
states:
ESTADO:
on:
PagoAprobado:
transition_to: SIGUIENTE
```
Reglas:

```
El evento debe existir en events.
No se permiten referencias a eventos no denidos.
```
# 6. Uso en update_context

Sintaxis permitida:

```
update_context:
orden_id: event.payload.orden_id
fecha_aprobacion: event.payload.timestamp
```
Restricciones:

```
. El campo referenciado debe existir en el payload.
. El tipo del payload debe coincidir con el tipo del campo de contexto.
. No se permiten transformaciones.
. No se permite acceso a propiedades fuera de payload.
```
# 7. Semántica del Evento en el Motor


Un evento debe contener:

```
event_id (uuid)
event_name
payload
timestamp
```
El motor debe:

```
. Validar que el evento está denido en la Spec.
. Validar tipos del payload.
. Entregar el evento al Process correspondiente.
. Ejecutar transición de forma atómica.
```
# 8. Idempotencia

Requisito obligatorio:

El motor debe ser capaz de ignorar eventos duplicados.

Estrategia recomendada:

```
Persistir event_id
Mantener tabla de eventos procesados
No re‑ejecutar transición si el evento ya fue aplicado
```
# 9. Validaciones Obligatorias

V1: Evento referenciado en Process debe existir.
V2: Payload debe coincidir con denición.^
V3: Tipos deben ser compatibles.^
V4: Campos obligatorios deben estar presentes.^
V5: No pueden existir eventos denidos pero nunca utilizados (warning).^

# 10. JSON Schema de Eventos


# 11. Ejemplo Integrado (Process + Events)

```
events:
EmailVerificado:
payload:
usuario_id: uuid
timestamp: datetime
```
```
processes:
OnboardingUsuarioProcess:
persistence: true
```
### {

```
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
"pattern": "^(uuid|string|integer|boolean|datetime)(\\?
} } } } } } } } }
```

```
start_command: IniciarOnboarding
context:
usuario_id: uuid
email_verificado: boolean
fecha_verificacion: datetime?
initial_state: ESPERANDO_VERIFICACION
states:
ESPERANDO_VERIFICACION:
on:
EmailVerificado:
update_context:
email_verificado: true
fecha_verificacion: event.payload.timestamp
transition_to: COMPLETADO
COMPLETADO:
terminal: true
```
# 12. Conclusión

El modelo de Eventos v0.1 establece un contrato tipado, validable y determinístico que complementa el
modelo de Process.

Con EVENTS.md, CORE, REFERENCE y APPENDIX, el sistema alcanza un nivel completo de
especicación estructural para implementación industrial.


