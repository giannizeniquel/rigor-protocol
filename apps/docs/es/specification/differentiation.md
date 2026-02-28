# Diferenciación (v0.1)

La Diferenciación es el proceso normativo de comparar dos especificaciones RIGOR para identificar cambios estructurales y clasificarlos como rompedores o no rompedores. A diferencia de los diffs de texto plano, la diferenciación de RIGOR opera sobre el **Modelo de Grafo** normalizado.

## 1. Alcance

El Motor de Diferenciación DEBE:
* Comparar dos especificaciones RIGOR válidas.
* Ignorar cambios no semánticos (formateo, comentarios, espacios en blanco, orden de campos).
* Clasificar diferencias basándose en invariantes del protocolo.
* Producir salida estructurada determinista.

## 2. Sintaxis CLI (Normativa)

El comando `diff` es una extensión de la gramática formal del CLI.

```ebnf
diff_command    ::= "rigor" SP "diff" SP path SP path diff_opts?
diff_opts       ::= (SP diff_opt)*
diff_opt        ::= "--format=" format_type
                  | "--breaking-only"
                  | "--summary-only"
```

## 3. Contrato de Ejecución

Antes de realizar una diferenciación, el motor DEBE satisfacer estas precondiciones:
1. Parsear y validar ambas especificaciones independientemente.
2. Normalizar ambas en el **Modelo de Grafo**.
3. Si alguna especificación falla la validación (código de salida != 0), el proceso de diff debe abortar con código de salida `3`.

## 4. Reglas de Clasificación (Normativa)

Las diferencias se clasifican determinísticamente basándose en su impacto en la evolución del sistema.

### 4.1 Cambios de Estado
| Cambio | Clasificación |
| :--- | :--- |
| Estado agregado | no rompedor |
| Estado eliminado | **rompedor** |
| Estado renombrado | **rompedor** |
| Estado inicial cambiado | **rompedor** |

### 4.2 Cambios de Transición
| Cambio | Clasificación |
| :--- | :--- |
| Transición agregada | no rompedor |
| Transición eliminada | **rompedor** |
| Transición objetivo cambiada | **rompedor** |
| Condición de guard agregada | **rompedor** |
| Condición de guard eliminada | no rompedor |

### 4.3 Cambios del Esquema de Contexto
| Cambio | Clasificación |
| :--- | :--- |
| Campo opcional agregado | no rompedor |
| Campo requerido agregado | **rompedor** |
| Campo eliminado | **rompedor** |
| Tipo de campo cambiado | **rompedor** |
| Valor por defecto cambiado | no rompedor |

### 4.4 Cambios de Identidad
| Cambio | Clasificación |
| :--- | :--- |
| Nombre de identidad cambiado | **rompedor** |
| Versión de spec incrementada | no rompedor |

---

## 5. Esquema de Salida (`--format=json`)

Cuando se solicite, la salida DEBE ajustarse al siguiente esquema:

```json
{
  "specA": "v0.1.0",
  "specB": "v0.2.0",
  "differences": [
    {
      "type": "breaking | non-breaking",
      "category": "state | transition | context | identity",
      "location": "process.states.active",
      "description": "State removed from process",
      "oldValue": { "id": "active" },
      "newValue": null
    }
  ],
  "summary": {
    "breakingCount": 1,
    "nonBreakingCount": 0
  }
}
```

---

## 6. Códigos de Salida (Normativos)

| Código | Significado | Descripción |
| :--- | :--- | :--- |
| `0` | Sin diferencias | Las especificaciones son semánticamente idénticas. |
| `1` | Solo no rompedor | Se detectaron cambios semánticos, pero se preserva la compatibilidad hacia atrás. |
| `2` | Rompedor encontrado | Se detectaron uno o más cambios rompedores. |
| `3` | Error de validación | Una o ambas especificaciones son inválidas. |
| `4` | Uso incorrecto del CLI | Sintaxis inválida o argumentos faltantes. |

## 7. Visión General del Algoritmo

1. **parse(A, B)** -> ASTs
2. **validate(AST_A, AST_B)** -> Asegurar que ambas sean conformes.
3. **normalize(AST_A, AST_B)** -> Grafos GMV v0.1.
4. **compare(Graph_A, Graph_B)** -> Comparación de nodos/aristas basada en identidad.
5. **classify(diffs)** -> Aplicar reglas de la Sección 4.
6. **emit(result)** -> Retornar datos estructurados y código de salida.
