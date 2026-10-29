---
generated_by_model: 'claude-opus-5-5'
generated_at: '2026-10-24T13:10:00Z'
agent_roles: 'IDE Agent + product-sprint-prioritizer + project-management-project-shepherd'
vision_command: 'generate_spec_kit'
source_brief: 'spec-kit/input/brief.md'
source_product_prd: 'spec-kit/input/product-prd.md'
---

# Plan de sprints (propuesta)

La fecha del evento todavía no está definida. Los sprints son cortos (unos 2–4 días de trabajo cada uno) y tienen un entregable que se puede demostrar. Cuando haya fecha, se fija **T−48 h** como límite para el último despliegue.

| Sprint | Objetivo | Historias | Puntos | Entregable |
|---|---|---|---|---|
| **S1 — Datos y fundaciones** | Tener el sitio, la lista y los datos de ejemplo en bajaworks, y la capa compartida con pruebas. Resolver los spikes R1–R5 | ST-01 a ST-09 | 23 | Lista `Encuestas` con unas 120 respuestas; `heft test` en verde; spikes documentados |
| **S2 — Encuesta en Copilot** | Que la encuesta funcione de punta a punta en el Workbench y en Copilot | ST-10, ST-11, ST-12, ST-13, ST-18 | 14 | "Quiero calificar el ticket 4521 de Ana" → formulario → elemento creado |
| **S3 — Tablero** | Tablero inline y en pantalla completa con los círculos | ST-14 (autor), ST-15, ST-16, ST-17 | 12 | "¿Cómo va Ana este trimestre?" → círculos → detalle |
| **S4 — Listo para el escenario** | Ajustar la intención, desplegar, preparar el guion, el plan B y el repo público | ST-19, ST-20, ST-21, ST-22 | 10 | Ensayo completo de 60 min; repo listo para publicar |

## Criterio de "terminado" (todos los sprints)
- `npm run build` sin errores ni advertencias nuevas de ESLint.
- Pruebas unitarias en verde.
- `node tools/check-branding.js` en verde (desde S1).
- Probado en tema claro y oscuro.
- Si cambió el agente, su `version` subió.

## Ruta crítica y riesgos de calendario
1. Los spikes R1–R3 (S1) definen si el formulario puede escribir con el campo Persona desde Copilot. Si fallan, el plan B (elegir el técnico de una lista) entra en S2 sin cambiar el alcance.
2. La sincronización del agente al catálogo puede tardar horas, así que hay que desplegar en bajaworks por primera vez **al final de S2**, no en S4.
3. Si la GA de SPFx 1.24 sale a mitad del plan, se actualiza en una rama, se prueba y solo después se integra.
