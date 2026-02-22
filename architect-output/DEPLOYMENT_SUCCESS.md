# Registro de Despliegue Exitoso: RIGOR v1.1
**Fecha:** 21 de Febrero, 2026
**Plataforma:** Cloudflare Pages
**Estado:** ONLINE 🟢

---

## 1. Landing Page (Astro)
- **URL Pública:** https://rigor-protocol.pages.dev
- **Repositorio:** `giannizeniquel/rigor-protocol`
- **Configuración de Build:**
  - Root: `apps/web`
  - Command: `npm run build`
  - Output: `dist`

## 2. Documentación (VitePress)
- **URL Pública:** https://rigor-docs.pages.dev
- **Repositorio:** `giannizeniquel/rigor-protocol`
- **Configuración de Build:**
  - Root: `apps/docs`
  - Command: `npm run build`
  - Output: `.vitepress/dist`

---

## 3. Próximos Pasos (Opcionales)
Si adquieres el dominio `rigor.dev`, puedes conectarlo en la sección "Custom Domains" de Cloudflare:
1. Apuntar `rigor.dev` -> Proyecto `rigor-protocol`.
2. Apuntar `docs.rigor.dev` -> Proyecto `rigor-docs`.

¡Gran trabajo de arquitectura e implementación!
