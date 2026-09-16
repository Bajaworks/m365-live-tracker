# RITM0144093 — SharePoint List Migration & Document-Centric Enhancement

**MyBase Label Approval Migration to SharePoint Online**  
**FSC® Labelfreigabe Archive Preservation & Modern Search Implementation**

## Project Overview

Migration of 3,426 historical label approval items (15+ years of data) from on-premises SharePoint (MyBase) to SharePoint Online, combined with a strategic document-centric enhancement using PnP Search for modern discovery.

**Status:** Brief Generated & Approved | Ready for Spec Kit Generation  
**Timeline:** Q3 2026 (7-week implementation)  
**Success Probability:** 95-98% (validated with real data)

---

## Key Project Metrics

| Metric | Value |
|--------|-------|
| **Items to Migrate** | 3,426 approval records |
| **Unique Approvers** | 64 individuals |
| **Person References** | 42,549 (across 5 fields) |
| **Historical Span** | 15+ years (2010s-2026) |
| **Data Completeness** | 97-100% |
| **Site Size** | 5.2 GB |
| **Total Fields** | 19 (3 system, 5 people, 7 content, 4 workflow config) |
| **Custom Workflows** | 5 (unsupported in SPO — archive-only approach) |

---

## Project Delivery Framework

This project uses the **VISION Framework** for orchestrated execution:

**Flow:** `init` → `clarify_brief` → `generate_brief` → `generate_spec_kit` → `generate_sprints` → `start_sprint`

