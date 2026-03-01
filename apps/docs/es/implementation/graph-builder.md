# Constructor de Grafo Canónico (v0.1)

El Constructor de Grafo Canónico es el motor estructural central de RIGOR. Transforma la Representación Intermedia (IR) en un grafo dirigido, inmutable y completamente resuelto que sirve como la única fuente de verdad para todas las operaciones posteriores.

## 1. Propósito

El objetivo principal de este módulo es desacoplar la naturaleza jerárquica de YAML/IR de la naturaleza relacional del protocolo. Al construir un **Grafo Canónico**, RIGOR asegura que:
- Las referencias se resuelvan en aristas (edges) directas.
- Las identidades sean únicas y direccionables globalmente.
- El sistema opere sobre un modelo estable independiente del orden de los archivos fuente.

## 2. Principios Fundamentales

Un Grafo Canónico conforme **DEBE** ser:
1. **Determinista**: Entradas de IR idénticas **DEBEN** producir estructuras de grafo idénticas.
2. **Inmutable**: Una vez finalizado (Fase 5), la instancia del grafo **NO DEBE** ser modificada.
3. **Consistente en Identidad**: Cada nodo **DEBE** tener un identificador único y una ruta canónica estable.
4. **Completamente Resuelto**: No se permiten referencias colgantes en un grafo válido.

## 3. Modelo Conceptual

### 3.1 Nodos
Un Nodo representa una entidad semántica (Proceso, Estado, Evento, etc.). Contiene:
- **Node ID**: Un identificador interno estable.
- **Tipo**: Fuertemente tipado (ej., `NodeType.STATE`).
- **Atributos**: Un mapa de valores primitivos tipados.
- **Ruta Canónica**: Una dirección única legible por humanos (ej., `/processes/Order/states/PENDING`).

### 3.2 Aristas (Edges)
Una Arista representa una relación dirigida entre dos nodos.
- **Origen/Destino**: IDs de los nodos conectados.
- **Tipo**: Define la naturaleza del enlace (ej., `DEFINES`, `TRANSITIONS_TO`, `REFERENCES`).

## 4. Fases de Construcción del Grafo

El Constructor **DEBE** ejecutar las siguientes fases en secuencia:

### Fase 1: Inicialización de Raíz
Crear el nodo raíz e inicializar los registros globales para la resolución de identidad y rutas.

### Fase 2: Creación de Nodos Estructurales
Iterar a través de la IR para crear nodos para todas las secciones de nivel superior y estructuras anidadas. En esta etapa, los nodos se instancian, pero las aristas pueden no existir todavía.

### Fase 3: Registro de Identidad
Registrar todos los nodos que poseen identidad (Entidades, Procesos, Estados, Eventos). Si se detecta un identificador duplicado dentro del mismo alcance, el Constructor **DEBE** lanzar un error fatal y detener la construcción.

### Fase 4: Resolución de Referencias
Transformar las cadenas de identificadores en aristas dirigidas entre nodos. El Constructor **DEBE** detectar referencias circulares y validar que todos los destinos existan.

### Fase 5: Finalización y Congelamiento
Finalizar las rutas canónicas, aplicar un ordenamiento lexicográfico determinista a todas las colecciones y marcar el grafo como inmutable.

## 5. Ordenamiento Determinista

El Constructor **DEBE** asegurar que el orden de iteración de los nodos, aristas y atributos sea estable. El ordenamiento **DEBE** ser independiente del orden de la fuente YAML y debe ser, por defecto, un ordenamiento lexicográfico por identificador o ruta canónica.

## 6. Manejo de Errores

Los errores durante la construcción (ej., IDs duplicados, referencias no resueltas) **DEBEN**:
- Incluir la **Ruta Canónica** donde ocurrió el error.
- Usar códigos de error estables (ej., `ERR_GRAPH_DUPLICATE_ID`).
- Prevenir que el grafo sea marcado como "Finalizado".

## 7. Recorrido y Acceso

El Grafo **DEBE** soportar:
- Búsqueda por Node ID y Ruta Canónica.
- Búsqueda en Profundidad (DFS) y Búsqueda en Anchura (BFS) deterministas.
- Iteración segura sobre todos los nodos de un tipo específico.

## 8. Criterios de Cumplimiento

Una implementación es conforme a RIGOR si:
- Produce grafos idénticos para especificaciones semánticamente equivalentes.
- Impone una unicidad de identidad estricta.
- Garantiza la inmutabilidad del grafo después de la construcción.
- Resuelve correctamente todas las referencias internas.

---
*Nota: El Grafo Canónico es la entrada obligatoria para los motores de Validación, Diff y Migración.*
