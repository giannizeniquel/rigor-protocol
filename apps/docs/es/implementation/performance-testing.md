# RIGOR

# Implementación

## Estrategia de Rendimiento y Testing (Normativo – v0.1)

Estado: Normativo
Alcance: Define las garantías de rendimiento, expectativas de benchmarking, validación de determinismo y estrategia de pruebas obligatoria en todos los motores de RIGOR.

Este documento formaliza las restricciones de calidad requeridas para una implementación conforme.

---

# 1. Propósito

Este documento establece:

* Expectativas de complejidad de rendimiento
* Requisitos de validación de determinismo
* Obligaciones de cobertura de pruebas
* Garantías de regresión
* Estrategia de verificación de estabilidad

Se aplica a todos los motores y a la capa de ejecución de CLI.

---

# 2. Modelo de Rendimiento

RIGOR está diseñado para el análisis estructural y determinista de especificaciones.

Las implementaciones DEBEN optimizar para:

* Complejidad predecible
* Escalado lineal o casi lineal
* Patrones de tiempo de ejecución deterministas

---

# 3. Complejidad Esperada por Motor

### 3.1 Motor de Canonicalización

Complejidad esperada:

O(N + E)

Donde:

* N = número de nodos
* E = número de aristas (edges)

Debe evitar escaneos anidados.

---

### 3.2 Motor de Validación

Complejidad esperada:

O(R × N)

Donde:

* R = número de reglas
* N = nodos en el alcance (scope)

Las reglas DEBEN evitar recorridos anidados del grafo completo siempre que sea posible.

---

### 3.3 Motor de Restricciones

Complejidad esperada:

O(C × S)

Donde:

* C = número de restricciones
* S = tamaño del alcance

Las funciones de agregación DEBEN operar sobre colecciones canónicas ordenadas.

---

### 3.4 Motor de Diff

Complejidad esperada:

O(N + E)

La comparación de atributos DEBE evitar comportamientos cuadráticos.

---

### 3.5 Motor de Versionado

Complejidad esperada:

O(C)

Donde:

* C = número de cambios en el ChangeSet

---

### 3.6 Motor de Migración

Complejidad esperada:

O(O + N)

Donde:

* O = número de operaciones
* N = tamaño del grafo

---

### 3.7 Motor de Resolución de Eventos

Complejidad esperada:

O(Ev + D)

Donde:

* Ev = número de eventos
* D = número de dependencias

La detección de ciclos DEBE ser lineal.

---

# 4. Expectativas de Memoria

El uso de memoria DEBERÍA escalar linealmente con el tamaño del grafo.

Las implementaciones NO DEBEN:

* Duplicar el grafo completo innecesariamente
* Mantener copias redundantes de colecciones grandes
* Tener fugas de memoria entre invocaciones del CLI

---

# 5. Pruebas de Determinismo

El determinismo es una propiedad obligatoria.

Las implementaciones DEBEN incluir:

### 5.1 Pruebas de Repetibilidad

Ejecutar la misma entrada múltiples veces → misma salida (igualdad a nivel de bytes en modo JSON).

---

### 5.2 Pruebas de Aleatorización de Orden

Si las estructuras de datos internas no están ordenadas (ej. mapas de hash), las pruebas DEBEN:

* Mezclar el orden de inserción
* Verificar una salida canónica idéntica

---

### 5.3 Pruebas de Estabilidad de Concurrencia

Si se utiliza paralelización:

* Las ejecuciones paralelas y secuenciales DEBEN producir resultados idénticos.

---

# 6. Categorías de Pruebas

Las siguientes capas de pruebas son obligatorias.

---

## 6.1 Pruebas Unitarias

Cada componente del motor DEBE tener:

* Pruebas a nivel de regla
* Pruebas a nivel de restricción
* Pruebas a nivel de operación
* Pruebas del parser de expresiones

La cobertura DEBE incluir casos de éxito y de fallo.

---

## 6.2 Pruebas de Integración

Los escenarios de extremo a extremo (end-to-end) DEBEN probar:

* Pipeline completo del CLI
* Interacción Diff + Versión
* Cadena de Migración + Validación
* Resolución de eventos después de la migración

---

## 6.3 Pruebas Golden (Golden Tests)

Las pruebas Golden DEBEN:

