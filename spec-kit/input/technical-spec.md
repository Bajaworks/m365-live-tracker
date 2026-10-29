---
generated_by_model: 'claude-opus-5-5'
generated_at: '2026-10-24T13:10:00Z'
agent_roles: 'IDE Agent + engineering-software-architect + engineering-frontend-developer'
vision_command: 'generate_spec_kit'
source_brief: 'spec-kit/input/brief.md'
source_product_prd: 'spec-kit/input/product-prd.md'
---

# Especificación técnica

## 1. Arquitectura

```
 Usuario ──► Microsoft 365 Copilot ──(intención + parámetros)──► Agente declarativo
                                                                   │  acciones = tools
                         ┌─────────────────────────────────────────┴──────────────┐
                         ▼                                                        ▼
         SatisfactionSurveyForm (inline)                  TechnicianScorecard (inline ⇄ fullscreen)
                         │  SPHttpClient (SSO, permisos del usuario)              │
                         └──────────────────────► SharePoint ◄────────────────────┘
                                   /sites/encuestas  →  lista "Encuestas"
 PnP.PowerShell 1.5.0 (-UseWebLogin) ──► crea el sitio, la lista, los permisos y los datos de ejemplo
```

- **Hosting:** el paquete `.sppkg` se sube al App Catalog del tenant (`includeClientSideAssets: true`). Con **Add to Teams** el agente se sincroniza al catálogo de agentes del tenant.
- **Un solo agente** agrupa los dos componentes (`config/copilot-agent.json → agents[0].components = [idEncuesta, idTablero]`).
- **Sin backend.** Toda la lógica corre en el cliente. Los datos se leen y escriben con REST de SharePoint usando la identidad del usuario.

## 2. Estructura del proyecto (`apps/satisfaction-survey/`)

```
apps/satisfaction-survey/
├─ config/                      # generado; se editan copilot-agent.json, config.json y package-solution.json
├─ copilot/                     # agente declarativo
│  ├─ manifest.json             # nombre y descripción del agente (Contoso)
│  ├─ declarativeAgent.json     # versión, instrucciones, frases de inicio, acciones
│  ├─ ai-plugin.json            # description_for_model
│  └─ instruction.txt           # instrucciones en español con ejemplos de intención
├─ src/
│  ├─ copilotComponents/
│  │  ├─ satisfactionSurveyForm/        # generado por el autor
│  │  │  ├─ SatisfactionSurveyFormCopilotComponent.tsx
│  │  │  ├─ SatisfactionSurveyFormCopilotComponentProperties.ts   # zod: ticketNumber?, technician?
│  │  │  ├─ ...manifest.json            # tool OpenSatisfactionSurvey, solo inline
│  │  │  ├─ components/SatisfactionSurveyForm.tsx (+ subcomponentes)
│  │  │  └─ loc/{en-us,es-es}.js, mystrings.d.ts
│  │  └─ technicianScorecard/           # el autor lo agrega con `yo @microsoft/sharepoint`
│  │     ├─ TechnicianScorecardCopilotComponent.tsx
│  │     ├─ TechnicianScorecardCopilotComponentProperties.ts      # zod: technician, period?
│  │     ├─ ...manifest.json            # tool ShowTechnicianScorecard, inline + fullscreen
│  │     ├─ components/TechnicianScorecard.tsx (+ subcomponentes)
│  │     └─ loc/...
│  └─ shared/
│     ├─ config/settings.ts             # nombre de la lista, clave de la storage entity, ruta por defecto
│     ├─ config/fields.ts               # prefijo m365live_ y nombres internos de las columnas
│     ├─ model/survey.ts                # tipos, DIMENSIONS, valores de las opciones
│     ├─ services/SiteResolver.ts       # RF-19
│     ├─ services/SurveyRepository.ts   # leer, consultar duplicados, crear
│     ├─ services/PeopleService.ts      # buscar personas, URL de la foto
│     ├─ logic/validation.ts            # reglas de RF-07
│     ├─ logic/aggregation.ts           # promedios, distribución, tendencia, fuerte y débil
│     ├─ logic/period.ts                # rangos de fechas por periodo
│     ├─ logic/scoreGeometry.ts         # valor → radio (por área)
│     └─ ui/ RatingScale.tsx, ChoiceGroup.tsx, ScoreCircle.tsx, TrendChart.tsx, DistributionBar.tsx, PersonField.tsx
├─ provisioning/
│  ├─ Connect-Demo.ps1                  # Import-Module 1.5.0 + Connect-PnPOnline -UseWebLogin
│  ├─ New-DemoSite.ps1                  # RF-15
│  ├─ New-SurveyList.ps1                # RF-16
│  ├─ Import-SampleData.ps1             # RF-17
│  ├─ Reset-DemoData.ps1                # RF-18
│  ├─ Set-DemoConfig.ps1                # RF-19 (storage entity, opcional)
│  ├─ Deploy-Demo.ps1                   # orquesta los scripts anteriores
│  ├─ demo.config.sample.psd1           # plantilla de configuración (se versiona)
│  ├─ demo.config.local.psd1            # configuración real (excluida de Git)
│  └─ sample-data/surveys.json          # ~120 respuestas con técnicos T1–T6
├─ docs/ demo-script.md, deployment.md, screenshots/
├─ tools/check-branding.js              # RF-21
├─ README.md (es), README.en.md, LICENSE (MIT)
```

