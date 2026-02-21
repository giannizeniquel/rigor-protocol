# INSTRUCCIONES PARA EL AGENTE BUILDER: Implementación i18n (EN/ES)
**Proyecto:** RIGOR Landing Page (rigor.dev)  
**Objetivo:** Soporte multilingüe estático (Inglés/Español) con Zero JavaScript.

---

## 1. Restricciones Críticas (Invariantes)
1. **Zero JavaScript:** No se permite el uso de librerías de i18n que dependan de hooks o estado en el cliente (ej. `nanostores`). Se debe usar el sistema de enrutamiento estático de Astro.
2. **Tono Narrativo:** Las traducciones al español deben seguir el `NARRATIVE_SYSTEM.md`. Prohibido el uso de palabras de marketing ("fácil", "rápido", "revolucionario").
3. **Estructura de Rutas:** 
   - Inglés (Default): `/`
   - Español: `/es/`

---

## 2. Tareas de Configuración

### 2.1 Actualizar `astro.config.mjs`
Configura el soporte nativo de i18n de Astro 4.0+:
```javascript
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
        prefixDefaultLocale: false
    }
  },
  // ... resto de la configuración
});
```

### 2.2 Crear Sistema de Diccionarios
Crea el archivo `apps/web/src/i18n/ui.ts` para centralizar las cadenas de texto:
- Exporta un objeto `languages` con los nombres de los idiomas.
- Exporta un objeto `ui` con las traducciones.
- **Importante:** Utiliza la terminología técnica definida en los borradores originales (ej: "Structural Entropy" -> "Entropía Estructural").

---

## 3. Refactorización de Componentes

### 3.1 Layout Base (`apps/web/src/layouts/Layout.astro`)
- Detecta el locale actual usando `Astro.currentLocale`.
- Actualiza el atributo `lang` en la etiqueta `<html>`.
- Implementa etiquetas `hreflang` en el `<head>` para SEO.

### 3.2 Extracción de Contenido en Componentes
Refactoriza todos los componentes en `apps/web/src/components/` para que consuman el diccionario:
- `Hero.astro`
- `StructuralCondition.astro`
- `StructuralEntropy.astro`
- `ProtocolModel.astro`
- `CoreInvariants.astro`
- `StructuralPositioning.astro`
- `ConceptualTerritory.astro`
- `ProtocolVsPrompt.astro`
- `SpecificationAccess.astro`
- `Footer.astro`

### 3.3 Selector de Idioma (Footer)
Añade un selector de idioma minimalista en el `Footer.astro`:
- Debe ser un enlace estático puro: `<a href="/es/">ES</a>` o `<a href="/">EN</a>`.
- Estilo: Texto muted (`var(--color-text-muted)`), sin iconos innecesarios.

---

## 4. Traducciones Normativas (Guía de Referencia)

| Inglés | Español (Normativo) |
| :--- | :--- |
| AI Constraint Protocol | Protocolo de Restricción de IA |
| Formal boundaries for AI-generated systems | Límites formales para sistemas generados por IA |
| Structural Acceleration | Aceleración Estructural |
| Structural Entropy | Entropía Estructural |
| Core Invariants | Invariantes Base |
| Explicitness | Explicidad |
| Determinism | Determinismo |
| Classified Evolution | Evolución Clasificada |
| Validation Before Execution | Validación Previa a la Ejecución |
| Separation of Layers | Separación de Capas |
| Access Specification | Acceder a la Especificación |

---

## 5. Verificación de Éxito
1. Ejecuta `npm run build` y verifica que se genera la carpeta `dist/es/`.
2. Valida que el tamaño de los assets de JS en el cliente siga siendo **0 bytes**.
3. Verifica que al navegar a `/es/` todo el contenido (incluyendo tablas y diagramas) esté traducido correctamente.
4. Confirma que el tono en español sea puramente declarativo.

---

**Builder:** Procede con la implementación siguiendo este orden. No realices cambios estéticos fuera de lo especificado.
