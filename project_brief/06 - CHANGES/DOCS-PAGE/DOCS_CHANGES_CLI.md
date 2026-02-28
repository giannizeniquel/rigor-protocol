## Documento para Arquitecto

### Página: CLI – Especificación Formal (Validador + Generador + Formatter)

---

## 1. Objetivo del Cambio

Redefinir completamente la página **CLI** dentro de la especificación del protocolo para que el CLI deje de ser una herramienta auxiliar y pase a ser un componente normativo del ecosistema.

El CLI tendrá tres responsabilidades obligatorias:

1. **Validador formal del protocolo**
2. **Generador de artefactos**
3. **Formatter canónico**

Debe convertirse en la herramienta oficial de enforcement del estándar.

---

## 2. Problemas Detectados en la Página Actual

1. El CLI está definido de forma superficial.
2. No se establecen contratos formales de comportamiento.
3. No se define el modelo de ejecución.
4. No hay especificación de códigos de salida.
5. No se define un modo máquina (machine-readable).
6. No se separan claramente las responsabilidades.
7. No se establece el rol del CLI dentro del ciclo IA ↔ Humano.

---

## 3. Nueva Definición del CLI

### 3.1 Naturaleza

El CLI es:

* Determinístico
* Idempotente
* Sin efectos colaterales no explícitos
* Offline-first
* Independiente del runtime del proyecto

No ejecuta lógica de negocio.
No ejecuta código generado.
No resuelve dependencias externas.

---

## 4. Arquitectura Conceptual

El CLI se divide en tres módulos formales:

```
CLI
 ├── Validator
 ├── Generator
 └── Formatter
```

Cada módulo debe poder ejecutarse de forma independiente.

---

## 5. Módulo 1 — Validator

### 5.1 Objetivo

Verificar que un documento del protocolo cumpla estrictamente con:

* Gramática
* Tipos
* Reglas semánticas
* Restricciones estructurales
* Invariantes

---

### 5.2 Tipos de Validación

1. **Sintáctica**

   * Estructura correcta
   * Tokens válidos
   * Secciones obligatorias

2. **Semántica**

   * Referencias existentes
   * Tipos compatibles
   * No ambigüedad

3. **Estructural**

   * Jerarquía correcta
   * Cardinalidad válida

4. **Reglas del dominio**

   * Constraints explícitos
   * Invariantes

---

### 5.3 Modos de Ejecución

```
rigor validate <file>
rigor validate <directory>
```

Opcionales:

```
--strict
--json
--fail-on-warning
--no-color
```

---

### 5.4 Códigos de Salida

| Código | Significado           |
| ------ | --------------------- |
| 0      | Válido                |
| 1      | Error de validación   |
| 2      | Error interno         |
| 3      | Archivo no encontrado |
| 4      | Error de parsing      |

Esto debe quedar normado en la especificación.

---

## 6. Módulo 2 — Generator

### 6.1 Objetivo

Transformar un documento válido del protocolo en artefactos concretos.

Ejemplos:

* Esqueletos de proyecto
* DTOs
* Interfaces
* Esquemas JSON
* Migraciones
* SDKs
* Tipos para frontend

---

### 6.2 Principio Fundamental

El generador:

* No debe inventar comportamiento.
* Solo puede generar lo que esté explícitamente definido en el protocolo.
* Debe ser reproducible.

---

### 6.3 Comandos

```
rigor generate <target> --from <file>
```

Ejemplos:

```
rigor generate schema --from user.rigor
rigor generate typescript --from protocol/
rigor generate openapi --from api.rigor
```

---

### 6.4 Salida

Debe permitir:

```
--out <directory>
--stdout
--overwrite
--dry-run
```

---

## 7. Módulo 3 — Formatter

### 7.1 Objetivo

Garantizar un formato canónico único.

El formatter:

* Reordena claves
* Normaliza indentación
* Elimina ambigüedades
* Ordena bloques determinísticamente

---

### 7.2 Comando

```
rigor format <file>
rigor format <directory>
```

Opcionales:

```
--check
--write
```

---

### 7.3 Principio Crítico

El formato debe ser:

* Determinístico
* Idempotente
* Independiente del estilo del autor

La IA debe poder producir formato imperfecto y el formatter lo normaliza.

---

## 8. Integración con IA

Debe agregarse una sección nueva:

### 8.1 Flujo Recomendado

1. IA genera archivo `.rigor`
2. Humano revisa reglas de negocio
3. CLI valida
4. CLI formatea
5. CLI genera artefactos

Esto convierte al CLI en el guardián del estándar.

---

## 9. Modo Máquina (Obligatorio)

Debe definirse soporte para:

```
--json
```

El CLI debe emitir errores estructurados:

```json
{
  "file": "user.rigor",
  "line": 12,
  "column": 5,
  "code": "E_TYPE_MISMATCH",
  "message": "Expected integer but got string"
}
```

Esto es fundamental para:

* Integración con IDEs
* CI/CD
* Agentes IA
* LSP futuro

---

## 10. Configuración

Debe definirse un archivo opcional:

```
rigor.config.json
```

Permite:

* Nivel de strict
* Targets por defecto
* Paths
* Reglas adicionales

---

## 11. Versionado

El CLI debe:

* Mostrar versión del protocolo soportada
* Advertir incompatibilidades

Comando:

```
rigor version
```

---

## 12. Extensibilidad (Fase 2)

Sección futura:

* Plugins
* Custom generators
* Hooks
* Validadores adicionales

Pero no debe estar activo en la v1.

---

## 13. Cambios Concretos a la Página CLI

La página actual debe:

1. Reescribirse completamente.
2. Incluir:

   * Definición formal del CLI
   * Arquitectura modular
   * Especificación de comandos
   * Códigos de salida
   * Modo máquina
   * Integración IA
3. Eliminar cualquier ambigüedad narrativa.
4. Convertirse en una especificación técnica, no descriptiva.

---

## 14. Decisión Arquitectónica Clave

El CLI no es opcional.
Es parte constitutiva del estándar.

Sin CLI no hay enforcement formal.

---

## 15. Impacto Sistémico

Este cambio:

* Eleva el protocolo de documento conceptual a ecosistema operativo.
* Permite CI formal.
* Permite tooling IDE.
* Permite automatización IA.
* Reduce ambigüedad humana.

---
