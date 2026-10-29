/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T16:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id T-006
 */
define([], function () {
  return {
    Title: 'Encuesta de satisfacción',
    Subtitle: 'Tu opinión nos ayuda a mejorar el soporte. Toma menos de un minuto.',
    Loading: 'Cargando…',

    TicketLabel: 'Ticket #',
    TicketPlaceholder: 'p. ej. 4521',
    TechnicianLabel: 'Técnico que te atendió',
    TechnicianPlaceholder: 'Busca por nombre o correo',
    TechnicianSearching: 'Buscando…',
    TechnicianNoResults: 'Sin resultados',
    TechnicianChange: 'Cambiar',

    ResolvedQuestion: '¿Se resolvió tu problema?',
    ResolvedYes: 'Sí',
    ResolvedPartial: 'Parcialmente',
    ResolvedNo: 'No',

    RatingTitle: 'Califica la atención',
    RatingHint: '1 = Muy malo · 5 = Excelente',
    Scale1: 'Muy malo',
    Scale2: 'Malo',
    Scale3: 'Regular',
    Scale4: 'Bueno',
    Scale5: 'Excelente',
    PointLabel: '{0} de 5, {1}',
    OutOf5: 'de 5',
    DimUnderstanding: 'Comprensión',
    QUnderstanding: '¿Qué tan bien entendió tu problema?',
    DimSpeed: 'Rapidez',
    QSpeed: '¿Qué tan rápido respondió?',
    DimSkill: 'Habilidad',
    QSkill: '¿Qué tanta habilidad técnica mostró para resolverlo?',
    DimCommunication: 'Comunicación',
    QCommunication: '¿Qué tan clara fue la comunicación?',

    RecommendQuestion: '¿Recomendarías este soporte a un compañero?',
    RecommendYes: 'Sí',
    RecommendNo: 'No',
    RecommendUnsure: 'No estoy seguro',

    CommentOptionalLabel: 'Comentarios (opcional)',
    CommentRequiredLabel: '¿Qué pudimos hacer mejor?',
    CommentRequiredHint: 'Es obligatorio cuando el problema no se resolvió del todo o alguna calificación es baja.',
    CommentPlaceholder: 'Cuéntanos con tus palabras…',

    Submit: 'Enviar encuesta',
    Submitting: 'Enviando…',
    MissingFields: 'Faltan {0} respuesta(s) para poder enviar.',
    ErrRequired: 'Responde esta pregunta.',
    ErrTooLong: 'El texto es demasiado largo.',
    ErrCommentRequired: 'Cuéntanos qué pudimos hacer mejor.',

    SuccessTitle: '¡Gracias! Tu encuesta se guardó.',
    SuccessBody: 'Tus respuestas ayudan a {0} y al equipo de soporte a mejorar.',
    ExistingTitle: 'Ya respondiste la encuesta de este ticket.',
    ExistingBody: 'Esta es la respuesta que enviaste. Si necesitas cambiarla, avisa al equipo de soporte.',
    SummaryTicket: 'Ticket #{0}',
    SummaryResolved: 'Resuelto: {0}',
    SummaryRecommend: 'Recomendaría: {0}',
    SummaryComment: 'Comentario',
    ViewScorecard: 'Ver desempeño de {0}',
    FollowUpScorecard: '¿Cómo va el desempeño de {0}?',
    RateAnother: 'Calificar otro ticket',

    ErrNotFound: 'No encontré la lista de encuestas en {0}. ¿Ya se ejecutó el aprovisionamiento?',
    ErrForbidden: 'No tienes permiso para responder encuestas en este sitio.',
    ErrNetwork: 'Hubo un problema de conexión con SharePoint.',
    ErrGeneric: 'Algo salió mal ({0}).',
    Retry: 'Reintentar',

    ModelContextSubmitted:
      'El usuario envió la encuesta de satisfacción del ticket {0} sobre la atención de {1}. Resultado: {2}. Comprensión {3}, Rapidez {4}, Habilidad {5}, Comunicación {6} (de 5). Recomendaría el soporte: {7}. La encuesta quedó guardada.',
    ModelContextExisting:
      'El usuario ya había respondido la encuesta del ticket {0} sobre la atención de {1}; el formulario muestra esa respuesta y no se guardó nada nuevo.'
  };
});
