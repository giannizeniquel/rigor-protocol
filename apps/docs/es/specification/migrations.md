# Migraciones (v0.1)

## 1. Propósito

La especificación de Migraciones de RIGOR define el modelo formal para migrar instancias de proceso persistidas cuando una especificación sufre un cambio de versión `MAJOR`. Esto aplica estrictamente a procesos con `persistence: true`. El objetivo es asegurar la integridad de los datos y prevenir corrupción del estado estructural durante la evolución.

## 2. Disparar una Migración

Una migración es obligatoria siempre que ocurra un cambio `MAJOR`, específicamente cuando:
- Un tipo de campo del contexto cambia.
- Un estado existente es removido o renombrado.
- Un campo requerido es removido del contexto.
- El `initial_state` es cambiado.

Las migraciones **no son requeridas** para cambios `MINOR` o `PATCH`.

## 3. Estrategias de Migracion

RIGOR soporta dos estrategias principales de migración:

### 3.1 Migración Offline
- **Proceso**: Detener el motor, transformar todas las instancias persistidas a la nueva especificación, y reiniciar.
- **Trade-off**: Más simple de implementar pero requiere tiempo de inactividad.

### 3.2 Migración On-Read (Perezosa)
- **Proceso**: Múltiples versiones de especificación permanecen activas. Una instancia es migrada automáticamente cuando es cargada por el motor.
- **Requisito**: Un transformador determinístico y persistencia inmediata de la versión migrada.

## 4. Transformador de Migración

Una migración debe ser definida como una función formal: `migrate(v_old) -> v_new`.

### 4.1 Propiedades Obligatorias
- **Determinístico**: Dada la misma entrada, debe producir la misma salida.
- **Puro**: Sin efectos secundarios externos (ej., llamadas a API) durante la transformación.
- **Idempotente**: Puede ser ejecutado múltiples veces de forma segura sin alterar el resultado.

## 5. Reglas de Transformacion Estructural

### 5.1 Migración de Estado
Si un estado es removido, un estado destino equivalente debe ser definido. Una instancia no puede ser dejada en un estado no existente después de la migración.

### 5.2 Migración de Contexto
- **Nuevos Campos Obligatorios**: Deben tener un valor por defecto explícito.
- **Campos Removidos**: Deben ser descartados.
- **Conversión de Tipo**: Debe ser manejada explícitamente (ej., convertir un `integer` a un `string`).

## 6. Control de Version de Instancia

Cada instancia persistida debe almacenar:
- `spec_version`: La versión de la especificación a la que adher actualmente.
- `migrated_at`: (Nullable) La marca de tiempo de la última migración.

El motor debe comparar la `spec_version` de la instancia con la versión de la especificación actual antes de procesar cualquier evento. Si difieren, la migración debe ser ejecutada primero.

## 7. Validacion Post-Migracion

Inmediatamente después de una migración, el motor debe:
1. Ejecutar **Validación Semántica** en la instancia migrada.
2. Verificar que el `current_state` existe en la nueva especificación.
3. Confirmar que todos los tipos de contexto son coherentes.

Si la validación falla, la instancia debe ser marcada como **corrupta** y la ejecución debe ser detenida para prevenir mayor inconsistencia.
