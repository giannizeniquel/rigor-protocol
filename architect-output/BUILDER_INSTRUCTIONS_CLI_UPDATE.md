# BUILDER INSTRUCTIONS: CLI Specification Rewrite (v2)

**Status:** Ready for Implementation  
**Context:** Redefine the CLI from an auxiliary tool to a normative, constituent component of the RIGOR protocol.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/DOCS_CHANGES_CLI.md`

---

## 🎯 Objectives
1.  **Complete Rewrite**: Replace the current `cli.md` (EN and ES) with the new formal specification.
2.  **Normative Role**: Establish the CLI as the official enforcement tool for the standard.
3.  **Modular Architecture**: Define the three mandatory modules: Validator, Generator, and Formatter.
4.  **Operational Contract**: Define deterministic behavior, exit codes, and machine-readable output.
5.  **AI Integration**: Formalize the role of the CLI in the AI-assisted development lifecycle.

---

## 🛠️ Step 1: Update `apps/docs/specification/cli.md`

Replace the entire content of `apps/docs/specification/cli.md` with the following:

```markdown
# CLI Specification (v0.1)

The RIGOR Command Line Interface (CLI) is a normative, constituent component of the protocol. It serves as the official guardian of the standard, ensuring structural integrity, canonical formatting, and deterministic artifact generation.

## 1. Nature and Principles

The RIGOR CLI is designed for **deterministic automation** and **formal enforcement**.

### Core Principles:
- **Deterministic**: Identical inputs must yield identical outputs and exit codes.
- **Idempotent**: Re-running operations on the same input produces no additional side effects.
- **Offline-First**: All core operations must function without external network access.
- **Implementation-Independent**: It does not execute business logic, generated code, or resolve external runtime dependencies.
- **Machine-Readable**: Supports structured output (JSON) for all commands.

## 2. Modular Architecture

 The CLI is composed of three formal, independent modules:

```
CLI
 ├── Validator (Structural & Semantic Enforcement)
 ├── Generator (Artifact & Implementation Derivation)
 └── Formatter (Canonical Representation)
```

---

## 3. Module 1: Validator

The Validator ensures that a protocol document strictly adheres to the grammar, types, semantic rules, and invariants of RIGOR Core v0.1.

### 3.1 Validation Tiers
1. **Syntactic**: Correct structure, valid tokens, and mandatory sections.
2. **Semantic**: Resolution of references, type compatibility, and non-ambiguity.
3. **Structural**: Correct hierarchy and valid cardinality.
4. **Domain Rules**: Adherence to explicit constraints and protocol invariants.

### 3.2 Commands
```bash
rigor validate <file|directory> [options]
```

**Options:**
- `--strict`: Treats warnings as errors.
- `--json`: Outputs a machine-readable validation report.
- `--fail-on-warning`: Returns a non-zero exit code if warnings are found.
- `--no-color`: Disables terminal color output.

### 3.3 Exit Codes
| Code | Meaning | Description |
| :--- | :--- | :--- |
| `0` | Valid | The specification is fully compliant. |
| `1` | Validation Error | Structural or semantic violations detected. |
| `2` | Internal Error | Unexpected failure within the CLI tool. |
| `3` | IO Error | File or directory not found. |
| `4` | Parse Error | Syntactic failure (invalid grammar). |

---

## 4. Module 2: Generator

The Generator transforms a valid protocol document into concrete, deterministic artifacts.

### 4.1 Fundamental Principles
- **No Implicit Behavior**: The generator must not "invent" behavior not explicitly defined in the protocol.
- **Reproducibility**: Same specification and target version must produce identical files.
- **Atomic Output**: Artifact generation should be treated as a single unit of work.

### 4.2 Commands
```bash
rigor generate <target> --from <file|directory> [options]
```

**Targets:**
- `schema`: Generates JSON-schema for the context.
- `typescript`: Generates typed interfaces and process skeletons.
- `openapi`: Generates API contracts.
- `migrations`: Generates structural migration scripts between versions.

**Options:**
- `--out <dir>`: Target output directory.
- `--stdout`: Emits content to standard output.
- `--overwrite`: Permits overwriting existing files.
- `--dry-run`: Simulates generation without writing to disk.

---

## 5. Module 3: Formatter

