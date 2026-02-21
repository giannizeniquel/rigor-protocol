# VERSIONING.md — Especicación Formal de

# Versionado de Rigor v0.

# 1. Propósito

Este documento dene el modelo formal de versionado del ecosistema **Rigor**.

El objetivo es garantizar:

```
Evolución controlada de la Spec
Compatibilidad explícita entre versiones
Migraciones seguras
Estabilidad contractual para integradores
```
El versionado es un componente estructural del sistema, no una convención informal.

# 2. Alcance del Versionado

Existen tres niveles de versión en Rigor:

```
. rigor_spec_version (versión del lenguaje / contrato estructural)
. spec_version (versión de una Spec concreta)
. engine_version (versión del Rigor Engine)
```
Cada uno cumple un propósito distinto y no deben confundirse.

# 3. Versionado Semántico

Rigor adopta Semantic Versioning:

MAJOR.MINOR.PATCH

Reglas:


```
MAJOR: cambios incompatibles
MINOR: cambios compatibles hacia atrás
PATCH: correcciones sin impacto estructural
```
Ejemplo:

spec_version: 1.2.

# 4. rigor_spec_version

```
rigor_spec_version dene la versión del contrato estructural del lenguaje Rigor.
```
Debe declararse en la raíz de toda Spec:

rigor_spec_version: 0.1.

Reglas:

```
Cambios en JSON Schema implican incremento.
Cambios en semántica formal implican incremento MAJOR.
No puede omitirse.
```
El Engine debe rechazar Specs con rigor_spec_version no soportada.

# 5. spec_version

```
spec_version identica la versión de una implementación concreta de proceso.
```
Aplica a:

```
Estados
Eventos
Transiciones
Contexto
```
Debe declararse en la raíz:

spec_version: 1.0.

Esta versión es la utilizada para:

```
Migraciones
```

```
Comparaciones con diff
Control de instancias persistidas
```
# 6. engine_version

```
engine_version identica la versión del runtime Rigor.
```
El Engine debe declarar además:

supported_rigor_spec_range: "^0.1.0"
supported_spec_range: "^1.0.0"^

Reglas:

```
Si la Spec está fuera del rango soportado → debe rechazarse.
El rechazo debe ser explícito y determinístico.
```
# 7. Denición de Compatibilidad (Spec)

Una nueva spec_version es backward-compatible si:

```
. No elimina Events existentes.
. No elimina estados existentes.
. No cambia tipos de campos existentes.
. No elimina transiciones activas.
. No convierte campos opcionales en obligatorios.
```
Se considera breaking change:

```
Eliminar estado.
Renombrar estado.
Cambiar tipo de campo.
Eliminar campo obligatorio.
Modicar semántica de transición.
```
Breaking changes requieren incremento MAJOR.

# 8. Evolución Permitida (MINOR)


Permitido:

```
Agregar nuevo Event.
Agregar nuevo estado no inicial.
Agregar nueva transición.
Agregar campo opcional al contexto.
Agregar campo opcional al payload.
```
No debe romper instancias persistidas.

# 9. Evolución PATCH

Permitido:

```
Correcciones de documentación.
Ajustes no estructurales.
Mejora de mensajes.
```
No permitido:

```
Cambios estructurales.
Cambios en tipos.
```
# 10. Evolución MAJOR

Requiere:

```
Documento MIGRATIONS.md actualizado.
Transformador explícito.
Plan de transición denido.
```
Aplicable cuando:

```
Se elimina estado.
Se modica tipo.
Se cambia initial_state.
Se altera modelo de contexto.
```

# 11. Inmutabilidad

Una vez publicada una versión:

```
No puede modicarse.
Cualquier cambio requiere incremento.
El historial debe ser trazable.
```
# 12. Versionado de Instancias Persistidas

Cada instancia debe almacenar:

```
rigor_spec_version
spec_version
process_name
```
Esto permite:

```
Rehidratación correcta
Comparación estructural
Migración controlada
```
# 13. Integración con Comando diff

El comando:

rigor diff <old.yaml> <new.yaml>

Debe:

```
Comparar spec_version
Detectar breaking changes
Sugerir tipo de incremento (PATCH/MINOR/MAJOR)
```
El análisis debe alinearse estrictamente con este documento.

# 14. Política de Soporte


Recomendación:

```
Soportar al menos dos versiones MAJOR activas.
Denir ventana de deprecación.
Documentar n de soporte explícitamente.
```
# 15. Garantía Formal

El modelo de Versionado de Rigor v0.1 garantiza:

```
Evolución explícita y vericable
Compatibilidad medible
Integridad de instancias persistidas
Separación formal entre lenguaje, implementación y runtime
```
VERSIONING.md establece el contrato temporal ocial del ecosistema Rigor.


