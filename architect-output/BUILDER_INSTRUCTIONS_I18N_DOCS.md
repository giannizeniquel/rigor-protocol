# INSTRUCCIONES PARA EL AGENTE BUILDER: Implementación i18n Docs (EN/ES)
**Proyecto:** RIGOR Documentation (docs.rigor.dev)  
**Objetivo:** Soporte multilingüe nativo en VitePress con traducción técnica completa.

---

## 1. Tarea de Configuración (`apps/docs/.vitepress/config.ts`)

Debes reestructurar el archivo de configuración para soportar locales. Sigue este esquema:

```typescript
export default defineConfig({
  // Configuración compartida
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      title: 'RIGOR',
      description: 'AI Constraint Protocol — Normative Specification',
      themeConfig: {
        // Sidebar y Nav en inglés (ya existentes)
      }
    },
    es: {
      label: 'Español',
      lang: 'es',
      link: '/es/',
      title: 'RIGOR',
      description: 'Protocolo de Restricción de IA — Especificación Normativa',
      themeConfig: {
        nav: [
          { text: 'rigor.dev', link: 'https://rigor.dev/es/' },
          { text: 'Especificación', link: '/es/specification/identity-core' },
          { text: 'Implementación', link: '/es/implementation/' }
        ],
        sidebar: {
          '/es/specification/': [
            {
              text: 'Especificación del Protocolo',
              items: [
                { text: 'Núcleo de Identidad', link: '/es/specification/identity-core' },
                { text: 'Modelo del Protocolo', link: '/es/specification/protocol-model' },
                { text: 'Vista General', link: '/es/specification/protocol-overview' },
                { text: 'CLI', link: '/es/specification/cli' },
                { text: 'Diferenciación', link: '/es/specification/differentiation' }
              ]
            },
            {
              text: 'Especificación de Procesos',
              items: [
                { text: 'Núcleo de la Spec', link: '/es/specification/spec-core' },
                { text: 'Referencia de la Spec', link: '/es/specification/spec-reference' },
                { text: 'Eventos', link: '/es/specification/events' },
                { text: 'Versionado', link: '/es/specification/versioning' },
                { text: 'Migraciones', link: '/es/specification/migrations' },
                { text: 'Apéndice de la Spec', link: '/es/specification/spec-appendix' }
              ]
            }
          ],
          '/es/implementation/': [
            {
              text: 'Implementación',
              items: [
                { text: 'Introducción', link: '/es/implementation/' },
                { text: 'Motor de Validación', link: '/es/implementation/validation-engine' },
                { text: 'Codificación de Restricciones', link: '/es/implementation/constraint-encoding' }
              ]
            }
          ]
        }
      }
    }
  }
})
```

---

## 2. Tarea de Estructura de Archivos

Crea la estructura espejo en español:
1. Crea el directorio `apps/docs/es/`.
2. Crea `apps/docs/es/specification/`.
3. Crea `apps/docs/es/implementation/`.
4. Copia todos los archivos `.md` de las carpetas originales a sus respectivas carpetas en `/es/`.

---

## 3. Tarea de Traducción Normativa

Debes traducir **íntegramente** cada archivo. 
**Regla de Oro:** No resumas. Traduce cada sección técnica, ejemplo de código y tabla con precisión.

### Glosario Obligatorio:
- **Constraint Contract** -> Contrato de Restricción
- **Structural Entropy** -> Entropía Estructural
- **Validation Engine** -> Motor de Validación
- **Deterministic** -> Determinístico
- **Backward-Compatible** -> Compatible hacia atrás
- **Breaking Change** -> Cambio rompedor / Incompatible
- **Runtime** -> Tiempo de ejecución

---

## 4. Verificación de Éxito
1. Ejecuta `npm run build --prefix apps/docs`.
2. Verifica que el selector de idioma aparece en la barra de navegación de la documentación.
3. Navega por todas las páginas en español y confirma que no hay enlaces rotos (VitePress avisará si los hay).
4. Asegura que los bloques de código (YAML, JSON, SQL) se mantengan intactos pero sus comentarios explicativos estén en español.

---

**Builder:** Inicia con la reconfiguración del `config.ts` y luego procede archivo por archivo. Mantén el nivel de detalle técnico restaurado en la fase anterior.