## 3. Agente declarativo

- `declarativeAgent.json`:
  - `name`: "Encuestas de Satisfacción".
  - `conversation_starters`: "Calificar la atención de un ticket" y "¿Cómo va el desempeño de un técnico?".
  - `version`: se **sube con cada cambio** del agente (ver la guía de Microsoft).
- `instruction.txt` (español):
  - Rol: asistente de satisfacción de soporte de Contoso.
  - Si el usuario quiere calificar, evaluar, responder una encuesta o dar su opinión sobre una atención o un ticket → invocar `OpenSatisfactionSurvey`. Pasar `ticketNumber` y `technician` **solo si el usuario los mencionó**.
  - Si el usuario pregunta por el desempeño, las calificaciones o la satisfacción de un técnico → invocar `ShowTechnicianScorecard`. Convertir "este mes / trimestre / semestre / todo" en el valor de `period`.
  - Nunca inventar números de ticket ni nombres. Responder en el idioma del usuario. El texto completo vive en `copilot/instruction.txt`. Copilot **no repite ni inventa cifras**: el componente presenta los datos ("deja que el componente hable"), porque no hay garantía de que el modelo vea lo que el componente dibuja.
- Tools (manifiestos de los componentes): las descripciones dicen claramente cuándo usarlas y traen palabras clave en español e inglés (calificar, encuesta, satisfacción, opinión, rate, survey, feedback, desempeño, performance).

## 4. Contratos de las tools (zod → JSON Schema)

```ts
// OpenSatisfactionSurvey
z.object({
  ticketNumber: z.string().max(50).optional()
    .describe('Número de ticket mencionado por el usuario, p. ej. "4521". Omitir si no lo mencionó.'),
  technician: z.string().max(120).optional()
    .describe('Nombre o correo del técnico que atendió. Omitir si no lo mencionó.')
});

// ShowTechnicianScorecard
z.object({
  technician: z.string().max(120)
    .describe('Nombre o correo del técnico a consultar.'),
  period: z.enum(['month', 'quarter', 'semester', 'all']).optional()
    .describe('Periodo: month=último mes, quarter=últimos 3 meses (predeterminado), semester=últimos 6 meses, all=todo.')
});
```

## 5. Datos y acceso a SharePoint

### 5.1 Encontrar el sitio de datos (RF-19)

Es el mismo patrón que usa el ejemplo de Microsoft `time-off-absence` (`shared/listsSiteConfig.ts`). Ese ejemplo confirma que **dentro de Copilot no hay página de SharePoint y `pageContext.web.absoluteUrl` apunta a la raíz del tenant**.

1. `ambient = context.pageContext.web.absoluteUrl`, que es la raíz del tenant. De ahí solo se usa el **origin**.
2. `GET {ambient}/_api/web/GetStorageEntity('SatisfactionSurveySite')`. Esta llamada funciona desde cualquier sitio, incluida la raíz. Si `Value` no está vacío, se usa ese valor, que puede ser una ruta (`/sites/encuestas`) o una URL completa.
3. Si no, se usa la ruta compilada `DEFAULT_SITE_PATH = '/sites/encuestas'`.
4. `resolveSiteUrl(ambient, path)`: si es una URL completa se usa tal cual; si es una ruta, se combina con el `origin`.

**Nunca lanza error:** si cualquier paso falla, se usa la ruta por defecto. El resultado se guarda en memoria durante toda la vida del componente.

