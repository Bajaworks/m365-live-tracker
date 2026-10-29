/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T14:30:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id T-013
 */
import { COMMENT_MAX_LENGTH, LOW_SCORE_THRESHOLD, TICKET_MAX_LENGTH } from '../config/settings';
import { DIMENSION_KEYS, type DimensionKey, type ISurveyDraft } from '../model/survey';

export type SurveyFieldKey = 'ticketNumber' | 'technician' | 'resolved' | DimensionKey | 'wouldRecommend' | 'comments';

/** Error codes; the UI maps them to localized messages. */
export type ValidationErrorCode = 'required' | 'tooLong' | 'commentRequired';

export interface ISurveyValidationResult {
  valid: boolean;
  errors: Partial<Record<SurveyFieldKey, ValidationErrorCode>>;
  /** Whether the comment is mandatory for the current answers. */
  commentRequired: boolean;
}

/**
 * The comment becomes mandatory when the issue was not fully resolved or when
 * any dimension is low (≤ LOW_SCORE_THRESHOLD).
 */
export function isCommentRequired(draft: ISurveyDraft): boolean {
  if (draft.resolved !== undefined && draft.resolved !== 'Sí') {
    return true;
  }
  return DIMENSION_KEYS.some((key) => {
    const score: number | undefined = draft.scores[key];
    return score !== undefined && score <= LOW_SCORE_THRESHOLD;
  });
}

export function validateSurvey(draft: ISurveyDraft): ISurveyValidationResult {
  const errors: Partial<Record<SurveyFieldKey, ValidationErrorCode>> = {};
  const ticket: string = (draft.ticketNumber || '').trim();

  if (ticket.length === 0) {
    errors.ticketNumber = 'required';
  } else if (ticket.length > TICKET_MAX_LENGTH) {
    errors.ticketNumber = 'tooLong';
  }

  if (!draft.technician || !draft.technician.email) {
    errors.technician = 'required';
  }

  if (draft.resolved === undefined) {
    errors.resolved = 'required';
  }

  DIMENSION_KEYS.forEach((key) => {
    if (draft.scores[key] === undefined) {
      errors[key] = 'required';
    }
  });

  if (draft.wouldRecommend === undefined) {
    errors.wouldRecommend = 'required';
  }

  const commentRequired: boolean = isCommentRequired(draft);
  const comment: string = (draft.comments || '').trim();
  if (comment.length > COMMENT_MAX_LENGTH) {
    errors.comments = 'tooLong';
  } else if (commentRequired && comment.length === 0) {
    errors.comments = 'commentRequired';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    commentRequired
  };
}
