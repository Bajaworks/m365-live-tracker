---
generated_by_model: "claude-opus-5-5"
generated_at: "2026-10-24T17:30:00Z"
agent_roles: "IDE Agent + engineering-technical-writer + project-manager-senior"
vision_command: "start_sprint --sprint 4"
sprint_number: 4
task_id: "T-003"
---

# Guion de la demo · Copilot UX components (60 min)

**Audiencia:** profesionales de TI y desarrolladores de SharePoint. **Idioma:** español.
**Formato (opción C):** demo en vivo en el **Copilot Workbench** y diagnóstico en Copilot real con `-developer on`. Si hay licencia de Microsoft 365 Copilot el día del evento, los bloques 2 y 4 pasan a Copilot real con las mismas frases.

| Bloque | Min. | Contenido |
|---|---|---|
| 1. Qué son los Copilot UX components | 0–10 | Concepto, estado y licencia |
| 2. Demo como usuario | 10–20 | Encuesta → envío → tablero |
| 3. Cómo se construyó | 20–40 | Scaffolding, herramientas, agente, datos, despliegue |
| 4. Diagnóstico en Copilot real | 40–47 | `-developer on` y el 403 de licencia |
| 5. Limitaciones y roadmap | 47–50 | Lo que hay que saber antes de adoptarlo |
| 6. Preguntas y repositorio | 50–60 | Enlace al repo y cierre |

---

## 1. Qué son (0–10 min)

Mensajes clave:
- Componentes interactivos de **SPFx 1.24** que se dibujan **dentro del chat de Microsoft 365 Copilot**, en lugar de devolver solo texto.
- Mismo toolchain de SPFx (heft, TypeScript, React). Se empaquetan en un `.sppkg` y se despliegan en el **App Catalog**. Sin servidores ni infraestructura propios.
- Cada componente expone una **herramienta** (tool) para un **agente declarativo**. Copilot detecta la intención y llama la herramienta con parámetros.
- Llaman a SharePoint y Graph **con la identidad del usuario** (SSO), algo que el modelo de MCP Apps por sí solo no ofrece.
- **Nombre:** se anunció en julio de 2026 como *SharePoint Copilot Apps*, luego *Copilot Components* y, desde el 30 de septiembre, **Copilot UX components**.
- **Estado:** preview pública (SPFx 1.24 rc.0); GA prevista para octubre de 2026.
- **Licencia:** la preview decía que no hacía falta. Hoy, en Copilot real, el servicio responde `403 copilot_license_required` a una cuenta sin licencia (lo veremos en el bloque 4).

## 2. Demo como usuario (10–20 min)

**Antes de empezar:** `npm run start` corriendo; Workbench abierto en `https://<tenant>.sharepoint.com/_layouts/15/copilotworkbench.aspx`; lista reiniciada con `Reset-DemoData.ps1 -OnlyLive`. Usa tickets del **4000 en adelante**.

1. **Encuesta con contexto.** Componente *OpenSatisfactionSurvey*, parámetros:
   ```json
   { "ticketNumber": "4521", "technician": "Emanuel" }
   ```
   → El ticket y el técnico llegan precargados, con foto. *"Copilot extrae estos dos valores de la frase del usuario; aquí los escribimos a mano porque el Workbench simula a Copilot."*
2. **Experiencia rediseñada.** Señala: sin valor preseleccionado, cada punto con su etiqueta, "Faltan N respuestas".
3. **Regla del comentario.** Califica **Rapidez = 2** → el comentario cambia a *"¿Qué pudimos hacer mejor?"* y se vuelve obligatorio.
4. **Enviar.** Mensaje de confirmación con los 4 círculos. Abre la lista de SharePoint en otra pestaña y muestra la fila nueva.
5. **Sin duplicados.** *Calificar otro ticket* → escribe `4521` otra vez → *"Ya respondiste la encuesta de este ticket"*.
6. **Tablero.** Componente *ShowTechnicianScorecard*:
   ```json
   { "technician": "Emanuel" }
   ```
   → Vista inline: calificación general, 4 círculos, fortaleza (Comunicación) y área de mejora (Rapidez).
