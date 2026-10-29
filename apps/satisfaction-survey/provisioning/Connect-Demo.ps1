<#
  @generated_by_model claude-opus-5-5
  @generated_at 2026-10-24T14:30:00Z
  @agent_roles IDE Agent + engineering-devops-automator
  @vision_command start_sprint --sprint 1
  @sprint_number 1
  @task_id T-002

  Helpers compartidos por los scripts de aprovisionamiento. Se carga con:
      . "$PSScriptRoot/Connect-Demo.ps1"

  - Carga PnP.PowerShell 1.5.0 de forma explícita (en algunas máquinas también
    está el módulo antiguo SharePointPnPPowerShellOnline, con cmdlets homónimos).
  - Toda conexión usa Connect-PnPOnline -UseWebLogin (login web, sin registrar
    una aplicación de Entra ID). Requiere Windows.
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$script:PnPVersion = '1.5.0'

function Import-DemoModule {
    # $IsWindows only exists in PowerShell 6+; check the version first (StrictMode).
    if ($PSVersionTable.PSVersion.Major -ge 6 -and -not $IsWindows) {
        throw 'Connect-PnPOnline -UseWebLogin solo funciona en Windows.'
    }
    Remove-Module SharePointPnPPowerShellOnline -ErrorAction SilentlyContinue
    $available = Get-Module -ListAvailable -Name PnP.PowerShell | Where-Object { $_.Version -eq [version]$script:PnPVersion }
    if (-not $available) {
        throw "No se encontró PnP.PowerShell $script:PnPVersion. Instálalo con: Install-Module PnP.PowerShell -RequiredVersion $script:PnPVersion -Scope CurrentUser"
    }
    Import-Module PnP.PowerShell -RequiredVersion $script:PnPVersion -Force -DisableNameChecking -ErrorAction Stop
}

function Get-DemoConfig {
    param([string]$Path = (Join-Path $PSScriptRoot 'demo.config.local.psd1'))

    if (-not (Test-Path $Path)) {
        $sample = Join-Path $PSScriptRoot 'demo.config.sample.psd1'
        throw "Falta la configuración local '$Path'. Copia '$sample' como 'demo.config.local.psd1' y completa TenantUrl y Technicians."
    }
    $cfg = Import-PowerShellDataFile -Path $Path

    $defaults = @{
        TenantId        = ''
        SiteAlias       = 'encuestas'
        SiteTitle       = 'Encuestas de Satisfacción'
        SiteDescription = ''
        Lcid            = 3082
        ListTitle       = 'Encuestas'
        FieldPrefix     = 'm365live_'
        Technicians     = @()
    }
    foreach ($key in $defaults.Keys) {
        if (-not $cfg.ContainsKey($key) -or $null -eq $cfg[$key]) { $cfg[$key] = $defaults[$key] }
    }

    if (-not $cfg.ContainsKey('TenantUrl') -or $cfg.TenantUrl -notmatch '^https://[^/]+\.sharepoint\.com/?$') {
        throw "TenantUrl debe tener la forma https://<tenant>.sharepoint.com (valor actual: '$($cfg.TenantUrl)')."
    }
    if ($cfg.TenantUrl -match 'contoso\.sharepoint\.com') {
        throw 'demo.config.local.psd1 todavía tiene los valores de ejemplo (contoso). Completa tu TenantUrl.'
    }
    $cfg.TenantUrl = $cfg.TenantUrl.TrimEnd('/')
    if ($cfg.Technicians -isnot [hashtable]) {
        $cfg.Technicians = @($cfg.Technicians | Where-Object { $_ })
    }
    return $cfg
}

function Get-DemoSiteUrl {
    param([Parameter(Mandatory)][hashtable]$Config)
    return "$($Config.TenantUrl)/sites/$($Config.SiteAlias)"
}

function Connect-DemoUrl {
    param([Parameter(Mandatory)][string]$Url)
    Write-Host "Conectando a $Url (se abrirá el inicio de sesión web)..." -ForegroundColor Cyan
    Connect-PnPOnline -Url $Url -UseWebLogin
}

function Invoke-DemoRetry {
    <#
      Retries an action on transient network errors (SSL handshake, timeouts,
      throttling). Other errors are thrown immediately.
    #>
    param(
        [Parameter(Mandatory)][scriptblock]$Action,
        [int]$Attempts = 4,
        [string]$What = 'operación'
    )
    $transient = 'SSL connection|timed out|timeout|connection was closed|forcibly closed|actively refused|No such host|429|503|504|temporarily'
    for ($i = 1; $i -le $Attempts; $i++) {
        try {
            return & $Action
        } catch {
            $message = $_.Exception.Message
            if ($_.Exception.InnerException) { $message += ' ' + $_.Exception.InnerException.Message }
            if ($i -ge $Attempts -or $message -notmatch $transient) { throw }
            $delay = [math]::Pow(2, $i)
            Write-Warning "Error de red en '$What' (intento $i de $Attempts): $($_.Exception.Message). Reintento en $delay s..."
            Start-Sleep -Seconds $delay
        }
    }
}

function Get-DemoFieldName {
    param([Parameter(Mandatory)][hashtable]$Config, [Parameter(Mandatory)][string]$Name)
    return "$($Config.FieldPrefix)$Name"
}

Import-DemoModule
