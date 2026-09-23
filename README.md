# Future of Work Consultancy — Operating Model Discussion Pack & Prototype

Operating model discussion pack and clickable Microsoft 365 prototype for the Future of Work Consultancy: intake, prioritisation, engagement scorecards, a Simplification Index and value reporting.

**Status:** Brief generated · next step `generate_spec_kit`
**Stack:** Microsoft 365, low-code (SharePoint Lists, Microsoft Forms, Power Automate, Power BI, Teams)
**Delivery framework:** VISION (brief → spec kit → sprints → execution)

---

## The initiative

The **Future of Work Consultancy** helps employees, teams and business units improve the way they work. It combines Microsoft 365 expertise, practical coaching and consultancy. Its promise: *from using the tools → to improving the work.*

| | |
|---|---|
| **Domains** | Productivity · Collaboration & Communication · Business Process Improvement |
| **Service routes** | Training (webinars, tailored team sessions) · Consultancy projects · 1-to-1 coaching |
| **Engagement lifecycle** | Discover → Design → Enable → Measure & Improve |
| **Value to the business** | Performance · Efficiency · Employee experience |
| **Evidence levels** | Reach → Capability → Behaviour → Outcome |

AI and automation are built into solutions wherever they improve the work. They are not separate services.

### The missing part

The service offering and the measurement approach are well defined. The operating model is not yet. The team still has to decide:

- **Ownership & organisation.** Who is accountable for which services?
- **Access & intake.** How do people engage the consultancy?
- **Prioritisation.** How is demand ranked, and who decides?
- **Delivery model.** What is central, embedded, or delivered through other teams?
- **Learning & value.** How do we judge value and adapt the model?
- **Knowledge management.** How do we capture and reuse what we learn?

There is also a benefit that shows up in almost every engagement but is not measured yet: **business processes become simpler.**

---

## What this project delivers

### 1. Operating Model Discussion Pack

- One options card per open question: options, trade-offs, dependencies, a suggested starting point and a decision owner.
- A discussion guide built around the question *"What would make this workable in practice — and what could get in the way?"*
- A decision log template and a one-page glossary.

### 2. Clickable Microsoft 365 prototype (sample data)

It walks through one complete engagement end to end:

```
Request form → Triage → Prioritisation board → Engagement (4 steps)
   → Scorecard → Evidence (4 levels) → Simplification Index
   → Value dashboard → Work story
```

| Component | Built with |
|-----------|-----------|
| Service catalogue, requests, engagements, scorecards, evidence, process profiles, stories, assets | SharePoint Lists |
| Intake and pulse surveys | Microsoft Forms |
| Notifications and status updates (optional) | Power Automate |
| Monthly / quarterly / annual value views | Power BI (SharePoint views as fallback) |
| Team access | Teams tab |

### Simplification Index (proposed)

A comparable measure of how much simpler a process became:

- **Simplification Index** = weighted average % reduction in *manual steps*, *hand-offs*, *cycle time* and *errors/rework*
- **Time released** = (time before − time after) × annual frequency, confirmed by the benefit owner

Worked example (illustrative): monthly reporting went from 6 h and 9 manual steps to 45 min and 3 steps. The dimensions and weights are open for the team to review.

### Out of scope

Production build, real user data, system integrations, individual performance measurement, and decisions on the team's name or structure. The pack presents options; the team decides.

---

## Measurement principles

The prototype follows these principles, all taken from the operating model:

- Measure the **change in work**, not just attendance or clicks.
- Start with a **baseline**. Use **more than one signal**.
- Be **proportionate**:
  - Webinars and coaching: light.
  - Team sessions: standard.
  - Consultancy projects: detailed.
- **Separate influence from proof.** Claim contribution, not causation.
- **Tell the value story.** Each work story answers five questions:
  1. What was getting in the way?
  2. What did we do?
  3. What changed?
  4. What evidence shows it?
  5. What will sustain it?

---

## Progress

- [x] `init`: project initialised (no reverse engineering; Spec Kit and Agency Agents updated)
- [x] `clarify_brief`: scope, stack, methodology and audience agreed
- [x] `generate_brief`: [spec-kit/input/brief.md](spec-kit/input/brief.md)
- [ ] `generate_spec_kit`: PRD, technical spec, data model, epics, stories, sprint plan, test plan
- [ ] `generate_sprints`: sprint plan
- [ ] `start_sprint --sprint 1`: build the discussion pack and prototype

### Open questions

- When is the team's operating-model discussion? This sets the delivery date.
- Are Power BI, Power Automate and a SharePoint site available? Who owns the environment?
- Which dimensions and weights should the Simplification Index use? Should it cover all domains or only Business Process Improvement?
- Which prioritisation criteria matter most?
- Should the prototype use fictional or anonymised real sample engagements?
- Is the "AI front door" idea (the consultancy as the entry point for AI initiatives) in scope now?

---

## Repository structure

```
refdocs/                  Source material (operating model deck, meeting notes)
spec-kit/input/brief.md   Project brief
spec-kit/input/           Spec Kit artefacts (generated next)
planning/                 Workflow state, clarifications, sprints
commands/                 VISION command definitions (source of truth)
agency-agents/agents/     Agent role definitions
scripts/                  VISION Node.js scripts
docs/                     VISION documentation and training course
```

---

## Working with VISION

This repository uses the **VISION framework**. Type commands in your IDE agent (Claude Code, Cursor, Copilot, …). The agent reads `commands/<name>.md`, runs the scripts and reports the next step.

```
init → clarify_brief → generate_brief → generate_spec_kit
     → generate_sprints → start_sprint --sprint N → continue_sprint
```

Setup:

```bash
npm install
npm run setup:ide     # generate IDE agent config (local, not committed)
```

Useful commands:

```bash
npm run status        # where is the project in the workflow?
npm run status:web    # local dashboard at http://127.0.0.1:4173
```

If you're unsure what comes next, run `next_step` in your agent.

More information:
- [AGENTS.md](AGENTS.md): command overview
- [GUIA_COMPLETA_VISION.md](GUIA_COMPLETA_VISION.md): full guide (Spanish)
- [docs/vision-training-course.md](docs/vision-training-course.md): training course
- [commands/agent_declaration.md](commands/agent_declaration.md): agent role declaration rule
