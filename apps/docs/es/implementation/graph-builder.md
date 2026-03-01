# RIGOR

# Implementación

## Constructor de Grafo Canónico (Normativo – v0.1)

Estado: Normativo
Alcance: Define la construcción del Grafo Canónico a partir de la Representación Intermedia (IR).

Este documento formaliza el modelo estructural interno utilizado por todos los motores subsiguientes.

---

# 1. Propósito

El Constructor de Grafo Canónico transforma la Representación Intermedia (IR) en un Grafo Canónico determinista e inmutable.

El Grafo Canónico es la única fuente estructural de verdad para:

* Validación
* Diff
* Versionado
* Migración
* Resolución de eventos

Ningún motor puede operar directamente sobre la IR.

---

# 2. Principios Core

El Grafo Canónico DEBE ser:

1. Determinista
2. Inmutable después de la construcción
3. Consistente en identidad
4. Completamente resuelto (sin referencias sin resolver)
5. Independiente del orden del YAML

El Constructor DEBE garantizar Grafos Canónicos idénticos para entradas de IR semánticamente idénticas.

---

# 3. Modelo Conceptual

El Grafo Canónico es un grafo dirigido y tipado compuesto por:

* Nodos
* Aristas (Edges)
* Rutas Canónicas

---

## 3.1 Nodo

Un Nodo DEBE contener:

* ID de Nodo estable
* Tipo
* Atributos (tipados)
* Aristas salientes
* Ruta Canónica

Los IDs de Nodo DEBEN ser deterministas y estables entre ejecuciones.

---

## 3.2 Arista (Edge)

Una Arista DEBE contener:

* ID de Nodo Origen
* ID de Nodo Destino
* Tipo de Arista
* Metadatos opcionales

Las aristas DEBEN representar relaciones estructurales o referenciales.

---

## 3.3 Ruta Canónica

Cada nodo DEBE tener una ruta canónica única que represente su posición en el grafo.

Las rutas canónicas DEBEN:

* Ser deterministas
* Ser independientes del orden del YAML
* Permanecer estables entre representaciones equivalentes

Ejemplo (conceptual):

```
/processes/order/states/approved
```

La sintaxis de la ruta canónica es definida por la implementación, pero DEBE ser estable.

---

# 4. Tipado de Nodos

Cada nodo DEBE tener un tipo definido.

Ejemplos de tipos de nodos (ilustrativos, no exhaustivos):

* Raíz (Root)
* Proceso (Process)
* Estado (State)
* Transición (Transition)
* Evento (Event)
* Entidad (Entity)
* Restricción (Constraint)
* Versión (Version)

La implementación DEBE definir un conjunto exhaustivo de tipos de nodos alineados con la Especificación.

Los tipos de nodos DEBEN estar fuertemente tipados internamente.

---

# 5. Fases de Construcción del Grafo

El Constructor de Grafo Canónico DEBE operar en fases ordenadas.

---

## Fase 1: Construcción de la Raíz

* Crear nodo raíz
* Validar tipo de raíz de la IR
* Inicializar registros globales

---

## Fase 2: Creación de Nodos Estructurales

* Crear nodos para todas las secciones de nivel superior
* Crear nodos para estructuras anidadas
* Asignar rutas canónicas provisionales

En esta etapa, las referencias PUEDEN permanecer sin resolver.

---

## Fase 3: Registro de Identidad

* Registrar todos los nodos que poseen identidad
* Forzar la unicidad
* Detectar identificadores duplicados

Las identidades duplicadas DEBEN producir un error fatal.

---

## Phase 4: Resolución de Referencias

* Resolver referencias entre nodos
* Validar existencia
* Crear aristas
* Detectar referencias circulares si son inválidas

Las referencias sin resolver DEBEN producir errores de validación o errores fatales dependiendo de la severidad.

---

## Fase 5: Finalización de la Ruta Canónica

* Normalizar rutas canónicas
* Aplicar reglas de ordenamiento determinista
* Congelar el orden de los nodos

Después de esta fase, el grafo DEBE ser inmutable.

---

# 6. Reglas de Identidad

Los nodos que poseen identidad DEBEN:

* Tener identificadores globalmente únicos dentro de su alcance
* Ser registrados antes de la resolución de referencias
* Producir rutas canónicas deterministas

La comparación de identidad DEBE ser sensible a mayúsculas y minúsculas (case-sensitive) a menos que se defina lo contrario.

---

