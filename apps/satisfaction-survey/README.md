# Encuestas de Satisfacción — Copilot UX components (SPFx 1.24)

![SPFx](https://img.shields.io/badge/SPFx-1.24.0--rc.0-yellow.svg) ![React](https://img.shields.io/badge/React-18-61DAFB.svg) ![Node](https://img.shields.io/badge/Node.js-22.x-339933.svg) ![Modes](https://img.shields.io/badge/Modes-inline%20%2B%20fullscreen-5B3EE8.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg)

*[English version](README.en.md)*

Ejemplo de **Copilot UX components** (antes *SharePoint Copilot Apps*) creado para una sesión técnica. Un agente de Microsoft 365 Copilot con **dos componentes interactivos** que se dibujan dentro del chat:

| Componente | Herramienta | Qué hace |
|---|---|---|
| **Encuesta** | `OpenSatisfactionSurvey` | Formulario de satisfacción de un ticket de soporte, con el ticket y el técnico precargados desde la conversación. Guarda en una lista de SharePoint. |
| **Tablero** | `ShowTechnicianScorecard` | Desempeño consolidado de un técnico en **Comprensión, Rapidez, Habilidad y Comunicación**: un círculo por dimensión, tendencia mensual, distribución y comentarios. |

Todo con la identidad del usuario (SSO), sin backend, desplegado desde el App Catalog. Empresa y datos ficticios (Contoso).

> **Preview.** Copilot UX components está en preview pública (SPFx 1.24 rc.0). Las APIs pueden cambiar. No lo uses en producción.

![Tablero en pantalla completa](docs/screenshots/scorecard-fullscreen.png)

## Qué muestra este ejemplo

- **Detección de intención con parámetros:** "quiero calificar el ticket 4521, me ayudó Ana" → la encuesta se abre con `ticketNumber` y `technician`.
- **Formulario rediseñado:** Sí / Parcialmente / No; cuatro escalas 1–5 sin valor preseleccionado y con etiqueta en cada punto; el comentario se vuelve obligatorio si el problema no se resolvió del todo o hay una calificación ≤ 2; una respuesta por ticket y usuario.
- **Hablarle a Copilot desde el componente:** `sendFollowUpMessageAsync` (botón *Ver desempeño*) y `updateModelContextAsync` (Copilot sabe qué se guardó y qué muestra el tablero, sin comentarios).
- **Círculos por dimensión:** 1 = solo el contorno, 5 = lleno. El relleno crece **por área**, para que el tamaño sea fiel al número.
- **Inline ⇄ pantalla completa** con `requestDisplayModeAsync`.
- **Plan B sin conexión:** si no se puede leer la lista, el tablero muestra datos de ejemplo con una etiqueta visible.
- **Accesible y bilingüe:** teclado y lector de pantalla, tema claro y oscuro, es-MX, es-ES y en-US.

## Requisitos

- Node.js 22.14+ (SPFx 1.24) y `npm install -g @rushstack/heft` (opcional).
- Un tenant de Microsoft 365 con **App Catalog** y permisos para desplegar en él.
- **Para ver los componentes en Copilot real: una licencia de Microsoft 365 Copilot** para el usuario. En octubre de 2026, una cuenta *Copilot Chat (Basic)* recibe `403 copilot_license_required` (también con los ejemplos de Microsoft). El **Copilot Workbench funciona sin licencia**.
- Para el aprovisionamiento: **Windows**, **PowerShell 7** y **PnP.PowerShell 1.5.0** (`Install-Module PnP.PowerShell -RequiredVersion 1.5.0 -Scope CurrentUser`). Usa `-UseWebLogin`, así que no hace falta registrar una aplicación en Entra ID.

## Paso a paso

### 1. Instalar
```powershell
git clone <este repositorio>
cd apps/satisfaction-survey
npm install
```

### 2. Crear el sitio, la lista y los datos de ejemplo
```powershell
cd provisioning
Copy-Item demo.config.sample.psd1 demo.config.local.psd1   # excluido de Git
# Edita demo.config.local.psd1: TenantUrl y Technicians (T1…T6)
./Deploy-Demo.ps1
```
Crea `https://<tenant>.sharepoint.com/sites/encuestas`, la lista **Encuestas** (columnas `m365live_*`) y hasta 119 respuestas ficticias repartidas en 6 meses. Detalles en [provisioning/README.md](provisioning/README.md).

> Los técnicos deben existir en Entra ID. Si usas menos de 6, puedes elegir perfiles: `Technicians = @{ T1 = 'a@…'; T3 = 'b@…' }`.

### 3. Probar en el Copilot Workbench (sin licencia)
```powershell
$env:SPFX_SERVE_TENANT_DOMAIN = '<tenant>.sharepoint.com'
npm run start
```
Abre `https://<tenant>.sharepoint.com/_layouts/15/copilotworkbench.aspx` y prueba:

| Componente | Parámetros |
|---|---|
| OpenSatisfactionSurvey | `{ "ticketNumber": "4521", "technician": "<nombre>" }` |
| ShowTechnicianScorecard | `{ "technician": "<nombre>" }` · `{ "technician": "<nombre>", "period": "month" }` |

### 4. Desplegar
```powershell
npm run release        # sube la versión del paquete y compila
```
1. Sube `sharepoint/solution/satisfaction-survey.sppkg` al **App Catalog** → *Enable this app and add it to all sites*.
2. Selecciona la app → **Add to Teams** (publica el agente en Copilot).
3. Abre Microsoft 365 Copilot → *Agentes* → **Encuestas de Satisfacción**.

Guía completa, matriz de pruebas y checklist: [docs/deployment.md](docs/deployment.md).

### 5. Si algo no funciona en Copilot: `-developer on`
En el chat con el agente envía `-developer on`, abre una **conversación nueva** y repite la frase. En **Agent debug info** verás si la herramienta quedó *Matched/Selected*, con qué argumentos se llamó, a qué servidor MCP y qué respondió. Tabla de errores frecuentes en [docs/deployment.md](docs/deployment.md#diagnóstico-en-copilot--developer-on).

## Configuración

| Qué | Dónde |
|---|---|
| Ruta del sitio de datos (predeterminada `/sites/encuestas`) | `src/shared/config/settings.ts`, o la propiedad del tenant `SatisfactionSurveySite` con `provisioning/Set-DemoConfig.ps1` |
| Prefijo de columnas (`m365live_`) | `src/shared/config/fields.ts` y `FieldPrefix` en `demo.config.local.psd1` |
| Instrucciones del agente | `copilot/instruction.txt` |
| Descubrimiento de herramientas | `config/copilot-agent.json` → `toolDiscovery: "static"` |

## Estructura

```
apps/satisfaction-survey/
├─ copilot/                     agente declarativo (manifest, instrucciones, frases de inicio)
├─ config/copilot-agent.json    un agente con los dos componentes
├─ src/copilotComponents/
│  ├─ satisfactionSurveyForm/   encuesta (OpenSatisfactionSurvey)
│  └─ technicianScorecard/      tablero (ShowTechnicianScorecard)
├─ src/shared/                  modelo, configuración, acceso a SharePoint, lógica y controles (con pruebas)
├─ provisioning/                scripts PnP.PowerShell 1.5.0 y datos de ejemplo
├─ tools/                       generador de datos, verificación de marcas, versión del paquete
└─ docs/                        despliegue, guion de la demo, matriz de intención, spikes
```

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run start` | Servidor local para el Copilot Workbench |
| `npm run build` | Pruebas, compilación de producción y `.sppkg` |
| `npm run release` | Sube la *App version* y ejecuta `build` |
| `npm run sample-data` | Regenera los datos de ejemplo (deterministas) |
| `npm run check-branding` | Falla si aparece una marca real o un tenant concreto |

## Limitaciones conocidas

- Preview: los componentes solo se dibujan en Microsoft 365 Copilot (todavía no en Teams, Outlook ni Word) y no se distribuyen por la tienda.
- Licencia de Microsoft 365 Copilot requerida para ejecutar los componentes en Copilot real (ver Requisitos).
- Con `toolDiscovery: "static"`, cualquier cambio en las herramientas obliga a volver a publicar el agente (**Add to Teams**).
- Si cambias el nombre del agente, borra `teams/*.zip` antes de compilar: el empaquetado incluye todos los zips de esa carpeta.

## Créditos

Basado en los patrones de los [ejemplos de Microsoft para Copilot UX components](https://github.com/pnp/spfx-copilot-apps) (en especial *time-off-absence*). Documentación: [Overview of Copilot UX components](https://learn.microsoft.com/sharepoint/dev/spfx/copilot/overview-copilot-apps) · [Troubleshoot Copilot UX components](https://learn.microsoft.com/sharepoint/dev/spfx/copilot/troubleshooting-copilot-ux-components).

## Licencia y aviso

[MIT](LICENSE). **ESTE CÓDIGO SE PROPORCIONA *TAL CUAL*, SIN GARANTÍAS DE NINGÚN TIPO, EXPRESAS O IMPLÍCITAS.** Contoso es una empresa ficticia; las personas y los datos de ejemplo son inventados.
