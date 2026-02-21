# INSTRUCCIONES PARA EL AGENTE BUILDER: Corrección de Error de Despliegue
**Proyecto:** RIGOR Landing Page  
**Error Detectado:** `✘ [ERROR] Missing entry-point to Worker script or to assets directory` al ejecutar `wrangler deploy`.

---

## 1. Análisis de la Situación
El build de Astro termina correctamente, pero el comando de despliegue manual de Wrangler falla porque no tiene referencia a la carpeta `dist`. En Cloudflare Pages, el despliegue es automático si se configura la carpeta de salida, pero si se prefiere usar Wrangler CLI, el comando debe ser explícito.

---

## 2. Acciones de Corrección

### Opción A: Despliegue Automático (Recomendado para Cloudflare Pages)
Si el usuario está usando el panel de Cloudflare Pages conectado a Git:
1. **Acción:** Asegúrate de que el comando de build en Cloudflare sea simplemente `npm run build` (o el script de turbo correspondiente) y que el "Build output directory" esté configurado como `dist`.
2. **Eliminación:** Elimina cualquier script de "deploy" personalizado que intente ejecutar `wrangler deploy` en el pipeline de build de Cloudflare.

### Opción B: Configuración de Wrangler (Si se requiere despliegue por CLI)
Si es imperativo usar Wrangler CLI para el despliegue, crea el archivo de configuración faltante:

1. **Crear `apps/web/wrangler.jsonc`:**
```json
{
  "name": "rigor-landing",
  "compatibility_date": "2026-02-21",
  "pages_build_output_dir": "./dist"
}
```

2. **Actualizar el comando en el pipeline:**
Si el comando se ejecuta por CLI, cámbialo a:
`npx wrangler pages deploy ./dist` (Nótese el comando `pages deploy`, no solo `deploy`).

---

## 3. Tarea para el Builder
1. Revisa si existe un archivo de configuración de CI (como `.github/workflows`) o si el comando de deploy está en el `package.json`.
2. Si el comando `npx wrangler deploy` está en un script de `package.json`, corrígelo a `npx wrangler pages deploy ./dist`.
3. Verifica la existencia de `wrangler.jsonc` en la raíz de `apps/web`.

---

**Builder:** Ejecuta la corrección y valida localmente que el comando `npx wrangler pages deploy --dry-run` no devuelva errores de "missing entry-point".
