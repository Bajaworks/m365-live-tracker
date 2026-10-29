<#
  @generated_by_model claude-opus-5-5
  @generated_at 2026-10-24T14:30:00Z
  @agent_roles IDE Agent + engineering-devops-automator
  @vision_command start_sprint --sprint 1
  @sprint_number 1
  @task_id T-007

  .SYNOPSIS
  Carga las respuestas ficticias de sample-data/surveys.json (RF-17).

  - Relaciona T1…T6 con los correos de Technicians (en orden).
  - Fija la fecha "Creado" = hoy − daysAgo con UpdateOverwriteVersion, para que
    el tablero tenga 6 meses de historia.
  - Marca cada elemento con <prefijo>IsSample = Sí.
  - Idempotente: omite los tickets de ejemplo que ya existen.

  .PARAMETER Limit
  Carga solo los primeros N elementos (útil para el spike R4/R8 con 1 elemento).

  .EXAMPLE
  ./Import-SampleData.ps1
  ./Import-SampleData.ps1 -Limit 1     # prueba rápida
#>
[CmdletBinding()]
param(
    [string]$ConfigPath,
    [int]$Limit = 0
)

. "$PSScriptRoot/Connect-Demo.ps1"
$cfg = if ($ConfigPath) { Get-DemoConfig -Path $ConfigPath } else { Get-DemoConfig }
$siteUrl = Get-DemoSiteUrl -Config $cfg
$listTitle = $cfg.ListTitle
function F([string]$name) { Get-DemoFieldName -Config $cfg -Name $name }

$dataPath = Join-Path $PSScriptRoot 'sample-data/surveys.json'
$data = Get-Content -Path $dataPath -Raw -Encoding utf8 | ConvertFrom-Json

# Technicians can be a list (T1, T2, … in order) or a table that picks profiles,
# e.g. @{ T1 = 'a@contoso.com'; T3 = 'b@contoso.com' }.
$map = @{}
if ($cfg.Technicians -is [hashtable]) {
    foreach ($key in $cfg.Technicians.Keys) {
        if ($key -notmatch '^T[1-6]$') { throw "Perfil desconocido en Technicians: '$key' (usa T1…T6)." }
        if ($cfg.Technicians[$key]) { $map[$key] = [string]$cfg.Technicians[$key] }
    }
} else {
    $technicians = @($cfg.Technicians)
    for ($i = 0; $i -lt $technicians.Count -and $i -lt 6; $i++) { $map["T$($i + 1)"] = [string]$technicians[$i] }
}
if ($map.Count -lt 1) {
    throw 'Configura al menos un técnico en Technicians (demo.config.local.psd1).'
}
$distinctPeople = @($map.Values | Sort-Object -Unique)
if ($distinctPeople.Count -lt $map.Count) {
    Write-Warning "Hay una misma persona en varios perfiles: su tablero mezclará historias distintas. Usa una persona distinta por perfil, o configura menos perfiles."
}

$items = @($data.items | Where-Object { $map.ContainsKey($_.tech) })
$skippedProfiles = @($data.items | Where-Object { -not $map.ContainsKey($_.tech) } | Select-Object -ExpandProperty tech -Unique)
if ($skippedProfiles.Count -gt 0) {
    Write-Warning "Perfiles sin técnico configurado (se omiten): $($skippedProfiles -join ', ')"
}
if ($Limit -gt 0) { $items = @($items | Select-Object -First $Limit) }

Connect-DemoUrl -Url $siteUrl

# Pre-check: every technician used must resolve as a site user (EnsureUser),
# otherwise the person column cannot be written. Report all failures at once.
$usedTechs = @($map.Keys | Sort-Object)
$unresolved = @()
$userIds = @{}
foreach ($tech in $usedTechs) {
    $email = $map[$tech]
    try {
        $user = Invoke-DemoRetry -What "resolver $email" -Action { New-PnPUser -LoginName $email }
        # Person columns are written by site user Id: in PnP 1.5.0, passing the
        # email to Add-PnPListItem fails with "The specified user  could not be found".
        $userIds[$tech] = [int]$user.Id
        Write-Host "  ✓ $tech $email → $($user.Title) (Id $($user.Id))" -ForegroundColor DarkGray
    } catch {
        Write-Host "  ✗ $tech $email → $($_.Exception.Message)" -ForegroundColor Red
        $unresolved += $email
    }
}
if ($unresolved.Count -gt 0) {
    throw @"
SharePoint no pudo resolver $($unresolved.Count) técnico(s): $($unresolved -join ', ').
Revisa en el centro de administración de Microsoft 365 → Usuarios activos que:
  1. el usuario exista y su "Nombre de usuario" sea exactamente ese correo;
  2. no esté bloqueado para iniciar sesión;
  3. si lo acabas de crear, espera unos minutos y vuelve a intentar.
Si el usuario existe y aun así falla, SharePoint no acepta usuarios sin licencia (riesgo R8):
asígnale una licencia de prueba o quita esa línea de Technicians.
"@
}

