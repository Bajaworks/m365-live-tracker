<#
  @generated_by_model claude-opus-5-5
  @generated_at 2026-10-24T14:30:00Z
  @agent_roles IDE Agent + engineering-devops-automator
  @vision_command start_sprint --sprint 1
  @sprint_number 1
  @task_id T-003

  .SYNOPSIS
  Crea (o reutiliza) la colección de sitios de comunicación de la demo (RF-15).

  .EXAMPLE
  ./New-DemoSite.ps1
#>
[CmdletBinding()]
param(
    [string]$ConfigPath
)

. "$PSScriptRoot/Connect-Demo.ps1"
$cfg = if ($ConfigPath) { Get-DemoConfig -Path $ConfigPath } else { Get-DemoConfig }
$siteUrl = Get-DemoSiteUrl -Config $cfg

Connect-DemoUrl -Url $cfg.TenantUrl

# SPSiteManager/status: 0 = no existe, 1 = aprovisionando, 2 = listo, 3 = error, 4 = eliminado (papelera).
$status = $null
try {
    $encoded = [uri]::EscapeDataString($siteUrl)
    $response = Invoke-PnPSPRestMethod -Method Get -Url "$($cfg.TenantUrl)/_api/SPSiteManager/status?url='$encoded'"
    $status = if ($response.PSObject.Properties['SiteStatus']) { $response.SiteStatus } else { $response.d.Status.SiteStatus }
} catch {
    Write-Verbose "No se pudo consultar el estado del sitio: $($_.Exception.Message)"
}

switch ($status) {
    2 {
        Write-Host "El sitio ya existe, se reutiliza: $siteUrl" -ForegroundColor Yellow
    }
    4 {
        throw "El sitio $siteUrl está en la papelera de sitios. Restáuralo o elimínalo definitivamente desde el centro de administración, o cambia SiteAlias."
    }
    default {
        Write-Host "Creando el sitio de comunicación $siteUrl ..." -ForegroundColor Cyan
        try {
            New-PnPSite -Type CommunicationSite `
                -Title $cfg.SiteTitle `
                -Url $siteUrl `
                -Description $cfg.SiteDescription `
                -Lcid $cfg.Lcid `
                -SiteDesign Topic `
                -Wait | Out-Null
            Write-Host 'Sitio creado.' -ForegroundColor Green
        } catch {
            if ($_.Exception.Message -match 'already exists|ya existe') {
                Write-Host "El sitio ya existe, se reutiliza: $siteUrl" -ForegroundColor Yellow
            } else {
                throw
            }
        }
    }
}

Write-Host "URL del sitio: $siteUrl" -ForegroundColor Green
