<#
  @generated_by_model claude-opus-5-5
  @generated_at 2026-10-24T14:30:00Z
  @agent_roles IDE Agent + engineering-devops-automator
  @vision_command start_sprint --sprint 1
  @sprint_number 1
  @task_id T-009

  .SYNOPSIS
  Prepara todo el lado de SharePoint de la demo: sitio → lista → datos de ejemplo.

  Cada paso es idempotente; se puede volver a ejecutar sin duplicar nada.
  Puede pedir el inicio de sesión web más de una vez (una por URL).

  .EXAMPLE
  ./Deploy-Demo.ps1
  ./Deploy-Demo.ps1 -SkipSampleData
#>
[CmdletBinding()]
param(
    [string]$ConfigPath,
    [switch]$SkipSampleData
)

$ErrorActionPreference = 'Stop'
$common = @{}
if ($ConfigPath) { $common.ConfigPath = $ConfigPath }

Write-Host '1/3 Sitio de comunicación' -ForegroundColor Magenta
& (Join-Path $PSScriptRoot 'New-DemoSite.ps1') @common

Write-Host '2/3 Lista Encuestas' -ForegroundColor Magenta
& (Join-Path $PSScriptRoot 'New-SurveyList.ps1') @common

if ($SkipSampleData) {
    Write-Host '3/3 Datos de ejemplo: omitido.' -ForegroundColor Magenta
} else {
    Write-Host '3/3 Datos de ejemplo' -ForegroundColor Magenta
    & (Join-Path $PSScriptRoot 'Import-SampleData.ps1') @common
}

Write-Host 'Listo.' -ForegroundColor Green
