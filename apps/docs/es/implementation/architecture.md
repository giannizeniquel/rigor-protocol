# Arquitectura del Sistema (v0.1)

## 1. Objetivos Arquitectónicos

Una implementación compatible de RIGOR **DEBE**:

1. Ser completamente determinista
2. Aislar etapas de procesamiento
3. Operar sobre un Grafo Canónico
4. Soportar flujos de trabajo de diff y evolución
5. Ser testeable a nivel de módulo
6. Mantener contratos estables entre motores

La arquitectura **DEBE** prevenir dependencias implícitas entre capas.

---

## 2. Arquitectura de Sistema de Alto Nivel

El sistema está compuesto por motores independientes organizados en un pipeline por capas.

```text
                    ┌──────────────────────┐
                    │    Interfaz CLI       │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │    API de Aplicación │
                    └──────────┬───────────┘
                               │
  ┌─────────────────────────────────────────────────────────┐
  │                   Procesamiento Core                     │
  │                                                          │
  │  Parser → Constructor de Grafo → Canonicalización →     │
  │                                   Validación             │
  │                                   │                      │
  │                                   ▼                      │
  │                    Diff → Versionado → Migraciones      │
  └─────────────────────────────────────────────────────────┘
```

Cada módulo **DEBE** exponer entradas y salidas explícitas.

---

## 3. Descomposición de Módulos

La arquitectura consiste en 13 módulos lógicos.

### 3.1 Parser & Loader

**Responsabilidad:**
- Parsear YAML
- Validar sintaxis
- Normalizar estructuras básicas
- Detectar violaciones estructurales tempranas

**Entrada:** Texto YAML raw

**Salida:** Representación intermedia (IR) parseada

**Restricciones:**
- Sin validación semántica
- Sin construcción de grafo
- Sin mutación de datos de entrada

### 3.2 Constructor de Grafo Canónico

**Responsabilidad:**
- Transformar IR a Grafo Canónico
- Resolver referencias
- Forzar unicidad de identidad
- Construir estructuras de nodos y aristas

**Entrada:** IR parseada

**Salida:** Grafo Canónico

**Restricciones:**
- Ordenamiento determinista
- Construcción inmutable de nodos
- Sin efectos secundarios de validación

### 3.3 Motor de Canonicalización

**Responsabilidad:**
- Normalizar ordenamiento
- Remover ruido irrelevante
- Producir estructura estable
- Calcular hash estructural (opcional)

**Entrada:** Grafo Canónico

**Salida:** Grafo Canónico (normalizado)

**Garantías:** Dos specs semánticamente equivalentes **DEBEN** producir representaciones canónicas idénticas.

### 3.4 Motor de Validación

**Responsabilidad:**
- Validación estructural
- Validación semántica
- Validación de proceso
- Validación de evento
- Validación de versión

**Entrada:** Grafo Canónico

**Salida:** Reporte de Validación

**Restricciones:**
- No debe mutar el grafo
- Debe acumular errores determinísticamente
- No debe ejecutar lógica de diff

### 3.5 Motor de Restricciones

**Responsabilidad:**
- Evaluar restricciones declaradas
- Componer restricciones
- Cortocircuitar cuando sea requerido
- Producir violaciones estructuradas

**Entrada:** Grafo Canónico, Contexto de validación

**Salida:** Violaciones de restricciones

### 3.6 Motor de Diff

**Responsabilidad:**
- Comparar dos Grafos Canónicos
- Detectar diferencias estructurales
- Generar ChangeSet
- Clasificar cambios

**Entrada:** Grafo Canónico antiguo, Grafo Canónico nuevo

**Salida:** ChangeSet determinista

**Garantías:** Entradas idénticas **DEBEN** producir ChangeSets idénticos.

### 3.7 Motor de Versionado

**Responsabilidad:**
- Analizar ChangeSet
- Determinar cambios rompedores
- Validar cumplimiento de versión semántica
- Forzar reglas de incremento

**Entrada:** ChangeSet, Versiones declaradas

**Salida:** Resultado de validación de versión

### 3.8 Motor de Migraciones

**Responsabilidad:**
- Aplicar ChangeSet
- Transformar Grafo Canónico
- Validar resultado
- Asegurar idempotencia

**Entrada:** Grafo Canónico, ChangeSet

**Salida:** Nuevo Grafo Canónico

### 3.9 Motor de Resolución de Eventos

