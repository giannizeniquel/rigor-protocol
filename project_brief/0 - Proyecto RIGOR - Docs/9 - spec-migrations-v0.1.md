# MIGRATIONS.md — Especicación Formal de

# Migraciones v0.

# 1. Propósito

Este documento dene el modelo formal de migración de instancias persistidas cuando una Spec
evoluciona con un cambio MAJOR.

Se aplica únicamente a Processes con persistence: true.

Objetivos:

```
Garantizar integridad de datos
Permitir evolución estructural
Evitar corrupción de estado
Habilitar upgrades controlados
```
# 2. Cuándo se Requiere Migración

Una migración es obligatoria cuando:

```
Cambia tipo de campo en context
Se elimina un estado existente
Se renombra estado
Se elimina campo requerido
Cambia initial_state
```
No se requiere migración en cambios MINOR compatibles.

# 3. Estrategias de Migración

Se permiten dos estrategias:


## 3.1 Migración Oine

```
Detener el Motor
Transformar todas las instancias
Reiniciar con nueva Spec
```
Ventaja: simplicidad.
Desventaja: downtime.^

## 3.2 Migración On-Read (Lazy)

```
Mantener múltiples versiones activas
Migrar instancia al cargarse
Persistir nueva versión inmediatamente
```
Requiere:

```
Transformador determinístico
Validación posterior
```
# 4. Transformador de Migración

Debe denirse función:

migrate(v_old) -> v_new

Propiedades obligatorias:

```
Determinística
Sin efectos externos
Idempotente
```
Debe poder ejecutarse múltiples veces sin alterar resultado.

# 5. Migración de Estados

Si un estado es eliminado:

Debe denirse:


```
Estado destino equivalente
```
No se permite dejar instancia en estado inexistente.

# 6. Migración de Contexto

Reglas:

```
Nuevos campos obligatorios deben tener valor por defecto explícito.
Campos eliminados deben descartarse.
Conversión de tipo debe ser explícita.
```
Ejemplo:

integer -> string
Debe denirse transformación.^

# 7. Control de Versiones en Instancia

Cada instancia debe almacenar:

```
spec_version
migrated_at (nullable)
```
El Motor debe comparar:

instancia.spec_version vs spec.spec_version

Si diere:

```
Ejecutar migración antes de procesar evento.
```
# 8. Validación Post-Migración

Después de migrar:

```
. Ejecutar VALIDATION semántica sobre instancia.
. Vericar que estado existe.
. Vericar coherencia de tipos.
```

Si falla:

```
Instancia debe marcarse como corrupta.
No debe continuar ejecución.
```
# 9. Prohibiciones

No se permite:

```
Migración parcial.
Instancias con spec_version desconocida.
Migraciones implícitas sin transformador.
```
# 10. Garantía Formal

El modelo de Migraciones v0.1 garantiza:

```
Evolución segura de Processes persistidos
Integridad estructural
Compatibilidad controlada
No corrupción silenciosa
```
Este documento completa el ciclo de evolución estructural denido en VERSIONING.md.


