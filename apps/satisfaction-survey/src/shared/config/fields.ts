/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T14:30:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id T-010
 */

/**
 * Internal names of the "Encuestas" list columns.
 *
 * Every custom column carries the `m365live_` prefix so it never collides with
 * system columns (Title, Created, Author) or other site columns. The rest of the
 * code uses the logical keys below; to change the prefix, edit FIELD_PREFIX here
 * and `FieldPrefix` in provisioning/demo.config.local.psd1.
 */
export const FIELD_PREFIX: string = 'm365live_';

export const FIELDS = {
  /** System column, shown as "Ticket #". */
  ticket: 'Title',
  /** Person column. Read with $expand; written as `${technician}Id`. */
  technician: `${FIELD_PREFIX}Technician`,
  resolved: `${FIELD_PREFIX}Resolved`,
  Understanding: `${FIELD_PREFIX}Understanding`,
  Speed: `${FIELD_PREFIX}Speed`,
  Skill: `${FIELD_PREFIX}Skill`,
  Communication: `${FIELD_PREFIX}Communication`,
  wouldRecommend: `${FIELD_PREFIX}WouldRecommend`,
  comments: `${FIELD_PREFIX}Comments`,
  isSample: `${FIELD_PREFIX}IsSample`,
  created: 'Created',
  author: 'Author'
} as const;

/** REST property used to write the person column (site user Id). */
export const TECHNICIAN_ID_FIELD: string = `${FIELDS.technician}Id`;
