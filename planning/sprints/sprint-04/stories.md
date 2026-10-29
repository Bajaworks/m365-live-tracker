---
generated_by_model: 'gpt-6'
generated_at: '2026-10-24T16:09:17Z'
agent_roles: 'project-management-senior-project-manager + engineering-technical-writer'
vision_command: 'continue_sprint --sprint 4'
sprint_number: 4
source_spec_kit: 'spec-kit/input/'
---

# Sprint 4 — Historias

Los criterios de aceptación completos están en `spec-kit/input/stories.md`.

- **ST-19** — Ajuste de intención con la matriz de frases
- **ST-20** — Despliegue en bajaworks
- **ST-21** — Guion de la demo, slide deck y plan B
- **ST-22** — README, licencia y verificación de marcas

## Ampliación de ST-21 — Slide deck (T-007)

Incorporada por petición del autor el 2026-10-24. Complementa los criterios del Spec Kit para esta historia.

- Entregar PowerPoint editable (`.pptx`) y exportación PDF, en español y formato 16:9, para profesionales de TI y desarrolladores de SharePoint.
- Seguir los seis bloques y tiempos de `apps/satisfaction-survey/docs/demo-script.md`, dejando tiempo para la demo y las preguntas dentro de los 60 minutos.
- Cubrir concepto, caso de satisfacción, arquitectura y flujo de datos, herramientas y parámetros, construcción y despliegue, diagnóstico con `-developer on`, limitaciones y recursos.
- Incluir notas del presentador en cada diapositiva del PPTX: qué decir, mensajes clave, tiempo estimado y, cuando corresponda, pasos de la demo y señales de transición al Workbench, VS Code, Copilot real o al plan B. Las notas deben poder usarse como guía durante la sesión y estar alineadas con `docs/demo-script.md`.
- Usar capturas verificadas de T-004 para el respaldo de encuesta, tablero y diagnóstico. Se puede preparar el deck antes de recibirlas; T-007 no se cierra con marcadores pendientes.
- Mantener datos ficticios de Contoso y evitar tenant, personas o marcas reales en la versión publicable. El material privado del evento permanece en `refdocs/event/`.
- Verificar las afirmaciones sobre preview, versiones y licencias contra documentación oficial vigente al producir el deck; distinguir los hallazgos observados de las condiciones oficiales del producto.
- Revisar visualmente todas las diapositivas y el PDF: sin recortes ni superposiciones, código y diagramas legibles por Teams, enlaces válidos y notas accesibles en la vista del presentador.
- Incorporar el deck a los ensayos y registrar duración, cambios y aprobación de contenido por el autor antes de cerrar T-007.
