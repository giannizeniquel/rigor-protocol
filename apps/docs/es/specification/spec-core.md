# Núcleo de la Spec

## 1. Propósito

El Núcleo de Spec de RIGOR define el **modelo conceptual formal** para un sistema de especificación declarativa orientado hacia la generación de código precisa impulsada por IA.

El objetivo es establecer:
- Fundamentos teóricos.
- Modelo de ejecución formal.
- Restricciones estructurales.
- Contratos explícitos.
- Invariantes estructurales no negociables.

Este documento define la arquitectura conceptual que cualquier implementación debe adherir.

## 2. Declaracion del Problema

La generación de código impulsada por IA requiere especificaciones que sean:
- **Determinísticas**: Sin resultados probabilísticos.
- **No ambiguas**: Solo una interpretación válida.
- **Validadas estructuralmente**: Verificación pre-ejecución.
- **Libres de Lógica Implícita**: Sin comportamientos ocultos.

Los sistemas tradicionales a menudo mezclan orquestación técnica, reglas de negocio, estado implícito y efectos secundarios no declarados. RIGOR separa estrictamente **Declaración** de **Ejecución, Persistencia y Efectos**, permitiendo a la IA generar código preciso sin inferencias no controladas.

## 3. Principios Fundamentales

### 3.1 Declaracion de Restriccion Explícita
Todo comportamiento del sistema debe ser explícitamente declarado. RIGOR prohíbe:
- Referencias de transacción implícitas.
- Mutaciones de estado ocultas.
- Efectos secundarios no declarados.

### 3.2 Maquina de Estados Explícita (FSM)
Un Proceso es una máquina de estados finita definida por:
- Un conjunto cerrado de estados.
- Transiciones explícitas.
- Eventos definidos.
- Contexto de estado persistente.

No hay transiciones implícitas.

### 3.3 Persistencia Formal
Cada instancia de proceso debe tener:
- Un identificador único (UUID).
- Un estado actual persistido.
- Un contexto tipificado persistido.
- (Opcional) Historial de eventos.

El estado del proceso no puede depender de memoria volátil.

### 3.4 Determinismo
Dado un estado actual, un contexto persistente y un evento recibido, la transición resultante debe ser completamente determinística.

### 3.5 Flexibilidad Controlada
Los puntos de extensión solo se permiten bajo contrato explícito. Extender el modelo a través de código ad-hoc fuera de la especificación está estrictamente prohibido.

## 4. Definicion Formal de Proceso

Un Proceso es una entidad lógica definida como:
**Proceso = (Estados, Estado Inicial, Contexto, Transiciones)**

Donde:
- **Estados**: Un conjunto finito de fases estables posibles.
- **Estado Inicial**: El nodo de inicio (∈ Estados).
- **Contexto**: Un conjunto de variables tipificadas.
- **Transiciones**: Mapeo de (Estados × Evento) → Estados.

## 5. Modelo de Contexto

El Contexto es la única fuente mutable dentro de un Proceso. Es:
- **Persistente**: Almacenado entre transiciones.
- **Tipificado**: Campos estrictamente definidos.
- **Declarativo**: Cambios solo a través de `update_context`.
- **Cerrado**: Sin creación o eliminación dinámica de campos.

### Tipos Soportados (v0.1)
- `uuid`, `string`, `integer`, `boolean`, `datetime`.

La nulabilidad explícita se soporta usando el sufijo `?`.

## 6. Efectos de Estado

Para asegurar simplicidad y determinismo, cada estado debe declarar **exactamente uno** de los siguientes efectos:

### 6.1 `emit_command` (Asíncrono)
Representa una acción externa. Es no bloqueante y produce efectos fuera de los límites del proceso.

### 6.2 `invoke` (Síncrono)
Representa una invocación técnica (ej., un UseCase interno). Debe ser determinístico e idempotente.

### 6.3 `terminal` (Conclusion)
Marca el fin del proceso. No se permiten transiciones salientes.

## 7. Modelo de Ejecucion

El motor maneja el ciclo de vida del proceso a través de estas etapas:
1. Recepción de un `start_command`.
2. Validación de unicidad (ver Sección 8).
3. Creación de una instancia persistente.
4. Asignación del `initial_state`.
5. Ejecución del efecto del estado.
6. Espera/Recepción de eventos.
7. Evaluación de transición y `update_context`.
8. Persistencia del nuevo estado.

El motor debe garantizar atomicidad por transición.

## 8. Regla de Unicidad
Un proceso puede declarar opcionalmente unicidad por un campo de contexto. No pueden existir dos instancias activas con el mismo valor para el campo declarado. Una instancia terminal no bloquea nuevas instancias.

## 9. Prueba Conceptual
Un proceso debe ser ejecutable como una máquina de estados pura, independiente de infraestructura externa o dependencias reales, inyectando eventos y observando el estado final y el contexto actualizado.

## 10. Limites Intencionales (v0.1)
Para preservar la precisión generativa, RIGOR v0.1 intencionalmente excluye:
- Sub-procesos.
- Transiciones condicionales complejas.
- Paralelismo.
- Eventos compuestos.

## 11. Objetivo Arquitectonico
RIGOR está diseñado para permitir generación automática de código confiable, soportar ejecución distribuida futura, y escalar en complejidad sin introducir ambigüedad estructural. Prioriza estabilidad verificable sobre expresividad ilimitada.
