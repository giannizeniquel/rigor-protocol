# Motor de Validación (v0.1)

## 1. Propósito

El Motor de Validación de RIGOR define el **pipeline formal** para la verificación de especificaciones antes de la ejecución del motor. El objetivo es garantizar que cada Spec sea:
- Sintácticamente correcta
- Estructuralmente consistente
- Semánticamente coherente
- Determinísticamente ejecutable

## 2. Fases de Validacion (F1–F4)

El pipeline de validación debe ejecutar en el siguiente orden. Si cualquier fase falla, el proceso se detiene.

### F1: Validación de Schema (JSON/YAML Schema)
Valida la estructura base contra los esquemas **Core**, **Events** y **Reference**.
- **Claves Obligatorias**: Verifica `processes`, `context`, `initial_state`, `states`, etc.
- **Tipos de Datos**: Valida que los campos tengan tipos correctos (boolean, integer, string, etc.).
- **Regex de Nombrado**: Asegura adherencia a PascalCase y snake_case.

### F2: Validación Cruz-Estructural
Verifica consistencia entre diferentes secciones de la Spec:
- **Referencias de Eventos**: Todos los eventos referenciados en un Proceso deben existir en la definición de Eventos.
- **Existencia de Estados**: Todas las referencias `transition_to` deben apuntar a estados existentes en el mapa de `states`.
- **Estado Inicial**: El `initial_state` debe existir y **no puede** ser un estado terminal.
- **Alcanzabilidad**: Todos los estados deben ser alcanzables desde el `initial_state`. No se permiten estados "huérfanos".
- **Cierre del Proceso**: Un proceso debe tener al menos un estado terminal.
- **Estados del Proceso**: Un proceso no puede existir sin un mapa de `states` definido.

### F3: Validación Semántica
Verifica consistencia lógica y específica de tipos:
- **Compatibilidad `update_context`**: Los tipos en `update_context` deben coincidir con el tipo del campo en `context`.
- **Uso de Operadores**: `increment` solo es permitido en campos `integer`; `now` solo es permitido en campos `datetime`.
- **Requisitos de Persistencia**: Si `persistence` fuera `false`, el operador `increment` estaría prohibido (no soportado en v0.1).
- **Mutualidad**: Los estados deben tener exactamente un efecto (`emit_command`, `invoke`, o `terminal`).
- **Transiciones Terminales**: Los estados terminales **no deben** tener transiciones salientes (`on:`).

### F4: Validación de Ejecutabilidad
Asegura que la máquina de estados sea segura para el motor:
- **Grafo Finito**: El grafo de la máquina de estados debe ser finito (Error).
- **Camino Terminal**: Cada estado debe tener un camino válido hacia un estado terminal. Fallar en encontrar un camino terminal produce una **ADVERTENCIA** (potencial bucle infinito).
- **Terminal Faltante**: Un proceso sin al menos un estado terminal produce una **ADVERTENCIA**.
- **Comando de Inicio**: Un `start_command` debe ser definido si `persistence` es true.

## 3. Clasificacion de Errores

Los resultados de validación se clasifican para guiar a los desarrolladores:
- **ERROR (VAL-XXX)**: Violación estructural o semántica. **Invalida la ejecución**.
- **ADVERTENCIA**: Riesgo potencial (ej., estado inalcanzable o bucle infinito). La ejecución es posible pero no recomendada.
- **INFO**: Recomendaciones estructurales o recordatorios de convenciones de nombres.

## 4. Codigos de Error de Estabilidad
...
| `VAL-006` | Operador Inválido | `increment` o `now` usado en un tipo de campo inválido. |
| `VAL-007` | Terminal Faltante | No hay estado terminal definido en el proceso. |

## 5. Formato del Reporte de Cumplimiento
...

## 6. Garantia del Validador

Una especificación que pasa la VALIDACIÓN DE RIGOR v0.1 está garantizada de ser:
- **Estructuralmente Sólida**: Sin referencias rotas o claves faltantes.
- **No Ambigua**: Caminos de transición claros para todos los eventos declarados.
- **Coherente de Tipos**: Manejo consistente de datos en actualizaciones de contexto.
- **Determinísticamente Ejecutable**: Segura para procesamiento por el Motor de RIGOR.

El Motor de Validación produce un reporte JSON:
```json
{
  "valid": false,
  "errors": [
    {
      "code": "VAL-002",
      "message": "Transición a estado no existente: 'PENDING'",
      "location": "processes.OrderProcess.states.INITIAL.on.PaymentApproved"
    }
  ],
  "warnings": [],
  "info": []
}
```
Una especificación solo es **compatible con RIGOR** si el reporte retorna `valid: true`.
