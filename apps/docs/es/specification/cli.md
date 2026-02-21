# Especificación CLI (v0.1)

## 1. Propósito

La Interfaz de Línea de Comandos (CLI) de RIGOR es la interfaz normativa primaria para interactuar con los componentes centrales del protocolo. Sirve como la superficie operativa estable para:
- **Validación de Especificaciones**: Asegurar corrección estructural y semántica.
- **Generación de Código**: Traducir especificaciones a implementaciones objetivo.
- **Gobernanza de Evolución**: Comparar versiones y detectar cambios rompedores.
- **Ejecución del Motor**: Ejecutar el entorno de tiempo de ejecución para especificaciones válidas.
- **Gestión de Migraciones**: Manejar actualizaciones estructurales para instancias persistidas.

## 2. Principios de Diseño

El CLI de RIGOR está construido para **automatización determinística**. Debe adherirse a los siguientes principios:
- **Determinístico**: Entradas idénticas deben producir salidas y códigos de salida idénticos.
- **Scriptable**: Totalmente compatible con pipelines CI/CD y scripting de shell.
- **No Interactivo**: Sin avisos obligatorios al usuario; todas las operaciones deben soportar flags para ejecución automatizada.
- **Códigos de Salida Estables**: Los códigos de salida son parte del contrato formal y no cambian entre versiones menores.
- **Legible por Máquina**: Soporta salida JSON para todos los comandos.

## 3. Comando: `validate`

Valida un archivo de especificación sin ejecución.

### Uso
```bash
rigor validate <spec.yaml> [options]
```

### Acciones
1. Ejecuta el pipeline completo de cuatro fases definido en el [Motor de Validación](../implementation/validation-engine).
2. Reporta errores estructurados, advertencias y mensajes de información.

### Códigos de Salida
- `0`: Validación exitosa (valid: true).
- `1`: Validación fallida (uno o más ERRORES encontrados).

### Opciones
- `--format json`: Salida del [Reporte de Cumplimiento](../implementation/validation-engine#5-compliance-report-format) como un objeto JSON.

## 4. Comando: `generate`

Genera artefactos de implementación o adaptadores a partir de una especificación válida.

### Uso
```bash
rigor generate <spec.yaml> <target> [options]
```

### Objetivos Soportados (v0.1)
- `typescript`: Genera interfaces tipadas y esqueletos de máquina de estados.
- `openapi`: Genera una definición OpenAPI/Swagger para el proceso.
- `symfony`: Genera definiciones de proceso compatibles con PHP/Symfony.
- `node`: Genera lógica compatible con Node.js.

### Reglas
- **Precedencia de Validación**: Debe fallar inmediatamente si `validate` retorna errores.
- **Salida Determinística**: La misma especificación y versión de objetivo debe producir estructura de código idéntica.

## 5. Comando: `diff`

Compara dos versiones de una especificación para determinar compatibilidad estructural.

### Uso
```bash
rigor diff <old_spec.yaml> <new_spec.yaml> [options]
```

### Acciones
1. Detecta todas las diferencias estructurales entre las dos versiones.
2. Clasifica el nivel de cambio como `PATCH`, `MINOR` o `MAJOR` según las reglas de [Versionado](./versioning).
3. Identifica **cambios rompedores** específicos.

### Códigos de Salida
- `0`: Los cambios son compatibles (PATCH o MINOR).
- `1`: Cambios rompedores detectados (MAJOR) y `--fail-on-breaking` está establecido.

### Opciones
- `--format json`: Salida de un reporte de diff estructurado.
- `--fail-on-breaking`: Retorna código de salida 1 si se detecta un cambio MAJOR.

## 6. Comando: `run`

Inicializa y ejecuta el Motor de RIGOR para una especificación dada.

### Uso
```bash
rigor run <spec.yaml> [options]
```

### Acciones
1. Carga la especificación y verifica compatibilidad de `rigor_spec_version`.
2. Inicializa el [Motor de Validación](../implementation/validation-engine).
3. Inicia el proceso de tiempo de ejecución, exponiendo endpoints o listeners definidos.

### Opciones
- `--port <number>`: Establece el puerto de ejecución.
- `--persistence <driver>`: Define el adaptador de persistencia (ej., `postgresql`).
- `--config <path>`: Ruta a la configuración del motor.

## 7. Comando: `migrate`

Ejecuta migraciones estructurales para instancias persistidas entre versiones MAJOR.

### Uso
```bash
rigor migrate from <v_old> to <v_new> [options]
```

### Estrategias
- `offline`: Detiene el motor para migrar todas las instancias de una vez.
- `lazy`: Migra instancias individualmente al ser leídas por el motor.

### Códigos de Salida
- `0`: Migración exitosa.
- `3`: Migración fallida (corrupción estructural o error del transformador).

### Opciones
- `--strategy <offline|lazy>`: Selecciona la estrategia de migración.
- `--dry-run`: Simula la migración sin persistir cambios.
- `--spec <spec.yaml>`: Ruta a la nueva especificación.

## 8. Comando: `inspect`

Inspecciona una instancia de proceso persistida para propósitos de depuración o auditoría.

### Uso
```bash
rigor inspect <instance_id> [options]
```

### Datos Proveídos
- `spec_version`: La versión que la instancia adher actualmente.
- `process_name`: Identificador formal del proceso.
- `current_state`: Fase estable actual.
- `context`: Datos persistidos serializados completos.
- `version`: Contador de transiciones incremental.
- `updated_at`: Marca de tiempo de la última transición.

## 9. Códigos de Salida Globales

El CLI usa un conjunto estable de códigos de salida globales:

| Código | Significado | Descripción |
| :--- | :--- | :--- |
| `0` | Éxito | Operación completada exitosamente. |
| `1` | Error de Validación | La especificación viola reglas estructurales o semánticas. |
| `2` | Error de Ejecución | Fallo en tiempo de ejecución dentro del motor. |
| `3` | Error de Migración | Fallo durante actualización o transformación de instancia. |
| `4` | Error Interno | Fallo dentro de la herramienta CLI misma. |

## 10. Extensibilidad

El CLI de RIGOR está diseñado para ser extensible a través de:
- **Objetivos de Generación Personalizados**: Registrar nuevos generadores de implementación.
- **Adaptadores de Persistencia**: Añadir soporte para diferentes motores de base de datos.
- **Integración CI/CD**: Fácil embedding como binario en pipelines automatizados.

La extensión no debe romper la compatibilidad de comandos existentes o códigos de salida estables.
