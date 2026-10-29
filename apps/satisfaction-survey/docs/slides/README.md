---
generated_by_model: 'gpt-6'
generated_at: '2026-10-24T16:46:30Z'
agent_roles: 'engineering-technical-writer'
vision_command: 'continue_sprint --sprint 4'
sprint_number: 4
task_id: 'T-007'
---

# Slide deck de Microsoft 365 Live 2026

Versión de trabajo en español, 16:9, con 18 diapositivas para los seis bloques del [guion de 60 minutos](../demo-script.md).

- [PowerPoint editable](copilot-ux-components-m365live2026-v1.pptx): incluye notas del presentador en cada diapositiva. En PowerPoint, abrir el panel **Notas** para editarlas y usar **Vista del moderador** durante la sesión.
- [PDF de las diapositivas](copilot-ux-components-m365live2026.pdf): copia visual para consulta, con páginas rasterizadas. Las notas están en el PPTX y en el documento siguiente.
- [Notas del presentador](presenter-notes.md): qué decir, tiempos, acciones de la demo, transiciones y alternativas ante fallos.

La documentación oficial consultada el 2026-10-24 indica que la preview no requiere licencia de Microsoft 365 Copilot. La diapositiva 15 distingue esa condición del 403 observado en el entorno de la demo. Las fuentes están en las notas de las diapositivas.

## Antes de cerrar T-007

- Incorporar capturas reales de encuesta, tablero y diagnóstico, según [la guía del plan B](../screenshots/README.md). El deck actual explica los recorridos y no contiene capturas simuladas.
- Confirmar e incorporar la URL pública final. El remote de este checkout pertenece al framework VISION y no se anuncia como repositorio final de la demo.
- Revisar contenido y notas con el autor. Sustituir el técnico de prueba de las notas por el perfil disponible para el ensayo.
- Ensayar los 60 minutos y las transiciones de ventana en Teams, comprobando las notas en la vista del moderador.

## Fuente y regeneración

`build-deck.mjs` usa `@oai/artifact-tool` del runtime de Codex. `deck-metadata.py` añade la metadata de generación requerida por el proyecto. El generador debe ejecutarse desde la raíz del repositorio y no ejecuta el build de SPFx ni comandos del tenant.

Configurar `CODEX_PRIMARY_RUNTIME_ROOT` con el directorio de dependencias del runtime y `PRESENTATIONS_SKILL_DIR` con la ubicación de la skill Presentations. El script espera `node/node_modules` y `python/python.exe` dentro del runtime. Ejecutar el módulo con su Node.js. Cada regeneración crea una revisión nueva del PPTX y actualiza el PDF y las notas.

Las vistas previas y reportes de validación se escriben en `tmp/slides-sprint4/`. La exportación directa de PDF del runtime instalado falla al resolver una fuente estándar, por lo que el PDF conserva las vistas previas renderizadas. El contenido y las tablas permanecen editables en el PPTX.
