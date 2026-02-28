# BUILDER INSTRUCTIONS: CLI Grammar v0.1 Specification Update (v1)

**Status:** Ready for Implementation  
**Context:** Integrate the formal EBNF grammar, contractual exit codes, and explicit syntactic rules into the CLI Specification.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/DOCS_CHANGES_CLI_GRAMMAR.md`

---

## 🎯 Objectives
1.  **Formalize Grammar**: Add the EBNF v0.1 section to `cli.md` (EN and ES).
2.  **Unify Exit Codes**: Align the exit code table with the v0.1 contractual definitions.
3.  **Define Syntactic Rules**: Codify the mandatory flag syntax and ordering.
4.  **Enforce Determinism**: Explicitly state the requirement for idempotent and predictable outputs.

---

## 🛠️ Step 1: Update `apps/docs/specification/cli.md`

Perform the following changes:

### 1. Rename and Update Section 3.3 (Exit Codes)
Update the table of exit codes in Section 3.3 to align with the frozen v0.1 contract. This will now be the global exit code table.

```markdown
### 3.3 Exit Codes (v0.1 Contractual)

The CLI uses a stable, frozen set of exit codes for automation and CI/CD integration.

| Code | Meaning | Description |
| :--- | :--- | :--- |
| `0` | Success | Operation completed successfully. |
| `1` | Validation Error | The specification violates structural or semantic rules. |
| `2` | CLI Misuse | Invalid command syntax, unknown flags, or missing arguments. |
| `3` | Internal Error | Unexpected failure within the RIGOR engine or CLI tool. |
```

### 2. Add Section 4: Formal Grammar (EBNF v0.1)
Insert this section after the "Module 3: Formatter" section (and renumber subsequent sections).

```markdown
---

## 6. Formal Grammar (CLI v0.1)

The CLI command structure is governed by the following EBNF grammar to ensure non-ambiguous parsing by both humans and machines.

```ebnf
cli             ::= "rigor" SP action

action          ::= validate
                  | format
                  | generate

validate        ::= "validate" SP path validate_opts?
format          ::= "format" SP path format_opts?
generate        ::= "generate" SP target SP path generate_opts?

validate_opts   ::= (SP validate_opt)*
format_opts     ::= (SP format_opt)*
generate_opts   ::= (SP generate_opt)*

validate_opt    ::= "--strict"
                  | format_option

format_opt      ::= "--write"
                  | "--check"

generate_opt    ::= output_option
                  | "--dry-run"

format_option   ::= "--format=" format_type
output_option   ::= "--output=" path

format_type     ::= "json"
                  | "text"

target          ::= "schema"
                  | "types"
                  | "json-schema"
                  | "openapi"

path            ::= STRING
SP              ::= " "
```

### 6.1 Syntactic Rules (Normative)
- **Mandatory Order**: `rigor` → action → arguments → flags.
- **Flag Format**: All flags must use the `--long-name` format. No short aliases (e.g., `-s`) are supported.
- **Value Assignment**: Flags with values must use the equals sign (e.g., `--format=json`). Spaces (e.g., `--format json`) are invalid.
- **Exclusivity**: Certain flags may be mutually exclusive (e.g., `--write` and `--check` for formatting).
- **Error Handling**: Unknown flags or missing arguments result in an immediate exit with code `2`.
```

*(Note: Renumber sections 6, 7, 8, 9 from original to 7, 8, 9, 10)*

### 3. Update Determinism Requirement in Section 1
Ensure Section 1.1 reflects the deterministic requirement.

```markdown
### Core Principles:
- **Deterministic**: Mismo input → mismo output. Exit codes are stable.
- **Idempotent**: Re-running operations on the same input produces no additional side effects.
- **No Implicit State**: The CLI does not rely on hidden configuration or global environment state unless explicitly declared.
```

---

## 🧱 Step 2: Update `apps/docs/es/specification/cli.md`

Apply the same structural updates and translations to the Spanish version.

### 1. Actualizar Códigos de Salida (Sección 3.3)
```markdown
### 3.3 Códigos de Salida (v0.1 Contractuales)

El CLI utiliza un conjunto estable y congelado de códigos de salida para la automatización e integración CI/CD.

| Código | Significado | Descripción |
| :--- | :--- | :--- |
| `0` | Éxito | La operación se completó exitosamente. |
| `1` | Error de Validación | La especificación viola reglas estructurales o semánticas. |
| `2` | Uso Incorrecto (CLI) | Sintaxis de comando inválida, flags desconocidas o argumentos faltantes. |
| `3` | Error Interno | Fallo inesperado dentro del motor de RIGOR o la herramienta CLI. |
```

### 2. Añadir Sección 6: Gramática Formal (EBNF v0.1)
```markdown
---

## 6. Gramática Formal (CLI v0.1)

La estructura de comandos del CLI se rige por la siguiente gramática EBNF para asegurar un análisis no ambiguo por parte de humanos y máquinas.

```ebnf
cli             ::= "rigor" SP action

action          ::= validate
                  | format
                  | generate

validate        ::= "validate" SP path validate_opts?
format          ::= "format" SP path format_opts?
generate        ::= "generate" SP target SP path generate_opts?

validate_opts   ::= (SP validate_opt)*
format_opts     ::= (SP format_opt)*
generate_opts   ::= (SP generate_opt)*

validate_opt    ::= "--strict"
                  | format_option

format_opt      ::= "--write"
                  | "--check"

generate_opt    ::= output_option
                  | "--dry-run"

format_option   ::= "--format=" format_type
output_option   ::= "--output=" path

format_type     ::= "json"
                  | "text"

target          ::= "schema"
                  | "types"
                  | "json-schema"
                  | "openapi"

path            ::= STRING
SP              ::= " "
```

### 6.1 Reglas Sintácticas (Normativas)
- **Orden Obligatorio**: `rigor` → acción → argumentos → flags.
- **Formato de Flags**: Todas las flags deben usar el formato `--nombre-largo`. No se admiten alias cortos (ej., `-s`).
- **Asignación de Valores**: Las flags con valores deben usar el signo igual (ej., `--format=json`). El uso de espacios (ej., `--format json`) es inválido.
- **Exclusividad**: Ciertas flags pueden ser mutuamente excluyentes (ej., `--write` y `--check`).
- **Manejo de Errores**: Flags desconocidas o argumentos faltantes resultan en una salida inmediata con código `2`.
```

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:docs`.
- [ ] Check both English and Spanish "CLI Specification" pages.
- [ ] Verify that EBNF block is rendered correctly.
- [ ] Ensure the exit code table matches the v0.1 contract (0, 1, 2, 3).
- [ ] Confirm no short flags or space-separated flag values are mentioned as valid.