**Repository:** [helpdsp/SW_RITM0144093](https://github.com/helpdsp/SW_RITM0144093.git)

---

## 📋 Deliverables & Documents

### Project Documentation (Ready for Review)

1. **RITM0144093_Brief_Complete.docx** (96 KB)
   - Comprehensive brief with all 17 sections
   - 16 functional requirements (REQ-MP, REQ-PPF, REQ-AC, REQ-VAL, REQ-DOC)
   - Complete technical stack & constraints
   - Pre/post-migration validation criteria
   - Risk register (High/Medium/Low priority)
   - 5-phase timeline for Q3 2026 execution
   - Location: `spec-kit/output/`

2. **RITM0144093_Stakeholder_Summary.pdf** (74 KB)
   - One-page executive summary with timeline
   - Critical success factors
   - Key messaging for stakeholders (3 pillars)
   - Metrics & confidence indicators
   - Designed for quick stakeholder review & approval
   - Location: `spec-kit/output/`

3. **Brief Markdown Source** 
   - Location: `spec-kit/input/brief.md`
   - Complete reference for detailed technical planning

---

## 🔍 Assessment Findings

### ✅ Strengths & Validation

- **No Blockers Identified** — SPMT scan confirms standard GenericList structure
- **Data Quality Exceptional** — 99-100% completeness, no corruption detected
- **People Field Preservation Validated** — 95-98% success probability confirmed against real data (3,426 items)
- **Clear Technical Path** — Complete REST API schema extracted (19 fields, 3 content types)
- **Strategic Enhancement** — Document-centric approach with PnP Search improves user discovery

### ⚠️ Risks (Mitigated)

| Risk | Mitigation |
|------|-----------|
| **Workflow Unsupport** | 5 custom workflows flagged UNSUPPORTED — archive-only approach optimal |
| **Inactive User Accounts** | 42,549 person references → text fields with status indicators [ACTIVE], [LEFT], [TRANSFERRED], [PENDING] |
| **Permission Complexity** | 228 unique assignments → simplify to site-level read-only access |
| **Timeline Pressure** | Q3 2026 hard deadline → 7-week phased implementation plan |

### 📊 Real Data Validation

- **Source:** Native SharePoint export (labels.xlsx) + REST API schemas
- **Analysis:** 3,426 items with 64 unique approvers analyzed
- **Result:** 95-98% success probability for people field preservation
- **Key Finding:** Top 3 approvers account for 42.7% of references (likely still active)

---

## 📅 Implementation Timeline

| Phase | Duration | Activities |
|-------|----------|-----------|
| **Phase 1** | Week 1 | Discovery & Assessment: Data inventory, people verification, Pre-check review |
| **Phase 2** | Week 2 | Design & Planning: Sharegate config, field mapping, target structure design |
| **Phase 3** | Weeks 3-4 | Pilot & Validation: Test migration on 50-100 items, business review |
| **Phase 4** | Weeks 5-6 | Full Migration: Execute Sharegate, real-time monitoring, post-validation |
| **Phase 5** | Week 7 | Closure & Documentation: Sign-off, knowledge transfer, lessons learned |

---

## 🛠️ Technical Stack

- **Source:** Microsoft SharePoint 2013/2016 on-premises (MyBase - GermanyNorth-MgmtSys)
- **Target:** Microsoft SharePoint Online (Microsoft 365)
- **Migration Tool:** Sharegate (enterprise license)
- **Search Enhancement:** PnP Search (React control for modern discovery)
- **Field Mapping:** Custom REST API transformations with text-based people field preservation

---

## 👥 Project Stakeholders

| Name | Role | Organization | Responsibility |
|------|------|---|---|
| **Melena Beier** | Business Owner | Packaging Development/Design | Requirements, validation, sign-off |
| **Haaron Gonzalez** | Technical Lead | Digital Workplace | Project ownership, Sharegate config, execution |
| **Thomas Eschke** | Technical Contributor | Digital Workplace | Technical assessment, historical context |
| **Tim Klammroth** | Stakeholder | Operations | Progress updates, access coordination |

---

## Quick Start (3 pasos)

### 1. Clonar y preparar

```bash
git clone https://github.com/helpdsp/SW_RITM0144093.git
cd SW_RITM0144093
npm install
```

### 2. Configurar tu IDE

Genera los archivos de configuración para tu IDE específico:

```bash
# Generar configuración para todos los IDEs (cursor, claude, opencode, copilot, antigravity)
npm run setup:ide
```

| IDE                | Archivos generados                     |
| ------------------ | -------------------------------------- |
| **Cursor**         | `.cursor/rules/vision-index.mdc`       |
| **Claude Code**    | `.claude/commands/` + `.claude/rules/` |
| **GitHub Copilot** | `.github/copilot-instructions.md`      |
| **OpenCode**       | `.opencode/commands/`                  |
| **Antigravity**    | `.agents/workflows/`                   |

**Nota:** Estos archivos son locales (no se suben a git) y se regeneran cuando lo necesites.

### 3. Ejecutar `init` y comenzar

Escribe el comando `init` en tu agente IDE (Cursor, Claude, Copilot, etc.):

```
init
```

El agente te preguntará:

- ¿Es reverse engineering? (¿partes de código existente?)
- ¿Descargar Spec Kit y Agency Agents? (recomendado: **sí**)

Una vez completado:

1. Coloca tus documentos en `refdocs/`
2. Ejecuta `generate_brief` en tu IDE
3. Sigue el flujo: `generate_spec_kit` → `generate_sprints` → `start_sprint --sprint 1`

**Declaración de agentes:** en cada actividad del flujo, el agente debe indicar qué rol(es) está aplicando; la norma y el formato están en `commands/agent_declaration.md`.

```
generate_brief
```

El agente interpreta el comando, verifica precondiciones, ejecuta los scripts Node.js necesarios
y reporta el resultado en el chat.

Para ejecutar desde terminal (opcional, modo developer):

```bash
node scripts/generate-brief.js
# o usando los wrappers de bin/
bin/generate_brief
```

---

## Flujo completo (desde el agente del IDE)

Escribe cada comando en la ventana del agente cuando el anterior esté completo:

```
init
clarify_brief
generate_brief
generate_spec_kit
clarify_sprints
generate_sprints
start_sprint --sprint 1
start_sprint --sprint 2
```

Regla de secuencia: cada etapa requiere que la anterior esté lista. `generate_sprints` aprueba el plan en el workflow; **`start_sprint` significa desarrollar** el sprint (implementar `tasks.md`). Si el sprint ya está activo y aún hay tareas pendientes, el siguiente paso formal es **`continue_sprint`**. Para `start_sprint --sprint N` con N>1, el sprint N-1 debe tener **todas** las tareas en `tasks.md` con Status `done`.

---

## 🎯 Strategic Approach: Dual-Value Migration

### The Challenge
Traditional list migration would preserve workflow metadata but lose the ability to replicate custom workflows (5 workflows flagged UNSUPPORTED by SPMT). Users need access to 3,426 label drawings and approval history, not active approval processing.

### The Solution: Document-Centric Enhancement

**Phase 1: Archive the List** (Maintain Traceability)
- Migrate all 3,426 items with complete metadata
- Preserve person field data as text with status indicators
- Keep audit trail of who approved what, when
- Read-only access for historical reference

**Phase 2: Extract Documents** (Enable Discovery)
- Extract all PDF attachments to modern document library
- Add rich metadata: Customer, Article Number, Status, Approvers, Dates
- Organize by meaningful taxonomy
- Enable modern search experience

**Phase 3: Implement PnP Search** (Modern UX)
- Configure crawl and indexing on document library
- Implement faceted search refiners (by customer, status, date, approver)
- Enable intelligent sorting and document preview
- Provide superior discovery vs. list browsing

### Result
Users get a **modern search experience** for finding labels while maintaining **complete historical traceability** and **100% data preservation**.

---

## 📁 Project Structure

```
C:\DATA\Repos\SW_RITM0144093\
├── README.md (this file)
├── CLAUDE.md (VISION framework instructions)
├── refdocs/ (Reference documents & analysis)
│   ├── RITM0144093.md (Ticket context)
│   ├── SPMT_SCAN_ANALYSIS.md (Migration tool findings)
│   ├── PEOPLE_FIELD_PRESERVATION_STRATEGY.md (Strategy & validation)
│   ├── VALIDATION_PEOPLE_FIELD_STRATEGY.md (Real data analysis)
│   ├── list-definitions/ (REST API schemas & field definitions)
│   └── brand/ (Smurfit Westrock branding assets)
├── spec-kit/
│   ├── input/
│   │   └── brief.md (Comprehensive project brief)
│   └── output/ (Deliverables)
│       ├── RITM0144093_Brief_Complete.docx
│       ├── RITM0144093_Stakeholder_Summary.pdf
│       └── (PRD, technical-spec, api-spec, data-model, epics, stories, sprint-plan, test-plan TBD)
├── planning/
│   ├── workflow-state.json (VISION framework state tracking)
│   └── clarifications/brief.json (Stakeholder clarifications)
├── scripts/
│   ├── generate-complete-brief-docx.py (Full brief document generator)
│   ├── generate-stakeholder-summary-pdf.py (One-page summary generator)
│   └── (VISION framework Node.js scripts)
└── commands/ (VISION framework commands)
    ├── init.md
    ├── clarify_brief.md
    ├── generate_brief.md
    ├── generate_spec_kit.md
    └── ... (full VISION workflow)
```

---

## 📊 Current Status: Brief Phase ✅ COMPLETE

**Workflow State:** `brief.generated = true` | `brief.approved = true` | `spec.generated = true`

### ✅ Completed
- [x] Project initialization (VISION framework)
- [x] Reference documentation collection (SPMT, REST API, real data export)
- [x] Deep technical assessment (19 fields, 3 content types, 7 views analyzed)
- [x] People field preservation validation (95-98% success probability)
- [x] Comprehensive brief generation (17 sections, all requirements documented)
- [x] Stakeholder summary creation (one-page PDF for quick approval)
- [x] Branding & formatting (Smurfit Westrock guidelines applied)

### ⏳ Next Steps (Pending Approval)
- [ ] Stakeholder review & approval of brief documents
- [ ] Run `generate_spec_kit` to create technical specifications (8 artifacts)
- [ ] Run `generate_sprints` to create 5-phase sprint plan
- [ ] Begin Phase 1: Discovery & Assessment (Week 1)

---

## 🚀 How to Proceed

### For Stakeholder Approval (Business)
1. Review `RITM0144093_Stakeholder_Summary.pdf` (1 page)
2. Review timeline and critical success factors
3. Approve to proceed with technical planning

### For Technical Implementation (Development)
1. Review `RITM0144093_Brief_Complete.docx` (comprehensive reference)
2. Review `spec-kit/input/brief.md` (markdown source)
3. Upon approval, execute: `generate_spec_kit` → `generate_sprints` → `start_sprint --sprint 1`

---

## 📝 VISION Framework Workflow

Si no sabes en qué parte estás:

```
next_step
```

Para ver el flujo completo con instrucciones por comando: leer `AGENTS.md`.

---

## Sesiones de clarificación

Antes de `generate_brief` y `generate_sprints` se requiere una sesión de clarificación.
El agente te hace las preguntas directamente en el chat:

**`clarify_brief`** — tono, audiencia, alcance y prioridad del brief.

**`clarify_sprints`** — duración de sprint, cantidad, roles activos y criterio de éxito.

Las respuestas se guardan en:

- `planning/clarifications/brief.json`
- `planning/clarifications/sprints.json`

Modo no interactivo (para agentes automáticos):

```powershell
node scripts/clarify-brief.js --answers-file path/to/answers.json
```

Ejemplo de `answers.json` para `clarify_brief`:

```json
{
  "brief_tone": "Ejecutivo",
  "brief_audience": "CEO / Stakeholders",
  "brief_scope": "MVP + roadmap",
  "brief_priority": "Velocidad de entrega"
}
```

---

## Spec Kit

Los templates oficiales de [github/spec-kit](https://github.com/github/spec-kit) se descargan al correr `init` (si respondes "sí" a la pregunta).
También se pueden actualizar con:

```
update_spec_kit
```

Estructura local:

```
spec-kit/
  input/        ← artefactos generados del proyecto (PRD, specs, stories...)
  templates/    ← templates copiados desde upstream (tracked en git)
  upstream/     ← clon local de git (gitignored)
  upstream.json ← sha y fecha de la última actualización
```

Los artefactos que genera `generate_spec_kit` en `spec-kit/input/`:

| Archivo             | Contenido                                |
| ------------------- | ---------------------------------------- |
| `PRD.md`            | Casos de uso, flujos, métricas           |
| `technical-spec.md` | Stack, arquitectura, decisiones          |
| `api-spec.yaml`     | Definición de endpoints                  |
| `data-model.md`     | Modelo de datos                          |
| `epics.md`          | Épicas del producto                      |
| `stories.md`        | User stories con criterios de aceptación |
| `sprint-plan.md`    | Distribución de stories por sprint       |
| `test-plan.md`      | Estrategia QA por capa                   |

---

## Agency Agents

Los roles de agente del proyecto vienen de [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents).
Se descargan al correr `init` (si respondes "sí" a la pregunta). También se pueden actualizar con:

```
update_agency_agents
```

Estructura local:

```
agency-agents/
  agents/       ← definiciones de roles copiadas desde upstream (tracked en git)
    engineering/
    design/
    testing/
    product/
    project-management/
  upstream/     ← clon local de git (gitignored)
  upstream.json ← sha y fecha de la última actualización
```

Los roles activos por defecto se definen en `agent-roles.json`:

| Área     | Rol principal                               |
| -------- | ------------------------------------------- |
| Frontend | `engineering-frontend-developer`            |
| Backend  | `engineering-backend-architect`             |
| QA       | `testing-reality-checker`                   |
| Deploy   | `engineering-devops-automator`              |
| PM       | `project-management-senior-project-manager` |

---

## Estructura de archivos clave

```
refdocs/                    ← insumos del usuario (no modificar)
source-code/                ← código fuente si reverse engineering
spec-kit/input/             ← artefactos generados del Spec Kit
agency-agents/agents/       ← roles de agente por especialidad
planning/
  workflow-state.json       ← estado del flujo
  clarifications/           ← respuestas de sesiones de clarificación
  sprints/sprint-XX/        ← tareas, stories, QA por sprint
AGENTS.md                   ← instrucciones para el agente del IDE
commands/                   ← definiciones de comandos (fuente de verdad)
agent-roles.json            ← mapeo de roles por área
```

**Nota:** Los archivos de configuración IDE (`.cursor/`, `.claude/`, `.github/copilot-instructions.md`, etc.) se generan localmente y no se incluyen en git.

---

## Estado y diagnóstico

Desde la terminal:

```powershell
npm run status
```

Dashboard web local:

```powershell
npm run status:web
# → http://127.0.0.1:4173 por defecto; si el puerto está ocupado, el servidor elige el siguiente libre (4174, …) y lo muestra en consola
```

---

## Flujo conectado a matriz (opcional)

```bash
npm run connect_project -- --project-id "<ID>" --workspace-id "<WS>" --matrix-url "http://localhost:4000"
npm run matrix:authorize -- --authorized-by "<tu-nombre>"
# Si matriz no responde, los reportes se encolan en .matrix/pending-reports.ndjson
npm run matrix:sync
```

---

## Compatibilidad desde terminal

Todos los comandos tienen equivalente `npm run` para uso desde terminal:

```bash
npm run clarify_brief
npm run generate_brief
npm run generate_spec_kit
npm run clarify_sprints
npm run generate_sprints
npm run approve_sprints_plan   # opcional; generate_sprints ya aprueba el plan
npm run start_sprint -- --sprint N
npm run reset_project
npm run update_spec_kit
npm run update_agency_agents
```

Y como wrappers directos en `bin/`:

```bash
bin/generate_brief
bin/start_sprint --sprint 1
```

---

## MCP local

```powershell
npm run mcp:matrix
```

Herramientas MCP disponibles: `matrix_healthcheck`, `matrix_connect_project`,
`matrix_authorize_project`, `matrix_validate_briefing`, `matrix_generate_spec_kit`,
`matrix_report_stats`, `matrix_sync_pending_reports`.

---

## Referencias

- Documentación completa: [GUIA_COMPLETA_VISION.md](file:///c:/DATA/Repos/vision-framework/vision-framework/GUIA_COMPLETA_VISION.md)
- Curso de capacitación para equipos: [docs/vision-training-course.md](file:///c:/DATA/Repos/vision-framework/vision-framework/docs/vision-training-course.md)
- Comandos del agente: [AGENTS.md](file:///c:/DATA/Repos/vision-framework/vision-framework/AGENTS.md)
- Estructura de comandos: [commands/README.md](file:///c:/DATA/Repos/vision-framework/vision-framework/commands/README.md)

