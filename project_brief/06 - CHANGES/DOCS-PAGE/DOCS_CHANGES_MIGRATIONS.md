# 📘 RIGOR — Migrations Specification

**Documento para Arquitectura**
Versión objetivo: Core v0.1

---

# 1. Objetivo

Formalizar el modelo normativo de migraciones de especificaciones en RIGOR.

Este documento define:

* Representación estructural de migraciones
* Gramática formal
* Operaciones permitidas
* Reglas de validación
* Integración con versioning
* Integración con CLI
* Error taxonomy
* Restricciones determinísticas

Las migraciones permiten evolucionar una `spec_version` preservando coherencia semántica.

---

# 2. Definición Normativa

## 2.1 Migration

Una **Migration** es un conjunto ordenado y determinístico de operaciones que transforma una especificación desde una versión `A` hacia una versión `B`.

Una migración:

* Debe ser declarativa
* Debe ser determinística
* Debe ser validable
* No puede depender de estado externo

---

# 3. Ubicación en la Especificación

Las migraciones se declaran opcionalmente en el root del documento:

```yaml
migrations:
  - from: "1.0.0"
    to: "1.1.0"
    operations:
      - add_state:
          name: "Escalated"
      - add_event:
          name: "ESCALATE"
```

---

# 4. Gramática Formal (EBNF)

```
MIGRATIONS      ::= "migrations:" MIGRATION_LIST
MIGRATION_LIST  ::= "-" MIGRATION { "-" MIGRATION }
MIGRATION       ::= FROM TO OPERATIONS
FROM            ::= "from:" VERSION
TO              ::= "to:" VERSION
OPERATIONS      ::= "operations:" OPERATION_LIST
OPERATION_LIST  ::= "-" OPERATION { "-" OPERATION }
```

---

# 5. Reglas de Versionado

1. `from` MUST be < `to`
2. Versions MUST follow SemVer
3. `to` MUST equal declared `spec_version`
4. Migraciones solo pueden existir entre versiones consecutivas
5. No se permiten saltos múltiples sin cadena intermedia

Ejemplo inválido:

```
1.0.0 → 1.2.0 (sin 1.1.0)
```

---

# 6. Operaciones Permitidas (v0.1)

Las siguientes operaciones están permitidas:

---

## 6.1 AddState

```yaml
- add_state:
    name: "Escalated"
```

Reglas:

* No debe existir previamente
* No puede romper alcanzabilidad obligatoria

---

## 6.2 RemoveState

```yaml
- remove_state:
    name: "DeprecatedState"
```

Reglas:

* No puede ser estado inicial
* No puede tener transiciones entrantes/salientes activas
* Debe preservar consistencia del grafo

---

## 6.3 RenameState

```yaml
- rename_state:
    from: "Pending"
    to: "Awaiting"
```

Reglas:

* Debe actualizar todas las transiciones
* No puede colisionar con estado existente

---

## 6.4 AddEvent

```yaml
- add_event:
    name: "ESCALATE"
```

---

## 6.5 RemoveEvent

```yaml
- remove_event:
    name: "OLD_EVENT"
```

Solo permitido en MAJOR increment.

---

## 6.6 ModifyTransition

```yaml
- modify_transition:
    from: "Open"
    event: "APPROVE"
    to: "Approved"
```

Reglas:

* No puede generar no-determinismo
* No puede invalidar el Graph Model

---

## 6.7 ModifyContextSchema

```yaml
- modify_context_schema:
    field: "priority"
    type: "integer"
```

Reglas:

* Cambios incompatibles requieren MAJOR increment

---

# 7. Reglas de Validación

La validación de migraciones ocurre en tres capas:

---

## 7.1 Structural Validation

* Version format válido
* from < to
* operations no vacías
* operaciones válidas

---

## 7.2 Graph Validation

Post-migración el grafo debe:

* Mantener determinismo
* No generar estados huérfanos
* No generar transiciones inválidas
* Mantener al menos un estado inicial

---

## 7.3 Version Compatibility Validation

* Operaciones permitidas según tipo de cambio:

  * PATCH → solo metadata
  * MINOR → add-only
  * MAJOR → cambios destructivos permitidos

---

# 8. Secuenciación

Las migraciones forman una cadena dirigida:

```
1.0.0 → 1.1.0 → 1.2.0 → 2.0.0
```

Reglas:

* No se permiten ciclos
* No se permiten forks
* No se permiten múltiples caminos hacia misma versión

---

# 9. Error Taxonomy

| Code                                   | Description                              |
| -------------------------------------- | ---------------------------------------- |
| ER-MIGRATION-INVALID-VERSION           | Formato inválido                         |
| ER-MIGRATION-NON-SEQUENTIAL            | Salto no permitido                       |
| ER-MIGRATION-CYCLE                     | Ciclo detectado                          |
| ER-MIGRATION-FORK                      | Múltiples migraciones hacia mismo target |
| ER-MIGRATION-INVALID-OPERATION         | Operación no válida                      |
| ER-MIGRATION-GRAPH-BROKEN              | Grafo inválido post-migración            |
| ER-MIGRATION-INCOMPATIBLE-VERSION-TYPE | Operación no permitida según SemVer      |

---

# 10. Determinism Guarantee

La aplicación de migraciones:

* Debe producir siempre el mismo resultado
* No puede depender del orden externo
* Debe aplicar operaciones en orden definido

---

# 11. CLI Integration

Se propone el siguiente comando:

```
rigor migrate <spec.yaml> --to <version>
```

Opciones:

```
--dry-run
--strict
--output <file>
```

Comportamiento:

1. Validar versiones
2. Resolver cadena de migraciones
3. Aplicar operaciones secuencialmente
4. Validar resultado
5. Emitir nueva spec

---

# 12. Interaction with Validation Matrix

Nueva categoría:

| Category  | Rule                  |
| --------- | --------------------- |
| MIGRATION | Structural validity   |
| MIGRATION | Graph validity        |
| MIGRATION | Version compatibility |
| MIGRATION | Determinism           |

---

# 13. Ejemplo Completo

```yaml
rigor_spec_version: "0.1"
spec_version: "1.1.0"

migrations:
  - from: "1.0.0"
    to: "1.1.0"
    operations:
      - add_state:
          name: "Escalated"
      - add_event:
          name: "ESCALATE"
      - modify_transition:
          from: "Open"
          event: "ESCALATE"
          to: "Escalated"
```

---

# 14. Cambios Requeridos en la Página Actual

La página actual debe:

1. Incluir definición normativa formal
2. Incluir gramática
3. Listar operaciones permitidas
4. Incluir reglas de validación
5. Definir error taxonomy
6. Incluir ejemplos completos
7. Referenciar Versioning y Graph Model
8. Documentar integración CLI

---

# 15. Decisiones Arquitectónicas a Confirmar

El arquitecto debe validar:

1. ¿Migraciones embebidas en spec o archivo separado?
2. ¿Se permiten migraciones bidireccionales?
3. ¿Se permitirá auto-generación de migraciones?
4. ¿El validator puede sugerir migraciones?
5. ¿Se soportarán migraciones parciales?

---

# 16. Resultado

Con esta formalización:

* Migrations deja de ser conceptual
* Se integra con Versioning
* Se integra con Validation Matrix
* Se vuelve ejecutable por CLI
* Se vuelve verificable formalmente
* Se preserva determinismo
