---
generated_by_model: 'gpt-6'
generated_at: '2026-10-24T16:08:27Z'
agent_roles: 'project-management-senior-project-manager + engineering-technical-writer'
vision_command: 'continue_sprint --sprint 4'
sprint_number: 4
source_spec_kit: 'spec-kit/input/'
---

# Sprint 4 — Listo para el escenario

## Objetivo
Intención afinada (≥ 9/10), despliegue final en bajaworks a T−48 h, guion y slide deck para la sesión de 60 minutos con plan B, y repositorio público listo (README es/en, MIT, verificación de marcas en verde).

## Demo de cierre
Ensayo completo de 60 minutos con el tiempo medido, incluyendo las transiciones entre el slide deck, el Workbench, el código y el diagnóstico en Copilot.

## Tareas del autor
- [ ] Fijar la fecha del evento y el checklist T−48 h / T−24 h / T−1 h.
- [ ] Grabar el video del plan B y hacer 2 ensayos completos.
- [ ] Decidir qué se publica en GitHub (todo el repo o solo `apps/satisfaction-survey`).

## Alcance
4 historias · 7 tareas · 12 puntos. Código en `apps/satisfaction-survey/`. T-007 amplía ST-21 con la producción del slide deck.

## Criterio de terminado
- `npm run build` sin errores; pruebas unitarias en verde.
- `node tools/check-branding.js` en verde.
- Probado en tema claro y oscuro (si aplica a la UI).
- Si cambió el agente, su `version` subió.
- Slide deck editable y PDF revisados visualmente, con notas del presentador y tiempos alineados con el guion; legibles al compartir por Teams.
