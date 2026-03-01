# Motor de Validación (v0.1)

## 1. Propósito

El Motor de Validación evalúa un Grafo Canónico contra las reglas definidas por la Especificación de RIGOR.

Es responsable de:
- Validación estructural
- Validación referencial
- Validación semántica
- Validación de proceso
- Validación de evento
- Validación de versión

**NO DEBE**:
- Mutar el Grafo Canónico
- Ejecutar lógica de diff
- Aplicar migraciones
- Generar artefactos

El Motor de Validación es un sistema de evaluación puro.

---

## 2. Contratos de Entrada y Salida

### 2.1 Entrada

El motor **DEBE** aceptar:

```
validar(grafo: GrafoCanónico, opciones?: OpcionesValidación)
```

Donde:
- `grafo` **DEBE** ser canónico
- `opciones` **PUEDE** incluir parámetros de strictness y filtrado

El motor **NO DEBE** aceptar YAML raw o IR.

### 2.2 Salida

El motor **DEBE** retornar un Reporte de Validación:

```
ReporteValidación {
    estado: "válido" | "inválido"
    errores: ColecciónOrdenada<ErrorValidación>
    advertencias: ColecciónOrdenada<AdvertenciaValidación>
    metadatos: {
        conteoReglas
        tiempoEjecución
    }
}
```

`estado` **DEBE** ser `"inválido"` si existe al menos un error.

---

## 3. Descomposición Arquitectónica

El Motor de Validación **DEBE** consistir lógicamente de los siguientes componentes:

### 3.1 Registro de Reglas

Responsable de:
- Registrar reglas de validación
- Proporcionar ordenamiento determinista de reglas
- Forzar identificadores de regla únicos

Cada regla **DEBE** tener:

```
Regla {
    id: string
    categoría: CategoríaRegla
    severidad: "error" | "advertencia"
    aplicaA: TipoNodo | "grafo"
    ejecutar(grafo, contexto): ResultadoRegla[]
}
```

Los IDs de regla **DEBEN** ser estables e inmutables.

### 3.2 Ejecutor de Reglas

Responsable de:
- Iterar reglas en orden determinista
- Ejecutar lógica de reglas
- Recolectar violaciones
- Respetar fases de ejecución

### 3.3 Contexto de Validación

Proporciona:
- Acceso al grafo
- Búsqueda de nodos
- Utilidades auxiliares
- Estado compartido de solo lectura

El contexto **NO DEBE** permitir mutación.

### 3.4 Agregador de Errores

Responsable de:
- Recolectar errores
- Forzar ordenamiento determinista
- Deduplicar- Producir si es necesario
 reporte final

---

## 4. Fases de Validación

Las reglas **DEBEN** ejecutarse en fases ordenadas definidas.

Las fases **DEBEN** ser:
1. Estructural
2. Referencial
3. Semántica
4. Proceso
5. Evento
6. Versión

Las reglas dentro de una fase **DEBEN** ejecutarse en orden lexicográfico determinista del ID de regla.

Una fase posterior **NO DEBE** ejecutarse si se viola un invariante estructural fatal (umbral definido por implementación).

---

## 5. Categorías de Reglas

Cada regla **DEBE** pertenecer a una categoría:
- ESTRUCTURAL
- REFERENCIAL
- SEMÁNTICA
- PROCESO
- EVENTO
- VERSIÓN

Las categorías determinan la fase de ejecución.

---

## 6. Requisitos de Determinismo

El motor **DEBE** garantizar:
- Orden de ejecución de reglas estable
- Orden de errores estable
- Códigos de error estables
- Rutas canónicas estables

Dado un Grafo Canónico de entrada idéntico, la salida **DEBE** ser idéntica.

El orden de errores **DEBE** seguir:
1. Ruta canónica (lexicográfica)
2. ID de Regla
3. Mensaje

---

## 7. Esquema de ErrorValidación

Cada error **DEBE** incluir:

```
ErrorValidación {
    código: string
    idRegla: string
    ruta: RutaCanónica
    mensaje: string
    severidad: "error"
}
```

Las advertencias **DEBEN** seguir:

```
AdvertenciaValidación {
    código: string
    idRegla: string
    ruta: RutaCanónica
    mensaje: string
    severidad: "advertencia"
}
```

Los códigos **DEBEN** ser estables entre versiones.

---

## 8. Modo Estricto vs No Estricto

OpcionesValidación **PUEDE** incluir:

```
OpcionesValidación {
    modo: "estricto" | "no-estricto"
    reglasDeshabilitadas?: string[]
}
```

