---
generated_by_model: "claude-opus-5-5"
generated_at: "2026-10-24T14:30:00Z"
agent_roles: "IDE Agent + engineering-devops-automator + engineering-technical-writer"
vision_command: "start_sprint --sprint 1"
sprint_number: 1
---

# Aprovisionamiento (SharePoint)

Estos scripts preparan la parte de SharePoint de la demo:
- un sitio de comunicación,
- la lista `Encuestas`,
- unas 120 respuestas ficticias.

## Requisitos

- **Windows** con **PowerShell 7**. `-UseWebLogin` abre una ventana de inicio de sesión y solo funciona en Windows.
- **PnP.PowerShell 1.5.0**:
  ```powershell
  Install-Module PnP.PowerShell -RequiredVersion 1.5.0 -Scope CurrentUser
  ```
  Toda conexión usa `Connect-PnPOnline -UseWebLogin`, así que **no hace falta registrar una aplicación en Entra ID**.
- Una cuenta con permiso para **crear sitios** en el tenant.
- De 3 a 6 usuarios que harán de **técnicos** en los datos de ejemplo. Pueden ser usuarios **sin licencia**: en el centro de administración de Microsoft 365 → *Usuarios* → *Agregar un usuario* → *Crear usuario sin licencia*.

## Configuración

```powershell
Copy-Item demo.config.sample.psd1 demo.config.local.psd1
```

Edita `demo.config.local.psd1`: llena `TenantUrl` y `Technicians`, en el orden T1…T6. Ese archivo está en `.gitignore`.

## Uso

```powershell
./Deploy-Demo.ps1                 # sitio + lista + datos de ejemplo (idempotente)
```

También puedes ejecutar cada paso por separado:

| Script | Qué hace |
|---|---|
| `New-DemoSite.ps1` | Crea o reutiliza `/sites/<SiteAlias>` como sitio de comunicación |
| `New-SurveyList.ps1` | Crea la lista, las columnas `m365live_*`, las vistas y los permisos |
| `Import-SampleData.ps1 [-Limit N]` | Carga las respuestas de `sample-data/surveys.json` y fija la fecha "Creado" |
| `Reset-DemoData.ps1 -OnlyLive` | Borra solo lo creado en vivo (después de cada ensayo) |
| `Reset-DemoData.ps1 -Reseed` | Borra todo y vuelve a cargar los datos de ejemplo |
| `Reset-DemoData.ps1 -All` | Borra todo y deja la lista vacía. Sin opciones, el script no borra nada |
| `Set-DemoConfig.ps1` | *Opcional:* propiedad del tenant para usar otro sitio (ver la ayuda del script) |

## Permisos que configura la lista

- *Everyone except external users* tiene el nivel **Colaborar** en la lista.
- **Lectura:** todos los elementos. **Edición:** solo los creados por el usuario.
- Los **dueños del sitio** pueden editar cualquier respuesta, porque su nivel incluye "Cancelar desprotección".

## Datos de ejemplo

`sample-data/surveys.json` se genera con `npm run sample-data`. Es determinista: siempre produce el mismo resultado con la misma semilla. **No lo edites a mano.**

| Perfil | Historia |
|---|---|
| T1 | Comunicación alta, Rapidez baja (protagonista del guion) |
| T2 | Excelente en todo |
| T3 | Mejora mes a mes |
| T4 | Habilidad alta, Comunicación baja |
| T5 | Regular |
| T6 | Solo 3 respuestas ("datos insuficientes") |

Los datos de ejemplo usan tickets del 1000 al 3999. **Del 4000 en adelante quedan libres para la demo en vivo.**
