/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T16:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id T-004
 */
import type { ICopilotComponentHostContext } from '@microsoft/sp-copilot-component';
import type { DimensionKey, ICurrentUser, IPerson, RecommendValue, ResolvedValue, Score } from '../../../shared/model/survey';
import type { IPeopleService } from '../../../shared/services/PeopleService';
import type { SurveyRepository } from '../../../shared/services/SurveyRepository';

/** Localized strings (declared in loc/mystrings.d.ts). */
export type ICopilotSurveyStrings = ISatisfactionSurveyFormCopilotComponentStrings;

/** A complete answer, as shown in the confirmation / read-only view. */
export interface ISurveyAnswer {
  ticketNumber: string;
  technician: IPerson;
  resolved: ResolvedValue;
  scores: Record<DimensionKey, Score>;
  wouldRecommend: RecommendValue;
  comments?: string;
}

/** Services built once by the component class (site resolved, user known). */
export interface ISurveyServices {
  siteUrl: string;
  repository: SurveyRepository;
  people: IPeopleService;
  currentUser: ICurrentUser;
}

export interface ISatisfactionSurveyFormProps {
  /** Tool arguments from Copilot (may be empty). */
  initialTicket?: string;
  initialTechnician?: string;
  /** Changes on every new tool invocation → the form resets. */
  invocationKey: string;

  /** Undefined while loading or when initialization failed. */
  services?: ISurveyServices;
  initError?: unknown;
  /** URL the component tried to use (for error messages). */
  siteUrl: string;
  onRetryInit: () => void;

  hostContext: ICopilotComponentHostContext;
  targetDocument: Document | undefined;
  strings: ICopilotSurveyStrings;
  locale?: string;

  /** Sends a message to the chat on behalf of the user. */
  onFollowUp: (text: string) => Promise<void>;
  /** Tells the model what happened (does not trigger a reply). */
  onModelContext: (text: string, structured: { [key: string]: unknown }) => Promise<void>;
  /** Reports the content height so the host can size the inline card. */
  onContentHeight: (height: number) => void;
}