The Formatter guarantees a single, canonical representation of RIGOR documents.

### 5.1 Objectives
- **Normalization**: Reorders keys, standardizes indentation, and removes whitespace ambiguity.
- **Determinism**: Ensures that any compliant specification has exactly one valid textual representation.
- **AI-Human Bridge**: Allows AI-generated (potentially messy) code to be instantly normalized for human review.

### 5.2 Commands
```bash
rigor format <file|directory> [options]
```

**Options:**
- `--check`: Returns exit code 1 if the file is not in canonical format.
- `--write`: Rewrites the file in canonical format.

---

## 6. AI Integration Flow

The CLI is the formal gatekeeper in the AI-assisted development lifecycle:

1. **AI Generation**: An AI agent produces a `.rigor` file.
2. **Human Review**: A human architect reviews the business rules and constraints.
3. **Validation**: `rigor validate` ensures the document is technically sound.
4. **Formatting**: `rigor format --write` normalizes the representation.
5. **Generation**: `rigor generate` produces the implementation artifacts.

---

## 7. Machine-Readable Mode (`--json`)

For IDE integration, CI/CD, and AI agents, the CLI must emit structured errors:

```json
{
  "file": "user.rigor",
  "line": 12,
  "column": 5,
  "code": "E_TYPE_MISMATCH",
  "message": "Expected integer but got string",
  "severity": "ERROR"
}
```

---

## 8. Configuration and Versioning

### 8.1 Configuration (`rigor.config.json`)
Allows defining project-wide defaults:
- Default generation targets.
- Strictness levels.
- Output paths.

### 8.2 Versioning
The CLI must report the supported protocol version.
```bash
rigor version
```

---

## 9. Future Extensibility (Fase 2)
Future iterations may include support for custom plugins, generators, and hooks. These are not part of the v0.1 normative specification.
```
```

---

## 🧱 Step 2: Update `apps/docs/es/specification/cli.md`

Replace the entire content of `apps/docs/es/specification/cli.md` with the following:

```markdown
# Especificación CLI (v0.1)

La Interfaz de Línea de Comandos (CLI) de RIGOR es un componente normativo y constitutivo del protocolo. Actúa como el guardián oficial del estándar, asegurando la integridad estructural, el formateo canónico y la generación determinística de artefactos.

## 1. Naturaleza y Principios

El CLI de RIGOR está diseñado para la **automatización determinística** y el **cumplimiento formal**.

### Principios Fundamentales:
- **Determinístico**: Entradas idénticas deben producir salidas y códigos de salida idénticos.
- **Idempotente**: Re-ejecutar operaciones sobre la misma entrada no produce efectos secundarios adicionales.
- **Offline-First**: Todas las operaciones centrales deben funcionar sin acceso a la red externa.
- **Independiente de la Implementación**: No ejecuta lógica de negocio, código generado ni resuelve dependencias de tiempo de ejecución externas.
- **Legible por Máquina**: Soporta salida estructurada (JSON) para todos los comandos.

## 2. Arquitectura Modular

 El CLI se compone de tres módulos formales e independientes:

```
CLI
 ├── Validador (Cumplimiento Estructural y Semántico)
 ├── Generador (Derivación de Artefactos e Implementación)
 └── Formateador (Representación Canónica)
