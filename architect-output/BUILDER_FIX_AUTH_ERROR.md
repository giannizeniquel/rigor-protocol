# INSTRUCCIONES PARA EL AGENTE BUILDER: Resolución de Error de Autenticación
**Proyecto:** RIGOR Landing Page  
**Error Detectado:** `✘ [ERROR] Authentication error [code: 10000]` al ejecutar `wrangler pages deploy`.

---

## 1. Análisis Técnico
El comando es ahora correcto, pero el token de API de Cloudflare no tiene permisos para escribir en Pages. 

---

## 2. Acciones Sugeridas

### Opción 1: Despliegue Nativo (Simplificación)
La mejor práctica en Cloudflare Pages es dejar que la plataforma gestione el despliegue tras el build.
1. **Tarea:** Elimina el script de `deploy` del `package.json` o del pipeline de CI. 
2. **Tarea:** Instruye al usuario para que en el Dashboard de Cloudflare configure el **Build Command** como `npm run build` y el **Output Directory** como `dist`.

### Opción 2: Verificación de Entorno (Si se mantiene CLI)
Si el usuario desea mantener el comando CLI en el build log:
1. **Tarea:** El Builder debe verificar si el nombre del proyecto está siendo inferido correctamente. 
2. **Tarea:** Actualiza el comando en el `package.json` para ser explícito con el nombre del proyecto si es necesario:
   `npx wrangler pages deploy ./dist --project-name=rigor-landing`

---

## 3. Recomendación del Arquitecto
Builder, comunica al usuario que el despliegue manual vía `wrangler` dentro del propio entorno de build de Cloudflare es redundante y causa conflictos de permisos. El flujo estándar es:
`GitHub Push -> Cloudflare Build -> Cloudflare Auto-Deploy`.

Elimina el paso de deploy manual del script de build para que Cloudflare Pages complete el ciclo nativamente.
