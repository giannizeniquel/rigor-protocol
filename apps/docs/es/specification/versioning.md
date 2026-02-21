# Versionado (v0.1)

## 1. Propósito

RIGOR trata el versionado como un componente estructural formal en lugar de una convención informal. El objetivo es asegurar la evolución controlada de especificaciones, compatibilidad explícita, y migraciones seguras para instancias de proceso persistidas.

## 2. Niveles de Versionado

El ecosistema RIGOR opera a través de tres niveles distintos de versionado:

### 2.1 `rigor_spec_version`
Define la versión del lenguaje RIGOR y su contrato estructural formal.
- **Obligatorio**: Debe ser declarado en la raíz de cada especificación (ej., `rigor_spec_version: 0.1.0`).
- **Disparador**: Los cambios al JSON Schema o semántica formal disparan un incremento de versión. Los cambios estructurales al lenguaje requieren un incremento **MAJOR**.
- **Aplicación**: El motor **debe** rechazar especificaciones con un `rigor_spec_version` no soportado. El rechazo debe ser explícito y determinístico.

### 2.2 `spec_version`
Identifica la versión de una implementación de proceso específica (estados, eventos, transiciones y contexto).
- **Uso**: Usado como el disparador principal para migraciones, comparaciones de diff, y seguimiento de rehidratación de instancias persistidas.
- **Declaración**: Debe ser declarado en la raíz (ej., `spec_version: 1.0.0`).
- **Inmutabilidad**: Una vez que una `spec_version` es usada en producción, es inmutable. Cualquier modificación requiere un incremento de versión.

### 2.3 `engine_version`
Identifica la versión del tiempo de ejecución de RIGOR. El motor debe declarar su rango soportado tanto para la versión del lenguaje como de implementación (ej., `supported_rigor_spec_range: "^0.1.0"`).

## 3. Reglas de Versionado Semantico (SemVer)

RIGOR hace cumplir estrictamente las reglas `MAJOR.MINOR.PATCH` para cambios estructurales:

### 3.1 MAJOR (Cambios Rompedores)
Requerido cuando los cambios son incompatibles hacia atrás. Los cambios rompedores requieren una [Ruta de Migración](./migrations) formal. Ejemplos:
- Remover o renombrar un estado o evento existente.
- Cambiar el tipo de un campo del contexto.
- Remover un campo obligatorio del contexto.
- Modificar la lógica de transición para un par estado/evento existente.
- Cambiar el `initial_state`.
- Convertir un campo opcional en obligatorio.

### 3.2 MINOR (Adiciones Compatibles)
Requerido para adiciones estructurales compatibles hacia atrás. Estas no deben romper instancias persistidas existentes. Ejemplos:
- Añadir un nuevo Evento o Estado (provisto que no sea el nuevo estado inicial).
- Añadir una nueva transición.
- Añadir un campo opcional al contexto o payload del evento.

### 3.3 PATCH (Ajustes No Estructurales)
Requerido para ajustes no rompedores que no alteran el contrato estructural. Ejemplos:
- Actualizaciones de documentación.
- Optimizaciones internas del motor.
- Mejorar la claridad de mensajes de error o log.

## 4. Verificacion de Compatibilidad e Integracion CLI

El CLI de RIGOR proporciona herramientas para hacer cumplir estas reglas durante el ciclo de vida del desarrollo.

### 4.1 El Comando `diff`
El comando `rigor diff <old.yaml> <new.yaml>` se usa para:
- Comparar nodos de `spec_version`.
- Detectar automáticamente cambios rompedores basados en análisis estructural.
- Sugerir el incremento de versión requerido (PATCH, MINOR o MAJOR).

El fallo al incrementar la versión correctamente cuando se detecta un cambio rompedor debe activar un fallo de CI/CD.

## 5. Politica de Soporte y Deprecacion

Para mantener la estabilidad del ecosistema, se encourage a los implementadores de RIGOR a:
- **Soporte Activo**: Soportar al menos las últimas dos versiones **MAJOR** activas en producción.
- **Ventana de Deprecación**: Definir una ventana de deprecación explícita antes de remover soporte para un `rigor_spec_version` más antiguo.
- **Trazabilidad**: Mantener un historial completo e inmutable de todas las versiones de especificación publicadas.

## 6. Garantias Formales

El modelo de Versionado de RIGOR v0.1 garantiza:
- **Evolución Explícita**: Sin cambios estructurales silenciosos.
- **Compatibilidad Medible**: Verificación matemática de compatibilidad hacia atrás.
- **Integridad**: Las instancias persistidas siempre pueden ser mapeadas a su contrato estructural específico.
- **Separación**: Distinción clara entre la versión del lenguaje, la implementación, y el tiempo de ejecución.
