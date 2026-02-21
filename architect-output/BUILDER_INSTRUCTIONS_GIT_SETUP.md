# INSTRUCCIONES PARA EL AGENTE BUILDER: Preparación y Publicación en Git
**Proyecto:** RIGOR Protocol Ecosystem  
**Objetivo:** Inicializar repositorio local y preparar para push a GitHub.

---

## 1. Tarea de Limpieza y Preparación

Antes de inicializar Git, asegúrate de que el entorno esté limpio:
1. Elimina cualquier carpeta `dist/` o `.turbo/` que haya quedado de builds anteriores.
2. Asegúrate de que no existan archivos `.env` con secretos reales (aunque para este proyecto no deberían existir).

---

## 2. Creación del `.gitignore` (Raíz)

Crea un archivo `.gitignore` en la raíz del proyecto con el siguiente contenido normativo:

```text
# Dependencias
node_modules/
.pnp
.pnp.js

# Builds y Artefactos
dist/
.astro/
.vitepress/dist
.vitepress/cache

# Caché de Herramientas
.turbo/
.cache/
.eslintcache

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Entorno y Secretos
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.DS_Store

# Playwright / Tests
test-results/
playwright-report/
blob-report/
playwright/.cache
```

---

## 3. Inicialización del Repositorio Local

Ejecuta los siguientes comandos en la raíz del proyecto:

1. `git init`
2. `git add .`
3. `git commit -m "chore: initial release of RIGOR v1.1 protocol ecosystem"`

---

## 4. Estructura Final del Repositorio (Checklist)

Verifica que la estructura en Git se vea así:
```text
rigor/
├── apps/
│   ├── docs/             # VitePress (EN/ES)
│   └── web/              # Astro Landing (EN/ES)
├── packages/
│   └── design-tokens/    # CSS Variables & Tailwind
├── tests/                # E2E & Accessibility Tests
├── project_brief/        # Borradores normativos originales
├── architect-output/     # Handover & Code Reviews
├── package.json          # Root workspace config
├── turbo.json            # Monorepo pipeline
└── README.md             # Documento de entrada principal
```

---

## 5. Instrucciones para GitHub

Una vez que el commit local esté listo:
1. Crea un nuevo repositorio en GitHub llamado `rigor-protocol` (o el nombre que el usuario prefiera).
2. Agrega el remote: `git remote add origin https://github.com/usuario/rigor-protocol.git`
3. Sube el código: `git push -u origin main`

---

**Builder:** Procede primero con la creación del `.gitignore` y el primer commit local. Informa al usuario cuando estés listo para configurar el remote de GitHub.
