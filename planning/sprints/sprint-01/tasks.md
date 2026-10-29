---
generated_by_model: 'claude-opus-5-5'
generated_at: '2026-10-24T13:40:00Z'
agent_roles: 'IDE Agent + project-manager-senior + engineering-backend-architect + engineering-frontend-developer'
vision_command: 'generate_sprints'
sprint_number: 1
source_spec_kit: 'spec-kit/input/'
---

# Sprint 1 Tasks

| Task | Title | RF | Component | Route | Story | Owner role | Points | Status |
|---|---|---|---|---|---|---|---|---|
| T-001 | Configuración local de ejemplo + `.gitignore` (`provisioning/demo.config.sample.psd1`) | RF-15 | provisioning | — | ST-01 | devops | 1 | done |
| T-002 | Helper de conexión `Connect-Demo.ps1` (Import 1.5.0 + `-UseWebLogin`, valida la configuración) | RF-15 | provisioning | — | ST-01 | devops | 1 | done |
| T-003 | `New-DemoSite.ps1`: sitio de comunicación idempotente (alias `encuestas`, LCID 3082) | RF-15 | provisioning | — | ST-02 | devops | 2 | done |
| T-004 | `New-SurveyList.ps1`: lista, campos e índices según data-model | RF-16 | provisioning | — | ST-03 | backend | 2 | done |
| T-005 | `New-SurveyList.ps1`: permisos (Everyone except external users = Contribute, Read/WriteSecurity) y vistas | RF-16 | provisioning | — | ST-03 | backend | 1 | done |
| T-006 | Generador determinista de `sample-data/surveys.json` (perfiles T1–T6, comentarios ficticios) | RF-17 | sample-data | — | ST-04 | backend | 2 | done |
| T-007 | `Import-SampleData.ps1`: relación T→correo, Add + `UpdateOverwriteVersion` de Created, `m365live_IsSample` | RF-17 | provisioning | — | ST-04 | backend | 3 | done |
| T-008 | `Reset-DemoData.ps1` (`-OnlyLive`, `-Reseed`, `-Force`) | RF-18 | provisioning | — | ST-05 | devops | 2 | done |
| T-009 | `Set-DemoConfig.ps1` (storage entity opcional) + `Deploy-Demo.ps1` orquestador | RF-19 | provisioning | — | ST-06 | devops | 1 | done |
| T-010 | `src/shared/model/survey.ts` y `src/shared/config/settings.ts` | RF-19 | shared/model | — | ST-07 | frontend | 1 | done |
| T-011 | `SiteResolver` (storage entity → ruta por defecto) + pruebas | RF-19 | shared/services | — | ST-07 | frontend | 1 | done |
| T-012 | `SurveyRepository` (currentuser, findExisting, create con ensureuser + POST items (plan B: AddValidate), getByTechnician, listTechnicians) + pruebas de mapeo | RF-08 | shared/services | — | ST-08 | frontend | 3 | done |
| T-013 | Lógica pura: `validation`, `period`, `aggregation`, `scoreGeometry` + pruebas jest | RF-07 | shared/logic | — | ST-09 | frontend | 3 | done |
| T-014 | `tools/check-branding.js` (Konica / Minolta / KMBS / SKNA / tenant del autor) + script npm | RF-21 | tools | — | ST-22 | devops | 1 | done |
| T-015 | Spikes R1–R5 y R8 (usuario sin licencia) en Workbench y bajaworks; documentar resultados en `docs/spikes.md` | RF-19 | docs | — | ST-08 | qa | 2 | done |


## Notas de estado (2026-10-24)

- `ready_to_run`: el script está escrito, pasa la revisión de sintaxis y valida la configuración, pero **falta ejecutarlo en bajaworks** (lo hace el autor con `-UseWebLogin`). Pasa a `done` cuando se ejecute sin errores.
- T-015: R1 resuelto. R4, R5 y R8 se validan al correr los scripts (ver `apps/satisfaction-survey/docs/spikes.md`). R2, R3 y R9 se validan en el sprint 2.

- 2026-10-24: sitio `/sites/encuestas`, lista y 55 respuestas cargadas en el tenant del autor (opción B: T1 y T3). R4 verificado (`fechas corregidas: 0`). Se observaron cortes de red SSL frecuentes; los reintentos los resolvieron todos.
- Cierre del sprint 1: R5 confirmado por el autor (permisos verificados: leer todos y editar solo los propios). `Reset-DemoData.ps1` ahora exige `-OnlyLive`, `-Reseed` o `-All`. `Set-DemoConfig.ps1` no se ejecutó porque es opcional con la ruta por defecto. R2, R3 y R9 pasan al QA del sprint 2.
