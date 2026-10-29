/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T16:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id T-006
 */
declare interface ISatisfactionSurveyFormCopilotComponentStrings {
  Title: string;
  Subtitle: string;
  Loading: string;

  TicketLabel: string;
  TicketPlaceholder: string;
  TechnicianLabel: string;
  TechnicianPlaceholder: string;
  TechnicianSearching: string;
  TechnicianNoResults: string;
  TechnicianChange: string;

  ResolvedQuestion: string;
  ResolvedYes: string;
  ResolvedPartial: string;
  ResolvedNo: string;

  RatingTitle: string;
  RatingHint: string;
  Scale1: string;
  Scale2: string;
  Scale3: string;
  Scale4: string;
  Scale5: string;
  PointLabel: string;
  OutOf5: string;
  DimUnderstanding: string;
  QUnderstanding: string;
  DimSpeed: string;
  QSpeed: string;
  DimSkill: string;
  QSkill: string;
  DimCommunication: string;
  QCommunication: string;

  RecommendQuestion: string;
  RecommendYes: string;
  RecommendNo: string;
  RecommendUnsure: string;

  CommentOptionalLabel: string;
  CommentRequiredLabel: string;
  CommentRequiredHint: string;
  CommentPlaceholder: string;

  Submit: string;
  Submitting: string;
  MissingFields: string;
  ErrRequired: string;
  ErrTooLong: string;
  ErrCommentRequired: string;

  SuccessTitle: string;
  SuccessBody: string;
  ExistingTitle: string;
  ExistingBody: string;
  SummaryTicket: string;
  SummaryResolved: string;
  SummaryRecommend: string;
  SummaryComment: string;
  ViewScorecard: string;
  FollowUpScorecard: string;
  RateAnother: string;

  ErrNotFound: string;
  ErrForbidden: string;
  ErrNetwork: string;
  ErrGeneric: string;
  Retry: string;

  ModelContextSubmitted: string;
  ModelContextExisting: string;
}

declare module 'SatisfactionSurveyFormCopilotComponentStrings' {
  const strings: ISatisfactionSurveyFormCopilotComponentStrings;
  export = strings;
}
