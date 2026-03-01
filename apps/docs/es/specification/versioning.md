# Versionado (v0.1)

## 1. Introducción

El versionado es una restricción estructural formal en RIGOR, requerido para la evolución determinista y las migraciones seguras.

## 2. Identificadores de Versión (Normativo)

### 2.1 `rigor_spec_version`
- Representa la versión del lenguaje/núcleo de RIGOR.
- Formato: `"MAJOR.MINOR"` (ej., `"0.1"`).
- Los motores **DEBEN** rechazar especificaciones con una versión del lenguaje no soportada.

### 2.2 `spec_version`
- Representa la versión de una definición de proceso específica.
- Formato: `"MAJOR.MINOR.PATCH"` (ej., `"1.0.0"`).
- Sigue las reglas de Versionado Semántico.

## 3. Reglas Semánticas (Lógica de Incremento)

| Segmento | Regla de Incremento | Propósito |
| :--- | :--- | :--- |
| **MAJOR** | **DEBE** incrementar | Cambios rompedores (estados eliminados, tipos cambiados). |
| **MINOR** | **PUEDE** incrementar | Funciones compatibles hacia atrás (nuevos campos opcionales). |
| **PATCH** | **PUEDE** incrementar | Correcciones, clarificaciones o documentación. |

### 3.1 MAJOR (Cambios Rompedores)
- Eliminar o renombrar un estado o evento existente.
- Cambiar el tipo de un campo del contexto.
- Eliminar un campo obligatorio del contexto.
- Modificar la lógica de transición para un par estado/evento existente.
- Cambiar el `initial_state`.
- Convertir un campo opcional en obligatorio.

### 3.2 MINOR (Compatible hacia Atrás)
- Añadir un nuevo Evento o Estado.
- Añadir una nueva transición.
- Añadir un campo opcional al contexto o payload del evento.

### 3.3 PATCH (No Estructural)
- Actualizaciones de documentación.
- Mejorar la claridad de mensajes de error o log.
- Clarificaciones sin cambio de comportamiento.

## 4. Soporte de Rangos de Versión

Los motores **DEBEN** soportar operadores de rango para verificaciones de compatibilidad:

| Operador | Descripción |
| :--- | :--- |
| `=` | Coincidencia exacta |
| `>` | Mayor que |
| `>=` | Mayor o igual que |
| `<` | Menor que |
| `<=` | Menor o igual que |
| `^` | Compatible (ej., ^1.0.0 significa >=1.0.0 <2.0.0) |
| `~` | Tilde (ej., ~1.0.0 significa >=1.0.0 <1.1.0) |

**Comportamiento**: Una especificación es válida solo si los identificadores satisfacen el rango soportado por el motor.

## 5. Versionado en Validación

Integración con la Matriz de Validación:
1. El validador **DEBE** verificar ambos identificadores al inicio del proceso.
2. Las discrepancias o cadenas mal formadas activan un fallo inmediato.
3. La evolución del versionado **DEBE** ser registrada para auditoria.

## 6. Taxonomía de Errores

| Código | Condición | Severidad |
| :--- | :--- | :--- |
| `ER-VERSION-INCOMPATIBLE` | La versión de especificación no es soportada por el motor. | Error |
| `ER-UNSUPPORTED-RIGOR-SPEC` | `rigor_spec_version` está fuera de la capacidad del motor. | Error |
| `ER-INVALID-VERSION-STRING` | El identificador de versión no sigue el formato requerido. | Error |

## 7. Ejemplos

### Válido: Bloque de Versión Estándar

```yaml
rigor_spec_version: "0.1"
spec_version: "1.2.0"

process: OrderProcess
context:
  order_id: uuid
states:
  created:
    terminal: true
```

### Inválido: Cambio Rompedor Sin Incremento MAJOR

```yaml
# INVÁLIDO: Se eliminó el estado 'pending' pero no se incrementó MAJOR
rigor_spec_version: "0.1"
spec_version: "1.0.0"  # Debería ser "2.0.0"

process: OrderProcess
# El estado 'pending' fue eliminado
states:
  completed:
    terminal: true
```

### Inválido: Motor Rechaza Versión Futura del Lenguaje

```yaml
# INVÁLIDO: El motor soporta "0.1" pero la especificación usa "2.0"
rigor_spec_version: "2.0"  # ER-UNSUPPORTED-RIGOR-SPEC
spec_version: "1.0.0"
```
