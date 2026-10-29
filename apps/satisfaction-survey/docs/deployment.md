---
generated_by_model: "gpt-6"
generated_at: "2026-10-24T16:05:24Z"
agent_roles: "engineering-technical-writer + testing-reality-checker"
vision_command: "continue_sprint --sprint 4"
sprint_number: 4
task_id: "T-002"
---

# Probar y desplegar

## 1. Probar en el Copilot Workbench (sin desplegar)

```powershell
cd apps/satisfaction-survey
$env:SPFX_SERVE_TENANT_DOMAIN = '<tenant>.sharepoint.com'
npm run start
```

1. Abre `https://<tenant>.sharepoint.com/_layouts/15/copilotworkbench.aspx` e inicia sesión.
2. Elige el componente **OpenSatisfactionSurvey**.
3. Prueba primero sin parámetros y después con `{ "ticketNumber": "4521", "technician": "<nombre de un técnico>" }`.
4. El Workbench carga el código desde `localhost:4321`; los cambios se recargan solos.

> No ejecutes `npm run build` mientras `npm run start` está corriendo: los dos compilan la misma carpeta y el build falla con errores `ENOENT` en `lib-commonjs`.

### Casos de prueba (test-plan §2)

| # | Caso | Esperado |
|---|---|---|
| W1 | Sin parámetros | Ticket y técnico vacíos; "Faltan N respuesta(s)"; Enviar deshabilitado |
| W2 | Con `ticketNumber` y `technician` | Ticket lleno; técnico con foto (si el nombre no es ambiguo) |
| W3 | Responder todo y enviar | Mensaje "¡Gracias!", resumen con 4 círculos; nuevo elemento en la lista con *Creado por* = tú |
| W4 | Volver a escribir el mismo ticket | "Ya respondiste la encuesta de este ticket" con tu respuesta |
| W5 | Calificar un 2 o marcar "No" | El comentario pasa a obligatorio: "¿Qué pudimos hacer mejor?" |
| W10 | Tema oscuro | Textos legibles, botones y círculos visibles |
| R2 | Enviar con la cuenta **sin permisos de administrador** | Se guarda; no puede editar respuestas de otros en la lista |
| R3 | Buscar un técnico escribiendo 2+ letras | Aparecen sugerencias |
| R9 | Ver el formulario dentro de Copilot | Con estilos (no texto plano con fuente serif) |

Los números de ticket **del 4000 en adelante** quedan libres para pruebas; los datos de ejemplo usan del 1000 al 3999. Después de cada ensayo: `provisioning/Reset-DemoData.ps1 -OnlyLive`.

## 2. Desplegar en el tenant

1. Detén `npm run start` y ejecuta **`npm run release`**. Sube la versión del paquete SharePoint (la columna *App version* del App Catalog, en `config/package-solution.json`) y luego compila. Usa `npm run build` solo para compilar sin cambiar la versión. Genera:
   - `sharepoint/solution/satisfaction-survey.sppkg` (componentes + agente)
   - `teams/encuestas-de-satisfaccion.zip` (paquete del agente, ya incluido en el `.sppkg`)
2. **App Catalog** → *Apps for SharePoint* → **Upload** del `.sppkg` → **Deploy** (habilitar en todos los sitios).
3. Selecciona la app → **Add to Teams**. Esto publica el agente "Encuestas de Satisfacción" en el catálogo de agentes del tenant.
4. Espera la sincronización (puede tardar). Abre **Microsoft 365 Copilot** → *Agentes* → **Encuestas de Satisfacción**.

Cada build sube solo la versión del manifiesto del agente (`teams/.copilot-agent-hotfix.json`), así que una nueva subida no choca con la anterior. Si cambias el **nombre** del agente, borra `teams/*.zip` antes de compilar (riesgo R10).

## 3. Matriz de intención (sprint 2: I1–I5, I11)

Para el sprint 4 usa [la matriz I1–I15 y su registro de tres corridas](intent-matrix.md). La tabla siguiente conserva el alcance del sprint 2.

En Copilot, con el agente seleccionado. Anota ✓/✗ y qué parámetros llegaron.

| # | Frase | Esperado | Resultado |
|---|---|---|---|
| I1 | "Quiero calificar la atención del ticket 4521, me ayudó <técnico>" | Encuesta con 4521 y el técnico | |
| I2 | "Responder la encuesta de satisfacción" | Encuesta vacía | |
| I3 | "¿Cómo me atendieron? Quiero dejar mi opinión del soporte" | Encuesta vacía | |
| I4 | "Evaluar al técnico que resolvió mi problema de VPN" | Encuesta **sin** ticket inventado | |
| I5 | "Rate my support ticket 4600" | Encuesta con 4600 | |
| I11 | "¿Qué es una encuesta de satisfacción?" | Respuesta en texto, **sin** componente | |

## Diagnóstico en Copilot: `-developer on`

Cuando el agente responde en texto o dice que la herramienta "no está disponible":

1. En el chat con el agente, envía `-developer on` (responde "Successfully enabled developer mode").
2. Abre una **conversación nueva** con el mismo agente: en la misma conversación no aparece.
3. Envía la frase. Debajo de la respuesta, abre **Agent debug info**:
   - **Agent version**: debe coincidir con la versión que acabas de publicar.
   - **Actions**: la herramienta debe estar *Matched* y *Selected*.
   - **Executed actions** → flecha ⌄ junto a *Fail/Success*: argumentos, **MCP Server Url** (`/_api/mcp/beta/spfx?solutionId=…` debe ser el `id` de `config/package-solution.json`) y **Response data**.

| Respuesta | Causa | Qué hacer |
|---|---|---|
| `403 copilot_license_required` | El usuario no tiene licencia de Microsoft 365 Copilot | Asignar la licencia, o usar el Workbench |
| `CopilotComponent '…' not found in solution '…'` | El agente apunta a otra solución | **Add to Teams** otra vez |
| Sin herramienta en *Actions* | Copilot todavía no cargó la herramienta | Esperar y probar en una conversación nueva; considerar `toolDiscovery: "static"` |
| 200 OK pero el componente no termina de cargar | Service worker de SharePoint (ver la guía de Microsoft) | DevTools → Application → Service workers → Unregister |

Guía oficial: https://learn.microsoft.com/sharepoint/dev/spfx/copilot/troubleshooting-copilot-ux-components

## 4. Checklist antes del evento

- **T−48 h:** último despliegue (`.sppkg` + Add to Teams). No volver a desplegar después.
- **T−24 h:** ensayo completo de 60 minutos en el **Copilot Workbench**, con el segmento de diagnóstico en Copilot real (`-developer on`); el autor ejecuta `Reset-DemoData.ps1 -OnlyLive` después del ensayo; capturas y video del plan B actualizados. Verificar pantalla completa y tema oscuro con el [registro de QA](../../../planning/sprints/sprint-04/qa-evidence.md).
- **T−1 h:** abrir el Workbench y Copilot con el agente ya seleccionado; comprobar conexión, compartir ventana y audio en Teams; tener el video del plan B abierto y accesible sin conexión. Checklist detallado en [el guion](demo-script.md).

El horario del evento sigue pendiente: no se han fijado ni ejecutado estos hitos. El autor realiza los builds, despliegues y scripts de PnP. Si se obtiene una licencia de Microsoft 365 Copilot, repetir las pruebas antes de cambiar la demo en vivo a Copilot real.