# Tickets de ejemplo que ya existen (idempotencia): Title → elemento.
$existing = @{}
Invoke-DemoRetry -What 'leer elementos existentes' -Action {
    Get-PnPListItem -List $listTitle -PageSize 500 -Fields 'Title', 'Created', (F 'IsSample')
} | ForEach-Object {
    if ($_[(F 'IsSample')]) { $existing[[string]$_['Title']] = $_ }
}

function Find-SampleItem([string]$ticket) {
    $caml = "<View><Query><Where><Eq><FieldRef Name='Title'/><Value Type='Text'>$ticket</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>"
    Get-PnPListItem -List $listTitle -Query $caml | Select-Object -First 1
}

function Set-SampleDate($listItemId, [datetime]$when) {
    Invoke-DemoRetry -What "fecha del elemento $listItemId" -Action {
        Set-PnPListItem -List $listTitle -Identity $listItemId -Values @{ Created = $when; Modified = $when } -UpdateType UpdateOverwriteVersion | Out-Null
    }
}

$today = (Get-Date).Date
$created = 0
$fixed = 0
$index = 0
foreach ($item in $items) {
    $index++
    Write-Progress -Activity 'Cargando datos de ejemplo' -Status "Ticket $($item.ticket)" -PercentComplete (100 * $index / $items.Count)
    $when = $today.AddDays(-[int]$item.daysAgo).AddHours([int]$item.hour).AddMinutes([int]$item.minute)

    $current = $existing[[string]$item.ticket]
    if ($current) {
        # Ya existe. Si una ejecución anterior se cortó antes de fijar la fecha, se corrige.
        if (([datetime]$current['Created']).ToLocalTime().Date -ne $when.Date) {
            Set-SampleDate $current.Id $when
            $fixed++
        }
        continue
    }

    # Every value is cast to a plain .NET type. PnP 1.5.0 reads person values with
    # `value as string`: a number or a PSObject-wrapped string becomes null and the
    # server answers "The specified user  could not be found". A numeric STRING is
    # treated as the site user Id.
    $values = @{
        'Title'                = [string]$item.ticket
        (F 'Technician')       = [string]$userIds[[string]$item.tech]
        (F 'Resolved')         = [string]$item.resolved
        (F 'Understanding')    = [int]$item.scores.Understanding
        (F 'Speed')            = [int]$item.scores.Speed
        (F 'Skill')            = [int]$item.scores.Skill
        (F 'Communication')    = [int]$item.scores.Communication
        (F 'WouldRecommend')   = [string]$item.recommend
        (F 'Comments')         = [string]$item.comments
        (F 'IsSample')         = $true
    }
    # Before each retry, check whether the previous attempt actually created the
    # item (the request may succeed even if the response is lost) → no duplicates.
    $listItem = Invoke-DemoRetry -What "ticket $($item.ticket)" -Action {
        $already = Find-SampleItem ([string]$item.ticket)
        if ($already) { $already } else { Add-PnPListItem -List $listTitle -Values $values }
    }
    Set-SampleDate $listItem.Id $when
    $created++
}
Write-Progress -Activity 'Cargando datos de ejemplo' -Completed

Write-Host "Elementos creados: $created · fechas corregidas: $fixed · ya existían: $($items.Count - $created)." -ForegroundColor Green

if ($Limit -gt 0 -and $items.Count -gt 0) {
    # Verificación para el spike R4/R8: ¿se fijó "Creado" y se resolvió el técnico?
    $check = Get-PnPListItem -List $listTitle -PageSize 500 -Fields 'Title', 'Created', (F 'Technician') |
        Where-Object { $_['Title'] -eq [string]$items[0].ticket } | Select-Object -First 1
    if ($check) {
        $person = $check[(F 'Technician')]
        Write-Host "Verificación → Ticket $($check['Title']) · Creado: $($check['Created']) · Técnico: $($person.LookupValue) <$($person.Email)>" -ForegroundColor Cyan
    }
}