* Serializar la salida JSON
* Comparar contra archivos de referencia committeados
* Fallar ante cualquier cambio estructural

Las pruebas Golden DEBEN validar el determinismo.

---

## 6.4 Pruebas de Regresión

Cada defecto descubierto DEBE producir:

* Un caso de prueba reproducible
* Una prueba de regresión permanente
* Un mapeo claro al código de error

La suite de regresión DEBE crecer de forma monótona.

---

## 6.5 Pruebas Basadas en Propiedades (Property-Based Tests)

Las implementaciones DEBERÍAN incluir pruebas de propiedades para:

* Invariantes de ordenamiento canónico
* Propiedades de simetría del diff
* Monotonía de incrementos de versión
* Consistencia de agregación de restricciones

Ejemplos de propiedades:

* diff(A, A) → sin cambios
* canonicalize(canonicalize(G)) = canonicalize(G)

---

## 6.6 Pruebas de Estrés (Stress Tests)

Grafos sintéticos grandes DEBEN probar:

* Comportamiento de escalado
* Estabilidad de memoria
* Patrones de degradación de rendimiento

Las pruebas de estrés NO DEBEN alterar el determinismo.

---

# 7. Requisitos de Benchmarking

Las implementaciones DEBERÍAN proporcionar:

* Una suite de benchmarks
* Un conjunto de datos (dataset) estable
* Medición de tiempo sin ruido de registros (logging)

Los benchmarks DEBEN reportar:

* Conteo de nodos
* Conteo de aristas
* Tiempo de ejecución por motor
* Uso de memoria

Los resultados DEBEN ser reproducibles bajo el mismo entorno.

---

# 8. Requisitos de CI

La Integración Continua (CI) DEBE:

* Ejecutar la suite completa de pruebas
* Ejecutar pruebas de determinismo
* Validar salidas Golden
* Fallar ante ordenamientos no deterministas
* Fallar ante códigos de error no registrados

La CI DEBE bloquear el merge ante fallos en las pruebas.

---

# 9. Pruebas de Estabilidad de Códigos de Error

DEBE existir un registro de códigos de error.

Las pruebas DEBEN verificar:

* Que no haya códigos duplicados
* Que no haya códigos eliminados sin marcarlos como obsoletos
* Que no haya cambios en la semántica sin un incremento de versión

La estabilidad del modelo de errores es obligatoria.

---

# 10. Detección de Regresión de Rendimiento

La CI DEBERÍA incluir:

* Una línea base (baseline) de rendimiento
* Alertas de umbral
* Comparación histórica

PUEDEN configurarse fallos críticos si las caídas de rendimiento superan el umbral definido.

---

# 11. Pruebas de Compatibilidad

La compatibilidad hacia atrás DEBE probarse a través de versiones:

* Cargar especificaciones antiguas
* Validar contra el nuevo motor
* Verificar la evolución esperada de los errores

El comportamiento que rompa la compatibilidad DEBE requerir un incremento de versión mayor.

---

# 12. Pruebas de Seguridad en Migraciones

Las pruebas de migración DEBEN verificar:

* Rollback atómico en caso de fallo
* Ausencia de mutaciones parciales
* Orden correcto de aplicación
* Éxito de la validación post-migración

---

# 13. Pruebas de Seguridad y Robustez

Aunque RIGOR no se ejecuta en runtime, la implementación DEBE probar:

* Resiliencia ante entradas malformadas
* Manejo de anidamiento profundo
* Robustez de la detección de ciclos
* Manejo de expresiones grandes

Los motores DEBEN fallar de forma determinista, no caer de forma impredecible.

---

# 14. No-Objetivos

La estrategia de rendimiento NO requiere:

* Garantías de tiempo real
* Diff sub-lineal
* Ejecución distribuida
* Validación de datos en runtime

El enfoque sigue siendo el determinismo estructural.

---

# 15. Criterios de Conformidad

Una implementación es conforme si:

* Cumple con la clase de complejidad esperada
* Garantiza una salida determinista
* Supera las pruebas Golden y de regresión
* Impone la estabilidad de los códigos de error
* Mantiene benchmarks reproducibles

---

# 16. Resumen

La Estrategia de Rendimiento y Testing asegura:

* Comportamiento determinista
* Arquitectura escalable
* Semántica de errores estable
* Mantenibilidad a largo plazo
* Control estricto de regresiones
