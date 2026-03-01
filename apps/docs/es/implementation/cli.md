# RIGOR

# Implementación

## CLI y Modelo de Ejecución (Normativo – v0.1)

Estado: Normativo
Alcance: Define el comportamiento de la interfaz de línea de comandos, el pipeline de ejecución, las reglas de orquestación, los códigos de salida y las garantías de determinismo de la herramienta RIGOR.

Este documento formaliza cómo se invocan y componen todos los motores en una implementación conforme.

---

# 1. Propósito

El CLI y Modelo de Ejecución define:

* Estructura de comandos
* Orden del pipeline de ejecución
* Orquestación de motores
* Formatos de salida
* Códigos de salida
* Garantías de determinismo
* Modelo de manejo de errores

Es la capa de integración entre todos los motores normativos.

---

# 2. Descripción General del Pipeline de Ejecución

El pipeline de ejecución canónico DEBE ser:

1. Parser y Loader
2. Constructor de Grafo Canónico
3. Motor de Canonicalización
4. Motor de Validación
5. Motor de Diff (si se proporciona una versión anterior)
6. Motor de Versionado (si se ejecuta el diff)
7. Motor de Migración (si se solicita la migración)
8. Motor de Resolución de Eventos
9. Renderizado de Salida

Cada paso DEBE ejecutarse en el orden definido.

---

# 3. Modelo de Comandos del CLI

El CLI DEBE exponer comandos deterministas.

Comandos mínimos requeridos:

* `rigor validate`
* `rigor diff`
* `rigor version`
* `rigor migrate`
* `rigor resolve-events`

Pueden existir comandos opcionales pero NO DEBEN alterar el comportamiento central.

---

# 4. Definiciones de Comandos

## 4.1 Validar (Validate)

```
rigor validate <archivo-especificacion> [--strict] [--json]
```

Ejecución:

* Parsear
* Construir grafo
* Canonicalizar
* Validar
* Resolver eventos

Códigos de salida:

* 0 → válido
* 1 → errores de validación
* > 1 → fallo interno

---

## 4.2 Diff

```
rigor diff <especificacion-anterior> <especificacion-actual> [--json]
```

Ejecución:

* Parsear ambos
* Construir ambos grafos
* Canonicalizar ambos
* Calcular ChangeSet
* Salida del ChangeSet

Códigos de salida:

* 0 → sin cambios
* 2 → cambios detectados
* > 2 → fallo interno

---

## 4.3 Versión (Version)

```
rigor version <especificacion-anterior> <especificacion-actual> [--json]
```

Ejecución:

* Parsear ambos
* Canonicalizar
* Diff
* Evaluar versión

Códigos de salida:

* 0 → versión válida
* 3 → violación de versión
* > 3 → fallo interno

---

## 4.4 Migrar (Migrate)

```
rigor migrate <especificacion-anterior> <especificacion-actual> <archivo-migracion> [--json]
```

Ejecución:

* Parsear ambos
* Canonicalizar
* Diff
* Evaluación de versión
* Aplicar migración
* Validar grafo migrado
* Resolver eventos

Códigos de salida:

* 0 → éxito
* 4 → fallo de migración
* > 4 → fallo interno

---

## 4.5 Resolver Eventos (Resolve Events)

```
rigor resolve-events <archivo-especificacion> [--json]
```

Ejecución:

* Parsear
* Canonicalizar
* Resolver eventos

Códigos de salida:

* 0 → válido
* 5 → errores de resolución
* > 5 → fallo interno

---

# 5. Requisitos de Determinismo

El CLI DEBE garantizar:

* Ordenamiento estable de las salidas
* Estructura JSON estable
* Sin inyección de marcas de tiempo (a menos que se solicite explícitamente)
* Sin registros (logging) no deterministas

Entradas idénticas DEBEN producir salidas idénticas.

---

# 6. Formatos de Salida

El CLI DEBE soportar:

* Texto legible por humanos (por defecto)
* JSON (flag `--json`)

La salida JSON DEBE:

* Serializar exactamente los contratos de salida del motor
* Preservar el orden definido en los documentos normativos
* Usar un orden de claves estable

No se permiten claves adicionales.

---

# 7. Modelo de Manejo de Errores

Los errores se categorizan como:

* Errores de validación
* Violaciones de versión
* Fallos de migración
* Fallos internos del motor

Los fallos internos DEBEN:

* Producir una salida no nula > 10
* Emitir un objeto de error estructurado (si está en modo JSON)

---

# 8. Modelo de Registro (Logging)

El registro DEBE ser opcional.

Las flags PUEDEN incluir:

* `--verbose`
* `--debug`

Los registros NO DEBEN alterar el comportamiento ni la estructura de salida.

---

# 9. Modelo de Configuración

El CLI PUEDE aceptar un archivo de configuración:

```
RigorConfig {
    validationMode: "strict" | "non-strict"
    versionPolicy: object
    outputFormat: "text" | "json"
}
```

Las flags del CLI DEBEN sobrescribir el archivo de configuración.

---

# 10. Streaming y Archivos Grandes

La implementación PUEDE soportar el parseo por streaming.

Sin embargo:

* El Grafo Canónico DEBE estar completamente construido antes del diff/validación.
* No se permite la validación parcial en modo normativo.

---

# 11. Aislamiento de Ejecución

Cada invocación del CLI DEBE:

* Ser sin estado (stateless)
* No cachear ejecuciones previas (a menos que sea un caché determinista)
* No modificar los archivos de entrada

Los archivos temporales DEBEN eliminarse de forma determinista.

---

# 12. Ejecución en Paralelo

La paralelización PUEDE usarse internamente si:

* No altera el orden de salida
* Preserva el determinismo

La paralelización de la ejecución de reglas DEBE preservar la agregación ordenada.

---

# 13. Garantías de Estabilidad

Los cambios de ruptura en:

* Flags del CLI
* Códigos de salida
* Esquema JSON

DEBEN requerir un incremento de la versión mayor de RIGOR.

---

# 14. No-Objetivos

El CLI NO:

* Proporciona un entorno de ejecución de runtime
* Se integra con sistemas externos
* Proporciona una interfaz de usuario interactiva
* Corrige errores automáticamente

Es una interfaz de orquestación determinista.

---

# 15. Criterios de Conformidad

Una implementación es conforme si:

* Ejecuta los motores en el orden definido
* Aplica los códigos de salida con precisión
* Garantiza una salida determinista
* Respeta los contratos de esquema JSON
* Aísla la ejecución por invocación

---

# 16. Resumen del Modelo de Ejecución

El CLI y Modelo de Ejecución:

* Orquesta todos los motores
* Define el flujo de ejecución determinista
* Garantiza una salida estable
* Impone una disciplina estricta de códigos de salida
* Asegura la composibilidad de la cadena de herramientas

---

En esta etapa, la arquitectura de implementación completa de RIGOR incluye:

1. Parser y Loader
2. Constructor de Grafo Canónico
3. Motor de Canonicalización
4. Motor de Validación
5. Motor de Diff
6. Motor de Versionado
7. Motor de Migración
8. Motor de Resolución de Eventos
9. CLI y Modelo de Ejecución

La capa de implementación está ahora estructuralmente completa bajo la definición normativa.
