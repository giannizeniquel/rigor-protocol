# VALIDATION.md — Especicación Formal de

# Validación v0.

# 1. Propósito

Este documento dene el pipeline formal de validación de la Spec antes de su ejecución por el Motor.
El objetivo es garantizar que toda Spec sea:
Sintácticamente válida
Estructuralmente consistente
Semánticamente coherente
Ejecutable sin ambigüedades

# 2. Fases de Validación

La validación debe ejecutarse en el siguiente orden:
F1: Validación de Schema (JSON Schema)
F2: Validación estructural cruzada
F3: Validación semántica
F4: Validación de ejecutabilidad
Si una fase falla, el proceso se detiene.

# 3. F1 — Validación de Schema

Se valida contra:
CORE schema
EVENTS schema
REFERENCE schema


Errores típicos:
Claves obligatorias faltantes
Tipos inválidos
Regex inválido
Salida: lista de errores estructurales.

# 4. F2 — Validación Estructural Cruzada

Vericaciones obligatorias:
V2.1: Todo Event referenciado en Process debe existir.
V2.2: Todo estado referenciado en transition_to debe existir.
V2.3: initial_state debe existir.
V2.4: No puede existir estado inalcanzable.
V2.5: No puede existir Process sin states.

# 5. F3 — Validación Semántica

V3.1: Tipos en update_context deben coincidir.
V3.2: increment solo sobre integer.
V3.3: now solo asignable a datetime.
V3.4: No redenir campos inexistentes.
V3.5: Si persistence = false, no permitir increment.
V3.6: Estados terminales no deben tener transiciones.

# 6. F4 — Validación de Ejecutabilidad

V4.1: El grafo de estados debe ser nito.
V4.2: Debe existir al menos un estado terminal (warning si no).
V4.3: No debe existir ciclo sin salida terminal (warning).
V4.4: start_command debe estar denido si persistence = true.


# 7. Clasicación de Errores

Los errores deben clasicarse como:
ERROR — invalida ejecución.
WARNING — ejecución posible pero potencialmente riesgosa.
INFO — recomendación.

# 8. Reporte de Validación

Formato recomendado:
{
"valid": boolean,
"errors": [],
"warnings": [],
"info": []
}
Cada entrada debe incluir:
code
message
location (ruta YAML)

# 9. Códigos de Error Estables

Ejemplos:
VAL-001: Event no denido
VAL-002: Estado inexistente
VAL-003: Tipo incompatible
VAL-004: Transición inválida
VAL-005: Estado inalcanzable
VAL-006: Uso inválido de increment
VAL-007: Uso inválido de now
Los códigos no deben cambiar entre versiones menores.


# 10. Garantía del Validador

Una Spec que pasa VALIDATION v0.1 garantiza:
No errores estructurales
No ambigüedad en transición
Tipos coherentes
Ejecutabilidad determinística
Con VALIDATION.md el sistema alcanza cierre formal previo a runtime.


