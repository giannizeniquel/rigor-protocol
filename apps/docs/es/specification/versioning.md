# Especificación de Versionado (v0.1)

## 1. Propósito y Alcance

Este documento define el modelo formal de versionado para RIGOR Core v0.1. Establece las reglas para los identificadores de versión, incrementos semánticos, garantías de compatibilidad y comportamiento de validación.

El versionado es una restricción estructural formal en RIGOR, necesaria para la evolución determinista y las migraciones seguras de las instancias de proceso persistentes.

## 2. Identificadores de Versión

RIGOR utiliza dos identificadores de versión independientes que **DEBEN** aparecer en el nivel raíz de cada especificación:

| Campo | Alcance | Propósito | Formato |
| :--- | :--- | :--- | :--- |
| `rigor_spec_version` | Lenguaje/Core | Versión de la especificación del lenguaje RIGOR. | `"MAJOR.MINOR"` |
| `spec_version` | Proceso | Versión de la definición del proceso específico. | `"MAJOR.MINOR.PATCH"` |

### 2.1 `rigor_spec_version`
Representa la versión del lenguaje RIGOR utilizada para interpretar el documento. Los motores **DEBEN** rechazar versiones MAJOR no soportadas.

### 2.2 `spec_version`
Representa la versión de la implementación del proceso específico (estados, eventos, transiciones y contexto). Es obligatorio para todas las especificaciones de proceso.

## 3. Reglas de Versionado Semántico

RIGOR impone una interpretación estricta del Versionado Semántico para los cambios estructurales.

### 3.1 MAJOR (Cambios de Ruptura)
**DEBE** incrementarse cuando un cambio invalida la compatibilidad hacia atrás.
**Disparadores:**
- Eliminar o renombrar un estado o evento existente.
- Cambiar el tipo de un campo del contexto.
- Eliminar un campo obligatorio del contexto.
- Modificar la lógica de transición para un par estado/evento existente.
- Cambiar el `initial_state`.
- Convertir un campo opcional en obligatorio.

### 3.2 MINOR (Compatible hacia Atrás)
**PUEDE** incrementarse para adiciones estructurales compatibles hacia atrás.
**Disparadores:**
- Añadir un nuevo Evento o Estado (siempre que no sea el nuevo estado inicial).
- Añadir una nueva transición.
- Añadir un campo opcional al contexto o al payload del evento.

### 3.3 PATCH (No Estructural)
**PUEDE** incrementarse para ajustes sin impacto en el comportamiento.
**Disparadores:**
- Actualizaciones de documentación.
- Mejora de la claridad de los mensajes de error o registros.
- Corrección de errores tipográficos en campos no normativos.

## 4. Reglas de Compatibilidad

### 4.1 Compatibilidad del Motor
El Motor **DEBE** rechazar versiones MAJOR de `rigor_spec_version` no soportadas y **DEBERÍA** aceptar versiones MINOR iguales o inferiores dentro de la misma MAJOR.

### 4.2 Compatibilidad de Procesos
Un incremento MAJOR en `spec_version` indica un cambio de ruptura que requiere una ruta de migración. Los incrementos PATCH y MINOR se consideran totalmente compatibles.

## 5. Soporte de Rangos de Versión (Opcional)

Los motores **DEBERÍAN** soportar operadores de rango para las comprobaciones de compatibilidad. El soporte de rangos es opcional en Core v0.1 pero recomendado para el futuro.

| Operador | Descripción |
| :--- | :--- |
| `=` | Coincidencia exacta |
| `>` | Mayor que |
| `>=` | Mayor o igual que |
| `<` | Menor que |
| `<=` | Menor o igual que |
| `^` | Compatible (ej., ^1.0.0 significa >=1.0.0 <2.0.0) |
| `~` | Tilde (ej., ~1.0.0 significa >=1.0.0 <1.1.0) |

## 6. Comportamiento de Validación y Determinismo

La validación de versión **DEBE** ocurrir antes de la validación estructural. La evaluación **DEBE** ser determinista.

**Orden de Validación:**
1. Validar el formato de la cadena de versión.
2. Validar la compatibilidad del Motor (rigor_spec_version).
3. Validar la compatibilidad semántica (spec_version).
4. Proceder con la validación estructural.

Si la validación de versión falla, el motor **DEBE** abortar el proceso inmediatamente.

## 7. Taxonomía de Errores

| Código | Condición | Severidad |
| :--- | :--- | :--- |
| `ER-INVALID-VERSION-STRING` | El formato del identificador de versión es inválido. | Error |
| `ER-UNSUPPORTED-RIGOR-SPEC` | La `rigor_spec_version` está fuera de la capacidad del motor. | Error |
| `ER-VERSION-INCOMPATIBLE` | La versión de la spec viola las reglas de compatibilidad. | Error |
| `ER-VERSION-RANGE-UNSATISFIED` | La versión no está dentro del rango opcional declarado. | Error |

## 8. Interacción con el CLI

El CLI **DEBE** validar las versiones antes de ejecutar cualquier comando (validate, format, generate). En modo `--strict`, cualquier aviso o discrepancia relacionada con la versión se trata como un error fatal.

## 9. Ejemplos

### Ejemplo Válido
```yaml
rigor_spec_version: "0.1"
spec_version: "1.2.0"
```

### Inválido: Cambio de Ruptura sin Incremento MAJOR
```yaml
# INVÁLIDO: Se eliminó un estado pero se mantuvo la versión 1.x
rigor_spec_version: "0.1"
spec_version: "1.3.0" # Debería ser 2.0.0
```

### Inválido: Versión del Core no Soportada
```yaml
# INVÁLIDO: El motor solo soporta 0.x
rigor_spec_version: "1.0"
```

## 10. Referencias Cruzadas
* Ver [REFERENCIA-SPEC](./spec-reference)
* Ver [Matriz de Validación](./validation-matrix)
* Ver [Modelo de Protocolo](./protocol-model)
