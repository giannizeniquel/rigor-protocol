# INSTRUCCIONES PARA EL AGENTE DE TESTING

## Rol del Agente
Tu rol es implementar la estrategia de testing definida en `architect-output/TESTING_PLAN.md`. Deberás crear y ejecutar las suites de pruebas necesarias para verificar la conformidad del proyecto con las especificaciones.

## Documentos de Referencia
*   **Plan de Testing:** `architect-output/TESTING_PLAN.md` (Contiene la estrategia, alcance, metodologías y herramientas recomendadas).
*   **Revisión de Código:** `architect-output/CODE_REVIEW_REPORT.md` (Para entender las correcciones y áreas de enfoque previas).
*   **Plan de Implementación:** `architect-output/IMPLEMENTATION_PLAN.md` (Para referencia del avance del proyecto).

## Tareas a Realizar

### Fase 1: Configuración del Entorno de Testing
1.  **Instalar herramientas de Testing:** Instala Playwright y los navegadores necesarios. Configura la integración de `axe-core` con Playwright.
2.  **Configurar Lighthouse CI:** Establece Lighthouse CI para el monitoreo de rendimiento.

### Fase 2: Implementación de Pruebas End-to-End (E2E)
1.  **E2E de Navegación:** Crea pruebas E2E para verificar la navegación principal y los Call to Action (CTAs) en `rigor.dev`.
2.  **E2E de Documentación:** Implementa pruebas E2E para la navegación clave en `docs.rigor.dev`.
3.  **Verificación de Enlaces:** Desarrolla pruebas para detectar enlaces rotos en ambos sitios.

### Fase 3: Implementación de Pruebas de Regresión Visual
1.  **Regresión Visual de Landing:** Escribe pruebas de regresión visual para las secciones y componentes clave de `rigor.dev`.
2.  **Regresión Visual de Docs:** Implementa pruebas de regresión visual para las páginas importantes de la documentación.
3.  **Establecer Baselines:** Establece las capturas de pantalla de base para las comparaciones visuales.

### Fase 4: Implementación de Pruebas de Accesibilidad
1.  **Integración Axe-core:** Asegúrate de que las comprobaciones automatizadas de `axe-core` se ejecuten como parte de la suite de pruebas E2E.
2.  **Preparación para Revisión Manual:** Documenta los pasos para realizar una revisión manual de accesibilidad.

### Fase 5: Implementación de Monitoreo de Rendimiento
1.  **Configurar Lighthouse CI:** Define presupuestos de rendimiento en Lighthouse CI.
2.  **Integrar en CI/CD:** Asegúrate de que Lighthouse CI se ejecute como parte del proceso de CI/CD.

### Fase 6: Verificación de Contenido y Narrativa
1.  **Proceso de Auditoría Manual:** Desarrolla y ejecuta un proceso para auditar manualmente el contenido contra `RIGOR-LANDING-CONTENT.md` y `NARRATIVE_SYSTEM.md`. (Considera herramientas de linting de texto si son viables).

## Reporte de Resultados
Deberás reportar los resultados de todas las pruebas. Para las pruebas automatizadas, los fallos deben ser claros y proporcionar feedback accionable. Los hallazgos de las auditorías manuales deben documentarse de forma concisa y clara.

## Criterios de Éxito
Todas las pruebas automatizadas deben pasar. Las auditorías manuales no deben encontrar desviaciones críticas de las especificaciones de contenido, narrativa y visual.
