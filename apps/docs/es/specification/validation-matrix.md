# Matriz de Validación (v0.1)

La Matriz de Validación de RIGOR define las reglas normativas que una especificación debe satisfacer para ser considerada conforme al protocolo. Transforma la validación de un detalle de implementación en un pilar central del estándar.

## 1. Niveles de Validación

RIGOR define dos modos operativos distintos para el validador:

### 1.1 Modo Estándar (`rigor validate`)
Se centra en la **corrección estructural** y la integridad referencial. Asegura que la especificación sea técnicamente utilizable por un motor pero no garantiza todos los invariantes del protocolo.

### 1.2 Modo Estricto (`rigor validate --strict`)
Certifica el **cumplimiento formal del protocolo**. Aplica todas las reglas semánticas, invariantes del protocolo y requisitos de seguridad de evolución.

---

## 2. Definición de Cumplimiento

* **Estructuralmente Válido**: Una especificación que retorna código de salida `0` en Modo Estándar.
* **Conforme al Protocolo**: Una especificación que retorna código de salida `0` en Modo Estricto.

Solo el Modo Estricto proporciona la garantía formal de que un sistema adheres al estándar RIGOR.

---

## 3. La Matriz

Las reglas se categorizan como:
* **S1**: Estructural
* **S2**: Referencial
* **S3**: Semántico
* **S4**: Invariantes del Protocolo
* **S5**: Evolución y Versionado
* **S6**: Mejores Prácticas

| ID | Categoría | Regla | Estándar | Estricto |
| :--- | :--- | :--- | :--- | :--- |
| **V1** | S1 | Sintaxis YAML válida | ERROR | ERROR |
| **V2** | S1 | Campos raíz requeridos presentes | ERROR | ERROR |
| **V3** | S1 | Tipos de campo coinciden con esquema | ERROR | ERROR |
| **V4** | S1 | Sin campos desconocidos a nivel raíz | ERROR | ERROR |
| **V5** | S2 | `initial_state` existe | ERROR | ERROR |
| **V6** | S2 | Transición `target` existe | ERROR | ERROR |
| **V7** | S2 | Evento referenciado declarado | ERROR | ERROR |
| **V8** | S2 | `event_id` único | ERROR | ERROR |
| **V9** | S2 | `state_id` único | ERROR | ERROR |
| **V10** | S3 | Estado terminal no tiene transiciones salientes | ERROR | ERROR |
| **V11** | S3 | Sin transiciones duplicadas (estado, evento) | ERROR | ERROR |
| **V12** | S3 | Guards sintácticamente válidos | ERROR | ERROR |
| **V13** | S3 | Guards referencian solo ámbito permitido (`context`, `payload`) | WARNING | ERROR |
| **V14** | S4 | Sin estados inalcanzables | WARNING | ERROR |
| **V15** | S4 | Existe al menos un estado terminal | ERROR | ERROR |
| **V16** | S4 | Existe al menos una ruta de terminación desde inicial | WARNING | ERROR |
| **V17** | S4 | Sin ciclos infinitos sin ruta de salida | WARNING | ERROR |
| **V18** | S5 | `rigor_spec_version` soportada | ERROR | ERROR |
| **V19** | S5 | `spec_version` SemVer válido | ERROR | ERROR |
| **V20** | S5 | Sin campos deprecated usados | WARNING | ERROR |
| **V21** | S6 | Orden canónico de secciones | WARNING | WARNING |
| **V22** | S6 | Convenciones de nombres respetadas (snake_case) | WARNING | WARNING |

---

## 4. Severidad y Escalamiento

### 4.1 ERROR
- La especificación es **inválida**.
- El código de salida debe ser `1`.
- La generación de artefactos está prohibida.

### 4.2 WARNING
- En **Modo Estándar**: Solo información; la especificación sigue siendo válida.
- En **Modo Estricto**: Las reglas en categorías S3, S4 y S5 escalan a **ERROR**. Las reglas S6 permanecen como warnings.

---

## 5. Expectativas Algorítmicas

Los validadores conformes DEBEN implementar la siguiente lógica:
- **Alcancabilidad (V14)**: Recorrido de grafo desde `initial_state` para identificar nodos huérfanos.
- **Detección de Ciclos (V17)**: Identificación de componentes fuertemente conectados sin transición de salida.
- **Determinismo**: El proceso de validación debe ser puro, idempotente e independiente del estado externo.

---

## 6. Versionado de la Matriz
La Matriz de Validación está versionada junto con el núcleo del protocolo. Este documento describe **Matriz v0.1**, compatible con **RIGOR Core v0.1**.