La storage entity es **opcional**. En bajaworks no hace falta porque el sitio usa la ruta por defecto. Escribirla tiene requisitos que el README debe explicar:
- Un administrador debe permitir una vez los cambios al property bag (`Set-SPOTenant -AllowWebPropertyBagUpdateWhenDenyAddAndCustomizePagesIsEnabled $true`).
- Hay que ser administrador de la colección de sitios del App Catalog.

### 5.2 Operaciones (`SurveyRepository`)

| Operación | Llamada REST |
|---|---|
| Usuario actual | `GET {site}/_api/web/currentuser?$select=Id,Email,Title` |
| Buscar duplicado | `GET {site}/_api/web/lists/getbytitle('Encuestas')/items?$select=Id,...&$filter=Title eq '{t}' and AuthorId eq {me}&$top=1` |
| Resolver técnico a Id de sitio | `POST {site}/_api/web/ensureuser` con `{ logonName: email }` → `Id`. Es el patrón probado en `time-off-absence` |
| Crear respuesta | `POST {site}/_api/web/lists/getbytitle('Encuestas')/items` con `{ Title, m365live_TechnicianId, m365live_Resolved, m365live_Understanding, m365live_Speed, m365live_Skill, m365live_Communication, m365live_WouldRecommend, m365live_Comments }`. Cabeceras: `Accept` y `Content-Type: application/json;odata=nometadata` y **`'odata-version': ''`**, como en el ejemplo. Plan B: `AddValidateUpdateItemUsingPath` con el campo Persona por claims (`[{"Key":"i:0#.f\|membership\|{email}"}]`), que no necesita `ensureuser` |
| Encuestas de un técnico | `GET .../items?$select=Id,Title,Created,m365live_Resolved,m365live_Understanding,m365live_Speed,m365live_Skill,m365live_Communication,m365live_WouldRecommend,m365live_Comments,m365live_Technician/EMail,m365live_Technician/Title&$expand=m365live_Technician&$filter=m365live_Technician/EMail eq '{email}' and Created ge datetime'{desde}'&$orderby=Created desc&$top=5000` |
| Técnicos con encuestas (para resolver nombres) | `GET .../items?$select=m365live_Technician/EMail,m365live_Technician/Title&$expand=m365live_Technician&$top=5000`, con valores únicos calculados en el cliente |
| Buscar personas (formulario) | `POST {site}/_api/SP.UI.ApplicationPages.ClientPeoplePickerWebServiceInterface.clientPeoplePickerSearchUser` (PrincipalType=1) |
| Foto | `{site}/_layouts/15/userphoto.aspx?size=S&accountname={email}` |

**Cómo se identifica al técnico en el tablero:**
- Si el parámetro es un correo, se busca por correo exacto.
- Si es un nombre, se busca entre los técnicos que tienen encuestas, sin distinguir acentos ni mayúsculas, primero por coincidencia exacta y luego por "contiene".
- Si hay 0 coincidencias, se muestra "No encontré encuestas para '{x}'" con sugerencias.
- Si hay más de una, se muestra un selector.

### 5.3 Modelo
Ver `data-model.md`.

## 6. Interfaz

- **Fluent UI v9** dentro de `FluentProvider`, con el tema del host (`webLightTheme` / `webDarkTheme`), como en el scaffold. Se mantienen `IdPrefixProvider` y `targetDocument`.
- **Se reemplaza la interfaz de ejemplo del scaffold.** Se mantienen sus patrones de bridge: `requestDisplayModeAsync`, `sendFollowUpMessageAsync` y `openLinkAsync`.
- **`RatingScale`:** `role="radiogroup"` con 5 `role="radio"`, flechas para moverse, etiqueta visible al seleccionar y sin valor inicial.
- **`ScoreCircle` (SVG):**
  - Radio exterior `R`.
  - Relleno `r = R·√((v−1)/4)`.
  - Contornos guía para los valores 2, 3 y 4 en `R·√((k−1)/4)`.
  - Valor numérico al centro o debajo.
  - `aria-label="Comunicación: 4.3 de 5"`.
  - Color de relleno: `tokens.colorBrandBackground`. No transmite significado solo por color.
- **`TrendChart`:** polilínea SVG por dimensión con puntos mensuales y leyenda con texto.
- **Tamaños:** la encuesta es inline. Si hace falta, se pide altura con `requestSizeChangeAsync`. El tablero arranca inline y "Ver detalle" llama a `requestDisplayModeAsync('fullscreen')`. La vista se adapta a `hostContext.displayMode`.

