# RIGOR

# Implementación

## Modelo de Errores (Normativo – v0.1)

Estado: Normativo
Alcance: Define la taxonomía de errores unificada, estructura, ciclo de vida, formato de serialización y garantías de determinismo en todos los motores de RIGOR.

Este documento establece un modelo de errores único, estable y versionado utilizado por:

* Parser & Loader
* Constructor de Grafo Canónico (Graph Builder)
* Motor de Canonicalización
* Motor de Validación
* Motor de Restricciones
* Motor de Diff
* Motor de Versionado
* Motor de Migraciones
* Motor de Resolución de Eventos
* Capa de CLI

---

# 1. Propósito

El Modelo de Errores asegura:

* Consistencia estructural de todos los errores
* Ordenamiento determinista
* Códigos de error estables
* Serialización predecible
* Evolución segura entre versiones

Todos los motores DEBEN emitir errores conformes con este modelo.

---

# 2. Taxonomía de Errores

Los errores se clasifican en categorías de nivel superior:

* PARSER
* GRAPH
* CANONICALIZATION
* VALIDATION
* CONSTRAINT
* DIFF
* VERSION
* MIGRATION
* EVENT
* CLI
* INTERNAL

Cada categoría DEBE estar bajo un espacio de nombres (namespaced).

---

# 3. Modelo de Códigos de Error

Cada error DEBE tener un código estable:

```
RIGOR-<CATEGORÍA>-<NNN>
```

Ejemplos:

* RIGOR-PARSER-001
* RIGOR-VALIDATION-014
* RIGOR-VERSION-003

Reglas:

* Los códigos DEBEN ser inmutables una vez lanzados
* Los códigos NO DEBEN cambiar su significado semántico
* Los códigos eliminados DEBEN ser marcados como obsoletos (deprecated), no reutilizados
* La lista de códigos DEBE estar versionada

---

# 4. Esquema Base de Error

Todos los errores DEBEN ajustarse a:

```
RigorError {
    code: string
    category: string
    message: string
    path?: CanonicalPath
    metadata?: object
}
```

Restricciones:

* `code` DEBE seguir el formato con espacio de nombres
* `category` DEBE coincidir con la taxonomía
* `message` DEBE ser determinista y estático
* `path` DEBE ser canónico si está presente
* `metadata` NO DEBE afectar al determinismo

---

# 5. Modelo de Severidad

Niveles de severidad:

* error
* warning
* fatal (reservado para fallos internos)

La severidad NO DEBE alterar la estructura del error.

Mapeo:

* Fallos de validación → error
* Avisos de restricciones → warning
* Caída interna del motor → fatal

---

# 6. Ordenamiento Determinista

Todas las colecciones de errores DEBEN estar ordenadas por:

1. categoría (lexicográfico)
2. ruta (lexicográfico, si está presente)
3. código (lexicográfico)

Si la ruta está ausente, DEBE tratarse como una cadena vacía para el ordenamiento.

Entradas idénticas DEBEN producir un ordenamiento de errores idéntico.

---

# 7. Extensiones Específicas del Motor

Los motores PUEDEN extender el modelo base de errores con envoltorios tipados, pero la serialización DEBE ajustarse a `RigorError`.

Ejemplo de extensión:

```
VersionViolation extiende RigorError {
    expectedBump: string
    declaredBump: string
}
```

Sin embargo, la salida JSON DEBE aplanarse en el esquema base con metadatos.

---

# 8. Errores Fatales

Los errores fatales representan:

* Corrupción de estado interno irrecuperable
* Incumplimiento de invariante del grafo
* Fallo en el pipeline de ejecución

Los errores fatales DEBEN:

* Detener la ejecución inmediatamente
* Producir un código de salida > 10
* No producir resultados parciales

Los errores fatales DEBEN seguir serializándose bajo el esquema base.

---

# 9. Manejo de Múltiples Errores

Los motores DEBEN:

* Acumular errores cuando sea seguro
* Evitar fallos en cascada
* Evitar duplicar errores equivalentes

La agregación parcial DEBE permanecer determinista.

---

# 10. Reglas de Mensajes de Error

Los mensajes DEBEN:

* Ser estables entre versiones a menos que sea un cambio de ruptura
* Evitar valores dinámicos de tiempo de ejecución
* Evitar marcas de tiempo
* Evitar direcciones de memoria
* Evitar formateos no deterministas

Permitido:

* Inserción de ruta canónica
* Nombres de atributos estables
* IDs de restricciones estables

---

# 11. Localización

El idioma normativo de los mensajes de error es el inglés.

Se PUEDE implementar la localización, pero:

* Los códigos de error DEBEN permanecer sin cambios
* El JSON del CLI DEBE emitir el mensaje canónico en inglés
* La localización DEBE ocurrir solo en la capa de presentación

---

# 12. Integración con el CLI

El CLI DEBE serializar los errores:

## Modo Texto

Formato estructurado legible por humanos:

```
[ERROR] RIGOR-VALIDATION-003
Ruta: /processes/order/states/approved
Mensaje: El objetivo de la transición de estado no existe.
```

## Modo JSON

```json
{
  "status": "invalid",
  "errors": [
    {
      "code": "RIGOR-VALIDATION-003",
      "category": "VALIDATION",
      "message": "...",
      "path": "...",
      "metadata": {}
    }
  ]
}
```

No se permiten claves adicionales.

---

# 13. Compatibilidad hacia Atrás

Cambios en el modelo de errores:

* Añadir nuevos códigos → versión minor
* Eliminar códigos → versión major
* Cambiar la semántica del mensaje → versión major
* Añadir campos de metadatos → versión minor (si son opcionales)

Los cambios de ruptura DEBEN seguir SemVer.

---

# 14. Consistencia entre Motores

Todos los motores DEBEN:

* Usar el mismo esquema base
* Usar nombres de categoría estables
* Evitar códigos conflictivos
* Evitar significados semánticos superpuestos

DEBE existir un registro central de errores.

---

# 15. Errores Internos

La categoría INTERNAL DEBE usarse solo para:

* Estado inesperado
* Violación de invariante
* Error de implementación (bug)

Los errores internos DEBEN:

* Ser deterministas en su clasificación
* Evitar exponer detalles sensibles del tiempo de ejecución

Las trazas de pila (stack traces) PUEDEN mostrarse solo en modo debug.

---

# 16. Ciclo de Vida del Error

Ciclo de vida del error:

1. Detectado en el motor
2. Envuelto en RigorError
3. Añadido a la colección ordenada
4. Devuelto al llamador
5. Serializado por el CLI

Los errores NO DEBEN ser mutados después de su creación.

---

# 17. Garantías de Agregación

Si múltiples motores producen errores:

* Los errores DEBEN fusionarse
* El ordenamiento global DEBE reaplicarse
* Ningún motor puede sobrescribir el error de otro

La agregación DEBE permanecer estable.

---

# 18. Criterios de Conformidad

Una implementación es conforme si:

* Todos los errores se ajustan al esquema base
* Los códigos son estables y tienen espacio de nombres
* El ordenamiento es determinista
* La serialización coincide con la especificación
* Los errores fatales detienen la ejecución

---

# 19. Resumen

El Modelo de Errores:

* Unifica el reporte de errores de todos los motores
* Garantiza la estructura y el ordenamiento deterministas
* Impone códigos de error estables y versionados
* Habilita la integración con el CLI y el procesamiento por máquinas
* Preserva la compatibilidad hacia atrás entre lanzamientos
