---
generated_by_model: 'gemini-3.8-flash'
generated_at: '2026-11-06T05:42:00Z'
agent_roles: 'product-sprint-prioritizer + project-management-project-shepherd'
vision_command: 'generate_sprints'
sprint_number: 2
source_spec_kit: 'spec-kit/input/'
---

# Sprint 2 QA Plan

## Validaciones Críticas

- [ ] TC-03: Al marcar un hábito hoy completado ayer, la racha actual se incrementa en +1.
- [ ] TC-04: Si el último check-in fue hace 2 o más días, la racha actual se reinicia a 1 y longestStreak conserva el récord histórico.
- [ ] TC-05: El desmarcado (toggle uncheck) revierte el estado sin corromper el historial de fechas previas.
- [ ] TC-07 y TC-08: El modal permite crear nuevos hábitos y editar existentes sin perder sus rachas acumuladas.
- [ ] TC-09: La eliminación remueve el hábito de la persistencia de forma consistente.

## Riesgos Monitoreados

- Diferencias de zonas horarias en el formato de fecha ISO local: validado usando YYYY-MM-DD local (`getFullYear`, `getMonth() + 1`, `getDate`).
- Duplicados en `completedDates`: mitigado asegurando el uso de `Set` antes de persistir.
