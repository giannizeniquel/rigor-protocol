# INSTRUCCIONES PARA EL AGENTE BUILDER - Corrección de Contraste CTA

## 1. Contexto
El `VISUAL_IDENTITY_SYSTEM.md` ha sido actualizado a la versión `v0.2` para resolver el problema de contraste de color en los Call to Action (CTAs). La nueva regla establece que el texto principal de los CTAs debe utilizar el color `Controlled White` (`#F2F2F2`) para cumplir con los estándares de accesibilidad WCAG 2 AA. El color de acento (`Deep Blue — #1E3A8A`) se reservará para elementos no textuales o estados como subrayados, bordes o estados de hover.

Los tokens de diseño existentes ya definen ambos colores (`text-primary` para blanco y `accent` para el azul profundo), por lo que no es necesario modificar los archivos del paquete `design-tokens`. La corrección se realizará directamente en los componentes de Astro.

## 2. Tareas a Realizar

### 2.1. Identificar Componentes CTA
*   **Acción:** Revisa los componentes de Astro en `apps/web/src/components/` que implementan CTAs. El componente principal identificado previamente es el **Hero.astro**, pero podría haber otros si se han añadido.

### 2.2. Modificar Estilo del Texto CTA
*   **Acción:** En cada componente que contenga un CTA, modifica el color del texto principal del CTA para que utilice `text-primary` (que corresponde a `#F2F2F2`) en lugar de `accent`.
    *   **Ejemplo de cambio:**
        *   **Antes:** `<a class="cta text-accent">...</a>`
        *   **Después:** `<a class="cta text-primary">...</a>`

### 2.3. Aplicar Color de Acento para Elementos No Textuales
*   **Acción:** Si el CTA requiere el color de acento (`Deep Blue — #1E3A8A`) para elementos visuales como subrayados, bordes o fondos en estado de `hover`, asegúrate de que estos elementos apliquen el color `accent` (por ejemplo, `border-b-accent`, `hover:text-accent`, etc.) y no el texto principal.

### 2.4. Verificación Local
*   **Acción:** Una vez realizados los cambios, levanta el servidor de desarrollo (`npm run dev`) y verifica visualmente en el navegador que el texto de los CTAs ahora sea blanco y que el color de acento se utilice únicamente para elementos decorativos o estados.

## 3. Criterios de Éxito
*   Todos los textos principales de los CTAs en la aplicación web utilizan `Controlled White` (`#F2F2F2`).
*   El color de acento (`Deep Blue — #1E3A8A`) se utiliza solo para subrayados, bordes, o efectos de `hover` en los CTAs, y no como color de texto principal.
*   La aplicación web (`rigor.dev`) se visualiza correctamente en el navegador sin errores.
