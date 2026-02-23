---
layout: home

hero:
  name: "RIGOR"
  tagline: "Protocolo de Restricción de IA. Límites formales para sistemas generados por IA."
  actions:
    - theme: brand
      text: Acceder a Especificación →
      link: /es/specification/identity-core
    - theme: alt
      text: Ver en GitHub →
      link: https://github.com/giannizeniquel/rigor-protocol

features:
  - title: Explicitud
    details: Todas las transiciones deben ser declaradas. No se permite comportamiento implícito.
  - title: Determinismo
    details: Dado estado, evento y versión, la transición resultante debe ser singular o explícitamente rechazada.
  - title: Evolución Clasificada
    details: Todos los cambios estructurales deben ser tipificados como compatibles, condicionales o rompedores. La evolución silenciosa es inválida.
  - title: Validación Previa a Ejecución
    details: La validación estructural es una precondition de existencia. La ejecución sin validación viola el protocolo.
  - title: Separación de Capas
    details: RIGOR separa formalmente la definición de lenguaje, instancia de especificación y motor de validación. Ninguna capa puede asumir implícitamente otra.
---
