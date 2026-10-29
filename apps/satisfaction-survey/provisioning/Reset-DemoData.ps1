<#
  @generated_by_model claude-opus-5-5
  @generated_at 2026-10-24T14:30:00Z
  @agent_roles IDE Agent + engineering-devops-automator
  @vision_command start_sprint --sprint 1
  @sprint_number 1
  @task_id T-008

  .SYNOPSIS
  Reinicia los datos de la demo entre ensayos (RF-18).

  .PARAMETER OnlyLive
  Borra solo las respuestas creadas en vivo (IsSample = No). Los datos de ejemplo se quedan.

  .PARAMETER Reseed
  Borra TODO y vuelve a cargar los datos de ejemplo.

  .PARAMETER All
  Borra TODO y deja la lista vacía (sin volver a cargar).

  .PARAMETER Force
  No pide confirmación.

  .EXAMPLE
  ./Reset-DemoData.ps1 -OnlyLive          # después de cada ensayo
  ./Reset-DemoData.ps1 -Reseed -Force     # empezar de cero con datos de ejemplo
  ./Reset-DemoData.ps1 -All               # vaciar la lista
#>
[CmdletBinding()]
param(
    [string]$ConfigPath,
    [switch]$OnlyLive,
    [switch]$Reseed,
    [switch]$All,
    [switch]$Force
)

$modes = @($OnlyLive, $Reseed, $All | Where-Object { $_ }).Count
if ($modes -ne 1) {
    Write-Host 'Indica qué borrar (exactamente una opción):' -ForegroundColor Yellow
    Write-Host '  -OnlyLive   solo las respuestas creadas en vivo (lo normal después de un ensayo)'
    Write-Host '  -Reseed     todo, y vuelve a cargar los datos de ejemplo'
    Write-Host '  -All        todo, y deja la lista vacía'
    return
}

. "$PSScriptRoot/Connect-Demo.ps1"
$cfg = if ($ConfigPath) { Get-DemoConfig -Path $ConfigPath } else { Get-DemoConfig }
$siteUrl = Get-DemoSiteUrl -Config $cfg
$listTitle = $cfg.ListTitle
$isSampleField = Get-DemoFieldName -Config $cfg -Name 'IsSample'

Connect-DemoUrl -Url $siteUrl

$all = @(Get-PnPListItem -List $listTitle -PageSize 500 -Fields 'Title', $isSampleField)
$targets = if ($OnlyLive) { @($all | Where-Object { -not $_[$isSampleField] }) } else { $all }
$scope = if ($OnlyLive) { 'respuestas creadas en vivo' } else { 'respuestas (incluidos los datos de ejemplo)' }

if ($targets.Count -eq 0) {
    Write-Host "No hay $scope para borrar." -ForegroundColor Yellow
} else {
    if (-not $Force) {
        $answer = Read-Host "Se enviarán a la papelera $($targets.Count) $scope de $siteUrl. ¿Continuar? (s/n)"
        if ($answer -notmatch '^(s|si|sí|y|yes)$') {
            Write-Host 'Cancelado.' -ForegroundColor Yellow
            return
        }
    }
    $i = 0
    foreach ($item in $targets) {
        $i++
        Write-Progress -Activity 'Borrando respuestas' -Status "Ticket $($item['Title'])" -PercentComplete (100 * $i / $targets.Count)
        Remove-PnPListItem -List $listTitle -Identity $item.Id -Recycle -Force | Out-Null
    }
    Write-Progress -Activity 'Borrando respuestas' -Completed
    Write-Host "Enviadas a la papelera: $($targets.Count)." -ForegroundColor Green
}

if ($Reseed) {
    $importArgs = @{}
    if ($ConfigPath) { $importArgs.ConfigPath = $ConfigPath }
    & (Join-Path $PSScriptRoot 'Import-SampleData.ps1') @importArgs
}
