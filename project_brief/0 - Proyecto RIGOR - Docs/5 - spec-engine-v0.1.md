# ENGINE.md — Especicación Formal del Rigor

# Engine v0.

# 1. Propósito

Este documento dene el comportamiento formal del **Rigor Engine** , el componente responsable de
ejecutar una Spec válida.

El Engine es el runtime determinístico que:

```
Procesa Events
Evalúa transiciones
Actualiza contexto
Gestiona persistencia
Garantiza consistencia operacional
```
El Engine ejecuta únicamente Specs que hayan pasado VALIDATION.

# 2. Principios Fundamentales

El Rigor Engine debe ser:

```
Determinístico
Atómico por evento
Sin ambigüedad de transición
Consistente bajo concurrencia
Compatible con versionado de Spec
```
Para un mismo estado + evento + contexto, el resultado debe ser siempre idéntico.

# 3. Modelo de Ejecución

El modelo formal es:


(Evento entrante) → (Evaluación de estado actual) → (Transición) → (Actualización de contexto) →
(Persistencia) → (Emisión de eventos internos)

Cada evento se procesa como una unidad transaccional indivisible.

# 4. Ciclo de Procesamiento de Evento

Para cada evento recibido:

```
. Cargar instancia (si persistence = true).
. Vericar compatibilidad de spec_version.
. Ejecutar migración si es necesaria.
. Identicar estado actual.
. Vericar que el evento está permitido en ese estado.
. Evaluar condiciones (si existen).
. Determinar transición.
. Ejecutar update_context.
. Cambiar estado (si transition_to existe).
. Persistir nueva versión.
. Emitir efectos secundarios (si denidos).
```
Si cualquier paso falla, la transacción debe abortarse.

# 5. Atomicidad

El procesamiento de un evento debe cumplir:

```
Todo o nada.
No persistir cambios parciales.
No modicar estado si hay error.
```
En sistemas con base de datos, debe ejecutarse dentro de una transacción.

# 6. Modelo de Estado

Una instancia ejecutable contiene:


```
process_name
spec_version
current_state
context
version (entero incremental)
created_at
updated_at
```
El campo version debe incrementarse en cada transición exitosa.

# 7. Determinismo

El Engine no puede:

```
Consultar servicios externos durante evaluación
Introducir aleatoriedad
Ejecutar lógica no declarada en la Spec
```
Las únicas fuentes de variación permitidas:

```
now (timestamp del sistema)
```
Cualquier uso de now debe ser consistente dentro de la misma transacción.

# 8. Concurrencia

Para instancias persistidas, el Engine debe implementar:

## 8.1 Control Optimista

```
Comparar version antes de persistir
Si version cambió → rechazar evento
```
## 8.2 Reintentos

El Engine puede permitir reintentos explícitos, pero nunca automáticos invisibles.

No se permite ejecución simultánea sobre la misma instancia sin control de versión.


# 9. Estados Terminales

Un estado es terminal si:

```
No tiene transiciones
```
Reglas:

```
No debe aceptar nuevos eventos
Debe marcar instancia como nalizada
```
# 10. Manejo de Errores

Errores posibles:

```
Evento no permitido
Estado inexistente
Condición inválida
Fallo de persistencia
Conicto de versión
```
El Engine debe:

```
No alterar estado
Reportar error estructurado
Mantener consistencia
```
# 11. Integración con Versioning

El Rigor Engine debe:

```
Declarar engine_version
Declarar supported_spec_range
Rechazar Specs fuera de rango
```
Antes de procesar evento:

```
Comparar instancia.spec_version con spec.spec_version
```

```
Ejecutar MIGRATIONS si es necesario
```
# 12. Integración con CLI

El comando:

rigor run spec.yaml

Debe inicializar el Rigor Engine bajo las reglas denidas en este documento.

# 13. Garantía Formal

Rigor Engine v0.1 garantiza:

```
Procesamiento determinístico
Atomicidad por evento
Control de concurrencia
Consistencia estructural
Compatibilidad con Versioning y Migraciones
```
ENGINE.md dene la semántica operacional ocial de Rigor.