## 7. Lógica (funciones puras con pruebas)

- `validation.ts`: `validate(draft) → errors[]`. La regla del comentario: `resolved !== 'Sí' || min(dim) <= 2`.
- `period.ts`: `rangeFor(period, now)` → `{from}`. Mes = 1, trimestre = 3, semestre = 6 meses atrás desde `now`; `all` = sin filtro.
- `aggregation.ts`: `summarize(items)` → `{ n, overall, byDim: {avg, dist[5]}, resolvedPct: {si, parcial, no}, recommendPct, strongest, weakest, monthly: [{month, byDim}] }`.
  - `overall` es el promedio de los 4 promedios.
  - Si `n < 5`, `insufficient: true`.
  - Empates en la dimensión más fuerte o más débil: se usa el orden canónico de las dimensiones.
- `scoreGeometry.ts`: `fillRadius(v, R)`, que limita `v` a [1, 5].

## 8. Aprovisionamiento (PnP.PowerShell 1.5.0)

- Cada script empieza con `Import-Module PnP.PowerShell -RequiredVersion 1.5.0 -Force`, porque en la máquina del autor también está `SharePointPnPPowerShellOnline` 3.29.
- La conexión es siempre `Connect-PnPOnline -Url $url -UseWebLogin`. Solo funciona en Windows.
- Configuración en `demo.config.local.psd1` (excluido de Git):
  ```powershell
  @{ TenantUrl = 'https://<tenant>.sharepoint.com'; SiteAlias = 'encuestas'; SiteTitle = 'Encuestas de Satisfacción'; Lcid = 3082; FieldPrefix = 'm365live_'
     Technicians = @('ana.lopez@<dominio>', ...) }   # 3 a 6 usuarios del tenant, en el orden T1…T6
  ```
- **Técnicos de ejemplo = usuarios ficticios SIN licencia.** El tenant del autor tiene solo 2 licencias. Los técnicos se crean como usuarios en Entra ID (centro de administración → Agregar usuario → *Crear usuario sin licencia*), lo que no tiene costo. No necesitan iniciar sesión: solo existir, para que el campo Persona los resuelva. El README explica este paso para quien clone el repo. Los dos usuarios con licencia hacen otro papel: el dueño del sitio responde en vivo y el segundo es la cuenta **sin permisos de administrador** para la prueba P5.
- `New-DemoSite.ps1`:
  - `New-PnPSite -Type CommunicationSite -Title -Url -Lcid -Wait`, conectando a la URL raíz del tenant.
  - Si el sitio ya existe (se comprueba conectándose a él), se reutiliza.
  - Español = LCID 3082. La plantilla es "Tema" (sitio de comunicación vacío).
- `New-SurveyList.ps1` (idempotente: comprueba antes de crear cada cosa):
  - Crea la lista genérica `Encuestas`. El campo `Title` se renombra a "Ticket #" y se indexa.
  - Agrega los campos de `data-model.md` con `Add-PnPField` (o `-FieldXml` donde haga falta). Indexa `m365live_Technician`.
  - Crea la vista "Todas las encuestas" con las columnas principales.
  - **Permisos:**
    - Rompe la herencia de la lista.
    - Da Contribute a *Everyone except external users* (`c:0-.f|rolemanager|spo-grid-all-users/{tenantId}`).
    - Configura `ReadSecurity=1` (todos leen todo) y `WriteSecurity=2` (cada quien edita solo lo suyo).
- `Import-SampleData.ps1`:
  - Lee `sample-data/surveys.json`.
  - Relaciona T1…T6 con `Technicians[i]`. Si hay menos de 6 técnicos, se omiten los perfiles que sobran.
  - Crea cada respuesta con `Add-PnPListItem`.
  - Después ejecuta `Set-PnPListItem -UpdateType UpdateOverwriteVersion -Values @{Created=..; Modified=..}`.
  - Marca cada elemento con `m365live_IsSample = $true`.
