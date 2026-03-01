# Motor de Migraciones (v0.1)

## 1. Propósito

El Motor de Migraciones es responsable de:
- Validar definiciones de migraciones
- Asegurar compatibilidad de migración con un ChangeSet
- Ejecutar migraciones determinísticamente
- Producir un Grafo Canónico transformado

Opera después de:
- Motor de Diff
- Motor de Versionado
- Motor de Validación

**NO DEBE**:
- Calcular diff
- Re-clasificar incremento de versión
- Mutar el grafo fuente en lugar

---

## 2. Modelo Conceptual

La ejecución de migración es una transformación:

```
aplicarMigración(
    grafoAnterior: GrafoCanónico,
    definiciónMigración: PlanMigración
): GrafoCanónico
```

La salida **DEBE** ser una nueva instancia de Grafo Canónico.

---

## 3. Precondiciones de Migración

Antes de la ejecución, el motor **DEBE** verificar:
1. El incremento de versión es válido
2. La versión de migración coincide con la transición de versión declarada
3. El plan de migración está completo
4. Las operaciones de migración son estructuralmente válidas

Si alguna precondición falla → la ejecución **DEBE** abortar.

---

## 4. Modelo de Plan de Migración

Un PlanMigración **DEBE** incluir:

```
PlanMigración {
    versiónDesde: SemVer
    versiónHasta: SemVer
    operaciones: ColecciónOrdenada<OperaciónMigración>
}
```

Las operaciones **DEBEN** ejecutarse en el orden declarado.

---

## 5. Tipos de Operación de Migración

Los tipos de operación soportados **DEBEN** enumerarse explícitamente:
- ADD_NODE
- REMOVE_NODE
- MODIFY_ATTRIBUTE
- RENAME_NODE
- TRANSFORM_VALUE
- ADD_EDGE
- REMOVE_EDGE

El conjunto permitido **DEBE** ser estable y versionado.

---

## 6. Esquema de OperaciónMigración

```
OperaciónMigración {
    tipo: TipoOperación
    rutaDestino: RutaCanónica
    parámetros: objeto
}
```

Cada tipo de operación **DEBE** definir parámetros requeridos.

Ejemplo:

```json
{
  "tipo": "MODIFY_ATTRIBUTE",
  "rutaDestino": "/processes/order/states/approved",
  "parámetros": {
    "atributo": "label",
    "nuevoValor": "Orden Aprobada"
  }
}
```

---

## 7. Fases de Ejecución

La ejecución de migración **DEBE** ocurrir en fases ordenadas:
1. Remociones estructurales
2. Adiciones estructurales
3. Modificaciones de atributos
4. Transformaciones de valores
5. Actualizaciones de aristas

Este orden asegura aplicación determinista y libre de conflictos.

---

## 8. Requisitos de Determinismo

El Motor de Migraciones **DEBE**:
- Ejecutar operaciones en orden determinista
- Rechazar operaciones ambiguas
- Producir salida idéntica para entrada y plan idénticos
- Garantizar canonicalización estable después de la ejecución

---

## 9. Garantías de Seguridad

El motor **DEBE** enforces:
- Existencia de ruta destino antes de modificación
- Sin creación de nodos duplicados
- Sin referencias huérfanas
- Sin estados estructurales ilegales
- Sin compromiso parcial (comportamiento todo-o-nada)

Si cualquier operación falla → toda la migración **DEBE** hacer rollback.

---

## 10. Atomicidad

La migración **DEBE** ser atómica.

La implementación **PUEDE**:
- Construir grafo mutable intermedio
- Aplicar operaciones
- Validar grafo final
- Congelar en nuevo Grafo Canónico

Si la validación falla → descartar resultado.

---

## 11. Integración con Motor de Validación

Después de aplicar migración:
- El grafo resultante **DEBE** ser canónico
- El Motor de Validación **DEBE** ejecutarse
- Cualquier error de validación **DEBE** invalidar la migración

El éxito de migración requiere éxito post-validación.

---

## 12. Compatibilidad con Motor de Diff

La migración **DEBE** ser consistente con ChangeSet:
- Todos los cambios rompedores **DEBEN** ser abordados por operaciones de migración
- Ninguna operación de migración puede contradecir la clasificación de ChangeSet

Si ChangeSet indica cambio rompedor pero ninguna migración lo aborda → inválido.

---

## 13. Idempotencia

La ejecución de migración **NO DEBE** asumirse idempotente.

Sin embargo, el motor **DEBE** detectar:
- Re-aplicación de la misma migración
- Desigualdad de versión

Re-aplicar una migración completada **DEBE** fallar.

---

## 14. Forzamiento de Transición de Versión

PlanMigración.versiónDesde **DEBE** igualar versión anterior.
PlanMigración.versiónHasta **DEBE** igualar versión actual.

Desigualdad **DEBE** invalidar la ejecución.

---

## 15. Expectativas de Rendimiento

La ejecución de migración **DEBERÍA** operar en:

**O(O + N)**

Donde:
- O = número de operaciones
- N = número de nodos

La búsqueda **DEBE** usar indexación de ruta canónica.

---

## 16. Detección de Conflictos

El motor **DEBE** detectar:
- Múltiples operaciones apuntando al mismo nodo ilegalment
- Remoción de nodo posteriormente modificado
- Conflictos de renombrado
- Creación de aristas apuntando a nodos no existentes

La detección de conflictos **DEBE** ser determinista.

---

## 17. Logging y Auditoría

El motor **PUEDE** producir un log de ejecución:

```
LogEjecuciónMigración {
    operacionesEjecutadas: número
    duraciónMs: número
    advertencias: string[]
}
```

El logging **NO DEBE** alterar el comportamiento.

---

## 18. Manejo de Errores

Los errores de migración **DEBEN** incluir:
- Índice de operación
- Ruta destino
- Código de error
- Mensaje

Los errores **DEBEN** ser deterministas.

---

## 19. Objetivos No Incluidos

El Motor de Migraciones **NO**:
- Auto-genera planes de migración
- Infiere transformaciones faltantes
- Relaja reglas de validación
- Aplica operaciones parcialmente

---

## 20. Criterios de Cumplimiento

Una implementación es compatible si:
- Fuerza consistencia de transición de versión
- Aplica operaciones atómicamente
- Garantiza determinismo
- Valida grafo post-migración
- Rechaza planes inconsistentes

---

## 21. Resumen

El Motor de Migraciones:
- Aplica transformaciones declaradas
- Garantiza ejecución atómica
- Fuerza seguridad estructural
- Se integra con validación y versionado
- Produce un nuevo grafo canónico
