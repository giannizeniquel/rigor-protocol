# Núcleo de Identidad

La identidad de RIGOR se define por su compromiso con la delimitación estructural, el determinismo y la precisión formal.

## Principios Fundamentales

### Explicidad
Todas las transiciones deben ser declaradas. No se permite comportamiento implícito.

### Determinismo
Dado estado, evento y versión, la transición resultante debe ser singular o explícitamente rechazada.

### Evolución Clasificada
Todos los cambios estructurales deben ser tipificados como compatibles, condicionales o rompedores. La evolución silenciosa es inválida.

## Contexto Tipado y Validación Estática

Los procesos de RIGOR operan sobre un esquema de contexto declarado explícitamente y validado estáticamente. Cada proceso debe declarar un esquema de contexto estructurado, tipos de propiedades explícitos y campos obligatorios.

No se permiten campos implícitos. Todas las mutaciones de contexto deben ajustarse al esquema declarado. Las violaciones de tipo deben detectarse en el momento de la validación, no en el tiempo de ejecución.

Esto asegura:
* Comportamiento determinista
* Validación estructural en Tiempo de compilación
* Eliminación de la mutación de estado ambigua

Las especificaciones de RIGOR son verificables estructuralmente antes de la ejecución.

## Modelo de Mutación Dirigido por Eventos

RIGOR aplica un modelo estricto de mutación dirigido por eventos. El contexto solo puede mutar dentro de transiciones declaradas explícitamente, activadas por eventos declarados y de acuerdo con las reglas de mutación permitidas.

No se permite ningún cambio de estado fuera de una transición, dentro de bloques de ejecución arbitrarios o mediante efectos secundarios implícitos. Toda la evolución del estado debe ser observable, explícita y declarada.

Esto garantiza:
* Trazabilidad completa
* Evolución de estado predecible
* Eliminación de mutaciones ocultas

## Semántica de Eventos Transaccionales

Cada evento procesado constituye una única unidad transaccional. Para cada evento:
1. Se lee el estado actual
2. Se evalúa una transición coincidente
3. Se verifican las condiciones de guard (guards)
4. Se aplica la mutación del contexto
5. Ocurre la transición de estado
6. Los cambios se confirman atómicamente

Si falla algún paso, la transición se aborta y no se persiste ninguna mutación. Esto garantiza una consistencia fuerte, transiciones atómicas y capacidad de reproducción determinista.

## Especificación vs Implementación

RIGOR es una especificación, no un motor. El protocolo define reglas estructurales, restricciones de mutación, semántica de eventos y garantías de versionado. No impone un entorno de ejecución, motor de almacenamiento o lenguaje de programación específico.

Cualquier motor que cumpla con la especificación formal, supere los requisitos de validación y preserve las garantías semánticas puede considerarse compatible con RIGOR. Puede existir un motor de referencia oficial, pero este no define el protocolo.

## Versionado y Congelación del Núcleo

RIGOR Core v0.1 define las garantías semánticas fundamentales del protocolo. El modelo semántico del Núcleo se considera congelado.

La evolución futura debe:
* Preservar la compatibilidad con versiones anteriores donde se declare
* Clasificar explícitamente los cambios (compatibles, condicionalmente compatibles, rompedores)
* Mantener la semántica determinista

Las versiones de la especificación siguen los principios de versionado semántico. La identidad de RIGOR es estable por diseño.

## Posicionamiento del Protocolo

RIGOR opera aguas arriba de la ejecución. No orquesta. No ejecuta. Restringe la posibilidad estructural.

RIGOR define garantías semánticas estrictas que las implementaciones posteriores deben preservar. El protocolo no es un motor de orquestación. Es un lenguaje de especificación determinista para describir procesos con estado. Los motores de ejecución interpretan las especificaciones de RIGOR; no las redefinen.

## Sistema Narrativo

La narrativa de RIGOR es:
- Declarativa
- Precisa
- Estructural
- No emocional
- No promocional

RIGOR no persuade. RIGOR define.
