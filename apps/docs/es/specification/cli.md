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
