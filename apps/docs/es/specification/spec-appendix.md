# Apéndice de la Spec (v0.1)

## 1. Propósito

El Apéndice de Spec de RIGOR complementa las especificaciones Core y Referencia proporcionando:
- JSON Schemas formales y validables.
- Ejemplos completos de implementación de extremo a extremo.
- Modelos de prueba detallados.
- Diagramas conceptuales y flujos visuales.
- Estrategias de integración CI/CD.
- Preparación para ejecución distribuida futura.

## 2. Apéndice A: JSON Schema Formal (Draft-07)

El siguiente esquema permite validación estructural automática de cualquier archivo de especificación de RIGOR.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["processes"],
  "properties": {
    "processes": {
      "type": "object",
      "patternProperties": {
        "^[A-Z][a-zA-Z0-9]*$": {
          "type": "object",
          "required": [
            "persistence",
            "start_command",
            "context",
            "initial_state",
            "states"
          ],
          "properties": {
            "persistence": { "type": "boolean", "const": true },
            "start_command": {
              "type": "string",
              "pattern": "^[A-Z][a-zA-Z0-9]*$"
            },
            "uniqueness": {
              "type": "object",
              "required": ["by"],
              "properties": {
                "by": { "type": "string" }
              }
            },
            "context": {
              "type": "object",
              "minProperties": 1,
              "patternProperties": {
                "^[a-z_]+$": {
                  "type": "string",
                  "pattern": "^(uuid|string|integer|boolean|datetime)(\\?)?$"
                }
              }
            },
            "initial_state": { "type": "string" },
            "states": {
              "type": "object",
              "minProperties": 1,
              "patternProperties": {
                "^[A-Z_]+$": {
                  "type": "object",
                  "properties": {
                    "emit_command": { "type": "string" },
                    "invoke": { "type": "string" },
                    "terminal": { "type": "boolean" },
                    "on": {
                      "type": "object",
                      "patternProperties": {
                        "^[A-Z][a-zA-Z0-9]*$": {
                          "type": "object",
                          "required": ["transition_to"],
                          "properties": {
                            "transition_to": { "type": "string" },
                            "update_context": { "type": "object" }
                          }
                        }
                      }
                    }
                  },
                  "oneOf": [
                    { "required": ["emit_command"] },
                    { "required": ["invoke"] },
                    { "required": ["terminal"] }
                  ]
                }
              }
            }
          }
        }
      }
    }
  }
}
```
*Nota: Las validaciones lógicas semánticas (alcanzabilidad, unicidad global, etc.) deben ser implementadas en la lógica del validador más allá de este JSON Schema.*

## 3. Apéndice B: Ejemplo Detallado de Extremo a Extremo

### 3.1 Especificación Declarativa
**Escenario:** Incorporación de Usuario con Verificación de Email.

```yaml
processes:
  UserOnboardingProcess:
    persistence: true
    start_command: StartOnboarding
    uniqueness:
      by: user_id
    context:
      user_id: uuid
      email_verified: boolean
      verified_at: datetime?
    initial_state: SENDING_EMAIL
    states:
      SENDING_EMAIL:
        emit_command: SendVerificationEmail
        on:
          EmailSent:
            transition_to: WAITING_FOR_VERIFICATION
      WAITING_FOR_VERIFICATION:
        on:
          EmailVerified:
            update_context:
              email_verified: true
              verified_at: now
            transition_to: COMPLETED
      COMPLETED:
        terminal: true
```

### 3.2 Flujo de Ejecución
1. **Disparador:** Recibir comando `StartOnboarding`.
2. **Configuración:** El motor crea instancia persistente, establece estado a `SENDING_EMAIL`.
3. **Acción:** El motor ejecuta `emit_command: SendVerificationEmail`.
4. **Transición:** Recibir evento `EmailSent` → el estado se mueve a `WAITING_FOR_VERIFICATION`.
5. **Finalización:** Recibir evento `EmailVerified` → actualizar contexto y mover a `COMPLETED` (terminal).

## 4. Apéndice C: Modelo Formal de Pruebas

### 4.1 Principio de Maquina de Estados Pura
Un proceso debe comportarse como una máquina pura donde:
- **Entrada:** Un evento.
- **Salida:** Un nuevo estado determinístico y un contexto actualizado.

### 4.2 Ejemplo de Caso de Prueba (Pseudocódigo)
```python
def test_successful_verification():
    # Arrange
    process = UserOnboardingProcess(user_id="uuid-123")
    
    # Act: Start
    process.start()
    assert process.state == "SENDING_EMAIL"
    
    # Act: Handle internal event
    process.handle(EmailSent())
    assert process.state == "WAITING_FOR_VERIFICATION"
    
    # Act: Handle verification
    process.handle(EmailVerified())
    
    # Assert
    assert process.state == "COMPLETED"
    assert process.context.email_verified is True
    assert process.context.verified_at is not None
```

## 5. Apéndice D: Diagramas Conceptuales

### 5.1 Flujo de Maquina de Estados
```
[SENDING_EMAIL] --(EmailSent)--> [WAITING_FOR_VERIFICATION]
                                      |
                                (EmailVerified)
                                      |
                                      v
                                 [COMPLETED] (terminal)
```

## 6. Apéndice E: Ejecucion Distribuida Futura

El modelo de RIGOR es nativamente compatible con arquitecturas distribuidas modernas:
- **Arquitectura Dirigida por Eventos:** Usar como capa de restricción para message brokers.
- **Microservicios:** Definir límites transaccionales entre servicios.
- **Sagas:** Soporte futuro para compensaciones (`v1.1`) permite rollback distribuido seguro.

## 7. Apéndice F: Estrategia de Validacion CI/CD

Pipeline recomendado para proyectos compatibles con RIGOR:
1. **Validación de Schema:** Verificar YAML contra el JSON Schema (Apéndice A).
2. **Validación Semántica:** Ejecutar el Validador de RIGOR para coherencia de tipos y alcanzabilidad.
3. **Generación de Código:** Usar el CLI para generar artefactos de implementación objetivo.
4. **Pruebas Unitarias:** Ejecutar pruebas de máquina de estados pura (Apéndice C) en el código generado.
5. **Despliegue:** Distribuir especificaciones validadas al motor de ejecución.

## 8. Conclusión

El Apéndice de RIGOR v0.1 proporciona los planos de nivel industrial necesarios para implementar, validar y probar sistemas compatibles. Combinado con las especificaciones Core y Referencia, completa el marco estructural formal requerido para la evolución de sistemas impulsada por IA determinística.
