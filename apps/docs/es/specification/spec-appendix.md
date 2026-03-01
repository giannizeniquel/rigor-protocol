# Apéndice de la Spec (v0.1)

Este documento complementa el Conjunto de Especificaciones de RIGOR. Define convenciones normativas auxiliares, reglas notacionales, términos del glosario, ejemplos de errores estructurados y planos de implementación.

## A. Terminología Normativa

Las siguientes palabras clave son normativas en toda la documentación de RIGOR:

- **MUST (DEBE)**: Requisito obligatorio.
- **MUST NOT (NO DEBE)**: Comportamiento prohibido.
- **SHOULD (DEBERÍA)**: Recomendación fuerte.
- **MAY (PUEDE)**: Característica o comportamiento opcional.

Estas palabras clave son semánticamente vinculantes para cualquier implementación que reclame conformidad con el protocolo.

## B. Notación y Convenciones

### B.1 Reglas de Identificadores
Los identificadores (para entidades, procesos, estados, eventos y campos) **DEBEN**:
- Ser solo ASCII.
- Comenzar con una letra.
- Contener solo letras, números y guiones bajos.
- Ser sensibles a mayúsculas y minúsculas.

**Regex Formal:** `^[A-Za-z][A-Za-z0-9_]*$`

### B.2 Recomendaciones de Nombres
Aunque no es obligatorio, se recomiendan encarecidamente los siguientes patrones para la interoperabilidad:
- **Entidades / Procesos / Eventos**: `PascalCase`
- **Campos / Claves de Contexto**: `snake_case`
- **Estados**: `UPPER_SNAKE_CASE`
- **Transiciones**: `verbNoun`

## C. Sintaxis de Rutas Canónicas (Normativo)

Las rutas se utilizan para referenciar de forma única los nodos en el [Modelo de Grafo](./graph-model) para informes de Diff, errores de validación y salidas de CLI.

### C.1 Gramática de Rutas
```
Ruta     ::= "/" Segmento { "/" Segmento }
Segmento ::= Identificador
```

**Ejemplos:**
- `/entities/User`
- `/processes/Order/states/PAID`
- `/processes/Order/transitions/pay`
- `/events/UserCreated/payload/user_id`

### C.2 Acceso a Atributos
Se accede a los atributos de las propiedades añadiendo el nombre del atributo:
- `/entities/User/properties/email/type`
- `/entities/User/relations/orders/cardinality`

## D. Glosario (Normativo)

- **Nodo**: Una unidad estructural en la representación de grafo canónico.
- **Arista (Edge)**: Una relación dirigida y tipada entre dos nodos.
- **Entidad**: Un objeto de dominio con identidad y propiedades tipadas.
- **Proceso**: Una máquina de estados determinista que gobierna transiciones y mutaciones.
- **Estado**: Una configuración discreta dentro de un proceso.
- **Transición**: Un cambio dirigido de un estado a otro activado por un evento.
- **Evento**: Una entrada externa nombrada con un payload tipado.
- **Grafo Canónico**: La representación interna normalizada utilizada para la validación formal.
- **Cambio de Ruptura (Breaking Change)**: Una modificación que invalida al menos una instancia previamente válida.
- **ChangeSet**: Una lista estructurada de cambios atómicos producidos por el motor de Diff.

## E. Guía Estructural YAML (Normativa para Herramientas)

### E.1 Reglas de Formato
- **Sangría**: Exactamente 2 espacios.
- **Tabulaciones**: **NO DEBEN** utilizarse.
- **Codificación**: UTF-8.

### E.2 Orden de Bloques Recomendado
1. `spec_version`
2. `rigor_spec_version`
3. `entities`
4. `process`
5. `events`
6. `migrations`

## F. Errores de Validación Comunes (Ejemplos)

### ERR_STRUCTURE_REQUIRED_MISSING
**Entrada:** Falta `rigor_spec_version` en la raíz.
**Resolución:** Añadir el campo obligatorio de versión del lenguaje.

### ERR_SYNTAX_INVALID_IDENTIFIER
**Entrada:** `event_id: 123Pago`
**Resolución:** Los identificadores deben comenzar con una letra (ver §B.1).

### ERR_PROCESS_UNDEFINED_STATE
**Entrada:** Transición `to: COMPLETED` donde `COMPLETED` no está en la lista de estados.
**Resolución:** Declarar todos los estados de destino en el bloque `states:`.

## G. Casos de Borde (Clarificaciones Normativas)

- **Proceso Vacío**: Un proceso con un solo estado y sin transiciones es **VÁLIDO** si el estado está marcado como terminal.
- **Transiciones Terminales**: Un estado marcado como `terminal: true` **NO DEBE** tener transiciones salientes.
- **Payload Vacío Explícito**: Los eventos sin datos DEBERÍAN declarar `payload_schema: { type: object, properties: {}, required: [] }`.

## H. Mapeo de Implementación y Esquema JSON

### H.1 Derivación de Grafo Canónico
Las implementaciones **DEBEN** mapear cada entidad del DSL a un nodo de grafo único. El anidamiento en YAML (ej. campos dentro de entidades) se mapea a aristas `HAS_FIELD` o `BELONGS_TO`.

### H.2 Esquema JSON Formal (Draft-07)
El siguiente esquema proporciona una validación estructural básica:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["rigor_spec_version", "spec_version", "process"],
  "properties": {
    "rigor_spec_version": { "type": "string" },
    "spec_version": { "type": "string" },
    "process": { "type": "string" }
  }
}
```
*(Esquema completo disponible en el repositorio de RIGOR en el directorio /schemas)*

## I. Ejemplo de Referencia Completo (Base Normativa)

```yaml
rigor_spec_version: "0.1"
spec_version: "1.0.0"

process: UserLifecycle
initial_state: PENDING

events:
  - event_id: UserActivated
    payload_schema:
      type: object
      properties:
        user_id: uuid
      required: [user_id]

states:
  PENDING:
    on:
      UserActivated:
        to: ACTIVE
  ACTIVE:
    terminal: true
```

## J. Modelos de Testing y Ejecución

### J.1 Principio de Máquina de Estados Pura
Un proceso RIGOR actúa como una función pura: `(Estado, Evento) -> (NuevoEstado, Mutaciones)`.

### J.2 Caso de Prueba (Pseudocódigo)
```python
def test_activation():
    instance = Engine.load(UserLifecycle, state="PENDING")
    result = instance.handle(UserActivated(user_id="..."))
    assert result.new_state == "ACTIVE"
    assert result.transaction_committed == True
```

## K. Estrategias Operativas

### K.1 Estrategia de Validación CI/CD
1. **Lint**: Verificar sangría y estilo YAML (§E).
2. **Schema**: Validar contra el Esquema JSON (§H.2).
3. **Semántica**: Ejecutar `rigor validate --strict`.
4. **Diff**: Verificar consistencia de versión usando `rigor diff`.

### K.2 Ejecución Distribuida
RIGOR permite Sagas distribuidas seguras al proporcionar límites de estado deterministas y contratos de eventos explícitos.

## L. Conformidad y Alineación de Versiones

Una implementación que reclame conformidad con RIGOR v0.1 **DEBE** implementar la resolución de rutas canónicas, seguir las restricciones de identificadores y superar todas las reglas en la [Matriz de Validación](./validation-matrix).

Este Apéndice está alineado con **RIGOR Core v0.1**.
