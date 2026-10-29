/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T17:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id T-005
 */
import type { ICopilotComponentHostContext, SPCopilotDisplayMode } from '@microsoft/sp-copilot-component';
import type { Period } from '../../../shared/model/survey';
import type { IPeopleService } from '../../../shared/services/PeopleService';
import type { SurveyRepository } from '../../../shared/services/SurveyRepository';

export type IScorecardStrings = ITechnicianScorecardCopilotComponentStrings;

export interface IScorecardServices {
  siteUrl: string;
  repository: SurveyRepository;
  people: IPeopleService;
}

export interface ITechnicianScorecardProps {
  /** Tool arguments (technician may be missing). */
  technician?: string;
  period: Period;
  /** Changes on every new tool invocation → the view resets. */
  invocationKey: string;

  services?: IScorecardServices;
  initError?: unknown;
  siteUrl: string;
  onRetryInit: () => void;

  hostContext: ICopilotComponentHostContext;
  targetDocument: Document | undefined;
  strings: IScorecardStrings;
  locale?: string;

  onRequestDisplayMode: (mode: SPCopilotDisplayMode) => Promise<void>;
  onModelContext: (text: string, structured: { [key: string]: unknown }) => Promise<void>;
  onContentHeight: (height: number) => void;
}
