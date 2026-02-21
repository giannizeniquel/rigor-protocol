# CLI.md — Especicación Formal de Rigor CLI

# v0.

# 1. Propósito

Este documento dene el contrato ocial de la herramienta de línea de comandos **Rigor**.
Rigor es la interfaz primaria para interactuar con:
La Spec
El Validador
El Motor
El sistema de migraciones
Los generadores de código
La CLI constituye la supercie pública estable del sistema.

# 2. Principios de Diseño

Rigor debe ser:
Determinístico
Totalmente scriptable
No interactivo por defecto
Con códigos de salida estables
Compatible con CI/CD
Formato general:
rigor [options]
Todas las operaciones deben poder ejecutarse sin prompts interactivos.

# 3. Comando: validate


Valida una Spec sin ejecutarla.
rigor validate spec.yaml
Acciones:
Ejecuta el pipeline completo denido en VALIDATION.md
Devuelve errores, warnings e info estructurados
Salida exitosa:
Exit code: 0
Salida con errores:
Exit code: 1
Opciones:
format json

# 4. Comando: generate

Genera artefactos a partir de una Spec válida.
rigor generate spec.yaml target
Ejemplo:
rigor generate spec.yaml target symfony
Acciones:
Ejecuta validate
Genera representación intermedia (IR)
Genera código o adaptadores para el target indicado
Reglas:
Debe fallar si validate falla
El target debe estar explícitamente declarado
Extensible a:
target symfony
target node


target typescript
target openapi

# 5. Comando: diff

Compara dos versiones de una Spec.
rigor diff v0.1.yaml v0.2.yaml
Acciones:
Detecta cambios estructurales
Clasica cambios como:
PATCH
MINOR
MAJOR
Identica breaking changes
Salida:
Resumen de diferencias
Clasicación de compatibilidad
Opciones:
format json
fail-on-breaking
Si se detecta breaking change y se usa fail-on-breaking:
Exit code: 1

# 6. Comando: run

Ejecuta el Rigor Engine con una Spec.
rigor run spec.yaml
Opciones:


port
persistence
cong
Debe:
Cargar la Spec
Vericar compatibilidad de versión
Inicializar el Engine
Exponer endpoints o listeners según conguración

# 7. Comando: migrate

Ejecuta migraciones entre versiones MAJOR.
rigor migrate from 1.0.0 to 2.0.
Opciones:
strategy oine|lazy
dry-run
spec spec.yaml
Debe:
Vericar existencia de transformador
Ejecutar migración según estrategia
Reportar instancias afectadas
Exit codes:
0: migración exitosa
3: error de migración

# 8. Comando: inspect

Inspecciona una instancia persistida.
rigor inspect
Debe mostrar:


spec_version
process_name
current_state
context
version
updated_at
Opciones:
format json

# 9. Formato de Salida

Por defecto:
Texto legible para humanos
Opcional:
format json
El formato JSON debe ser estable y versionado implícitamente con la versión de Rigor.

# 10. Códigos de Salida Globales

0: Éxito
1: Error de validación
2: Error de ejecución
3: Error de migración
4: Error interno
Estos códigos no deben cambiar en versiones MINOR o PATCH.

# 11. Extensibilidad

Rigor debe permitir:
Registro de nuevos targets de generación


Registro de nuevos adaptadores de persistencia
Integración como binario embebido en pipelines
La extensión no debe romper compatibilidad de comandos existentes.

# 12. Garantía Formal

Rigor CLI v0.1 garantiza:
Interfaz estable y automatizable
Integración determinística con la Spec
Detección explícita de breaking changes
Control completo del ciclo de vida
CLI.md dene el contrato operativo externo ocial de Rigor.


