<#
  @generated_by_model claude-opus-5-5
  @generated_at 2026-10-24T14:30:00Z
  @agent_roles IDE Agent + engineering-devops-automator
  @vision_command start_sprint --sprint 1
  @sprint_number 1
  @task_id T-004, T-005

  .SYNOPSIS
  Crea la lista "Encuestas" con sus columnas, vistas y permisos (RF-16). Idempotente.

  Columnas: ver spec-kit/input/data-model.md. Todas las columnas propias llevan
  el prefijo de FieldPrefix (m365live_). Permisos: la lista no hereda; "Everyone
  except external users" = Colaborar; ReadSecurity = 1 (todos leen todo) y
  WriteSecurity = 2 (cada quien edita solo lo suyo). Los dueños del sitio
  conservan el control total y pueden editar cualquier respuesta.

  .EXAMPLE
  ./New-SurveyList.ps1
#>
[CmdletBinding()]
param(
    [string]$ConfigPath,
    [switch]$SkipPermissions
)

. "$PSScriptRoot/Connect-Demo.ps1"
$cfg = if ($ConfigPath) { Get-DemoConfig -Path $ConfigPath } else { Get-DemoConfig }
$siteUrl = Get-DemoSiteUrl -Config $cfg
$listTitle = $cfg.ListTitle
function F([string]$name) { Get-DemoFieldName -Config $cfg -Name $name }

Connect-DemoUrl -Url $siteUrl

# --- Lista ------------------------------------------------------------------
$list = Get-PnPList -Identity $listTitle -ErrorAction SilentlyContinue
if (-not $list) {
    Write-Host "Creando la lista '$listTitle'..." -ForegroundColor Cyan
    $list = New-PnPList -Title $listTitle -Template GenericList -Url "Lists/$listTitle" -OnQuickLaunch
} else {
    Write-Host "La lista '$listTitle' ya existe." -ForegroundColor Yellow
}

# Title → "Ticket #", obligatorio e indexado.
Set-PnPField -List $listTitle -Identity Title -Values @{ Title = 'Ticket #'; Required = $true; Indexed = $true } | Out-Null

# --- Columnas -----------------------------------------------------------------
# Se crean con DisplayName = nombre interno (así SharePoint respeta el nombre
# interno con prefijo) y después se les pone el nombre visible en español.
function Add-DemoField {
    param([string]$InternalName, [string]$DisplayName, [string]$Xml)
    # The existence check runs inside the retry, so a retry after an ambiguous
    # failure never tries to create the same column twice.
    Invoke-DemoRetry -What $InternalName -Action {
        $existing = Get-PnPField -List $listTitle -Identity $InternalName -ErrorAction SilentlyContinue
        if (-not $existing) {
            Write-Host "  + $InternalName" -ForegroundColor DarkCyan
            Add-PnPFieldFromXml -List $listTitle -FieldXml $Xml | Out-Null
        } else {
            Write-Host "  = $InternalName (ya existe)" -ForegroundColor DarkGray
        }
    }
    Invoke-DemoRetry -What "$InternalName (nombre visible)" -Action {
        Set-PnPField -List $listTitle -Identity $InternalName -Values @{ Title = $DisplayName } | Out-Null
    }
}

function New-FieldId { "{$([guid]::NewGuid())}" }

function Choice-Xml([string]$name, [string[]]$choices) {
    $items = ($choices | ForEach-Object { "<CHOICE>$_</CHOICE>" }) -join ''
    "<Field ID='$(New-FieldId)' Type='Choice' Name='$name' StaticName='$name' DisplayName='$name' Required='TRUE' Format='RadioButtons' FillInChoice='FALSE'><CHOICES>$items</CHOICES></Field>"
}

function Score-Xml([string]$name) {
    "<Field ID='$(New-FieldId)' Type='Number' Name='$name' StaticName='$name' DisplayName='$name' Required='TRUE' Min='1' Max='5' Decimals='0' />"
}

Write-Host 'Columnas:' -ForegroundColor Cyan
$tech = F 'Technician'
Add-DemoField $tech 'Técnico' "<Field ID='$(New-FieldId)' Type='User' Name='$tech' StaticName='$tech' DisplayName='$tech' Required='TRUE' UserSelectionMode='PeopleOnly' UserSelectionScope='0' Mult='FALSE' ShowField='ImnName' />"
Add-DemoField (F 'Resolved') 'Resuelto' (Choice-Xml (F 'Resolved') @('Sí', 'Parcialmente', 'No'))
Add-DemoField (F 'Understanding') 'Comprensión' (Score-Xml (F 'Understanding'))
Add-DemoField (F 'Speed') 'Rapidez' (Score-Xml (F 'Speed'))
Add-DemoField (F 'Skill') 'Habilidad' (Score-Xml (F 'Skill'))
Add-DemoField (F 'Communication') 'Comunicación' (Score-Xml (F 'Communication'))
Add-DemoField (F 'WouldRecommend') 'Recomendaría' (Choice-Xml (F 'WouldRecommend') @('Sí', 'No', 'No estoy seguro'))
$comments = F 'Comments'
Add-DemoField $comments 'Comentarios' "<Field ID='$(New-FieldId)' Type='Note' Name='$comments' StaticName='$comments' DisplayName='$comments' Required='FALSE' NumLines='6' RichText='FALSE' AppendOnly='FALSE' />"
$isSample = F 'IsSample'
Add-DemoField $isSample 'Dato de ejemplo' "<Field ID='$(New-FieldId)' Type='Boolean' Name='$isSample' StaticName='$isSample' DisplayName='$isSample'><Default>0</Default></Field>"

