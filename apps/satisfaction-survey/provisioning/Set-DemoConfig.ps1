<#
  @generated_by_model claude-opus-5-5
  @generated_at 2026-10-24T14:30:00Z
  @agent_roles IDE Agent + engineering-devops-automator
  @vision_command start_sprint --sprint 1
  @sprint_number 1
  @task_id T-009

  .SYNOPSIS
  OPCIONAL. Publica la propiedad de tenant "SatisfactionSurveySite" para que los
  componentes usen otro sitio sin recompilar (RF-19).

  No hace falta si el sitio usa la ruta predeterminada /sites/encuestas.

  Requisitos (una sola vez por tenant):
   1. Permitir cambios al property bag donde los scripts personalizados están bloqueados:
        Connect-SPOService -Url https://<tenant>-admin.sharepoint.com
        Set-SPOTenant -AllowWebPropertyBagUpdateWhenDenyAddAndCustomizePagesIsEnabled $true
   2. Ser administrador de la colección de sitios del App Catalog.

  .EXAMPLE
  ./Set-DemoConfig.ps1
#>
[CmdletBinding()]
param(
    [string]$ConfigPath,
    [string]$Value
)

. "$PSScriptRoot/Connect-Demo.ps1"
$cfg = if ($ConfigPath) { Get-DemoConfig -Path $ConfigPath } else { Get-DemoConfig }
$key = 'SatisfactionSurveySite'
if (-not $Value) { $Value = "/sites/$($cfg.SiteAlias)" }

Connect-DemoUrl -Url $cfg.TenantUrl
$appCatalog = Get-PnPTenantAppCatalogUrl
if (-not $appCatalog) { throw 'El tenant no tiene App Catalog.' }
Connect-DemoUrl -Url $appCatalog

try {
    Set-PnPStorageEntity -Key $key -Value $Value -Description 'Sitio de la lista Encuestas (Copilot UX components demo)' -Scope Tenant
    Write-Host "Propiedad de tenant '$key' = '$Value'." -ForegroundColor Green
} catch {
    Write-Warning "No se pudo guardar la propiedad '$key': $($_.Exception.Message)"
    Write-Warning 'Revisa los requisitos en la ayuda de este script (Get-Help ./Set-DemoConfig.ps1). Los componentes seguirán usando /sites/encuestas.'
}