7. **Ver detalle** (o *Expand*) → pantalla completa: cambia el periodo, señala la tendencia, pasa el mouse por un mes, *Ver como tabla*, comentarios sin autor.
8. **Datos insuficientes.**
   ```json
   { "technician": "Haaron", "period": "month" }
   ```
   → *"Solo hay 2 encuestas…"* y el botón *Ver todo el historial*.

Frase de cierre del bloque: *"El círculo se llena por área, no por radio: un 3 llena la mitad del círculo. Así el tamaño que ves es fiel al número."*

## 3. Cómo se construyó (20–40 min)

| Paso | Qué mostrar | Archivo |
|---|---|---|
| Scaffolding | `yo @microsoft/sharepoint` → *Copilot Component* → React. Un segundo `yo` en la misma carpeta agrega el tablero: **un agente, dos componentes** | `config/copilot-agent.json` |
| La herramienta | Nombre, descripción (cuándo usarla) y modos de pantalla | [manifest de la encuesta](../src/copilotComponents/satisfactionSurveyForm/SatisfactionSurveyFormCopilotComponent.manifest.json#L14) |
| Los parámetros | Esquema **zod** con `.describe()`: es lo que lee Copilot para llenar los valores | [Properties.ts](../src/copilotComponents/satisfactionSurveyForm/SatisfactionSurveyFormCopilotComponentProperties.ts#L18) |
| El componente | `BaseCopilotComponent`, `render()`, `hostContext` (tema y modo) | [CopilotComponent.tsx](../src/copilotComponents/satisfactionSurveyForm/SatisfactionSurveyFormCopilotComponent.tsx#L40) |
| Hablarle a Copilot | `sendFollowUpMessageAsync` (botón *Ver desempeño*) y `updateModelContextAsync` (Copilot sabe qué se guardó) | [L118](../src/copilotComponents/satisfactionSurveyForm/SatisfactionSurveyFormCopilotComponent.tsx#L118) · [L122](../src/copilotComponents/satisfactionSurveyForm/SatisfactionSurveyFormCopilotComponent.tsx#L122) |
| El "gotcha" del sitio | En Copilot no hay página: el sitio actual es la **raíz del tenant**. Origin + `/sites/encuestas` o propiedad del tenant | [SiteResolver.ts](../src/shared/services/SiteResolver.ts#L49) |
| Escribir en SharePoint | `ensureuser` → `POST items` con el campo Persona por Id | [SurveyRepository.ts](../src/shared/services/SurveyRepository.ts#L190) |
| El círculo | Relleno por área: `R·√((v−1)/4)` | [scoreGeometry.ts](../src/shared/logic/scoreGeometry.ts#L26) · [ScoreCircle.tsx](../src/shared/ui/ScoreCircle.tsx#L60) |
| Pantalla completa | `requestDisplayModeAsync('fullscreen')` | [TechnicianScorecard.tsx](../src/copilotComponents/technicianScorecard/components/TechnicianScorecard.tsx#L287) |
| El agente | Instrucciones: cuándo llamar cada herramienta, no inventar datos, nunca imitar el formulario | [instruction.txt](../copilot/instruction.txt#L3) |
| Descubrimiento de herramientas | `toolDiscovery: "static"` fija la lista en el paquete | [copilot-agent.json](../config/copilot-agent.json#L15) |
| Datos | PnP.PowerShell 1.5.0 con `-UseWebLogin`: sitio, lista con prefijo `m365live_`, 55–119 respuestas de ejemplo con fechas en el pasado | `provisioning/` |
| Desplegar | `npm run release` → App Catalog → **Add to Teams** (publica el agente) | `docs/deployment.md` |

Puntos para remarcar:
- **Copilot elige la herramienta por tres textos:** instrucciones, descripción de la herramienta y `.describe()` de cada parámetro. No hay "keywords".
- **Dos versiones distintas:** *App version* del App Catalog (`package-solution.json`) y la del agente (`teams/.copilot-agent-hotfix.json`, la sube el build).
- **Si cambia el nombre del agente,** borra `teams/*.zip`: el empaquetado mete todos los zips de esa carpeta.

## 4. Diagnóstico en Copilot real (40–47 min)

Ten abierto Copilot con el agente **Encuestas de Satisfacción**.

1. Envía `-developer on` → *Successfully enabled developer mode*.
2. **Conversación nueva** con el mismo agente (en la misma no aparece la tarjeta).
3. Envía: *"Quiero calificar la atención del ticket 4600, me ayudó Emanuel"*.
4. Abre **Agent debug info** y recorre:
   - **Agent version**: la que acabamos de publicar.
   - **Actions**: `OpenSatisfactionSurvey` → *Matched* ✓ → *Selected* ✓. *"Copilot entendió la intención."*
   - **Executed actions** → ⌄: **Tool Arguments** `{"ticketNumber":"4600","technician":"Emanuel"}` *"…y sacó los parámetros de mi frase"*; **MCP Server Url** `…/_api/mcp/beta/spfx?solutionId=…` *"…y llamó a nuestra solución"*; **Response data** `403 … copilot_license_required`.
5. Lección: *"Todo lo nuestro funciona; lo que falta es la licencia del usuario. Antes de depurar código, mira esta tarjeta."*

Si no hay red o el chat tarda: muestra la captura `docs/screenshots/developer-mode-403.png`.

## 5. Limitaciones y roadmap (47–50 min)

- Preview: APIs y esquemas pueden cambiar; hoy solo se dibuja en Copilot (no en Teams, Outlook ni Word).
- No se distribuye por la tienda (AppSource) durante la preview.
- Licencia: 403 `copilot_license_required` para usuarios sin Microsoft 365 Copilot (observado en octubre de 2026).
- El build sube solo la versión del agente; *App version* del paquete se sube aparte.
- La sincronización del agente puede tardar: publica **24–48 h antes** de una demo.

## 6. Preguntas y repositorio (50–60 min)

Muestra el enlace al repositorio y el README: con PnP.PowerShell, cualquiera puede crear el sitio, la lista y los datos de ejemplo en su tenant y probar en el Workbench sin licencia.

---

## Checklist del presentador

**T−1 h**
- [ ] `Reset-DemoData.ps1 -OnlyLive` (borra los ensayos).
- [ ] `npm run start` corriendo; Workbench abierto y probado una vez.
- [ ] Pestañas: Workbench · lista *Encuestas* · VS Code con los archivos del bloque 3 · Copilot con el agente.
- [ ] Copilot: `-developer on` ya activado en una conversación previa.
- [ ] Video y capturas del plan B abiertos en otra ventana.
- [ ] Red probada (cable mejor que Wi-Fi); hotspot de respaldo.
- [ ] Zoom del navegador al 125 % para que se lea en pantallas pequeñas.

**Si la sesión es por Teams (virtual)**
- [ ] Fondo del evento aplicado en Teams (*Efectos de fondo → Agregar nuevo*). La imagen está en `refdocs/event/`, que no se publica porque lleva logos del evento y de los patrocinadores.
- [ ] Compartir **una ventana** (el navegador del Workbench), no toda la pantalla: así no se ven notificaciones ni otras pestañas. Para el bloque 3 cambia a la ventana de VS Code.
- [ ] Notificaciones desactivadas (*Foco* de Windows, Teams y Outlook en "No molestar").
- [ ] Un segundo monitor con el guion y el chat de la sesión; o el guion impreso.
- [ ] Prueba de audio y cámara 10 minutos antes; cierra apps que usen mucho ancho de banda (OneDrive, actualizaciones).
- [ ] Tema oscuro en el Workbench si quieres que combine con el fondo azul marino del evento.

## Plan B

| Si falla… | Haz esto |
|---|---|
| El Workbench no carga (red) | Video `docs/plan-b.mp4` desde el bloque 2 |
| SharePoint no responde | El tablero muestra **Datos de demostración**: dilo y sigue |
| Copilot real tarda o no responde | Captura `developer-mode-403.png` |
| Se te acaba el tiempo | Salta el bloque 5; los puntos clave están en el README |

Lista de capturas y guía de grabación: `docs/screenshots/README.md`.
