---
generated_by_model: "claude-opus-5-5"
generated_at: "2026-10-24T14:30:00Z"
agent_roles: "IDE Agent + testing-reality-checker"
vision_command: "start_sprint --sprint 1"
sprint_number: 1
task_id: "T-015"
---

# Spikes técnicos

Son validaciones cortas de los riesgos de `spec-kit/input/technical-spec.md` §11, antes de construir encima. El resultado de cada una se registra en esta tabla.

| # | Riesgo | Cómo se valida | Sprint | Resultado |
|---|---|---|---|---|
| R1 | Qué es `pageContext.web.absoluteUrl` dentro de Copilot | Ejemplo `time-off-absence` de Microsoft (`listsSiteConfig.ts`) | 1 | ✅ **Resuelto:** es la raíz del tenant. Se usa origin + `/sites/encuestas` (`SiteResolver.ts`) |
| R2 | Escribir el campo Persona desde Copilot (ensureuser + `m365live_TechnicianId`) con un usuario sin permisos de administrador | Enviar una encuesta desde el Copilot Workbench con la cuenta sin permisos de administrador | 2 | 🟡 **Parcial:** el envío desde el Workbench guardó la encuesta con la cuenta del autor (dueño del sitio). Falta repetirlo con la cuenta sin permisos de administrador |
| R3 | Que `clientPeoplePickerSearchUser` responda desde el host de Copilot | Buscar un técnico en el Workbench | 2 | ✅ **Resuelto** en el Copilot Workbench: buscar "haaron" devolvió la persona con foto y correo |
| R4 | Que `Set-PnPListItem -UpdateType UpdateOverwriteVersion` cambie "Creado" en PnP 1.5.0 | `./Import-SampleData.ps1 -Limit 1` → la línea "Verificación" debe mostrar una fecha **pasada** | 1 | ✅ **Resuelto:** la carga de prueba dejó la fecha en el pasado; la ejecución completa reportó `fechas corregidas: 0` |
| R5 | `Get-PnPTenantId` y el claim de *Everyone except external users* en 1.5.0 | `./New-SurveyList.ps1` → la lista muestra "Everyone except external users → Colaborar" | 1 | ✅ **Resuelto:** `Get-PnPTenantId` funciona en 1.5.0; Everyone except external users → Colaborar; acceso a elementos verificado (leer todos / editar solo los propios) |
| R8 | Que un técnico **sin licencia** se resuelva en el campo Persona | `./Import-SampleData.ps1 -Limit 1` con T1 = usuario sin licencia → la "Verificación" muestra su nombre y correo | 1 | ➖ **No probado** (opción B: solo usuarios con licencia). Queda documentado para quien clone el repo |
| R9 | Estilos de Fluent v9 dentro del iframe de Copilot (rc.0, React 18) | Ver el componente en Copilot con tema claro y oscuro | 2 | 🟡 **Bien en el Workbench** (tema claro, estilos de Fluent correctos). Falta verlo en Copilot real y en tema oscuro |

## Pasos para el autor (sprint 1)

1. Crea los técnicos ficticios **sin licencia**. Al menos Ana López (T1), Sofía Herrera (T2) y Luis Ramírez (T3).
2. `Copy-Item demo.config.sample.psd1 demo.config.local.psd1` y llena `TenantUrl` y `Technicians`.
3. `./New-DemoSite.ps1`
4. `./New-SurveyList.ps1` → valida **R5**.
5. `./Import-SampleData.ps1 -Limit 1` → valida **R4** y **R8** con la línea "Verificación".
6. Si todo salió bien: `./Import-SampleData.ps1`, que carga el resto y omite el que ya existe.
7. Revisa la vista "Por técnico" de la lista: debe haber unas 119 respuestas repartidas en 6 meses.

## Plan B por riesgo

- **R4 falla:** probar `Set-PnPListItem -SystemUpdate` con `Created`. Si tampoco funciona, el tablero mostraría todo en el mes actual: se generan los datos con fechas reales y se documenta.
- **R5 falla:** poner `TenantId` en `demo.config.local.psd1`, o dar el permiso a mano desde *Configuración de la lista → Permisos*.
- **R8 falla:** asignar temporalmente una licencia de prueba a los técnicos, o usar solo las 2 cuentas con licencia (2 perfiles).

## Hallazgos durante la ejecución (2026-10-24)

- **Corte de red en `New-SurveyList.ps1`** ("The SSL connection could not be established"): fue transitorio. Los scripts ahora reintentan hasta 4 veces los errores de red (`Invoke-DemoRetry`) y nunca duplican columnas ni elementos.
- **`Set-PnPList -ReadSecurity 1` en PnP 1.5.0 dejó "leer solo los propios"** en lugar de "leer todos" (captura del autor). El script ahora asigna `ReadSecurity` y `WriteSecurity` directamente con CSOM y los **vuelve a leer para verificarlos**.
- **`Import-SampleData -Limit 1` → "The specified user could not be found"**: SharePoint no resolvió a `ana.lopez@…`. El script ahora revisa a todos los técnicos antes de importar (`New-PnPUser` = EnsureUser) y dice cuál falla. Está en diagnóstico, ligado a **R8**.
- **Escribir el campo Persona con `Add-PnPListItem` en PnP 1.5.0:** pasar el correo falla con "The specified user  could not be found", aunque el usuario sí se resuelve con `New-PnPUser`. El script ahora escribe el **Id del usuario en el sitio**.
- **Decisión del autor (opción B):** en el tenant del autor se usan solo las 2 cuentas con licencia, un perfil cada una: `T1 = emanuel` (comunica bien, lento) y `T3 = haaron` (mejora mes a mes), 55 respuestas. Por eso **R8 (usuarios sin licencia) no se probó**; queda como nota en el README para quien clone el repo. El aviso de "datos insuficientes" se muestra pidiendo el tablero de **haaron "este mes"** (2 respuestas).
- **En Copilot real, la herramienta no llegaba** (2026-10-24): el agente aparecía y entendía la intención, pero respondía que la herramienta "no estaba disponible" y llegó a **improvisar un formulario propio** sin botón. Con `toolDiscovery: "dynamic"` (el predeterminado de rc.0), el paquete no incluye la lista de herramientas y Copilot la pide en tiempo real al servidor MCP de SharePoint. Se cambió a `"static"` en `config/copilot-agent.json`, que fija la lista dentro del paquete; el esquema de SPFx lo describe como respaldo temporal durante el despliegue del modo dinámico. Además, `instruction.txt` ahora prohíbe imitar el formulario o el tablero.
- **Causa del fallo en Copilot (2026-10-24, modo desarrollador):** Agent version 1.0.0.3 ✓; `OpenSatisfactionSurvey` Matched + Selected ✓; argumentos correctos `{"ticketNumber":"INC-002736","technician":"Emanuel"}` ✓; MCP `/_api/mcp/beta/spfx?solutionId=45097d5e-…` (el nuestro) ✓. La ejecución devolvió **`403 {"error":"access_denied","reason":"copilot_license_required"}`**. El servicio que ejecuta los Copilot UX components **ahora exige una licencia de Microsoft 365 Copilot** al usuario final; con *Copilot Chat (Basic)* falla, igual que el ejemplo **My Day** de Microsoft. La documentación de la preview decía que no hacía falta licencia y que el licenciamiento de la GA estaba por definirse; este 403 sugiere que ya se aplica. El Copilot Workbench **sí funciona sin licencia**.