# Índice en el técnico (consultas del tablero).
Set-PnPField -List $listTitle -Identity $tech -Values @{ Indexed = $true } | Out-Null

# --- Vistas -------------------------------------------------------------------
$viewFields = @('LinkTitle', $tech, (F 'Resolved'), (F 'Understanding'), (F 'Speed'), (F 'Skill'), (F 'Communication'), (F 'WouldRecommend'), 'Created')

$default = Get-PnPView -List $listTitle | Where-Object { $_.DefaultView } | Select-Object -First 1
if ($default) {
    Set-PnPView -List $listTitle -Identity $default.Id -Fields $viewFields -Values @{ Title = 'Todas las encuestas' } | Out-Null
    Write-Host 'Vista predeterminada: "Todas las encuestas".' -ForegroundColor DarkGray
}

if (-not (Get-PnPView -List $listTitle -Identity 'Por técnico' -ErrorAction SilentlyContinue)) {
    $query = "<GroupBy Collapse='TRUE' GroupLimit='30'><FieldRef Name='$tech' /></GroupBy><OrderBy><FieldRef Name='Created' Ascending='FALSE' /></OrderBy>"
    Add-PnPView -List $listTitle -Title 'Por técnico' -Fields $viewFields -Query $query -Paged -RowLimit 100 | Out-Null
    Write-Host 'Vista "Por técnico" creada.' -ForegroundColor DarkGray
}

# --- Permisos -----------------------------------------------------------------
if (-not $SkipPermissions) {
    Write-Host 'Permisos:' -ForegroundColor Cyan
    $listWithRoles = Get-PnPList -Identity $listTitle -Includes HasUniqueRoleAssignments
    if (-not $listWithRoles.HasUniqueRoleAssignments) {
        Set-PnPList -Identity $listTitle -BreakRoleInheritance -CopyRoleAssignments | Out-Null
        Write-Host '  La lista ya no hereda permisos del sitio.' -ForegroundColor DarkGray
    }

    $tenantId = if ($cfg.TenantId) { $cfg.TenantId } else { Get-PnPTenantId -TenantUrl $cfg.TenantUrl }
    $everyone = "c:0-.f|rolemanager|spo-grid-all-users/$tenantId"
    New-PnPUser -LoginName $everyone | Out-Null

    # El nombre del nivel depende del idioma del sitio ("Colaborar"), así que se busca por tipo.
    $contribute = Get-PnPRoleDefinition | Where-Object { "$($_.RoleTypeKind)" -eq 'Contributor' } | Select-Object -First 1
    if (-not $contribute) { throw 'No se encontró el nivel de permiso de colaboración (Contributor) en el sitio.' }
    Set-PnPListPermission -Identity $listTitle -User $everyone -AddRole $contribute.Name
    Write-Host "  Everyone except external users → $($contribute.Name)" -ForegroundColor DarkGray

    # Set directly with CSOM: in PnP 1.5.0, Set-PnPList -ReadSecurity 1 ended up as
    # "read only own items" (seen 2026-10-24). 1 = read all, 2 = edit only own.
    $csomList = Get-PnPList -Identity $listTitle
    $csomList.ReadSecurity = 1
    $csomList.WriteSecurity = 2
    $csomList.Update()
    Invoke-PnPQuery
    $verify = Get-PnPList -Identity $listTitle -Includes ReadSecurity, WriteSecurity
    if ($verify.ReadSecurity -ne 1 -or $verify.WriteSecurity -ne 2) {
        throw "No se pudo fijar el acceso a elementos (ReadSecurity=$($verify.ReadSecurity), WriteSecurity=$($verify.WriteSecurity)). Configúralo a mano en Configuración de la lista → Configuración avanzada."
    }
    Write-Host '  Acceso a elementos: leer todos; editar solo los propios (verificado).' -ForegroundColor DarkGray
}

Write-Host "Lista lista: $siteUrl/Lists/$listTitle" -ForegroundColor Green
