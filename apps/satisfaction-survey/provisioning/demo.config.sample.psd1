# @generated_by_model: claude-opus-5-5
# @generated_at: 2026-10-24T14:30:00Z
# @agent_roles: IDE Agent + engineering-devops-automator
# @vision_command: start_sprint --sprint 1
# @sprint_number: 1
#
# Plantilla de configuración. Copia este archivo como demo.config.local.psd1
# (excluido de Git) y completa los valores de tu tenant.
@{
    # URL raíz de SharePoint de tu tenant (sin barra final).
    TenantUrl       = 'https://bajaworks.sharepoint.com'

    # Opcional: Id del tenant (GUID). Si lo dejas vacío, se obtiene con Get-PnPTenantId.
    TenantId        = 'ce04f670-da51-4c80-8fe0-2e614d55502c'

    # Sitio de comunicación de la demo → https://<tenant>.sharepoint.com/sites/<SiteAlias>
    SiteAlias       = 'encuestas'
    SiteTitle       = 'Encuestas de Satisfacción'
    SiteDescription = 'Encuestas de satisfacción del soporte técnico (demo de Copilot UX components).'
    Lcid            = 3082   # Español

    # Lista y prefijo de columnas. Deben coincidir con src/shared/config/settings.ts y fields.ts.
    ListTitle       = 'Encuestas'
    FieldPrefix     = 'm365live_'

    # Técnicos de los datos de ejemplo, en orden T1…T6 (mínimo 3).
    # Deben existir en Entra ID; pueden ser usuarios SIN licencia.
    #   T1 Comunicación alta, Rapidez baja (protagonista del guion)
    #   T2 Excelente en todo
    #   T3 Mejora mes a mes
    #   T4 Habilidad alta, Comunicación baja
    #   T5 Regular
    #   T6 Solo 3 respuestas ("datos insuficientes")
    Technicians     = @(
        'ana.lopez@contoso.com'
        'sofia.herrera@contoso.com'
        'luis.ramirez@contoso.com'
        'diego.torres@contoso.com'
        'carmen.vega@contoso.com'
        'jorge.mendoza@contoso.com'
    )
}
