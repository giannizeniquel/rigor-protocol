# Documento para Arquitecto

## Diff Specification v0.1

**Status:** Proposal
**Scope:** Specification Layer (Normative)
**Relation:** Versioning + Migrations + Validation + CLI

---

# 1. Objetivo

Formalizar el modelo de comparación semántica entre dos especificaciones RIGOR.

Este documento define:

* Qué es un diff en RIGOR.
* Sobre qué modelo opera.
* Qué tipos de cambios existen.
* Cómo se clasifican (breaking / non-breaking).
* Qué salida normativa produce.
* Cómo se integra con Versioning, Migration y CLI.

No define implementación interna, pero sí comportamiento determinístico obligatorio.

---

# 2. Problema Actual

Actualmente:

* Existe Versioning.
* Existe Migration.
* Existe Validation.
* Existe Graph Model formal.

Pero **no existe especificación formal de comparación entre versiones**.

Esto deja indefinido:

* Cómo detectar breaking changes.
* Cómo validar incrementos de versión.
* Cómo generar planes de migración.
* Cómo auditar evolución de specs.

---

# 3. Principio Fundamental

RIGOR no realiza diff textual.

RIGOR realiza:

> Semantic Graph Diff

El diff opera sobre el **Canonical Graph Representation** definido en el documento de Graph Model.

---

# 4. Modelo Formal

## 4.1 Entrada

Dos especificaciones válidas:

```
Spec_A
Spec_B
```

Ambas MUST:

* Ser válidas bajo Validation Matrix.
* Tener representación canónica de grafo.

---

## 4.2 Función Formal

```
Diff = f(Graph_A, Graph_B) → ChangeSet
```

Donde:

* Graph_A = canonical representation of Spec_A
* Graph_B = canonical representation of Spec_B
* ChangeSet = conjunto ordenado determinístico de cambios

---

# 5. Canonical Comparison Rules

El diff MUST:

1. Ser independiente del orden textual.
2. Ignorar formato (YAML/JSON/etc.).
3. Operar únicamente sobre nodos, aristas y propiedades.
4. Producir el mismo resultado para el mismo par de grafos.
5. Ordenar los cambios de forma determinística.

---

# 6. Tipos de Cambio

## 6.1 Cambios Estructurales

| Tipo        | Descripción             | Breaking         |
| ----------- | ----------------------- | ---------------- |
| NodeAdded   | Nuevo nodo agregado     | No               |
| NodeRemoved | Nodo eliminado          | Sí               |
| EdgeAdded   | Nueva relación          | Depende          |
| EdgeRemoved | Relación eliminada      | Sí               |
| NodeRenamed | Cambio de identificador | Sí (por defecto) |

---

## 6.2 Cambios de Propiedad

| Tipo                | Descripción         | Breaking |
| ------------------- | ------------------- | -------- |
| PropertyAdded       | Nueva propiedad     | Depende  |
| PropertyRemoved     | Propiedad eliminada | Sí       |
| PropertyModified    | Valor modificado    | Depende  |
| PropertyTypeChanged | Cambio de tipo      | Sí       |

---

## 6.3 Cambios Semánticos

| Tipo                   | Descripción                 | Breaking |
| ---------------------- | --------------------------- | -------- |
| ConstraintStrengthened | Restricción más estricta    | Sí       |
| ConstraintWeakened     | Restricción más laxa        | No       |
| CardinalityChanged     | Cambio en multiplicidad     | Depende  |
| RequiredAdded          | Campo pasa a requerido      | Sí       |
| RequiredRemoved        | Campo deja de ser requerido | No       |

---

# 7. Clasificación de Breaking Changes

Definición formal:

```
BreakingChange := Change that invalidates a previously valid instance
```

Formalmente:

Un cambio es breaking si:

Existe al menos una instancia válida bajo Spec_A que no es válida bajo Spec_B.

Esto conecta directamente con Validation Matrix.

---

# 8. Estructura Normativa del ChangeSet

Salida estándar obligatoria:

```json
{
  "from": "1.0.0",
  "to": "1.1.0",
  "changes": [
    {
      "id": "chg-001",
      "type": "NodeRemoved",
      "path": "/entities/User",
      "breaking": true,
      "details": {
        "reason": "Entity removed"
      }
    }
  ],
  "summary": {
    "total": 3,
    "breaking": 1,
    "nonBreaking": 2
  }
}
```

### Requisitos:

* `id` MUST be unique.
* `path` MUST use canonical path notation.
* `breaking` MUST be deterministically derived.
* `summary` MUST reflect counts exactly.

---

# 9. Determinism Requirements

El algoritmo de diff MUST:

* Usar ordenamiento canónico de nodos.
* Comparar identificadores únicos.
* No depender de estado externo.
* No depender de timestamp.
* No depender de orden de archivo.

---

# 10. Integración con Versioning

Diff y Versioning deben alinearse:

* Si existen breaking changes → Major MUST increment.
* Si existen non-breaking structural changes → Minor SHOULD increment.
* Si solo metadata changes → Patch MAY increment.

CLI `--strict` puede validar coherencia entre diff y version bump.

---

# 11. Integración con Migration

Migration se basa en ChangeSet.

Reglas:

* Breaking change MUST require migration entry.
* Non-breaking change MAY auto-generate migration plan.
* Migration engine MUST consume ChangeSet as input.

---

# 12. Integración con CLI

Comando:

```
rigor diff specA.yaml specB.yaml
```

Opciones:

```
--format json
--summary
--strict
--classify
--exit-on-breaking
```

Exit codes propuestos:

| Código | Significado         |
| ------ | ------------------- |
| 0      | Sin cambios         |
| 1      | Cambios no-breaking |
| 2      | Cambios breaking    |
| 3      | Error de validación |

---

# 13. Edge Cases a Definir

El arquitecto debe validar:

1. ¿Se permite NodeRenamed sin considerarlo removal + add?
2. ¿Se detectan movimientos estructurales?
3. ¿Se soporta soft deprecation?
4. ¿Se permite ignorar ciertos paths?
5. ¿Se soporta diff parcial?

---

# 14. Open Design Questions

Para decisión arquitectónica:

* ¿El diff debe detectar cambios transitivos?
* ¿Debe incluir impacto analysis?
* ¿Debe calcular minimal change set?
* ¿Debe incluir clasificación de riesgo?

---

# 15. Ubicación en la Documentación

Orden recomendado:

```
Versioning
Diff
Migrations
```

Justificación:

Versioning define intención.
Diff detecta realidad.
Migration ejecuta adaptación.

---

# 16. Impacto Sistémico

Este documento:

* Cierra el ciclo de evolución del protocolo.
* Permite validación automática de releases.
* Permite CI enforcement.
* Permite generación automática de migraciones.
* Hace el sistema auditable.

---

# 17. Próximo Paso

Si el arquitecto aprueba:

1. Producimos versión normativa reescrita Diff v0.1.
2. Luego hacemos cross-alignment con Versioning y Migrations.
3. Finalmente, generamos actualización del CLI spec para integrar `diff`.

---
