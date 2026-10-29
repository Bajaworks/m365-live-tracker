/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T16:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer + engineering-ai-engineer
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id T-008
 */
import type { ICopilotSurveyStrings, ISurveyAnswer } from './ISatisfactionSurveyFormProps';
import { format } from '../../../shared/logic/text';
import type { ValidationErrorCode } from '../../../shared/logic/validation';
import type { RecommendValue, ResolvedValue } from '../../../shared/model/survey';
import { SurveyRepositoryError } from '../../../shared/services/SurveyRepository';

export function resolvedLabel(value: ResolvedValue, strings: ICopilotSurveyStrings): string {
  return value === 'Sí' ? strings.ResolvedYes : value === 'Parcialmente' ? strings.ResolvedPartial : strings.ResolvedNo;
}

export function recommendLabel(value: RecommendValue, strings: ICopilotSurveyStrings): string {
  return value === 'Sí' ? strings.RecommendYes : value === 'No' ? strings.RecommendNo : strings.RecommendUnsure;
}

export function validationMessage(code: ValidationErrorCode | undefined, strings: ICopilotSurveyStrings): string | undefined {
  if (code === 'required') {
    return strings.ErrRequired;
  }
  if (code === 'tooLong') {
    return strings.ErrTooLong;
  }
  if (code === 'commentRequired') {
    return strings.ErrCommentRequired;
  }
  return undefined;
}

/** Any error → a sentence the user can act on. */
export function errorMessage(error: unknown, strings: ICopilotSurveyStrings, siteUrl: string): string {
  if (error instanceof SurveyRepositoryError) {
    switch (error.code) {
      case 'notFound':
        return format(strings.ErrNotFound, siteUrl);
      case 'forbidden':
        return strings.ErrForbidden;
      case 'network':
        return strings.ErrNetwork;
      default:
        return format(strings.ErrGeneric, error.status || error.code);
    }
  }
  return format(strings.ErrGeneric, error instanceof Error ? error.message : String(error));
}

export interface IModelContext {
  text: string;
  structured: { [key: string]: unknown };
}

/**
 * What Copilot is told after a submission (updateModelContextAsync), so the
 * agent can confirm with real data instead of guessing.
 */
export function submittedContext(answer: ISurveyAnswer, strings: ICopilotSurveyStrings): IModelContext {
  return {
    text: format(
      strings.ModelContextSubmitted,
      answer.ticketNumber,
      answer.technician.displayName,
      resolvedLabel(answer.resolved, strings),
      answer.scores.Understanding,
      answer.scores.Speed,
      answer.scores.Skill,
      answer.scores.Communication,
      recommendLabel(answer.wouldRecommend, strings)
    ),
    structured: {
      event: 'surveySubmitted',
      ticketNumber: answer.ticketNumber,
      technician: answer.technician.displayName,
      resolved: answer.resolved,
      scores: answer.scores,
      wouldRecommend: answer.wouldRecommend
    }
  };
}

export function existingContext(answer: ISurveyAnswer, strings: ICopilotSurveyStrings): IModelContext {
  return {
    text: format(strings.ModelContextExisting, answer.ticketNumber, answer.technician.displayName),
    structured: { event: 'surveyAlreadyAnswered', ticketNumber: answer.ticketNumber, technician: answer.technician.displayName }
  };
}
