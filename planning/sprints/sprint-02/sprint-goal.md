---
generated_by_model: 'claude-opus-5-5'
generated_at: '2026-10-24T13:40:00Z'
agent_roles: 'IDE Agent + project-manager-senior + engineering-frontend-developer + design-ux-architect'
vision_command: 'generate_sprints'
sprint_number: 2
source_spec_kit: 'spec-kit/input/'
---

# Sprint 2 — Encuesta en Copilot

## Objetivo
Que la encuesta funcione de punta a punta: una frase en Copilot abre el formulario rediseñado, con ticket y técnico precargados, y guarda en `Encuestas`. Primer despliegue en bajaworks al cierre del sprint.

## Demo de cierre
"Quiero calificar la atención del ticket 4521, me ayudó Ana López" → formulario → envío → confirmación → botón "Ver desempeño".

## Tareas del autor
- [ ] Subir el `.sppkg` al App Catalog de bajaworks, activarlo y pulsar **Add to Teams** (primer despliegue).

## Alcance
5 historias · 10 tareas · 16 puntos. Código en `apps/satisfaction-survey/`.

## Criterio de terminado
- `npm run build` sin errores; pruebas unitarias en verde.
- `node tools/check-branding.js` en verde.
- Probado en tema claro y oscuro (si aplica a la UI).
- Si cambió el agente, su `version` subió.
