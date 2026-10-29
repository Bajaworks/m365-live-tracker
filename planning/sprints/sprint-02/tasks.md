---
generated_by_model: 'claude-opus-5-5'
generated_at: '2026-10-24T13:40:00Z'
agent_roles: 'IDE Agent + project-manager-senior + engineering-frontend-developer + design-ux-architect'
vision_command: 'generate_sprints'
sprint_number: 2
source_spec_kit: 'spec-kit/input/'
---

# Sprint 2 Tasks

| Task | Title | RF | Component | Route | Story | Owner role | Points | Status |
|---|---|---|---|---|---|---|---|---|
| T-001 | Controles UI: `RatingScale` (radiogroup accesible), `ChoiceGroup`, `PersonField` (People Picker REST + foto) | RF-06 | shared/ui | — | ST-10 | frontend | 3 | done |
| T-002 | `ScoreCircle` SVG (relleno por área, contornos 2–4, aria-label) | RF-12 | shared/ui | — | ST-10 | frontend | 1 | done |
| T-003 | Schema zod `ticketNumber?`/`technician?` + manifiesto solo inline (tool ya renombrada a `OpenSatisfactionSurvey` con descripción, 2026-10-24) | RF-05 | SatisfactionSurveyForm | — | ST-11 | frontend | 1 | done |
| T-004 | Reemplazar la UI de ejemplo: bloques Contexto → Resultado → 4 dimensiones → Recomendación → Comentario | RF-06 | SatisfactionSurveyForm | — | ST-12 | frontend | 3 | done |
| T-005 | Validación en vivo + comentario condicional + Enviar deshabilitado | RF-07 | SatisfactionSurveyForm | — | ST-12 | frontend | 1 | done |
| T-006 | Localización es-es / en-us (`loc/`) | RF-06 | SatisfactionSurveyForm | — | ST-12 | frontend | 1 | done |
| T-007 | Detección de duplicado → modo lectura | RF-08 | SatisfactionSurveyForm | — | ST-13 | frontend | 1 | done |
| T-008 | Envío + confirmación + botón seguimiento (`sendFollowUpMessageAsync`) + errores con reintento | RF-09 | SatisfactionSurveyForm | — | ST-13 | frontend | 2 | done |
| T-009 | Agente: frases de inicio en `declarativeAgent.json` (nombre, descripciones, `ai-plugin.json` e `instruction.txt` ya hechos el 2026-10-24) | RF-01 | copilot | — | ST-18 | ai | 2 | done |
| T-010 | Build `.sppkg`, guía de despliegue inicial en `docs/deployment.md`, primera matriz de intención (I1–I5, I11) | RF-01 | docs | — | ST-18 | qa | 1 | done |


## Notas de estado (2026-10-24)

- T-001…T-009 implementados; `heft test` en verde (61 pruebas) y sin advertencias de lint.
- T-010 en curso: guía en `apps/satisfaction-survey/docs/deployment.md`. Falta generar el `.sppkg` (el autor tenía `npm run start` corriendo), desplegar en el tenant y correr la matriz I1–I5 e I11 junto con los spikes R2, R3 y R9.
- Extra: `updateModelContextAsync` informa al modelo cuando se guarda una encuesta, para que pueda confirmarlo con datos reales.
- 2026-10-24: desplegado en el tenant (paquete 1.0.0.3, agente 1.0.0.3, `toolDiscovery: static`). En Copilot la herramienta se selecciona con los argumentos correctos, pero la ejecución devuelve **403 `copilot_license_required`**: la cuenta del autor es *Copilot Chat (Basic)*. Bloqueado por licencia (riesgo R11). El Workbench funciona de punta a punta.
- Cierre del sprint 2: despliegue hecho y diagnosticado con `-developer on`. La matriz de intención en Copilot real (I1–I5, I11) y la prueba R2 con la cuenta sin permisos de administrador quedan **condicionadas a la licencia** y pasan al sprint 4. Lo que se pudo verificar: I1 (Matched/Selected, argumentos exactos). Decisión del autor: opción C (Workbench + diagnóstico en vivo).
