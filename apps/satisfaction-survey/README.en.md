# Satisfaction Surveys — Copilot UX components (SPFx 1.24)

![SPFx](https://img.shields.io/badge/SPFx-1.24.0--rc.0-yellow.svg) ![React](https://img.shields.io/badge/React-18-61DAFB.svg) ![Node](https://img.shields.io/badge/Node.js-22.x-339933.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg)

*[Versión en español](README.md)*

A **Copilot UX components** sample (formerly *SharePoint Copilot Apps*) built for a technical session. One Microsoft 365 Copilot agent with **two interactive components** rendered inside the chat:

| Component | Tool | What it does |
|---|---|---|
| **Survey** | `OpenSatisfactionSurvey` | Satisfaction form for a support ticket, with the ticket and technician prefilled from the conversation. Saves to a SharePoint list. |
| **Scorecard** | `ShowTechnicianScorecard` | A technician's consolidated performance in **Understanding, Speed, Skill and Communication**: one circle per dimension, monthly trend, distribution and comments. |

Everything runs with the signed-in user's identity (SSO), no backend, deployed from the App Catalog. Fictional company and data (Contoso). The UI is localized in es-MX, es-ES and en-US.

> **Preview.** Copilot UX components are in public preview (SPFx 1.24 rc.0). APIs may change. Do not use in production.

## Highlights

- Intent detection with parameters → the survey opens with `ticketNumber` and `technician`.
- Redesigned form: no preselected values, a label on every point, a comment that becomes required for unresolved issues or low ratings, one answer per ticket and user.
- The component talks to Copilot: `sendFollowUpMessageAsync` and `updateModelContextAsync` (Copilot knows what was saved and what the scorecard shows — never comments).
- Score circles fill **by area** (1 = outline only, 5 = full), so size matches the number.
- Inline ⇄ fullscreen, offline demo fallback, keyboard and screen-reader support, light and dark themes.

## Requirements

- Node.js 22.14+, a Microsoft 365 tenant with an **App Catalog**.
- **To see the components in Copilot: a Microsoft 365 Copilot license** for the user. As of October 2026, a *Copilot Chat (Basic)* account gets `403 copilot_license_required` (Microsoft's own samples too). The **Copilot Workbench works without a license**.
- Provisioning: **Windows**, **PowerShell 7**, **PnP.PowerShell 1.5.0** with `-UseWebLogin` (no Entra ID app registration).

## Quick start

```powershell
cd apps/satisfaction-survey
npm install

# SharePoint site, list and sample data
cd provisioning
Copy-Item demo.config.sample.psd1 demo.config.local.psd1   # git-ignored; set TenantUrl and Technicians
./Deploy-Demo.ps1
cd ..

# Try it in the Copilot Workbench (no license needed)
$env:SPFX_SERVE_TENANT_DOMAIN = '<tenant>.sharepoint.com'
npm run start
# → https://<tenant>.sharepoint.com/_layouts/15/copilotworkbench.aspx

# Deploy
npm run release
# Upload sharepoint/solution/satisfaction-survey.sppkg to the App Catalog → Enable → Add to Teams
```

Troubleshooting in Copilot: send `-developer on`, start a **new conversation**, repeat the prompt and open **Agent debug info** (tool Matched/Selected, arguments, MCP server URL, response).

More: [docs/deployment.md](docs/deployment.md) · [provisioning/README.md](provisioning/README.md) · [docs/demo-script.md](docs/demo-script.md) (Spanish).

## Known limitations

- Preview: Copilot canvas only (not yet Teams, Outlook or Word); no store distribution.
- A Microsoft 365 Copilot license is required to run the components in Copilot.
- With `toolDiscovery: "static"`, tool changes require republishing the agent (**Add to Teams**).
- If you rename the agent, delete `teams/*.zip` before building.

## Credits & license

Patterns from Microsoft's [Copilot UX component samples](https://github.com/pnp/spfx-copilot-apps). [MIT](LICENSE). **THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND.** Contoso is a fictional company; people and data are made up.
