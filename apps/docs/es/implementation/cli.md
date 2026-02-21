# CLI de RIGOR (v0.1)

## 1. Propósito

El CLI de RIGOR es la interfaz primaria para interactuar con especificaciones, el motor de validación y el tiempo de ejecución. Está diseñado para ser determinístico, scriptable, y compatible con CI/CD. Cada operación puede ejecutarse sin avisos interactivos para asegurar automatización completa.

## 2. Comandos Core

### 2.1 `rigor validate`
Valida un archivo de especificación sin ejecutarlo.
- **Acción**: Ejecuta el pipeline completo F1–F4 definido en el [Motor de Validación](../implementation/validation-engine.md).
- **Códigos de Salida**: `0` para éxito, `1` para errores de validación.
- **Salida**: Lista estructurada de errores, advertencias e información. Soporta `--format json`.

### 2.2 `rigor generate`
Genera artefactos de implementación desde una especificación válida.
- **Uso**: `rigor generate <spec.yaml> <target>` (ej., `rigor generate spec.yaml symfony`).
- **Objetivos**: `symfony`, `node`, `typescript`, `openapi`.
- **Acción**: Valida la especificación, genera una Representación Intermedia (IR), y produce el código objetivo o adaptadores.

### 2.3 `rigor diff`
Compara dos versiones de una especificación para detectar cambios estructurales.
- **Acción**: Clasifica diferencias como `PATCH`, `MINOR` o `MAJOR` basándose en las reglas de [Versionado](../specification/versioning.md).
- **Opciones**: `--fail-on-breaking` (Código de salida `1` si se detecta un cambio MAJOR).

### 2.4 `rigor run`
Inicializa y inicia el Motor de RIGOR con una especificación específica.
- **Acción**: Carga la especificación, verifica compatibilidad de versión, e inicializa listeners/endpoints según configurado.
- **Opciones**: `--port`, `--persistence`, `--config`.

### 2.5 `rigor migrate`
Ejecuta migraciones para instancias persistidas entre versiones de especificaciones.
- **Uso**: `rigor migrate from <v1> to <v2> --strategy <offline|lazy>`.
- **Opciones**: `--dry-run` para simular la transformación sin persistir cambios.

### 2.6 `rigor inspect`
Proporciona una vista detallada de una instancia de proceso persistida.
- **Salida**: Muestra `spec_version`, `process_name`, `current_state`, `context`, `internal_version`, y `updated_at`.

## 3. Codigos de Salida Globales

El CLI usa códigos de salida estables para facilitar integración con scripts y pipelines externos:

| Código | Descripción |
| :--- | :--- |
| `0` | Éxito |
| `1` | Error de Validación |
| `2` | Error de Ejecución |
| `3` | Error de Migración |
| `4` | Error Interno del CLI |

## 4. Automatizacion y CI/CD

El CLI de RIGOR está optimizado para automatización:
- **Salida JSON**: Usa `--format json` para resultados legibles por máquina.
- **No Interactivo**: Todos los comandos aceptan argumentos o archivos de configuración para evitar avisos bloqueantes.
- **Interfaz Estable**: Nombres de comandos y flags están garantizados de ser estables a través de versiones MINOR y PATCH.
