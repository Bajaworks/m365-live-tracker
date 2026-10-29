---
generated_by_model: 'claude-opus-5-5'
generated_at: '2026-10-24T13:40:00Z'
agent_roles: 'IDE Agent + project-manager-senior + engineering-frontend-developer + design-ui-designer'
vision_command: 'generate_sprints'
sprint_number: 3
source_spec_kit: 'spec-kit/input/'
---

# Sprint 3 — Tablero del técnico

## Objetivo
Tablero `TechnicianScorecard` en vista inline y de pantalla completa, con un círculo por dimensión (1 = contorno, 5 = lleno), distribución, tendencia mensual por `Creado` y comentarios recientes, sin mostrar quién respondió.

## Demo de cierre
"¿Cómo va el desempeño de Ana López este trimestre?" → 4 círculos inline → "Ver detalle" → pantalla completa → cambio de periodo.

## Tareas del autor
- [x] Ejecutar `yo @microsoft/sharepoint` en `apps/satisfaction-survey`: Copilot Component, nombre `technician-scorecard`, plantilla React (ST-14). Hecho el 2026-10-24.
- [ ] Volver a desplegar el `.sppkg` y sincronizar el agente.

## Alcance
4 historias · 9 tareas · 13 puntos. Código en `apps/satisfaction-survey/`.

## Criterio de terminado
- `npm run build` sin errores; pruebas unitarias en verde.
- `node tools/check-branding.js` en verde.
- Probado en tema claro y oscuro (si aplica a la UI).
- Si cambió el agente, su `version` subió.