```

---

## 3. Módulo 1: Validador

El Validador asegura que un documento del protocolo se adhiera estrictamente a la gramática, tipos, reglas semánticas e invariantes de RIGOR Core v0.1.

### 3.1 Niveles de Validación
1. **Sintáctico**: Estructura correcta, tokens válidos y secciones obligatorias.
2. **Semántico**: Resolución de referencias, compatibilidad de tipos y ausencia de ambigüedad.
3. **Estructural**: Jerarquía correcta y cardinalidad válida.
4. **Reglas de Dominio**: Adhesión a restricciones explícitas e invariantes del protocolo.

### 3.2 Comandos
```bash
rigor validate <archivo|directorio> [opciones]
```

**Opciones:**
- `--strict`: Trata las advertencias como errores.
- `--json`: Emite un informe de validación legible por máquina.
- `--fail-on-warning`: Retorna un código de salida no nulo si se encuentran advertencias.
- `--no-color`: Desactiva la salida de color en la terminal.

### 3.3 Códigos de Salida
| Código | Significado | Descripción |
| :--- | :--- | :--- |
| `0` | Válido | La especificación cumple totalmente con el estándar. |
| `1` | Error de Validación | Se detectaron violaciones estructurales o semánticas. |
| `2` | Error Interno | Fallo inesperado dentro de la herramienta CLI. |
| `3` | Error de E/S | Archivo o directorio no encontrado. |
| `4` | Error de Parsing | Fallo sintáctico (gramática inválida). |

---

## 4. Módulo 2: Generador

El Generador transforma un documento de protocolo válido en artefactos concretos y determinísticos.

### 4.1 Principios Fundamentales
- **Sin Comportamiento Implícito**: El generador no debe "inventar" comportamiento que no esté definido explícitamente en el protocolo.
- **Reproducibilidad**: La misma especificación y versión de objetivo deben producir archivos idénticos.
- **Salida Atómica**: La generación de artefactos debe tratarse como una única unidad de trabajo.

### 4.2 Comandos
```bash
rigor generate <objetivo> --from <archivo|directorio> [opciones]
```

**Objetivos (Targets):**
- `schema`: Genera esquemas JSON para el contexto.
- `typescript`: Genera interfaces tipadas y esqueletos de procesos.
- `openapi`: Genera contratos de API.
- `migrations`: Genera scripts de migración estructural entre versiones.

**Opciones:**
- `--out <dir>`: Directorio de salida objetivo.
- `--stdout`: Emite el contenido a la salida estándar.
- `--overwrite`: Permite sobrescribir archivos existentes.
- `--dry-run`: Simula la generación sin escribir en el disco.

---

## 5. Módulo 3: Formateador

El Formateador garantiza una representación única y canónica de los documentos RIGOR.

### 5.1 Objetivos
- **Normalización**: Reordena claves, estandariza la sangría y elimina la ambigüedad de los espacios en blanco.
- **Determinismo**: Asegura que cualquier especificación válida tenga exactamente una representación textual válida.
- **Puente IA-Humano**: Permite que el código generado por IA (potencialmente desordenado) se normalice instantáneamente para la revisión humana.

### 5.2 Comandos
```bash
rigor format <archivo|directorio> [opciones]
```

**Opciones:**
- `--check`: Retorna el código de salida 1 si el archivo no tiene el formato canónico.
- `--write`: Sobrescribe el archivo con el formato canónico.

---

## 6. Flujo de Integración con IA

El CLI es el guardián formal en el ciclo de vida del desarrollo asistido por IA:

1. **Generación por IA**: Un agente de IA produce un archivo `.rigor`.
2. **Revisión Humana**: Un arquitecto humano revisa las reglas de negocio y restricciones.
3. **Validación**: `rigor validate` asegura que el documento sea técnicamente sólido.
4. **Formateo**: `rigor format --write` normaliza la representación.
5. **Generación**: `rigor generate` produce los artefactos de implementación.

---

## 7. Modo Legible por Máquina (`--json`)

Para la integración con IDEs, CI/CD y agentes de IA, el CLI debe emitir errores estructurados:

```json
{
  "file": "user.rigor",
  "line": 12,
  "column": 5,
  "code": "E_TYPE_MISMATCH",
  "message": "Expected integer but got string",
  "severity": "ERROR"
}
```

---

## 8. Configuración y Versionado

### 8.1 Configuración (`rigor.config.json`)
Permite definir valores predeterminados para el proyecto:
- Objetivos de generación predeterminados.
- Niveles de estrictez.
- Rutas de salida.

### 8.2 Versionado
El CLI debe informar la versión del protocolo que soporta.
```bash
rigor version
```

---

## 9. Extensibilidad Futura (Fase 2)
Las iteraciones futuras pueden incluir soporte para complementos (plugins), generadores y hooks personalizados. Estos no forman parte de la especificación normativa v0.1.
```

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:docs`.
- [ ] Check both English and Spanish "CLI Specification" pages.
- [ ] Ensure all 3 modules (Validator, Generator, Formatter) are present.
- [ ] Verify the table of exit codes and the AI integration flow.
- [ ] Confirm that "Machine-Readable" mode is explicitly defined.