- `Reset-DemoData.ps1 [-OnlyLive] [-Reseed]`: con `-OnlyLive` borra solo los elementos con `m365live_IsSample = $false`, es decir, los creados durante la demo.
- `Set-DemoConfig.ps1` (opcional): `Set-PnPStorageEntity -Key 'SatisfactionSurveySite' -Value '/sites/<alias>' -Scope Tenant`, conectado al App Catalog. Requisitos: permitir los cambios al property bag (lo hace una vez un administrador) y ser administrador de la colección de sitios del App Catalog. Si falla, solo muestra una advertencia, porque la ruta por defecto sigue funcionando.
- Las funciones `Ensure-List` y `Ensure-Field` siguen el mismo patrón idempotente que `copilot-readiness-action-centre/scripts/provision.ps1` (comprobar → crear). A diferencia de los ejemplos de Microsoft, que usan `-ClientId` porque PnP 2.2+ ya no trae una aplicación de Entra predeterminada, aquí se usa **`-UseWebLogin`** con PnP 1.5.0, así que no hace falta registrar ninguna aplicación.

## 9. Datos de ejemplo (`surveys.json`)

Se generan una sola vez de forma determinista (con una semilla fija) y se versionan para poder revisarlos.

| Perfil | Usuario ficticio sugerido | Historia | Respuestas |
|---|---|---|---|
| T1 | Ana López | Comunicación alta, **Rapidez baja**. Es la protagonista del guion | ~30 |
| T2 | Sofía Herrera | Excelente en todo | ~25 |
| T3 | Luis Ramírez | **Mejora mes a mes** (de 2.5 a 4.5) | ~25 |
| T4 | Diego Torres | Habilidad alta, Comunicación baja | ~20 |
| T5 | Carmen Vega | Regular | ~16 |
| T6 | Jorge Mendoza | **Solo 3 respuestas** (para mostrar "datos insuficientes") | 3 |

Ana es T1 para que, si solo se configuran 3 técnicos, la protagonista del guion siempre tenga datos.

Los comentarios son ficticios, en español y consistentes con las calificaciones. Los números de ticket son únicos y van del 1000 al 3999. **Del 4000 en adelante se reservan para la demo en vivo** (p. ej. 4521), para que no choquen con la regla de no duplicar. Las fechas se reparten en los últimos 6 meses y se calculan relativas al día en que se ejecuta el script, para que la demo siempre tenga datos recientes.

## 10. Calidad, build y despliegue

- `npm run build` ejecuta `heft test --clean --production && heft package-solution --production`. Las pruebas unitarias de jest viven junto al código (`*.test.ts`).
- Durante el desarrollo: `npm run start` y luego `https://<tenant>.sharepoint.com/_layouts/15/copilotworkbench.aspx`.
- Despliegue:
  1. Subir `solution/satisfaction-survey.sppkg` al App Catalog.
  2. Activarlo.
  3. **Add to Teams**.
  4. Esperar la sincronización y probar en Copilot Chat.
  5. Hacerlo **24–48 h antes del evento**.
- `tools/check-branding.js` busca `Konica|Minolta|KMBS|SKNA|bajaworks` (sin distinguir mayúsculas) en `apps/satisfaction-survey/` y en los docs públicos, sin contar `node_modules`, `lib`, `temp` ni los archivos `*.local.*`. Si encuentra algo, termina con error. Se ejecuta antes de cada commit o publicación.

## 11. Riesgos técnicos y validaciones previas (spikes del Sprint 1)

