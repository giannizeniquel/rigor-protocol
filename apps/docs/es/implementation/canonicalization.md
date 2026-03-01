# Motor de Canonicalización (v0.1)

## 1. Propósito

El Motor de Canonicalización asegura que especificaciones semánticamente equivalentes produzcan representaciones de Grafo Canónico estructuralmente idénticas.

Elimina la variabilidad no semántica introducida por:
- Orden de entrada
- Diferencias de formateo
- Ruido estructural
- Valores por defecto implícitos

La canonicalización es obligatoria antes de cualquier procesamiento semántico.

---

## 2. Garantías Core

El Motor de Canonicalización **DEBE** garantizar:

1. Ordenamiento determinista de nodos
2. Ordenamiento determinista de atributos
3. Ordenamiento determinista de aristas
4. Rutas canónicas estables
5. Comportamiento de comparación estructural estable

Dos grafos semánticamente equivalentes **DEBEN** producir grafos canónicos idénticos.

---

## 3. Alcance de la Canonicalización

La canonicalización opera exclusivamente en:
- Nodos
- Atributos de nodos
- Aristas
- Rutas canónicas
- Colecciones

**NO DEBE**:
- Modificar el significado semántico
- Añadir valores por defecto implícitos (a menos que esté definido por la Especificación)
- Eliminar información requerida
- Realizar validación

---

## 4. Reglas de Ordenamiento Canónico

El ordenamiento canónico **DEBE** aplicarse a:

### 4.1 Colecciones de Nodos

Los nodos **DEBEN** ordenarse determinísticamente por:

1. Tipo de nodo (precedencia de tipo predefined estable)
2. Identificador primario (lexicográfico)
3. Ruta canónica (como desempate)

La precedencia de tipo **DEBE** definirse estáticamente y **NO DEBE** cambiar entre ejecuciones.

### 4.2 Atributos Dentro de Nodos

Los atributos **DEBEN** ordenarse lexicográficamente por nombre de atributo.

Los mapeos anidados **DEBEN** seguir ordenamiento canónico recursivamente también.

### 4.3 Aristas

Las aristas salientes de cada nodo **DEBEN** ordenarse por:

1. Tipo de arista
2. Ruta canónica del nodo destino

### 4.4 Secuencias

Las secuencias que representan conjuntos semánticos sin orden **DEBEN** ordenarse determinísticamente.

Las secuencias que representan colecciones semánticamente ordenadas **DEBEN** preservar el orden semántico.

La Especificación **DEBE** definir qué colecciones son ordenadas vs no ordenadas.

---

## 5. Estabilización de Rutas Canónicas

Las rutas canónicas **DEBEN**:
- Ser normalizadas
- Usar separadores consistentes
- Usar identificadores normalizados
- Evitar delimitadores finales
- Ser case-sensitive a menos que se defina lo contrario

La normalización de rutas **NO DEBE** alterar identificadores semánticos.

---

## 6. Normalización de Escalares

Los escalares **DEBEN** normalizarse de la siguiente manera:
- Booleanos → true / false
- Enteros → forma decimal canónica
- Flotantes → forma decimal normalizada
- Strings → preservados exactamente
- Null → null explícito

El trim de espacios en blanco está prohibido a menos que esté explícitamente definido en la Especificación.

---

## 7. Eliminación de Ruido Estructural

El Motor de Canonicalización **PUEDE** eliminar:
- Colecciones opcionales vacías
- Valores por defecto explícitos que coinciden con valores por defecto de la especificación

Solo si la Especificación permite explícitamente la omisión.

**NO DEBE** eliminar:
- Valores definidos por el usuario
- Declaraciones semánticas

---

## 8. Recorrido Determinista

La canonicalización **DEBE** producir un orden de recorrido que sea:
- Estable
- Depth-first o breadth-first (definido por implementación)
- Consistente entre ejecuciones

El orden de recorrido **NO DEBE** depender del orden YAML original.

---

## 9. Hash Estructural (Opcional pero Recomendado)

El motor **PUEDE** computar un hash estructural.

Si se implementa:
- El hash **DEBE** depender únicamente de la estructura canónica
- El hash **DEBE** ser estable entre ejecuciones
- El algoritmo de hash **DEBE** estar documentado
- Las colisiones de hash **DEBEN** ser consideradas teóricamente posibles

El hash **NO DEBE** depender de direcciones de memoria o estado de runtime.

---

## 10. Inmutabilidad del Grafo Canónico

La canonicalización **NO DEBE** mutar la instancia original del grafo.

**DEBE**:
- Producir una nueva instancia del grafo
  **O**
- Congelar el grafo existente después del ordenamiento canónico

El grafo resultante **DEBE** ser inmutable.

---

## 11. Manejo de Conjuntos Semánticos Sin Orden

Para colecciones declaradas semánticamente sin orden:
- El ordenamiento **DEBE** aplicarse determinísticamente
- La clave de ordenamiento **DEBE** ser estable
- El algoritmo de ordenamiento **DEBE** ser determinista

Para colecciones declaradas semánticamente ordenadas:
- El orden **DEBE** preservarse
- La canonicalización **NO DEBE** reordenar

---

## 12. Manejo de Errores

La canonicalización **NO DEBERÍA** producir errores semánticos.

Sin embargo, **PUEDE** producir errores estructurales si:
- Invariantes internos del grafo son violados
- Tipos de nodos son inconsistentes
- Atributos requeridos faltan inesperadamente

Tales errores **DEBEN** tratarse como errores internos fatales.

---

## 13. Expectativas de Rendimiento

La canonicalización **DEBERÍA** operar en:

**O(N log N)**

Donde N = número de nodos + aristas.

La normalización recursiva **DEBE** evitar comportamiento cuadrático.

---

## 14. Interacción con Otros Motores

La canonicalización **DEBE** preceder a:
- Motor de Validación
- Motor de Diff
- Motor de Versionado
- Motor de Migraciones

Diff **DEBE** comparar solo grafos canónicos.

Validación **DEBE** operar solo sobre grafo canónico.

---

## 15. Criterios de Cumplimiento

Una implementación es compatible si:
- Produce grafos canónicos idénticos para specs semánticamente equivalentes
- Garantiza ordenamiento estable
- Previene influencia del orden YAML
- Normaliza escalares determinísticamente
- Preserva significado semántico

---

## 16. Objetivos No Incluidos

La canonicalización **NO**:
- Valida lógica de negocio
- Clasifica cambios
- Ejecuta migraciones
- Interpreta restricciones

Su propósito es solo la normalización estructural.

---

## 17. Resumen

El Motor de Canonicalización:
- Congela estructura determinista
- Elimina varianza no semántica
- Habilita diffing confiable
- Habilita hashing reproducible
- Garantiza comparabilidad estructural

Es fundamental para la evolución y estabilidad de la validación.
