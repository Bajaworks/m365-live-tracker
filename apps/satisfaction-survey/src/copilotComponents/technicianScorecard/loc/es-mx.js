/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T17:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id T-009
 */
define([], function () {
  return {
    Title: 'Desempeño de {0}',
    Loading: 'Cargando…',
    PeriodMonth: 'Último mes',
    PeriodQuarter: 'Últimos 3 meses',
    PeriodSemester: 'Últimos 6 meses',
    PeriodAll: 'Todo el historial',
    PeriodLabel: 'Periodo',
    Responses: '{0} encuestas',
    ResponsesShort: 'encuestas',
    Overall: 'Calificación general',
    OutOf5: 'de 5',
    ResolvedTitle: 'Problema resuelto',
    ResolvedYes: 'Sí',
    ResolvedPartial: 'Parcialmente',
    ResolvedNo: 'No',
    RecommendTitle: 'Lo recomendarían',
    Strongest: 'Su fortaleza',
    Weakest: 'Puede mejorar',
    ViewDetail: 'Ver detalle',

    Insufficient: 'Datos insuficientes',
    InsufficientBody: 'Solo hay {0} encuesta(s) en este periodo; se necesitan al menos {1} para mostrar resultados confiables.',
    ShowAllHistory: 'Ver todo el historial',

    DistributionTitle: 'Distribución de respuestas',
    DistributionSegment: '{0} respuesta(s) con {1} ({2}) · {3}%',
    TrendTitle: 'Tendencia mensual',
    ShowTable: 'Ver como tabla',
    ShowChart: 'Ver gráfica',
    Month: 'Mes',
    CommentsTitle: 'Comentarios recientes',
    NoComments: 'No hay comentarios en este periodo.',
    LowBadge: 'Calificación baja',

    NotFoundTitle: 'No encontré encuestas para "{0}".',
    AmbiguousTitle: 'Encontré varios técnicos para "{0}". ¿A quién te refieres?',
    MissingTitle: '¿De qué técnico quieres ver el desempeño?',
    PickHint: 'Técnicos con encuestas registradas:',
    NoTechnicians: 'Todavía no hay encuestas registradas.',

    DemoBadge: 'Datos de demostración (sin conexión)',
    DemoBody: 'No pude leer la lista de encuestas ({0}). Se muestran datos de ejemplo.',
    Retry: 'Reintentar',
    ErrNotFound: 'no encontré la lista en {0}',
    ErrForbidden: 'sin permiso para leer la lista',
    ErrNetwork: 'problema de conexión',
    ErrGeneric: 'error {0}',

    DimUnderstanding: 'Comprensión',
    DimSpeed: 'Rapidez',
    DimSkill: 'Habilidad',
    DimCommunication: 'Comunicación',
    Scale1: 'Muy malo',
    Scale2: 'Malo',
    Scale3: 'Regular',
    Scale4: 'Bueno',
    Scale5: 'Excelente',

    ModelContextSummary:
      'El tablero muestra el desempeño de {0} ({1}): {2} encuestas. Calificación general {3} de 5. Comprensión {4}, Rapidez {5}, Habilidad {6}, Comunicación {7}. Problema resuelto en el {8}% de los casos; lo recomendarían el {9}%. Fortaleza: {10}. Puede mejorar: {11}.',
    ModelContextInsufficient:
      'El tablero de {0} ({1}) tiene solo {2} encuesta(s): datos insuficientes, no se muestran promedios.',
    ModelContextDemo: ' Atención: son datos de demostración, no reales, porque no se pudo leer la lista.'
  };
});
