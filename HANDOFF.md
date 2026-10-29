---
generated_by_model: 'gpt-6'
generated_at: '2026-10-24T16:46:30Z'
agent_roles: 'project-management-senior-project-manager + engineering-technical-writer'
vision_command: 'continue_sprint --sprint 4'
sprint_number: 4
---

# HANDOFF — contexto para continuar (GitHub Copilot / Codex / cualquier agente)

> Escrito el 2026-10-24 al cambiar de agente (Claude Code al 97 % de uso). Léelo completo antes de tocar código. Fuentes de verdad: este archivo, `README.md` (raíz), `apps/satisfaction-survey/README.md`, `spec-kit/input/*` y `planning/sprints/*`.

## 1. Qué es el proyecto

- Demo para la sesión del autor en **Microsoft 365 Live 2026**: **virtual por Teams**, 1 hora, en español, para profesionales de TI y desarrolladores de SharePoint. La sesión está confirmada en Sessionize (2026-10-23) y el horario se publica la semana del 26 de octubre.
- Tema: **Copilot UX components** (antes *SharePoint Copilot Apps*), SPFx **1.24.0** (GA), React 18 y Fluent UI v9.
- Caso: agente "Encuestas de Satisfacción" con **2 componentes** en `apps/satisfaction-survey/`:
  - `OpenSatisfactionSurvey(ticketNumber?, technician?)`: formulario de satisfacción. Componente `satisfactionSurveyForm`, ID `783decbc-…`, solo inline.
  - `ShowTechnicianScorecard(technician, period?)`: tablero con círculos por dimensión, tendencia y distribución. Componente `technicianScorecard`, ID `6954f70b-…`, inline y pantalla completa.
- Dimensiones: Comprensión, Rapidez, Habilidad, Comunicación (escala 1–5). Círculo: 1 = solo contorno, 5 = lleno, relleno **por área** (`R·√((v−1)/4)`). **Sin comparación con promedios de otros.**
- Datos: sitio de comunicación `/sites/encuestas` y lista **Encuestas**. Columnas: `Title` (visible como "Ticket #") + `m365live_Technician` (Persona), `m365live_Resolved`, `m365live_Understanding`, `m365live_Speed`, `m365live_Skill`, `m365live_Communication`, `m365live_WouldRecommend`, `m365live_Comments`, `m365live_IsSample`. El periodo se calcula con `Created`.
- Proceso: **framework VISION** (comandos en `commands/*.md`). Sprints 1–3 cerrados; **sprint 4 activo**.

## 2. Reglas del autor (obligatorias)

1. **Repositorio público:** nunca marcas reales (Konica, Minolta, KMBS, SKNA, ni logos de patrocinadores) ni el tenant del autor en archivos publicables. Usa **Contoso** y datos ficticios. `npm run check-branding` (en `apps/satisfaction-survey`) debe pasar antes de publicar.
2. **No hacer commits** sin que el autor lo pida.
3. **El autor ejecuta** los builds de producción, los despliegues (App Catalog, Add to Teams) y los scripts de PnP en su tenant. Prepara comandos y revisa salidas; no lances builds mientras corra `npm run start`, porque chocan en `lib-commonjs` con errores ENOENT.
4. Aprovisionamiento: **PnP.PowerShell 1.5.0** y siempre `Connect-PnPOnline -UseWebLogin` (Windows, PowerShell 7). Los scripts cargan el módulo con `-RequiredVersion 1.5.0`, porque en la máquina también existe el módulo antiguo `SharePointPnPPowerShellOnline`.
5. Configuración real en `provisioning/demo.config.local.psd1` (ignorado por Git). Opción B: solo 2 cuentas con licencia, `Technicians = @{ T1 = …; T3 = … }`.
6. Material del evento en `refdocs/event/` (ignorado). **Nunca** en `apps/`.
7. Comunicación con el autor: en **español**, breve y empezando por el resultado.
8. VISION: declarar el rol al iniciar una actividad (`commands/agent_declaration.md`) e incluir metadata en los archivos generados (ver `commands/start_sprint.md`).

## 3. Restricciones técnicas (se aprendieron a la mala)

- Target TypeScript **ES5** con lib `es2015.core/collection/iterable/promise` → **no** usar `Promise.prototype.finally`, `Array.prototype.includes`, `Object.values/entries` ni `String.padStart`.
- ESLint de SPFx (si hay advertencias, el build de producción falla): tipos de retorno explícitos, `no-floating-promises` (añade `.catch(() => undefined)`), `guard-for-in`. No agregues `eslint-disable` innecesarios: generan la advertencia "unused directive".
- Pruebas: Jest con `*.test.ts` junto al código; corren sobre `lib-commonjs`. No hay `@types/node`: en las pruebas que leen archivos usa `declare const __dirname: string;`. Importar JSON funciona (`resolveJsonModule`).
- Los textos de cada componente están en `loc/{en-us,es-es,es-mx}.js` y `mystrings.d.ts`. Si agregas una clave, agrégala en los tres idiomas.
- `.ps1` y `.psd1` se guardan en **UTF-8 con BOM** (tienen acentos).
- PnP 1.5.0: `Set-PnPList -ReadSecurity` se comporta mal, así que el permiso se asigna con CSOM y se verifica. El campo Persona se escribe con el **Id como string** (`[string]$id`); un número o un string envuelto en PSObject llega como null ("The specified user  could not be found").
- Escritura REST: `ensureuser` → `POST items` con cabeceras `odata=nometadata` y `'odata-version': ''`.
- En Copilot, `pageContext.web.absoluteUrl` es la **raíz del tenant**: el sitio se resuelve con origin + `/sites/encuestas` o con la propiedad del tenant `SatisfactionSurveySite` (`src/shared/services/SiteResolver.ts`).
- `config/copilot-agent.json`: `toolDiscovery: "static"`. Cualquier cambio en las herramientas obliga a republicar (**Add to Teams**).
- Dos versiones: `config/package-solution.json` (*App version*; la sube `npm run release`) y la del agente (`teams/.copilot-agent-hotfix.json`; la sube el build cuando cambia `copilot/`). Si se renombra el agente, borra `teams/*.zip`.
- Tablas de `planning/sprints/*/tasks.md`: **no uses `|` dentro de una celda**, porque rompe el parser de `scripts/start-sprint.js`.
- Colores de las gráficas validados (claro y oscuro) en `src/shared/ui/vizPalette.ts`; no los cambies sin revalidar.