| # | Riesgo | Validación |
|---|---|---|
| R1 | ~~Qué devuelve `pageContext.web.absoluteUrl` dentro de Copilot~~ | **Resuelto** con el ejemplo `time-off-absence`: devuelve la raíz del tenant. Se aplica el patrón de §5.1 |
| R2 | Escribir el campo Persona desde Copilot (ensureuser + `m365live_TechnicianId`) | El patrón ya está probado en `time-off-absence`. Solo falta confirmarlo con un usuario sin permisos de administrador (emanuel). Plan B: AddValidate |
| R3 | Que `clientPeoplePickerSearchUser` responda desde el host de Copilot | Prueba en el Workbench. Plan B: elegir el técnico de una lista de quienes ya tienen encuestas |
| R4 | Que `Set-PnPListItem -UpdateType UpdateOverwriteVersion` cambie `Created` en la versión 1.5.0 | Probarlo con 1 elemento (el parámetro ya se verificó que existe) |
| R5 | Que `Get-PnPTenantId` y el claim de *Everyone except external users* funcionen en 1.5.0 | Probarlo. Plan B: pasar el TenantId como parámetro en la configuración local |
| R6 | Cambios en la preview entre rc.0 y GA | Fijar versiones en `package.json`; actualizar solo después de probar |
| R7 | Retraso en la sincronización del agente | Desplegar con anticipación; subir `version` en cada cambio |
| R8 | Que los usuarios sin licencia se resuelvan en el campo Persona (al importar con PnP y en el selector del formulario) | Spike en S1 con 1 usuario sin licencia. Plan B: asignarles temporalmente una licencia de prueba o usar solo los 2 usuarios con licencia |
| R10 | **Zips de agente viejos en `teams/`.** El build escribe el paquete del agente en `teams/<nombre-del-agente>.zip` y el empaquetado mete **todos** los zips de esa carpeta en el `.sppkg`. Si cambia el nombre del agente, el zip anterior se queda ahí y desplegaría un segundo agente. Se detectó el 2026-10-24 al renombrar el agente | Borrar `teams/*.zip` antes de compilar cuando cambie el nombre del agente; `teams/*.zip` está en `.gitignore`. El build de rc.0 sube solo la versión hotfix del manifiesto (`teams/.copilot-agent-hotfix.json`). El nombre del zip sale de `config/copilot-agent.json → name` (el build elimina todo carácter fuera de a-z, 0-9 y -), por eso ahí va **sin acento** ("Encuestas de Satisfaccion" → `encuestas-de-satisfaccion.zip`). El nombre visible con acento vive en `copilot/manifest.json` y `declarativeAgent.json` |
| R11 | **Licencia de Microsoft 365 Copilot obligatoria** para ejecutar componentes en Copilot (403 `copilot_license_required`, observado el 2026-10-24 con una cuenta *Copilot Chat Basic*; también falla el ejemplo My Day) | Asignar una licencia de Microsoft 365 Copilot a la cuenta del presentador (y a la de la prueba sin permisos de administrador). Plan B para la sesión: demo en el **Copilot Workbench**, que no exige licencia. Documentarlo en el README como requisito |
| R9 | Estilos de Fluent v9 dentro del iframe de Copilot. Los ejemplos (beta.2, React 17) tuvieron que inyectar los tokens del tema como variables CSS en línea (`themeVars.ts`) | Con rc.0 y React 18 debería bastar `FluentProvider` + `targetDocument` (como en el scaffold). Si en Copilot se ve sin estilos, se aplica el mismo `themeToCssVars` del ejemplo |

## 12. Patrones adoptados de los ejemplos de Microsoft (`pnp/spfx-copilot-apps`)

Revisados en la copia local del autor. Los ejemplos usan **SPFx 1.24.0-beta.2 + React 17** (`ReactDOM.render`); este proyecto usa **rc.0 + React 18** (`createRoot`), así que se copian los **patrones**, no el código de montaje.

| Patrón | Ejemplo | Cómo se aplica aquí |
|---|---|---|
| Sitio de datos = origin del contexto + ruta compilada, que se puede reemplazar con una storage entity | `time-off-absence/shared/listsSiteConfig.ts` | §5.1 (`SiteResolver`) |
| **Puerto HTTP**: el servicio de datos no conoce tipos de SPFx; una fábrica adapta `SPHttpClient` a una interfaz `{ get, post }` | `createTimeOffDataService.ts` | `SurveyRepository` recibe un `IHttpPort`; la fábrica vive en cada componente. Así se puede probar con jest sin SPFx |
| `ensureuser` → Id + `POST items` con `odata=nometadata` y `'odata-version': ''` | `SharePointTimeOffDataService.ts` | §5.2 |
| **Nunca lanzar error en la carga** y recurrir a datos en memoria | `InMemoryTimeOffDataService.ts` | **Tablero**: si falla la lectura, muestra los datos de ejemplo del JSON con una etiqueta visible **"Datos de demostración (sin conexión)"**. Sirve como plan B en el escenario. **Encuesta**: nunca finge un envío exitoso; muestra el error y permite reintentar |
| **Contador `propertiesVersion`**: cuando Copilot vuelve a invocar la tool con el componente ya montado, se reinicia el estado local | `TimeOffOverviewCopilotComponent.tsx` | Los dos componentes. Por ejemplo, pedir el tablero de Ana y luego el de Luis en la misma conversación |
| Lógica pura en `logic/` con pruebas `*.test.ts` junto al código | `time-off-absence/*/logic` | §7 |
| Una tool por componente, con instrucciones del tipo "cuando el usuario pida X, llama a Y" y "deja que el componente hable" (no repetir los datos en texto) | `time-off-absence/copilot/instruction.txt` | §3 |
| Script de aprovisionamiento idempotente con `Ensure-List` / `Ensure-Field` | `copilot-readiness-action-centre/scripts/provision.ps1` | §8 |
