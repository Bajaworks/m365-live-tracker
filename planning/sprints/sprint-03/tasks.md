---
generated_by_model: 'claude-opus-5-5'
generated_at: '2026-10-24T13:40:00Z'
agent_roles: 'IDE Agent + project-manager-senior + engineering-frontend-developer + design-ui-designer'
vision_command: 'generate_sprints'
sprint_number: 3
source_spec_kit: 'spec-kit/input/'
---

# Sprint 3 Tasks

| Task | Title | RF | Component | Route | Story | Owner role | Points | Status |
|---|---|---|---|---|---|---|---|---|
| T-001 | (Autor) Scaffolding del componente `technician-scorecard` — hecho el 2026-10-24, ID 6954f70b-9456-41c9-8637-a5f3892fcc5a | RF-10 | TechnicianScorecard | — | ST-14 | author | 1 | done |
| T-002 | `copilot-agent.json`: ambos componentes en un solo agente, renombrado a "Encuestas de Satisfacción" (hecho 2026-10-24) | RF-02 | copilot | — | ST-14 | ai | 1 | done |
| T-003 | Schema zod `technician`/`period?` (tool ya renombrada a `ShowTechnicianScorecard` con descripción, 2026-10-24; inline + fullscreen) | RF-10 | TechnicianScorecard | — | ST-15 | frontend | 1 | done |
| T-004 | Resolución del técnico (correo / nombre sin acentos / ambiguo → selector / no encontrado → sugerencias) | RF-10 | TechnicianScorecard | — | ST-15 | frontend | 2 | done |
| T-005 | Vista inline: general, n, 4 círculos pequeños, % resuelto, % recomienda, fuerte/débil, "Ver detalle" | RF-11 | TechnicianScorecard | — | ST-16 | frontend | 2 | done |
| T-006 | Estado "Datos insuficientes (n = X)" | RF-13 | TechnicianScorecard | — | ST-16 | frontend | 1 | done |
| T-007 | Fullscreen: círculos grandes + `DistributionBar` + `TrendChart` (SVG) | RF-12 | TechnicianScorecard | — | ST-17 | frontend | 3 | done |
| T-008 | Fullscreen: resultado, comentarios recientes (bajos destacados, sin autor), selector de periodo | RF-14 | TechnicianScorecard | — | ST-17 | frontend | 1 | done |
| T-009 | Adaptación a cambios del host (`onHostContextChanged`, tema y modo) + localización | RF-12 | TechnicianScorecard | — | ST-17 | frontend | 1 | done |

## Notas de estado (2026-10-24)

- T-003…T-009 implementados; `heft test` en verde (73 pruebas), sin advertencias de lint.
- Gráficas validadas con el validador de dataviz sobre las superficies de Fluent: colores fijos por dimensión (claro y oscuro), rampa ordinal 1→5 (invertida en oscuro), etiquetas directas y vista de tabla como compensación del contraste en tema claro.
- Extras: plan B con datos de demostración y etiqueta visible si no se puede leer la lista; `updateModelContextAsync` con el resumen (sin comentarios) para preguntas de seguimiento.
- Pendiente de verificación visual en el Copilot Workbench. Como el agente está en `toolDiscovery: "static"` y cambiaron los parámetros de `ShowTechnicianScorecard`, hay que republicar (`npm run release` → Upload → Add to Teams) para Copilot real.