**Responsabilidad:**
- Validar declaraciones de eventos
- Validar tipos de payload de eventos
- Enlazar eventos a transiciones
- Asegurar coherencia entre specs

**Entrada:** Grafo Canónico

**Salida:** Resultado de validación de eventos

### 3.10 Modelo de Errores

**Responsabilidad:**
- Definir estructura de errores
- Garantizar códigos de error estables
- Proporcionar formatos de serialización
- Mantener ordenamiento determinista

**Salida:** Objetos de error estructurados

### 3.11 API de Aplicación

**Responsabilidad:**
- Exponer interfaz programática
- Orquestar motores
- Proporcionar capa de integración estable

Esta API **DEBE**:
- Ser stateless
- Aceptar entradas explícitas
- Retornar salidas estructuradas

### 3.12 Interfaz CLI

**Responsabilidad:**
- Parsear argumentos CLI
- Invocar API de Aplicación
- Formatear salida
- Establecer códigos de salida

CLI **NO DEBE**:
- Contener lógica de negocio
- Implementar reglas de validación
- Implementar lógica de diff

### 3.13 Capa de Rendimiento y Testing

**Responsabilidad:**
- Forzar límites de complejidad
- Definir benchmarks de rendimiento
- Proporcionar hooks de testing de regresión
- Validar determinismo

---

## 4. Contratos de Flujo de Datos

Cada motor **DEBE** respetar contratos de datos estrictos.

### 4.1 Contrato de Grafo Canónico

El Grafo Canónico **DEBE**:
- Ser inmutable
- Tener IDs de nodo estables
- Proporcionar rutas canónicas
- Exponer orden de iteración determinista

Ningún motor puede depender del ordenamiento YAML.

### 4.2 Contrato de ChangeSet

ChangeSet **DEBE**:
- Contener cambios atómicos ordenados
- Clasificar cada cambio
- Incluir rutas canónicas
- Ser reproducible

### 4.3 Contrato de Reporte de Validación

Reporte de Validación **DEBE**:
- Incluir lista de errores ordenada
- Incluir severidad
- Incluir ruta canónica
- Incluir código de error
- Ser serializable a JSON

---

## 5. Reglas de Interacción de Motores

**Interacciones permitidas:**
- Parser → Constructor de Grafo
- Constructor de Grafo → Canonicalización
- Canonicalización → Validación
- Validación → CLI
- Canonicalización → Diff
- Diff → Versionado
- Diff → Migración

**Interacciones prohibidas:**
- CLI mutando directamente el Grafo
- Validación invocando Diff implícitamente
- Migración modificando la instancia original del Grafo
- Diff leyendo YAML raw

---

## 6. Requisitos de Ordenamiento Determinista

El sistema **DEBE** asegurar ordenamiento determinista para:
- Entidades
- Propiedades
- Procesos
- Estados
- Transiciones
- Eventos
- Errores
- Entradas de ChangeSet

El ordenamiento **DEBE** ser lexicográficamente estable a menos que se defina lo contrario.

---

## 7. Modelo de Concurrencia

A menos que esté explícitamente implementado:
- El motor **DEBERÍA** operar en un solo hilo.
- La paralelización **NO DEBE** romper el determinismo.
- El estado mutable compartido está prohibido.

---

## 8. Límites de Extensibilidad

Las extensiones **PUEDEN** incluir:
- Nuevas reglas de validación
- Nuevos tipos de restricciones
- Nuevos generadores de artefactos
- Nuevos comandos CLI

Las extensiones **NO DEBEN**:
- Alterar la semántica del Grafo Canónico
- Modificar códigos de error existentes
- Cambiar reglas de clasificación de diff

---

## 9. Objetivos No Incluidos

La arquitectura **NO** define:
- Implementación de persistencia
- Ejecución runtime de lógica de negocio
- Generación de esquema de base de datos
- Estrategia de despliegue

Estos son externos al motor RIGOR.

---

## 10. Requisitos de Cumplimiento

Una implementación es compatible si:
1. Todos los módulos existen lógicamente (aunque estén combinados físicamente)
2. Los contratos de datos son respetados
3. El determinismo está garantizado
4. El Grafo Canónico es inmutable
5. Diff y Versionado se integran correctamente

La organización física del código **PUEDE** variar, pero la separación lógica **DEBE** existir.

---

## 11. Resumen

La arquitectura de RIGOR es:
- Por capas
- Determinista
- Centrada en grafos
- Consciente de la evolución
- Estrictamente modular

Los documentos subsiguientes definen cada módulo en profundidad técnica.