## 4. Hallazgos clave

- **403 `copilot_license_required`** en Copilot real con una cuenta *Copilot Chat (Basic)*; le pasa también al ejemplo *My Day* de Microsoft. El **Copilot Workbench funciona sin licencia**. Decisión (opción C): demo en vivo en el Workbench, y en la sesión se muestra el diagnóstico.
- **`-developer on`** (en una conversación **nueva** después de activarlo) → *Agent debug info*: versión del agente, Actions *Matched/Selected*, Executed actions con Tool Arguments, MCP Server Url y Response. La I1 se verificó así.
- Copilot decide con 3 textos: `copilot/instruction.txt`, la descripción de la herramienta en el manifiesto y el `.describe()` de zod. No existen "keywords".
- Sin herramienta disponible, Copilot improvisó un formulario falso; ahora las instrucciones lo prohíben.
- Los componentes llaman a `updateModelContextAsync` (encuesta guardada y resumen del tablero, nunca comentarios) y a `sendFollowUpMessageAsync` (botón "Ver desempeño").

## 5. Estado y pendientes (sprint 4 — `planning/sprints/sprint-04/tasks.md`)

| Tarea | Estado | Qué falta |
|---|---|---|
| T-001 Matriz de intención | in_progress | El autor corre I2–I15 con `-developer on` (funciona sin licencia; mira Tool Arguments). Registrar en `apps/satisfaction-survey/docs/intent-matrix.md` |
| T-002 Despliegue final | in_progress | Cuando salga el horario: publicar a T−48 h; ensayo a T−24 h; checklist T−1 h |
| T-003 Guion | done | `docs/demo-script.md` (incluye checklist para Teams) |
| T-004 Plan B | in_progress | El autor toma 10 capturas y graba el video (`docs/screenshots/README.md`) |
| T-005 README / LICENSE | done | — |
| T-006 Verificación final | in_progress | `check-branding` falla porque `provisioning/demo.config.sample.psd1` tiene la URL y el TenantId reales. El autor **decidió no restaurarlo por ahora**: pregúntale antes de publicar. Falta probar el README en otro tenant |
| T-007 Slide deck | in_progress | Versión de trabajo de 18 diapositivas en `apps/satisfaction-survey/docs/slides/`, PPTX editable, PDF y notas del presentador en todas las diapositivas. Faltan capturas reales de T-004, URL pública confirmada, revisión del autor y ensayo |

Actualización de Codex: la matriz de intención tiene registro C1/C2/C3 y el checklist de despliegue ya usa Workbench. Evidencia de QA en `planning/sprints/sprint-04/qa-evidence.md`. El deck diferencia la documentación oficial (preview sin licencia) del 403 observado en el tenant de prueba. No se ejecutaron builds SPFx ni despliegues.

Otros pendientes: definir si se publica el repositorio completo o solo `apps/satisfaction-survey`; intentar conseguir una licencia de Microsoft 365 Copilot para la demo (pedirla a los organizadores del evento); verificar visualmente el tablero en el Workbench (pantalla completa y tema oscuro).

## 6. Comandos

```powershell
# Estado de VISION (raíz)
npm run status

# App (apps/satisfaction-survey)
npm run start            # Workbench: https://<tenant>.sharepoint.com/_layouts/15/copilotworkbench.aspx
npx heft test --clean    # pruebas rápidas (73 en verde al 2026-10-24)
npm run build            # producción + .sppkg
npm run release          # sube App version + build (para publicar)
npm run check-branding
npm run sample-data      # regenera provisioning/sample-data y src/shared/data

# PnP (apps/satisfaction-survey/provisioning, PowerShell 7)
./Deploy-Demo.ps1 · ./New-SurveyList.ps1 · ./Import-SampleData.ps1 [-Limit 1]
./Reset-DemoData.ps1 -OnlyLive | -Reseed | -All
```

## 7. Mapa de archivos

```
apps/satisfaction-survey/
  copilot/instruction.txt, declarativeAgent.json, manifest.json, ai-plugin.json
  config/copilot-agent.json, package-solution.json
  src/copilotComponents/satisfactionSurveyForm/   (componente, Properties zod, components/, loc/)
  src/copilotComponents/technicianScorecard/      (componente, Properties zod, components/, loc/)
  src/shared/ config/ model/ logic/ services/ ui/ data/
  provisioning/  tools/  docs/ (deployment, demo-script, intent-matrix, spikes, screenshots/)
spec-kit/input/  brief, PRD, technical-spec (riesgos R1–R11 y §12 de patrones), data-model, api-spec, stories, test-plan
planning/        workflow-state.json, sprints/sprint-0N/{sprint-goal,tasks,stories,qa-plan}.md
```

## 8. Cómo continuar en VISION

- Para retomar: `continue_sprint`, que retoma el sprint 4 activo. Lee `commands/continue_sprint.md` e **implementa** en la misma sesión.
- Marca una tarea `done` en `tasks.md` solo cuando se pueda verificar.
- Cuando todo el sprint 4 esté `done`, el proyecto está listo para el evento; no hay sprint 5.
