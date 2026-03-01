# RIGOR

# Implementación

## Motor de Restricciones (Normativo – v0.1)

Estado: Normativo  
Alcance: Define la evaluación, cumplimiento y resolución determinista de restricciones declarativas dentro del Grafo Canónico.

Este documento formaliza cómo se definen, resuelven, evalúan e integran las restricciones con el Motor de Validación.

---

# 1. Propósito

El Motor de Restricciones es responsable de:

* Resolver declaraciones de restricciones
* Validar la estructura de las restricciones
* Evaluar expresiones de restricciones
* Detectar violaciones de forma determinista
* Producir resultados de restricciones estructurados

Opera sobre un Grafo Canónico y DEBE ser puro.

NO DEBE:

* Mutar el grafo
* Ejecutar efectos secundarios en tiempo de ejecución
* Realizar migraciones
* Modificar el estado de validación fuera de su salida definida

---

# 2. Modelo Conceptual

Las restricciones son invariantes declarativos adjuntos a:

* Nodos
* Atributos
* Procesos
* Alcance global del grafo

Representan condiciones lógicas que DEBEN cumplirse para que el grafo sea válido.

---

# 3. Contratos de Entrada y Salida

## 3.1 Entrada

```
evaluateConstraints(
    graph: CanonicalGraph
): ConstraintEvaluationResult
```

El grafo DEBE estar canonicalizado antes de la evaluación.

---

## 3.2 Salida

```
ConstraintEvaluationResult {
    status: "valid" | "invalid"
    violations: OrderedCollection<ConstraintViolation>
    evaluatedCount: number
}
```

Si existen violaciones → el estado DEBE ser `"invalid"`.

---

# 4. Modelo de Restricción

Cada restricción DEBE incluir:

```
Constraint {
    id: string
    scope: CanonicalPath | "graph"
    expression: Expression
    severity: "error" | "warning"
}
```

Las restricciones DEBEN tener IDs estables y únicos.

---

# 5. Alcance de la Restricción (Scope)

El alcance define el contexto de evaluación.

Alcances permitidos:

* Nivel de grafo
* Nivel de nodo
* Nivel de atributo
* Nivel de proceso

El motor DEBE vincular la restricción a su alcance de forma determinista.

Las referencias de alcance inválidas DEBEN producir violaciones.

---

# 6. Modelo de Expresión

Las expresiones DEBEN ser:

* Declarativas
* Libres de efectos secundarios
* Deterministas
* Puramente evaluativas

Las expresiones PUEDEN referenciar:

* Atributos del nodo con alcance
* Nodos relacionados a través de aristas definidas
* Colecciones agregadas
* Constantes

Las expresiones NO DEBEN:

* Acceder a sistemas externos
* Depender del tiempo
* Depender de la aleatoriedad
* Modificar el estado

---

# 7. Fases de Evaluación

La evaluación de restricciones DEBE ocurrir en fases:

### Fase 1 – Resolución

* Validar la ruta del alcance
* Validar los atributos referenciados
* Parsear la gramática de la expresión

Referencia inválida → violación.

---

### Fase 2 – Construcción del Grafo de Dependencias

* Identificar nodos y atributos referenciados
* Construir mapa de dependencias
* Detectar dependencias circulares de restricciones

La dependencia circular DEBE invalidar la evaluación.

---

### Fase 3 – Evaluación de Expresiones

* Evaluar la expresión por cada instancia de alcance
* Recolectar violaciones
* Respetar la severidad declarada

El orden de evaluación DEBE ser determinista.

---

# 8. Requisitos de Determinismo

El motor DEBE garantizar:

* Orden de evaluación estable
* Ordenamiento de violaciones estable
* Parseo de expresiones estable
* Códigos de error estables

El ordenamiento DEBE seguir:

1. Ruta del alcance (lexicográfico)
2. ID de la restricción (lexicográfico)
3. Mensaje de la violación

Entradas idénticas DEBEN producir salidas idénticas.

---

# 9. Esquema de ConstraintViolation

```
ConstraintViolation {
    code: string
    constraintId: string
    path: CanonicalPath
    message: string
    severity: "error" | "warning"
}
```

Los códigos DEBEN ser estables y estar en un espacio de nombres.

---

# 10. Restricciones de Agregación

El motor DEBE soportar agregación determinista:

Ejemplos:

* COUNT(coleccion) > 0
* ALL(estados, condicion)
* EXISTS(nodos, condicion)

Las agregaciones DEBEN operar sobre colecciones canonicalizadas y ordenadas.

---

# 11. Restricciones entre Nodos (Cross-Node)

Las restricciones PUEDEN referenciar nodos relacionados a través de aristas.

El motor DEBE:

* Resolver referencias de forma determinista
* Prevenir recorridos infinitos
* Forzar una evaluación acíclica

El orden de recorrido DEBE estar ordenado lexicográficamente.

---

# 12. Expectativas de Rendimiento

El Motor de Restricciones DEBERÍA operar en:

O(C × N)

Donde:

* C = número de restricciones
* N = nodos en el alcance relevante

Las implementaciones PUEDEN cachear búsquedas intermedias pero DEBEN preservar el determinismo.

---

# 13. Integración con el Motor de Validación

La evaluación de restricciones PUEDE ejecutarse durante la Fase de Validación "SEMANTIC".

Las violaciones de restricciones DEBEN mapearse a ValidationErrors o ValidationWarnings.

Los IDs de las restricciones DEBEN permanecer estables entre versiones.

---

# 14. Interacción con el Versionado

La adición, eliminación o modificación de restricciones PUEDE clasificarse como:

* Cambio de ruptura (breaking) (si fortalece el invariante)
* Cambio menor (si relaja el invariante)
* Parche (si es solo metadatos)

Las reglas de clasificación DEBEN definirse en el Motor de Versionado.

---

# 15. Manejo de Conflictos

El motor DEBE detectar:

* IDs de restricciones duplicados
* Referencias de atributos no resolubles
* Alcances de restricciones conflictivos
* Gramática de expresión inválida

Dichas condiciones DEBEN producir violaciones deterministas.

---

# 16. No-Objetivos

El Motor de Restricciones NO:

* Corrige automáticamente las violaciones
* Genera sugerencias
* Modifica el grafo
* Ejecuta validación de datos en tiempo de ejecución
* Realiza validación a nivel de base de datos

Solo valida invariantes de la especificación.

---

# 17. Criterios de Conformidad

Una implementación es conforme si:

* Evalúa las restricciones de forma determinista
* Fuerza la corrección del alcance
* Detecta dependencias circulares
* Produce un ordenamiento de violaciones estable
* Se integra limpiamente con el Motor de Validación

---

# 18. Resumen

El Motor de Restricciones:

* Hace cumplir invariantes declarativos
* Opera puramente sobre el Grafo Canónico
* Garantiza la evaluación determinista
* Detecta errores de alcance y dependencia
* Se integra en el ciclo de vida de validación
