# INSTRUCCIONES PARA EL AGENTE BUILDER: Preparación para Cloudflare Pages
**Proyecto:** RIGOR Protocol Ecosystem  
**Objetivo:** Configurar scripts de build y verificar salidas para despliegue automático.

---

## 1. Configuración de Scripts en `package.json` (Raíz)

Asegúrate de que Turborepo pueda ejecutar los builds de forma independiente. Verifica o añade estos scripts en la raíz:

```json
{
  "scripts": {
    "build:web": "turbo run build --filter=web",
    "build:docs": "turbo run build --filter=docs"
  }
}
```

---

## 2. Parámetros para la Interfaz de Cloudflare (Guía para el Usuario)

Builder, verifica que estos valores sean los correctos según la arquitectura actual:

### Proyecto A: RIGOR Landing (`rigor.dev`)
- **Root Directory:** `apps/web`
- **Build Command:** `npm run build` (ejecutado dentro de la carpeta del app)
- **Build Output Directory:** `dist`
- **Environment Variables:** `NODE_VERSION: 20`

### Proyecto B: RIGOR Docs (`docs.rigor.dev`)
- **Root Directory:** `apps/docs`
- **Build Command:** `npm run build`
- **Build Output Directory:** `.vitepress/dist`
- **Environment Variables:** `NODE_VERSION: 20`

---

## 3. Optimización de Rendimiento (Headers)

Crea un archivo llamado `_headers` en la carpeta `public` de cada aplicación para mejorar la seguridad y caché:

### En `apps/web/public/_headers`:
```text
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### En `apps/docs/public/_headers`:
(Repetir el mismo contenido)

---

## 4. Verificación de Build Final

Builder, antes de finalizar, ejecuta los siguientes comandos localmente y confirma que las carpetas de salida existen y contienen el HTML generado:
1. `npm run build --filter=web` -> Verifica `apps/web/dist/`
2. `npm run build --filter=docs` -> Verifica `apps/docs/.vitepress/dist/`

---

**Nota para el Usuario:** Una vez que el Builder termine esto, solo tienes que ir a tu dashboard de Cloudflare, darle a "Create a project" -> "Connect to Git" y seguir los pasos con los parámetros de la Sección 2.
