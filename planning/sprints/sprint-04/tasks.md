---
generated_by_model: 'gpt-6'
generated_at: '2026-10-24T16:46:30Z'
agent_roles: 'project-management-senior-project-manager + testing-reality-checker + engineering-technical-writer'
vision_command: 'continue_sprint --sprint 4'
sprint_number: 4
source_spec_kit: 'spec-kit/input/'
---

# Sprint 4 Tasks

| Task | Title | RF | Component | Route | Story | Owner role | Points | Status |
|---|---|---|---|---|---|---|---|---|
| T-001 | Matriz de intención completa (I1–I15, tres corridas) y ajuste de instrucciones y descripciones de las tools | RF-01 | copilot | — | ST-19 | ai | 2 | in_progress |
| T-002 | Checklist de despliegue T−48/T−24/T−1 en `docs/deployment.md` + despliegue final | RF-20 | docs | — | ST-20 | devops | 2 | in_progress |
| T-003 | `docs/demo-script.md`: agenda de 60 minutos, frases exactas, archivos y líneas de código a mostrar, tiempos. Incluye un **segmento de diagnóstico con `-developer on`** (tool Matched/Selected, argumentos, MCP URL y el 403 `copilot_license_required`) y la demo en vivo en el Copilot Workbench (opción C) | RF-20 | docs | — | ST-21 | pm | 2 | done |
| T-004 | Plan B: capturas en `docs/screenshots/` + guía para grabar el video | RF-20 | docs | — | ST-21 | pm | 1 | in_progress |
| T-005 | `README.md` (es) + `README.en.md` + `LICENSE` (MIT) + metadatos de Contoso en `package-solution.json` | RF-21 | docs | — | ST-22 | writer | 2 | done |
| T-006 | Verificación final: check-branding, build limpio, prueba de README en un tenant distinto (R2) | RF-21 | tools | — | ST-22 | qa | 1 | in_progress |
| T-007 | Producir slide deck en español para la sesión de 60 minutos: PPTX editable + PDF, notas del presentador en cada diapositiva (qué decir, tiempo y señales de transición), arquitectura, demo y diagnóstico, limitaciones, recursos y capturas del plan B; alineado con `docs/demo-script.md` | RF-20 | slides | — | ST-21 | writer | 2 | in_progress |

## Notas de estado (2026-10-24)

- **T-007 versión de trabajo producida:** [deck y notas](../../../apps/satisfaction-survey/docs/slides/README.md), 18 diapositivas, PPTX editable, PDF y notas completas en cada diapositiva y Markdown. Paquete y geometría validados, 18 vistas previas revisadas visualmente. Se distingue documentación oficial de licencia del 403 observado. Pendientes: capturas reales de T-004, URL pública confirmada, revisión del autor y ensayo. No se ejecutaron builds SPFx ni despliegues.
- **T-007 incorporada a petición del autor:** producir el slide deck de Microsoft 365 Live 2026. Criterios de aceptación en [stories.md](stories.md); validación en [qa-plan.md](qa-plan.md). Pendiente de producción; la captura final y el horario del evento se incorporan cuando estén disponibles.
- **Continuación con Codex:** `continue_sprint --sprint 4` ejecutado. La matriz de intención dispone de registro separado C1/C2/C3 y criterios de conteo; el checklist de despliegue se alineó con la demo en Workbench. [qa-evidence.md](qa-evidence.md) registra los checks locales y prepara W9/W10 y la prueba del README en otro tenant. Datos de ejemplo al día; branding sigue fallando en la configuración de ejemplo, que no se modificó. No se ejecutaron builds ni pruebas unitarias en esta continuación y las cuatro tareas abiertas conservan `in_progress`.
- **T-003 hecho:** `apps/satisfaction-survey/docs/demo-script.md`, con 6 bloques de tiempo, frases y parámetros exactos, enlaces a las líneas de código, el segmento `-developer on`, el checklist T−1 h y el plan B.
- **T-005 hecho:** `README.md` (es), `README.en.md`, `LICENSE` (MIT) y metadatos de Contoso en `package-solution.json`.
- **T-001 en curso:** `docs/intent-matrix.md`. I1 está verificado con `-developer on`. I2–I15 se pueden verificar sin licencia, porque *Executed actions* muestra la herramienta y los argumentos aunque la respuesta sea 403. Las tres corridas las hace el autor.
- **T-002 en curso:** el checklist T−48/T−24/T−1 está en `docs/deployment.md` y en el guion. Falta la fecha del evento para el despliegue final.
- **T-004 en curso:** la guía de capturas y del video está en `docs/screenshots/README.md`. Las capturas y el video los graba el autor.
- **T-006 en curso:** 73 pruebas en verde y datos de ejemplo al día. `check-branding` falla por `provisioning/demo.config.sample.psd1` (tiene la URL y el TenantId del tenant del autor); el autor decidió no restaurarlo por ahora, así que hay que resolverlo antes de publicar. La prueba del README en un tenant distinto está pendiente.
- 2026-10-24: evento confirmado, **Microsoft 365 Live 2026** (sesión aceptada en Sessionize el 2026-10-23). El horario definitivo se publica a principios de la semana del 26 de octubre; con él se fija el despliegue final a T−48 h (T-002).
- 2026-10-24: la sesión será **virtual por Teams** (checklist de Teams en el guion). Traspaso de contexto en `HANDOFF.md` para continuar con GitHub Copilot o Codex.
