/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T14:30:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id T-010
 */

/**
 * Server-relative path of the site that holds the "Encuestas" list.
 *
 * Inside Microsoft 365 Copilot there is no current SharePoint page: the ambient
 * web is the tenant ROOT, so only its origin is used. This compiled-in default
 * can be overridden at runtime with the SITE_STORAGE_ENTITY tenant property.
 */
export const DEFAULT_SITE_PATH: string = '/sites/encuestas';

/** Tenant property (app catalog storage entity) that overrides DEFAULT_SITE_PATH. */
export const SITE_STORAGE_ENTITY: string = 'SatisfactionSurveySite';

/** Title of the survey list. */
export const SURVEY_LIST_TITLE: string = 'Encuestas';

/** Fewer responses than this in a period → "datos insuficientes". */
export const MIN_RESPONSES: number = 5;

/** A dimension score at or below this value is "low" (forces a comment). */
export const LOW_SCORE_THRESHOLD: number = 2;

/** Maximum length of the comment. */
export const COMMENT_MAX_LENGTH: number = 2000;

/** Maximum length of the ticket number. */
export const TICKET_MAX_LENGTH: number = 50;

/** How many recent comments the scorecard shows. */
export const RECENT_COMMENTS: number = 5;
