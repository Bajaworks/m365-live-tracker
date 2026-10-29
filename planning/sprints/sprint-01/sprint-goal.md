---
generated_by_model: 'claude-opus-5-5'
generated_at: '2026-10-24T13:40:00Z'
agent_roles: 'IDE Agent + project-manager-senior + engineering-backend-architect + engineering-frontend-developer'
vision_command: 'generate_sprints'
sprint_number: 1
source_spec_kit: 'spec-kit/input/'
---

# Sprint 1 — Datos y fundaciones

## Objetivo
Tener el sitio de comunicación `/sites/encuestas`, la lista `Encuestas` con unas 120 respuestas de ejemplo en bajaworks, y la capa compartida (modelo, configuración, datos y lógica) con pruebas unitarias en verde. Resolver los spikes R1–R5 y R8.

## Demo de cierre
Mostrar la lista `Encuestas` con datos repartidos en 6 meses y la salida de `heft test` en verde.

## Tareas del autor
- [ ] Crear en el centro de administración de Microsoft 365 los técnicos ficticios **sin licencia**: Ana López, Sofía Herrera, Luis Ramírez, Diego Torres, Carmen Vega, Jorge Mendoza (`@bajaworks.org`). Al menos Ana, Sofía y Luis.
- [ ] Copiar `demo.config.sample.psd1` → `demo.config.local.psd1` y llenar TenantUrl y los correos de los técnicos en orden T1…T6.
- [ ] Ejecutar los scripts de aprovisionamiento (se abrirá el login web).

## Alcance
9 historias · 15 tareas · 26 puntos. Código en `apps/satisfaction-survey/`.

## Criterio de terminado
- `npm run build` sin errores; pruebas unitarias en verde.
- `node tools/check-branding.js` en verde.
- Probado en tema claro y oscuro (si aplica a la UI).
- Si cambió el agente, su `version` subió.
