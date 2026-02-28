A continuación tienes el **documento formal para el Arquitecto**, listo para validación y posterior envío al Builder.

Este documento asume:

* RIGOR CLI = Validator + Generator + Formatter
* CLI es parte de la **Specification**
* Grammar v0.1 queda congelada como contrato público

---

# ARCHITECT REVIEW DOCUMENT

## RIGOR CLI Grammar v0.1 — Formal Specification Integration

---

## 1. Context

La CLI de RIGOR deja de ser una herramienta informal y pasa a formar parte del contrato del protocolo.

Debe definirse:

* Gramática formal
* Semántica observable
* Exit codes
* Reglas sintácticas
* Restricciones estructurales

La CLI no es una implementación:
es la interfaz formal del protocolo.

---

# 2. Ubicación en Documentación

Archivo afectado:

```
/specification/cli.html
```

Se debe:

* Mantener la página CLI
* Agregar una sección nueva:

```
4. Formal Grammar (CLI v0.1)
```

---

# 3. Estructura Final Esperada de la Página CLI

## 1. CLI Overview

Propósito y alcance.

## 2. Command Model

Lista de comandos.

## 3. Command Semantics

Semántica observable.

## 4. Formal Grammar (CLI v0.1)  ← NUEVO

Incluye:

* EBNF
* Reglas sintácticas
* Exit codes
* Restricciones

---

# 4. Command Set (Frozen for v0.1)

## 4.1 validate

```bash
rigor validate <path> [--strict] [--format=json|text]
```

### Semántica

* Valida estructura y semántica.
* `<path>` puede ser archivo o directorio.
* `--strict` activa validaciones avanzadas.
* `--format` define salida estructurada.

---

## 4.2 format

```bash
rigor format <path> [--write] [--check]
```

### Semántica

* Sin flags → stdout.
* `--write` → sobrescribe archivos.
* `--check` → valida formato sin modificar.

### Restricción

`--write` y `--check` son mutuamente excluyentes.

---

## 4.3 generate

```bash
rigor generate <target> <path> [--output=<dir>] [--dry-run]
```

### Targets permitidos v0.1

* schema
* types
* json-schema
* openapi

---

# 5. Formal Grammar (EBNF v0.1)

Debe incorporarse textualmente:

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

---

# 6. Syntactic Rules (Normative)

1. Orden obligatorio:

   * `rigor` → comando → argumentos → flags
2. Flags siempre después de argumentos posicionales.
3. Flags deben comenzar con `--`.
4. Flags con valor deben usar `=`.
5. No se permiten flags abreviadas (`-s`, `-f`).
6. Flags desconocidas → error inmediato.
7. Argumentos faltantes → error.

---

# 7. Exit Codes (Contractual)

| Code | Meaning                                 |
| ---- | --------------------------------------- |
| 0    | Success                                 |
| 1    | Validation error                        |
| 2    | CLI misuse (syntax error, unknown flag) |
| 3    | Internal engine error                   |

Estos códigos quedan congelados en v0.1.

---

# 8. Determinism Requirement

La CLI debe cumplir:

* Mismo input → mismo output.
* No dependencias implícitas.
* No side effects sin flag explícita.
* Salida estructurada cuando se solicita `--format=json`.

---

# 9. Explicit Exclusions (v0.1)

No incluir:

* Alias de comandos
* Config file
* Plugins
* Short flags
* Interactive mode
* Watch mode
* Parallel flags

Esto preserva minimalismo y control.

---

# 10. Architect Validation Checklist

El arquitecto debe validar:

* [ ] La CLI es parte de Specification.
* [ ] Grammar está formalizada en EBNF.
* [ ] No hay ambigüedad sintáctica.
* [ ] Exit codes están definidos.
* [ ] No hay contradicción con protocol-model.
* [ ] Se respeta principio de determinismo.
* [ ] No introduce semántica no declarada en CORE.

---

# 11. Post-Approval Tasks (Builder)

Una vez aprobado:

1. Insertar sección Formal Grammar.
2. Insertar tabla de Exit Codes.
3. Agregar anchors:

   * `#formal-grammar`
   * `#exit-codes`
4. Versionar como:

```
RIGOR CLI Specification v0.1
```

---

# 12. Impacto Arquitectónico

Este cambio:

* Formaliza la CLI como contrato estable.
* Permite implementaciones alternativas.
* Permite testing automatizado.
* Permite validación externa.
* Refuerza posicionamiento como estándar.

---

# Estado Propuesto

CLI Grammar v0.1 → Ready for Architect Review

---