# 7. Reglas de Ordenamiento Determinista

El Constructor DEBE aplicar un ordenamiento determinista para:

* Secciones de nivel superior
* Nodos dentro de las secciones
* Atributos dentro de los nodos
* Aristas

El ordenamiento DEBERÍA ser por defecto lexicográfico por identificador, a menos que la Especificación defina un ordenamiento semántico.

El orden de entrada del YAML NO DEBE afectar el orden final del grafo.

---

# 8. Garantía de Inmutabilidad

Después de la construcción del grafo:

* Los nodos NO DEBEN ser mutados
* Las aristas NO DEBEN ser alteradas
* Los atributos NO DEBEN cambiar

Cualquier transformación (ej., migración) DEBE crear una nueva instancia de Grafo Canónico.

---

# 9. Manejo de Errores durante la Construcción

El Constructor PUEDE producir:

* Errores estructurales
* Errores de identidad
* Errores de referencia

Los errores DEBEN:

* Incluir la ruta canónica (si está disponible)
* Incluir un código de error estable
* Ser deterministas en el orden de reporte

Los errores fatales DEBEN detener la construcción.

---

# 10. Manejo de Referencias Circulares

El Constructor DEBE:

* Detectar referencias circulares ilegales
* Permitir estructuras circulares solo si la Especificación lo permite
* Producir detección de ciclos determinista

La detección de ciclos DEBE ser algorítmicamente estable.

---

# 11. Garantías de Integridad del Grafo

Un Grafo Canónico válido DEBE garantizar:

* Todos los nodos referenciados existen
* No hay identidades duplicadas
* No hay nodos requeridos huérfanos
* Rutas canónicas completamente construidas
* Orden de recorrido determinista

---

# 12. Requisitos de Recorrido

El Grafo Canónico DEBE soportar:

* Recorrido en profundidad (DFS)
* Recorrido en anchura (BFS)
* Iteración determinista
* Búsqueda por ruta canónica
* Búsqueda por ID de nodo

El orden de recorrido DEBE ser estable entre ejecuciones.

---

# 13. Expectativas de Rendimiento

La construcción del grafo DEBERÍA:

* Ser O(N + E)
* Evitar la resolución de referencias cuadrática
* Usar registros de identidad eficientes (ej., hash maps)

La complejidad en el peor de los casos DEBE ser documentada si es diferente.

---

# 14. Consideraciones Multi-Spec

Si se soporta la carga de múltiples especificaciones (multi-spec):

* Cada especificación DEBE producir un Grafo Canónico independiente
* Las referencias entre especificaciones DEBEN definirse explícitamente
* La fusión de grafos DEBE ser determinista

Si no está soportado, las referencias entre especificaciones DEBEN ser rechazadas.

---

# 15. Consideraciones de Seguridad

El Constructor DEBE:

* Evitar la ejecución de código dinámico
* Evitar la instanciación basada en reflexión a partir de entradas no confiables
* Proteger contra ataques de anidamiento profundo

La profundidad máxima de recursión DEBERÍA estar limitada.

---

# 16. Contrato de Salida

El Grafo Canónico DEBE exponer:

```
CanonicalGraph {
    nodes: OrderedCollection<Node>
    root: Node
    lookupById(id)
    lookupByPath(path)
    traversalIterator()
}
```

La estructura interna exacta PUEDE variar, pero las garantías lógicas DEBEN cumplirse.

---

# 17. Integración con Siguientes Etapas

El Grafo Canónico es la única entrada para:

* Motor de Canonicalización
* Motor de Validación
* Motor de Diff
* Motor de Versionado
* Motor de Migración
* Motor de Resolución de Eventos

Ningún motor puede consumir la IR directamente.

---

# 18. No-Objetivos

El Constructor de Grafo Canónico NO:

* Valida reglas semánticas
* Evalúa restricciones
* Realiza diff
* Clasifica cambios
* Genera artefactos

Solo construye la estructura.

---

# 19. Criterios de Conformidad

Una implementación es conforme si:

* Produce Grafos Canónicos deterministas
* Impone la unicidad de identidad
* Resuelve las referencias determinísticamente
* Garantiza la inmutabilidad
* Produce rutas canónicas estables

---

# 20. Resumen

El Constructor de Grafo Canónico:

* Convierte la IR en un grafo tipado
* Impone la identidad estructural
* Resuelve referencias
* Congela la estructura determinista
* Sirve como base de todo el motor
