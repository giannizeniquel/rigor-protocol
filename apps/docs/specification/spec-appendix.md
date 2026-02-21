# Spec Appendix (v0.1)

## 1. Purpose

The RIGOR Spec Appendix complements the Core and Reference specifications by providing:
- Formal, validable JSON Schemas.
- Complete end-to-end implementation examples.
- Detailed testing models.
- Conceptual diagrams and visual flows.
- CI/CD integration strategies.
- Future-proofing for distributed execution.

## 2. Appendix A: Formal JSON Schema (Draft-07)

The following schema allows for automatic structural validation of any RIGOR specification file.

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
*Note: Logical semantic validations (reachability, global uniqueness, etc.) must be implemented in the validator's logic beyond this JSON Schema.*

## 3. Appendix B: Detailed End-to-End Example

### 3.1 Declarative Specification
**Scenario:** User Onboarding with Email Verification.

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

### 3.2 Execution Flow
1. **Trigger:** Receive `StartOnboarding` command.
2. **Setup:** Engine creates persistent instance, sets state to `SENDING_EMAIL`.
3. **Action:** Engine executes `emit_command: SendVerificationEmail`.
4. **Transition:** Receive `EmailSent` event → state moves to `WAITING_FOR_VERIFICATION`.
5. **Finalization:** Receive `EmailVerified` event → update context and move to `COMPLETED` (terminal).

## 4. Appendix C: Formal Testing Model

### 4.1 Pure State Machine Principle
A process must behave as a pure machine where:
- **Input:** An event.
- **Output:** A deterministic new state and an updated context.

### 4.2 Test Case Example (Pseudocode)
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

## 5. Appendix D: Conceptual Diagrams

### 5.1 State Machine Flow
```
[SENDING_EMAIL] --(EmailSent)--> [WAITING_FOR_VERIFICATION]
                                       |
                                 (EmailVerified)
                                       |
                                       v
                                  [COMPLETED] (terminal)
```

## 6. Appendix E: Future Distributed Execution

The RIGOR model is natively compatible with modern distributed architectures:
- **Event-Driven Architecture:** Use as a constraint layer for message brokers.
- **Microservices:** Define transactional boundaries between services.
- **Sagas:** Future support for compensations (`v1.1`) enables safe distributed rollback.

## 7. Appendix F: CI/CD Validation Strategy

Recommended pipeline for RIGOR-compliant projects:
1. **Schema Validation:** Verify YAML against the JSON Schema (Appendix A).
2. **Semantic Validation:** Run the RIGOR Validator for reachability and type coherence.
3. **Code Generation:** Use the CLI to generate target implementation artifacts.
4. **Unit Testing:** Execute pure state machine tests (Appendix C) on generated code.
5. **Deployment:** Distribute validated specifications to the execution engine.

## 8. Conclusion

The RIGOR Appendix v0.1 provides the industrial-grade blueprints necessary to implement, validate, and test compliant systems. Combined with the Core and Reference specifications, it completes the formal structural framework required for deterministic AI-driven system evolution.
