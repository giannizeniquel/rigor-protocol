# Breaking Change Classification Algorithm

## Formal Design for RIGOR Diff v0.1

Este documento define el algoritmo formal y determinístico para clasificar cambios como **breaking** o **non-breaking**.

Se integra con:

* Graph Model
* Validation Matrix
* Versioning
* Diff Specification

---

# 1. Definición Formal de Breaking Change

Un cambio es **breaking** si y solo si:

> Existe al menos una instancia válida bajo Spec_A que no es válida bajo Spec_B.

Formalmente:

```
∃ instance I :
Validate(I, Spec_A) = valid
AND
Validate(I, Spec_B) = invalid
```

Si la condición anterior se cumple → `breaking = true`.

Si no se cumple → `breaking = false`.

---

# 2. Clasificación Determinística Basada en Tipo de Cambio

Para evitar validación exhaustiva de instancias, se define una matriz de decisión determinística basada en propiedades del grafo.

---

# 3. Rule Engine Formal

Definimos:

```
Classify(Change C) → {Breaking, NonBreaking}
```

El motor de clasificación evalúa reglas en orden.

---

# 4. Reglas de Clasificación

## 4.1 Node-Level Changes

### Rule N1 — NodeRemoved

```
IF C.type = NodeRemoved
THEN Breaking
```

Razonamiento: Instancias que referencian ese nodo dejan de ser válidas.

---

### Rule N2 — NodeAdded

```
IF C.type = NodeAdded
AND Node is optional
THEN NonBreaking
```

Si el nodo es requerido por defecto:

```
IF NodeAdded AND Node.required = true
THEN Breaking
```

---

### Rule N3 — NodeRenamed

Por defecto:

```
NodeRenamed → Breaking
```

Salvo que exista mapping explícito en Migration Spec.

---

# 5. Property-Level Changes

## Rule P1 — PropertyRemoved

Siempre breaking:

```
PropertyRemoved → Breaking
```

---

## Rule P2 — PropertyAdded

```
IF PropertyAdded AND required = false
THEN NonBreaking
```

```
IF PropertyAdded AND required = true
THEN Breaking
```

---

## Rule P3 — PropertyTypeChanged

Siempre breaking:

```
TypeChanged → Breaking
```

---

# 6. Constraint Changes

## Rule C1 — ConstraintStrengthened

Ejemplos:

* minLength ↑
* maxValue ↓
* pattern más restrictivo

```
ConstraintStrengthened → Breaking
```

---

## Rule C2 — ConstraintWeakened

Ejemplos:

* minLength ↓
* maxValue ↑
* pattern menos restrictivo

```
ConstraintWeakened → NonBreaking
```

---

# 7. Cardinality Rules

## Rule K1 — Cardinality Increase (Optionality Relaxed)

Ejemplo:

```
1 → 0..1
1 → 0..*
```

→ NonBreaking

---

## Rule K2 — Cardinality Decrease (Optionality Strengthened)

Ejemplo:

```
0..1 → 1
0..* → 1..*
```

→ Breaking

---

# 8. Edge-Level Changes

## Rule E1 — EdgeRemoved

```
EdgeRemoved → Breaking
```

---

## Rule E2 — EdgeAdded

Depende:

```
IF EdgeAdded introduces required relationship
THEN Breaking
ELSE NonBreaking
```

---

# 9. Semantic Equivalence Rule

Antes de clasificar como breaking, se debe verificar:

```
IF Graph_A normalized == Graph_B normalized
THEN NoChange
```

Evita falsos positivos por reordenamiento.

---

# 10. Composite Change Evaluation

Cuando múltiples cambios afectan el mismo nodo:

El motor debe:

1. Evaluar cada cambio individualmente.
2. Si al menos uno es breaking → Nodo considerado breaking.
3. Summary general:

```
IF ∃ C.breaking = true
THEN ChangeSet.breaking = true
```

---

# 11. Formal Classification Pipeline

```
1. Canonicalize Graph_A
2. Canonicalize Graph_B
3. Generate RawChanges
4. For each change:
       Apply Classification Rules
5. Aggregate Summary
6. Validate version bump consistency
```

---

# 12. Versioning Consistency Check

Una vez clasificados los cambios:

```
IF BreakingChanges > 0
AND MajorVersion_B <= MajorVersion_A
THEN VersioningError
```

```
IF BreakingChanges = 0
AND MinorVersion_B < MinorVersion_A
THEN VersioningError
```

---

# 13. Determinism Guarantees

El algoritmo MUST:

* Evaluar reglas en orden fijo.
* No depender de estado externo.
* No depender de datos runtime.
* No ejecutar validaciones dinámicas sobre instancias reales.
* Basarse únicamente en análisis estructural.

---

# 14. Extensibilidad

Las reglas pueden versionarse:

```
DiffRuleset v0.1
```

En el futuro:

* v0.2 podría redefinir clasificación.
* CLI podría soportar `--ruleset`.

---

# 15. Edge Cases a Resolver con Arquitecto

1. ¿Se permite renombrado con alias backward compatible?
2. ¿Deprecation debe clasificarse como non-breaking?
3. ¿Se soporta transitional compatibility window?
4. ¿Se considera breaking el cambio de default value?
5. ¿Cambios en metadata afectan versioning?

---

# 16. Resultado

Con este algoritmo:

* Breaking detection es formal.
* Versioning puede validarse automáticamente.
* Migration puede generarse.
* CI/CD puede bloquear releases inválidas.
* Diff se vuelve matemáticamente consistente.
