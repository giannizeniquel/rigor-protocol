# SPEC CORE v0.1

# 1. Propósito del Documento

Este documento dene el **modelo conceptual formal** del sistema de especicación declarativa
orientado a la generación precisa de código mediano IA.

El objetivo del CORE es establecer:

```
Fundamentos teóricos
Modelo formal de ejecución
Restricciones estructurales
Contratos explícitos
Principios de enfermedad no negociables
```
Este documento no describe detalles sintácticos extensivos (eso corresponde al Reference), sino la
arquitectura conceptual que debe responder cual implementación.

# 2. Problema que se Busca Resolver

La generación automática de código requiere especicaciones:

```
. Determinísticas
. Sin ambigüedades
. Eestructuralmente validadas
. Libres de lógica implícita
```
Los sistemas tradicionales mezclán:

```
Organización técnica
Reglas de negocio
Estado implícito
Efectos secundarios no declarados
```
Este modelo separa estrictamente:

```
Declaración
```

```
Ejecución
Persistencia
Efectos
```
Con el n de permitir que una IA pueda generar código preciso sin inferencias no controladas.

# 3. Principios Fundamentos

## 3.1 Declaración de Estricciones

Todo comportamiento debe estar explícitamente declarado.

No se permite:

```
Referencia implícita de transacciones
Mutaciones ocultas de estado
Efectos secundarios no denidos en el modelo
```
## 3.2 Máquina de Estados Explícita

Un Proceso es una mañana de estados nita con:

```
Conjunto cerrado de estados
Transiciones explícitas
Eventos denidos
Estado persistente explícito
```
No existen transiciones implícitas.

## 3.3 Persistencia formal

Cada instancia de Process debe tener:

```
Identicador único
Estado actual persistido
Contexto persistente
(Opcional) histórico de eventos
```

El estado del Proceso no puede depender de memoria volátil.

## 3.4 Determinismo

Dado:

```
Estado actual
Contexto actual
Evento recibido
```
La transición resultante debe ser completamente determinante.

## 3.5 Flexibilidad Controlada

Se permiten puntos de extensión exclusivamente bajo contrato explícito.

No se permite extender el modelo medio código ad‑hoc fuera de la Spec.

# 4. Denición formal de proceso

Un Proceso es una entidad lógica denida por:

```
. Nombre único
. Contexto tipado
. Estado inicial
. Conjunto nito de estados
. Reglas de transición
```
Formaliza:

Proceso = (Estados, Estado Inicial, Contexto, Transiciones)

Donde:

```
Estados es un conjunto nito
Estado inicial ∈ Estados
Contexto es conjunto de variables
Transiciones ⊆ Estados × Evento → Estados
```

# 5. Modelo de contexto

El Contexto es:

```
Persistente
Tipado
Declarativo
Cerrado
```
No se permite:

```
Crear campos dinámicamente
Eliminar campos en tiempo de ejecución
```
Tipos permitidos en v0.1:

```
uuid
cadena
entero
booleano
fecha y hora
```
Se permite nulabilidad explícita mediante sujo opcional.

El contexto es la única fuente mutable del Process.

# 6. Estados

Un estado representa una fase estable del proceso.

Cada estado puede declarar exactamente uno de los siguientes efectos:

```
. emit_command
. invoke
. terminal
```
Esta restricción garantiza:

```
Simplicidad
Determinismo
Testeabilidad
```

## 6.1 Estado con emit_command

Representa una acción asincrónica externa.

Características:

```
No bloqueante
Produce efectos fuera del proceso
Espera evento posterior
```
## 6.2 Estado con invoke

Representa invocación técnica síncrona.

Características:

```
Operación determinística
Sin lógica de negocio compleja
Debe ser idempotente
```
## 6.3 Estado terminal

Representa conclusión del Process.

```
No permite transiciones salientes
Debe estar explícitamente marcado
```
# 7. Eventos

Los eventos son entradas que producen transición.

Un evento:

```
Tiene nombre único
Puede originarse externamente o por invocación técnica
No contiene lógica
```
El modelo no dene carga útil formal en v0.1, pero el motor puede mapear datos al contexto mediante
update_context.


# 8. Transiciones

Una transición se dene por:

EstadoActual + Evento → NuevoEstado

Puede incluye:

```
actualizar_contexto
```
Restricciones:

```
transition_to debe referenciar estado válido
No se permiten transiciones implícitas
```
# 9. actualizar_contexto

update_context es una operación declarativa que:

```
Modica campos existentes
No crea nuevos campos
Es determinante
```
No se permite lógica condicional completa en v0.1.

# 10. Modelo de Ejecución

Flujo general:

```
. Recepción de start_command
. Validación de unicidad
. Creación de instancia persistente
. Asignación de estado_inicial
. Ejecución del efecto del estado
. Espera de evento
. Evaluación de la transición
. Actualización de contexto
. Persistencia de nuevo estado
```

El motor debe garantizar la atomicidad por transición.

# 11. Unicidad

Opcionalmente, un Proceso puede declarar unicidad por campo de contexto.

Regla:

No puede existir dos instancias activas con el mismo valor del campo declarado.

# 12. Prueba conceptual

Un Proceso debe poder ejecutar como mañana de estados pura:

```
Sin infraestructura externa
Sin dependencias reales
Mediante incorporación de eventos
```
El comportamiento debe vericar observando:

```
Estado nal
Contexto actualizado
```
# 13. Compensación (Diseño Futuro)

El modelo permite incorporar compensaciones sin compatibilidad.

Compensación implícita:

```
Registro de efectos ejecutivos
Ejecución inversa en caso de retroceso
```
No es obligatoria en v0.1.

# 14. Límites Deliberados de v0.


Sin incluir:

```
Sub‑procesos
Transiciones condicionales completas
Paralelismo
Eventos compuestos
```
Estos límites son intencionales para preservar precisión generativa.

# 15. Objetivo Arquitectónico

El modelo está enfermo para:

```
Permitir generación automática de código conable
Soportar salida distribución futura
Escalar en complejidad sin ambigüedad
Mantener trazabilidad completa
```
# 16. Conclusión

El CORE dene una máquina de estados declarativa, persistente y determinante, restricciones estrictas
orientadas a generación automática de código preciso.

Toda implementación debe respetar estas invariantes.

Cualquier extensión futura debe ser compatible hasta ahora y no introducir ambigüedad estructural.


