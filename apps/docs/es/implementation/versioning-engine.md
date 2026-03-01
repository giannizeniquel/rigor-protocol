# RIGOR

# Implementación

## Motor de Versionado (Normativo – v0.1)

Estado: Normativo
Alcance: Define cómo RIGOR evalúa, aplica y valida los cambios de versión de las especificaciones basándose en un ChangeSet computado.

Este documento formaliza el comportamiento interno del Motor de Versionado y su interacción con los motores de Diff y Validación.

---

# 1. Propósito

El Motor de Versionado determina si un cambio de versión entre dos especificaciones es:

* Válido
* Requerido
* Incrementado correctamente
* Compatible con el ChangeSet computado

Opera exclusivamente sobre:

* Un ChangeSet (del Motor de Diff)
* La versión anterior
* La versión declarada actual

NO DEBE:

* Computar el diff
* Modificar grafos
* Aplicar migraciones

---

# 2. Modelo de Versión

RIGOR DEBE utilizar el Versionado Semántico (SemVer):

```
MAJOR.MINOR.PATCH
```

Cada componente DEBE ser:

* Un entero no negativo
* Sin ceros a la izquierda (excepto el 0 mismo)

El soporte para pre-lanzamientos (pre-release) y metadatos de construcción (build metadata) PUEDE estar disponible si se define en la Especificación.

---

# 3. Contratos de Entrada y Salida

## 3.1 Entrada

```
evaluateVersion(
    previousVersion: SemVer,
    currentVersion: SemVer,
    changeSet: ChangeSet
): VersionEvaluationResult
```

Todas las entradas DEBEN ser validadas antes de la evaluación.

---

## 3.2 Salida

```
VersionEvaluationResult {
    status: "valid" | "invalid"
    requiredBump: "none" | "patch" | "minor" | "major"
    declaredBump: "none" | "patch" | "minor" | "major"
    violations: OrderedCollection<VersionViolation>
}
```

Si existen violaciones → el estado DEBE ser `"invalid"`.

---

# 4. Cálculo del Incremento Declarado

El motor DEBE calcular el incremento declarado como:

* major si MAJOR aumentó
* minor si MINOR aumentó y MAJOR no cambió
* patch si PATCH aumentó y MAJOR/MINOR no cambiaron
* none si son idénticas

Cualquier degradación (downgrade) DEBE ser inválida.

Se permite saltar versiones a menos que esté restringido por política.

---

# 5. Clasificación de Cambios

El ChangeSet DEBE clasificarse en:

* Cambios no semánticos
* Adiciones compatibles con versiones anteriores
* Cambios de ruptura (breaking changes)

Las reglas de clasificación DEBEN ser deterministas.

---

## 5.1 Cambios de Ruptura (Breaking Changes)

Ejemplos (concepto normativo, lista exacta definida por la Especificación):

* Eliminar un nodo
* Eliminar un atributo requerido
* Cambiar el tipo de un atributo
* Cambiar la semántica de una restricción
* Cambiar el comportamiento de una transición de proceso

Los cambios de ruptura REQUIEREN un incremento MAJOR.

---

## 5.2 Cambios Compatibles hacia Atrás

Ejemplos:

* Añadir un atributo opcional
* Añadir un nuevo estado de proceso sin afectar las transiciones existentes
* Añadir una restricción no requerida

Requieren un incremento MINOR.

---

## 5.3 Cambios No Semánticos

Ejemplos:

* Actualización de metadatos
* Cambio en un campo de documentación
* Cambio en el ordenamiento interno (no debería aparecer en el ChangeSet)

Requieren un incremento PATCH.

---

# 6. Determinación del Incremento Requerido

El motor DEBE determinar el incremento requerido como:

* major si hay algún cambio de ruptura
* minor si no hay cambios de ruptura pero hay al menos una adición compatible
* patch si solo hay cambios no semánticos
* none si no hay cambios

El incremento requerido DEBE reflejar el cambio de mayor impacto.

---

# 7. Reglas de Validación

La versión es válida si:

* declaredBump >= requiredBump

Es inválida si:

* declaredBump < requiredBump
* la versión no cambia pero el ChangeSet no está vacío
* la versión cambia pero el ChangeSet está vacío (a menos que lo permita la política)
* se detecta una degradación (downgrade)

---

# 8. Esquema de VersionViolation

```
VersionViolation {
    code: string
    message: string
    expectedBump: "patch" | "minor" | "major"
    declaredBump: "none" | "patch" | "minor" | "major"
}
```

Los códigos DEBEN ser estables y estar bajo un espacio de nombres (namespaced).

---

# 9. Requisitos de Determinismo

El Motor de Versionado DEBE:

* Clasificar los cambios determinísticamente
* Producir resultados idénticos para ChangeSets idénticos
* Ordenar las violaciones determinísticamente
* No depender de la aleatoriedad en el orden de ejecución de las reglas

---

# 10. Integración con el Motor de Validación

El Motor de Versionado PUEDE:

* Ser invocado dentro del Motor de Validación durante la fase de versión
* Producir violaciones como ValidationErrors

Cuando se integra:

* Las violaciones de versión DEBEN mapearse a errores de validación
* Los códigos de error DEBEN permanecer estables

---

# 11. Extensibilidad de Políticas

El motor PUEDE soportar la configuración de políticas:

```
VersionPolicy {
    allowEmptyVersionBump: boolean
    allowPatchForMinor: boolean
}
```

La política por defecto DEBE exigir el cumplimiento estricto de SemVer.

La política NO DEBE alterar las reglas de clasificación a menos que esté documentado explícitamente.

---

# 12. Casos de Borde

El motor DEBE manejar:

* Primera versión (sin anterior) → no se requiere incremento
* Transiciones de pre-lanzamiento (si se soportan)
* Diferencias solo en metadatos
* Clasificación de múltiples cambios

Si existen múltiples tipos de cambio, el de mayor impacto DEBE prevalecer.

---

# 13. Expectativas de Rendimiento

El Motor de Versionado DEBERÍA operar en:

O(C)

Donde C = número de cambios en el ChangeSet.

NO DEBE recorrer el grafo completo.

---

# 14. No-Objetivos

El Motor de Versionado NO:

* Computa el diff
* Aplica migraciones
* Valida la corrección del grafo
* Modifica el campo de versión

Solo evalúa el cumplimiento.

---

# 15. Criterios de Conformidad

Una implementación es conforme si:

* Clasifica los cambios determinísticamente
* Aplica las reglas de SemVer
* Detecta incrementos insuficientes
* Rechaza degradaciones (downgrades)
* Produce violaciones estables

---

# 16. Resumen

El Motor de Versionado:

* Consume el ChangeSet
* Determina el incremento de versión requerido
* Valida la versión declarada
* Produce un resultado de evaluación determinista
* Impone la disciplina en la evolución
