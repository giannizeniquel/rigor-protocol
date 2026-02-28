export const languages = {
  en: 'English',
  es: 'Español',
};

export const ui = {
  en: {
    // Hero
    'hero.title': 'RIGOR',
    'hero.subtitle': 'A typed, event-driven constraint protocol for AI-generated systems.',
    'hero.tertiary': 'RIGOR is a formal specification language designed to constrain, validate and govern AI-generated backend systems.',
    'hero.optional': 'It defines explicit state transitions, typed context mutation rules, and deterministic execution boundaries.',
    'hero.cta': 'Access Specification →',
    
    // Structural Condition
    'structuralCondition.title': 'Structural Acceleration',
    'structuralCondition.p1': 'AI-native systems increase implementation velocity beyond human structural oversight capacity.',
    'structuralCondition.p2': 'Generation throughput now exceeds structural validation throughput.',
    'structuralCondition.p3': 'When structural change outpaces structural governance, systems accumulate implicit transitions, undeclared evolution, migration ambiguity, and contract instability.',
    'structuralCondition.p4': 'This condition produces structural entropy.',
    
    // Structural Entropy
    'structuralEntropy.title': 'Structural Entropy',
    'structuralEntropy.definition': 'Structural Entropy is the progressive increase of implicit, unclassified, or non-deterministic structural behavior across iterative system evolution.',
    'structuralEntropy.manifestationTitle': 'Structural entropy manifests when:',
    'structuralEntropy.m1': 'Transitions are inferred instead of declared.',
    'structuralEntropy.m2': 'Version changes are untyped.',
    'structuralEntropy.m3': 'Migrations alter behavior without formal classification.',
    'structuralEntropy.m4': 'Execution diverges from documented intent.',
    'structuralEntropy.cumulative': 'Structural entropy is cumulative. Without constraint, it becomes irreversible.',
    'structuralEntropy.positioning': 'RIGOR positions itself as an entropy-reduction protocol.',
    
    // Protocol Model
    'protocolModel.title': 'AI Constraint Protocol Model',
    'protocolModel.diagramTitle': 'Architectural Position',
    'protocolModel.diagramDescription': 'RIGOR operates as a constraint layer between human intent and runtime execution.',
    'protocolModel.flow.title': 'Flow',
    'protocolModel.flow.humanIntent': 'Human Intent',
    'protocolModel.flow.specification': 'Rigor Specification (Constraint Contract)',
    'protocolModel.flow.generation': 'AI Generation',
    'protocolModel.flow.validation': 'Structural Validation',
    'protocolModel.flow.execution': 'Runtime Execution',
    'protocolModel.componentsTitle': 'The protocol comprises five normative components:',
    'protocolModel.components.1': 'Intent Domain — Defines the formally allowed structural space.',
    'protocolModel.components.2': 'Constraint Contract — Machine-verifiable specification instance.',
    'protocolModel.components.3': 'Generation Boundary — Interface between AI output and validation.',
    'protocolModel.components.4': 'Validation Engine — Evaluates structural compliance.',
    'protocolModel.components.5': 'Evolution Layer — Classifies all structural changes.',
    
    // What is RIGOR? (NEW)
    'whatIsRigor.title': 'What is RIGOR?',
    'whatIsRigor.intro': 'RIGOR is an open specification that defines how AI-generated systems must behave.',
    'whatIsRigor.list.1': 'Explicit state machines',
    'whatIsRigor.list.2': 'Typed context schemas',
    'whatIsRigor.list.3': 'Event-driven transitions',
    'whatIsRigor.list.4': 'Deterministic mutation rules',
    'whatIsRigor.list.5': 'Validation before execution',
    'whatIsRigor.outro': 'RIGOR separates specification from implementation. The specification defines what is allowed. Implementations execute under those constraints.',
    
    // Core Invariants
    'coreInvariants.title': 'Core Invariants',
    'coreInvariants.intro': 'The following properties are non-negotiable across all RIGOR-compliant systems:',
    'coreInvariants.1.title': 'Explicitness',
    'coreInvariants.1.description': 'No implicit mutations. No hidden state changes. All context mutations must be declared within event transitions.',
    'coreInvariants.2.title': 'Determinism',
    'coreInvariants.2.description': 'For a given state and event, the resulting transition is uniquely defined. The pair (state, event) must be unambiguous.',
    'coreInvariants.3.title': 'Classified Evolution',
    'coreInvariants.3.description': 'All structural changes must be typed as compatible, conditional, or breaking. Silent evolution is invalid.',
    'coreInvariants.4.title': 'Validation Before Execution',
    'coreInvariants.4.description': 'Structural validation is a precondition of existence. Execution without validation violates the protocol.',
    'coreInvariants.5.title': 'Controlled Mutation',
    'coreInvariants.5.description': 'Context can only mutate inside transitions triggered by declared events. Each event is processed as an independent transactional unit.',
    'coreInvariants.6.title': 'Specification / Implementation Separation',
    'coreInvariants.6.description': 'RIGOR defines a protocol. Engines implement it. The language is independent of any runtime.',
    
    // RIGOR Core v0.1 (NEW)
    'coreVersion.title': 'RIGOR Core v0.1 — Frozen Semantic Model',
    'coreVersion.intro': 'The semantic core of RIGOR v0.1 is formally defined and frozen.',
    'coreVersion.list.1': 'Event-driven state machine',
    'coreVersion.list.2': 'Typed and validated context schema',
    'coreVersion.list.3': 'Explicit mutation declaration',
    'coreVersion.list.4': 'No external mutation allowed',
    'coreVersion.list.5': 'Terminal state irreversibility',
    'coreVersion.outro': 'This version establishes the minimal invariant foundation of the protocol.',
    
    // Backend-First Strategy (NEW)
    'backendFirst.title': 'Backend-First Strategy',
    'backendFirst.intro': 'RIGOR begins as a backend-focused specification language.',
    'backendFirst.list.1': 'Process orchestration',
    'backendFirst.list.2': 'Domain state machines',
    'backendFirst.list.3': 'External service invocation boundaries',
    'backendFirst.list.4': 'API contract governance',
    'backendFirst.outro': 'Frontend and contract derivations may emerge from the backend specification layer.',
    
    // Transaction Model (NEW)
    'transactionModel.title': 'Transaction Model',
    'transactionModel.intro': 'Each processed event represents an isolated transactional unit.',
    'transactionModel.list.1': 'Context mutation occurs only during event transitions.',
    'transactionModel.list.2': 'No partial state application is allowed.',
    'transactionModel.list.3': 'Strong consistency with external systems is enforced through controlled invocation patterns.',
    
    // Project Status (NEW)
    'projectStatus.title': 'Project Status',
    'projectStatus.list.1': 'Specification Core v0.1 — Frozen',
    'projectStatus.list.2': 'Reference Specification (YAML/JSON) — Defined',
    'projectStatus.list.3': 'Validation Rules — Defined',
    'projectStatus.list.4': 'Official Engine — In development',
    'projectStatus.outro': 'RIGOR is evolving as an open standard intended for community governance.',
    
    // Open Standard (NEW)
    'openStandard.title': 'Open Standard',
    'openStandard.body': 'RIGOR is designed to be an open, implementable protocol. The specification is public. Any team may build a compatible engine. Long-term governance is intended to be community-driven.',
    
    // Structural Positioning
    'structuralPositioning.title': 'Structural Positioning',
    'structuralPositioning.intro': 'RIGOR operates upstream of execution. It does not orchestrate. It does not execute. It constrains structural possibility.',
    'structuralPositioning.table.head.system': 'System',
    'structuralPositioning.table.head.whatItDoes': 'What It Does',
    'structuralPositioning.table.head.rigorDoes': 'RIGOR Does',
    'structuralPositioning.table.workflow.name': 'Workflow Orchestration',
    'structuralPositioning.table.workflow.alt': '(Temporal, AWS Step Functions)',
    'structuralPositioning.table.workflow.what': 'Manage distributed execution. Coordinate runtime behavior. Handle retries and state persistence.',
    'structuralPositioning.table.workflow.rigor': 'Define what processes are structurally allowed to exist before execution.',
    'structuralPositioning.table.iac.name': 'Infrastructure as Code',
    'structuralPositioning.table.iac.alt': '(Terraform)',
    'structuralPositioning.table.iac.what': 'Define infrastructure state declaratively.',
    'structuralPositioning.table.iac.rigor': 'Define structural process evolution constraints.',
    'structuralPositioning.table.static.name': 'Static Analysis',
    'structuralPositioning.table.static.alt': '(Type Systems, Linters)',
    'structuralPositioning.table.static.what': 'Validate code correctness. Enforce compile-time constraints.',
    'structuralPositioning.table.static.rigor': 'Classify structural evolution across versions. Govern AI-generated structural possibility space.',
    'structuralPositioning.table.dsl.name': 'Domain-Specific Languages',
    'structuralPositioning.table.dsl.what': 'Encode process definitions in syntax.',
    'structuralPositioning.table.dsl.rigor': 'Define structural invariants independent of implementation language.',
    'structuralPositioning.statement': 'RIGOR is upstream of orchestration. It defines the structural boundary between generation and execution.',
    
    // Conceptual Territory
    'conceptualTerritory.title': 'Conceptual Territory',
    'conceptualTerritory.intro': 'RIGOR owns the conceptual space of:',
    'conceptualTerritory.list.1': 'Pre-Execution Structural Protocol',
    'conceptualTerritory.list.2': 'AI Structural Boundedness',
    'conceptualTerritory.list.3': 'Deterministic Evolution Governance',
    'conceptualTerritory.list.4': 'Version-Typed Process Contracts',
    'conceptualTerritory.list.5': 'Structural Entropy Reduction',
    'conceptualTerritory.closing': 'This territory is not formally occupied by existing platforms.',
    
    // Protocol vs Prompt
    'protocolVsPrompt.title': 'Protocol vs Prompt Engineering',
    'protocolVsPrompt.table.head.aspect': 'Aspect',
    'protocolVsPrompt.table.head.prompt': 'Prompt Engineering',
    'protocolVsPrompt.table.head.protocol': 'AI Constraint Protocol',
    'protocolVsPrompt.table.approach': 'Approach',
    'protocolVsPrompt.table.approach.prompt': 'Descriptive',
    'protocolVsPrompt.table.approach.protocol': 'Prescriptive',
    'protocolVsPrompt.table.method': 'Method',
    'protocolVsPrompt.table.method.prompt': 'Persuades model',
    'protocolVsPrompt.table.method.protocol': 'Defines boundaries',
    'protocolVsPrompt.table.control': 'Control',
    'protocolVsPrompt.table.control.prompt': 'Relies on phrasing',
    'protocolVsPrompt.table.control.protocol': 'Formalizes domain',
    'protocolVsPrompt.table.validation': 'Validation',
    'protocolVsPrompt.table.validation.prompt': 'Probabilistic variance',
    'protocolVsPrompt.table.validation.protocol': 'Structural containment',
    'protocolVsPrompt.table.output': 'Output',
    'protocolVsPrompt.table.output.prompt': 'Approximate intent',
    'protocolVsPrompt.table.output.protocol': 'Bounded execution',
    'protocolVsPrompt.statement': 'Prompt engineering attempts to guide probabilistic behavior. AI Constraint Protocol constrains structural possibility.',
    
    // Specification Access
    'specificationAccess.title': 'Normative Documentation',
    'specificationAccess.body': 'Complete protocol specification, process definitions, and implementation guidance available in formal documentation.',
    'specificationAccess.cta': 'Access Specification →',
    'specificationAccess.secondary': 'View on GitHub →',
    
    // Footer
    'footer.brand': 'RIGOR',
    'footer.tagline': 'AI Constraint Protocol',
    'footer.specification': 'Specification',
    'footer.github': 'GitHub',
    'footer.version': 'Specification v0.1',
    
    // Language
    'lang.switchTo': 'Switch to',
  },
  es: {
    // Hero
    'hero.title': 'RIGOR',
    'hero.subtitle': 'Un protocolo de restricciones tipado y dirigido por eventos para sistemas generados por IA.',
    'hero.tertiary': 'RIGOR es un lenguaje de especificación formal diseñado para restringir, validar y governar sistemas de backend generados por IA.',
    'hero.optional': 'Define transiciones de estado explícitas, reglas de mutación de contexto tipadas y límites de ejecución deterministas.',
    'hero.cta': 'Acceder a la Especificación →',
    
    // Structural Condition
    'structuralCondition.title': 'Aceleración Estructural',
    'structuralCondition.p1': 'Los sistemas nativos de IA incrementan la velocidad de implementación más allá de la capacidad de supervisión estructural humana.',
    'structuralCondition.p2': 'El rendimiento de generación supera ahora el rendimiento de validación estructural.',
    'structuralCondition.p3': 'Cuando el cambio estructural supera la gobernanza estructural, los sistemas acumulan transiciones implícitas, evolución no declarada, ambigüedad de migración e inestabilidad de contratos.',
    'structuralCondition.p4': 'Esta condición produce entropía estructural.',
    
    // Structural Entropy
    'structuralEntropy.title': 'Entropía Estructural',
    'structuralEntropy.definition': 'La Entropía Estructural es el incremento progresivo de comportamiento estructural implícito, no clasificado o no determinístico a través de la evolución iterativa del sistema.',
    'structuralEntropy.manifestationTitle': 'La entropía estructural se manifiesta cuando:',
    'structuralEntropy.m1': 'Las transiciones se infieren en lugar de declararse.',
    'structuralEntropy.m2': 'Los cambios de versión no están tipados.',
    'structuralEntropy.m3': 'Las migraciones alteran el comportamiento sin clasificación formal.',
    'structuralEntropy.m4': 'La ejecución diverge de la intención documentada.',
    'structuralEntropy.cumulative': 'La entropía estructural es acumulativa. Sin restricción, se vuelve irreversible.',
    'structuralEntropy.positioning': 'RIGOR se posiciona como un protocolo de reducción de entropía.',
    
    // Protocol Model
    'protocolModel.title': 'Modelo de Protocolo de Restricción de IA',
    'protocolModel.diagramTitle': 'Posición Arquitectónica',
    'protocolModel.diagramDescription': 'RIGOR opera como una capa de restricción entre la intención humana y la ejecución en tiempo de ejecución.',
    'protocolModel.flow.title': 'Flujo',
    'protocolModel.flow.humanIntent': 'Intención Humana',
    'protocolModel.flow.specification': 'Especificación RIGOR (Contrato de Restricción)',
    'protocolModel.flow.generation': 'Generación de IA',
    'protocolModel.flow.validation': 'Validación Estructural',
    'protocolModel.flow.execution': 'Ejecución en Tiempo de Ejecución',
    'protocolModel.componentsTitle': 'El protocolo comprende cinco componentes normativos:',
    'protocolModel.components.1': 'Dominio de Intención — Define el espacio estructural formalmente permitido.',
    'protocolModel.components.2': 'Contrato de Restricción — Instancia de especificación verificable por máquina.',
    'protocolModel.components.3': 'Límite de Generación — Interfaz entre salida de IA y validación.',
    'protocolModel.components.4': 'Motor de Validación — Evalúa el cumplimiento estructural.',
    'protocolModel.components.5': 'Capa de Evolución — Clasifica todos los cambios estructurales.',
    
    // Core Invariants
    'coreInvariants.title': 'Invariantes Base',
    'coreInvariants.intro': 'Las siguientes propiedades son obligatorias para todos los sistemas compatibles con RIGOR:',
    'coreInvariants.1.title': 'Explicitud',
    'coreInvariants.1.description': 'Sin mutaciones implícitas. Sin cambios de estado ocultos. Todas las mutaciones de contexto deben declararse dentro de las transiciones de eventos.',
    'coreInvariants.2.title': 'Determinismo',
    'coreInvariants.2.description': 'Para un estado y evento dados, la transición resultante está definida de forma única. El par (estado, evento) debe ser inequívoco.',
    'coreInvariants.3.title': 'Evolución Clasificada',
    'coreInvariants.3.description': 'Todos los cambios estructurales deben ser tipificados como compatibles, condicionales o rompedores. La evolución silenciosa es inválida.',
    'coreInvariants.4.title': 'Validación Previa a la Ejecución',
    'coreInvariants.4.description': 'La validación estructural es una precondición de existencia. La ejecución sin validación viola el protocolo.',
    'coreInvariants.5.title': 'Mutación Controlada',
    'coreInvariants.5.description': 'El contexto solo puede mutar dentro de las transiciones activadas por eventos declarados. Cada evento se procesa como una unidad transaccional independiente.',
    'coreInvariants.6.title': 'Separación Especificación / Implementación',
    'coreInvariants.6.description': 'RIGOR define un protocolo. Los motores lo implementan. El lenguaje es independiente de cualquier entorno de ejecución.',
    
    // What is RIGOR? (NEW)
    'whatIsRigor.title': '¿Qué es RIGOR?',
    'whatIsRigor.intro': 'RIGOR es una especificación abierta que define cómo deben comportarse los sistemas generados por IA.',
    'whatIsRigor.list.1': 'Máquinas de estado explícitas',
    'whatIsRigor.list.2': 'Esquemas de contexto tipados',
    'whatIsRigor.list.3': 'Transiciones dirigidas por eventos',
    'whatIsRigor.list.4': 'Reglas de mutación deterministas',
    'whatIsRigor.list.5': 'Validación antes de ejecución',
    'whatIsRigor.outro': 'RIGOR separa la especificación de la implementación. La especificación define qué está permitido. Las implementaciones se ejecutan bajo esas restricciones.',
    
    // RIGOR Core v0.1 (NEW)
    'coreVersion.title': 'RIGOR Core v0.1 — Modelo Semántico Congelado',
    'coreVersion.intro': 'El núcleo semántico de RIGOR v0.1 está formalmente definido y congelado.',
    'coreVersion.list.1': 'Máquina de estado dirigida por eventos',
    'coreVersion.list.2': 'Esquema de contexto tipado y validado',
    'coreVersion.list.3': 'Declaración de mutación explícita',
    'coreVersion.list.4': 'No se permite mutación externa',
    'coreVersion.list.5': 'Irreversibilidad del estado terminal',
    'coreVersion.outro': 'Esta versión establece la base mínima invariante del protocolo.',
    
    // Backend-First Strategy (NEW)
    'backendFirst.title': 'Estrategia Backend-First',
    'backendFirst.intro': 'RIGOR comienza como un lenguaje de especificación centrado en el backend.',
    'backendFirst.list.1': 'Orquestación de procesos',
    'backendFirst.list.2': 'Máquinas de estado de dominio',
    'backendFirst.list.3': 'Límites de invocación de servicios externos',
    'backendFirst.list.4': 'Gobernanza de contratos API',
    'backendFirst.outro': 'Las derivaciones de frontend y contratos pueden emerger de la capa de especificación del backend.',
    
    // Transaction Model (NEW)
    'transactionModel.title': 'Modelo de Transacciones',
    'transactionModel.intro': 'Cada evento procesado representa una unidad transaccional aislada.',
    'transactionModel.list.1': 'La mutación de contexto ocurre solo durante las transiciones de eventos.',
    'transactionModel.list.2': 'No se permite la aplicación parcial del estado.',
    'transactionModel.list.3': 'La consistencia fuerte con sistemas externos se aplica a través de patrones de invocación controlados.',
    
    // Project Status (NEW)
    'projectStatus.title': 'Estado del Proyecto',
    'projectStatus.list.1': 'Núcleo de Especificación v0.1 — Congelado',
    'projectStatus.list.2': 'Especificación de Referencia (YAML/JSON) — Definida',
    'projectStatus.list.3': 'Reglas de Validación — Definidas',
    'projectStatus.list.4': 'Motor Oficial — En desarrollo',
    'projectStatus.outro': 'RIGOR está evolucionando como un estándar abierto destinado a la gobernanza comunitaria.',
    
    // Open Standard (NEW)
    'openStandard.title': 'Estándar Abierto',
    'openStandard.body': 'RIGOR está diseñado para ser un protocolo abierto e implementable. La especificación es pública. Cualquier equipo puede construir un motor compatible. La gobernanza a largo plazo está destinada a ser dirigida por la comunidad.',
    
    // Structural Positioning
    'structuralPositioning.title': 'Posicionamiento Estructural',
    'structuralPositioning.intro': 'RIGOR opera aguas arriba de la ejecución. No orquesta. No ejecuta. Restringe la posibilidad estructural.',
    'structuralPositioning.table.head.system': 'Sistema',
    'structuralPositioning.table.head.whatItDoes': 'Qué Hace',
    'structuralPositioning.table.head.rigorDoes': 'RIGOR Hace',
    'structuralPositioning.table.workflow.name': 'Orquestación de Flujos',
    'structuralPositioning.table.workflow.alt': '(Temporal, AWS Step Functions)',
    'structuralPositioning.table.workflow.what': 'Gestiona ejecución distribuida. Coordina comportamiento en tiempo de ejecución. Maneja reintentos y persistencia de estado.',
    'structuralPositioning.table.workflow.rigor': 'Define qué procesos están estructuralmente permitidos antes de la ejecución.',
    'structuralPositioning.table.iac.name': 'Infraestructura como Código',
    'structuralPositioning.table.iac.alt': '(Terraform)',
    'structuralPositioning.table.iac.what': 'Define el estado de infraestructura declarativamente.',
    'structuralPositioning.table.iac.rigor': 'Define restricciones de evolución de procesos estructurales.',
    'structuralPositioning.table.static.name': 'Análisis Estático',
    'structuralPositioning.table.static.alt': '(Sistemas de Tipos, Linters)',
    'structuralPositioning.table.static.what': 'Valida corrección de código. Aplica restricciones en tiempo de compilación.',
    'structuralPositioning.table.static.rigor': 'Clasifica evolución estructural entre versiones. Gobierna el espacio de posibilidad estructural generado por IA.',
    'structuralPositioning.table.dsl.name': 'Lenguajes Específicos de Dominio',
    'structuralPositioning.table.dsl.what': 'Codifica definiciones de procesos en sintaxis.',
    'structuralPositioning.table.dsl.rigor': 'Define invariantes estructurales independientes del lenguaje de implementación.',
    'structuralPositioning.statement': 'RIGOR está aguas arriba de la orquestación. Define el límite estructural entre generación y ejecución.',
    
    // Conceptual Territory
    'conceptualTerritory.title': 'Territorio Conceptual',
    'conceptualTerritory.intro': 'RIGOR posee el espacio conceptual de:',
    'conceptualTerritory.list.1': 'Protocolo Estructural Pre-Ejecución',
    'conceptualTerritory.list.2': 'Delimitación Estructural de IA',
    'conceptualTerritory.list.3': 'Gobernanza de Evolución Determinística',
    'conceptualTerritory.list.4': 'Contratos de Procesos Tipados por Versión',
    'conceptualTerritory.list.5': 'Reducción de Entropía Estructural',
    'conceptualTerritory.closing': 'Este territorio no está formalmente ocupado por plataformas existentes.',
    
    // Protocol vs Prompt
    'protocolVsPrompt.title': 'Protocolo vs Ingeniería de Prompts',
    'protocolVsPrompt.table.head.aspect': 'Aspecto',
    'protocolVsPrompt.table.head.prompt': 'Ingeniería de Prompts',
    'protocolVsPrompt.table.head.protocol': 'Protocolo de Restricción de IA',
    'protocolVsPrompt.table.approach': 'Enfoque',
    'protocolVsPrompt.table.approach.prompt': 'Descriptivo',
    'protocolVsPrompt.table.approach.protocol': 'Prescriptivo',
    'protocolVsPrompt.table.method': 'Método',
    'protocolVsPrompt.table.method.prompt': 'Persuade al modelo',
    'protocolVsPrompt.table.method.protocol': 'Define límites',
    'protocolVsPrompt.table.control': 'Control',
    'protocolVsPrompt.table.control.prompt': 'Depende de la redacción',
    'protocolVsPrompt.table.control.protocol': 'Formaliza el dominio',
    'protocolVsPrompt.table.validation': 'Validación',
    'protocolVsPrompt.table.validation.prompt': 'Varianza probabilística',
    'protocolVsPrompt.table.validation.protocol': 'Contención estructural',
    'protocolVsPrompt.table.output': 'Salida',
    'protocolVsPrompt.table.output.prompt': 'Intención aproximada',
    'protocolVsPrompt.table.output.protocol': 'Ejecución delimitada',
    'protocolVsPrompt.statement': 'La ingeniería de intentos guiar el comportamiento probabilístico. El Protocolo de Restricción de IA restringe la posibilidad estructural.',
    
    // Specification Access
    'specificationAccess.title': 'Documentación Normativa',
    'specificationAccess.body': 'Especificación completa del protocolo, definiciones de procesos y guía de implementación disponibles en documentación formal.',
    'specificationAccess.cta': 'Acceder a la Especificación →',
    'specificationAccess.secondary': 'Ver en GitHub →',
    
    // Footer
    'footer.brand': 'RIGOR',
    'footer.tagline': 'Protocolo de Restricción de IA',
    'footer.specification': 'Especificación',
    'footer.github': 'GitHub',
    'footer.version': 'Especificación v0.1',
    
    // Language
    'lang.switchTo': 'Cambiar a',
  },
} as const;
