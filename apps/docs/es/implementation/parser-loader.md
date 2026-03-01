# Parser y Loader (v0.1)

## 1. Propósito

El Parser y Loader es responsable de transformar archivos de especificación crudos en una representación intermedia estructurada (IR).

Es el único módulo que interactúa directamente con formatos de archivo externos.

**NO DEBE** realizar validación semántica ni ejecución de reglas de negocio.

---

## 2. Responsabilidades

El Parser y Loader **DEBE**:

1. Leer archivos de especificación fuente
2. Validar sintaxis YAML
3. Validar codificación
4. Normalizar estructuras de datos básicas
5. Producir una Representación Intermedia (IR) determinista
6. Detectar anomalías estructurales a nivel de sintaxis

**NO DEBE**:
- Resolver referencias semánticas
- Construir estructuras de grafo
- Validar restricciones
- Ejecutar lógica de diff
- Mutar datos después de la generación de IR

---

## 3. Formato de Entrada Soportado

### 3.1 Formato Primario

El formato primario soportado es:

**YAML (codificado en UTF-8)**

### 3.2 Requisitos de Codificación

- La entrada **DEBE** ser UTF-8 válido
- BOM **DEBE** ser ignorado si está presente
- Codificación inválida **DEBE** producir un error de parseo fatal

### 3.3 Restricciones YAML

El parser **DEBE** enforces:
- Sin claves de mapeo duplicadas
- Sin coerción de tipo implícita más allá del estándar YAML
- Sin anclas o alias a menos que estén explícitamente soportados
- Sin tags ejecutables

Si se encuentran características YAML no soportadas, el parser **DEBE** fallar determinísticamente.

---

## 4. Representación Intermedia (IR)

La salida del Parser y Loader es una Representación Intermedia (IR).

La IR **DEBE**:
- Representar mapeos como estructuras clave-valor ordenadas
- Representar secuencias como listas ordenadas
- Preservar valores escalares como primitivos tipados
- Excluir comentarios
- Preservar la jerarquía original de la estructura

La IR **DEBE** ser:
- Determinista
- Independiente del formateo del archivo
- Independiente del orden de claves en la fuente

---

## 5. Validación Estructural en Etapa de Parseo

El Parser y Loader **PUEDE** realizar validación estructural limitada a:
- Validación de tipo a nivel raíz (ej., debe ser mapeo)
- Presencia de claves obligatorias a nivel superior (opcional, definido por implementación)
- Detección de tipos escalares ilegales

**NO DEBE** validar:
- Integridad referencial
- Estructura de Proceso
- Estructura de Evento
- Semántica de Restricciones
- Reglas de Versionado

Toda validación semántica pertenece al Motor de Validación.

---

## 6. Manejo de Claves Duplicadas

Claves duplicadas dentro del mismo mapeo:
- **DEBEN** resultar en un error fatal
- **DEBEN** incluir información de ubicación canónica
- **DEBEN** ser deterministas en el orden de reporte

La sobrescritura silenciosa está prohibida.

---

## 7. Reglas de Normalización

El Parser y Loader **DEBE** normalizar:
- Fin de líneas
- Espacios en blanco escalares (sin trim a menos que se especifique)
- Representación numérica (preservar tipo numérico)
- Representación booleana (solo true/false)

**NO DEBE**:
- Reordenar mapeos
- Reordenar secuencias
- Inyectar valores por defecto

La inyección de valores por defecto está prohibida en esta etapa.

---

## 8. Integración con Modelo de Errores

Los errores de parseo **DEBEN**:
- Usar códigos de error estables
- Incluir ubicación del archivo (línea y columna si está disponible)
- Ser categorizados como fatales
- Prevenir procesamiento adicional

El Parser **DEBE** detenerse en errores fatales.

---

## 9. Requisitos de Determinismo

Dada una fuente de entrada idéntica:
- La IR **DEBE** ser idéntica
- La salida de errores **DEBE** ser idéntica
- El orden **DEBE** ser estable

Dado YAML sintácticamente diferente pero semánticamente equivalente:
- La IR **PUEDE** diferir
- La equivalencia canónica se enforces posteriormente

---

## 10. Soporte Multi-Archivo (Si Está Implementado)

Si se soporta carga multi-archivo:
- El orden de resolución de archivos **DEBE** ser determinista
- Los mecanismos de include/import **DEBEN** estar explícitamente definidos
- La inclusión circular **DEBE** ser detectada
- La inclusión **DEBE** producir una IR fusionada única

Si no está soportado, la implementación **DEBE** rechazar explícitamente entradas multi-archivo.

---

## 11. Consideraciones de Seguridad

El Parser **DEBE**:
- Deshabilitar carga de recursos remotos
- Deshabilitar tags de ejecución de código
- Evitar inclusión arbitraria de archivos
- Proteger contra ataques de expansión de entidades

El Parser **DEBE** ser seguro contra payloads YAML maliciosos.

---

## 12. Restricciones de Memoria y Tamaño

La implementación **DEBERÍA** definir:
- Tamaño máximo de archivo
- Profundidad máxima de anidamiento
- Tamaño máximo de mapeo
- Tamaño máximo de secuencia

Exceder los límites **DEBE** producir fallo determinista.

---

## 13. Contrato de Salida

El Parser y Loader **DEBE** salida:

```
RepresentaciónIntermedia {
  raíz: NodoMapeo
  metadatos: {
    ruta_fuente
    checksum (opcional)
  }
}
```

La estructura interna exacta **PUEDE** variar, pero la equivalencia lógica **DEBE** mantenerse.

---

## 14. Integración con Siguiente Etapa

La IR producida por este módulo es la única entrada para:

**Constructor de Grafo Canónico**

Ningún otro módulo puede consumir YAML raw.

---

## 15. Objetivos No Incluidos

El Parser y Loader **NO**:
- Construye Grafo Canónico
- Valida lógica de negocio
- Ejecuta diff
- Evalúa restricciones
- Genera artefactos

Su único propósito es el parseo sintáctico y la normalización segura.

---

## 16. Criterios de Cumplimiento

Una implementación es compatible si:
- Rechaza YAML inválido determinísticamente
- Rechaza claves duplicadas
- Produce IR estable
- No realiza validación semántica
- Ejecuta restricciones de codificación

---

## 17. Resumen

El Parser y Loader es:
- Determinista
- Estricto
- No-semántico
- Inmutable en salida
- Endurecido en seguridad

Prepara datos estructurados para la construcción del Grafo Canónico.
