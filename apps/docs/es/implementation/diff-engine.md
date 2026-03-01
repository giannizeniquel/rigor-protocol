# RIGOR

# Implementación

## Motor de Diff (Normativo – v0.1)

Estado: Normativo
Alcance: Define el cálculo determinista de las diferencias estructurales entre dos instancias de Grafo Canónico.

Este documento formaliza el algoritmo interno, contratos, garantías y restricciones del Motor de Diff.

---

# 1. Propósito

El Motor de Diff calcula un ChangeSet que representa las diferencias estructurales entre:

* Un Grafo Canónico previo (G₁)
* Un Grafo Canónico actual (G₂)

Es responsable de:

* Detectar adiciones
* Detectar eliminaciones
* Detectar modificaciones
* Clasificar tipos de cambio
* Producir un ChangeSet determinista

NO DEBE:

* Realizar validación
* Realizar migraciones
* Mutar ninguno de los grafos
* Aplicar cambios

---

# 2. Contratos de Entrada y Salida

## 2.1 Entrada

```
diff(previous: CanonicalGraph, current: CanonicalGraph): ChangeSet
```

Ambos grafos DEBEN estar canonicalizados antes del diff.

El motor DEBE rechazar grafos no canónicos.

---

## 2.2 Salida

El motor DEBE retornar:

```
ChangeSet {
    status: "no-change" | "changed"
    changes: OrderedCollection<Change>
    summary: ChangeSummary
}
```

El `status` DEBE ser `"no-change"` si y solo si no existen diferencias estructurales.

---

# 3. Modelo Core de Diff

El Diff opera sobre:

* Identidad de nodos
* Atributos de nodos
* Relaciones de aristas (edges)

La comparación DEBE ser:

* Determinista
* Independiente del orden
* Basada en rutas canónicas e IDs de nodo

---

# 4. Coincidencia de Identidad (Identity Matching)

Los nodos DEBEN ser emparejados por:

1. Ruta canónica
2. Clave de identidad estable (si está definida)

Si un nodo existe en G₂ pero no en G₁ → ADD (ADICIÓN)
Si un nodo existe en G₁ pero no en G₂ → REMOVE (ELIMINACIÓN)
Si existe en ambos → comparar atributos y aristas

---

# 5. Tipos de Cambio

Cada Cambio DEBE ser uno de:

* ADD_NODE
* REMOVE_NODE
* MODIFY_ATTRIBUTE
* ADD_EDGE
* REMOVE_EDGE
* REORDER (solo si está semánticamente ordenado)

El conjunto de tipos de cambio DEBE ser estable y versionado.

---

# 6. Esquema del Objeto de Cambio

Cada cambio DEBE incluir:

```
Change {
    type: ChangeType
    path: CanonicalPath
    nodeType: NodeType
    attribute?: string
    oldValue?: any
    newValue?: any
    metadata?: object
}
```

Los campos DEBEN estar presentes solo cuando sean relevantes.

---

# 7. Algoritmo de Diff (Comportamiento Normativo)

El algoritmo DEBE:

### Fase 1 – Comparación del Conjunto de Nodos

* Construir mapas de nodos indexados por ruta canónica
* Identificar nodos añadidos
* Identificar nodos eliminados

### Fase 2 – Comparación de Atributos

Para los nodos emparejados:

* Comparar conjuntos de atributos
* Detectar atributos añadidos
* Detectar atributos eliminados
* Detectar atributos modificados

La comparación de atributos DEBE ser profunda y determinista.

### Fase 3 – Comparación de Aristas (Edges)

Para los nodos emparejados:

* Comparar aristas salientes
* Detectar adiciones y eliminaciones
* Detectar reordenamiento semántico (si aplica)

### Fase 4 – Normalización

* Ordenar los cambios determinísticamente
* Eliminar cambios redundantes
* Finalizar el ChangeSet

---

# 8. Reglas de Ordenamiento Determinista

Los cambios DEBEN ser ordenados por:

1. Ruta canónica (lexicográfica)
2. ChangeType (precedencia interna estable)
3. Nombre del atributo (si aplica)

Los mismos grafos de entrada DEBEN producir ChangeSets idénticos.

---

# 9. Reglas de Igualdad Profunda (Deep Equality)

La comparación profunda DEBE:

* Comparar escalares estrictamente
* Comparar mapeos recursivamente
* Comparar conjuntos sin orden por su forma canónica ordenada
* Comparar listas ordenadas por posición

La comparación de puntos flotantes DEBE ser exacta a menos que la Especificación defina una tolerancia.

---

# 10. Manejo de Reordenamiento Semántico

Para colecciones semánticamente ordenadas:

* Un cambio en el orden DEBE producir un REORDER
* La implementación DEBE detectar el delta de reordenamiento mínimo

Para conjuntos sin orden:

* Las diferencias de orden NO DEBEN producir cambios

---

# 11. Optimización por Hash Estructural (Opcional)

Si el Grafo Canónico incluye un hash estructural:

* Una discrepancia de hash PUEDE disparar la comparación profunda
* La igualdad de hash PUEDE cortocircuitar el diff

El uso de hash NO DEBE afectar la corrección.

---

# 12. Objeto de Resumen (Summary)

El ChangeSummary DEBE incluir:

```
ChangeSummary {
    totalChanges: number
    additions: number
    removals: number
    modifications: number
    reorders: number
}
```

Los conteos DEBEN ser consistentes con el ChangeSet.

---

# 13. Expectativas de Rendimiento

El Motor de Diff DEBERÍA operar en:

O(N + E)

Donde:

* N = nodos
* E = aristas

La comparación de atributos DEBERÍA evitar comportamientos cuadráticos.

El uso de memoria DEBERÍA escalar linealmente.

---

# 14. Consideraciones para Grafos Grandes

El motor DEBERÍA:

* Usar mapas de hash para la búsqueda de nodos
* Evitar escaneos completos anidados
* Evitar comparaciones redundantes

El diff por streaming es OPCIONAL y DEBE permanecer determinista si se implementa.

---

# 15. Integración con el Motor de Versionado

El ChangeSet DEBE ser consumible por:

* Motor de Versionado
* Motor de Migraciones
* Salida del CLI

El Motor de Diff NO DEBE interpretar reglas de incremento de versión.

---

# 16. Manejo de Errores

El Diff NO DEBERÍA producir errores semánticos.

PUEDE producir errores fatales si:

* Se violan invariantes del grafo
* Se detecta colisión de ruta canónica
* Se proporciona un grafo no canónico

Tales errores DEBEN ser deterministas.

---

# 17. Estabilidad entre Versiones

Los tipos de cambio y la estructura de salida DEBEN estar versionados.

Los cambios de ruptura en el esquema del ChangeSet DEBEN incrementar la versión mayor de RIGOR.

---

# 18. No-Objetivos

El Motor de Diff NO:

* Valida la corrección
* Clasifica la severidad semántica
* Decide el incremento de versión
* Aplica migraciones
* Genera parches (patches)

Solo describe diferencias estructurales.

---

# 19. Criterios de Conformidad

Una implementación es conforme si:

* Produce ChangeSets deterministas
* Identifica correctamente adiciones/eliminaciones/modificaciones
* Ignora el orden no semántico
* Preserva un ordenamiento estable de los cambios
* Opera solo sobre grafos canonicalizados

---

# 20. Resumen

El Motor de Diff:

* Compara dos Grafos Canónicos
* Produce un ChangeSet estructural determinista
* Es independiente del orden
* Es inmutable y puro
* Es fundamental para la evolución y el versionado

---
