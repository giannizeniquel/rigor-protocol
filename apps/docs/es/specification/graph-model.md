# Modelo de Grafo para Validación (v0.1)

El Modelo de Grafo de RIGOR (GMV) define la representación interna formal de las especificaciones durante la validación. Permite análisis determinista, resolución de referencias y aplicación estructural.

## 1. Definición Formal

Un Grafo de RIGOR se define como un grafo dirigido y tipado:  
`G = (N, E, Tn, Te, C)`

Donde:
- **N**: Conjunto de Nodos (entidades semánticas).
- **E**: Conjunto de Aristas (relaciones tipadas).
- **Tn**: Tipos de Nodo.
- **Te**: Tipos de Arista.
- **C**: Conjunto de Restricciones.

## 2. Modelo de Nodos

Cada nodo es una entidad inmutable con un ID único globalmente.

### 2.1 Tipos de Nodo
| Tipo | Descripción |
| :--- | :--- |
| **Artifact** | Archivo de especificación raíz. |
| **Module** | Agrupación lógica de entidades. |
| **Entity** | Entidad de dominio de nivel de negocio. |
| **Field** | Atributo o propiedad de una Entidad. |
| **Rule** | Definición de restricción de nivel de negocio. |
| **Constraint** | Regla formal de validación del protocolo. |
| **Relationship** | Asociación explícita entre nodos. |
| **Environment** | Definición de contexto y límite de ejecución. |

## 3. Modelo de Aristas

Las aristas representan relaciones dirigidas y no ambiguas entre nodos.

### 3.1 Tipos de Arista
| Tipo | Significado |
| :--- | :--- |
| **DEFINES** | Artifact declara un Nodo. |
| **BELONGS_TO** | Nodo es parte de un Módulo. |
| **HAS_FIELD** | Entidad contiene un Campo. |
| **REFERENCES** | Un nodo apunta a otro (Referencia cruzada). |
| **DEPENDS_ON** | Dependencia entre Módulos o Entidades. |
| **VALIDATES** | Regla apunta a una Entidad o Campo. |
| **CONSTRAINS** | Restricción del protocolo aplica a un Nodo. |

## 4. Políticas de Ciclos y Conectividad

Para asegurar la ejecución determinista, se aplican las siguientes políticas:

| Tipo de Arista | ¿Ciclos Permitidos? | Nota |
| :--- | :--- | :--- |
| **DEPENDS_ON** | **No** | Debe formar un Grafo Dirigido Acíclico (DAG). |
| **VALIDATES** | **No** | La lógica de validación no debe ser circular. |
| **REFERENCES** | **Sí** | Permite estructuras de datos recursivas. |

## 5. Pipeline de Construcción

El Grafo se construye en una secuencia determinista:
1. **Parse**: Ingiera artefactos fuente.
2. **Normalize**: Estandiza estructura y casing.
3. **Resolve Identity**: Mapea todos los IDs al espacio de nombres global.
4. **Build Graph**: Instancia nodos y aristas.
5. **Freeze**: Hace el grafo inmutable antes de la validación.

## 6. Localización de Errores

Cada error de validación se mapea a la estructura del grafo:
```json
{
  "code": "E_UNREACHABLE_STATE",
  "nodeID": "core.process.state_archived",
  "path": "root -> process -> state_archived",
  "message": "State is defined but unreachable from initial_state."
}
```

## 7. Interacción con CLI

El CLI proporciona herramientas para inspeccionar el grafo interno:
- `rigor graph`: Emite el grafo completo en formato JSON.
- `rigor graph --subgraph=<id>`: Extrae un subgrafo delimitado para análisis aislado.
