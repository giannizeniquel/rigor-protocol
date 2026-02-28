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
    details: Dado estado y evento, la transición resultante está definida de forma única.
  - title: Contexto Tipado
    details: Cada proceso declara un esquema de contexto tipado y obligatorio.
  - title: Ejecución Transaccional
    details: Cada evento representa un límite transaccional atómico e independiente.
  - title: Congelación Semántica
    details: El Core v0.1 está congelado, garantizando estabilidad y compatibilidad a largo plazo.
---

## ¿Por qué RIGOR?

Los sistemas de software modernos dependen cada vez más de los Modelos de Lenguaje Grandes (LLM) para asistir en la generación de código. Sin embargo, el lenguaje natural es:

* **Ambiguo**: Interpretable de múltiples maneras.
* **Dependiente del contexto**: El significado cambia con el prompt.
* **No determinista**: Produce resultados estructurales inconsistentes.
* **Difícil de validar**: La verificación estática de la intención narrativa es impracticable.

RIGOR existe para reemplazar la ambigüedad narrativa con:

* **Estructuras declarativas tipadas**: Definiciones formales de procesos.
* **Transiciones de estado deterministas**: Rutas permitidas explícitamente.
* **Reglas de mutación explícitas**: Sin efectos secundarios ocultos.
* **Validación estática previa a la ejecución**: El cumplimiento estructural es una precondición de existencia.

RIGOR no es un framework. No es un motor de ejecución. Es un **lenguaje de especificación formal** diseñado para una generación centrada en la precisión.

---

## Invariantes del Núcleo

Los siguientes invariantes están definidos formalmente en RIGOR Core v0.1 y son no negociables:

### 1. Solo Mutación Dirigida por Eventos
Toda mutación de estado DEBE ocurrir exclusivamente dentro de transiciones activadas por eventos. No se permiten cambios de estado fuera de las transiciones, ni efectos secundarios implícitos. Esto asegura el determinismo, la trazabilidad y la capacidad de reproducción.

### 2. Un Evento = Una Transacción
Cada evento procesado representa un límite transaccional independiente. El Motor garantiza transiciones de estado y mutaciones de contexto atómicas. Si algún paso falla, se revierte toda la transacción.

### 3. El Contexto Tipado es Obligatorio
Cada proceso DEBE definir un `context_schema` tipado. No se permiten propiedades dinámicas ni la creación implícita de campos. Todas las mutaciones deben ajustarse al esquema declarado, permitiendo la validación estática y la confiabilidad del generador.

### 4. Transiciones Deterministas
Para cualquier par `(estado, evento)`, se permite como máximo una transición. Los guards deben ser puros y no deben mutar el contexto.

### 5. Congelación Semántica del Núcleo
RIGOR Core v0.1 define el modelo de proceso, el modelo de eventos, el modelo de transición, las reglas de mutación y los límites de transacción. Las versiones futuras pueden extender, pero no deben romper estos invariantes fundamentales.

---

## El Estándar Primero, la Implementación Segundo

RIGOR está diseñado como una **especificación abierta**. Es independiente del motor y puede implementarse de forma autónoma. Mientras que el Motor RIGOR oficial sirve como una implementación de referencia normativa, el estándar sigue siendo válido y útil independientemente de cualquier entorno de ejecución específico.

---

## Restricciones de Diseño Explícitas

RIGOR excluye deliberadamente:
* Descripción de UI y Layout.
* Orquestación de infraestructura (territorio de Terraform/IaC).
* Programación de tiempo de ejecución y reintentos.
* Algoritmos de consenso distribuido.
* Modelado directo de bases de datos.

RIGOR se centra exclusivamente en la **semántica de procesos**, **transiciones de estado** y **mutación dirigida por eventos**.

---

## Visión a Largo Plazo

Aunque RIGOR comienza con el modelado de procesos de backend, su modelo semántico permite capas derivadas como la derivación de contratos de API, la sincronización del estado del frontend y la orquestación entre servicios. El núcleo sigue centrándose primero en el backend para proporcionar una base estable para la generación de sistemas alineados con la IA.
