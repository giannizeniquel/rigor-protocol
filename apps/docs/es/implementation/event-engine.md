# Motor de Resolución de Eventos (v0.1)

## 1. Propósito

El Motor de Resolución de Eventos es responsable de:
- Resolver referencias de eventos
- Validar triggers y handlers de eventos
- Forzar integridad de dependencias de eventos
- Detectar ciclos
- Producir un modelo de ejecución determinista

Opera sobre el Grafo Canónico y produce un Modelo de Eventos Resuelto.

**NO DEBE**:
- Ejecutar eventos en runtime
- Realizar migraciones
- Mutar el Grafo Canónico

---

## 2. Modelo Conceptual

Los eventos en RIGOR representan triggers declarativos vinculados a:
- Nodos
- Transiciones de proceso
- Cambios de atributos
- Señales externas (si está soportado)

El motor transforma definiciones declarativas en un Grafo de Eventos Resuelto.

---

## 3. Contratos de Entrada y Salida

### 3.1 Entrada

```
resolverEventos(grafo: GrafoCanónico): ResultadoResoluciónEventos
```

El grafo **DEBE** ser canónico y validado estructuralmente antes de la resolución.

### 3.2 Salida

```
ResultadoResoluciónEventos {
    estado: "válido" | "inválido"
    eventosResueltos: ColecciónOrdenada<EventoResuelto>
    violaciones: ColecciónOrdenada<ViolaciónEvento>
}
```

Si existen violaciones → estado **DEBE** ser `"inválido"`.

---

## 4. Modelo de Evento

Cada evento **DEBE** definir:
- id (estable y único)
- trigger
- scope
- condición (opcional)
- acción

### 4.1 Esquema de Evento (Forma Canónica)

```
Evento {
    id: string
    trigger: DefiniciónTrigger
    scope: RutaCanónica
    condición?: Expresión
    acción: DefiniciónAcción
}
```

---

## 5. Tipos de Trigger

Los tipos de trigger soportados **DEBEN** enumerarse explícitamente:
- ON_CREATE
- ON_UPDATE
- ON_DELETE
- ON_STATE_ENTER
- ON_STATE_EXIT
- ON_ATTRIBUTE_CHANGE
- CUSTOM (si la especificación lo permite)

Los tipos de trigger **DEBEN** ser estables entre versiones.

---

## 6. Proceso de Resolución

La resolución de eventos **DEBE** ocurrir en fases:

### Fase 1 – Resolución de Scope
- Verificar que la ruta destino existe
- Vincular evento al nodo
- Validar compatibilidad del trigger con tipo de nodo

### Fase 2 – Resolución de Dependencias
- Resolver atributos referenciados
- Resolver estados de proceso
- Resolver nodos referenciados

Referencia no resuelta → violación.

### Fase 3 – Validación de Condición
- Parsear expresión de condición (si está presente)
- Validar campos referenciados
- Forzar gramática de evaluación determinista

Expresión inválida → violación.

### Fase 4 – Validación de Acción
- Validar tipo de acción
- Validar parámetros de acción
- Asegurar que el objetivo de acción existe

### Fase 5 – Detección de Ciclos
- Construir grafo de dependencias de eventos
- Detectar ciclos directos o indirectos
- Rechazar cadenas de eventos cíclicos

La detección de ciclos **DEBE** ser determinista.

---

## 7. Esquema de EventoResuelto

```
EventoResuelto {
    id: string
    trigger: TipoTrigger
    scope: RutaCanónica
    dependenciasResueltas: string[]
    índiceOrdenEjecución: número
}
```

El orden de ejecución **DEBE** ser determinista.

---

## 8. Orden de Ejecución Determinista

Los eventos resueltos **DEBEN** ordenarse por:
1. Ruta del scope (lexicográfica)
2. Precedencia de trigger (mapeo interno estable)
3. ID de evento (lexicográfica)

El mismo grafo **DEBE** siempre producir orden idéntico.

---

## 9. Reglas de Compatibilidad de Triggers

El motor **DEBE** forzar:
- ON_STATE_ENTER solo válido para nodos de estado de proceso
- ON_ATTRIBUTE_CHANGE solo válido para nodos con atributos
- ON_DELETE solo válido donde existen semánticas de eliminación

Combinaciones inválidas **DEBEN** producir violaciones.

---

## 10. Tipos de Acción

Los tipos de acción soportados **PUEDEN** incluir:
- SET_ATTRIBUTE
- TRANSITION_STATE
- EMIT_EVENT
- LOG
- CUSTOM (si está permitido)

Cada tipo de acción **DEBE** definir parámetros requeridos.

---

## 11. Restricciones de Expresión

Las condiciones **DEBEN**:
- Ser libres de efectos secundarios
- Ser deterministas
- No acceder a sistemas externos
- No depender de valores de runtime

El motor **DEBE** validar sintaxis e identificadores referenciados.

---

## 12. Grafo de Dependencias de Eventos

Las dependencias incluyen:
- Evento → Nodo
- Evento → Atributo
- Evento → Estado de Proceso
- Evento → Otro Evento (si es EMIT_EVENT)

El grafo de dependencias **DEBE** ser acíclico.

---

## 13. Esquema de Violación

```
ViolaciónEvento {
    código: string
    idEvento: string
    ruta: RutaCanónica
    mensaje: string
}
```

Los códigos **DEBEN** ser estables y estar namespaced.

---

## 14. Integración con Motor de Validación

La resolución de eventos **PUEDE** invocarse durante la Fase de Validación "EVENT".

Si la resolución falla:
- Las violaciones **DEBEN** surfacear como errores de validación
- El estado de validación **DEBE** ser inválido

---

## 15. Integración con Motor de Migraciones

La migración **PUEDE** modificar definiciones de eventos.

Después de la migración:
- La resolución de eventos **DEBE** ejecutarse nuevamente
- Ciclos o referencias inválidas **DEBEN** invalidar la migración

---

## 16. Expectativas de Rendimiento

El motor **DEBERÍA** operar en:

**O(E + D)**

Donde:
- E = número de eventos
- D = número de dependencias

La detección de ciclos **DEBERÍA** usar recorrido de grafo determinista (ej., DFS con listas de adyacencia ordenadas).

---

## 17. Objetivos No Incluidos

El Motor de Resolución de Eventos **NO**:
- Ejecuta eventos
- Programa triggers en runtime
- Se integra con sistemas externos
- Realiza efectos secundarios

Es validación puramente estructural y semántica.

---

## 18. Criterios de Cumplimiento

Una implementación es compatible si:
- Resuelve referencias de eventos determinísticamente
- Detecta ciclos confiablemente
- Fuerza compatibilidad de triggers
- Valida expresiones estáticamente
- Produce ordenamiento estable

---

## 19. Resumen

El Motor de Resolución de Eventos:
- Resuelve eventos declarativos
- Fuerza integridad estructural
- Detecta ciclos
- Produce modelo de ejecución determinista
- Se integra con validación y migraciones
