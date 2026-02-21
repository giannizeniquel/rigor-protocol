# SPEC APPENDIX v0.

# 1. Propósito del Apéndice

Este documento complementa CORE y REFERENCE con:

```
JSON Schema formal validable
Ejemplo end‑to‑end completo
Modelo de testing detallado
Diagramas conceptuales
Estrategia de versionado
Lineamientos para ejecución distribuida futura
```
El objetivo es permitir una implementación industrial sin ambigüedades.

# 2. Apéndice A — JSON Schema Completo

# (Draft ‑ 07)

El siguiente schema permite validación estructural automática.

### {

```
"$schema": "http://json-schema.org/draft-07/schema#",
"type": "object",
"required": ["processes"],
"properties": {
"processes": {
"type": "object",
"patternProperties": {
"^[A-Z][a-zA-Z0-9]*$": {
"type": "object",
"required": [
"persistence",
"start_command",
"context",
"initial_state",
```

"states"
],
"properties": {
"persistence": { "type": "boolean", "const": true },
"start_command": {
"type": "string",
"pattern": "^[A-Z][a-zA-Z0-9]*$"
},
"uniqueness": {
"type": "object",
"required": ["by"],
"properties": {
"by": { "type": "string" }
}
},
"context": {
"type": "object",
"minProperties": 1,
"patternProperties": {
"^[a-z_]+$": {
"type": "string",
"pattern": "^(uuid|string|integer|boolean|datetime)(\\?
}
}
},
"initial_state": { "type": "string" },
"states": {
"type": "object",
"minProperties": 1,
"patternProperties": {
"^[A-Z_]+$": {
"type": "object",
"properties": {
"emit_command": { "type": "string" },
"invoke": { "type": "string" },
"terminal": { "type": "boolean" },
"compensate_with": { "type": "string" },
"on": {
"type": "object",
"patternProperties": {
"^[A-Z][a-zA-Z0-9]*$": {
"type": "object",
"required": ["transition_to"],
"properties": {


Nota: Validaciones semánticas adicionales (estados alcanzables, unicidad global de start_command,
etc.) deben implementarse en el validador lógico, no solo en JSON Schema.

# 3. Apéndice B — Ejemplo End ‑ to ‑ End

# Completo

## 3.1 Spec Declarativa

Caso: Onboarding de usuario con vericación de email.

```
processes:
OnboardingUsuarioProcess:
persistence: true
start_command: IniciarOnboarding
uniqueness:
```
```
"transition_to": { "type": "string" },
"update_context": {
"type": "object"
}
}
}
}
}
},
"oneOf": [
{ "required": ["emit_command"] },
{ "required": ["invoke"] },
{ "required": ["terminal"] }
] } } } } } } } } }
```

```
by: usuario_id
context:
usuario_id: uuid
email_verificado: boolean
fecha_verificacion: datetime?
initial_state: ENVIANDO_EMAIL
states:
ENVIANDO_EMAIL:
emit_command: EnviarEmailVerificacion
on:
EmailEnviado:
transition_to: ESPERANDO_VERIFICACION
```
```
ESPERANDO_VERIFICACION:
on:
EmailVerificado:
update_context:
email_verificado: true
fecha_verificacion: now
transition_to: COMPLETADO
```
```
COMPLETADO:
terminal: true
```
## 3.2 Modelo de Código Generado (Conceptual)

```
Clase OnboardingUsuarioProcess
Enum de estados
Método handle(event)
Persistencia automática tras transición
Registro de auditoría
```
## 3.3 Flujo de Ejecución

```
. Se recibe IniciarOnboarding
. Se crea instancia
. Se ejecuta emit_command: EnviarEmailVerificacion
. Se recibe EmailEnviado
. Se transiciona a ESPERANDO_VERIFICACION
```

```
. Se recibe EmailVerificado
. Se actualiza contexto
. Se transiciona a COMPLETADO
```
# 4. Apéndice C — Testing Formal

## 4.1 Principio

Un Process debe comportarse como máquina pura:

Entrada: evento
Salida: nuevo estado + contexto actualizado^

## 4.2 Ejemplo de Test

```
def test_verificacion_exitosa():
process = OnboardingUsuarioProcess(usuario_id="123")
process.start()
```
```
assert process.state == "ENVIANDO_EMAIL"
```
```
process.handle(EmailEnviado())
assert process.state == "ESPERANDO_VERIFICACION"
```
```
process.handle(EmailVerificado())
assert process.state == "COMPLETADO"
assert process.context.email_verificado is True
```
Requisitos:

```
No requiere base de datos
No requiere servicios externos
No ejecuta efectos reales
```
# 5. Apéndice D — Diagramas Conceptuales


## 5.1 Máquina de Estados (Representación Simplicada)

### ENVIANDO_EMAIL

↓ EmailEnviado^
ESPERANDO_VERIFICACION^
↓ EmailVericado^
COMPLETADO (terminal)^

# 6. Apéndice E — Versionado de Spec

Recomendación:

Agregar campo opcional futuro:

```
spec_version: 0.
```
Reglas:

```
Cambios menores no deben romper compatibilidad.
Cambios mayores requieren nueva versión.
```
# 7. Apéndice F — Preparación para Ejecución

# Distribuida

El modelo es compatible con:

```
Event‑driven architecture
Message brokers
Microservicios
```
Requisitos futuros:

```
Idempotencia de eventos
Persistencia transaccional
Identicadores globales
```

# 8. Apéndice G — Estrategia de Validación en CI

Pipeline recomendado:

```
. Validación JSON Schema
. Validación semántica
. Generación de código
. Compilación automática
. Ejecución de tests generados
```
# 9. Conclusión

El APPENDIX v0.1 proporciona todos los elementos necesarios para:

```
Implementar el motor
Validar automáticamente Specs
Generar código conable
Testear sin infraestructura
Preparar evolución futura
```
Con CORE y REFERENCE, este documento completa la especicación técnica formal del sistema v0.1.