En modo estricto:
- Todas las reglas **DEBEN** ejecutarse

En modo no-estricto:
- La implementación **PUEDE** degradar errores específicos a advertencias
- Las reglas deshabilitadas **DEBEN** excluirse determinísticamente

La deshabilitación de reglas **NO DEBE** alterar el orden de las reglas restantes.

---

## 9. Estrategia de Cortocircuito

El motor **PUEDE** implementar cortocircuito solo en límites de fase.

**NO DEBE** cortocircuitar dentro de una fase de manera no determinista.

Ejemplo:
- Si la fase estructural produce violación de invariante fatal, la fase semántica **PUEDE** ser omitida.

Este comportamiento **DEBE** ser documentado y estable.

---

## 10. Restricciones de Implementación de Reglas

Las reglas **DEBEN**:
- Ser funciones puras
- No mutar el grafo
- No depender de estado global
- No depender de efectos secundarios de orden de ejecución
- No modificar el comportamiento de otras reglas

Las reglas **NO DEBEN**:
- Registrar nuevas reglas en runtime
- Acceder al sistema de archivos
- Realizar llamadas de red

---

## 11. Reglas de Acceso al Grafo

Las reglas **PUEDEN**:
- Recorrer nodos
- Inspeccionar atributos
- Seguir aristas
- Consultar mapas de búsqueda

Las reglas **NO DEBEN**:
- Modificar nodos
- Modificar aristas
- Añadir atributos derivados

---

## 12. Validación de Versión

Las reglas de versión **DEBEN**:
- Comparar versión declarada
- Validar formato de versión semántica
- Forzar requisitos de incremento (si se proporciona ChangeSet)

Si no se proporciona ChangeSet, la validación de incremento de versión **PUEDE** ser omitida.

---

## 13. Integración con Motor de Diff

Si la validación se ejecuta en contexto de evolución:

```
validar(grafo, { changeSet })
```

El motor **PUEDE**:
- Ejecutar reglas de versión
- Ejecutar verificaciones de seguridad de migración

Validación **NO DEBE** computar diff por sí misma.

---

## 14. Expectativas de Rendimiento

El motor **DEBERÍA** operar en:

**O(R × N)**

Donde:
- R = número de reglas
- N = número de nodos

Las reglas **DEBERÍAN** evitar recorridos anidados de grafo completo.

Caché **PUEDE** usarse dentro del contexto pero **DEBE** ser determinista.

---

## 15. Códigos de Error

Los códigos de error **DEBEN**:
- Ser estables
- Estar namespaced (ej., RIGOR-VAL-001)
- Nunca ser reutilizados para diferentes significados

Eliminar una regla **DEBE** deprecar su código explícitamente.

---

## 16. Integración con CLI

El comportamiento del CLI **DEBE** seguir:
- Código de salida 0 → sin errores
- Código de salida 1 → errores de validación presentes
- Código de salida >1 → fallo interno

El formato de salida **DEBE** soportar:
- JSON
- Texto legible por humano

JSON **DEBE** serializar ReporteValidación exactamente.

---

## 17. Logging

El Motor de Validación **PUEDE** emitir logs, pero:
- Los logs **NO DEBEN** afectar comportamiento
- Los logs **NO DEBEN** alterar el determinismo
- El logging **DEBE** ser opcional

---

## 18. Requisitos de Testing

El Motor de Validación **DEBE** soportar:
- Pruebas unitarias por regla
- Pruebas de integración sobre grafos de muestra
- Pruebas doradas para salida de errores
- Pruebas de determinismo (misma entrada, misma salida)
- Pruebas de regresión para evolución de reglas

El comportamiento de las reglas **DEBE** ser testeable independientemente.

---

## 19. Objetivos No Incluidos

El Motor de Validación **NO**:
- Aplica cambios
- Corrige errores automáticamente
- Genera migraciones
- Reordena el grafo
- Canónica el grafo

La canonicalización **DEBE** ocurrir antes.

---

## 20. Criterios de Cumplimiento

Una implementación es compatible si:
- Ejecuta reglas en orden determinista por fases
- Produce ReporteValidación estable
- Respeta inmutabilidad
- Fuerza códigos de error estables
- Soporta modo estricto

---

## 21. Resumen

El Motor de Validación es:
- Determinista
- Guiado por fases
- Pura
- Basada en reglas
- Inmutable en comportamiento

Hace cumplir la corrección de la especificación sin alterar la estructura y proporciona un resultado de validación estable y reproducible.
