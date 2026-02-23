---
layout: home

hero:
  name: "RIGOR"
  tagline: "AI Constraint Protocol. Formal boundaries for AI-generated systems."
  actions:
    - theme: brand
      text: Access Specification →
      link: /specification/identity-core
    - theme: alt
      text: View on GitHub →
      link: https://github.com/giannizeniquel/rigor-protocol

features:
  - title: Explicitness
    details: All transitions must be declared. No implicit behavior is permitted.
  - title: Determinism
    details: Given state, event, and version, the resulting transition must be singular or explicitly rejected.
  - title: Classified Evolution
    details: All structural changes must be typed as compatible, conditional, or breaking. Silent evolution is invalid.
  - title: Validation Before Execution
    details: Structural validation is a precondition of existence. Execution without validation violates the protocol.
  - title: Separation of Layers
    details: RIGOR formally separates language definition, specification instance, and validation engine. No layer may implicitly assume another.
---
